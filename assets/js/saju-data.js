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

// 오행별 투자 성향 매칭 (재미로 보는 콘텐츠, 실제 투자 조언이 아님)
var INVESTMENT_STYLE = {
  목: {
    title: "성장·확장형 투자자",
    style: "새로운 것에 대한 확신이 서면 과감하게 베팅하는 성장주·테마주 스타일에 가까워요.",
    strength: "트렌드를 빠르게 캐치하고 확신이 들면 망설이지 않아요.",
    caution: "확장 욕구가 앞서 손절 타이밍을 놓치기 쉬우니, 미리 정한 원칙을 지키는 습관이 중요해요.",
  },
  화: {
    title: "단기 트레이딩형 투자자",
    style: "빠르게 진입하고 빠르게 정리하는 모멘텀·단기 매매 스타일에 가까워요.",
    strength: "순간적인 판단력과 실행력이 좋아서 타이밍을 잘 잡아요.",
    caution: "감정적으로 뜨거워지면 과매매로 이어지기 쉬우니, 매매 횟수에 스스로 제한을 두는 게 좋아요.",
  },
  토: {
    title: "안정·배당형 투자자",
    style: "꾸준한 현금흐름을 주는 배당주나 안정적인 자산에 강한 스타일이에요.",
    strength: "묵직하게 오래 들고 가는 힘이 좋아서 복리 효과를 잘 누려요.",
    caution: "변화가 필요한 순간에도 익숙한 걸 고수하려는 경향이 있으니, 가끔은 포트폴리오 점검이 필요해요.",
  },
  금: {
    title: "가치·원칙 매매형 투자자",
    style: "재무제표와 기준을 꼼꼼히 따지는 가치투자 스타일에 가까워요.",
    strength: "원칙이 뚜렷해서 시장이 흔들려도 기준 없이 흔들리지 않아요.",
    caution: "너무 엄격한 기준 때문에 좋은 기회를 놓치는 경우가 있으니, 약간의 유연함도 필요해요.",
  },
  수: {
    title: "유동성·기회 대기형 투자자",
    style: "현금 비중을 넉넉히 쥐고 있다가 좋은 기회에 움직이는 스타일이에요.",
    strength: "관망하는 인내심이 좋아서 급하게 잘못된 판단을 하는 일이 적어요.",
    caution: "너무 오래 기다리다 좋은 타이밍을 놓치는 경우가 있으니, 원칙적인 진입 시점을 정해두는 게 좋아요.",
  },
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
    ELEMENT_INFO, INVESTMENT_STYLE, SOLAR_TERMS, HOUR_BRANCH_RANGES,
  };
}
