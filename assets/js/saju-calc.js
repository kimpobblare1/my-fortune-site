/**
 * saju-calc.js
 * 양력 생년월일(시)을 입력받아 사주팔자(연주/월주/일주/시주)를 계산합니다.
 *
 * 참고 사항 (사이트 안내문에도 표시):
 * - 절기(節氣) 날짜는 다년 평균값을 사용합니다 (실제 절입시각과 ±1일 오차 가능)
 * - 한국 표준시 기준이며, 과거 서머타임·지방시 보정은 하지 않습니다
 * - 재미로 보는 콘텐츠이며, 정통 만세력과 드물게 하루 정도 차이가 날 수 있습니다
 */

// ---- 일주 계산 기준일 ----
// 2024년 1월 1일 = 갑자일(甲子, index 0) — 검증된 기준일
// (2026년 7월 2일 = 정축일과 교차 검증 완료: 두 날짜 차이 913일 % 60 = 13 = 정축 인덱스와 일치)
const DAY_PILLAR_ANCHOR = new Date(Date.UTC(2024, 0, 1)); // UTC 자정 기준으로 날짜만 비교

function daysBetween(dateA, dateB) {
  // 시:분:초 영향 없이 "날짜"만 비교하기 위해 UTC 자정 기준으로 재구성
  const a = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
  const b = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
  return Math.round((b - a) / 86400000);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

// ---- 해당 날짜가 속한 절기 인덱스(0~11) 구하기 ----
// 반환값 0=입춘~경칩전, 1=경칩~청명전, ... 11=소한~입춘전
function getSolarTermMonthIndex(year, month, day) {
  // SOLAR_TERMS 배열 순서: 입춘(2/4) 경칩(3/6) 청명(4/5) 입하(5/6) 망종(6/6)
  // 소서(7/7) 입추(8/8) 백로(9/8) 한로(10/8) 입동(11/7) 대설(12/7) 소한(1/6, 다음해 1월)
  // 현재 날짜보다 크지 않은 마지막 절기를 찾는다.
  const cur = month * 100 + day;

  // 절기를 "그 해 1/1 기준 순서"로 재배열: 소한(1/6) 먼저, 그다음 입춘(2/4)...대설(12/7)
  const ordered = [
    { name: "소한", md: 106 },
    { name: "입춘", md: 204 },
    { name: "경칩", md: 306 },
    { name: "청명", md: 405 },
    { name: "입하", md: 506 },
    { name: "망종", md: 606 },
    { name: "소서", md: 707 },
    { name: "입추", md: 808 },
    { name: "백로", md: 908 },
    { name: "한로", md: 1008 },
    { name: "입동", md: 1107 },
    { name: "대설", md: 1207 },
  ];

  let idx = -1;
  for (let i = 0; i < ordered.length; i++) {
    if (cur >= ordered[i].md) idx = i;
  }
  // idx: 0=소한, 1=입춘, ..., 11=대설. 소한(0)은 "축월(12월)" 구간이므로 아래에서 변환.
  // 월지 순서를 인(월주 1번째)부터 맞추기 위해 재매핑
  // idx=0(소한 이후, 입춘 전) → 축월(11)
  // idx=1(입춘 이후) → 인월(0), idx=2(경칩 이후) → 묘월(1) ... idx=11(대설 이후) → 자월(10)
  if (idx === 0) return 11; // 축월
  return idx - 1; // 1→0(인), 2→1(묘) ... 11→10(자)
}

// ---- 연주(年柱) 계산 ----
// 기준: 1984년 = 갑자년(index 0). 입춘 이전 출생은 전년도로 계산.
function getYearPillar(year, month, day) {
  const isBeforeIpchun = month < 2 || (month === 2 && day < 4);
  const effectiveYear = isBeforeIpchun ? year - 1 : year;
  const idx = mod(effectiveYear - 1984, 60);
  return { stemIdx: mod(idx, 10), branchIdx: mod(idx, 12), effectiveYear };
}

// ---- 월주(月柱) 계산 (오호둔 공식) ----
// 연간(年干) 그룹별로 인월(寅月)의 시작 천간이 정해지고, 이후 지지 순서대로 천간이 +1씩 진행
const MONTH_STEM_START = {
  0: 2, 5: 2, // 갑(0)·기(5)년 → 인월 병(2) 시작
  1: 4, 6: 4, // 을(1)·경(6)년 → 인월 무(4) 시작
  2: 6, 7: 6, // 병(2)·신(7)년 → 인월 경(6) 시작
  3: 8, 8: 8, // 정(3)·임(8)년 → 인월 임(8) 시작
  4: 0, 9: 0, // 무(4)·계(9)년 → 인월 갑(0) 시작
};
// 월지 순서: 인(2) 묘(3) 진(4) 사(5) 오(6) 미(7) 신(8) 유(9) 술(10) 해(11) 자(0) 축(1)
const MONTH_BRANCH_ORDER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

function getMonthPillar(year, month, day, yearStemIdx) {
  const termMonthIdx = getSolarTermMonthIndex(year, month, day); // 0=인월 ... 11=축월
  const branchIdx = MONTH_BRANCH_ORDER[termMonthIdx];
  const startStem = MONTH_STEM_START[yearStemIdx];
  const stemIdx = mod(startStem + termMonthIdx, 10);
  return { stemIdx, branchIdx };
}

// ---- 일주(日柱) 계산 ----
function getDayPillar(year, month, day) {
  const target = new Date(year, month - 1, day);
  const diff = daysBetween(new Date(DAY_PILLAR_ANCHOR.getUTCFullYear(), DAY_PILLAR_ANCHOR.getUTCMonth(), DAY_PILLAR_ANCHOR.getUTCDate()), target);
  const idx = mod(diff, 60);
  return { stemIdx: mod(idx, 10), branchIdx: mod(idx, 12) };
}

// ---- 시주(時柱) 계산 (오둔시결 공식) ----
const HOUR_STEM_START = {
  0: 0, 5: 0, // 갑·기일 → 자시 갑(0) 시작
  1: 2, 6: 2, // 을·경일 → 자시 병(2) 시작
  2: 4, 7: 4, // 병·신일 → 자시 무(4) 시작
  3: 6, 8: 6, // 정·임일 → 자시 경(6) 시작
  4: 8, 9: 8, // 무·계일 → 자시 임(8) 시작
};

function getHourBranchIndex(hour) {
  // 23:00~00:59 = 자시(0), 01:00~02:59 = 축시(1) ...
  const h = mod(hour + 1, 24); // 23시를 다음날 0시처럼 취급해 2시간 단위로 나누기 위한 보정
  return Math.floor(h / 2) % 12;
}

function getHourPillar(hour, dayStemIdx) {
  const branchIdx = getHourBranchIndex(hour);
  const startStem = HOUR_STEM_START[dayStemIdx];
  const stemIdx = mod(startStem + branchIdx, 10);
  return { stemIdx, branchIdx };
}

// ---- 종합: 사주팔자 전체 계산 ----
// hour는 0~23 정수 또는 null(모름)
function calculateSaju(year, month, day, hour) {
  const yearPillar = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(year, month, day, yearPillar.stemIdx);
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = hour === null || hour === undefined ? null : getHourPillar(hour, dayPillar.stemIdx);

  function toPillarView(p) {
    if (!p) return null;
    return {
      stem: STEMS[p.stemIdx],
      stemHanja: STEM_HANJA[p.stemIdx],
      stemElement: STEM_ELEMENT[p.stemIdx],
      branch: BRANCHES[p.branchIdx],
      branchHanja: BRANCH_HANJA[p.branchIdx],
      branchElement: BRANCH_ELEMENT[p.branchIdx],
      label: `${STEM_HANJA[p.stemIdx]}${BRANCH_HANJA[p.branchIdx]}`,
      labelHangul: `${STEMS[p.stemIdx]}${BRANCHES[p.branchIdx]}`,
    };
  }

  const pillars = {
    year: toPillarView(yearPillar),
    month: toPillarView(monthPillar),
    day: toPillarView(dayPillar),
    hour: toPillarView(hourPillar),
  };

  // ---- 오행 분포 집계 (시주 모르면 6글자만 집계) ----
  const elementCount = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  [pillars.year, pillars.month, pillars.day, pillars.hour].forEach((p) => {
    if (!p) return;
    elementCount[p.stemElement]++;
    elementCount[p.branchElement]++;
  });

  const dominantElement = Object.keys(elementCount).reduce((a, b) =>
    elementCount[a] >= elementCount[b] ? a : b
  );

  // 사주 8글자(또는 6글자)를 문자열 시드로 결합 (개인화 운세용)
  const sajuSeedString = [pillars.year, pillars.month, pillars.day, pillars.hour]
    .filter(Boolean)
    .map((p) => p.labelHangul)
    .join("");

  // 일지(日支) 기준 띠 (통상 "띠"는 태어난 해의 지지를 씀)
  const yearAnimalIdx = yearPillar.branchIdx;

  return {
    pillars,
    elementCount,
    dominantElement,
    sajuSeedString,
    yearAnimal: BRANCH_ANIMAL[yearAnimalIdx],
    yearAnimalSymbol: BRANCH_ANIMAL_SYMBOL[yearAnimalIdx],
    effectiveYear: yearPillar.effectiveYear,
    rawYear: year,
    rawMonth: month,
    rawDay: day,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateSaju,
    getYearPillar,
    getMonthPillar,
    getDayPillar,
    getHourPillar,
    getSolarTermMonthIndex,
  };
}
