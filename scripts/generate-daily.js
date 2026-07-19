// scripts/generate-daily.js
// GitHub Actions가 매일 실행해서 daily/YYYY-MM-DD.html 페이지를 만들어줍니다.
// 브라우저용 assets/js 파일을 그대로 재사용합니다 (vm으로 같은 컨텍스트에서 실행).

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");

// ---- 1. 브라우저용 로직 파일들을 같은 실행 컨텍스트에 로드 ----
const sandbox = {};
vm.createContext(sandbox);

const dataCode = fs.readFileSync(path.join(ROOT, "assets/js/fortune-data.js"), "utf-8");
const logicCode = fs.readFileSync(path.join(ROOT, "assets/js/fortune-logic.js"), "utf-8");

// module.exports 관련 코드는 vm 안에서 module이 없어 에러날 수 있으니 안전하게 감싸서 실행
vm.runInContext(dataCode, sandbox, { filename: "fortune-data.js" });
vm.runInContext(logicCode, sandbox, { filename: "fortune-logic.js" });

const { ZODIAC_DATA } = sandbox;
const { getDailyFortune } = sandbox;

// ---- 2. 오늘 날짜 계산 (KST 기준) ----
const now = new Date();
const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
const yyyy = kst.getUTCFullYear();
const mm = String(kst.getUTCMonth() + 1).padStart(2, "0");
const dd = String(kst.getUTCDate()).padStart(2, "0");
const todayStr = `${yyyy}-${mm}-${dd}`;
const days = ["일", "월", "화", "수", "목", "금", "토"];
const todayLabel = `${yyyy}년 ${kst.getUTCMonth() + 1}월 ${kst.getUTCDate()}일 (${days[kst.getUTCDay()]}요일)`;

// ---- 3. 12띠 카드 HTML 생성 ----
function renderCard(z, heroKey) {
  const f = getDailyFortune(z.key, todayStr);
  const isHero = z.key === heroKey;
  return `
      <div class="fortune-card${isHero ? " today" : ""}" id="card-${z.key}">
        ${isHero ? '<span class="today-badge">오늘의 주인공</span>' : ""}
        <div class="card-head">
          <span class="card-symbol">${z.symbol}</span>
          <div>
            <div class="card-name">${z.name}</div>
            <div class="card-hanja">${z.years}</div>
          </div>
        </div>
        <p>${f.overall}</p>
        <p><strong>금전운:</strong> ${f.money}</p>
        <p><strong>애정운:</strong> ${f.romance}</p>
        <p><strong>학업/업무:</strong> ${f.work}</p>
        <p><strong>주의:</strong> ${f.caution}</p>
        <div class="lucky-row">
          <span class="lucky-tag">행운숫자 ${f.luckyNumber}</span>
          <span class="lucky-tag">행운색 ${f.luckyColor}</span>
          <span class="lucky-tag">행운아이템 ${f.luckyItem}</span>
        </div>
      </div>`;
}

// ---- 4. 오늘의 주인공 띠 (index.html과 같은 방식) ----
const heroSeed = sandbox.hashStringToInt(todayStr + "-hero");
const heroZodiac = ZODIAC_DATA[heroSeed % 12];

const cardsHtml = ZODIAC_DATA.map((z) => renderCard(z, heroZodiac.key)).join("\n");

// ---- 5. 최종 HTML 조립 ----
const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${todayLabel} 12띠 운세 | 오늘의 12띠 운세</title>
<meta name="description" content="${todayLabel} 기준, 쥐띠부터 돼지띠까지 오늘의 운세와 행운의 숫자·색·아이템을 확인하세요.">
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="container">
  <header class="site-header">
    <h1 class="site-title">${todayLabel} 12띠 운세</h1>
    <p class="site-subtitle">오늘의 주인공은 ${heroZodiac.symbol} ${heroZodiac.name}입니다</p>
    <span class="today-label">${todayLabel}</span>
    <nav class="site-nav">
      <a href="../index.html">오늘의 전체 운세</a>
      <a href="../my-fortune.html">내 띠 운세 보기</a>
      <a href="../saju-fortune.html">내 사주 운세(베타)</a>
      <a href="../lotto.html">띠별 로또번호 추천</a>
    </nav>
  </header>

  <section class="fortune-grid">
${cardsHtml}
  </section>

  <footer>
    &copy; 2026 오늘의 12띠 운세. 본 콘텐츠는 재미로 즐기는 오락 정보입니다.
  </footer>
</div>
</body>
</html>
`;

// ---- 6. 파일로 저장 ----
const dailyDir = path.join(ROOT, "daily");
if (!fs.existsSync(dailyDir)) fs.mkdirSync(dailyDir, { recursive: true });
fs.writeFileSync(path.join(dailyDir, `${todayStr}.html`), html, "utf-8");
console.log(`생성 완료: daily/${todayStr}.html`);

// ---- 7. daily 폴더 목록 페이지(daily/index.html) 자동 갱신 ----
const files = fs
  .readdirSync(dailyDir)
  .filter((f) => /^\d{4}-\d{2}-\d{2}\.html$/.test(f))
  .sort()
  .reverse();

const listHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>날짜별 12띠 운세 모아보기</title>
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="container">
  <header class="site-header">
    <h1 class="site-title">날짜별 운세 모아보기</h1>
    <nav class="site-nav">
      <a href="../index.html">오늘의 전체 운세</a>
      <a href="../my-fortune.html">내 띠 운세 보기</a>
      <a href="../saju-fortune.html">내 사주 운세(베타)</a>
      <a href="../lotto.html">띠별 로또번호 추천</a>
    </nav>
  </header>
  <section class="fortune-grid">
    ${files
      .map((f) => {
        const d = f.replace(".html", "");
        return `<div class="fortune-card"><a href="${f}" style="color:inherit;text-decoration:none;">📅 ${d} 운세 보기</a></div>`;
      })
      .join("\n    ")}
  </section>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(dailyDir, "index.html"), listHtml, "utf-8");
console.log("daily/index.html 목록 갱신 완료");
