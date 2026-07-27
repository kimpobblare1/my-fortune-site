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
  thumb: 카드에 보여줄 이모지 아이콘
*/

const BLOG_POSTS = [
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
    publishDate: "2026-07-25"
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
    publishDate: "2026-07-20"
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

// 카드 HTML 문자열 생성
function renderPostCard(p) {
  return `
    <a href="${p.url}" class="blog-card" data-cat="${p.catId}">
      <div class="blog-card-thumb">${p.thumb}</div>
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
  container.innerHTML = posts.map(renderPostCard).join("\n");
}
