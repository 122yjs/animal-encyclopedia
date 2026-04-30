const filters = [
  { id: "all", label: "전체", icon: "🔍" },
  { id: "around", label: "우리 주변", icon: "🏠" },
  { id: "land", label: "땅", icon: "🦎" },
  { id: "freshwater", label: "강·호수", icon: "💧" },
  { id: "sea", label: "바다", icon: "🌊" },
  { id: "special", label: "특별한 환경", icon: "❄️" }
];

const criteria = [
  { id: "hasLegs", label: "다리가 있는가?" },
  { id: "hasWings", label: "날개가 있는가?" },
  { id: "hasFins", label: "지느러미가 있는가?" },
  { id: "inWater", label: "물에서 사는가?" },
  { id: "crawls", label: "기어서 이동하는가?" }
];

const defaultMissionSelections = [
  {
    id: "around",
    label: "우리 주변",
    title: "우리 주변 지역 미션",
    description: "학교와 마을에서 만날 수 있는 동물을 먼저 살펴봅니다.",
    animalIds: ["무당벌레", "달팽이", "고양이", "거미", "박새", "꿀벌", "개", "지렁이"]
  },
  {
    id: "freshwater",
    label: "강·호수",
    title: "강·호수 지역 미션",
    description: "물가, 강, 호수, 바다 동물의 몸과 움직임을 비교합니다.",
    animalIds: ["붕어", "수달", "다슬기", "송사리", "메기", "개구리", "청둥오리", "물방개"]
  },
  {
    id: "land",
    label: "땅",
    title: "땅 지역 미션",
    description: "땅에서 사는 동물의 다리, 몸, 움직임을 비교합니다.",
    animalIds: ["나비", "참새", "토끼", "호랑이", "뱀", "개미", "노루", "딱따구리"]
  },
  {
    id: "sea",
    label: "바다",
    title: "바다 지역 미션",
    description: "바다와 갯벌 동물의 몸 구조와 이동 방법을 살펴봅니다.",
    animalIds: ["갈매기", "조개", "게", "소라", "돌돔", "해삼", "돌고래", "해마"]
  },
  {
    id: "special",
    label: "특별한 환경",
    title: "특별한 환경 지역 미션",
    description: "사막, 극지방, 높은 산처럼 특별한 환경에 알맞은 특징을 찾습니다.",
    animalIds: ["낙타", "도루묵도마뱀", "사막여우", "사막 뱀", "사막 딱정벌레", "북극곰", "북극여우", "펭귄"]
  }
];

const defaultAppConfig = {
  localImages: {
    enabled: false
  },
  questionTool: {
    featureEnabled: true,
    enabled: false,
    url: "",
    label: "🐾 더 궁금한 점 물어볼까요?",
    note: "선생님이 준비한 질문 도구가 있으면 함께 이용해 보세요.",
    allowTeacherSettings: true,
    hideTeacherSettingsOnSharedPage: true,
    showWhenDisabled: true
  }
};

const questionToolStorageKey = "animal-encyclopedia-question-url-v1";
const magicRoomTemplateUrl = "https://app.magicschool.ai/magic-student/rooms?room-sharing-id=1a3dc4fb-2391-4d7b-9e77-dfaacddf7a35";
let appConfig = normalizeAppConfig(typeof window === "undefined" ? {} : window.APP_CONFIG);

const imageSources = {
  "무당벌레": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Asian_lady_beetle-%28Harmonia-axyridis%29.jpg/330px-Asian_lady_beetle-%28Harmonia-axyridis%29.jpg",
  "달팽이": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Common_snail.jpg/330px-Common_snail.jpg",
  "고양이": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/960px-Cat03.jpg",
  "거미": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Araneus_diadematus_%28Clerck%2C_1757%29.JPG/960px-Araneus_diadematus_%28Clerck%2C_1757%29.JPG",
  "박새": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Great_tit_%28Parus_major%29%2C_Parc_du_Rouge-Cloitre%2C_For%C3%AAt_de_Soignes%2C_Brussels_%2826194636951%29.jpg/330px-Great_tit_%28Parus_major%29%2C_Parc_du_Rouge-Cloitre%2C_For%C3%AAt_de_Soignes%2C_Brussels_%2826194636951%29.jpg",
  "꿀벌": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bee_on_Geraldton_Wax_Flower.JPG/330px-Bee_on_Geraldton_Wax_Flower.JPG",
  "공벌레": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Armadillidium_vulgare_001.jpg/330px-Armadillidium_vulgare_001.jpg",
  "나비": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Butterfly_macro_shot.jpg/330px-Butterfly_macro_shot.jpg",
  "참새": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Tree_Sparrow_August_2007_Osaka_Japan.jpg/330px-Tree_Sparrow_August_2007_Osaka_Japan.jpg",
  "토끼": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Arctic_Hare.jpg/330px-Arctic_Hare.jpg",
  "호랑이": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Siberian_Tiger_by_Malene_Th.jpg/330px-Siberian_Tiger_by_Malene_Th.jpg",
  "개": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Golde33443.jpg/330px-Golde33443.jpg",
  "붕어": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/CarassiusCarassius8.JPG/330px-CarassiusCarassius8.JPG",
  "지렁이": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Regenwurm1.jpg/330px-Regenwurm1.jpg",
  "뱀": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Grass_snake_%28Natrix_natrix%29_Pieniny.jpg/960px-Grass_snake_%28Natrix_natrix%29_Pieniny.jpg",
  "개미": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Meat_eater_ant_feeding_on_honey02.jpg/330px-Meat_eater_ant_feeding_on_honey02.jpg",
  "노루": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Siberian_roe_deer.jpg/330px-Siberian_roe_deer.jpg",
  "너구리": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Nyctereutes_procyonoides_16072008.jpg/330px-Nyctereutes_procyonoides_16072008.jpg",
  "딱따구리": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Greater_Spotted_Woodpecker_%2841554059345%29.jpg/330px-Greater_Spotted_Woodpecker_%2841554059345%29.jpg",
  "낙타": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/07._Camel_Profile%2C_near_Silverton%2C_NSW%2C_07.07.2007.jpg/330px-07._Camel_Profile%2C_near_Silverton%2C_NSW%2C_07.07.2007.jpg",
  "도루묵도마뱀": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Apothekerskink01.jpg/330px-Apothekerskink01.jpg",
  "북극곰": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Polarb%C3%A4r_12_2004-11-17.jpg/330px-Polarb%C3%A4r_12_2004-11-17.jpg",
  "북극여우": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Arctic_fox_in_snow_%28Unsplash%29.jpg",
  "펭귄": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg/330px-Aptenodytes_forsteri_-Snow_Hill_Island%2C_Antarctica_-adults_and_juvenile-8.jpg",
  "산양": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Adult_male_amur_goral_standing_on_rock_at_National_Institute_of_Ecology%2C_Korea.jpg/330px-Adult_male_amur_goral_standing_on_rock_at_National_Institute_of_Ecology%2C_Korea.jpg",
  "수달": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Fischotter_Lutra_lutra1.jpg/330px-Fischotter_Lutra_lutra1.jpg",
  "다슬기": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Semisulcospira_kurodai2.jpg/330px-Semisulcospira_kurodai2.jpg",
  "송사리": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Nihonmedaka.jpg/330px-Nihonmedaka.jpg",
  "메기": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Silurus.jpg/330px-Silurus.jpg",
  "개구리": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Dark-spotted_Frog_%28Pelophylax_nigromaculatus%29.jpg/960px-Dark-spotted_Frog_%28Pelophylax_nigromaculatus%29.jpg",
  "청둥오리": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg/330px-Anas_platyrhynchos_male_female_quadrat.jpg",
  "조개": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Seashells_in_the_basket.jpg/330px-Seashells_in_the_basket.jpg",
  "소라": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Turbo_cornutus_%28horned_turban_snail%29_2_%2825031884946%29.jpg/330px-Turbo_cornutus_%28horned_turban_snail%29_2_%2825031884946%29.jpg",
  "돌돔": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/K231003%EB%8F%8C%EB%8F%94.jpg/330px-K231003%EB%8F%8C%EB%8F%94.jpg",
  "해삼": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Holothuria_cf_arguinensis.jpg/330px-Holothuria_cf_arguinensis.jpg",
  "돌고래": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/330px-Tursiops_truncatus_01.jpg",
  "오징어": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Loligo_vulgaris.jpg/960px-Loligo_vulgaris.jpg",
  "바다거북": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Hawaii_turtle_2.JPG/330px-Hawaii_turtle_2.JPG",
  "고등어": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Scomber_japonicus.png",
  "해마": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Hippocampus_hippocampus_%28on_Ascophyllum_nodosum%29.jpg/330px-Hippocampus_hippocampus_%28on_Ascophyllum_nodosum%29.jpg"
};

const animals = [
  makeAnimal("무당벌레", "무당벌레", ["around"], "풀밭, 나뭇잎", "다리로 걷고 날개로 날아가요.", ["단단한 겉날개", "작은 다리", "점무늬"], "학교 풀밭에서 볼 수 있는 작은 곤충이에요.", "날개와 다리로 나뭇잎 사이를 옮겨 다녀요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: false, crawls: false }, "38쪽"),
  makeAnimal("달팽이", "달팽이", ["around"], "화단, 축축한 그늘", "배처럼 넓은 발로 천천히 기어가요.", ["껍데기", "촉각", "끈끈한 발"], "우리 주변에서 관찰할 수 있는 동물이에요.", "몸이 마르지 않도록 축축한 곳에서 생활해요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: false, crawls: true }, "38쪽"),
  makeAnimal("고양이", "고양이", ["around"], "집 주변, 마을", "네 다리로 걷거나 뛰어요.", ["털", "수염", "발톱"], "주변에서 자주 볼 수 있는 동물이에요.", "발톱과 수염은 움직이고 주변을 살피는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "38쪽"),
  makeAnimal("거미", "거미", ["around"], "나무, 벽, 풀숲", "여덟 개의 다리로 걸어요.", ["다리 8개", "거미줄", "작은 몸"], "학교 주변에서 볼 수 있는 작은 동물이에요.", "긴 다리와 거미줄을 이용해 먹이를 잡아요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: true }, "39쪽"),
  makeAnimal("박새", { title: "Great_tit", lang: "en" }, ["around"], "나무와 숲", "날개로 날고 다리로 앉아요.", ["날개", "부리", "깃털"], "나무가 있는 곳에서 관찰할 수 있는 새예요.", "깃털과 날개가 있어 나뭇가지 사이를 날아다녀요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: false, crawls: false }, "39쪽"),
  makeAnimal("꿀벌", "꿀벌", ["around"], "꽃이 핀 곳", "날개로 날아다녀요.", ["날개", "다리", "몸의 털"], "우리 주변 꽃밭에서 볼 수 있는 동물이에요.", "꽃가루를 옮기며 꽃 사이를 날아다녀요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: false, crawls: false }, "39쪽"),
  makeAnimal("공벌레", "공벌레", ["around"], "돌 밑, 축축한 흙", "여러 다리로 기어가요.", ["여러 개의 다리", "단단한 몸", "동그랗게 말리는 몸"], "주변의 흙이나 돌 아래에서 볼 수 있어요.", "위험하면 몸을 둥글게 말아 자신을 지켜요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: true }, "39쪽"),
  makeAnimal("개", "개", ["around"], "집 주변, 마을", "네 다리로 걷거나 뛰어요.", ["털", "귀", "코", "발"], "우리 주변에서 자주 볼 수 있는 동물이에요.", "잘 발달한 코와 네 다리는 냄새를 맡고 빠르게 움직이는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "우리 주변"),
  makeAnimal("나비", "나비", ["land"], "풀밭, 꽃밭", "날개로 날아요.", ["큰 날개", "더듬이", "가느다란 다리"], "동물 카드로 생김새를 관찰해요.", "날개가 있어 꽃 사이를 날며 생활해요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: false, crawls: false }, "40쪽"),
  makeAnimal("참새", "참새", ["land"], "나무, 들판, 마을", "날개로 날고 다리로 걸어요.", ["날개", "부리", "다리"], "참새는 다리와 날개가 있는 동물이에요.", "날개가 있어 빠르게 이동하고 부리로 먹이를 먹어요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: false, crawls: false }, "41쪽"),
  makeAnimal("토끼", "토끼", ["land"], "풀밭, 숲 가장자리", "다리로 뛰어 이동해요.", ["털", "긴 귀", "튼튼한 뒷다리"], "토끼는 털로 덮여 있고 다리가 있어요.", "긴 귀와 튼튼한 다리가 주변을 살피고 빠르게 도망치는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "41쪽"),
  makeAnimal("호랑이", "호랑이", ["land"], "숲, 산", "네 다리로 걷고 뛰어요.", ["털", "발톱", "날카로운 이"], "동물 카드에서 생김새를 비교할 수 있어요.", "강한 다리와 발톱으로 땅에서 먹이를 찾아요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "40쪽"),
  makeAnimal("붕어", "붕어", ["freshwater"], "강이나 호수", "지느러미로 헤엄쳐요.", ["지느러미", "비늘", "아가미"], "붕어는 지느러미와 비늘이 있어요.", "지느러미를 이용해 물속에서 헤엄쳐 이동해요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "41쪽, 49쪽"),
  makeAnimal("지렁이", "지렁이", ["around", "land"], "축축한 흙", "다리 없이 기어서 이동해요.", ["긴 몸", "다리 없음", "마디"], "지렁이는 다리가 없는 동물로 분류할 수 있어요.", "축축한 땅속에서 몸을 줄였다 늘이며 움직여요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: false, crawls: true }, "39쪽, 45쪽"),
  makeAnimal("뱀", "뱀", ["land"], "풀숲, 숲, 산", "다리 없이 기어서 이동해요.", ["긴 몸", "비늘", "다리 없음"], "뱀은 다리가 없는 동물로 분류할 수 있어요.", "긴 몸과 비늘이 땅 위를 기어 이동하는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: false, crawls: true }, "40쪽, 45쪽"),
  makeAnimal("개미", "개미", ["land"], "땅, 흙 속", "다리를 이용해 걸어요.", ["다리 6개", "더듬이", "작은 몸"], "개미의 생김새와 이동 방법을 관찰해요.", "작은 몸과 다리로 흙 위와 틈 사이를 잘 다녀요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "44쪽"),
  makeAnimal("다람쥐", "다람쥐", ["land"], "숲, 공원, 나무가 많은 곳", "네 다리로 뛰고 나무를 잘 타요.", ["긴 꼬리", "강한 발톱", "앞니"], "비상 AR 자료에 있는 땅에서 사는 동물 사례예요.", "긴 꼬리와 발톱은 나무 위에서 균형을 잡고 이동하는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "비상 AR"),
  makeAnimal("고라니", "고라니", ["land"], "수풀, 논과 물가 주변", "가늘고 긴 다리로 뛰어다녀요.", ["갈색 털", "긴 다리", "길쭉한 주둥이"], "비상 AR 자료에 있는 땅에서 사는 동물 사례예요.", "긴 다리는 수풀 사이를 빠르게 지나가며 생활하는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "비상 AR"),
  makeAnimal("두더지", { title: "Mole_(animal)", lang: "en" }, ["land"], "땅속", "넓은 앞발로 굴을 파며 움직여요.", ["넓은 앞발", "두꺼운 발톱", "털"], "비상 AR 자료에 있는 땅속 생활 동물 사례예요.", "삽처럼 넓은 앞발과 발톱은 땅속에 굴을 파는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "비상 AR"),
  makeAnimal("부엉이", { title: "Owl", lang: "en" }, ["land"], "숲, 나무가 많은 곳", "날개로 조용히 날아요.", ["큰 눈", "날개", "날카로운 발톱"], "비상 AR 자료에 있는 밤에 활동하는 새 사례예요.", "큰 눈과 날카로운 발톱은 밤에 먹이를 찾고 붙잡는 데 도움을 줘요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: false, crawls: false }, "비상 AR"),
  makeAnimal("노루", "노루", ["land"], "숲, 산기슭", "다리로 걷거나 뛰어요.", ["다리", "털", "큰 귀"], "땅에서 사는 동물의 예예요.", "긴 다리로 숲과 산을 빠르게 이동해요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "45쪽"),
  makeAnimal("너구리", "너구리", ["land"], "숲, 들, 물가 주변", "네 다리로 걸어요.", ["털", "다리", "긴 꼬리"], "땅에서 사는 동물의 예예요.", "다리와 발을 이용해 여러 장소를 돌아다니며 먹이를 찾아요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "45쪽"),
  makeAnimal("딱따구리", "딱따구리", ["land"], "숲의 나무", "날개로 날고 발톱으로 나무에 붙어요.", ["날개", "곧은 부리", "발톱"], "나무에서 사는 새의 생김새와 움직임을 관찰해요.", "단단한 부리와 발톱은 나무에서 먹이를 찾고 생활하는 데 알맞아요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: false, crawls: false }, "45쪽, 비상 AR"),
  makeAnimal("낙타", "낙타", ["special", "land"], "사막", "다리로 걸어요.", ["혹", "긴 다리", "두꺼운 발바닥"], "사막에서 사는 동물의 예예요.", "혹 속 영양분과 넓은 발바닥이 건조한 사막 생활에 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "46쪽"),
  makeAnimal("도루묵도마뱀", "도루묵도마뱀", ["special", "land"], "사막", "모래 위와 속을 빠르게 움직여요.", ["비늘", "짧은 다리", "매끈한 몸"], "사막에서 사는 동물의 예예요.", "뜨거운 낮에는 모래 속에서 생활하며 더위를 피할 수 있어요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: true }, "47쪽"),
  makeAnimal("사막여우", { title: "Fennec_fox", lang: "en" }, ["special", "land"], "사막", "털로 덮인 발로 모래 위를 걸어요.", ["큰 귀", "작은 몸", "털 많은 발바닥"], "비상 AR 자료에 있는 사막 동물 사례예요.", "큰 귀는 더운 사막에서 열을 내보내고, 털 많은 발은 뜨거운 모래 위를 걷는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "비상 AR"),
  makeAnimal("사막 뱀", { title: "Crotalus_cerastes", lang: "en" }, ["special", "land"], "사막", "몸의 일부를 들고 옆으로 기어가요.", ["모래색 몸", "비늘", "다리 없음"], "비상 AR 자료에 있는 사막 동물 사례예요.", "모래와 비슷한 몸 색깔과 옆으로 기는 움직임은 사막 생활에 알맞아요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: false, crawls: true }, "비상 AR"),
  makeAnimal("사막 딱정벌레", { title: "Stenocara_gracilipes", lang: "en" }, ["special", "land"], "사막", "여섯 다리로 모래 위를 걸어요.", ["단단한 몸", "다리 6개", "등의 돌기"], "비상 AR 자료에 있는 사막 곤충 사례예요.", "단단한 몸과 등에 맺히는 물방울은 건조한 사막에서 살아가는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "비상 AR"),
  makeAnimal("북극곰", "북극곰", ["special"], "극지방", "얼음 위를 걷고 물에서 헤엄쳐요.", ["두꺼운 털", "넓은 발", "두꺼운 피부"], "극지방에서 사는 동물의 예예요.", "털과 두꺼운 피부가 추위를 견디는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "47쪽"),
  makeAnimal("북극여우", "북극여우", ["special", "land"], "극지방", "네 다리로 눈과 얼음 위를 걸어요.", ["작은 귀", "두꺼운 털", "짧은 주둥이"], "비상 AR 자료에 있는 극지방 동물 사례예요.", "작은 귀와 두꺼운 털은 추운 곳에서 몸의 열을 지키는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "비상 AR"),
  makeAnimal("펭귄", "펭귄", ["special"], "극지방과 바다", "물속에서 헤엄치고 얼음 위를 걸어요.", ["빽빽한 깃털", "날개 모양 지느러미", "짧은 다리"], "극지방에서 사는 동물의 예예요.", "빽빽한 깃털은 추위를 견디게 하고, 날개 모양 지느러미는 물속에서 헤엄치는 데 도움을 줘요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: true, crawls: false }, "47쪽, 비상 AR"),
  makeAnimal("산양", "산양", ["special", "land"], "높고 가파른 산악 지형", "다리와 발굽으로 바위를 올라요.", ["다리", "발굽", "털"], "산악 지형에서 사는 동물의 예예요.", "발굽과 다리는 높은 산의 바위에서 균형을 잡는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "47쪽"),
  makeAnimal("수달", "수달", ["freshwater"], "강가나 호숫가", "물갈퀴가 있는 발로 헤엄쳐요.", ["물갈퀴", "털", "긴 꼬리"], "물에서 사는 동물의 예예요.", "물갈퀴가 있는 발은 물속에서 헤엄치는 데 알맞아요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "34쪽, 48쪽"),
  makeAnimal("다슬기", "다슬기", ["freshwater"], "강이나 호수 바닥", "물속 바닥을 기어서 이동해요.", ["껍데기", "부드러운 몸", "발"], "강이나 호수에 사는 동물의 예예요.", "단단한 껍데기와 발이 물속 바닥 생활에 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: true }, "48쪽"),
  makeAnimal("송사리", "송사리", ["freshwater"], "강이나 호수", "지느러미로 헤엄쳐요.", ["지느러미", "작은 몸", "아가미"], "강이나 호수에 사는 동물의 예예요.", "작은 몸과 지느러미가 얕은 물에서 움직이는 데 알맞아요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "48쪽"),
  makeAnimal("소금쟁이", "소금쟁이", ["freshwater"], "연못이나 하천의 물 위", "긴 다리로 물 위를 미끄러지듯 다녀요.", ["긴 다리", "가느다란 몸", "짧은 더듬이"], "비상 AR 자료에 있는 물가 동물 사례예요.", "가늘고 긴 다리는 물 표면 위에서 몸을 지탱하고 이동하는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "비상 AR"),
  makeAnimal("피라미", "피라미", ["freshwater"], "강이나 하천", "지느러미로 헤엄쳐요.", ["지느러미", "비늘", "날씬한 몸"], "비상 AR 자료에 있는 민물고기 사례예요.", "날씬한 몸과 지느러미는 흐르는 물에서 헤엄치는 데 알맞아요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "비상 AR"),
  makeAnimal("왜가리", "왜가리", ["freshwater", "land"], "논, 하천, 물가", "긴 다리로 얕은 물을 걸어요.", ["긴 목", "긴 다리", "뾰족한 부리"], "비상 AR 자료에 있는 물가 새 사례예요.", "긴 다리와 뾰족한 부리는 얕은 물에서 먹이를 찾는 데 도움을 줘요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: true, crawls: false }, "비상 AR"),
  makeAnimal("물방개", "물방개", ["freshwater"], "연못이나 논의 물속", "털이 난 뒷다리로 헤엄쳐요.", ["다리 6개", "단단한 몸", "털 난 뒷다리"], "비상 AR 자료에 있는 물속 곤충 사례예요.", "길고 털이 난 뒷다리는 물속에서 노처럼 움직이는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "비상 AR"),
  makeAnimal("메기", "메기", ["freshwater"], "강이나 호수", "지느러미로 헤엄쳐요.", ["지느러미", "수염", "아가미"], "강이나 호수에 사는 동물의 예예요.", "수염은 흐린 물속에서 주변을 느끼는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "48쪽"),
  makeAnimal("개구리", "개구리", ["freshwater", "land"], "연못, 논, 물가", "다리로 뛰고 물갈퀴로 헤엄쳐요.", ["다리", "물갈퀴", "축축한 피부"], "강이나 호수에 사는 동물의 예예요.", "물갈퀴가 있는 발은 물속 이동에 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "49쪽"),
  makeAnimal("청둥오리", "청둥오리", ["freshwater"], "강이나 호수", "날개로 날고 물갈퀴 발로 헤엄쳐요.", ["날개", "물갈퀴", "부리"], "강이나 호수에 사는 동물의 예예요.", "물갈퀴가 있는 발은 물 위와 물속에서 움직이는 데 도움을 줘요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: true, crawls: false }, "49쪽"),
  makeAnimal("갈매기", "갈매기", ["sea"], "바닷가와 항구", "날개로 바다 위를 날아다녀요.", ["날개", "부리", "물갈퀴 발"], "비상 AR 자료에 있는 바닷가 새 사례예요.", "날개와 물갈퀴 발은 바닷가에서 날고 물 위에 머무는 데 도움을 줘요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: true, crawls: false }, "비상 AR"),
  makeAnimal("조개", "조개", ["sea"], "바다, 갯벌", "물속 바닥에서 천천히 움직여요.", ["껍데기", "부드러운 몸", "발"], "바다와 갯벌에 사는 동물의 예예요.", "껍데기는 부드러운 몸을 보호하는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: true }, "50쪽, 51쪽"),
  makeAnimal("게", "게", ["sea"], "갯벌과 바닷가", "다섯 쌍의 다리로 옆으로 걸어요.", ["집게", "다리 10개", "단단한 껍질"], "갯벌과 바닷가에서 사는 동물의 예예요.", "단단한 껍질과 집게는 갯벌에서 몸을 보호하고 먹이를 찾는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "50쪽, 57쪽, 비상 AR"),
  makeAnimal("전복", "전복", ["sea"], "바다 바위", "넓은 발로 바위에 붙어 천천히 기어가요.", ["구멍 있는 껍데기", "넓은 발", "부드러운 몸"], "비상 AR 자료에 있는 바다 동물 사례예요.", "넓은 발과 단단한 껍데기는 바위에 붙어 생활하는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: true }, "비상 AR"),
  makeAnimal("소라", "소라", ["sea"], "바다 바닥", "물속 바닥을 기어서 이동해요.", ["껍데기", "부드러운 몸", "발"], "바다에 사는 동물의 예예요.", "나선 모양 껍데기는 몸을 보호해요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: true }, "50쪽"),
  makeAnimal("돌돔", "돌돔", ["sea"], "바다", "지느러미로 헤엄쳐요.", ["지느러미", "비늘", "줄무늬"], "바다에 사는 동물의 예예요.", "지느러미와 비늘은 바다에서 헤엄치는 데 알맞아요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "50쪽"),
  makeAnimal("해삼", "해삼", ["sea"], "바다 바닥", "물속 바닥을 천천히 기어가요.", ["길쭉한 몸", "다리 없음", "부드러운 몸"], "바다에 사는 동물의 예예요.", "바닥에 붙어 천천히 움직이며 생활해요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: true }, "50쪽"),
  makeAnimal("돌고래", "돌고래", ["sea"], "바다", "지느러미와 꼬리로 헤엄쳐요.", ["지느러미", "매끈한 몸", "꼬리"], "바다에 사는 동물의 예예요.", "매끈한 몸과 지느러미가 빠르게 헤엄치는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "51쪽"),
  makeAnimal("오징어", "오징어", ["sea"], "바다", "몸에서 물을 뿜어 빠르게 움직여요.", ["긴 팔", "빨판", "부드러운 몸"], "바다에 사는 동물의 예예요.", "팔의 빨판은 먹이를 붙잡는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: false }, "51쪽"),
  makeAnimal("바다거북", "바다거북", ["sea"], "바다", "넓은 앞다리로 헤엄쳐요.", ["넓은 앞다리", "등딱지", "부리 모양 입"], "바다에 사는 동물의 예예요.", "넓은 앞다리는 물속에서 노처럼 움직여요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "51쪽"),
  makeAnimal("고등어", "고등어", ["sea"], "바다", "지느러미로 헤엄쳐요.", ["지느러미", "비늘", "매끈한 몸"], "바다에 사는 동물의 예예요.", "지느러미와 매끈한 몸은 물속 이동에 알맞아요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "51쪽"),
  makeAnimal("해마", { title: "Seahorse", lang: "en" }, ["sea"], "바다", "작은 지느러미를 움직여 천천히 헤엄쳐요.", ["작은 지느러미", "말처럼 생긴 머리", "말린 꼬리"], "바다에서 이동하는 방법을 생김새와 연결해 생각해요.", "작은 지느러미와 꼬리가 바닷속에서 몸을 조절하는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "51쪽")
];

const collectedIdAliases = {
  "오색딱따구리": "딱따구리",
  "황제펭귄": "펭귄",
  "칠게": "게"
};
const animalIds = new Set(animals.map(animal => animal.id));
const storageKey = "animal-encyclopedia-collected-v1";
const settingsSeenKey = "animal-encyclopedia-settings-seen-v2";
const onboardingSeenKey = "animal-encyclopedia-onboarding-seen-v1";
const completedMilestonesKey = "animal-encyclopedia-completed-milestones-v1";
const soundMutedKey = "animal-encyclopedia-sound-muted-v1";
const observationReadyKey = "animal-encyclopedia-observation-ready-v1";
const imageCache = new Map();
const milestoneFilters = filters.filter(filter => filter.id !== "all");
const state = {
  view: "catalog",
  filter: "all",
  catalogMode: "mission",
  query: "",
  missionRegion: "around",
  missionSelections: {},
  missionAnimalIds: [],
  criterion: "hasLegs",
  collected: new Set(readCollected()),
  observationReady: new Set(readStoredIds(observationReadyKey, animalIds)),
  completedMilestones: new Set(readStoredIds(completedMilestonesKey, new Set(filters.map(filter => filter.id)))),
  soundMuted: readBoolean(soundMutedKey, false),
  selectedAnimal: null,
  game: {
    criterion: "hasLegs",
    round: [],
    placements: {},
    selected: null,
    checked: false
  },
  quiz: null,
  onboardingIndex: 0,
  lastFocus: null,
  settingsLastFocus: null,
  modalFocusStack: []
};

let audioContext = null;
let toastTimer = 0;

const els = {
  modeButtons: document.querySelectorAll("[data-view]"),
  catalogView: document.querySelector("#catalogView"),
  gameView: document.querySelector("#gameView"),
  filterTabs: document.querySelector("#filterTabs"),
  missionPanel: document.querySelector("#missionPanel"),
  sidebarLede: document.querySelector(".sidebar-lede"),
  sidebarTotalCount: document.querySelector(".sidebar-total-count"),
  missionRegionSelect: document.querySelector("#missionRegionSelect"),
  missionAnimalOptions: document.querySelector("#missionAnimalOptions"),
  missionAnimalCount: document.querySelector("#missionAnimalCount"),
  animalGrid: document.querySelector("#animalGrid"),
  resultCount: document.querySelector("#resultCount"),
  collectedCount: document.querySelector("#collectedCount"),
  totalCount: document.querySelector("#totalCount"),
  progressFill: document.querySelector("#progressFill"),
  stickyProgress: document.querySelector("#stickyProgress"),
  stickyProgressLabel: document.querySelector("#stickyProgressLabel"),
  stickyProgressFill: document.querySelector("#stickyProgressFill"),
  searchInput: document.querySelector("#searchInput"),
  gameCriterion: document.querySelector("#gameCriterion"),
  gamePool: document.querySelector("#gamePool"),
  gameYes: document.querySelector("#gameYes"),
  gameNo: document.querySelector("#gameNo"),
  gameScore: document.querySelector("#gameScore"),
  gameFeedback: document.querySelector("#gameFeedback"),
  yesHint: document.querySelector("#yesHint"),
  noHint: document.querySelector("#noHint"),
  newRound: document.querySelector("#newRound"),
  checkGame: document.querySelector("#checkGame"),
  resetProgress: document.querySelector("#resetProgress"),
  detailModal: document.querySelector("#detailModal"),
  detailPhoto: document.querySelector("#detailPhoto"),
  detailImage: document.querySelector("#detailImage"),
  detailBody: document.querySelector("#detailBody"),
  closeDetail: document.querySelector("#closeDetail"),
  backToCatalog: document.querySelector("#backToCatalog"),
  openSettings: document.querySelector("#openSettings"),
  settingsModal: document.querySelector("#settingsModal"),
  closeSettings: document.querySelector("#closeSettings"),
  questionSettingsForm: document.querySelector("#questionSettingsForm"),
  questionUrlInput: document.querySelector("#questionUrlInput"),
  clearQuestionUrl: document.querySelector("#clearQuestionUrl"),
  shareLinkPanel: document.querySelector("#shareLinkPanel"),
  shareLinkOutput: document.querySelector("#shareLinkOutput"),
  copyShareLink: document.querySelector("#copyShareLink"),
  downloadQr: document.querySelector("#downloadQr"),
  qrCode: document.querySelector("#qrCode"),
  settingsMessage: document.querySelector("#settingsMessage"),
  roomTemplateLink: document.querySelector("#roomTemplateLink"),
  teacherBanner: document.querySelector("#teacherBanner"),
  openGuide: document.querySelector("#openGuide"),
  closeGuide: document.querySelector("#closeGuide"),
  guideModal: document.querySelector("#guideModal"),
  qrExpandModal: document.querySelector("#qrExpandModal"),
  qrExpandImage: document.querySelector("#qrExpandImage"),
  closeQrExpand: document.querySelector("#closeQrExpand"),
  downloadQrExpand: document.querySelector("#downloadQrExpand"),
  confirmPopup: document.querySelector("#confirmPopup"),
  confirmYes: document.querySelector("#confirmYes"),
  confirmNo: document.querySelector("#confirmNo"),
  sourceConfirmModal: document.querySelector("#sourceConfirmModal"),
  sourceContinue: document.querySelector("#sourceContinue"),
  sourceCancel: document.querySelector("#sourceCancel"),
  onboardingModal: document.querySelector("#onboardingModal"),
  onboardingContent: document.querySelector("#onboardingContent"),
  onboardingStepLabel: document.querySelector("#onboardingStepLabel"),
  nextOnboarding: document.querySelector("#nextOnboarding"),
  skipOnboarding: document.querySelector("#skipOnboarding"),
  rewardModal: document.querySelector("#rewardModal"),
  rewardContent: document.querySelector("#rewardContent"),
  rewardNextRegion: document.querySelector("#rewardNextRegion"),
  rewardClose: document.querySelector("#rewardClose"),
  rewardReset: document.querySelector("#rewardReset"),
  soundToggle: document.querySelector("#soundToggle"),
  appToast: document.querySelector("#appToast")
};

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
    .filter(el => el.offsetParent !== null && !el.closest("[hidden]"));
}

function handleModalKeydown(event) {
  if (event.key !== "Tab" || state.modalFocusStack.length === 0) return;
  const topModal = state.modalFocusStack[state.modalFocusStack.length - 1];
  const focusables = getFocusableElements(topModal);
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function enterModalFocus(modalElement) {
  const appLayout = document.querySelector(".app-layout");
  if (state.modalFocusStack.length === 0 && appLayout) {
    appLayout.inert = true;
  }
  if (state.modalFocusStack.length > 0) {
    const prevModal = state.modalFocusStack[state.modalFocusStack.length - 1];
    prevModal.inert = true;
  }
  state.modalFocusStack.push(modalElement);
  modalElement.inert = false;
  modalElement.hidden = false;
  requestAnimationFrame(() => {
    const focusables = getFocusableElements(modalElement);
    if (focusables.length > 0) focusables[0].focus();
  });
}

function exitModalFocus(modalElement) {
  const idx = state.modalFocusStack.lastIndexOf(modalElement);
  if (idx !== -1) state.modalFocusStack.splice(idx, 1);
  modalElement.hidden = true;
  const appLayout = document.querySelector(".app-layout");
  if (state.modalFocusStack.length === 0) {
    if (appLayout) appLayout.inert = false;
  } else {
    const topModal = state.modalFocusStack[state.modalFocusStack.length - 1];
    topModal.inert = false;
    requestAnimationFrame(() => {
      const focusables = getFocusableElements(topModal);
      if (focusables.length > 0) focusables[0].focus();
    });
  }
}

function makeAnimal(name, wiki, categories, habitat, move, body, point, relation, flags, page) {
  const wikiInfo = typeof wiki === "string" ? { title: wiki, lang: "ko" } : wiki;
  return {
    id: name,
    name,
    wikiTitle: wikiInfo.title,
    wikiLang: wikiInfo.lang,
    categories,
    habitat,
    move,
    body,
    quickFacts: {
      habitat,
      movement: move,
      feature: body.slice(0, 2).join(", ")
    },
    point,
    relation,
    page,
    image: imageSources[name],
    source: wikiUrl(wikiInfo.lang, wikiInfo.title),
    ...flags
  };
}

function init() {
  applyInitialMissionSettings();
  hydrateQuestionToolConfig();
  applyQuestionToolMode();
  returnToCurrentMission(false);
  els.totalCount.textContent = getProgramTotal();
  if (els.roomTemplateLink) {
    els.roomTemplateLink.href = magicRoomTemplateUrl;
  }
  bindViewTabs();
  bindMissionPanel();
  renderTeacherMissionPanel();
  bindTeacherMissionControls();
  renderMissionPanel();
  renderFilters();
  renderAnimals();
  renderGameCriterionOptions();
  startNewRound();
  updateProgress();
  updateSoundToggle();

  const debouncedRenderAnimals = debounce(renderAnimals, 150);
  els.searchInput.addEventListener("input", event => {
    state.query = event.target.value.trim();
    debouncedRenderAnimals();
  });

  if (els.closeDetail) {
    els.closeDetail.addEventListener("click", closeDetail);
  }
  if (els.detailModal) {
    els.detailModal.addEventListener("click", event => {
      if (event.target === els.detailModal) closeDetail();
      const questionBtn = event.target.closest("[data-question-url]");
      if (questionBtn) {
        const url = questionBtn.dataset.questionUrl;
        if (url && els.confirmPopup) {
          pendingQuestionUrl = url;
          els.confirmPopup.hidden = false;
        }
      }
      const sourceBtn = event.target.closest("[data-source-url]");
      if (sourceBtn) {
        const url = sourceBtn.dataset.sourceUrl;
        if (url) openSourceConfirm(url);
      }
    });
  }
  if (els.backToCatalog) {
    els.backToCatalog.addEventListener("click", () => setView("catalog"));
  }
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (state.modalFocusStack.length > 0) {
        const topModal = state.modalFocusStack[state.modalFocusStack.length - 1];
        if (topModal === els.settingsModal) closeSettings();
        else if (topModal === els.detailModal) closeDetail();
        else if (topModal === els.guideModal) closeGuideModal();
        else if (topModal === els.qrExpandModal) closeQrExpand();
        else if (topModal === els.onboardingModal) completeOnboarding();
        else if (topModal === els.rewardModal) closeReward();
      }
      if (els.sourceConfirmModal && !els.sourceConfirmModal.hidden) closeSourceConfirm();
      if (els.confirmPopup && !els.confirmPopup.hidden) closeConfirmPopup();
    }
    handleModalKeydown(event);
  });
  if (els.openSettings) els.openSettings.addEventListener("click", openSettings);
  if (els.closeSettings) els.closeSettings.addEventListener("click", closeSettings);
  if (els.settingsModal) {
    els.settingsModal.addEventListener("click", event => {
      if (event.target === els.settingsModal) closeSettings();
    });
  }
  if (els.questionSettingsForm) els.questionSettingsForm.addEventListener("submit", saveQuestionSettings);
  if (els.clearQuestionUrl) els.clearQuestionUrl.addEventListener("click", clearQuestionSettings);
  if (els.copyShareLink) els.copyShareLink.addEventListener("click", copyShareLink);
  if (els.downloadQr) els.downloadQr.addEventListener("click", downloadQrImage);
  if (els.openGuide) els.openGuide.addEventListener("click", openGuideModal);
  if (els.closeGuide) els.closeGuide.addEventListener("click", closeGuideModal);
  if (els.guideModal) {
    els.guideModal.addEventListener("click", event => {
      if (event.target === els.guideModal) closeGuideModal();
    });
  }
  if (els.qrCode) els.qrCode.addEventListener("click", openQrExpand);
  if (els.qrCode) els.qrCode.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openQrExpand();
    }
  });
  if (els.closeQrExpand) els.closeQrExpand.addEventListener("click", closeQrExpand);
  if (els.qrExpandModal) {
    els.qrExpandModal.addEventListener("click", event => {
      if (event.target === els.qrExpandModal) closeQrExpand();
    });
  }
  if (els.downloadQrExpand) els.downloadQrExpand.addEventListener("click", downloadQrExpandImage);
  if (els.confirmYes) els.confirmYes.addEventListener("click", confirmNavigateToQuestion);
  if (els.confirmNo) els.confirmNo.addEventListener("click", closeConfirmPopup);
  if (els.confirmPopup) {
    els.confirmPopup.addEventListener("click", event => {
      if (event.target === els.confirmPopup) closeConfirmPopup();
    });
  }
  if (els.sourceContinue) els.sourceContinue.addEventListener("click", confirmNavigateToSource);
  if (els.sourceCancel) els.sourceCancel.addEventListener("click", closeSourceConfirm);
  if (els.sourceConfirmModal) {
    els.sourceConfirmModal.addEventListener("click", event => {
      if (event.target === els.sourceConfirmModal) closeSourceConfirm();
    });
  }
  if (els.nextOnboarding) els.nextOnboarding.addEventListener("click", nextOnboardingStep);
  if (els.skipOnboarding) els.skipOnboarding.addEventListener("click", completeOnboarding);
  if (els.onboardingModal) {
    els.onboardingModal.addEventListener("click", event => {
      if (event.target === els.onboardingModal) completeOnboarding();
    });
  }
  if (els.rewardClose) els.rewardClose.addEventListener("click", closeReward);
  if (els.rewardNextRegion) els.rewardNextRegion.addEventListener("click", goToNextRewardRegion);
  if (els.rewardReset) els.rewardReset.addEventListener("click", resetProgressFromReward);
  if (els.rewardModal) {
    els.rewardModal.addEventListener("click", event => {
      if (event.target === els.rewardModal) closeReward();
    });
  }
  if (els.soundToggle) els.soundToggle.addEventListener("click", toggleSound);
  els.resetProgress.addEventListener("click", resetProgress);
  els.gameCriterion.addEventListener("change", event => {
    state.game.criterion = event.target.value;
    startNewRound();
  });
  els.newRound.addEventListener("click", startNewRound);
  els.checkGame.addEventListener("click", checkGame);
  document.querySelectorAll("[data-answer]").forEach(zone => {
    zone.addEventListener("dragover", event => {
      event.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", event => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      const animalId = event.dataTransfer.getData("text/plain");
      moveGameToken(animalId, zone.dataset.answer);
    });
    zone.addEventListener("click", () => {
      if (state.game.selected) moveGameToken(state.game.selected, zone.dataset.answer);
    });
  });

  openFirstRunTeacherWorkflow();
  updateSidebarLede();

  if (!readBoolean(onboardingSeenKey, false)) {
    window.setTimeout(openOnboarding, 700);
  }
}

function openFirstRunTeacherWorkflow() {
  if (!hasSeenSettingsModal() && canOpenQuestionSettings()) {
    window.setTimeout(openSettings, 500);
  }
}

function updateSidebarLede() {
  if (els.sidebarTotalCount) {
    els.sidebarTotalCount.textContent = String(getProgramTotal());
  } else if (els.sidebarLede) {
    els.sidebarLede.textContent = `동물을 관찰하고 퀴즈 몬스터볼을 던져 ${getProgramTotal()}마리의 카드를 모아보세요! 과연 누가 가장 먼저 도감 마스터가 될까요?`;
  }
}

function bindViewTabs() {
  els.modeButtons.forEach(button => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
}

function bindMissionPanel() {
  if (!els.missionPanel) return;
  els.missionPanel.addEventListener("click", event => {
    const action = event.target.closest("[data-catalog-mode]");
    if (!action) return;
    playSound("select");
    if (action.dataset.catalogMode === "all") {
      state.catalogMode = "all";
      state.filter = "all";
    } else if (action.dataset.catalogMode === "next-mission") {
      const nextMissionId = getNextMissionFilter();
      activateMissionRegion(nextMissionId, { shouldRender: false, updateUrl: true });
    } else {
      returnToCurrentMission(false);
    }
    renderMissionPanel();
    renderFilters();
    renderAnimals();
  });
}

function applyInitialMissionSettings() {
  const requestedRegion = getMissionRegionFromPageUrl();
  const mission = getMissionPreset(requestedRegion) || defaultMissionSelections[0];
  state.missionSelections = getMissionSelectionsFromPageUrl();
  state.missionRegion = mission.id;
  state.missionAnimalIds = getSelectedMissionAnimalIds(mission.id);
  state.filter = mission.id;
}

function getMissionRegionFromPageUrl() {
  const params = new URLSearchParams(window.location.search);
  return normalizeMissionRegionId(params.get("region") || params.get("set") || "");
}

function getMissionAnimalIdsFromPageUrl(mission = getCurrentMissionPreset()) {
  const params = new URLSearchParams(window.location.search);
  const raw = getMissionAnimalsParam(params, mission.id);
  const validIds = new Set(getMissionCandidateAnimals(mission.id).map(animal => animal.id));
  const requested = raw
    .split(",")
    .map(id => id.trim())
    .filter(id => validIds.has(id));
  return requested.length ? requested : getDefaultMissionAnimalIds(mission);
}

function getMissionSelectionsFromPageUrl() {
  const selections = {};
  defaultMissionSelections.forEach(mission => {
    selections[mission.id] = getMissionAnimalIdsFromPageUrl(mission);
  });
  return selections;
}

function getMissionAnimalsParam(params, regionId) {
  return params.get(`${regionId}Animals`) || (regionId === getMissionRegionFromPageUrl() ? params.get("animals") || "" : "");
}

function renderTeacherMissionPanel() {
  if (!els.missionRegionSelect || !els.missionAnimalOptions) return;
  els.missionRegionSelect.innerHTML = "";
  defaultMissionSelections.forEach(set => {
    const option = document.createElement("option");
    option.value = set.id;
    option.textContent = set.label;
    els.missionRegionSelect.append(option);
  });
  els.missionRegionSelect.value = state.missionRegion;
  renderTeacherMissionAnimals();
}

function bindTeacherMissionControls() {
  if (!els.missionRegionSelect || !els.missionAnimalOptions) return;
  els.missionRegionSelect.addEventListener("change", event => {
    state.missionRegion = event.target.value;
    state.missionAnimalIds = getSelectedMissionAnimalIds(state.missionRegion);
    state.query = "";
    if (els.searchInput) els.searchInput.value = "";
    state.catalogMode = "mission";
    state.filter = state.missionRegion;
    updateMissionUrl();
    renderTeacherMissionAnimals();
    renderMissionPanel();
    renderFilters();
    renderAnimals();
    updateProgress();
    renderShareLinkPanel();
  });
  els.missionAnimalOptions.addEventListener("change", event => {
    const checkbox = event.target.closest("[data-mission-animal]");
    if (!checkbox) return;
    const selected = [...els.missionAnimalOptions.querySelectorAll("[data-mission-animal]:checked")]
      .map(input => input.value);
    state.missionAnimalIds = selected.length ? selected : getDefaultMissionAnimalIds(getCurrentMissionPreset());
    state.missionSelections[state.missionRegion] = state.missionAnimalIds;
    updateMissionUrl();
    renderTeacherMissionCount();
    renderMissionPanel();
    renderFilters();
    renderAnimals();
    updateProgress();
    renderShareLinkPanel();
  });
}

function renderTeacherMissionAnimals() {
  if (!els.missionAnimalOptions) return;
  const selected = new Set(state.missionAnimalIds);
  els.missionAnimalOptions.innerHTML = getMissionCandidateAnimals(state.missionRegion).map(animal => `
    <label>
      <input type="checkbox" value="${escapeAttribute(animal.id)}" data-mission-animal ${selected.has(animal.id) ? "checked" : ""}>
      <span>${escapeHTML(animal.name)}</span>
    </label>
  `).join("");
  renderTeacherMissionCount();
}

function renderTeacherMissionCount() {
  if (!els.missionAnimalCount) return;
  const total = getMissionCandidateAnimals(state.missionRegion).length;
  els.missionAnimalCount.textContent = `${state.missionAnimalIds.length} / ${total}마리 선택됨`;
}

function updateMissionUrl() {
  const current = new URL(window.location.href);
  current.searchParams.set("set", state.missionRegion);
  current.searchParams.set("animals", state.missionAnimalIds.join(","));
  writeMissionSelectionParams(current.searchParams);
  window.history.replaceState({}, "", current.toString());
}

function activateMissionRegion(regionId, options = {}) {
  const { shouldRender = true, updateUrl = false } = options;
  const mission = getMissionPreset(regionId);
  if (!mission) return;

  state.missionRegion = mission.id;
  state.missionAnimalIds = getSelectedMissionAnimalIds(mission.id);
  state.catalogMode = "mission";
  state.filter = mission.id;
  state.query = "";
  state.selectedAnimal = null;
  if (els.searchInput) els.searchInput.value = "";
  if (updateUrl) updateMissionUrl();

  if (shouldRender) {
    renderTeacherMissionPanel();
    renderMissionPanel();
    renderFilters();
    renderAnimals();
    updateProgress();
    renderShareLinkPanel();
  }
}

function getCurrentMissionPreset() {
  return getMissionPreset(state.missionRegion) || defaultMissionSelections[0];
}

function getMissionPreset(regionId) {
  return defaultMissionSelections.find(set => set.id === normalizeMissionRegionId(regionId));
}

function normalizeMissionRegionId(regionId) {
  const aliases = {
    water: "freshwater",
    wings: "land"
  };
  return aliases[regionId] || regionId;
}

function getDefaultMissionAnimalIds(mission = getCurrentMissionPreset()) {
  const candidateIds = new Set(getMissionCandidateAnimals(mission.id).map(animal => animal.id));
  const defaults = mission.animalIds.filter(id => candidateIds.has(id));
  return defaults.length ? defaults : [...candidateIds].slice(0, 8);
}

function getSelectedMissionAnimalIds(regionId) {
  const mission = getMissionPreset(regionId);
  if (!mission) return [];
  const validIds = new Set(getMissionCandidateAnimals(mission.id).map(animal => animal.id));
  const selected = (state.missionSelections[mission.id] || [])
    .filter(id => validIds.has(id));
  if (selected.length) return selected;
  const defaults = getDefaultMissionAnimalIds(mission);
  state.missionSelections[mission.id] = defaults;
  return defaults;
}

function getMissionCandidateAnimals(regionId) {
  return animals.filter(animal => animal.categories.includes(regionId));
}

function getProgramAnimals() {
  const ids = new Set();
  defaultMissionSelections.forEach(mission => {
    getSelectedMissionAnimalIds(mission.id).forEach(id => ids.add(id));
  });
  return animals.filter(animal => ids.has(animal.id));
}

function getProgramTotal() {
  return getProgramAnimals().length;
}

function writeMissionSelectionParams(searchParams) {
  defaultMissionSelections.forEach(mission => {
    const ids = getSelectedMissionAnimalIds(mission.id);
    searchParams.set(`${mission.id}Animals`, ids.join(","));
  });
}

function setView(view) {
  state.view = view;
  document.body.dataset.view = view;
  const sidebar = document.querySelector(".sidebar");

  if (view === "catalog") {
    els.catalogView.style.display = "";
    els.gameView.classList.remove("active");
    els.gameView.style.display = "none";
    if (sidebar) sidebar.style.display = "";
  } else {
    els.catalogView.style.display = "none";
    els.gameView.classList.add("active");
    els.gameView.style.display = "";
    if (sidebar) sidebar.style.display = "none";
    updateProgress();
  }
  els.modeButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });
}

const onboardingSteps = [
  {
    title: "동물 카드를 눌러 사진과 설명을 봐요",
    body: "먼저 카드 한 장을 골라 생김새, 사는 곳, 움직임을 천천히 살펴봅니다.",
    target: () => document.querySelector(".animal-card")
  },
  {
    title: "퀴즈를 풀어 도감에 등록해요",
    body: "설명을 읽은 뒤 짧은 퀴즈를 맞히면 카드가 내 도감에 등록됩니다.",
    demo: true
  },
  {
    title: "지역별로 완성해요",
    body: "54마리를 한 번에 끝내지 않아도 괜찮아요. 우리 주변, 땅, 물, 특별한 환경을 하나씩 완성해 봅니다.",
    target: () => els.missionPanel || els.progressFill
  }
];

function openOnboarding() {
  if (!els.onboardingModal || !els.onboardingContent) return;
  if (state.view !== "catalog") setView("catalog");
  state.onboardingIndex = 0;
  renderOnboarding();
  enterModalFocus(els.onboardingModal);
}

function renderOnboarding() {
  clearOnboardingHighlights();
  const step = onboardingSteps[state.onboardingIndex];
  if (!step || !els.onboardingContent) return;

  const target = step.target?.();
  if (target) target.classList.add("onboarding-highlight");
  if (els.onboardingStepLabel) {
    els.onboardingStepLabel.textContent = `첫 방문 안내 ${state.onboardingIndex + 1} / ${onboardingSteps.length}`;
  }

  els.onboardingContent.innerHTML = `
    <h2 id="onboardingTitle">${step.title}</h2>
    <p>${step.body}</p>
    ${step.demo ? `
      <div class="onboarding-demo" aria-label="데모 퀴즈">
        <span class="demo-badge">데모 퀴즈</span>
        <strong>토끼는 어떻게 이동할까요?</strong>
        <span>다리로 뛰어 이동해요.</span>
      </div>
    ` : ""}
  `;

  if (els.nextOnboarding) {
    els.nextOnboarding.textContent = state.onboardingIndex === onboardingSteps.length - 1 ? "시작하기" : "다음";
  }
}

function nextOnboardingStep() {
  playSound("select");
  if (state.onboardingIndex < onboardingSteps.length - 1) {
    state.onboardingIndex += 1;
    renderOnboarding();
    return;
  }
  completeOnboarding();
}

function completeOnboarding() {
  clearOnboardingHighlights();
  safeSetStorage(onboardingSeenKey, "true");
  if (els.onboardingModal && !els.onboardingModal.hidden) {
    exitModalFocus(els.onboardingModal);
  }
}

function clearOnboardingHighlights() {
  document.querySelectorAll(".onboarding-highlight").forEach(element => {
    element.classList.remove("onboarding-highlight");
  });
}

function renderFilters() {
  els.filterTabs.innerHTML = "";
  const nextMission = getNextMissionFilter();
  const orderedFilters = [...milestoneFilters, filters.find(filter => filter.id === "all")].filter(Boolean);

  orderedFilters.forEach(filter => {
    const button = document.createElement("button");
    const stage = getStageStatus(filter, nextMission);
    button.type = "button";
    button.className = `filter-button stage-${stage.status}`;
    button.setAttribute("data-filter", filter.id);
    const progress = getFilterProgress(filter.id);
    const displayLabel = filter.id === "all" ? "전체 도감" : filter.label;
    button.innerHTML = `
      <span class="filter-main">
        <span class="filter-icon">${filter.icon}</span>
        <span>${displayLabel}</span>
        <span class="stage-status">${stage.label}</span>
      </span>
      <span class="filter-progress-badge">${progress.collected} / ${progress.total}</span>
    `;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(filter.id === state.filter));
    if (filter.id === state.filter) button.classList.add("active");
    button.addEventListener("click", () => {
      playSound("select");
      if (filter.id === "all") {
        state.filter = "all";
        state.catalogMode = "all";
        renderMissionPanel();
        renderFilters();
        renderAnimals();
        return;
      }
      activateMissionRegion(filter.id, { shouldRender: true, updateUrl: true });
    });
    els.filterTabs.append(button);
  });
}

function renderMissionPanel() {
  if (!els.missionPanel) return;
  updateSidebarLede();
  const nextMissionId = getNextMissionFilter();
  const isAllMode = state.catalogMode === "all";
  const selectedFilter = filters.find(filter => filter.id === state.filter) || filters[0];
  const currentMission = filters.find(filter => filter.id === nextMissionId) || filters[0];
  const panelFilter = isAllMode ? filters[0] : selectedFilter;
  const progress = getFilterProgress(panelFilter.id);
  const percent = progress.total ? Math.round((progress.collected / progress.total) * 100) : 0;
  const isCurrentMission = !isAllMode && state.filter === nextMissionId;
  const isFinished = nextMissionId === "all" && state.collected.size === animals.length;
  const isCompletedMission = !isAllMode && panelFilter.id !== "all" && progress.total > 0 && progress.collected === progress.total;
  const hasNextMission = isCompletedMission && nextMissionId !== "all";
  const boardStatus = isAllMode
    ? "all"
    : isFinished || isCompletedMission
      ? "complete"
      : isCurrentMission
        ? "current"
        : "next";
  const boardClass = {
    all: "mission-board status-all",
    current: "mission-board status-current",
    complete: "mission-board status-complete",
    next: "mission-board status-next"
  }[boardStatus];
  const modeLabel = isAllMode ? "전체 도감 보기" : isCurrentMission ? "현재 미션" : "지역 미리보기";
  const title = isAllMode
    ? `전체 ${getProgramTotal()}마리 도감`
    : isFinished
      ? "도감 마스터 미션 완료"
      : `${panelFilter.icon} ${panelFilter.label} 도감 미션`;
  const body = isAllMode
    ? "모든 동물을 한눈에 둘러볼 수 있어요. 수업 흐름은 현재 미션으로 언제든 돌아갈 수 있습니다."
    : hasNextMission
      ? `${panelFilter.label} 미션이 완료되었어요. 다음 미션 ${currentMission.icon} ${currentMission.label} 카드로 이동할 수 있어요.`
      : isCurrentMission
        ? `${panelFilter.label} 동물을 관찰하고 퀴즈를 맞혀 이 지역 도감을 완성해 보세요.`
        : `${currentMission.icon} ${currentMission.label} 미션이 현재 순서예요. 이 지역은 미리 둘러보는 중입니다.`;
  const buttonMode = hasNextMission ? "next-mission" : isAllMode || !isCurrentMission ? "mission" : "all";
  const buttonText = hasNextMission ? "다음 미션 시작" : isAllMode || !isCurrentMission ? "현재 미션으로 돌아가기" : "전체 도감 보기";
  const primaryAction = hasNextMission
    ? `<button class="mission-toggle" type="button" data-catalog-mode="next-mission">${buttonText}</button>`
    : `<button class="mission-toggle" type="button" data-catalog-mode="${buttonMode}">${buttonText}</button>`;
  const secondaryAction = hasNextMission
    ? `<button class="mission-secondary-action" type="button" data-catalog-mode="mission">완료한 미션 다시 보기</button>`
    : "";

  els.missionPanel.innerHTML = `
    <div class="${boardClass}">
      <div class="mission-orb" aria-hidden="true">${isAllMode ? "🏆" : panelFilter.icon}</div>
      <div class="mission-copy">
        <p class="section-kicker">${modeLabel}</p>
        <h2>${title}</h2>
        <p>${body}</p>
      </div>
      <div class="mission-meter" aria-label="${panelFilter.label} 진행도 ${progress.collected} / ${progress.total}">
        <span class="mission-meter-count">${progress.collected} / ${progress.total}</span>
        <span class="mission-meter-track" aria-hidden="true"><span style="width:${percent}%"></span></span>
      </div>
      <div class="mission-actions">
        ${primaryAction}
        ${secondaryAction}
      </div>
    </div>
  `;
}

function renderGameCriterionOptions() {
  els.gameCriterion.innerHTML = "";
  criteria.forEach(criterion => {
    const option = document.createElement("option");
    option.value = criterion.id;
    option.textContent = criterion.label;
    els.gameCriterion.append(option);
  });
}

function renderAnimals() {
  const visible = getVisibleAnimals();
  const isSearching = Boolean(state.query);
  els.animalGrid.innerHTML = "";
  els.resultCount.textContent = isSearching
    ? `전체 도감 검색 결과 ${visible.length}마리`
    : state.catalogMode === "all"
    ? `전체 ${visible.length}마리`
    : `미션 카드 ${visible.length}마리`;

  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "조건에 맞는 동물이 없어요. 다른 말로 찾아볼까요?";
    els.animalGrid.append(empty);
    return;
  }

  visible.forEach(animal => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "animal-card";
    if (state.collected.has(animal.id)) card.classList.add("collected");
    if (state.selectedAnimal === animal.id) card.classList.add("selected");
    card.addEventListener("click", () => openAnimal(animal));

    const imageFrame = document.createElement("div");
    imageFrame.className = "image-frame";
    imageFrame.textContent = "사진 준비 중";
    const image = document.createElement("img");
    image.alt = `${animal.name} 사진`;
    image.loading = "lazy";
    imageFrame.append(image);
    setImage(animal, image, imageFrame, "thumb");

    const cardBody = document.createElement("div");
    cardBody.className = "animal-card-body";
    cardBody.innerHTML = `
      <div class="animal-name-row">
        <h3>${animal.name}</h3>
        ${state.collected.has(animal.id) ? '<span class="mini-badge collected-badge">등록</span>' : ""}
      </div>
      <div class="animal-region-badges" aria-label="${animal.name} 지역">
        ${renderAnimalRegionBadges(animal)}
      </div>
      <div class="card-meta">
        ${animal.body.slice(0, 3).map(item => `<span class="tag">${item}</span>`).join("")}
      </div>
      <p class="card-point">${animal.habitat}에서 살며 ${animal.move}</p>
    `;

    card.append(imageFrame, cardBody);
    els.animalGrid.append(card);
  });
}

function getVisibleAnimals() {
  const query = state.query.toLowerCase();
  const missionIds = state.catalogMode === "mission" ? new Set(getSelectedMissionAnimalIds(state.missionRegion)) : null;
  const programIds = state.catalogMode === "all" ? new Set(getProgramAnimals().map(animal => animal.id)) : null;
  return animals.filter(animal => {
    const inMission = !missionIds || missionIds.has(animal.id);
    const inProgram = !programIds || programIds.has(animal.id);
    const inFilter = query || state.filter === "all" || getRepresentativeCategory(animal) === state.filter || animal.categories.includes(state.filter);
    const searchText = [
      animal.name,
      animal.habitat,
      animal.move,
      animal.point,
      animal.relation,
      animal.body.join(" "),
      animal.categories
        .map(categoryId => filters.find(filter => filter.id === categoryId)?.label || "")
        .join(" ")
    ].join(" ").toLowerCase();
    return inMission && inProgram && inFilter && (!query || searchText.includes(query));
  });
}

function getRepresentativeCategory(animal) {
  return animal.categories[0];
}

function getAnimalsForFilter(filterId) {
  if (filterId === "all") return getProgramAnimals();
  const ids = new Set(getSelectedMissionAnimalIds(filterId));
  if (ids.size) return getMissionCandidateAnimals(filterId).filter(animal => ids.has(animal.id));
  return animals.filter(animal => getRepresentativeCategory(animal) === filterId);
}

function renderAnimalRegionBadges(animal) {
  return animal.categories
    .map((categoryId, index) => ({
      filter: filters.find(filter => filter.id === categoryId),
      isPrimary: index === 0
    }))
    .filter(item => item.filter)
    .map(item => {
      const label = item.isPrimary ? "대표 환경" : "함께 볼 환경";
      const className = item.isPrimary ? "region-badge primary" : "region-badge secondary";
      return `<span class="${className}">${label}: ${item.filter.icon} ${item.filter.label}</span>`;
    })
    .join("");
}

function renderAnimalEnvironmentNote(animal) {
  if (animal.categories.length < 2) return "";
  const secondaryLabels = animal.categories
    .slice(1)
    .map(categoryId => filters.find(filter => filter.id === categoryId))
    .filter(Boolean)
    .map(filter => `${filter.icon} ${filter.label}`)
    .join("");

  return `
    <aside class="environment-note" aria-label="${animal.name} 보조 환경 안내">
      <strong>대표 환경으로 카운트하지만, 한 곳에만 사는 뜻은 아니에요.</strong>
      <span>함께 살펴볼 환경: ${secondaryLabels}</span>
    </aside>
  `;
}

function openAnimal(animal) {
  playSound("select");
  state.selectedAnimal = animal.id;
  state.quiz = null;
  els.detailImage.removeAttribute("src");
  els.detailImage.alt = `${animal.name} 사진`;
  els.detailPhoto.textContent = "사진 준비 중";
  els.detailPhoto.append(els.detailImage);
  setImage(animal, els.detailImage, els.detailPhoto, "detail");
  renderAnimalInfo(animal);
  enterModalFocus(els.detailModal);
  renderAnimals();
}

function closeDetail() {
  state.selectedAnimal = null;
  state.quiz = null;
  clearHintHighlight();
  exitModalFocus(els.detailModal);
  renderAnimals();
}

function renderAnimalInfo(animal) {
  const isCollected = state.collected.has(animal.id);
  const observation = buildObservationDetails(animal);
  const retryState = state.quiz && state.quiz.animal.id === animal.id ? state.quiz.retryState : null;
  const retryDelay = retryState ? Math.max(0, retryState.unlockAt - Date.now()) : 0;
  const retryLocked = retryDelay > 0;
  const quizAction = retryState
    ? renderQuizRetryPanel(state.quiz, retryLocked, retryDelay)
    : isCollected
      ? renderCollectedAction(animal)
      : `
        <button class="primary-button quiz-anchor-button" type="button" data-start-quiz="${animal.id}">
          🎯 퀴즈 풀고 도감에 등록하기
        </button>
      `;
  els.detailBody.innerHTML = `
    <div class="modal-title-row">
      <h2 id="modalTitle">${animal.name}</h2>
      <span class="mini-badge ${isCollected ? "collected-badge" : ""}">${isCollected ? "⭐ 도감 등록 완료" : "퀴즈 대기"}</span>
    </div>
    <div class="animal-region-badges detail-region-badges" aria-label="${animal.name} 환경 분류">
      ${renderAnimalRegionBadges(animal)}
    </div>
    ${renderAnimalEnvironmentNote(animal)}
    <p class="encyclopedia-lede">${observation.intro}</p>
    ${renderObservationChecklist(animal, isCollected)}
    <div class="detail-quiz-anchor">
      ${quizAction}
    </div>
    <div class="encyclopedia-article" id="animalArticle">
      <section class="encyclopedia-section">
        <h3>생김새와 움직임</h3>
        <p data-hint="appearance">${observation.appearance}</p>
        <p data-hint="lifestyle">${observation.lifestyle}</p>
      </section>
      <section class="encyclopedia-section">
        <h3>사는 곳과 생활</h3>
        <p data-hint="habitat">${observation.habitatLife}</p>
      </section>
      <section class="encyclopedia-section">
        <h3>환경에 알맞은 점</h3>
        <p data-hint="adaptation">${observation.habitatLink}</p>
      </section>
    </div>
    ${renderObservationSummary(animal)}
    ${renderQuestionTool()}
    <button class="source-link source-link-button" type="button" data-source-url="${escapeAttribute(animal.source)}">🌐 사진 출처 보기 · 새 창에서 열어요</button>
    <p class="modal-scroll-hint" aria-hidden="true">아래로 내려보면 관찰 단서가 더 있어요.</p>
  `;

  const startButton = els.detailBody.querySelector("[data-start-quiz]");
  if (startButton) {
    startButton.addEventListener("click", () => startQuiz(animal));
    updateQuizStartGate();
  }

  els.detailBody.querySelectorAll("[data-observation-check]").forEach(checkbox => {
    checkbox.addEventListener("change", updateQuizStartGate);
  });

  const retryButton = els.detailBody.querySelector("[data-resume-quiz]");
  if (retryButton) {
    retryButton.addEventListener("click", resumeQuiz);
    if (retryLocked) {
      scheduleRetryButtonUnlock(retryButton, retryDelay);
    }
    window.requestAnimationFrame(() => showHintAndScroll(retryState.hintKey));
  }
}

function renderCollectedAction(animal) {
  return `
    <section class="collected-action-card" aria-label="${animal.name} 도감 등록 완료">
      <div>
        <p class="section-kicker">도감등록 완료</p>
        <strong>이 카드는 이미 내 도감에 들어왔어요.</strong>
        <span>내용을 다시 살펴보거나, 연습용으로 퀴즈를 다시 풀 수 있어요.</span>
      </div>
      <button class="text-button quiz-replay-button" type="button" data-start-quiz="${animal.id}">
        퀴즈 다시 풀기
      </button>
    </section>
  `;
}

function renderQuickFacts(animal, title = "관찰 단서") {
  return `
    <section class="quick-facts" aria-label="${animal.name} ${title}">
      <h3>${title}</h3>
      <dl>
        <div><dt>사는 곳</dt><dd>${escapeHTML(animal.quickFacts.habitat)}</dd></div>
        <div><dt>움직임</dt><dd>${escapeHTML(animal.quickFacts.movement)}</dd></div>
        <div><dt>특징</dt><dd>${escapeHTML(animal.quickFacts.feature)}</dd></div>
      </dl>
    </section>
  `;
}

function renderObservationSummary(animal) {
  return `
    <details class="observation-summary">
      <summary>관찰 요약 열기</summary>
      ${renderQuickFacts(animal, "관찰 요약")}
    </details>
  `;
}

function renderObservationChecklist(animal, isCollected) {
  if (isCollected || readObservationReady(animal.id)) return "";
  return `
    <section class="observation-checklist" aria-label="${animal.name} 관찰 체크">
      <h3>퀴즈 전 관찰 체크</h3>
      <label><input type="checkbox" data-observation-check> 사는 곳을 봤어요</label>
      <label><input type="checkbox" data-observation-check> 움직이는 방법을 봤어요</label>
      <label><input type="checkbox" data-observation-check> 몸의 특징을 봤어요</label>
      <p>세 가지를 확인하면 퀴즈를 시작할 수 있어요.</p>
    </section>
  `;
}

function updateQuizStartGate() {
  const startButton = els.detailBody.querySelector("[data-start-quiz]");
  if (!startButton) return;
  const checks = [...els.detailBody.querySelectorAll("[data-observation-check]")];
  if (!checks.length) {
    startButton.disabled = false;
    return;
  }
  const ready = checks.every(check => check.checked);
  startButton.disabled = !ready;
  startButton.textContent = ready ? "🎯 퀴즈 풀고 도감에 등록하기" : "관찰 체크 3개를 먼저 해요";
  if (ready) {
    const animalId = startButton.dataset.startQuiz;
    saveObservationReady(animalId);
    const checklist = els.detailBody.querySelector(".observation-checklist");
    if (checklist) checklist.remove();
  }
}

function renderQuizRetryPanel(quiz, retryLocked, retryDelay) {
  const progressText = `문제 ${quiz.index + 1} / ${quiz.questions.length}`;
  const buttonLabel = retryLocked ? `⏳ ${Math.ceil(retryDelay / 1000)}초 뒤 다시 도전` : "🎯 다시 문제 풀기";
  return `
    <section class="quiz-retry-panel" aria-live="polite">
      <p class="feedback retry">앗, 틀렸어요! 노란 문장을 다시 읽고 같은 문제에 다시 도전해 보세요.</p>
      <p class="card-point">${progressText}</p>
      <button class="primary-button" type="button" data-resume-quiz ${retryLocked ? "disabled" : ""}>${buttonLabel}</button>
    </section>
  `;
}

function renderQuestionTool() {
  const tool = appConfig.questionTool;
  if (!tool.featureEnabled) return "";

  const label = escapeHTML(tool.label);
  const note = escapeHTML(tool.note);

  if (!tool.enabled) {
    if (!tool.showWhenDisabled) return "";
    return `
      <section class="question-tool question-tool-muted" aria-label="추가 질문 안내">
        <div>
          <h3>🐾 더 궁금한 점 물어볼까요?</h3>
          <p>${note}</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="question-tool" aria-label="추가 질문 도구">
      <div>
        <h3>🐾 더 궁금한 점 물어볼까요?</h3>
        <p>${note}</p>
      </div>
      <button class="question-link" type="button" data-question-url="${escapeAttribute(tool.url)}">
        ${label}
      </button>
    </section>
  `;
}

function hydrateQuestionToolConfig() {
  if (!appConfig.questionTool.featureEnabled) return;

  const urlFromShareLink = getQuestionUrlFromPageUrl();
  const savedUrl = readQuestionToolUrl();
  const runtimeUrl = urlFromShareLink || savedUrl;

  if (!runtimeUrl) return;

  appConfig = normalizeAppConfig({
    questionTool: {
      ...appConfig.questionTool,
      enabled: true,
      url: runtimeUrl,
      note: "🐾 새 창에서 질문 도우미가 열려요."
    }
  });
}

function applyQuestionToolMode() {
  const canOpenSettings = canOpenQuestionSettings();
  if (!els.openSettings) return;
  els.openSettings.hidden = !canOpenSettings;
  els.openSettings.setAttribute("aria-hidden", canOpenSettings ? "false" : "true");
}

function canOpenQuestionSettings() {
  const tool = appConfig.questionTool;
  if (!tool.featureEnabled || !tool.allowTeacherSettings) return false;
  if (tool.hideTeacherSettingsOnSharedPage && isSharedStudentView()) return false;
  return true;
}

function isSharedStudentView() {
  const params = new URLSearchParams(window.location.search);
  return Boolean(getQuestionUrlFromPageUrl() || params.get("set") || params.get("region") || params.get("animals"));
}

function openSettings() {
  if (!canOpenQuestionSettings()) return;
  if (!els.questionUrlInput || !els.settingsMessage || !els.settingsModal) return;
  state.settingsLastFocus = document.activeElement;
  els.questionUrlInput.value = appConfig.questionTool.url || "";
  els.settingsMessage.textContent = "";
  if (els.teacherBanner) els.teacherBanner.hidden = false;
  renderTeacherMissionPanel();
  renderShareLinkPanel();
  enterModalFocus(els.settingsModal);
}

function closeSettings() {
  if (!els.settingsModal) return;
  exitModalFocus(els.settingsModal);
  markSettingsModalSeen();
  if (state.settingsLastFocus && typeof state.settingsLastFocus.focus === "function") {
    state.settingsLastFocus.focus();
  }
}

function hasSeenSettingsModal() {
  try {
    return localStorage.getItem(settingsSeenKey) === "true";
  } catch {
    return false;
  }
}

function markSettingsModalSeen() {
  safeSetStorage(settingsSeenKey, "true");
}

function saveQuestionSettings(event) {
  event.preventDefault();
  if (!els.questionUrlInput || !els.settingsMessage) return;
  const url = normalizeHttpUrl(els.questionUrlInput.value.trim());

  if (!url) {
    els.settingsMessage.textContent = "🤔 올바른 링크인지 확인해 주세요! https://로 시작하는 주소를 넣어야 해요.";
    return;
  }

  saveQuestionToolUrl(url);
  appConfig = normalizeAppConfig({
    questionTool: {
      ...appConfig.questionTool,
      enabled: true,
      url,
      note: "🐾 새 창에서 질문 도우미가 열려요."
    }
  });
  els.questionUrlInput.value = url;
  els.settingsMessage.textContent = "학생용 참여 링크를 저장했어요. 아래 수업용 도감 링크를 학생에게 보내면 같은 질문방이 열려요.";
  renderShareLinkPanel();
}

function clearQuestionSettings() {
  if (!els.questionUrlInput || !els.settingsMessage) return;
  safeRemoveStorage(questionToolStorageKey);
  appConfig = normalizeAppConfig({
    questionTool: {
      ...defaultAppConfig.questionTool,
      featureEnabled: appConfig.questionTool.featureEnabled,
      allowTeacherSettings: appConfig.questionTool.allowTeacherSettings,
      hideTeacherSettingsOnSharedPage: appConfig.questionTool.hideTeacherSettingsOnSharedPage,
      showWhenDisabled: appConfig.questionTool.showWhenDisabled
    }
  });
  els.questionUrlInput.value = "";
  els.settingsMessage.textContent = "이 브라우저의 질문방 설정을 지웠어요.";
  renderShareLinkPanel();
}

function renderShareLinkPanel() {
  if (!els.shareLinkPanel || !els.shareLinkOutput) return;
  const shareLink = buildShareLink(appConfig.questionTool.url);
  els.shareLinkPanel.hidden = false;
  els.shareLinkOutput.value = shareLink;
  renderQrCode(shareLink);
}

async function copyShareLink() {
  if (!els.shareLinkOutput || !els.settingsMessage) return;
  const link = els.shareLinkOutput.value;
  if (!link) return;

  try {
    await navigator.clipboard.writeText(link);
    els.settingsMessage.textContent = "수업용 도감 링크를 복사했어요.";
  } catch {
    els.shareLinkOutput.select();
    document.execCommand("copy");
    els.settingsMessage.textContent = "수업용 도감 링크를 복사했어요.";
  }
}

function renderQrCode(shareLink) {
  if (!els.qrCode || !els.settingsMessage) return;
  els.qrCode.innerHTML = "";
  els.qrCode.removeAttribute("data-url");

  if (!shareLink) return;

  if (typeof qrcode !== "function") {
    els.settingsMessage.textContent = "QR을 만드는 도구를 불러오지 못했어요. 수업용 도감 링크를 복사해 주세요.";
    return;
  }

  const qr = qrcode(0, "M");
  qr.addData(shareLink);
  qr.make();
  els.qrCode.innerHTML = qr.createSvgTag(5, 3, "수업용 도감 QR", "수업용 도감 QR");
  els.qrCode.dataset.url = shareLink;
}

function downloadQrImage() {
  if (!els.qrCode || !els.settingsMessage) return;
  const shareLink = els.qrCode.dataset.url || "";
  if (!shareLink || typeof qrcode !== "function") return;

  const qr = qrcode(0, "M");
  qr.addData(shareLink);
  qr.make();

  const link = document.createElement("a");
  link.href = qr.createDataURL(8, 4);
  link.download = "animal-encyclopedia-qr.gif";
  link.click();
  els.settingsMessage.textContent = "QR 이미지를 저장했어요.";
}

function buildShareLink(questionUrl) {
  const safeUrl = normalizeHttpUrl(questionUrl);
  const includeMissionSelections = shouldIncludeMissionSelectionsInShareLink();
  const current = new URL(window.location.href);
  current.pathname = current.pathname.replace(/[^/]*$/, getShareLinkTargetPath(safeUrl));
  current.search = "";

  if (includeMissionSelections) {
    current.searchParams.set("set", state.missionRegion);
    current.searchParams.set("animals", state.missionAnimalIds.join(","));
    writeMissionSelectionParams(current.searchParams);
  }

  if (safeUrl) current.searchParams.set("questionUrl", safeUrl);
  return current.toString();
}

function getShareLinkTargetPath(questionUrl) {
  const hasQuestionRoom = Boolean(normalizeHttpUrl(questionUrl));
  return hasQuestionRoom ? "index.html" : "no-question.html";
}

function shouldIncludeMissionSelectionsInShareLink() {
  return hasCustomMissionSelections();
}

function hasCustomMissionSelections() {
  return defaultMissionSelections.some(mission => {
    const selected = getSelectedMissionAnimalIds(mission.id);
    const defaults = getDefaultMissionAnimalIds(mission);
    return selected.length !== defaults.length || selected.some((id, index) => id !== defaults[index]);
  });
}

function getQuestionUrlFromPageUrl() {
  const params = new URLSearchParams(window.location.search);
  return normalizeHttpUrl(params.get("questionUrl") || "");
}

function readQuestionToolUrl() {
  try {
    return normalizeHttpUrl(localStorage.getItem(questionToolStorageKey) || "");
  } catch {
    return "";
  }
}

function saveQuestionToolUrl(url) {
  safeSetStorage(questionToolStorageKey, url);
}

function buildObservationDetails(animal) {
  const visibleParts = animal.body.join(", ");

  return {
    intro: `${animal.name}${topicParticle(animal.name)} ${animal.habitat}에서 볼 수 있는 동물입니다. ${lifeBrief(animal)}`,
    appearance: `${animal.name}의 몸에서는 ${visibleParts} 같은 부분이 잘 보입니다. 이 부분들은 몸을 보호하거나 움직이고 먹이를 찾는 데 쓰입니다.`,
    lifestyle: `${animal.move} ${lifestyleExplanation(animal)}`,
    habitatLife: `${animal.habitat}에서 먹이나 쉴 곳을 찾으며 살아갑니다. ${animal.move}`,
    habitatLink: `${animal.relation} 이런 특징 때문에 ${animal.name}${topicParticle(animal.name)} ${animal.habitat}에서 생활하기에 알맞습니다.`
  };
}

function lifeBrief(animal) {
  if (animal.inWater && animal.hasFins) return "물속에서 헤엄치며 생활합니다.";
  if (animal.inWater) return "물가나 물속을 오가며 생활합니다.";
  if (animal.hasWings) return "날아다니며 먹이나 쉴 곳을 찾습니다.";
  if (animal.crawls) return "바닥 가까이에서 기어 다닙니다.";
  if (animal.hasLegs) return "다리로 걷거나 뛰며 생활합니다.";
  return "몸을 움직여 천천히 이동합니다.";
}

function lifestyleExplanation(animal) {
  if (animal.hasFins) {
    return `물속에서 살기 좋아요. 몸을 좌우로 움직이며 앞으로 나아가요.`;
  }
  if (animal.hasWings && animal.inWater) {
    return `물 위에서 쉬거나 먹이를 찾고, 필요할 때 날아가요. 발 모양도 함께 봐요.`;
  }
  if (animal.hasWings) {
    return `나무, 풀, 꽃 사이를 옮겨 다닐 수 있어요. 날개와 다리를 함께 봐요.`;
  }
  if (animal.crawls && !animal.hasLegs) {
    return `다리가 없거나 잘 보이지 않아요. 몸을 구부리며 기어가요.`;
  }
  if (animal.crawls) {
    return `몸을 낮게 두고 기어가요. 바닥이나 벽에 가까이 붙어 움직여요.`;
  }
  if (animal.hasLegs) {
    return `다리로 걷거나 뛰며 먹이를 찾아요. 다리의 길이와 발 모양을 봐요.`;
  }
  return `몸 전체를 움직여 이동해요. 어디에서 먹이를 찾는지 봐요.`;
}

function startQuiz(animal) {
  state.quiz = {
    animal,
    index: 0,
    score: 0,
    answered: null,
    retryState: null,
    questions: buildQuestions(animal)
  };
  clearHintHighlight();
  renderQuiz();
}

function buildQuestions(animal) {
  const moveKey = getMovementKey(animal);
  const finalQuestion = customQuizByAnimal[animal.id] || (
    animal.categories.includes("special")
      ? buildSpecialEnvironmentQuestion(animal)
      : buildDistinctiveFeatureQuestion(animal)
  );

  return [
    {
      text: `${animal.name}${subjectParticle(animal.name)} 주로 사는 곳으로 가장 알맞은 곳은 어디일까요?`,
      correct: animal.habitat,
      hintKey: "habitat",
      options: makeHabitatOptions(animal)
    },
    {
      text: `${animal.name}${topicParticle(animal.name)} 어떻게 이동할까요?`,
      correct: movementOptionLabels[moveKey],
      hintKey: "lifestyle",
      options: makeMovementOptions(moveKey)
    },
    finalQuestion
  ];
}

const customQuizByAnimal = {
  "거미": {
    text: "거미를 다른 주변 동물과 구별하기 쉬운 특징은 무엇일까요?",
    correct: "여덟 개의 다리와 거미줄이 있어요.",
    hintKey: "appearance",
    options: shuffle([
      "여덟 개의 다리와 거미줄이 있어요.",
      "지느러미와 아가미로 물속을 헤엄쳐요.",
      "큰 날개로 꽃 사이를 날아다녀요."
    ])
  },
  "개": {
    text: "개가 우리 주변에서 걷고 뛰며 생활하는 데 알맞은 특징은 무엇일까요?",
    correct: "네 다리와 발, 냄새를 잘 맡는 코가 있어요.",
    hintKey: "appearance",
    options: shuffle([
      "네 다리와 발, 냄새를 잘 맡는 코가 있어요.",
      "껍데기와 넓은 발로 바위에 붙어 있어요.",
      "작은 지느러미로 바다를 천천히 헤엄쳐요."
    ])
  },
  "게": {
    text: "게가 갯벌과 바닷가에서 생활하기에 알맞은 특징은 무엇일까요?",
    correct: "집게와 단단한 껍질이 있고 옆으로 걸어요.",
    hintKey: "adaptation",
    options: shuffle([
      "집게와 단단한 껍질이 있고 옆으로 걸어요.",
      "긴 귀와 뒷다리로 풀밭에서 뛰어요.",
      "날개와 깃털로 숲 사이를 날아요."
    ])
  },
  "소금쟁이": {
    text: "소금쟁이가 물 위를 다니는 데 도움을 주는 특징은 무엇일까요?",
    correct: "가늘고 긴 다리로 물 표면 위에서 몸을 지탱해요.",
    hintKey: "adaptation",
    options: shuffle([
      "가늘고 긴 다리로 물 표면 위에서 몸을 지탱해요.",
      "혹 속 영양분으로 사막에서 오래 지내요.",
      "두꺼운 털과 피부로 추위를 견뎌요."
    ])
  },
  "펭귄": {
    text: "펭귄이 추운 곳과 물속 생활에 알맞은 까닭은 무엇일까요?",
    correct: "빽빽한 깃털과 날개 모양 지느러미가 도움을 줘요.",
    hintKey: "adaptation",
    options: shuffle([
      "빽빽한 깃털과 날개 모양 지느러미가 도움을 줘요.",
      "거미줄을 쳐서 벽과 풀숲에서 먹이를 잡아요.",
      "넓은 앞발로 땅속에 굴을 파요."
    ])
  }
};

function makeHabitatOptions(animal) {
  const correct = animal.habitat;
  return shuffle([correct, ...getHabitatDistractors(animal, correct).slice(0, 2)]);
}

function getHabitatDistractors(animal, correct) {
  const normalized = correct.replace(/\s/g, "");
  let candidates;

  if (correct.includes("사막")) {
    candidates = ["강이나 호수", "극지방", "숲의 나무", "집 주변, 마을"];
  } else if (correct.includes("극지방") || correct.includes("남극")) {
    candidates = ["사막", "갯벌과 바닷가", "풀밭, 꽃밭", "땅속"];
  } else if (correct.includes("바다") || correct.includes("갯벌")) {
    candidates = ["사막", "숲의 나무", "집 주변, 마을", "땅속"];
  } else if (animal.inWater) {
    candidates = ["사막", "숲의 나무", "집 주변, 마을", "극지방"];
  } else if (correct.includes("땅속")) {
    candidates = ["바다", "꽃이 핀 곳", "극지방", "갯벌과 바닷가"];
  } else if (correct.includes("물가")) {
    candidates = ["사막", "극지방", "숲의 나무", "집 주변, 마을"];
  } else {
    candidates = ["바다", "사막", "극지방", "갯벌과 바닷가", "강이나 호수"];
  }

  return candidates.filter(option => option.replace(/\s/g, "") !== normalized);
}

const movementOptionLabels = {
  crawlNoLegs: "다리 없이 몸을 굽혀 기어 이동해요.",
  crawlWithLegs: "다리를 써서 바닥을 기어 이동해요.",
  walkRun: "다리로 걷거나 뛰어 이동해요.",
  fly: "날개로 날아 이동해요.",
  swimFins: "지느러미를 써서 물속을 헤엄쳐요.",
  swimLegs: "물갈퀴나 다리를 써서 물속을 헤엄쳐요.",
  flyAndSwim: "날개로 날고 물에서도 헤엄쳐요."
};

const movementDistractors = {
  crawlNoLegs: ["fly", "swimFins", "walkRun", "swimLegs"],
  crawlWithLegs: ["fly", "swimFins", "walkRun", "crawlNoLegs"],
  walkRun: ["fly", "swimFins", "crawlNoLegs", "flyAndSwim"],
  fly: ["walkRun", "swimFins", "crawlNoLegs", "swimLegs"],
  swimFins: ["walkRun", "fly", "crawlNoLegs", "swimLegs"],
  swimLegs: ["walkRun", "fly", "crawlNoLegs", "swimFins"],
  flyAndSwim: ["fly", "swimFins", "walkRun", "crawlNoLegs"]
};

function getMovementKey(animal) {
  const move = animal.move || "";
  if (move.includes("날") && move.includes("헤엄")) return "flyAndSwim";
  if (move.includes("헤엄")) return animal.hasFins ? "swimFins" : "swimLegs";
  if (move.includes("날")) return "fly";
  if (move.includes("기어")) return animal.hasLegs ? "crawlWithLegs" : "crawlNoLegs";
  if (move.includes("걷") || move.includes("걸") || move.includes("뛰")) return "walkRun";
  if (animal.hasFins) return "swimFins";
  if (animal.hasWings && animal.inWater) return "flyAndSwim";
  if (animal.hasWings) return "fly";
  if (animal.crawls) return animal.hasLegs ? "crawlWithLegs" : "crawlNoLegs";
  if (animal.inWater) return "swimLegs";
  return "walkRun";
}

function makeMovementOptions(correctKey) {
  return shuffle([
    movementOptionLabels[correctKey],
    ...shuffle(movementDistractors[correctKey]).slice(0, 2).map(key => movementOptionLabels[key])
  ]);
}

const specialEnvironmentQuiz = {
  "낙타": "혹과 두꺼운 발바닥이 건조한 사막 생활에 도움을 줘요.",
  "도루묵도마뱀": "뜨거운 낮에는 모래 속에서 지내며 더위를 피할 수 있어요.",
  "사막여우": "큰 귀와 털 많은 발바닥이 더운 사막 생활에 도움을 줘요.",
  "사막 뱀": "모래색 몸과 옆으로 기는 움직임이 사막 생활에 알맞아요.",
  "사막 딱정벌레": "단단한 몸과 등의 돌기가 건조한 사막 생활에 도움을 줘요.",
  "북극곰": "두꺼운 털과 피부가 극지방의 추위를 견디는 데 도움을 줘요.",
  "북극여우": "작은 귀와 두꺼운 털이 몸의 열을 지키는 데 도움을 줘요.",
  "펭귄": "빽빽한 깃털과 날개 모양 지느러미가 추위와 물속 생활에 도움을 줘요.",
  "산양": "발굽과 다리가 가파른 바위에서 균형을 잡는 데 도움을 줘요."
};

const specialEnvironmentDistractors = [
  "얇은 날개로 꽃 사이를 날아다니는 데 알맞아요.",
  "아가미와 지느러미가 물속에서 헤엄치는 데 알맞아요.",
  "끈끈한 발로 축축한 그늘을 천천히 기어 다니는 데 알맞아요.",
  "거미줄을 쳐서 작은 먹이를 잡는 데 알맞아요.",
  "긴 더듬이로 땅 위의 길을 찾는 데 알맞아요."
];

function buildSpecialEnvironmentQuestion(animal) {
  const correct = specialEnvironmentQuiz[animal.id] || animal.relation;
  return {
    text: `${animal.name}${topicParticle(animal.name)} ${animal.habitat}에서 살아가기에 알맞은 특징은 무엇일까요?`,
    correct,
    hintKey: "adaptation",
    options: makeSpecialEnvironmentOptions(correct)
  };
}

function makeSpecialEnvironmentOptions(correct) {
  return shuffle([
    correct,
    ...shuffle(specialEnvironmentDistractors.filter(option => option !== correct)).slice(0, 2)
  ]);
}

function buildDistinctiveFeatureQuestion(animal) {
  const correct = makeDistinctiveFeatureOption(animal);
  return {
    text: `${animal.name}의 생김새와 특징으로 가장 알맞은 것은 무엇일까요?`,
    correct,
    hintKey: "appearance",
    options: makeDistinctiveFeatureOptions(animal, correct)
  };
}

function makeDistinctiveFeatureOptions(animal, correct) {
  const distractors = animals
    .filter(candidate => candidate.id !== animal.id)
    .map(candidate => ({
      option: makeDistinctiveFeatureOption(candidate),
      score: getFeatureDistractorScore(animal, candidate, correct)
    }))
    .filter((item, index, array) => (
      item.option !== correct &&
      array.findIndex(candidate => candidate.option === item.option) === index
    ))
    .sort((first, second) => second.score - first.score)
    .slice(0, 2)
    .map(item => item.option);

  return shuffle([
    correct,
    ...distractors
  ]);
}

function makeDistinctiveFeatureOption(animal) {
  return animal.relation;
}

function getFeatureDistractorScore(target, candidate, correct) {
  let score = 0;
  const option = makeDistinctiveFeatureOption(candidate);
  const sharedTokens = getMeaningfulTokenOverlap(
    getFeatureComparisonText(target, correct),
    getFeatureComparisonText(candidate, option)
  );

  if (!target.categories.some(category => candidate.categories.includes(category))) score += 5;
  if (target.hasFins !== candidate.hasFins) score += 4;
  if (target.hasWings !== candidate.hasWings) score += 4;
  if (target.inWater !== candidate.inWater) score += 3;
  if (target.crawls !== candidate.crawls) score += 3;
  if (target.hasLegs !== candidate.hasLegs) score += 2;
  if (target.habitat === candidate.habitat) score -= 5;
  if (target.move === candidate.move) score -= 5;

  return score - (sharedTokens.length * 3);
}

function getFeatureComparisonText(animal, option) {
  return `${animal.body.join(" ")} ${animal.habitat} ${animal.move} ${option}`;
}

function getMeaningfulTokenOverlap(first, second) {
  const firstTokens = getMeaningfulTokens(first);
  const secondTokens = getMeaningfulTokens(second);
  return firstTokens.filter(token => secondTokens.includes(token));
}

const featureDistractorStopWords = new Set([
  "같은", "것은", "무엇", "도움을", "줘요", "생활", "생활에", "알맞아요",
  "에서", "으로", "하며", "있는", "없는", "몸을", "몸과", "먹이를",
  "움직여요", "이동해요", "다녀요", "찾고", "찾으며"
]);

function getMeaningfulTokens(text) {
  return [...new Set(
    String(text)
      .replace(/[.,]/g, " ")
      .split(/\s+/)
      .filter(token => token.length > 1 && !featureDistractorStopWords.has(token))
  )];
}

function makeOptions(correct, key, currentId) {
  const wrongs = shuffle(
    animals
      .filter(animal => animal.id !== currentId)
      .map(animal => animal[key])
      .filter((value, index, array) => value && value !== correct && array.indexOf(value) === index)
  ).slice(0, 2);
  return shuffle([correct, ...wrongs]);
}

function subjectParticle(value) {
  return hasFinalConsonant(value) ? "이" : "가";
}

function topicParticle(value) {
  return hasFinalConsonant(value) ? "은" : "는";
}

function hasFinalConsonant(value) {
  const last = String(value).trim().charCodeAt(String(value).trim().length - 1);
  if (last < 0xac00 || last > 0xd7a3) return false;
  return (last - 0xac00) % 28 !== 0;
}

function renderQuiz() {
  const quiz = state.quiz;
  if (!quiz) return;
  const question = quiz.questions[quiz.index];
  clearHintHighlight();

  els.detailBody.innerHTML = `
    <div class="modal-title-row">
      <h2 id="modalTitle">${quiz.animal.name} 퀴즈</h2>
      <span class="mini-badge">문제 ${quiz.index + 1} / ${quiz.questions.length}</span>
    </div>
    <div class="quiz-box">
      <h3>${question.text}</h3>
      <div class="quiz-options">
        ${question.options.map(option => {
          const isCorrect = option === question.correct;
          let className = "answer-button";
          let disabled = false;

          if (quiz.answered) {
            disabled = true;
            if (isCorrect) className += " correct";
          }

          return `<button type="button" class="${className}" data-answer="${escapeAttribute(option)}" ${disabled ? "disabled" : ""}>${option}</button>`;
        }).join("")}
      </div>
      ${quiz.answered
         ? renderFeedback(true, quiz.index === quiz.questions.length - 1)
         : `<p class="card-point">도감 내용을 떠올리며 골라 봐요.</p>`}
    </div>
  `;

  els.detailBody.querySelectorAll("[data-answer]").forEach(button => {
    button.addEventListener("click", () => answerQuestion(button.dataset.answer));
  });

  const next = els.detailBody.querySelector("[data-next]");
  if (next) next.addEventListener("click", nextQuestion);
}

function renderFeedback(correct, isLast) {
  if (correct) {
    return `
      <p class="feedback good">맞았어요! 관찰을 정말 잘했네요.</p>
      <button type="button" class="next-button" data-next>${isLast ? "결과 보기" : "다음 문제"}</button>
    `;
  } else {
    return `
      <p class="feedback retry">틀렸어요. 다시 한번 도전해 보세요!</p>
    `;
  }
}

function answerQuestion(answer) {
  const quiz = state.quiz;
  const question = quiz.questions[quiz.index];

  if (answer === question.correct) {
    playSound("correct");
    quiz.answered = answer;
    quiz.score += 1;
    quiz.retryState = null;
    clearHintHighlight();
    renderQuiz();
  } else {
    playSound("wrong");
    quiz.retryState = {
      hintKey: question.hintKey,
      unlockAt: Date.now() + 4000
    };
    renderAnimalInfo(quiz.animal);
  }
}

function resumeQuiz() {
  const quiz = state.quiz;
  if (!quiz) return;

  quiz.retryState = null;
  quiz.answered = null;
  clearHintHighlight();
  renderQuiz();
}

function scheduleRetryButtonUnlock(button, delay) {
  window.setTimeout(() => {
    if (!button.isConnected) return;
    button.disabled = false;
    button.textContent = "🎯 다시 문제 풀기";
  }, delay);
}

function showHintAndScroll(hintKey) {
  if (!hintKey) return;

  clearHintHighlight();
  const hintParagraph = document.querySelector(`[data-hint="${hintKey}"]`);
  if (!hintParagraph) return;

  hintParagraph.classList.add("hint-highlight");
  window.setTimeout(() => {
    if (!hintParagraph.isConnected) return;
    hintParagraph.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
}

function clearHintHighlight() {
  document.querySelectorAll(".hint-highlight").forEach(el => {
    el.classList.remove("hint-highlight");
  });
}

function nextQuestion() {
  const quiz = state.quiz;
  if (quiz.index < quiz.questions.length - 1) {
    quiz.index += 1;
    quiz.answered = null;
    quiz.retryState = null;
    renderQuiz();
    return;
  }
  finishQuiz();
}

function showCatchAnimation(animal, onComplete) {
  const motionQuery = typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  if (motionQuery && motionQuery.matches) {
    playSound("catchSuccess");
    onComplete();
    return;
  }

  const overlay = document.createElement("div");
  overlay.className = "catch-overlay";
  overlay.setAttribute("aria-hidden", "true");

  const stage = document.createElement("div");
  stage.className = "catch-stage";

  const animalShell = document.createElement("div");
  animalShell.className = "catch-animal-shell";

  const animalImage = document.createElement("img");
  animalImage.className = "catch-animal-image";
  animalImage.alt = `${animal.name} 사진`;
  animalImage.decoding = "async";

  const detailImageSrc = els.detailImage ? (els.detailImage.currentSrc || els.detailImage.getAttribute("src") || "") : "";
  setStandaloneImage(animal, animalImage, detailImageSrc);
  animalShell.append(animalImage);

  const message = document.createElement("p");
  message.className = "catch-message";
  message.textContent = "포획 완료!";

  const ballLayer = document.createElement("div");
  ballLayer.className = "catch-ball-layer";

  const orbit = document.createElement("div");
  orbit.className = "catch-ball-orbit";

  const flash = document.createElement("div");
  flash.className = "catch-flash";

  const ball = document.createElement("div");
  ball.className = "catch-ball";

  const ballButton = document.createElement("span");
  ballButton.className = "catch-ball-button";
  ball.append(ballButton);

  const sparkles = document.createElement("div");
  sparkles.className = "catch-sparkles";
  for (let index = 0; index < 6; index += 1) {
    sparkles.append(document.createElement("span"));
  }

  orbit.append(flash, ball, sparkles);
  ballLayer.append(orbit);
  stage.append(animalShell, ballLayer, message);
  overlay.append(stage);
  document.body.append(overlay);

  const timeouts = [];
  let finished = false;

  const schedule = (delay, callback) => {
    const timeoutId = window.setTimeout(callback, delay);
    timeouts.push(timeoutId);
  };

  const cleanup = () => {
    if (finished) return;
    finished = true;
    timeouts.forEach(timeoutId => window.clearTimeout(timeoutId));
    overlay.remove();
    onComplete();
  };

  requestAnimationFrame(() => {
    overlay.classList.add("active");
  });

  playSound("catchStart");
  schedule(600, () => overlay.classList.add("is-flashing"));
  schedule(900, () => overlay.classList.add("is-absorbing"));
  schedule(1300, () => overlay.classList.add("is-shaking"));
  schedule(2200, () => {
    overlay.classList.add("is-success");
    playSound("catchSuccess");
  });
  schedule(2700, cleanup);
}

function finishQuiz() {
  const quiz = state.quiz;
  const wasCollected = state.collected.has(quiz.animal.id);

  showCatchAnimation(quiz.animal, () => {
    state.collected.add(quiz.animal.id);
    saveCollected();
    updateProgress();
    renderAnimals();

    els.detailBody.innerHTML = `
      <section class="quiz-complete-card">
        <div class="quiz-complete-photo">
          <img src="${escapeAttribute(els.detailImage.currentSrc || els.detailImage.getAttribute("src") || quiz.animal.image)}" alt="${quiz.animal.name} 사진">
        </div>
        <div>
          <p class="section-kicker">도감등록 완료</p>
          <h2 id="modalTitle">${quiz.animal.name} 카드 등록!</h2>
          <p>${wasCollected ? "이미 등록한 카드예요. 다시 퀴즈를 풀며 특징을 확인했습니다." : "새 카드가 내 도감에 들어왔어요. 모든 퀴즈를 정확히 맞혔습니다!"}</p>
        </div>
      </section>
      <button class="primary-button" type="button" data-review>카드 내용 보기</button>
    `;
    els.detailBody.querySelector("[data-review]").addEventListener("click", () => renderAnimalInfo(quiz.animal));
    if (!wasCollected) {
      window.setTimeout(showNewMilestoneRewards, 650);
    }
  });
}

function startNewRound() {
  const criterion = state.game.criterion;
  state.criterion = criterion;
  const yes = shuffle(animals.filter(animal => animal[criterion])).slice(0, 4);
  const no = shuffle(animals.filter(animal => !animal[criterion])).slice(0, 4);
  const round = shuffle([...yes, ...no]);
  state.game.round = round.map(animal => animal.id);
  state.game.placements = Object.fromEntries(round.map(animal => [animal.id, "pool"]));
  state.game.selected = null;
  state.game.checked = false;
  els.gameFeedback.textContent = "";
  updateGameHints();
  renderGameBoard();
  renderAnimals();
}

function updateGameHints() {
  const criterion = criteria.find(item => item.id === state.game.criterion);
  els.yesHint.textContent = `${criterion.label} - 그렇다`;
  els.noHint.textContent = `${criterion.label} - 그렇지 않다`;
}

function renderGameBoard() {
  const zones = {
    pool: els.gamePool,
    yes: els.gameYes,
    no: els.gameNo
  };

  Object.values(zones).forEach(zone => {
    zone.innerHTML = "";
  });

  state.game.round.forEach(id => {
    const animal = animals.find(item => item.id === id);
    const place = state.game.placements[id] || "pool";
    zones[place].append(createGameToken(animal));
  });

  updateGameScore();
  document.querySelectorAll(".drop-zone").forEach(zone => {
    zone.classList.remove("correct-zone", "needs-work");
  });
}

function createGameToken(animal) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "game-token";
  button.draggable = true;
  button.dataset.animal = animal.id;
  if (state.game.selected === animal.id) button.classList.add("selected");

  if (state.game.checked && state.game.placements[animal.id] !== "pool") {
    const correct = isGamePlacementCorrect(animal.id);
    button.classList.add(correct ? "correct-token" : "wrong-token");
  }

  const image = document.createElement("img");
  image.alt = `${animal.name} 사진`;
  image.decoding = "async";
  setStandaloneImage(animal, image);

  const label = document.createElement("span");
  label.textContent = animal.name;

  button.append(image, label);
  button.addEventListener("dragstart", event => {
    event.dataTransfer.setData("text/plain", animal.id);
  });
  button.addEventListener("click", event => {
    // 토큰 선택 후 같은 칸 클릭 이벤트로 바로 해제되는 문제를 막아요.
    event.stopPropagation();
    state.game.selected = state.game.selected === animal.id ? null : animal.id;
    renderGameBoard();
  });
  return button;
}

function moveGameToken(animalId, answer) {
  if (!["pool", "yes", "no"].includes(answer)) return;
  if (!state.game.round.includes(animalId)) return;
  state.game.placements[animalId] = answer;
  state.game.selected = null;
  state.game.checked = false;
  els.gameFeedback.textContent = "";
  renderGameBoard();
}

function checkGame() {
  state.game.checked = true;
  const placed = state.game.round.filter(id => state.game.placements[id] !== "pool");
  const correct = placed.filter(id => isGamePlacementCorrect(id));
  renderGameBoard();

  const yesWrong = state.game.round.some(id => state.game.placements[id] === "yes" && !isGamePlacementCorrect(id));
  const noWrong = state.game.round.some(id => state.game.placements[id] === "no" && !isGamePlacementCorrect(id));
  document.querySelector('[data-answer="yes"]').classList.add(yesWrong ? "needs-work" : "correct-zone");
  document.querySelector('[data-answer="no"]').classList.add(noWrong ? "needs-work" : "correct-zone");

  if (placed.length < state.game.round.length) {
    playSound("wrong");
    els.gameFeedback.textContent = `아직 ${state.game.round.length - placed.length}장을 옮겨야 해요. 모든 카드를 두 무리 중 하나에 넣어 봐요.`;
    updateGameScore(correct.length);
    return;
  }

  const criterion = criteria.find(item => item.id === state.game.criterion);
  playSound(correct.length === state.game.round.length ? "correct" : "wrong");
  els.gameFeedback.textContent = correct.length === state.game.round.length
    ? `모두 맞았어요. "${criterion.label}" 기준으로 겹치거나 빠진 동물 없이 분류했어요.`
    : `${correct.length}장을 맞혔어요. 빨간 테두리 카드는 몸의 단서와 이동 방법을 다시 보고 옮겨 보세요.`;
  updateGameScore(correct.length);
}

function isGamePlacementCorrect(animalId) {
  const animal = animals.find(item => item.id === animalId);
  const place = state.game.placements[animalId];
  return (animal[state.game.criterion] && place === "yes") || (!animal[state.game.criterion] && place === "no");
}

function updateGameScore(score) {
  const placed = state.game.round.filter(id => state.game.placements[id] !== "pool");
  const value = typeof score === "number" ? score : placed.length;
  els.gameScore.textContent = `${value} / ${state.game.round.length}`;
}

async function setImage(animal, image, frame, size = "detail") {
  frame.classList.add("loading");
  setImagePlaceholder(image, animal, "사진 준비 중");
  frame.innerHTML = `<div class="paw-loading"><div class="paw-prints"><span>🐾</span><span>🐾</span><span>🐾</span></div><span>사진을 불러오는 중…</span></div>`;
  frame.append(image);
  try {
    const sources = await getImageSources(animal, "", size);
    if (!sources.length) throw new Error("no image");
    applyImageFallback(image, animal, sources, () => {
      frame.innerHTML = `<div class="error-message"><span class="error-icon">😿</span>사진을 불러오지 못했어요</div>`;
    });
    frame.textContent = "";
    frame.append(image);
  } catch {
    frame.innerHTML = `<div class="error-message"><span class="error-icon">😿</span>사진을 불러오지 못했어요</div>`;
    image.alt = `${animal.name} 사진을 불러올 수 없어요.`;
  } finally {
    frame.classList.remove("loading");
  }
}

async function setStandaloneImage(animal, image, preferredSource = "") {
  setImagePlaceholder(image, animal, "사진 준비 중");
  try {
    const sources = await getImageSources(animal, preferredSource, "thumb");
    if (!sources.length) throw new Error("no image");
    applyImageFallback(image, animal, sources, () => {
      setImagePlaceholder(image, animal, "사진 없음");
    });
  } catch {
    setImagePlaceholder(image, animal, "사진 없음");
    image.alt = `${animal.name} 사진을 불러오지 못했어요.`;
  }
}

function applyImageFallback(image, animal, sources, onError) {
  let index = 0;
  const tryNext = () => {
    const source = sources[index];
    index += 1;
    if (!source) {
      onError?.();
      return;
    }
    applyResolvedImage(image, animal, source, tryNext);
  };
  tryNext();
}

function applyResolvedImage(image, animal, source, onError) {
  image.onerror = () => {
    image.onerror = null;
    onError?.();
  };
  image.alt = `${animal.name} 사진`;
  image.src = source;
}

function setImagePlaceholder(image, animal, label) {
  image.onerror = null;
  image.alt = `${animal.name} ${label}`;
  image.src = createImagePlaceholder(animal.name, label);
}

function createImagePlaceholder(name, label) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
      <rect width="320" height="240" fill="#f3f4f6" />
      <text x="50%" y="48%" text-anchor="middle" font-size="24" font-family="sans-serif" fill="#6b7280">${escapeSvgText(name)}</text>
      <text x="50%" y="62%" text-anchor="middle" font-size="16" font-family="sans-serif" fill="#9ca3af">${escapeSvgText(label)}</text>
    </svg>
  `)}`;
}

function escapeSvgText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function getImageSources(animal, preferredSource = "", size = "thumb") {
  const local = getLocalImagePath(animal, size);
  const sources = [preferredSource, local, animal.image].filter(Boolean);
  if (animal.image) return dedupeSources(sources);

  const key = `${animal.wikiLang}:${animal.wikiTitle}`;
  if (imageCache.has(key)) return dedupeSources([...sources, imageCache.get(key)]);
  try {
    const response = await fetch(`https://${animal.wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(animal.wikiTitle)}`);
    if (!response.ok) throw new Error("image lookup failed");
    const data = await response.json();
    const source = data.thumbnail?.source || "";
    const page = data.content_urls?.desktop?.page;
    if (page) animal.source = page;
    if (source) animal.image = source;
    imageCache.set(key, source);
    return dedupeSources([...sources, source]);
  } catch {
    imageCache.set(key, "");
    return dedupeSources(sources);
  }
}

function getLocalImagePath(animal, size) {
  if (!appConfig.localImages?.enabled) return "";
  const configuredPath = appConfig.localImages?.paths?.[animal.id]?.[size];
  const directory = size === "detail" ? "details" : "thumbs";
  return configuredPath || `./images/${directory}/${encodeURIComponent(animal.id)}.jpg`;
}

function dedupeSources(sources) {
  return [...new Set(sources.filter(Boolean))];
}

function updateProgress() {
  const count = getCollectedProgramCount();
  const total = getProgramTotal();
  els.collectedCount.textContent = count;
  if (els.totalCount) els.totalCount.textContent = total;
  els.progressFill.style.width = `${Math.round((count / total) * 100)}%`;
  if (els.stickyProgressLabel) {
    els.stickyProgressLabel.textContent = `🐾 ${count} / ${total}`;
  }
  if (els.stickyProgressFill) {
    els.stickyProgressFill.style.width = `${Math.round((count / total) * 100)}%`;
  }
  renderMissionPanel();
  renderFilters();
}

function returnToCurrentMission(shouldRender = true) {
  activateMissionRegion(state.missionRegion, { shouldRender });
}

function getNextMissionFilter() {
  const next = milestoneFilters.find(filter => {
    const progress = getFilterProgress(filter.id);
    return progress.collected < progress.total;
  });
  return next ? next.id : "all";
}

function getStageStatus(filter, nextMissionId) {
  if (filter.id === "all") {
    const isComplete = getCollectedProgramCount() === getProgramTotal();
    return { status: isComplete ? "complete" : "master", label: isComplete ? "완료" : "마스터" };
  }

  const progress = getFilterProgress(filter.id);
  if (progress.total > 0 && progress.collected === progress.total) {
    return { status: "complete", label: "완료" };
  }

  const currentIndex = milestoneFilters.findIndex(item => item.id === nextMissionId);
  const filterIndex = milestoneFilters.findIndex(item => item.id === filter.id);
  if (filter.id === state.missionRegion) return { status: "current", label: "진행 중" };
  if (filter.id === nextMissionId) return { status: "current", label: "진행 중" };
  if (currentIndex >= 0 && filterIndex === currentIndex + 1) return { status: "next", label: "다음" };
  if (currentIndex >= 0 && filterIndex > currentIndex + 1) return { status: "locked", label: "예고" };
  return { status: "next", label: "미리보기" };
}

function getFilterProgress(filterId) {
  const list = getAnimalsForFilter(filterId);
  const collected = list.filter(animal => state.collected.has(animal.id)).length;
  return { collected, total: list.length };
}

function getCompletedMilestones() {
  const completed = milestoneFilters
    .filter(filter => {
      const progress = getFilterProgress(filter.id);
      return progress.total > 0 && progress.collected === progress.total;
    })
    .map(filter => filter.id);

  if (getCollectedProgramCount() === getProgramTotal()) {
    completed.push("all");
  }

  return completed;
}

function getCollectedProgramCount() {
  return getProgramAnimals().filter(animal => state.collected.has(animal.id)).length;
}

function showNewMilestoneRewards() {
  const completed = getCompletedMilestones();
  const next = completed.find(id => !state.completedMilestones.has(id));
  if (!next) return;

  state.completedMilestones.add(next);
  saveCompletedMilestones();
  showReward(next);
}

function showReward(filterId) {
  if (!els.rewardModal || !els.rewardContent) return;
  const filter = filters.find(item => item.id === filterId) || filters[0];
  const progress = getFilterProgress(filterId);
  const isAll = filterId === "all";
  const rewardCard = els.rewardContent.closest(".reward-card");
  if (rewardCard) rewardCard.classList.toggle("master-reward-card", isAll);
  const thumbnails = getAnimalsForFilter(filterId)
    .filter(animal => state.collected.has(animal.id))
    .slice(0, 12);

  els.rewardContent.innerHTML = isAll
    ? renderMasterReward(thumbnails)
    : renderRegionReward(filter, progress, thumbnails);
  if (els.rewardNextRegion) els.rewardNextRegion.hidden = isAll;
  if (els.rewardReset) els.rewardReset.hidden = !isAll;
  playSound(isAll ? "master" : "region");
  enterModalFocus(els.rewardModal);
}

function renderRegionReward(filter, progress, thumbnails) {
  return `
    <div class="reward-burst reward-burst-soft" aria-hidden="true">${Array.from({ length: 8 }, () => "<span></span>").join("")}</div>
    <p class="section-kicker">지역 완성 보상</p>
    <h2 id="rewardTitle">🎉 ${filter.label} 도감 완성!</h2>
    <p>${progress.total}마리를 모두 등록했어요. 다음 지역으로 넘어가 볼까요?</p>
    <div class="reward-collage" aria-label="등록한 동물 미리보기">
      ${thumbnails.map(animal => `<span>${animal.name}</span>`).join("")}
    </div>
  `;
}

function renderMasterReward(thumbnails) {
  return `
    <div class="reward-burst reward-burst-master" aria-hidden="true">${Array.from({ length: 16 }, () => "<span></span>").join("")}</div>
    <div class="master-reward-emblem" aria-hidden="true">🏆</div>
    <p class="section-kicker">최종 보상</p>
    <h2 id="rewardTitle">도감 마스터 달성!</h2>
    <p class="master-reward-count">54 / 54</p>
    <p>모든 동물 카드를 등록했어요. 이제 전체 도감을 다시 둘러보며 특징을 비교해 볼 수 있습니다.</p>
    <div class="reward-collage master-collage" aria-label="등록한 동물 미리보기">
      ${thumbnails.map(animal => `<span>${animal.name}</span>`).join("")}
    </div>
  `;
}

function closeReward() {
  if (els.rewardModal && !els.rewardModal.hidden) {
    exitModalFocus(els.rewardModal);
  }
}

function goToNextRewardRegion() {
  const nextMissionId = getNextMissionFilter();
  closeReward();
  if (nextMissionId === "all") {
    state.catalogMode = "all";
    state.filter = "all";
  } else {
    activateMissionRegion(nextMissionId, { shouldRender: false, updateUrl: true });
  }
  setView("catalog");
  renderMissionPanel();
  renderFilters();
  renderAnimals();
}

function resetProgressFromReward() {
  closeReward();
  resetProgress(true);
}

function saveCompletedMilestones() {
  safeSetStorage(completedMilestonesKey, JSON.stringify([...state.completedMilestones]));
}

function resetProgress(skipConfirm = false) {
  const ok = skipConfirm || confirm("공용 태블릿의 등록 기록을 모두 지울까요? 다음 반 수업을 위해 도감 진행도와 지역 보상을 초기화합니다.");
  if (!ok) return;
  state.collected.clear();
  state.completedMilestones.clear();
  state.observationReady.clear();
  saveCollected();
  saveCompletedMilestones();
  safeRemoveStorage(observationReadyKey);
  updateProgress();
  returnToCurrentMission(false);
  renderMissionPanel();
  renderFilters();
  renderAnimals();
}

function readObservationReady(animalId) {
  return state.observationReady.has(animalId);
}

function saveObservationReady(animalId) {
  if (!animalIds.has(animalId)) return;
  state.observationReady.add(animalId);
  safeSetStorage(observationReadyKey, JSON.stringify([...state.observationReady]));
}

function readCollected() {
  return readStoredIds(storageKey)
    .map(id => collectedIdAliases[id] || id)
    .filter(id => animalIds.has(id));
}

function saveCollected() {
  safeSetStorage(storageKey, JSON.stringify([...state.collected]));
}

function readStoredIds(key, validIds) {
  try {
    const savedIds = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(savedIds)) return [];
    return savedIds.filter(id => !validIds || validIds.has(id));
  } catch {
    return [];
  }
}

function readBoolean(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    return value === "true";
  } catch {
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    showToast("진행 기록을 저장할 수 없어요. 사생활 보호 모드나 저장 공간을 확인해 주세요.");
    return false;
  }
}

function safeRemoveStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    showToast("저장된 설정을 지울 수 없어요. 브라우저 저장 권한을 확인해 주세요.");
    return false;
  }
}

function showToast(message) {
  if (!els.appToast) {
    window.alert(message);
    return;
  }
  window.clearTimeout(toastTimer);
  els.appToast.textContent = message;
  els.appToast.hidden = false;
  toastTimer = window.setTimeout(() => {
    els.appToast.hidden = true;
  }, 4200);
}

function debounce(callback, delay) {
  let timer = 0;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), delay);
  };
}

function toggleSound() {
  state.soundMuted = !state.soundMuted;
  safeSetStorage(soundMutedKey, String(state.soundMuted));
  updateSoundToggle();
  if (!state.soundMuted) playSound("select");
}

function updateSoundToggle() {
  if (!els.soundToggle) return;
  els.soundToggle.setAttribute("aria-pressed", String(!state.soundMuted));
  els.soundToggle.setAttribute("aria-label", state.soundMuted ? "효과음 꺼짐" : "효과음 켜짐");
  els.soundToggle.setAttribute("title", state.soundMuted ? "효과음 꺼짐" : "효과음 켜짐");
  els.soundToggle.textContent = state.soundMuted ? "🔇" : "🔊";
}

function ensureAudioContext() {
  if (state.soundMuted) return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

function playSound(type) {
  const context = ensureAudioContext();
  if (!context) return;

  const patterns = {
    select: [[520, 0, 0.05]],
    correct: [[660, 0, 0.08], [880, 0.08, 0.1]],
    wrong: [[240, 0, 0.11], [190, 0.11, 0.12]],
    catchStart: [[420, 0, 0.08], [620, 0.08, 0.12]],
    catchSuccess: [[720, 0, 0.08], [960, 0.08, 0.1], [1200, 0.18, 0.12]],
    region: [[620, 0, 0.08], [820, 0.08, 0.08], [1040, 0.16, 0.16]],
    master: [[520, 0, 0.08], [780, 0.08, 0.08], [1040, 0.16, 0.08], [1320, 0.24, 0.18]]
  };

  (patterns[type] || patterns.select).forEach(([frequency, delay, duration]) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + delay;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.08, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  });
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function wikiUrl(lang, title) {
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, "_")}`;
}

function normalizeAppConfig(config) {
  const questionTool = {
    ...defaultAppConfig.questionTool,
    ...((config && config.questionTool) || {})
  };
  const url = normalizeHttpUrl(questionTool.url);

  return {
    localImages: {
      enabled: Boolean(config.localImages?.enabled),
      paths: config.localImages?.paths || {}
    },
    questionTool: {
      ...questionTool,
      url,
      featureEnabled: Boolean(questionTool.featureEnabled),
      enabled: Boolean(questionTool.featureEnabled && questionTool.enabled && url),
      allowTeacherSettings: Boolean(questionTool.allowTeacherSettings),
      hideTeacherSettingsOnSharedPage: Boolean(questionTool.hideTeacherSettingsOnSharedPage),
      showWhenDisabled: Boolean(questionTool.showWhenDisabled)
    }
  };
}

function normalizeHttpUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

let pendingQuestionUrl = null;
let pendingSourceUrl = null;

function openGuideModal() {
  if (els.guideModal) enterModalFocus(els.guideModal);
}

function closeGuideModal() {
  if (els.guideModal) exitModalFocus(els.guideModal);
}

function openQrExpand() {
  if (!els.qrExpandModal || !els.qrExpandImage) return;
  const qrSvg = els.qrCode ? els.qrCode.innerHTML : "";
  if (!qrSvg) return;
  els.qrExpandImage.innerHTML = qrSvg;
  enterModalFocus(els.qrExpandModal);
}

function closeQrExpand() {
  if (els.qrExpandModal) exitModalFocus(els.qrExpandModal);
}

function downloadQrExpandImage() {
  if (!els.qrCode || !els.settingsMessage) return;
  const shareLink = els.qrCode.dataset.url || "";
  if (!shareLink || typeof qrcode !== "function") return;

  const qr = qrcode(0, "M");
  qr.addData(shareLink);
  qr.make();

  const link = document.createElement("a");
  link.href = qr.createDataURL(8, 4);
  link.download = "animal-encyclopedia-qr.gif";
  link.click();
  if (els.settingsMessage) els.settingsMessage.textContent = "QR 이미지를 저장했어요.";
}

function confirmNavigateToQuestion() {
  if (els.confirmPopup) els.confirmPopup.hidden = true;
  if (pendingQuestionUrl) {
    window.open(pendingQuestionUrl, "_blank", "noopener,noreferrer");
    pendingQuestionUrl = null;
  }
}

function closeConfirmPopup() {
  if (els.confirmPopup) els.confirmPopup.hidden = true;
  pendingQuestionUrl = null;
}

function openSourceConfirm(url) {
  pendingSourceUrl = normalizeHttpUrl(url);
  if (!pendingSourceUrl) return;
  if (els.sourceConfirmModal) {
    els.sourceConfirmModal.hidden = false;
    return;
  }
  window.open(pendingSourceUrl, "_blank", "noopener,noreferrer");
  pendingSourceUrl = null;
}

function confirmNavigateToSource() {
  if (els.sourceConfirmModal) els.sourceConfirmModal.hidden = true;
  if (pendingSourceUrl) {
    window.open(pendingSourceUrl, "_blank", "noopener,noreferrer");
    pendingSourceUrl = null;
  }
}

function closeSourceConfirm() {
  if (els.sourceConfirmModal) els.sourceConfirmModal.hidden = true;
  pendingSourceUrl = null;
}

init();
