import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const out = path.resolve('_site');
const read = (p) => { assert.ok(fs.existsSync(path.join(out, p)), `missing ${p}`); return fs.readFileSync(path.join(out, p), 'utf8'); };
const home = read('index.html');
assert.equal((home.match(/class="series-card/g) || []).length, 6, 'home has six series cards');
assert.equal((home.match(/class="story-card /g) || []).length, 3, 'all three complete stories featured');
for (const slug of ['markets-cycles', 'first-paycheck', 'home-and-debt', 'family-protection', 'running-a-business', 'retirement-legacy']) {
  const page = read(`series/${slug}/index.html`);
  assert.match(page, /data-filter-form/);
}
// Planned stories are non-clickable cards only.
for (const slug of ['ledger-hears-no-coins', 'tide-goes-out', 'shelf-vs-hotpot', 'sleep-well-size', 'fixed-vs-floating', 'duration-mismatch']) {
  assert.ok(!fs.existsSync(path.join(out, `story/${slug}/index.html`)), `planned ${slug} has no fake story page`);
}
const index = read('terms/index.html');
assert.equal((index.match(/class="term-row"/g) || []).length, 9, 'nine terms extracted from three stories');
assert.match(index, /data-scene=/); assert.match(index, /data-difficulty=/); assert.match(index, /data-tag=/); assert.match(index, /name="difficulty"/);
assert.match(index, /data-term-search/); assert.match(index, /name="q"/);
assert.match(index, /data-search="[^"]*应急金[^"]*三个罐子/);
assert.doesNotMatch(read('series/first-paycheck/index.html'), /data-term-search/, 'search stays off series pages');
const js = read('assets/site.js');
for (const term of ['URLSearchParams', 'localStorage', 'history.replaceState', "params.get('difficulty')", "params.get('q')", "params.set('q'", "params.append('tag'", 'popstate', 'data-term-search']) assert.ok(js.includes(term), `JS has ${term}`);
const css = read('assets/site.css');
for (const token of ['--bg-canvas: #F7F5F0', '--bg-canvas: #0C0B0A', '--bg-surface: #FFFCF8', '--bg-surface: #161412', '--bg-muted: #EFEBE3', '--bg-muted: #221F1C', '--text-primary: #1A1A1A', '--text-primary: #F5F0E8', '--text-secondary: #5C5A55', '--text-secondary: #A39E94', '--border-subtle: #E2DDD3', '--border-subtle: #2C2925', '--accent: #1A7A68', '--accent: #3DDCB0', '--accent-soft: #E4F2EE', '--accent-soft: #12352F', '--level-beginner: #5EE9B5', '--level-intermediate: #E4B84A', '--level-advanced: #F07178', '--focus-ring: #1A7A68', '--focus-ring: #3DDCB0', '--radius-sm: 6px', '--radius-md: 10px', '--radius-lg: 16px', '--shadow: 0 16px 48px rgb(0 0 0 / .55)']) assert.ok(css.includes(token), `CSS token ${token}`);
assert.doesNotMatch(css, /#09090B|#121214|#2DD4BF|#27272A/, 'no zinc dark tokens');
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

console.log('P0 smoke tests: PASS — 13 routes, 6 series, 3 source stories, 9 terms, tokens and URL/theme scripts verified.');
