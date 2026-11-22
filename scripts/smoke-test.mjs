import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const out = path.resolve('_site');
const read = (p) => { assert.ok(fs.existsSync(path.join(out, p)), `missing ${p}`); return fs.readFileSync(path.join(out, p), 'utf8'); };
const home = read('index.html');
assert.equal((home.match(/class="series-card/g) || []).length, 6, 'home shows readable series including family protection and running a business');
assert.match(home, /名人投资理念/);
assert.match(home, /7 个场景 · 19 篇可读 · 14 篇预告/);
assert.match(home, /<aside class="hero-note"><strong>不是先背定义，而是先听故事。<\/strong><p>在熟悉的情境里遇见概念，用白话表格拆清机制，再回到实际例子。<\/p><span class="small">7 个场景 · 19 篇可读 · 14 篇预告<\/span><\/aside>/);
assert.equal((home.match(/开始阅读/g) || []).length, 1, 'one primary call to action');
assert.ok((home.match(/class="story-card /g) || []).length <= 5, 'featured plus at most four continue cards');
assert.match(home, /先读这一篇/);
assert.match(home, /<h2>三个罐子<\/h2>/, 'featured slot is three-jars');
assert.match(home, /续读/);
assert.match(home, /约 \d+ 分钟/);
assert.match(home, /筹备中：养老与传承/);
assert.doesNotMatch(home, /筹备中：做生意/);
assert.doesNotMatch(home, /做生意 · 筹备中/);
assert.match(home, /<h3><a href="\/series\/running-a-business\/">做生意<\/a><\/h3>/);
assert.doesNotMatch(home, /<h3><a href="\/series\/retirement-legacy\/">/);
assert.doesNotMatch(home, /筹备中：家庭保障/);
assert.match(home, /tag=%E4%BF%9D%E9%99%A9/, 'insurance tag links once a readable story exists');
for (const slug of ['markets-cycles', 'first-paycheck', 'home-and-debt', 'family-protection', 'investor-ideas', 'running-a-business']) {
  const page = read(`series/${slug}/index.html`);
  assert.match(page, /data-filter-form/);
  assert.match(page, /data-readable-count>\d+</);
  assert.doesNotMatch(page, /data-readable-count>0</, `${slug} does not paint a fake zero readable count`);
  assert.match(page, /已发布/);
}
const retirement = read('series/retirement-legacy/index.html');
assert.match(retirement, /养老与传承 · 筹备中/);
assert.match(retirement, /接下来/);
assert.match(retirement, /<span>养老与传承<\/span>/);
assert.match(retirement, /本系列有 1 篇也出现在<a href="\/life\/">人生场景<\/a>时间线/);
assert.doesNotMatch(retirement, /href="\/story\/life-retirement-legacy\//);
assert.doesNotMatch(retirement, /这个场景正在筹备中/);
const business = read('series/running-a-business/index.html');
assert.match(business, /data-readable-count>2</);
assert.match(business, /2 篇可读/);
assert.match(business, /<a href="\/story\/better-sales-thinner-margin\/">卖得更好，为什么下一季的利更薄？<\/a>/);
assert.match(business, /<a href="\/story\/one-silver-three-ledgers\/">同一串银子，为什么能把三本账都写满？<\/a>/);
assert.doesNotMatch(business, /这个场景正在筹备中/);
assert.doesNotMatch(business, /也出现在<a href="\/life\/">人生场景/);
const protection = read('series/family-protection/index.html');
assert.match(protection, /雨伞不是摇钱树/);
assert.match(protection, /data-readable-count>1</);
assert.match(protection, /本系列有 3 篇也出现在<a href="\/life\/">人生场景<\/a>时间线/);
assert.doesNotMatch(protection, /保障专题 · 筹备中/);
assert.match(read('series/home-and-debt/index.html'), /本系列有 1 篇也出现在<a href="\/life\/">人生场景<\/a>时间线/);
assert.doesNotMatch(read('series/markets-cycles/index.html'), /也出现在<a href="\/life\/">人生场景/);
const paycheckCounts = read('series/first-paycheck/index.html');
assert.match(paycheckCounts, /data-readable-count>3</);
assert.match(paycheckCounts, /data-preview-count>2</);
assert.match(paycheckCounts, /3 篇可读 · 2 篇预告/);
assert.match(paycheckCounts, /本系列有 1 篇也出现在<a href="\/life\/">人生场景<\/a>时间线/);
assert.match(paycheckCounts, /value="L3" disabled/);
assert.match(paycheckCounts, /精读尚无可读正文/);
assert.match(paycheckCounts, /接下来/);
// Planned stories are non-clickable cards only.
for (const slug of ['ledger-hears-no-coins', 'tide-goes-out', 'shelf-vs-hotpot', 'fixed-vs-floating', 'duration-mismatch', 'juglar-vs-kitchin', 'debt-supercycle-sketch', 'graham-mr-market', 'lynch-know-what-you-own']) {
  assert.ok(!fs.existsSync(path.join(out, `story/${slug}/index.html`)), `planned ${slug} has no fake story page`);
}
const index = read('terms/index.html');
assert.equal((index.match(/class="term-row"/g) || []).length, 63, 'sixty-three terms after the L3 essay');
assert.match(index, /data-scene=/); assert.match(index, /data-difficulty=/); assert.match(index, /data-tag=/); assert.match(index, /name="difficulty"/);
assert.match(index, /data-term-search/); assert.match(index, /name="q"/);
assert.match(index, /data-readable-count>63</);
assert.match(index, /data-preview-count>0</);
assert.match(index, /data-tag="保险"/);
assert.doesNotMatch(index, /data-tag="保险"[^>]*>保障专题 · 筹备中/);
assert.match(read('story/insurance-not-investment/index.html'), /雨伞不是摇钱树/);
assert.match(read('story/insurance-not-investment/index.html'), /风险转移/);
assert.match(read('story/insurance-not-investment/index.html'), /免赔额/);
assert.match(index, /name="difficulty" value="L3"/);
assert.doesNotMatch(index, /value="L3" disabled/, 'published L3 opens 精读 on the index');
assert.doesNotMatch(index, /精读尚无可读正文/);
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
assert.doesNotMatch(compactCss, /人生|\/life\//, 'narrow nav keeps 人生 in the primary bar');
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

const life = read('life/index.html');
assert.match(life, /<h1>人生场景<\/h1>/);
assert.match(life, /7 个阶段 · 1 篇可读 · 5 篇预告/);
assert.doesNotMatch(life, /data-filter-form|class="filter-panel"/);
assert.equal((life.match(/class="life-stop /g) || []).length, 7);
assert.match(life, /href="\/life\/" aria-current="page">人生<\/a>/);
assert.match(life, /href="\/story\/insurance-not-investment\/"/);
assert.match(life, /雨伞不是摇钱树/);
assert.match(life, /与「出生到 18 岁」为同一篇/);
assert.match(life, /生孩子：孩子独立账户定投，与出生到 18 岁为同一篇/);
assert.match(life, /<span>给孩子定投（独立账户）<\/span>/);
assert.match(life, /aria-hidden="true">孩子独立账户定投<\/span>/);
for (const stage of ['出生到 18 岁', '大学毕业', '工作', '结婚', '婚后', '生孩子', '退休与养老']) assert.match(life, new RegExp(stage));
assert.match(home, /id="life-path"/);
assert.match(home, /<h2>按人生阶段读<\/h2>/);
assert.match(home, /7 个阶段 · 1 篇可读 · 5 篇预告/);
assert.match(home, /href="\/life\/">查看完整时间线 →<\/a>/);
assert.match(home, /href="\/" aria-current="page">首页<\/a>/);
assert.match(home, /<a href="\/life\/">人生<\/a><a href="\/terms\/">索引<\/a>/);
assert.equal((home.match(/class="life-stop /g) || []).length, 7);
assert.doesNotMatch(home, /class="series-card[\s\S]{0,80}人生场景/);
const insurance = read('story/insurance-not-investment/index.html');
const insuranceStory = insurance.match(/id="story"[\s\S]*?(?=<section id="terms")/)?.[0] || '';
assert.doesNotMatch(insuranceStory, /life-path-nav/, 'life path stays outside the story body');
const lifeNavAt = insurance.indexOf('class="life-path-nav"');
const relatedAt = insurance.indexOf('继续读这个系列');
assert.ok(lifeNavAt > 0 && lifeNavAt < relatedAt, 'life path sits above 继续读这个系列');
assert.match(insurance, /aria-current="step">工作</);
assert.match(insurance, /上一阶段：大学毕业 · 预告/);
assert.match(insurance, /下一阶段：结婚 · 预告/);
assert.match(insurance, /href="\/life\/">查看完整时间线<\/a>/);
assert.match(insurance, /class="back-link" href="\/series\/family-protection\/">← 返回系列 · 家庭保障/);
assert.doesNotMatch(insurance, /返回系列 · 人生|breadcrumb[\s\S]{0,120}人生场景/);
assert.doesNotMatch(read('story/three-jars/index.html'), /class="life-path-nav"/);
const batch = {
  'earnings-yield-vs-yield': { title: '铺子还在赚钱，契纸为何不香了？', series: '市场与周期', seriesSlug: 'markets-cycles', terms: ['盈利收益率', '国债收益率', '简易股权风险溢价'], contexts: ['盈租', '官票票息', '两把尺子之间的距离'] },
  'inventory-and-liquidity': { title: '货还在，为什么卖也难、借也难？', series: '市场与周期', seriesSlug: 'markets-cycles', terms: ['市场流动性', '融资流动性', '流动性螺旋', '折扣率'], contexts: ['街上好不好出手', '账房肯不肯续借', '两根绳子越勒越紧', '按市价几成放贷'] },
  'unchanged-rate-tighter-path': { title: '墙上的告示没改，路上的风为何紧了？', series: '市场与周期', seriesSlug: 'markets-cycles', terms: ['政策利率', '政策路径', '会议纪要'], contexts: ['衙门口那块银根牌', '路线图上还要不要继续上坡', '事后贴到照壁上的整份话'] },
  'raised-offer-still-pops': { title: '官定价已经抬高，为何第一天还能再涨？', series: '市场与周期', seriesSlug: 'markets-cycles', terms: ['IPO抑价', '账面建档', '桌上留银', '询价区间'], contexts: ['官定价和转手后第一天收市价之间的距离', '牙行在后院打听谁愿意出多少，再把官定价写上招贴', '多出来的那一截，进了第一批拿到契的人的口袋', '招贴上原先只写的那个价码区间'] },
  'easier-bonds-tighter-street': { title: '官票好买了些，街上的钱为何仍紧？', series: '市场与周期', seriesSlug: 'markets-cycles', terms: ['金融条件', '信用利差', '金融条件指数'], contexts: ['老衡器那杆挂着五颗砝码的秤', '各家铺子凭信誉借钱要多付的加码', '把五颗砝码合成一个读数'] },
  'better-sales-thinner-margin': { title: '卖得更好，为什么下一季的利更薄？', series: '做生意', seriesSlug: 'running-a-business', terms: ['毛利率', '产品组合', '学习曲线', '口径'], contexts: ['每一匹布还剩多少利', '这一季卖出去的，换成了另一卷布', '新机刚开做，利先薄一截', '集市多开一天，要先把日子对齐'] },
  'one-silver-three-ledgers': { title: '同一串银子，为什么能把三本账都写满？', series: '做生意', seriesSlug: 'running-a-business', terms: ['厂商融资', '循环融资', '终局需求'], contexts: ['窑后院那扇写着「贷银」的小窗', '银子从后门出去，又从前门捧着货单回来', '谁在离开窑里那串银子之后，还肯为镜芯付钱'] },
  'dollar-tide-fed-gold': { title: '潮门一收，远货先瘦，金砖为何也不香了？', series: '市场与周期', seriesSlug: 'markets-cycles', terms: ['贴现', '政策路径', '实际利率', '美元潮汐', '黄金的机会成本'], contexts: ['远年的货单还没交货，今天的价钱先瘦了', '潮门后面的潮路还要不要继续升高', '官息扣掉面包涨价之后，还剩多少', '官银从各港退潮或回灌', '静库里那块不付租金的哑金'] },
};
for (const [slug, spec] of Object.entries(batch)) {
  const page = read(`story/${slug}/index.html`);
  const seriesPage = spec.seriesSlug === 'running-a-business' ? business : read('series/markets-cycles/index.html');
  assert.match(page, new RegExp(`<h1>${spec.title}</h1>`), slug);
  assert.match(page, new RegExp(`返回系列 · ${spec.series}`), slug);
  assert.match(page, /2026-11-22/, `${slug} date`);
  assert.match(page, /href="#story">故事/, slug);
  assert.match(page, /故事里对应/, slug);
  assert.doesNotMatch(page, /class="life-path-nav"/, `${slug} is not on the life timeline`);
  const table = page.match(/class="term-table"[\s\S]*?<\/table>/)?.[0] || '';
  for (const term of spec.terms) {
    assert.match(table, new RegExp(`<th scope="row">${term}</th>`), `${slug} term ${term}`);
    assert.match(index, new RegExp(`id="term-${term}"`), `${term} on the index`);
  }
  for (const context of spec.contexts) assert.match(table, new RegExp(`<td>${context}</td>`), `${slug} context`);
  assert.match(seriesPage, new RegExp(`<a href="/story/${slug}/">${spec.title}</a>`), `${slug} linked from series`);
}
const htmlFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((ent) => {
  const full = path.join(dir, ent.name);
  return ent.isDirectory() ? htmlFiles(full) : full.endsWith('.html') ? [full] : [];
});
for (const file of htmlFiles(out)) {
  const html = fs.readFileSync(file, 'utf8');
  assert.doesNotMatch(html, /\/story\/life-[a-z0-9-]+\//, `no planned life story URL in ${path.relative(out, file)}`);
}
assert.doesNotMatch(css, /--bg-canvas: #0A0C10[\s\S]{0,80}#12151B|#12151B|--bg-surface: #12151B|--bg-muted: #1A1E26|--border-subtle: #252A33/, 'scheme B surfaces stay');

const markets = read('series/markets-cycles/index.html');
assert.match(markets, /9 篇可读 · 4 篇预告/);
assert.match(markets, /name="difficulty" value="L3"/);
assert.doesNotMatch(markets, /value="L3" disabled/);
assert.doesNotMatch(markets, /精读尚无可读正文/);
assert.match(read('story/dollar-tide-fed-gold/index.html'), /level-L3/);
assert.match(read('story/dollar-tide-fed-gold/index.html'), /不是定律|不构成任何投资建议/);

console.log('P0 smoke tests: PASS — 19 readable, 14 previews, 63 terms; life timeline 7/1/5; L3 dollar-tide-fed-gold live.');
