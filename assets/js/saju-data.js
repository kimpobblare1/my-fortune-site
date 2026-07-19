// ---- 60갑자 기초 데이터 ----
var STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
var STEM_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
// 천간 오행: 갑을=목, 병정=화, 무기=토, 경신=금, 임계=수
var STEM_ELEMENT = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];

var BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
var BRANCH_HANJA = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
// 지지 오행
var BRANCH_ELEMENT = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];
// 지지 12띠 (자=쥐 ... 해=돼지)
var BRANCH_ANIMAL = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
var BRANCH_ANIMAL_SYMBOL = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐎", "🐐", "🐒", "🐓", "🐕", "🐖"];

// 오행 색상/설명 (결과 화면용)
var ELEMENT_INFO = {
  목: { color: "#4A9D5F", desc: "성장과 시작, 추진력을 상징합니다." },
  화: { color: "#C84B2F", desc: "열정과 표현력, 활동성을 상징합니다." },
  토: { color: "#B08D57", desc: "안정과 신뢰, 중재의 힘을 상징합니다." },
  금: { color: "#8C8C99", desc: "결단력과 원칙, 정리하는 힘을 상징합니다." },
  수: { color: "#3D6FA5", desc: "지혜와 유연함, 깊이를 상징합니다." },
};

// ---- 절기(節氣) 평균 날짜 ----
// 사주 월주는 절기(태양 기준) 경계로 바뀝니다. 아래는 다년 평균값으로,
// 실제 절입 시각은 해마다 ±1일 정도 차이가 날 수 있습니다.
// month는 해당 절기가 걸쳐있는 "시작 월"의 [월, 일] 기준입니다.
// 순서: 입춘(1) 경칩(2) 청명(3) 입하(4) 망종(5) 소서(6) 입추(7) 백로(8) 한로(9) 입동(10) 대설(11) 소한(12, 다음해 1월)
var SOLAR_TERMS = [
  { name: "입춘", month: 2, day: 4 },
  { name: "경칩", month: 3, day: 6 },
  { name: "청명", month: 4, day: 5 },
  { name: "입하", month: 5, day: 6 },
  { name: "망종", month: 6, day: 6 },
  { name: "소서", month: 7, day: 7 },
  { name: "입추", month: 8, day: 8 },
  { name: "백로", month: 9, day: 8 },
  { name: "한로", month: 10, day: 8 },
  { name: "입동", month: 11, day: 7 },
  { name: "대설", month: 12, day: 7 },
  { name: "소한", month: 1, day: 6 },
];

// 12지지 시간대 (2시간 단위, 한국 표준시 기준 / 서머타임 등 과거 특수 시간대는 보정하지 않음)
// 자시: 23:00~00:59 (자정을 걸침) / 축시: 01:00~02:59 ... 해시: 21:00~22:59
var HOUR_BRANCH_RANGES = [
  { branch: 0, startHour: 23 }, // 자시 (23:00~00:59)
  { branch: 1, startHour: 1 },  // 축시
  { branch: 2, startHour: 3 },  // 인시
  { branch: 3, startHour: 5 },  // 묘시
  { branch: 4, startHour: 7 },  // 진시
  { branch: 5, startHour: 9 },  // 사시
  { branch: 6, startHour: 11 }, // 오시
  { branch: 7, startHour: 13 }, // 미시
  { branch: 8, startHour: 15 }, // 신시
  { branch: 9, startHour: 17 }, // 유시
  { branch: 10, startHour: 19 },// 술시
  { branch: 11, startHour: 21 },// 해시
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    STEMS, STEM_HANJA, STEM_ELEMENT,
    BRANCHES, BRANCH_HANJA, BRANCH_ELEMENT, BRANCH_ANIMAL, BRANCH_ANIMAL_SYMBOL,
    ELEMENT_INFO, SOLAR_TERMS, HOUR_BRANCH_RANGES,
  };
}
