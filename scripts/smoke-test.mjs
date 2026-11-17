import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const out = path.resolve('_site');
const read = (p) => { assert.ok(fs.existsSync(path.join(out, p)), `missing ${p}`); return fs.readFileSync(path.join(out, p), 'utf8'); };
const home = read('index.html');
assert.equal((home.match(/class="series-card/g) || []).length, 5, 'home shows readable series including family protection');
assert.match(home, /名人投资理念/);
assert.match(home, /7 个场景 · 11 篇可读 · 9 篇预告/);
assert.match(home, /<aside class="hero-note"><strong>不是先背定义，而是先听故事。<\/strong><p>在熟悉的情境里遇见概念，用白话表格拆清机制，再回到实际例子。<\/p><span class="small">7 个场景 · 11 篇可读 · 9 篇预告<\/span><\/aside>/);
assert.equal((home.match(/开始阅读/g) || []).length, 1, 'one primary call to action');
assert.ok((home.match(/class="story-card /g) || []).length <= 5, 'featured plus at most four continue cards');
assert.match(home, /先读这一篇/);
assert.match(home, /<h2>三个罐子<\/h2>/, 'featured slot is three-jars');
assert.match(home, /续读/);
assert.match(home, /约 \d+ 分钟/);
assert.match(home, /筹备中：做生意 · 养老与传承/);
assert.doesNotMatch(home, /筹备中：家庭保障/);
assert.match(home, /tag=%E4%BF%9D%E9%99%A9/, 'insurance tag links once a readable story exists');
for (const slug of ['markets-cycles', 'first-paycheck', 'home-and-debt', 'family-protection', 'investor-ideas']) {
  const page = read(`series/${slug}/index.html`);
  assert.match(page, /data-filter-form/);
  assert.match(page, /data-readable-count>\d+</);
  assert.doesNotMatch(page, /data-readable-count>0</, `${slug} does not paint a fake zero readable count`);
  assert.match(page, /已发布/);
}
for (const slug of ['running-a-business', 'retirement-legacy']) {
  const page = read(`series/${slug}/index.html`);
  assert.doesNotMatch(page, /data-filter-form/);
  assert.match(page, /筹备中/);
}
const protection = read('series/family-protection/index.html');
assert.match(protection, /雨伞不是摇钱树/);
assert.match(protection, /data-readable-count>1</);
assert.doesNotMatch(protection, /保障专题 · 筹备中/);
const paycheckCounts = read('series/first-paycheck/index.html');
assert.match(paycheckCounts, /data-readable-count>3</);
assert.match(paycheckCounts, /data-preview-count>1</);
assert.match(paycheckCounts, /3 篇可读 · 1 篇预告/);
assert.match(paycheckCounts, /value="L3" disabled/);
assert.match(paycheckCounts, /精读尚无可读正文/);
assert.match(paycheckCounts, /接下来/);
// Planned stories are non-clickable cards only.
for (const slug of ['ledger-hears-no-coins', 'tide-goes-out', 'shelf-vs-hotpot', 'fixed-vs-floating', 'duration-mismatch', 'juglar-vs-kitchin', 'debt-supercycle-sketch', 'graham-mr-market', 'lynch-know-what-you-own']) {
  assert.ok(!fs.existsSync(path.join(out, `story/${slug}/index.html`)), `planned ${slug} has no fake story page`);
}
const index = read('terms/index.html');
assert.equal((index.match(/class="term-row"/g) || []).length, 35, 'thirty-five terms after the five new stories');
assert.match(index, /data-scene=/); assert.match(index, /data-difficulty=/); assert.match(index, /data-tag=/); assert.match(index, /name="difficulty"/);
assert.match(index, /data-term-search/); assert.match(index, /name="q"/);
assert.match(index, /data-readable-count>35</);
assert.match(index, /data-preview-count>0</);
assert.match(index, /data-tag="保险"/);
assert.doesNotMatch(index, /data-tag="保险"[^>]*>保障专题 · 筹备中/);
assert.match(read('story/insurance-not-investment/index.html'), /雨伞不是摇钱树/);
assert.match(read('story/insurance-not-investment/index.html'), /风险转移/);
assert.match(read('story/insurance-not-investment/index.html'), /免赔额/);
assert.match(index, /value="L3" disabled/);
assert.doesNotMatch(index, /data-result-count>0</);
assert.match(index, /data-search="[^"]*应急金[^"]*三个罐子/);
assert.doesNotMatch(read('series/first-paycheck/index.html'), /data-term-search/, 'search stays off series pages');
const js = read('assets/site.js');
for (const term of ['URLSearchParams', 'localStorage', 'history.replaceState', "params.get('difficulty')", "params.get('q')", "params.set('q'", "params.append('tag'", 'popstate', 'data-term-search']) assert.ok(js.includes(term), `JS has ${term}`);
const css = read('assets/site.css');
const compactStart = css.indexOf('@media(max-width:719px)');
const compactCss = css.slice(compactStart, css.indexOf('@media', compactStart + 1));
assert.match(compactCss, /\.hero-note strong,\.hero-note p\{display:none\}/, 'narrow hero hides only the long note copy');
assert.doesNotMatch(compactCss, /\.hero-note\{display:none\}/, 'narrow hero keeps the counts row');
assert.match(compactCss, /\.hero-note\{border-left:0;padding:0;margin:0\}/, 'narrow hero note is not an empty bordered box');
for (const token of ['--bg-canvas: #F7F5F0', '--bg-canvas: #0A0C10', '--bg-surface: #FFFCF8', '--bg-surface: #222833', '--bg-muted: #EFEBE3', '--bg-muted: #2A313E', '--text-primary: #1A1A1A', '--text-primary: #F3F5F7', '--text-secondary: #5C5A55', '--text-secondary: #9AA3B0', '--border-subtle: #E2DDD3', '--border-subtle: #3A4250', '--accent: #6B4F1A', '--accent: #E2C58D', '--accent-soft: #F0E6D0', '--accent-soft: #221E16', '--level-beginner: #6FCF9F', '--level-intermediate: #E0B25A', '--level-advanced: #E07A7A', '--focus-ring: #6B4F1A', '--focus-ring: #E2C58D', '--button-primary-bg: #1A1A1A', '--button-primary-bg: #E8EAED', '--button-primary-fg: #FFFCF8', '--button-primary-fg: #0A0C10', '--shadow: 0 16px 48px rgb(0 0 0 / .55)', '--radius-sm: 6px', '--radius-md: 10px', '--radius-lg: 16px', '--font-serif: "Noto Serif SC", "Songti SC", "STSong", Georgia, serif']) assert.ok(css.includes(token), `CSS token ${token}`);
assert.doesNotMatch(css, /#09090B|#121214|#2DD4BF|#27272A|#0C0B0A|#161412|#F5F0E8|#3DDCB0|#12352F/, 'no zinc or Warm Editorial leftovers');
assert.match(css, /background:var\(--button-primary-bg\);color:var\(--button-primary-fg\)/);
assert.match(css, /font-family: var\(--font-serif\); font-weight: 600/);
assert.match(css, /html\[data-theme="dark"\] \.brand-mark \{ background: var\(--accent\); color: var\(--bg-canvas\)/);
assert.match(css, /letter-spacing: -\.02em/);
assert.match(css, /ui-monospace,SFMono-Regular,Menlo,Consolas,monospace/);
assert.match(css, /width: min\(1160px,calc\(100% - 40px\)\)/);
assert.match(css, /min-height: 68px/);
assert.match(css, /--radius-sm: 6px/);
assert.doesNotMatch(css, /radial-gradient|linear-gradient|box-shadow:\s*0 0/, 'no gradient or glow');
assert.match(css, /prefers-reduced-motion/); assert.match(css, /:focus-visible/);
for (const slug of ['new-ship-and-resale', 'three-jars', 'mortgage-leverage']) {
  const story = read(`story/${slug}/index.html`);
  assert.match(story, /class="skip-link"/); assert.match(story, /class="term-table"/);
  assert.match(story, /id="story"/); assert.match(story, /id="terms"/); assert.match(story, /id="example"/); assert.match(story, /id="takeaways"/);
  assert.match(story, /故事里对应/); assert.match(story, /class="article-disclaimer"/);
  assert.equal((story.match(/<h2>术语表<\/h2>/g) || []).length, 0, 'source H2 not duplicated');
  // MD glossary rows must not remain inside #story (TermTable owns them).
  const storySection = story.match(/id="story"[\s\S]*?(?=<section id="terms")/)?.[0] || '';
  assert.doesNotMatch(storySection, /<table[\s\S]*故事里对应/, 'no hand-written glossary table in #story');
  assert.match(story, /2026-11-06/, 'updated date normalized');
}
const ship = read('story/new-ship-and-resale/index.html');
const termTable = ship.match(/class="term-table"[\s\S]*?<\/table>/)?.[0] || '';
assert.match(termTable, /<td>下水码头<\/td>/, 'TermTable context column uses 下水码头');
assert.match(termTable, /<td>转手海湾<\/td>/, 'TermTable context column uses 转手海湾');
assert.doesNotMatch(termTable, /见故事正文中的对应比喻/, 'no context placeholder when author table has column 3');
assert.match(read('index/index.html'), /url=\/terms\//);
assert.doesNotMatch(read('story/new-ship-and-resale/index.html'), /href="\/index\//);
assert.doesNotMatch(read('series/markets-cycles/index.html'), /name="level"|name="difficulty" value="[初中高]"/);
const paycheck = read('series/first-paycheck/index.html');
assert.match(paycheck, /chip selected locked[\s\S]*第一笔工资/, 'first-paycheck locked chip title');
assert.doesNotMatch(paycheck, /scene-chip" href="\/series\/first-paycheck\/">市场与周期/, 'no cross-wired series chip');
const jars = read('story/three-jars/index.html');
assert.match(jars, /返回系列 · 第一笔工资/);
assert.doesNotMatch(jars, /返回系列 · 市场与周期|story\/new-ship-and-resale/, 'three-jars related stays in first-paycheck');
const ideas = read('series/investor-ideas/index.html');
assert.match(ideas, /class="format-badge">理念/);
assert.match(ideas, /3 篇理念 · 2 篇预告/);
assert.match(ideas, /class="format-badge preview-badge">预告/);
assert.match(ideas, /筛选后/);
assert.match(ideas, /索罗斯：反射性与盛衰序列/);
assert.doesNotMatch(ideas, /篇故事|篇完整故事/);
const brief = read('story/buffett-moat-margin/index.html');
const briefToc = brief.match(/<nav class="story-toc"[\s\S]*?<\/nav>/)?.[0] || '';
assert.match(briefToc, /href="#story">理念/);
assert.doesNotMatch(briefToc, /正文|故事/, 'brief TOC label is 理念');
assert.match(brief, /<h2><span class="section-number">01<\/span>理念<\/h2>/);
assert.match(ideas, /class="format-badge">理念/);
assert.match(home, /class="format-badge">理念/);
assert.equal((read('story/three-jars/index.html').match(/class="format-badge"/g) || []).length, 0, 'story pages do not badge themselves');
assert.match(brief, /文中对应/);
assert.match(brief, /经济护城河/);
assert.match(brief, /class="term-table"/);
const wave = read('story/kondratiev-long-wave/index.html');
assert.match(wave, /href="#story">故事/);
assert.match(wave, /康波周期/);
assert.match(wave, /潮汐表上的「大潮」刻度/);
const published = {
  'soros-reflexivity': { title: '索罗斯：反射性与盛衰序列', series: '名人投资理念', brief: true, terms: ['反射性', '盛衰序列', '流行偏见'], contexts: ['reflexivity', 'boom-bust', 'prevailing bias'] },
  'duan-buy-good-wait': { title: '段永平：买好的、等等、少动作', series: '名人投资理念', brief: true, terms: ['买公司', '不懂不做', '等待'], contexts: ['公开表述中的「买股票就是买公司」', '能力圈的公开表述', '公开表述中的耐心与少操作'] },
  'sleep-well-size': { title: '能睡得着的仓位', series: '第一笔工资', brief: false, terms: ['风险偏好', '风险承受力', '回撤'], contexts: ['「我觉得自己扛得住」', '「这笔钱少一块，生活会不会被掀翻」', '投罐缩水的那几个月'] },
  'two-tickets-same-road': { title: '同一条路，两张车票', series: '第一笔工资', brief: false, terms: ['申购费', '销售服务费', '管理费与托管费', '外扣法'], contexts: ['上车时的登车费', '路上每天扣的一笔服务费', '两种票都要交的油钱', '窗口先撕一角再给票'] },
  'lantern-sign-priced-in': { title: '灯会签与已被定价', series: '市场与周期', brief: false, terms: ['预期差', '隐含波动率', '隐含波动率压缩'], contexts: ['灯亮了，却没有比大家以为的更亮', '灯会签的贵贱', '揭幕后签几乎成了废纸'] },
};
for (const [slug, spec] of Object.entries(published)) {
  const page = read(`story/${slug}/index.html`);
  const seriesPage = spec.series === '名人投资理念' ? ideas : spec.series === '第一笔工资' ? paycheck : read('series/markets-cycles/index.html');
  assert.match(page, new RegExp(`<h1>${spec.title}</h1>`), slug);
  assert.match(page, new RegExp(`返回系列 · ${spec.series}`), slug);
  assert.match(page, /2026-11-15/, `${slug} date`);
  assert.match(page, spec.brief ? /href="#story">理念/ : /href="#story">故事/, slug);
  assert.match(page, spec.brief ? /文中对应/ : /故事里对应/, slug);
  const table = page.match(/class="term-table"[\s\S]*?<\/table>/)?.[0] || '';
  for (const term of spec.terms) assert.match(table, new RegExp(`<th scope="row">${term}</th>`), `${slug} term ${term}`);
  for (const context of spec.contexts) assert.match(table, new RegExp(`<td>${context}</td>`), `${slug} context`);
  assert.match(index, new RegExp(`id="term-${spec.terms[0]}"`), `${spec.terms[0]} on the index`);
  assert.match(seriesPage, new RegExp(`<a href="/story/${slug}/">${spec.title}</a>`), `${slug} linked from series`);
  assert.doesNotMatch(seriesPage, new RegExp(`<span>${spec.title}</span>`), `${slug} is not a preview card`);
}

console.log('P0 smoke tests: PASS — 11 readable, 9 previews, 35 terms; soros-reflexivity, duan-buy-good-wait, sleep-well-size, two-tickets-same-road, lantern-sign-priced-in.');
