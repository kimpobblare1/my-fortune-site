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
const ELEMENT_GENERATES = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" };
// 오행 상극(극하는 관계): 목→토, 화→금, 토→수, 금→목, 수→화
const ELEMENT_OVERCOMES = { 목: "토", 화: "금", 토: "수", 금: "목", 수: "화" };

const TEN_GOD_NAMES = {
  same_same: "비견", same_diff: "겁재",
  gen_same: "식신", gen_diff: "상관",
  ov_same: "편재", ov_diff: "정재",
  ovby_same: "편관", ovby_diff: "정관",
  genby_same: "편인", genby_diff: "정인",
};

const TEN_GOD_GROUP = {
  비견: "비겁", 겁재: "비겁",
  식신: "식상", 상관: "식상",
  편재: "재성", 정재: "재성",
  편관: "관성", 정관: "관성",
  편인: "인성", 정인: "인성",
};

const TEN_GOD_DESC = {
  비겁: "자존감과 주체성, 독립적으로 밀고 나가는 힘",
  식상: "표현력과 창의성, 새로운 걸 만들어내는 힘",
  재성: "현실 감각과 재물 운용 능력",
  관성: "책임감과 조직 적응력, 명예를 추구하는 힘",
  인성: "학습력과 직관, 보호받고 채우는 힘",
};

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
    TEN_GOD_GROUP,
    TEN_GOD_DESC,
  };
}
