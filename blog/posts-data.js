/*
  운세연구소 블로그 글 데이터
  ---------------------------------------
  새 글을 추가하려면 이 배열 맨 위에 객체 하나를 추가하면 끝이에요.

  publishDate: "YYYY-MM-DD" 형식.
    - 오늘 날짜(방문자 기기 기준)보다 미래로 넣으면 → 그 날짜가 될 때까지 자동으로 숨겨져요. (예약발행)
    - 오늘이거나 과거 날짜면 → 바로 목록에 노출돼요.

  catId: "saju-basic" | "zodiac" | "daily" | "weekly" | "lotto"
    - 카테고리 페이지(category-*.html)에서 이 값으로 필터링해요.

  url: 같은 blog 폴더 안의 글 파일명 (예: "saju-what-is-it.html")
  thumb: 카드에 보여줄 이모지 아이콘 (로또 글이 아닌 경우에만 사용)

  --- 로또 글(catId: "lotto")을 추가할 때만 아래 필드도 함께 넣어주세요 ---
  isLotto: true
  bestZodiacEmoji: 이번주 BEST 띠 이모지 (예: "🐍")
  bestZodiacLabel: 이번주 BEST 띠 이름 (예: "뱀띠")
  luckyNumbers: 그 띠의 로또번호 6개 배열 (예: [9, 10, 21, 29, 40, 43])
    → 색깔은 자동으로 정해져요 (1-10 골드 / 11-20 블루 / 21-30 레드 / 31-40 브라운 / 41-45 그린)
*/

const BLOG_POSTS = [
  {
    url: "lotto-0808.html",
    thumb: "🎱",
    catId: "lotto",
    catLabel: "띠별 로또번호 추천",
    title: "이번주(8.3~8.8) 띠별 로또번호 추천 12선",
    excerpt: "이번 주 재물운 합산 1위 개띠와 함께, 월~토 6일치 행운숫자로 만든 12띠 로또번호 조합이에요.",
    date: "2026.08.08",
    publishDate: "2026-08-08",
    isLotto: true,
    bestZodiacEmoji: "🐕",
    bestZodiacLabel: "개띠",
    luckyNumbers: [2, 10, 18, 26, 34, 39]
  },
  {
    url: "daily-wealth-0808.html",
    thumb: "🐀",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 8월 8일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐀 쥐띠(지수 99). 소띠, 호랑이띠도 상위권.",
    date: "2026.08.08",
    publishDate: "2026-08-08"
  },
  {
    url: "daily-wealth-0807.html",
    thumb: "🐀",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 8월 7일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐀 쥐띠(지수 99). 돼지띠, 뱀띠도 상위권.",
    date: "2026.08.07",
    publishDate: "2026-08-07"
  },
  {
    url: "daily-wealth-0806.html",
    thumb: "🐀",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 8월 6일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐀 쥐띠(지수 99). 말띠, 개띠도 상위권.",
    date: "2026.08.06",
    publishDate: "2026-08-06"
  },
  {
    url: "daily-wealth-0805.html",
    thumb: "🐂",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 8월 5일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐂 소띠(지수 92). 개띠, 호랑이띠도 상위권.",
    date: "2026.08.05",
    publishDate: "2026-08-05"
  },
  {
    url: "weekly-top3-0803.html",
    thumb: "🐕",
    catId: "weekly",
    catLabel: "주간 운세",
    title: "이번주(8.3~8.8) 띠별 운세 TOP3",
    excerpt: "이번주 종합운 1위는 개띠, 2위 뱀띠, 3위 쥐띠예요.",
    date: "2026.08.03",
    publishDate: "2026-08-03",
    isWeekly: true,
    bestZodiacEmoji: "🐕",
    bestZodiacLabel: "개띠"
  },
  {
    url: "daily-wealth-0804.html",
    thumb: "🐍",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 8월 4일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐍 뱀띠(지수 96). 개띠, 말띠도 상위권.",
    date: "2026.08.04",
    publishDate: "2026-08-04"
  },
  {
    url: "daily-wealth-0803.html",
    thumb: "🐂",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 8월 3일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐂 소띠(지수 90). 말띠, 개띠도 상위권.",
    date: "2026.08.03",
    publishDate: "2026-08-03"
  },
  {
    url: "zodiac-ox-personality.html",
    thumb: "🐂",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐂 소띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "묵묵하고 성실한 소띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.07.27",
    publishDate: "2026-07-27"
  },
  {
    url: "zodiac-tiger-personality.html",
    thumb: "🐅",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐅 호랑이띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "강한 추진력의 호랑이띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.07.28",
    publishDate: "2026-07-28"
  },
  {
    url: "zodiac-rabbit-personality.html",
    thumb: "🐇",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐇 토끼띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "온화하고 배려심 깊은 토끼띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.07.29",
    publishDate: "2026-07-29"
  },
  {
    url: "zodiac-dragon-personality.html",
    thumb: "🐉",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐉 용띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "카리스마 넘치는 용띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.07.30",
    publishDate: "2026-07-30"
  },
  {
    url: "zodiac-snake-personality.html",
    thumb: "🐍",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐍 뱀띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "신중하고 매력적인 뱀띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.07.31",
    publishDate: "2026-07-31"
  },
  {
    url: "zodiac-horse-personality.html",
    thumb: "🐎",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐎 말띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "자유롭고 열정적인 말띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.08.01",
    publishDate: "2026-08-01"
  },
  {
    url: "zodiac-goat-personality.html",
    thumb: "🐐",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐐 양띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "따뜻하고 섬세한 양띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.08.02",
    publishDate: "2026-08-02"
  },
  {
    url: "zodiac-monkey-personality.html",
    thumb: "🐒",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐒 원숭이띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "재치 넘치는 원숭이띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.08.03",
    publishDate: "2026-08-03"
  },
  {
    url: "zodiac-rooster-personality.html",
    thumb: "🐓",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐓 닭띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "꼼꼼하고 계획적인 닭띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.08.04",
    publishDate: "2026-08-04"
  },
  {
    url: "zodiac-dog-personality.html",
    thumb: "🐕",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐕 개띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "의리 있고 정직한 개띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.08.05",
    publishDate: "2026-08-05"
  },
  {
    url: "zodiac-pig-personality.html",
    thumb: "🐖",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "🐖 돼지띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "너그럽고 낙천적인 돼지띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.08.06",
    publishDate: "2026-08-06"
  },
  {
    url: "saju-basic-02.html",
    thumb: "☀️",
    catId: "saju-basic",
    catLabel: "사주 입문 2편",
    title: "천간(天干) 완벽정리, 10개 글자가 상징하는 것",
    excerpt: "사주의 재료가 되는 천간 10개(갑을병정무기경신임계)의 뜻과 오행, 음양을 초보자 눈높이로 정리했습니다.",
    date: "2026.07.27",
    publishDate: "2026-07-27"
  },
  {
    url: "saju-basic-03.html",
    thumb: "🌍",
    catId: "saju-basic",
    catLabel: "사주 입문 3편",
    title: "지지(地支) 완벽정리, 12개 글자와 띠의 비밀",
    excerpt: "사주의 나머지 절반, 지지 12개(자축인묘진사오미신유술해)의 뜻과 띠, 오행을 정리했습니다.",
    date: "2026.07.28",
    publishDate: "2026-07-28"
  },
  {
    url: "saju-basic-04.html",
    thumb: "☯️",
    catId: "saju-basic",
    catLabel: "사주 입문 4편",
    title: "음양오행 상생상극, 사주 해석의 핵심 원리",
    excerpt: "목화토금수 오행이 서로 돕고(상생) 부딪히는(상극) 원리를 사주 초보자 눈높이로 설명합니다.",
    date: "2026.07.29",
    publishDate: "2026-07-29"
  },
  {
    url: "saju-basic-05.html",
    thumb: "🧮",
    catId: "saju-basic",
    catLabel: "사주 입문 5편",
    title: "내 사주팔자 세우는 법, 연주·월주·일주·시주 계산 흐름",
    excerpt: "생년월일시로 연주 월주 일주 시주를 세우는 전체 흐름을 절기 기준까지 포함해 설명합니다.",
    date: "2026.07.30",
    publishDate: "2026-07-30"
  },
  {
    url: "saju-basic-06.html",
    thumb: "⭐",
    catId: "saju-basic",
    catLabel: "사주 입문 6편",
    title: "십성(十星)이란 무엇인가, 나와 다른 글자의 관계 10가지",
    excerpt: "일간을 기준으로 나머지 글자와의 관계를 나타내는 십성 10가지의 의미를 정리했습니다.",
    date: "2026.07.31",
    publishDate: "2026-07-31"
  },
  {
    url: "saju-basic-07.html",
    thumb: "⚖️",
    catId: "saju-basic",
    catLabel: "사주 입문 7편",
    title: "신강/신약이란 무엇인가, 나의 기운은 강할까 약할까",
    excerpt: "사주 8글자 안에서 일간의 힘이 강한지 약한지를 판단하는 신강 신약의 기본 개념을 설명합니다.",
    date: "2026.08.01",
    publishDate: "2026-08-01"
  },
  {
    url: "saju-basic-08.html",
    thumb: "🌊",
    catId: "saju-basic",
    catLabel: "사주 입문 8편",
    title: "대운(大運)이란 무엇인가, 10년마다 바뀌는 인생의 흐름",
    excerpt: "10년 단위로 바뀌는 대운의 개념과 순행 역행, 대운수 계산 방식을 정리했습니다.",
    date: "2026.08.02",
    publishDate: "2026-08-02"
  },
  {
    url: "saju-basic-09.html",
    thumb: "📈",
    catId: "saju-basic",
    catLabel: "사주 입문 9편",
    title: "오행 균형으로 보는 나의 성향과 투자 스타일",
    excerpt: "사주 8글자 속 오행 분포로 성향과 투자 스타일, 관심 섹터를 진단하는 방법을 정리했습니다.",
    date: "2026.08.03",
    publishDate: "2026-08-03"
  },
  {
    url: "saju-basic-10.html",
    thumb: "💰",
    catId: "saju-basic",
    catLabel: "사주 입문 10편",
    title: "사주로 보는 재물운의 원리, 재성이 다가 아니다",
    excerpt: "사주에서 재물운을 볼 때 재성만이 아니라 식상, 관성까지 함께 봐야 하는 이유를 설명합니다.",
    date: "2026.08.04",
    publishDate: "2026-08-04"
  },
  {
    url: "saju-basic-11.html",
    thumb: "📖",
    catId: "saju-basic",
    catLabel: "사주 입문 11편",
    title: "사주 용어 헷갈리는 것들 총정리, 간여지동부터 공망까지",
    excerpt: "사주 공부하며 자주 헷갈리는 용어인 간여지동, 공망 등을 알기 쉽게 정리했습니다.",
    date: "2026.08.05",
    publishDate: "2026-08-05"
  },
  {
    url: "saju-basic-12.html",
    thumb: "🎓",
    catId: "saju-basic",
    catLabel: "사주 입문 12편",
    title: "사주 공부 총정리 및 용어사전, 12주 완주 축하드려요",
    excerpt: "사주 입문 시리즈 12편 전체를 한눈에 정리하는 용어사전과 완주 축하 콘텐츠입니다.",
    date: "2026.08.06",
    publishDate: "2026-08-06"
  },
  {
    url: "daily-wealth-0726.html",
    thumb: "🐖",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 7월 26일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐖 돼지띠(지수 96). 토끼띠, 원숭이띠도 상위권.",
    date: "2026.07.26",
    publishDate: "2026-07-26"
  },
  {
    url: "daily-wealth-0727.html",
    thumb: "🐂",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 7월 27일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐂 소띠(지수 97). 호랑이띠, 용띠도 상위권.",
    date: "2026.07.27",
    publishDate: "2026-07-27"
  },
  {
    url: "daily-wealth-0728.html",
    thumb: "🐅",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 7월 28일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐅 호랑이띠(지수 100). 말띠, 용띠도 상위권.",
    date: "2026.07.28",
    publishDate: "2026-07-28"
  },
  {
    url: "daily-wealth-0729.html",
    thumb: "🐍",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 7월 29일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐍 뱀띠(지수 98). 토끼띠, 소띠도 상위권.",
    date: "2026.07.29",
    publishDate: "2026-07-29"
  },
  {
    url: "daily-wealth-0730.html",
    thumb: "🐀",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 7월 30일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐀 쥐띠(지수 94). 돼지띠, 닭띠도 상위권.",
    date: "2026.07.30",
    publishDate: "2026-07-30"
  },
  {
    url: "daily-wealth-0731.html",
    thumb: "🐇",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 7월 31일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐇 토끼띠(지수 100). 원숭이띠, 소띠도 상위권.",
    date: "2026.07.31",
    publishDate: "2026-07-31"
  },
  {
    url: "daily-wealth-0801.html",
    thumb: "🐓",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 8월 1일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐓 닭띠(지수 97). 말띠, 소띠도 상위권.",
    date: "2026.08.01",
    publishDate: "2026-08-01"
  },
  {
    url: "daily-wealth-0802.html",
    thumb: "🐐",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 8월 2일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 재물운 1위는 🐐 양띠(지수 97). 말띠, 개띠도 상위권.",
    date: "2026.08.02",
    publishDate: "2026-08-02"
  },
  {
    url: "weekly-top3-0727.html",
    thumb: "🐓",
    catId: "weekly",
    catLabel: "주간 운세",
    title: "이번주(7.27~8.2) 띠별 운세 TOP3",
    excerpt: "이번주 종합운 1위는 닭띠, 2위 말띠, 공동 3위 소띠·개띠예요.",
    date: "2026.07.27",
    publishDate: "2026-07-27",
    isWeekly: true,
    bestZodiacEmoji: "🐓",
    bestZodiacLabel: "닭띠"
  },
  {
    url: "lotto-0801.html",
    thumb: "🎱",
    catId: "lotto",
    catLabel: "띠별 로또번호 추천",
    title: "이번주(7.27~8.1) 띠별 로또번호 추천 12선",
    excerpt: "이번 주 재물운 합산 1위 닭띠와 함께, 월~토 6일치 행운숫자로 만든 12띠 로또번호 조합이에요.",
    date: "2026.08.01",
    publishDate: "2026-07-27",
    isLotto: true,
    bestZodiacEmoji: "🐓",
    bestZodiacLabel: "닭띠",
    luckyNumbers: [5, 6, 8, 31, 35, 43]
  },
  {
    url: "daily-wealth-0725.html",
    thumb: "🐂",
    catId: "daily",
    catLabel: "오늘의 띠별 운세",
    title: "[띠별운세] 7월 25일 토요일, 재물운 좋은 띠 TOP3",
    excerpt: "오늘 12띠 중 재물운이 가장 좋은 세 띠와 주의할 띠를 정리했어요.",
    date: "2026.07.25",
    publishDate: "2026-07-25"
  },
  {
    url: "lotto-0720.html",
    thumb: "🎱",
    catId: "lotto",
    catLabel: "띠별 로또번호 추천",
    title: "이번주(7.20~7.25) 띠별 로또번호 추천 12선",
    excerpt: "월~토 6일치 행운숫자를 모아 만든 12띠 로또번호 조합이에요.",
    date: "2026.07.25",
    publishDate: "2026-07-25",
    isLotto: true,
    bestZodiacEmoji: "🐍",
    bestZodiacLabel: "뱀띠",
    luckyNumbers: [9, 10, 21, 29, 40, 43]
  },
  {
    url: "saju-what-is-it.html",
    thumb: "🀄",
    catId: "saju-basic",
    catLabel: "사주 입문 1편",
    title: "사주팔자란 무엇인가, 초보자를 위한 기초 가이드",
    excerpt: "사주가 대체 뭘 보는 건지, 여덟 글자가 왜 나오는지부터 차근차근 설명해드려요.",
    date: "2026.07.24",
    publishDate: "2026-07-24"
  },
  {
    url: "zodiac-rat-personality.html",
    thumb: "🐀",
    catId: "zodiac",
    catLabel: "띠별 성격 완벽정리",
    title: "쥐띠 성격 완벽정리, 연애·직장·궁합까지 총정리",
    excerpt: "영리하고 순발력 있는 쥐띠, 연애 스타일부터 궁합까지 깊이 있게 풀어봤어요.",
    date: "2026.07.24",
    publishDate: "2026-07-24"
  },
  {
    url: "weekly-top3-0720.html",
    thumb: "🐍",
    catId: "weekly",
    catLabel: "주간 운세",
    title: "이번주(7.20~7.25) 띠별 운세 TOP3",
    excerpt: "이번 주 종합 운세 지수 TOP3와 주의할 띠 체크포인트를 정리했어요.",
    date: "2026.07.20",
    publishDate: "2026-07-20",
    isWeekly: true,
    bestZodiacEmoji: "🐍",
    bestZodiacLabel: "뱀띠·말띠 공동1위"
  }
];

/*
  아래 함수들은 blog/index.html, blog/category-*.html에서 공통으로 사용해요.
  건드릴 필요 없어요 — 새 글 추가할 때는 위 배열만 수정하면 됩니다.
*/

// 오늘 날짜를 "YYYY-MM-DD" 문자열로 반환 (방문자 기기 시간 기준)
function getTodayDateString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 공개일이 지난(오늘 포함) 글만 반환 + 최신순 정렬
function getPublishedPosts(catId) {
  const today = getTodayDateString();
  let posts = BLOG_POSTS.filter(p => p.publishDate <= today);
  if (catId) {
    posts = posts.filter(p => p.catId === catId);
  }
  posts.sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  return posts;
}

// 로또볼 색상 구간 (기존 lotto.html과 동일한 규칙)
function lottoBallClass(n) {
  if (n <= 10) return "";
  if (n <= 20) return "n3";
  if (n <= 30) return "n4";
  if (n <= 40) return "n5";
  return "n2";
}

// 카드 HTML 문자열 생성 (featured=true면 큰 카드 클래스 적용)
function renderPostCard(p, featured) {
  let thumbInner;
  let thumbExtraClass = "";

  if (p.isLotto) {
    const ballsHtml = p.luckyNumbers
      .map(n => `<span class="lotto-ball ${lottoBallClass(n)}">${n}</span>`)
      .join("");
    thumbExtraClass = " thumb-lotto";
    thumbInner = `
      <div class="thumb-date-badge">${p.date}</div>
      <div class="thumb-lotto-zodiac">
        <span class="thumb-lotto-emoji">${p.bestZodiacEmoji}</span>
        <span>${p.bestZodiacLabel}</span>
        <span class="thumb-lotto-tag">이주의 BEST</span>
      </div>
      <div class="thumb-lotto-balls">${ballsHtml}</div>`;
  } else if (p.isWeekly) {
    thumbExtraClass = " thumb-weekly";
    thumbInner = `
      <div class="thumb-date-badge">${p.date}</div>
      <div class="thumb-weekly-tag">📊 이번주 종합 1위</div>
      <div class="thumb-lotto-zodiac">
        <span class="thumb-lotto-emoji">${p.bestZodiacEmoji}</span>
        <span>${p.bestZodiacLabel}</span>
      </div>`;
  } else if (p.catId === "zodiac") {
    thumbExtraClass = " thumb-personality";
    thumbInner = `
      <div class="thumb-date-badge">${p.date}</div>
      <div class="thumb-icon">${p.thumb}</div>
      <div class="thumb-personality-tag">✨ 띠별 성격</div>`;
  } else {
    thumbInner = `
      <div class="thumb-date-badge">${p.date}</div>
      <div class="thumb-icon">${p.thumb}</div>`;
  }

  const cardClass = featured ? "blog-featured-card" : "blog-card";

  return `
    <a href="${p.url}" class="${cardClass}" data-cat="${p.catId}">
      <div class="blog-card-thumb${thumbExtraClass}">${thumbInner}
      </div>
      <div class="blog-card-body">
        <div class="blog-card-category">${p.catLabel}</div>
        <div class="blog-card-title">${p.title}</div>
        <div class="blog-card-excerpt">${p.excerpt}</div>
        <div class="blog-card-meta">${p.date}</div>
      </div>
    </a>`;
}

// blog-list 엘리먼트에 카드들을 렌더링
function renderBlogList(elementId, catId) {
  const posts = getPublishedPosts(catId);
  const container = document.getElementById(elementId);
  if (!container) return;
  if (posts.length === 0) {
    container.innerHTML = `<p style="opacity:0.7; padding: 24px 0;">아직 등록된 글이 없어요. 곧 새로운 콘텐츠로 찾아올게요!</p>`;
    return;
  }
  container.innerHTML = posts.map(p => renderPostCard(p, false)).join("\n");
}

// 블로그 메인(전체) 페이지 전용: 오늘의 띠별 운세 최신글을 상단에 크게 보여주고,
// 나머지 글은 그 아래 일반 목록으로 렌더링
function renderBlogListWithFeatured(featuredElementId, listElementId) {
  const allPosts = getPublishedPosts();
  const featuredEl = document.getElementById(featuredElementId);
  const listEl = document.getElementById(listElementId);
  if (allPosts.length === 0) {
    if (listEl) listEl.innerHTML = `<p style="opacity:0.7; padding: 24px 0;">아직 등록된 글이 없어요. 곧 새로운 콘텐츠로 찾아올게요!</p>`;
    return;
  }

  // "오늘의 띠별 운세" 카테고리의 가장 최신 글을 우선 노출, 없으면 전체 최신글로 대체
  const dailyPosts = allPosts.filter(p => p.catId === "daily");
  const featured = dailyPosts.length > 0 ? dailyPosts[0] : allPosts[0];
  const rest = allPosts.filter(p => p.url !== featured.url);

  if (featuredEl) {
    featuredEl.innerHTML = `
      <div class="blog-featured-label">🔥 오늘의 띠별 운세</div>
      ${renderPostCard(featured, true)}`;
  }
  if (listEl) {
    listEl.innerHTML = rest.map(p => renderPostCard(p, false)).join("\n");
  }
}
