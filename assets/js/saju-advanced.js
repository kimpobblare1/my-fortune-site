/**
 * saju-advanced.js
 * 십성(十星) 계산, 신강/신약 간단 판단, 대운(大運) 계산
 *
 * ⚠️ 간략화 안내
 * - 십성은 지지(地支)의 "지장간(숨은 천간)"까지 따지지 않고, 지지 자체의 오행·음양으로 간단 계산합니다.
 *   (정통 만세력은 지장간 본기를 기준으로 더 정교하게 따집니다)
 * - 신강/신약은 비겁·인성 vs 식상·재성·관성의 글자 수 비교로 단순화했습니다.
 *   (정통 판단은 월지의 계절감·통근 여부 등을 함께 고려하는 훨씬 정교한 영역입니다)
 * - 대운수(시작 나이)는 절기까지의 날짜수 ÷ 3 공식을 사용하며, 절기 날짜는 평균값 기준입니다.
 */

// 오행 상생(생하는 관계): 목→화→토→금→수→목
var ELEMENT_GENERATES = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" };
// 오행 상극(극하는 관계): 목→토, 화→금, 토→수, 금→목, 수→화
var ELEMENT_OVERCOMES = { 목: "토", 화: "금", 토: "수", 금: "목", 수: "화" };

var TEN_GOD_NAMES = {
  same_same: "비견", same_diff: "겁재",
  gen_same: "식신", gen_diff: "상관",
  ov_same: "편재", ov_diff: "정재",
  ovby_same: "편관", ovby_diff: "정관",
  genby_same: "편인", genby_diff: "정인",
};

var TEN_GOD_GROUP = {
  비견: "비겁", 겁재: "비겁",
  식신: "식상", 상관: "식상",
  편재: "재성", 정재: "재성",
  편관: "관성", 정관: "관성",
  편인: "인성", 정인: "인성",
};

var TEN_GOD_DESC = {
  비겁: "자존감과 주체성, 독립적으로 밀고 나가는 힘",
  식상: "표현력과 창의성, 새로운 걸 만들어내는 힘",
  재성: "현실 감각과 재물 운용 능력",
  관성: "책임감과 조직 적응력, 명예를 추구하는 힘",
  인성: "학습력과 직관, 보호받고 채우는 힘",
};

// 기둥 위치가 전통적으로 상징하는 것 (초년~노년의 시기, 어떤 인간관계 영역인지)
var PILLAR_MEANING = {
  year: { label: "연주(年柱)", period: "초년기(~20대 초반)", relation: "조상·사회적 기반", desc: "내가 태어난 환경, 집안의 기운과 초년의 흐름을 보여줘요." },
  month: { label: "월주(月柱)", period: "청년기(20~30대)", relation: "부모·형제", desc: "부모님과의 관계, 사회생활을 시작하는 시기의 흐름을 보여줘요. 사주에서 가장 비중이 큰 자리로도 여겨져요." },
  day: { label: "일주(日柱)", period: "중년기(30~50대)", relation: "나 자신·배우자", desc: "일간(나 자신)이 위치한 자리이자, 배우자와의 관계를 함께 보는 자리예요." },
  hour: { label: "시주(時柱)", period: "노년기(50대~)", relation: "자녀·말년", desc: "자녀와의 관계, 노후의 흐름을 보여줘요." },
};

// 십성 그룹별로 잘 맞는 직업/활동 성향 (참고용)
var TEN_GOD_CAREER = {
  비겁: "자영업, 창업, 프리랜서처럼 스스로 결정하고 책임지는 일",
  식상: "기획, 마케팅, 콘텐츠 제작, 강의처럼 표현하고 만들어내는 일",
  재성: "영업, 유통, 재무, 투자처럼 현실적인 성과와 숫자를 다루는 일",
  관성: "공무원, 대기업, 조직 관리처럼 규율과 책임이 명확한 일",
  인성: "연구, 교육, 상담처럼 배우고 전달하는 일",
};

/** 신강/신약 + 가장 두드러진 십성 그룹을 조합해 종합 총평 문단 생성 */
function getOverallSummary(tenGods, strength) {
  const groupCount = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 };
  [tenGods.year, tenGods.month, tenGods.day, tenGods.hour].forEach((p) => {
    if (!p) return;
    [p.stemGod, p.branchGod].forEach((god) => {
      if (!god || god === "일간(나)") return;
      const group = TEN_GOD_GROUP[god];
      if (group) groupCount[group]++;
    });
  });

  const topGroup = Object.keys(groupCount).reduce((a, b) => (groupCount[a] >= groupCount[b] ? a : b));
  const isSingang = strength.level.startsWith("신강");

  return {
    topGroup,
    text:
      `사주 전체에서 ${topGroup}(${TEN_GOD_DESC[topGroup]}) 기운이 가장 두드러져요. ` +
      `${isSingang ? "일간의 힘이 강한 편이라 스스로 판단하고 밀어붙이는 데 강점이 있고, " : "일간의 힘이 상대적으로 약한 편이라 주변과 조화를 이루며 나아가는 데 강점이 있고, "}` +
      `${TEN_GOD_CAREER[topGroup]}과(와) 잘 맞는 편이에요.`,
    careerHint: TEN_GOD_CAREER[topGroup],
  };
}

// 십성 하나하나의 구체적인 의미 (결과 화면에 그대로 노출)
var TEN_GOD_DETAIL = {
  비견: "나와 대등한 동료·경쟁자를 뜻해요. 자립심이 강하고 스스로 결정하는 걸 좋아하지만, 많으면 고집스러워지거나 협업에서 부딪힐 수 있어요.",
  겁재: "나와 비슷하지만 은근히 경쟁하는 기운이에요. 추진력과 승부욕이 강점이지만, 과하면 무리한 지출이나 갈등으로 이어질 수 있어요.",
  식신: "차분하게 표현하고 만들어내는 힘이에요. 여유롭고 안정적인 창의성, 먹고사는 재주(전문성)를 상징해요.",
  상관: "톡톡 튀는 표현력과 임기응변이에요. 언변·끼가 좋고 트렌드에 민감하지만, 과하면 구설수나 반항적 태도로 보일 수 있어요.",
  편재: "통이 크고 기회를 잘 잡는 재물운이에요. 사업·투자·영업처럼 변동성 있는 돈의 흐름에 강해요.",
  정재: "꾸준하고 성실하게 쌓는 재물운이에요. 월급·고정 수입처럼 안정적인 돈의 흐름에 강하고, 계획적인 소비를 선호해요.",
  편관: "일명 '칠살', 강한 책임과 압박 속에서 성과를 내는 힘이에요. 위기 대응력은 좋지만 스트레스나 긴장감이 따라올 수 있어요.",
  정관: "원칙과 규율을 지키는 안정적인 리더십이에요. 조직 생활, 신뢰가 필요한 자리에서 강점을 보여요.",
  편인: "독특한 직관과 남다른 학습 방식이에요. 창의적인 통찰은 좋지만, 혼자만의 생각에 갇히기 쉬운 면도 있어요.",
  정인: "정통적인 학습력과 보호받는 기운이에요. 안정적으로 배우고 인정받는 흐름에 강해요.",
};

// 대운 십성이 신강/신약과 만났을 때의 유불리 (간략화된 통변 원리)
// 신강(일간이 강함) → 힘을 '쓰는' 식상·재성·관성이 들어오면 균형이 맞아 순탄한 편
// 신약(일간이 약함) → 힘을 '채워주는' 비겁·인성이 들어오면 균형이 맞아 순탄한 편
function getDaeunFavorability(group, isSingang) {
  const drainGroups = ["식상", "재성", "관성"];
  const helpGroups = ["비겁", "인성"];

  if (isSingang) {
    if (drainGroups.includes(group)) {
      return { tag: "순탄", note: "강한 일간의 힘을 잘 써먹는 시기라, 노력한 만큼 결과로 이어지기 좋은 흐름이에요." };
    }
    return { tag: "과다 주의", note: "이미 강한 기운이 더 강해지는 시기라, 고집이나 정체로 흐르지 않게 균형이 필요해요." };
  } else {
    if (helpGroups.includes(group)) {
      return { tag: "순탄", note: "약했던 일간에 힘이 채워지는 시기라, 자신감 있게 추진하기 좋은 흐름이에요." };
    }
    return { tag: "체력 안배", note: "일간의 힘을 더 쓰는 시기라, 무리하지 않고 페이스 조절이 필요한 흐름이에요." };
  }
}

/** 일간(day stem) 대비 대상 글자의 십성을 계산 */
function getTenGod(dayStemIdx, targetElement, targetIsYang) {
  const dayElement = STEM_ELEMENT[dayStemIdx];
  const dayIsYang = dayStemIdx % 2 === 0;
  const sameYinYang = dayIsYang === targetIsYang;

  let key;
  if (targetElement === dayElement) {
    key = sameYinYang ? "same_same" : "same_diff";
  } else if (ELEMENT_GENERATES[dayElement] === targetElement) {
    key = sameYinYang ? "gen_same" : "gen_diff";
  } else if (ELEMENT_OVERCOMES[dayElement] === targetElement) {
    key = sameYinYang ? "ov_same" : "ov_diff";
  } else if (ELEMENT_OVERCOMES[targetElement] === dayElement) {
    key = sameYinYang ? "ovby_same" : "ovby_diff";
  } else {
    // ELEMENT_GENERATES[targetElement] === dayElement
    key = sameYinYang ? "genby_same" : "genby_diff";
  }
  return TEN_GOD_NAMES[key];
}

/** 사주 전체(연/월/일/시 천간+지지)에 십성을 매겨서 반환 */
function getTenGodsForSaju(saju) {
  const dayStemIdx = STEMS.indexOf(saju.pillars.day.stem);

  function stemGod(pillar) {
    if (!pillar) return null;
    const idx = STEMS.indexOf(pillar.stem);
    if (idx === STEMS.indexOf(saju.pillars.day.stem) && pillar === saju.pillars.day) return "일간(나)";
    return getTenGod(dayStemIdx, pillar.stemElement, idx % 2 === 0);
  }
  function branchGod(pillar) {
    if (!pillar) return null;
    const idx = BRANCHES.indexOf(pillar.branch);
    return getTenGod(dayStemIdx, pillar.branchElement, idx % 2 === 0);
  }

  return {
    year: { stemGod: stemGod(saju.pillars.year), branchGod: branchGod(saju.pillars.year) },
    month: { stemGod: stemGod(saju.pillars.month), branchGod: branchGod(saju.pillars.month) },
    day: { stemGod: "일간(나)", branchGod: branchGod(saju.pillars.day) },
    hour: saju.pillars.hour
      ? { stemGod: stemGod(saju.pillars.hour), branchGod: branchGod(saju.pillars.hour) }
      : null,
  };
}

/** 아주 단순화한 신강/신약 판단 (참고용) */
function getSinStrength(tenGods) {
  let helper = 0; // 비겁 + 인성 (일간을 돕는 기운)
  let drainer = 0; // 식상 + 재성 + 관성 (일간의 힘을 쓰는 기운)

  [tenGods.year, tenGods.month, tenGods.day, tenGods.hour].forEach((p) => {
    if (!p) return;
    [p.stemGod, p.branchGod].forEach((god) => {
      if (!god || god === "일간(나)") return;
      const group = TEN_GOD_GROUP[god];
      if (group === "비겁" || group === "인성") helper++;
      else if (group) drainer++;
    });
  });

  const total = helper + drainer;
  const ratio = total ? helper / total : 0.5;
  const level = ratio >= 0.5 ? "신강(身强)" : "신약(身弱)";
  return { helper, drainer, ratio: Math.round(ratio * 100), level };
}

// ============================================================
//  대운(大運) 계산
// ============================================================

/** 60갑자 인덱스 역산: stemIdx, branchIdx로부터 0~59 인덱스 계산 */
function getGanjiIndex(stemIdx, branchIdx) {
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stemIdx && i % 12 === branchIdx) return i;
  }
  return 0;
}

/** 특정 연도 기준, 12절기 평균 날짜의 Date 배열 생성 (연도-1 ~ 연도+1 범위) */
function buildTermDates(centerYear) {
  const dates = [];
  [centerYear - 1, centerYear, centerYear + 1].forEach((y) => {
    SOLAR_TERMS.forEach((t) => {
      dates.push(new Date(y, t.month - 1, t.day));
    });
  });
  dates.sort((a, b) => a - b);
  return dates;
}

/** 대운수(시작 나이) 및 방향 계산 */
function getDaeunInfo(year, month, day, yearStemIsYang, isMale) {
  const birthDate = new Date(year, month - 1, day);
  // 양간+남자 또는 음간+여자 → 순행 / 음간+남자 또는 양간+여자 → 역행
  const isForward = (yearStemIsYang && isMale) || (!yearStemIsYang && !isMale);

  const termDates = buildTermDates(year);
  let prevTerm = null;
  let nextTerm = null;
  for (let i = 0; i < termDates.length; i++) {
    if (termDates[i] <= birthDate) prevTerm = termDates[i];
    if (termDates[i] > birthDate && !nextTerm) nextTerm = termDates[i];
  }

  const msPerDay = 86400000;
  let daysToTerm;
  if (isForward) {
    daysToTerm = Math.round((nextTerm - birthDate) / msPerDay);
  } else {
    daysToTerm = Math.round((birthDate - prevTerm) / msPerDay);
  }

  let daeunSu = Math.round(daysToTerm / 3);
  if (daeunSu < 1) daeunSu = 1;

  return { isForward, daeunSu };
}

/** 대운 리스트 생성 (기본 8개 = 80년치) */
function getDaeunList(saju, isMale, count) {
  const n = count || 8;
  const yearStemIdx = STEMS.indexOf(saju.pillars.year.stem);
  const yearStemIsYang = yearStemIdx % 2 === 0;

  const { isForward, daeunSu } = getDaeunInfo(
    saju.rawYear, saju.rawMonth, saju.rawDay, yearStemIsYang, isMale
  );

  const monthStemIdx = STEMS.indexOf(saju.pillars.month.stem);
  const monthBranchIdx = BRANCHES.indexOf(saju.pillars.month.branch);
  const monthGanjiIdx = getGanjiIndex(monthStemIdx, monthBranchIdx);

  const dayStemIdx = STEMS.indexOf(saju.pillars.day.stem);

  const list = [];
  for (let k = 1; k <= n; k++) {
    const step = isForward ? k : -k;
    const idx = ((monthGanjiIdx + step) % 60 + 60) % 60;
    const stemIdx = idx % 10;
    const branchIdx = idx % 12;
    const ageStart = daeunSu + (k - 1) * 10;

    list.push({
      ageStart,
      ageEnd: ageStart + 9,
      stem: STEMS[stemIdx],
      stemHanja: STEM_HANJA[stemIdx],
      branch: BRANCHES[branchIdx],
      branchHanja: BRANCH_HANJA[branchIdx],
      label: `${STEM_HANJA[stemIdx]}${BRANCH_HANJA[branchIdx]}`,
      labelHangul: `${STEMS[stemIdx]}${BRANCHES[branchIdx]}`,
      stemGod: getTenGod(dayStemIdx, STEM_ELEMENT[stemIdx], stemIdx % 2 === 0),
      element: STEM_ELEMENT[stemIdx],
    });
  }

  return { isForward, daeunSu, list };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getTenGod,
    getTenGodsForSaju,
    getSinStrength,
    getDaeunList,
    getGanjiIndex,
    getDaeunFavorability,
    getOverallSummary,
    PILLAR_MEANING,
    TEN_GOD_CAREER,
    TEN_GOD_GROUP,
    TEN_GOD_DESC,
    TEN_GOD_DETAIL,
  };
}
