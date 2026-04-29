#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const appPath = path.join(rootDir, "app.js");
const imagesDir = path.join(rootDir, "images");
const thumbsPublicDir = "images/thumbs";
const detailsPublicDir = "images/details";
const thumbsDir = path.join(imagesDir, "thumbs");
const detailsDir = path.join(imagesDir, "details");
const manifestPath = path.join(imagesDir, "manifest.json");

const imageSizes = {
  thumb: { width: 200, directory: thumbsDir, publicDirectory: thumbsPublicDir },
  detail: { width: 600, directory: detailsDir, publicDirectory: detailsPublicDir }
};

function parseImageSources(appJs) {
  const match = appJs.match(/const imageSources = \{([\s\S]*?)\n\};/);
  if (!match) throw new Error("Could not find imageSources in app.js");

  const sources = new Map();
  const entryPattern = /\s*"([^"]+)":\s*"([^"]+)"/g;
  let entry;
  while ((entry = entryPattern.exec(match[1])) !== null) {
    sources.set(entry[1], entry[2]);
  }
  return sources;
}

function parseWiki(rawWiki) {
  const trimmed = rawWiki.trim();
  const stringMatch = trimmed.match(/^"([^"]+)"$/);
  if (stringMatch) return { title: stringMatch[1], lang: "ko" };

  const objectMatch = trimmed.match(/^\{\s*title:\s*"([^"]+)",\s*lang:\s*"([^"]+)"\s*\}$/);
  if (objectMatch) return { title: objectMatch[1], lang: objectMatch[2] };

  throw new Error(`Unsupported wiki field: ${rawWiki}`);
}

function parseAnimals(appJs) {
  const animalPattern = /^\s*makeAnimal\("([^"]+)",\s*("[^"]+"|\{\s*title:\s*"[^"]+",\s*lang:\s*"[^"]+"\s*\})/gm;
  const imageSources = parseImageSources(appJs);
  const animals = [];
  let match;

  while ((match = animalPattern.exec(appJs)) !== null) {
    animals.push({
      name: match[1],
      wiki: parseWiki(match[2]),
      image: imageSources.get(match[1]) || ""
    });
  }

  if (!animals.length) throw new Error("Could not find animal records in app.js");
  return animals;
}

function getExtension(contentType, url) {
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("avif")) return ".avif";
  if (contentType.includes("gif")) return ".gif";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return ".jpg";

  const pathname = new URL(url).pathname.toLowerCase();
  const match = pathname.match(/\.(jpe?g|png|webp|avif|gif)(?:$|[/?#])/);
  return match ? `.${match[1].replace("jpeg", "jpg")}` : ".jpg";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resizeWikimediaImageUrl(url, width) {
  const parsed = new URL(url);
  if (!parsed.hostname.endsWith("wikimedia.org")) return url;

  const segments = parsed.pathname.split("/");
  const last = segments[segments.length - 1];
  if (/^\d+px-/.test(last)) {
    segments[segments.length - 1] = last.replace(/^\d+px-/, `${width}px-`);
    parsed.pathname = segments.join("/");
    return parsed.toString();
  }

  return url;
}

async function lookupWikipediaImage(animal) {
  const url = `https://${animal.wiki.lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(animal.wiki.title)}`;
  const response = await fetch(url, { headers: { "user-agent": "science-animal-image-bundler/1.0" } });
  if (!response.ok) throw new Error(`Wikipedia lookup failed for ${animal.name}: ${response.status}`);
  const data = await response.json();
  return data.thumbnail?.source || data.originalimage?.source || "";
}

async function download(url, outputBasePath, attempt = 1) {
  const response = await fetch(url, { headers: { "user-agent": "science-animal-image-bundler/1.0" } });
  if (!response.ok) {
    if (response.status === 429 && attempt < 4) {
      await sleep(1500 * attempt);
      return download(url, outputBasePath, attempt + 1);
    }
    throw new Error(`Download failed ${response.status} for ${url}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const extension = getExtension(contentType, url);
  const outputPath = `${outputBasePath}${extension}`;
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return { outputPath, extension, bytes: buffer.length };
}

async function downloadWithFallback(urls, outputBasePath) {
  let lastError;
  for (const url of [...new Set(urls.filter(Boolean))]) {
    try {
      return await download(url, outputBasePath);
    } catch (error) {
      lastError = error;
      console.warn(`Image download fallback: ${error.message}`);
    }
  }
  throw lastError;
}

function publicPath(kind, animalName, extension) {
  return `./${imageSizes[kind].publicDirectory}/${encodeURIComponent(animalName)}${extension}`;
}

async function downloadLocalImages(options = {}) {
  const appJs = fs.readFileSync(options.appPath || appPath, "utf8");
  const animals = parseAnimals(appJs);
  const selectedAnimals = options.limit ? animals.slice(0, options.limit) : animals;
  const manifest = {};

  fs.mkdirSync(thumbsDir, { recursive: true });
  fs.mkdirSync(detailsDir, { recursive: true });

  for (const animal of selectedAnimals) {
    const source = animal.image || await lookupWikipediaImage(animal);
    if (!source) {
      console.warn(`Skipping ${animal.name}: no source image`);
      continue;
    }

    manifest[animal.name] = {};
    for (const [kind, size] of Object.entries(imageSizes)) {
      const resizedUrl = resizeWikimediaImageUrl(source, size.width);
      const outputBasePath = path.join(size.directory, animal.name);
      try {
        const result = await downloadWithFallback([resizedUrl, source], outputBasePath);
        manifest[animal.name][kind] = publicPath(kind, animal.name, result.extension);
        console.log(`${animal.name} ${kind}: ${result.bytes} bytes`);
        await sleep(350);
      } catch (error) {
        console.warn(`Skipping ${animal.name} ${kind}: ${error.message}`);
      }
    }
    if (!manifest[animal.name].thumb && !manifest[animal.name].detail) delete manifest[animal.name];
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Wrote ${path.relative(rootDir, manifestPath)} with ${Object.keys(manifest).length} animals`);
  return manifest;
}

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    if (arg.startsWith("--limit=")) args.limit = Number(arg.slice("--limit=".length));
  }
  return args;
}

if (require.main === module) {
  downloadLocalImages(parseArgs(process.argv.slice(2))).catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  downloadLocalImages,
  resizeWikimediaImageUrl
};
