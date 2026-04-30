import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

function read(fileName) {
  return fs.readFileSync(path.join(rootDir, fileName), "utf8");
}

test("entry pages warn students before opening external source links", () => {
  for (const fileName of ["index.html", "no-question.html"]) {
    const html = read(fileName);
    assert.ok(html.includes("사진 출처를 볼까요?"), `${fileName} should show a source confirmation title`);
    assert.ok(html.includes("새 창"), `${fileName} should mention the new window before leaving`);
    assert.ok(html.includes("도감으로 돌아오려면 새 창을 닫으면 됩니다"), `${fileName} should explain how to return`);
    assert.ok(html.includes("도감에 있을래요"), `${fileName} should offer a stay-in-app option`);
  }
});

test("reset control is worded for shared classroom tablets", () => {
  for (const fileName of ["index.html", "no-question.html"]) {
    const html = read(fileName);
    assert.ok(html.includes("수업 기록 초기화"), `${fileName} should use teacher-friendly reset label`);
  }

  const appJs = read("app.js");
  assert.ok(appJs.includes("공용 태블릿"));
  assert.ok(appJs.includes("다음 반 수업을 위해"));
});

test("sidebar lede is ready for dynamic total count text", () => {
  for (const fileName of ["index.html", "no-question.html"]) {
    const html = read(fileName);
    assert.ok(html.includes('class="sidebar-lede"'), `${fileName} should keep the sidebar lede anchor`);
    assert.equal(html.includes("54마리의 카드를 모아보세요"), false, `${fileName} should not hardcode 54 cards`);
  }

  const appJs = read("app.js");
  assert.ok(appJs.includes("function updateSidebarLede()"));
  assert.ok(appJs.includes("els.sidebarLede.textContent = `동물을 관찰하고 퀴즈 몬스터볼을 던져 ${getProgramTotal()}마리의 카드를 모아보세요!"));
});
