// ---- 날짜 유틸 ----
function getTodayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getTodayKoreanLabel() {
  const d = new Date();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]}요일)`;
}

// ---- 시드 기반 의사난수 ----
// 문자열을 숫자로 해싱 (같은 입력 -> 항상 같은 출력)
function hashStringToInt(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // 32bit 정수로 변환
  }
  return Math.abs(hash);
}

// 시드값으로 배열에서 하나를 고름 (매일 바뀌지만 같은 날엔 항상 같은 값)
function pickBySeed(arr, seed) {
  return arr[seed % arr.length];
}

// ---- 띠 계산 ----
// 출생년도로 띠를 계산 (yearMod 기준: year % 12)
function getZodiacByYear(year) {
  const mod = ((year % 12) + 12) % 12;
  return ZODIAC_DATA.find((z) => z.yearMod === mod);
}

// ---- 오늘의 운세 생성 (핵심 함수) ----
// zodiacKey: "rat","ox" 등, dateStr: "2026-07-19" (생략 시 오늘)
function getDailyFortune(zodiacKey, dateStr) {
  const today = dateStr || getTodayString();
  const baseSeed = hashStringToInt(`${today}-${zodiacKey}`);

  return {
    overall: pickBySeed(FORTUNE_POOL.overall, baseSeed),
    work: pickBySeed(FORTUNE_POOL.work, baseSeed + 1),
    money: pickBySeed(FORTUNE_POOL.money, baseSeed + 2),
    caution: pickBySeed(FORTUNE_POOL.caution, baseSeed + 3),
    luckyColor: pickBySeed(FORTUNE_POOL.luckyColor, baseSeed + 4),
    luckyItem: pickBySeed(FORTUNE_POOL.luckyItem, baseSeed + 5),
    luckyDirection: pickBySeed(FORTUNE_POOL.luckyDirection, baseSeed + 6),
    luckyNumber: (baseSeed % 45) + 1, // 1~45 사이 오늘의 행운 숫자
  };
}

// Node.js(GitHub Actions 등)에서 require로 불러올 수 있게 함. 브라우저에선 무시됨.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getTodayString,
    getTodayKoreanLabel,
    hashStringToInt,
    pickBySeed,
    getZodiacByYear,
    getDailyFortune,
  };
}
