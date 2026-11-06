import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const out = path.resolve('_site');
const read = (p) => { assert.ok(fs.existsSync(path.join(out, p)), `missing ${p}`); return fs.readFileSync(path.join(out, p), 'utf8'); };
const home = read('index.html');
assert.equal((home.match(/class="series-card/g) || []).length, 4, 'home shows readable series only');
assert.match(home, /名人投资理念/);
assert.equal((home.match(/class="story-card /g) || []).length, 1, 'exactly one featured story');
assert.match(home, /先读这一篇/);
assert.match(home, /三个罐子/);
assert.match(home, /按场景继续/);
assert.match(home, /约 \d+ 分钟/);
assert.match(home, /筹备中：家庭保障 · 做生意 · 养老与传承/);
assert.match(home, /保障专题 · 筹备中/);
assert.doesNotMatch(home, /tag=%E4%BF%9D%E9%99%A9|tag=保险/, 'insurance shortcut is not a filter link');
for (const slug of ['markets-cycles', 'first-paycheck', 'home-and-debt', 'investor-ideas']) {
  const page = read(`series/${slug}/index.html`);
  assert.match(page, /data-filter-form/);
  assert.match(page, /data-readable-count>\d+</);
  assert.doesNotMatch(page, /data-readable-count>0</, `${slug} does not paint a fake zero readable count`);
  assert.match(page, /已发布/);
}
for (const slug of ['family-protection', 'running-a-business', 'retirement-legacy']) {
  const page = read(`series/${slug}/index.html`);
  assert.doesNotMatch(page, /data-filter-form/);
  assert.match(page, /筹备中/);
}
assert.match(read('series/family-protection/index.html'), /保障专题 · 筹备中/);
const paycheckCounts = read('series/first-paycheck/index.html');
assert.match(paycheckCounts, /data-readable-count>1</);
assert.match(paycheckCounts, /data-preview-count>2</);
assert.match(paycheckCounts, /value="L3" disabled/);
assert.match(paycheckCounts, /精读尚无可读正文/);
assert.match(paycheckCounts, /接下来/);
// Planned stories are non-clickable cards only.
for (const slug of ['ledger-hears-no-coins', 'tide-goes-out', 'shelf-vs-hotpot', 'sleep-well-size', 'fixed-vs-floating', 'duration-mismatch', 'juglar-vs-kitchin', 'debt-supercycle-sketch', 'soros-reflexivity', 'duan-buy-good-wait', 'graham-mr-market', 'lynch-know-what-you-own']) {
  assert.ok(!fs.existsSync(path.join(out, `story/${slug}/index.html`)), `planned ${slug} has no fake story page`);
}
const index = read('terms/index.html');
assert.equal((index.match(/class="term-row"/g) || []).length, 15, 'fifteen terms from five published pieces');
assert.match(index, /data-scene=/); assert.match(index, /data-difficulty=/); assert.match(index, /data-tag=/); assert.match(index, /name="difficulty"/);
assert.match(index, /data-term-search/); assert.match(index, /name="q"/);
assert.match(index, /data-readable-count>15</);
assert.match(index, /data-preview-count>0</);
assert.match(index, /保障专题 · 筹备中/);
assert.match(index, /value="L3" disabled/);
assert.doesNotMatch(index, /data-result-count>0</);
assert.match(index, /data-search="[^"]*应急金[^"]*三个罐子/);
assert.doesNotMatch(read('series/first-paycheck/index.html'), /data-term-search/, 'search stays off series pages');
const js = read('assets/site.js');
for (const term of ['URLSearchParams', 'localStorage', 'history.replaceState', "params.get('difficulty')", "params.get('q')", "params.set('q'", "params.append('tag'", 'popstate', 'data-term-search']) assert.ok(js.includes(term), `JS has ${term}`);
const css = read('assets/site.css');
for (const token of ['--bg-canvas: #F7F5F0', '--bg-canvas: #0C0B0A', '--bg-surface: #FFFCF8', '--bg-surface: #161412', '--bg-muted: #EFEBE3', '--bg-muted: #221F1C', '--text-primary: #1A1A1A', '--text-primary: #F5F0E8', '--text-secondary: #5C5A55', '--text-secondary: #A39E94', '--border-subtle: #E2DDD3', '--border-subtle: #2C2925', '--accent: #1A7A68', '--accent: #3DDCB0', '--accent-soft: #E4F2EE', '--accent-soft: #12352F', '--level-beginner: #5EE9B5', '--level-intermediate: #E4B84A', '--level-advanced: #F07178', '--focus-ring: #1A7A68', '--focus-ring: #3DDCB0', '--shadow: 0 16px 48px rgb(0 0 0 / .55)', '--radius-sm: 6px', '--radius-md: 10px', '--radius-lg: 16px']) assert.ok(css.includes(token), `CSS token ${token}`);
assert.doesNotMatch(css, /#09090B|#121214|#2DD4BF|#27272A/, 'no zinc dark tokens');
assert.match(css, /html\[data-theme="dark"\] \.brand-mark \{ background: var\(--accent\); color: var\(--bg-canvas\)/);
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
assert.match(ideas, /可读 1 篇 · 预告 4 篇/);
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

console.log('P0 smoke tests: PASS — 13 routes, 6 series, 3 source stories, 9 terms, tokens and URL/theme scripts verified.');
