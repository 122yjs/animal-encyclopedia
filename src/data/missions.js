// 우리 주변(around) 지역 미션 — 수직 슬라이스용 (4마리 스폰)
import { getAnimalsByCategory } from "./animals.js";

/** 지역 미션 정의 */
export const aroundMission = {
  id: "around",
  label: "우리 주변",
  title: "우리 주변 지역 미션",
  description: "학교와 마을에서 만날 수 있는 동물을 먼저 살펴봅니다.",
  animalIds: ["무당벌레", "달팽이", "고양이", "거미", "박새", "꿀벌", "개", "지렁이"],
  spawnAnimalIds: ["무당벌레", "달팽이", "고양이", "거미"],
  clearTarget: 4
};

/**
 * 오버월드 스폰 좌표 (타일 단위, TILE=32 기준)
 * 맵 크기: 30×22 타일 — 구역별로 뚜렷한 관찰 포인트
 *  - 무당벌레: 서쪽 꽃밭
 *  - 달팽이: 동쪽 연못 근처 그늘
 *  - 고양이: 남쪽 마을 길
 *  - 거미: 남동쪽 나무/울타리 구석
 */
export const spawnPoints = [
  {
    animalId: "무당벌레",
    tileX: 6,
    tileY: 5,
    zone: "꽃밭",
    tip: "풀밭과 나뭇잎을 살펴보세요"
  },
  {
    animalId: "달팽이",
    tileX: 22,
    tileY: 9,
    zone: "연못 그늘",
    tip: "축축한 그늘을 살펴보세요"
  },
  {
    animalId: "고양이",
    tileX: 8,
    tileY: 16,
    zone: "마을 길",
    tip: "집 주변 길을 살펴보세요"
  },
  {
    animalId: "거미",
    tileX: 22,
    tileY: 17,
    zone: "울타리 구석",
    tip: "나무와 벽 근처를 살펴보세요"
  }
];

/** 스폰 대상 동물 객체 목록 */
export function getSpawnAnimals() {
  const around = getAnimalsByCategory("around");
  return aroundMission.spawnAnimalIds
    .map((id) => around.find((a) => a.id === id))
    .filter(Boolean);
}
