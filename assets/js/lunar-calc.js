/**
 * lunar-calc.js
 * 음력(陰曆) ↔ 양력(陽曆) 변환 로직 (1900-2100년 범위)
 *
 * 참고: 사주 자체의 연주/월주/일주/시주 계산은 이미 양력+절기 기준으로
 * saju-calc.js에서 처리하고 있어서 이 파일은 필요 없어요. 이 파일은
 * "나는 음력 생일만 알아요"라는 분들을 위해 음력 생일을 양력으로
 * 먼저 바꿔주는 용도로만 사용돼요.
 *
 * 데이터 출처: 1900-2100년 공력 사이 음력 데이터를 인코딩한 공개 알고리즘
 * (여러 오픈소스 프로젝트에서 널리 검증되어 재사용되는 표준 데이터입니다)
 */

// 각 연도(1900~2100)의 음력 정보를 16진수로 인코딩한 표
// - 하위 4비트(0xf): 윤달이 몇 월인지 (0이면 윤달 없음)
// - 그 위 12비트: 1~12월이 각각 큰달(30일)인지 작은달(29일)인지
// - 0x10000 비트: 윤달이 있을 경우 그 윤달이 큰달(30일)인지 작은달(29일)인지
var LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
  0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
  0x0d520
];

var LUNAR_BASE_YEAR = 1900;

function leapMonthOf(y) {
  return LUNAR_INFO[y - LUNAR_BASE_YEAR] & 0xf;
}
function leapDaysOf(y) {
  if (!leapMonthOf(y)) return 0;
  return (LUNAR_INFO[y - LUNAR_BASE_YEAR] & 0x10000) ? 30 : 29;
}
function monthDaysOf(y, m) {
  return (LUNAR_INFO[y - LUNAR_BASE_YEAR] & (0x10000 >> m)) ? 30 : 29;
}
function lunarYearDays(y) {
  var sum = 348;
  for (var i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_INFO[y - LUNAR_BASE_YEAR] & i) ? 1 : 0;
  }
  return sum + leapDaysOf(y);
}

// ---- 양력 → 음력 ----
function solarToLunar(y, m, d) {
  if (y < 1900 || y > 2100) return null;

  var objDate = new Date(y, m - 1, d);
  var offset = Math.round((Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000);

  var i, temp = 0;
  for (i = 1900; i < 2101 && offset > 0; i++) {
    temp = lunarYearDays(i);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    i--;
  }

  var year = i;
  var leap = leapMonthOf(i);
  var isLeap = false;

  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === leap + 1 && !isLeap) {
      --i;
      isLeap = true;
      temp = leapDaysOf(year);
    } else {
      temp = monthDaysOf(year, i);
    }
    if (isLeap && i === leap + 1) { isLeap = false; }
    offset -= temp;
  }
  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) { isLeap = false; } else { isLeap = true; --i; }
  }
  if (offset < 0) {
    offset += temp;
    --i;
  }

  var month = i;
  var day = offset + 1;

  return { lYear: year, lMonth: month, lDay: day, isLeap: isLeap };
}

// ---- 음력 → 양력 ----
function lunarToSolar(y, m, d, isLeapMonth) {
  isLeapMonth = !!isLeapMonth;
  var leap = leapMonthOf(y);
  if (isLeapMonth && leap !== m) return null; // 존재하지 않는 윤달 요청
  if (y < 1900 || y > 2100) return null;

  var day = monthDaysOf(y, m);
  var _day = isLeapMonth ? leapDaysOf(y) : day;
  if (d > _day) return null;

  var offset = 0;
  for (var yy = 1900; yy < y; yy++) {
    offset += lunarYearDays(yy);
  }
  var isAdd = false;
  for (var mm = 1; mm < m; mm++) {
    var thisLeap = leapMonthOf(y);
    if (!isAdd) {
      if (thisLeap <= mm && thisLeap > 0) {
        offset += leapDaysOf(y);
        isAdd = true;
      }
    }
    offset += monthDaysOf(y, mm);
  }
  if (isLeapMonth) { offset += day; }

  var stmap = Date.UTC(1900, 1, 30); // 1900년 음력 1월 1일 = 양력 1900년 1월 31일 (내부 보정 상수)
  var calObj = new Date((offset + d - 31) * 86400000 + stmap);

  return {
    year: calObj.getUTCFullYear(),
    month: calObj.getUTCMonth() + 1,
    day: calObj.getUTCDate(),
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { solarToLunar, lunarToSolar, LUNAR_INFO };
}
