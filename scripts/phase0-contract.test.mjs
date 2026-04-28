import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  index: await readFile(new URL("../index.html", import.meta.url), "utf8"),
  noQuestion: await readFile(new URL("../no-question.html", import.meta.url), "utf8"),
  app: await readFile(new URL("../app.js", import.meta.url), "utf8"),
  styles: await readFile(new URL("../styles.css", import.meta.url), "utf8")
};

const expectedSearchChips = ["날개", "다리", "지느러미", "물속", "땅속", "사막", "알", "털"];

test("both entry points expose grade-friendly search suggestion chips", () => {
  for (const [name, html] of Object.entries({ index: files.index, noQuestion: files.noQuestion })) {
    assert.match(html, /id="searchChips"/, `${name} should include the search chip container`);
    for (const chip of expectedSearchChips) {
      assert.match(html, new RegExp(`data-search-chip="${chip}"`), `${name} should include ${chip} chip`);
    }
  }
});

test("search chips are wired to the existing debounced catalog render flow", () => {
  assert.match(files.app, /searchChips:\s*document\.querySelector/, "app should cache the search chip container");
  assert.match(files.app, /data-search-chip/, "app should bind search chip clicks");
  assert.match(files.app, /debouncedRenderAnimals\(\)/, "chip clicks should reuse debounced catalog rendering");
});

test("no-question entry point has no student-visible question-room settings copy", () => {
  assert.doesNotMatch(files.noQuestion, /질문방|MagicSchool|교사용 설정/);
});

test("search chips stay compact on small tablet screens", () => {
  assert.match(files.styles, /\.search-chips/, "styles should define search chips");
  assert.match(files.styles, /@media[^{]+max-width:\s*680px[\s\S]+\.search-chips/, "mobile styles should keep chips compact");
});
