// localStorage에 수집한 동물을 저장·불러오는 진행 관리자
import { animals, collectedIdAliases } from "../data/animals.js";
import { aroundMission } from "../data/missions.js";

/** 구버전과 같은 키를 써서 진행도를 이어받을 수 있습니다 */
export const STORAGE_KEY = "animal-encyclopedia-collected-v1";
export const REGION_CLEAR_KEY = "animal-encyclopedia-region-clear-v1";

const validIds = new Set(animals.map((a) => a.id));

function safeParseIds(raw) {
  try {
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((id) => collectedIdAliases[id] || id)
      .filter((id) => validIds.has(id));
  } catch {
    return [];
  }
}

function safeGetItem(key) {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    if (typeof localStorage === "undefined") return false;
    localStorage.setItem(key, value);
    return true;
  } catch {
    console.warn("진행 기록을 저장할 수 없어요.");
    return false;
  }
}

/** 수집한 동물 id 목록을 읽습니다 */
export function readCollected() {
  return safeParseIds(safeGetItem(STORAGE_KEY));
}

/** 수집 목록을 저장합니다 */
export function saveCollected(ids) {
  const unique = [...new Set(ids)].filter((id) => validIds.has(id));
  safeSet(STORAGE_KEY, JSON.stringify(unique));
  return unique;
}

/** 동물을 도감에 등록합니다 */
export function collectAnimal(animalId) {
  const current = new Set(readCollected());
  current.add(animalId);
  return saveCollected([...current]);
}

/** 이미 수집했는지 확인합니다 */
export function isCollected(animalId) {
  return readCollected().includes(animalId);
}

/** around 지역 클리어 여부 */
export function isRegionCleared(regionId = aroundMission.id) {
  try {
    const data = JSON.parse(safeGetItem(REGION_CLEAR_KEY) || "{}");
    return Boolean(data[regionId]);
  } catch {
    return false;
  }
}

/** 지역 클리어 표시를 저장합니다 */
export function markRegionCleared(regionId = aroundMission.id) {
  try {
    const data = JSON.parse(safeGetItem(REGION_CLEAR_KEY) || "{}");
    data[regionId] = true;
    safeSet(REGION_CLEAR_KEY, JSON.stringify(data));
  } catch {
    safeSet(REGION_CLEAR_KEY, JSON.stringify({ [regionId]: true }));
  }
}

/**
 * 스폰 목표(4마리)를 모두 모았는지 확인합니다.
 * 클리어 연출은 한 번만 보여 주기 위해 저장 플래그와 함께 씁니다.
 */
export function checkAroundClear() {
  const collected = new Set(readCollected());
  const got = aroundMission.spawnAnimalIds.filter((id) => collected.has(id));
  const complete = got.length >= aroundMission.clearTarget;
  const alreadyShown = isRegionCleared(aroundMission.id);
  return {
    complete,
    count: got.length,
    target: aroundMission.clearTarget,
    shouldCelebrate: complete && !alreadyShown
  };
}

export const ProgressStore = {
  STORAGE_KEY,
  readCollected,
  saveCollected,
  collectAnimal,
  isCollected,
  isRegionCleared,
  markRegionCleared,
  checkAroundClear
};

export default ProgressStore;
