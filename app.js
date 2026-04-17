const filters = [
  { id: "all", label: "전체" },
  { id: "around", label: "우리 주변" },
  { id: "land", label: "땅" },
  { id: "water", label: "물" },
  { id: "special", label: "특별한 환경" }
];

const criteria = [
  { id: "hasLegs", label: "다리가 있는가?" },
  { id: "hasWings", label: "날개가 있는가?" },
  { id: "hasFins", label: "지느러미가 있는가?" },
  { id: "inWater", label: "물에서 사는가?" },
  { id: "crawls", label: "기어서 이동하는가?" }
];

const defaultAppConfig = {
  questionTool: {
    featureEnabled: true,
    enabled: false,
    url: "",
    label: "더 궁금한 점 물어보기",
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
  "참돔": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Pagrus_major_Red_seabream_ja01.jpg/330px-Pagrus_major_Red_seabream_ja01.jpg",
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
  makeAnimal("나비", "나비", ["land"], "풀밭, 꽃밭", "날개로 날아요.", ["큰 날개", "더듬이", "가느다란 다리"], "동물 카드로 생김새를 관찰해요.", "날개가 있어 꽃 사이를 날며 생활해요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: false, crawls: false }, "40쪽"),
  makeAnimal("참새", "참새", ["land"], "나무, 들판, 마을", "날개로 날고 다리로 걸어요.", ["날개", "부리", "다리"], "참새는 다리와 날개가 있는 동물이에요.", "날개가 있어 빠르게 이동하고 부리로 먹이를 먹어요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: false, crawls: false }, "41쪽"),
  makeAnimal("토끼", "토끼", ["land"], "풀밭, 숲 가장자리", "다리로 뛰어 이동해요.", ["털", "긴 귀", "튼튼한 뒷다리"], "토끼는 털로 덮여 있고 다리가 있어요.", "긴 귀와 튼튼한 다리가 주변을 살피고 빠르게 도망치는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "41쪽"),
  makeAnimal("호랑이", "호랑이", ["land"], "숲, 산", "네 다리로 걷고 뛰어요.", ["털", "발톱", "날카로운 이"], "동물 카드에서 생김새를 비교할 수 있어요.", "강한 다리와 발톱으로 땅에서 먹이를 찾아요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: false, crawls: false }, "40쪽"),
  makeAnimal("참돔", "참돔", ["water"], "바다", "지느러미로 헤엄쳐요.", ["지느러미", "비늘", "아가미"], "물에서 사는 동물 카드로 관찰해요.", "비늘과 지느러미는 물속 생활에 알맞아요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "40쪽"),
  makeAnimal("붕어", "붕어", ["water"], "강이나 호수", "지느러미로 헤엄쳐요.", ["지느러미", "비늘", "아가미"], "붕어는 지느러미와 비늘이 있어요.", "지느러미를 이용해 물속에서 헤엄쳐 이동해요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "41쪽, 49쪽"),
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
  makeAnimal("수달", "수달", ["water"], "강가나 호숫가", "물갈퀴가 있는 발로 헤엄쳐요.", ["물갈퀴", "털", "긴 꼬리"], "물에서 사는 동물의 예예요.", "물갈퀴가 있는 발은 물속에서 헤엄치는 데 알맞아요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "34쪽, 48쪽"),
  makeAnimal("다슬기", "다슬기", ["water"], "강이나 호수 바닥", "물속 바닥을 기어서 이동해요.", ["껍데기", "부드러운 몸", "발"], "강이나 호수에 사는 동물의 예예요.", "단단한 껍데기와 발이 물속 바닥 생활에 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: true }, "48쪽"),
  makeAnimal("송사리", "송사리", ["water"], "강이나 호수", "지느러미로 헤엄쳐요.", ["지느러미", "작은 몸", "아가미"], "강이나 호수에 사는 동물의 예예요.", "작은 몸과 지느러미가 얕은 물에서 움직이는 데 알맞아요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "48쪽"),
  makeAnimal("소금쟁이", "소금쟁이", ["water"], "연못이나 하천의 물 위", "긴 다리로 물 위를 미끄러지듯 다녀요.", ["긴 다리", "가느다란 몸", "짧은 더듬이"], "비상 AR 자료에 있는 물가 동물 사례예요.", "가늘고 긴 다리는 물 표면 위에서 몸을 지탱하고 이동하는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "비상 AR"),
  makeAnimal("피라미", "피라미", ["water"], "강이나 하천", "지느러미로 헤엄쳐요.", ["지느러미", "비늘", "날씬한 몸"], "비상 AR 자료에 있는 민물고기 사례예요.", "날씬한 몸과 지느러미는 흐르는 물에서 헤엄치는 데 알맞아요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "비상 AR"),
  makeAnimal("왜가리", "왜가리", ["water", "land"], "논, 하천, 물가", "긴 다리로 얕은 물을 걸어요.", ["긴 목", "긴 다리", "뾰족한 부리"], "비상 AR 자료에 있는 물가 새 사례예요.", "긴 다리와 뾰족한 부리는 얕은 물에서 먹이를 찾는 데 도움을 줘요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: true, crawls: false }, "비상 AR"),
  makeAnimal("물방개", "물방개", ["water"], "연못이나 논의 물속", "털이 난 뒷다리로 헤엄쳐요.", ["다리 6개", "단단한 몸", "털 난 뒷다리"], "비상 AR 자료에 있는 물속 곤충 사례예요.", "길고 털이 난 뒷다리는 물속에서 노처럼 움직이는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "비상 AR"),
  makeAnimal("메기", "메기", ["water"], "강이나 호수", "지느러미로 헤엄쳐요.", ["지느러미", "수염", "아가미"], "강이나 호수에 사는 동물의 예예요.", "수염은 흐린 물속에서 주변을 느끼는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "48쪽"),
  makeAnimal("개구리", "개구리", ["water", "land"], "연못, 논, 물가", "다리로 뛰고 물갈퀴로 헤엄쳐요.", ["다리", "물갈퀴", "축축한 피부"], "강이나 호수에 사는 동물의 예예요.", "물갈퀴가 있는 발은 물속 이동에 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "49쪽"),
  makeAnimal("청둥오리", "청둥오리", ["water"], "강이나 호수", "날개로 날고 물갈퀴 발로 헤엄쳐요.", ["날개", "물갈퀴", "부리"], "강이나 호수에 사는 동물의 예예요.", "물갈퀴가 있는 발은 물 위와 물속에서 움직이는 데 도움을 줘요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: true, crawls: false }, "49쪽"),
  makeAnimal("갈매기", "갈매기", ["water"], "바닷가와 항구", "날개로 바다 위를 날아다녀요.", ["날개", "부리", "물갈퀴 발"], "비상 AR 자료에 있는 바닷가 새 사례예요.", "날개와 물갈퀴 발은 바닷가에서 날고 물 위에 머무는 데 도움을 줘요.", { hasLegs: true, hasWings: true, hasFins: false, inWater: true, crawls: false }, "비상 AR"),
  makeAnimal("조개", "조개", ["water"], "바다, 갯벌", "물속 바닥에서 천천히 움직여요.", ["껍데기", "부드러운 몸", "발"], "바다와 갯벌에 사는 동물의 예예요.", "껍데기는 부드러운 몸을 보호하는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: true }, "50쪽, 51쪽"),
  makeAnimal("게", "게", ["water"], "갯벌과 바닷가", "다섯 쌍의 다리로 옆으로 걸어요.", ["집게", "다리 10개", "단단한 껍질"], "갯벌과 바닷가에서 사는 동물의 예예요.", "단단한 껍질과 집게는 갯벌에서 몸을 보호하고 먹이를 찾는 데 도움을 줘요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "50쪽, 57쪽, 비상 AR"),
  makeAnimal("전복", "전복", ["water"], "바다 바위", "넓은 발로 바위에 붙어 천천히 기어가요.", ["구멍 있는 껍데기", "넓은 발", "부드러운 몸"], "비상 AR 자료에 있는 바다 동물 사례예요.", "넓은 발과 단단한 껍데기는 바위에 붙어 생활하는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: true }, "비상 AR"),
  makeAnimal("소라", "소라", ["water"], "바다 바닥", "물속 바닥을 기어서 이동해요.", ["껍데기", "부드러운 몸", "발"], "바다에 사는 동물의 예예요.", "나선 모양 껍데기는 몸을 보호해요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: true }, "50쪽"),
  makeAnimal("돌돔", "돌돔", ["water"], "바다", "지느러미로 헤엄쳐요.", ["지느러미", "비늘", "줄무늬"], "바다에 사는 동물의 예예요.", "지느러미와 비늘은 바다에서 헤엄치는 데 알맞아요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "50쪽"),
  makeAnimal("해삼", "해삼", ["water"], "바다 바닥", "물속 바닥을 천천히 기어가요.", ["길쭉한 몸", "다리 없음", "부드러운 몸"], "바다에 사는 동물의 예예요.", "바닥에 붙어 천천히 움직이며 생활해요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: true }, "50쪽"),
  makeAnimal("돌고래", "돌고래", ["water"], "바다", "지느러미와 꼬리로 헤엄쳐요.", ["지느러미", "매끈한 몸", "꼬리"], "바다에 사는 동물의 예예요.", "매끈한 몸과 지느러미가 빠르게 헤엄치는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "51쪽"),
  makeAnimal("오징어", "오징어", ["water"], "바다", "몸에서 물을 뿜어 빠르게 움직여요.", ["긴 팔", "빨판", "부드러운 몸"], "바다에 사는 동물의 예예요.", "팔의 빨판은 먹이를 붙잡는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: false, inWater: true, crawls: false }, "51쪽"),
  makeAnimal("바다거북", "바다거북", ["water"], "바다", "넓은 앞다리로 헤엄쳐요.", ["넓은 앞다리", "등딱지", "부리 모양 입"], "바다에 사는 동물의 예예요.", "넓은 앞다리는 물속에서 노처럼 움직여요.", { hasLegs: true, hasWings: false, hasFins: false, inWater: true, crawls: false }, "51쪽"),
  makeAnimal("고등어", "고등어", ["water"], "바다", "지느러미로 헤엄쳐요.", ["지느러미", "비늘", "매끈한 몸"], "바다에 사는 동물의 예예요.", "지느러미와 매끈한 몸은 물속 이동에 알맞아요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "51쪽"),
  makeAnimal("해마", { title: "Seahorse", lang: "en" }, ["water"], "바다", "작은 지느러미를 움직여 천천히 헤엄쳐요.", ["작은 지느러미", "말처럼 생긴 머리", "말린 꼬리"], "바다에서 이동하는 방법을 생김새와 연결해 생각해요.", "작은 지느러미와 꼬리가 바닷속에서 몸을 조절하는 데 도움을 줘요.", { hasLegs: false, hasWings: false, hasFins: true, inWater: true, crawls: false }, "51쪽")
];

const collectedIdAliases = {
  "오색딱따구리": "딱따구리",
  "황제펭귄": "펭귄",
  "칠게": "게"
};
const animalIds = new Set(animals.map(animal => animal.id));
const storageKey = "animal-encyclopedia-collected-v1";
const settingsSeenKey = "animal-encyclopedia-settings-seen-v1";
const imageCache = new Map();
const state = {
  view: "catalog",
  filter: "all",
  query: "",
  criterion: "hasLegs",
  collected: new Set(readCollected()),
  selectedAnimal: null,
  game: {
    criterion: "hasLegs",
    round: [],
    placements: {},
    selected: null,
    checked: false
  },
  quiz: null,
  lastFocus: null,
  settingsLastFocus: null
};

const els = {
  modeButtons: document.querySelectorAll("[data-view]"),
  catalogView: document.querySelector("#catalogView"),
  gameView: document.querySelector("#gameView"),
  filterTabs: document.querySelector("#filterTabs"),
  animalGrid: document.querySelector("#animalGrid"),
  resultCount: document.querySelector("#resultCount"),
  collectedCount: document.querySelector("#collectedCount"),
  totalCount: document.querySelector("#totalCount"),
  progressFill: document.querySelector("#progressFill"),
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
  roomTemplateLink: document.querySelector("#roomTemplateLink")
};

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
    point,
    relation,
    page,
    image: imageSources[name],
    source: wikiUrl(wikiInfo.lang, wikiInfo.title),
    ...flags
  };
}

function init() {
  hydrateQuestionToolConfig();
  applyQuestionToolMode();
  els.totalCount.textContent = animals.length;
  if (els.roomTemplateLink) {
    els.roomTemplateLink.href = magicRoomTemplateUrl;
  }
  bindViewTabs();
  renderFilters();
  renderAnimals();
  renderGameCriterionOptions();
  startNewRound();
  updateProgress();

  els.searchInput.addEventListener("input", event => {
    state.query = event.target.value.trim();
    renderAnimals();
  });

  if (els.closeDetail) {
    els.closeDetail.addEventListener("click", closeDetail);
  }
  if (els.detailModal) {
    els.detailModal.addEventListener("click", event => {
      if (event.target === els.detailModal) closeDetail();
    });
  }
  if (els.backToCatalog) {
    els.backToCatalog.addEventListener("click", () => setView("catalog"));
  }
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (!els.settingsModal.hidden) {
        closeSettings();
      } else if (els.detailModal && !els.detailModal.hidden) {
        closeDetail();
      }
    }
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

  // 첫 방문 시 안내 — URL이 없으면 설정 버튼만 강조, 모달 자동 오픈은 URL 있을 때만
  if (!hasSeenSettingsModal() && canOpenQuestionSettings()) {
    const hasUrl = appConfig.questionTool.url;
    if (hasUrl) {
      setTimeout(() => openSettings(), 500);
    } else {
      const btn = els.openSettings;
      if (btn) {
        btn.classList.add("first-visit-highlight");
        setTimeout(() => btn.classList.remove("first-visit-highlight"), 4000);
      }
    }
  }
}

function bindViewTabs() {
  els.modeButtons.forEach(button => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
}

function setView(view) {
  state.view = view;
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
  }
  els.modeButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });
}

function renderFilters() {
  els.filterTabs.innerHTML = "";
  filters.forEach(filter => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = filter.label;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(filter.id === state.filter));
    if (filter.id === state.filter) button.classList.add("active");
    button.addEventListener("click", () => {
      state.filter = filter.id;
      renderFilters();
      renderAnimals();
    });
    els.filterTabs.append(button);
  });
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
  els.animalGrid.innerHTML = "";
  els.resultCount.textContent = `${visible.length}마리`;

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
    setImage(animal, image, imageFrame);

    const cardBody = document.createElement("div");
    cardBody.className = "animal-card-body";
    cardBody.innerHTML = `
      <div class="animal-name-row">
        <h3>${animal.name}</h3>
        ${state.collected.has(animal.id) ? '<span class="mini-badge collected-badge">등록</span>' : ""}
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
  return animals.filter(animal => {
    const inFilter = state.filter === "all" || animal.categories.includes(state.filter);
    const searchText = [
      animal.name,
      animal.habitat,
      animal.move,
      animal.point,
      animal.relation,
      animal.body.join(" ")
    ].join(" ").toLowerCase();
    return inFilter && (!query || searchText.includes(query));
  });
}

function openAnimal(animal) {
  state.selectedAnimal = animal.id;
  state.quiz = null;
  els.detailImage.removeAttribute("src");
  els.detailImage.alt = `${animal.name} 사진`;
  els.detailPhoto.textContent = "사진 준비 중";
  els.detailPhoto.append(els.detailImage);
  setImage(animal, els.detailImage, els.detailPhoto);
  renderAnimalInfo(animal);
  els.detailModal.hidden = false;
  renderAnimals();
}

function closeDetail() {
  state.selectedAnimal = null;
  els.detailModal.hidden = true;
  renderAnimals();
}

function renderAnimalInfo(animal) {
  const isCollected = state.collected.has(animal.id);
  const observation = buildObservationDetails(animal);
  els.detailBody.innerHTML = `
    <div class="modal-title-row">
      <h2 id="modalTitle">${animal.name}</h2>
      <span class="mini-badge ${isCollected ? "collected-badge" : ""}">${isCollected ? "⭐ 도감 등록 완료" : "퀴즈 대기"}</span>
    </div>
    <p class="encyclopedia-lede">${observation.intro}</p>
    <div class="encyclopedia-article">
      <section class="encyclopedia-section">
        <h3>생김새와 움직임</h3>
        <p>${observation.appearance}</p>
        <p>${observation.lifestyle}</p>
      </section>
      <section class="encyclopedia-section">
        <h3>사는 곳과 생활</h3>
        <p>${observation.habitatLife}</p>
      </section>
      <section class="encyclopedia-section">
        <h3>환경에 알맞은 점</h3>
        <p>${observation.habitatLink}</p>
      </section>
    </div>
    ${renderQuestionTool()}
    <a class="source-link" href="${animal.source}" target="_blank" rel="noreferrer">사진 출처 보기</a>
    <button class="primary-button" type="button" data-start-quiz="${animal.id}">
      🎯 퀴즈 풀고 도감에 등록하기
    </button>
  `;
  els.detailBody.querySelector("[data-start-quiz]").addEventListener("click", () => startQuiz(animal));
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
          <h3>더 궁금한 점이 있나요?</h3>
          <p>${note}</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="question-tool" aria-label="추가 질문 도구">
      <div>
        <h3>더 궁금한 점이 있나요?</h3>
        <p>${note}</p>
      </div>
      <a class="question-link" href="${escapeAttribute(tool.url)}" target="_blank" rel="noopener noreferrer">
        ${label}
      </a>
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
      note: "새 창에서 질문 도우미가 열려요."
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
  return Boolean(getQuestionUrlFromPageUrl());
}

function openSettings() {
  if (!canOpenQuestionSettings()) return;
  if (!els.questionUrlInput || !els.settingsMessage || !els.settingsModal) return;
  state.settingsLastFocus = document.activeElement;
  els.questionUrlInput.value = appConfig.questionTool.url || "";
  els.settingsMessage.textContent = "";
  renderShareLinkPanel();
  els.settingsModal.hidden = false;
  els.questionUrlInput.focus();
}

function closeSettings() {
  if (!els.settingsModal) return;
  els.settingsModal.hidden = true;
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
  try {
    localStorage.setItem(settingsSeenKey, "true");
  } catch {
    // ignore
  }
}

function saveQuestionSettings(event) {
  event.preventDefault();
  if (!els.questionUrlInput || !els.settingsMessage) return;
  const url = normalizeHttpUrl(els.questionUrlInput.value.trim());

  if (!url) {
    els.settingsMessage.textContent = "학생용 참여 링크를 확인해 주세요. https://로 시작하는 주소를 넣어야 해요.";
    return;
  }

  saveQuestionToolUrl(url);
  appConfig = normalizeAppConfig({
    questionTool: {
      ...appConfig.questionTool,
      enabled: true,
      url,
      note: "새 창에서 질문 도우미가 열려요."
    }
  });
  els.questionUrlInput.value = url;
  els.settingsMessage.textContent = "학생용 참여 링크를 저장했어요. 아래 수업용 도감 링크를 학생에게 보내면 같은 질문방이 열려요.";
  renderShareLinkPanel();
}

function clearQuestionSettings() {
  if (!els.questionUrlInput || !els.settingsMessage) return;
  localStorage.removeItem(questionToolStorageKey);
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
  els.shareLinkPanel.hidden = !shareLink;
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
  if (!safeUrl) return "";

  const current = new URL(window.location.href);
  current.searchParams.set("questionUrl", safeUrl);
  return current.toString();
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
  localStorage.setItem(questionToolStorageKey, url);
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
    questions: buildQuestions(animal)
  };
  renderQuiz();
}

function buildQuestions(animal) {
  const moveKey = getMovementKey(animal);
  const featureKey = getFeatureKey(animal);
  return [
    {
      text: `${animal.name}${subjectParticle(animal.name)} 주로 사는 곳으로 가장 알맞은 곳은 어디일까요?`,
      correct: animal.habitat,
      options: makeHabitatOptions(animal)
    },
    {
      text: `${animal.name}${topicParticle(animal.name)} 어떻게 이동할까요?`,
      correct: movementOptionLabels[moveKey],
      options: makeMovementOptions(moveKey)
    },
    {
      text: `${animal.name}의 특징으로 가장 알맞은 것은 무엇일까요?`,
      correct: featureOptionLabels[featureKey],
      options: makeFeatureOptions(featureKey)
    }
  ];
}

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
    ...movementDistractors[correctKey].slice(0, 2).map(key => movementOptionLabels[key])
  ]);
}

const featureOptionLabels = {
  fins: "지느러미가 있는 동물이에요.",
  wings: "날개가 있는 동물이에요.",
  noLegsCrawl: "다리가 없어 몸을 굽혀 기어 이동해요.",
  waterLife: "물가나 물속에서 주로 살아요.",
  legsLife: "다리로 걷거나 뛰며 생활해요."
};

const featureDistractors = {
  fins: ["wings", "noLegsCrawl", "legsLife", "waterLife"],
  wings: ["fins", "noLegsCrawl", "waterLife", "legsLife"],
  noLegsCrawl: ["wings", "fins", "legsLife", "waterLife"],
  waterLife: ["wings", "fins", "legsLife", "noLegsCrawl"],
  legsLife: ["wings", "fins", "noLegsCrawl", "waterLife"]
};

function getFeatureKey(animal) {
  if (animal.hasFins) return "fins";
  if (animal.hasWings) return "wings";
  if (animal.crawls && !animal.hasLegs) return "noLegsCrawl";
  if (animal.inWater) return "waterLife";
  return "legsLife";
}

function makeFeatureOptions(correctKey) {
  return shuffle([
    featureOptionLabels[correctKey],
    ...featureDistractors[correctKey].slice(0, 2).map(key => featureOptionLabels[key])
  ]);
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
  const question = quiz.questions[quiz.index];
  
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
          const isChosenWrong = quiz.wrongAnswers && quiz.wrongAnswers.has(option);
          
          let className = "answer-button";
          let disabled = false;
          
          if (quiz.answered) {
            disabled = true;
            if (isCorrect) className += " correct";
          } else {
            if (isChosenWrong) {
               className += " wrong";
               disabled = true;
            }
          }
          return `<button type="button" class="${className}" data-answer="${escapeAttribute(option)}" ${disabled ? "disabled" : ""}>${option}</button>`;
        }).join("")}
      </div>
      ${quiz.answered 
         ? renderFeedback(true, quiz.index === quiz.questions.length - 1) 
         : (quiz.wrongAnswers && quiz.wrongAnswers.size > 0 
            ? renderFeedback(false, false)
            : `<p class="card-point">도감 내용을 떠올리며 골라 봐요.</p>`)}
    </div>
  `;

  els.detailBody.querySelectorAll("[data-answer]").forEach(button => {
    button.addEventListener("click", () => answerQuestion(button.dataset.answer));
  });

  const next = els.detailBody.querySelector("[data-next]");
  if (next) next.addEventListener("click", nextQuestion);

  // 자동 스크롤 UX 개선
  if (quiz.answered || (quiz.wrongAnswers && quiz.wrongAnswers.size > 0)) {
    setTimeout(() => {
      const box = els.detailBody.querySelector(".quiz-box");
      if (box) box.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 50);
  }
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
    quiz.answered = answer;
    quiz.score += 1;
  } else {
    quiz.wrongAnswers = quiz.wrongAnswers || new Set();
    quiz.wrongAnswers.add(answer);
  }
  
  renderQuiz();
}

function nextQuestion() {
  const quiz = state.quiz;
  if (quiz.index < quiz.questions.length - 1) {
    quiz.index += 1;
    quiz.answered = null;
    quiz.wrongAnswers = new Set();
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

  schedule(600, () => overlay.classList.add("is-flashing"));
  schedule(900, () => overlay.classList.add("is-absorbing"));
  schedule(1300, () => overlay.classList.add("is-shaking"));
  schedule(2200, () => overlay.classList.add("is-success"));
  schedule(2700, cleanup);
}

function finishQuiz() {
  const quiz = state.quiz;

  showCatchAnimation(quiz.animal, () => {
    state.collected.add(quiz.animal.id);
    saveCollected();
    updateProgress();
    renderAnimals();

    els.detailBody.innerHTML = `
      <div class="modal-title-row">
        <h2 id="modalTitle">도감 등록 성공</h2>
        <span class="mini-badge">미션 완료!</span>
      </div>
      <p>${quiz.animal.name} 카드가 도감에 새롭게 등록되었어요. 모든 퀴즈를 정확히 맞혔습니다!</p>
      <button class="primary-button" type="button" data-review>카드 내용 보기</button>
    `;
    els.detailBody.querySelector("[data-review]").addEventListener("click", () => renderAnimalInfo(quiz.animal));
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
    els.gameFeedback.textContent = `아직 ${state.game.round.length - placed.length}장을 옮겨야 해요. 모든 카드를 두 무리 중 하나에 넣어 봐요.`;
    updateGameScore(correct.length);
    return;
  }

  const criterion = criteria.find(item => item.id === state.game.criterion);
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

async function setImage(animal, image, frame) {
  frame.classList.add("loading");
  setImagePlaceholder(image, animal, "사진 준비 중");
  try {
    const source = await getImageSource(animal);
    if (!source) throw new Error("no image");
    applyResolvedImage(image, animal, source, () => {
      frame.textContent = `${animal.name} 사진`;
    });
    frame.textContent = "";
    frame.append(image);
  } catch {
    setImagePlaceholder(image, animal, "사진 없음");
    image.alt = `${animal.name} 사진을 불러오지 못했어요.`;
    frame.textContent = `${animal.name} 사진`;
  } finally {
    frame.classList.remove("loading");
  }
}

async function setStandaloneImage(animal, image, preferredSource = "") {
  setImagePlaceholder(image, animal, "사진 준비 중");
  try {
    const source = await getImageSource(animal, preferredSource);
    if (!source) throw new Error("no image");
    applyResolvedImage(image, animal, source, () => {
      setImagePlaceholder(image, animal, "사진 없음");
    });
  } catch {
    setImagePlaceholder(image, animal, "사진 없음");
    image.alt = `${animal.name} 사진을 불러오지 못했어요.`;
  }
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

async function getImageSource(animal, preferredSource = "") {
  if (preferredSource) return preferredSource;
  if (animal.image) return animal.image;
  const key = `${animal.wikiLang}:${animal.wikiTitle}`;
  if (imageCache.has(key)) return imageCache.get(key);
  const response = await fetch(`https://${animal.wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(animal.wikiTitle)}`);
  if (!response.ok) throw new Error("image lookup failed");
  const data = await response.json();
  const source = data.thumbnail?.source || "";
  const page = data.content_urls?.desktop?.page;
  if (page) animal.source = page;
  if (source) animal.image = source;
  imageCache.set(key, source);
  return source;
}

function updateProgress() {
  const count = state.collected.size;
  els.collectedCount.textContent = count;
  els.progressFill.style.width = `${Math.round((count / animals.length) * 100)}%`;
}

function resetProgress() {
  const ok = confirm("등록한 카드 기록을 모두 지울까요?");
  if (!ok) return;
  state.collected.clear();
  saveCollected();
  updateProgress();
  renderAnimals();
}

function readCollected() {
  try {
    const savedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return savedIds
      .map(id => collectedIdAliases[id] || id)
      .filter(id => animalIds.has(id));
  } catch {
    return [];
  }
}

function saveCollected() {
  localStorage.setItem(storageKey, JSON.stringify([...state.collected]));
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

init();
