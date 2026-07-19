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
    romance: pickBySeed(FORTUNE_POOL.romance, baseSeed + 7),
    luckyColor: pickBySeed(FORTUNE_POOL.luckyColor, baseSeed + 4),
    luckyItem: pickBySeed(FORTUNE_POOL.luckyItem, baseSeed + 5),
    luckyDirection: pickBySeed(FORTUNE_POOL.luckyDirection, baseSeed + 6),
    luckyNumber: (baseSeed % 45) + 1, // 1~45 사이 오늘의 행운 숫자
  };
}

// ---- 임의의 날짜를 "YYYY-MM-DD" 문자열로 변환 ----
function formatDateString(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ---- 이번 주 월요일 날짜 구하기 ----
function getMondayOfWeek(baseDate) {
  const d = new Date(baseDate);
  const day = d.getDay(); // 일=0, 월=1, ... 토=6
  const offset = (day + 6) % 7; // 월요일까지 며칠 전인지
  d.setDate(d.getDate() - offset);
  return d;
}

// ---- 띠별 "이번 주 월~토 행운 숫자 모음" (로또 추천용) ----
// 월~토 6일치 행운 숫자를 모아 겹치지 않는 6개 숫자로 만들어줍니다.
function getWeeklyLottoNumbers(zodiacKey, referenceDate) {
  const monday = getMondayOfWeek(referenceDate || new Date());
  const used = new Set();
  const numbers = [];

  for (let i = 0; i < 6; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    const dateStr = formatDateString(d);

    let salt = 0;
    let num;
    do {
      num = (hashStringToInt(`${dateStr}-${zodiacKey}-lotto-${salt}`) % 45) + 1;
      salt++;
    } while (used.has(num) && salt < 60);

    used.add(num);
    numbers.push(num);
  }

  return numbers.sort((a, b) => a - b);
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
    formatDateString,
    getMondayOfWeek,
    getWeeklyLottoNumbers,
  };
}
