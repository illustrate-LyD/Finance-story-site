const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const levelMap = { L1: 'L1', L2: 'L2', L3: 'L3', '初': 'L1', '中': 'L2', '高': 'L3' };

// Local preview defaults to "/". GitHub project Pages build sets
// PATH_PREFIX=/Finance-story-site/ (see npm run build:pages).
function normalizePathPrefix(value) {
  if (!value || value === '/') return '/';
  const withLead = value.startsWith('/') ? value : `/${value}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}
const pathPrefix = normalizePathPrefix(process.env.PATH_PREFIX || '/');

function prefixUrl(urlPath) {
  if (pathPrefix === '/') return urlPath;
  const base = pathPrefix.endsWith('/') ? pathPrefix.slice(0, -1) : pathPrefix;
  return `${base}${urlPath}`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function rewriteStoryLinks(html) {
  return html.replace(/href="(\/story\/[a-z0-9-]+\/)"/g, (_, href) => `href="${prefixUrl(href)}"`);
}
function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}
function isTableRow(line) {
  return /^\s*\|/.test(line);
}
function isTableSeparator(line) {
  const cells = splitRow(line);
  return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}
function renderTable(lines, start) {
  const headers = splitRow(lines[start]);
  let index = start + 2;
  const rows = [];
  while (index < lines.length && isTableRow(lines[index]) && !isTableSeparator(lines[index])) {
    rows.push(splitRow(lines[index]));
    index += 1;
  }
  const head = headers.map((cell) => `<th>${md.renderInline(cell)}</th>`).join('');
  const body = rows.map((row) => {
    const cells = headers.map((header, col) => {
      const value = md.renderInline(row[col] || '');
      return `<td><span data-field>${escapeHtml(header.replace(/\*\*/g, ''))}</span>${value}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return {
    html: `<table data-cols="${headers.length}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`,
    next: index,
  };
}
function renderMarkdownWithTables(source) {
  const lines = String(source).replace(/\r\n/g, '\n').split('\n');
  const chunks = [];
  let buffer = [];
  const flush = () => {
    if (!buffer.length) return;
    const text = buffer.join('\n').trim();
    if (text) chunks.push(md.render(text));
    buffer = [];
  };
  let index = 0;
  while (index < lines.length) {
    if (isTableRow(lines[index]) && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      flush();
      const table = renderTable(lines, index);
      chunks.push(table.html);
      index = table.next;
    } else {
      buffer.push(lines[index]);
      index += 1;
    }
  }
  flush();
  return rewriteStoryLinks(chunks.join('\n'));
}
const businessSectionIds = [
  ['四个问题', 'four-questions'],
  ['9 个核心指标', 'nine-metrics'],
  ['三张报表', 'three-statements'],
  ['仪表盘', 'dashboard'],
  ['阶段和行业', 'stage-and-industry'],
  ['六个最常见的错误', 'six-mistakes'],
  ['5 个数', 'five-numbers'],
];
function businessSectionId(heading) {
  const found = businessSectionIds.find(([needle]) => heading.includes(needle));
  return found ? found[1] : '';
}
function loadBusinessArticle() {
  const file = path.join(root, 'content/business-path.md');
  if (!fs.existsSync(file)) return { ledeHtml: '', ledeHeadline: '', introHtml: '', sections: [] };
  let text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '').trim();
  text = text.replace(/^# [^\n]+\n+/, '');
  const cut = text.search(/^## 从这里读进去\s*$/m);
  if (cut >= 0) text = text.slice(0, cut).trim();
  const parts = text.split(/^(## .+)$/m);
  const intro = (parts[0] || '').trim();
  const paragraphs = intro.split(/\n\n+/).filter(Boolean);
  const ledeMd = paragraphs[0] || '';
  const introMd = paragraphs.slice(1).join('\n\n');
  const headline = (ledeMd.match(/\*\*([^*]+)\*\*/) || [, ''])[1];
  const sections = [];
  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].replace(/^##\s+/, '').trim();
    const body = parts[i + 1] || '';
    sections.push({
      id: businessSectionId(heading),
      heading,
      html: renderMarkdownWithTables(`## ${heading}\n\n${body.trim()}`),
    });
  }
  return {
    ledeHtml: ledeMd ? renderMarkdownWithTables(ledeMd) : '',
    ledeHeadline: headline,
    introHtml: introMd ? renderMarkdownWithTables(introMd) : '',
    sections,
  };
}

function loadContent() {
  const series = fs.readdirSync(path.join(root, 'content/series')).filter((f) => f.endsWith('.md')).map((filename) => {
    const parsed = matter(read(`content/series/${filename}`));
    const rawFormat = parsed.data.format || parsed.data.format_default;
    const description = parsed.content.trim();
    return { ...parsed.data, slug: parsed.data.slug || parsed.data.id, format: rawFormat === 'brief' ? 'brief' : 'story', description, descriptionHtml: description ? md.render(description) : '' };
  }).sort((a, b) => a.order - b.order);
  const storyDir = path.join(root, 'content/stories');
  const stories = fs.existsSync(storyDir) ? fs.readdirSync(storyDir).filter((f) => f.endsWith('.md')).map((filename) => {
    const parsed = matter(read(`content/stories/${filename}`));
    const d = parsed.data;
    // Strip the author MD glossary: TermTable is rendered from frontmatter + the
    // table's third column. Do not use /m with \s*$ — that stops at end-of-line
    // and leaves the markdown table rows in #story while context stays empty.
    const glossaryRe = /^## 术语表\s*\n[\s\S]*?(?=\n## )/m;
    const withoutTable = parsed.content.replace(glossaryRe, '\n');
    const examplePos = withoutTable.search(/^## 实例\s*$/m);
    const takePos = withoutTable.search(/^## 带走这几句\s*$/m);
    const bodyEnd = [examplePos, takePos].filter((p) => p >= 0).sort((a, b) => a - b)[0];
    const bodyMd = (bodyEnd === undefined ? withoutTable : withoutTable.slice(0, bodyEnd)).trim();
    const sliceSection = (start, end) => start < 0 ? '' : withoutTable.slice(start, end < 0 ? undefined : end).replace(/^##[^\n]*\n/, '').trim();
    const exampleMd = sliceSection(examplePos, takePos > examplePos ? takePos : -1);
    const takeawaysMd = sliceSection(takePos, examplePos > takePos ? examplePos : -1);
    const level = levelMap[d.level || d.difficulty] || 'L1';
    const contextMd = (parsed.content.match(/^## 术语表\s*\n([\s\S]*?)(?=\n## )/m) || ['', ''])[1];
    const contexts = contextMd.split(/\r?\n/).filter((line) => /^\|/.test(line))
      .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
      .filter((cells) => cells.length >= 3 && cells[0] !== '术语' && !/^-+$/.test(cells[0]));
    const terms = (d.termIds || d.terms || []).map((term) => {
      const name = typeof term === 'string' ? term : term.name;
      const row = contexts.find((cells) => cells[0] === name);
      return { ...(typeof term === 'object' ? term : {}), id: typeof term === 'object' && term.id ? term.id : name, name,
        definition: typeof term === 'object' ? (term.definition || term.gloss || '') : '',
        // Prefer MD glossary col 3 when present; else frontmatter term.context.
        context: (row && row[2]) || (typeof term === 'object' ? (term.context || '') : '') };
    });
    const slug = d.slug || filename.replace(/\.md$/, '');
    const format = d.format === 'brief' ? 'brief' : 'story';
    const readingSource = [bodyMd, exampleMd, takeawaysMd].join('');
    const readingMinutes = Math.max(1, Math.round(readingSource.replace(/\s+/g, '').length / 400));
    return { ...d, slug, format, readingMinutes, seriesSlug: d.seriesSlug || d.series, hook: d.hook || d.summary,
      updatedAt: d.updatedAt || d.updated instanceof Date ? d.updated.toISOString().slice(0,10) : String(d.updatedAt || d.updated).slice(0, 10), level, terms, termIds: terms.map((t) => t.id),
      bodyHtml: md.render(bodyMd), exampleHtml: md.render(exampleMd), takeawaysHtml: md.render(takeawaysMd),
      hasTakeaways: Boolean(takeawaysMd), planned: false, url: `/story/${slug}/` };
  }) : [];
  const planned = JSON.parse(read('content/planned-stories.json')).filter((p) => !stories.some((s) => s.slug === p.slug))
    .map((p) => ({ ...p, format: p.format === 'brief' ? 'brief' : 'story', level: levelMap[p.difficulty || p.level], terms: [], termIds: [], planned: true,
      hook: p.hook || `大纲知识点：${p.topics.join('、')}。正文待 Bullie 供稿。`, url: `/series/${p.seriesSlug}/` }));
  const allStories = [...stories, ...planned];
  const bySeries = Object.fromEntries(series.map((s) => [s.slug, allStories.filter((story) => story.seriesSlug === s.slug)]));
  const plannedBySlug = Object.fromEntries(JSON.parse(read('content/planned-stories.json')).map((item) => [item.slug, item]));
  const storyBySlug = Object.fromEntries(stories.map((story) => [story.slug, story]));
  const lifeRaw = JSON.parse(read('content/life-timeline.json'));
  const lifeStops = lifeRaw.stops.map((stop) => {
    const story = storyBySlug[stop.storySlug];
    const plannedItem = plannedBySlug[stop.storySlug];
    const readable = Boolean(story);
    const seriesSlug = readable ? story.seriesSlug : (plannedItem && plannedItem.seriesSlug) || '';
    return {
      id: stop.id,
      stage: stop.stage,
      teaser: stop.teaser || '',
      storySlug: stop.storySlug,
      sameAs: stop.sameAs || '',
      sameAsNote: stop.sameAsNote || '',
      readable,
      title: readable ? story.title : (stop.teaser || stop.storySlug),
      summary: readable ? (story.hook || story.summary || '') : '',
      level: readable ? story.level : (levelMap[stop.plannedDifficulty] || 'L1'),
      seriesSlug,
      url: readable ? `/story/${stop.storySlug}/` : '',
    };
  });
  const lifeStopById = Object.fromEntries(lifeStops.map((stop) => [stop.id, stop]));
  const seenLifeSlugs = new Set();
  lifeStops.forEach((stop) => {
    stop.isRepeat = seenLifeSlugs.has(stop.storySlug);
    seenLifeSlugs.add(stop.storySlug);
    const sameStop = stop.sameAs ? lifeStopById[stop.sameAs] : null;
    stop.sameAsStage = sameStop ? sameStop.stage : '';
    if (stop.sameAs && !stop.sameAsNote && stop.sameAsStage) stop.sameAsNote = `与「${stop.sameAsStage}」为同一篇`;
    stop.accessibleName = stop.isRepeat && stop.sameAsStage
      ? `${stop.stage}：${stop.title}，与${stop.sameAsStage}为同一篇`
      : stop.title;
  });
  const lifeSlugsBySeries = new Map();
  lifeStops.forEach((stop) => {
    if (!stop.seriesSlug) return;
    if (!lifeSlugsBySeries.has(stop.seriesSlug)) lifeSlugsBySeries.set(stop.seriesSlug, new Set());
    lifeSlugsBySeries.get(stop.seriesSlug).add(stop.storySlug);
  });
  const coverageOf = (list) => ({
    tags: [...new Set(list.flatMap((s) => s.tags || []))],
    levels: [...new Set(list.map((s) => s.level).filter(Boolean))],
  });
  const seriesModels = series.map((s) => {
    const storiesIn = bySeries[s.slug] || [];
    const publishedStories = storiesIn.filter((x) => !x.planned);
    return { ...s, stories: storiesIn, publishedStories, coverage: coverageOf(publishedStories),
      lifeCount: (lifeSlugsBySeries.get(s.slug) || new Set()).size,
      levels: [...new Set(storiesIn.map((x) => x.level))] };
  });
  const readableSeries = seriesModels.filter((s) => s.publishedStories.length > 0);
  const preparingSeries = seriesModels.filter((s) => s.publishedStories.length === 0);
  const seriesOrder = Object.fromEntries(series.map((item) => [item.slug || item.id, item.order ?? 99]));
  const byStable = (a, b) => {
    const order = (seriesOrder[a.seriesSlug] ?? 99) - (seriesOrder[b.seriesSlug] ?? 99);
    return order || a.slug.localeCompare(b.slug);
  };
  const isPrimary = (story) => story.featured === 'primary';
  const isFeatured = (story) => isPrimary(story) || story.featured === true || story.featured === 'true';
  const primaries = stories.filter(isPrimary).sort(byStable);
  const flagged = stories.filter((story) => isFeatured(story) && !isPrimary(story)).sort(byStable);
  // Only the first primary wins. Until a flag exists, the home slot stays three-jars.
  const featured = primaries[0] || flagged[0] || stories.find((story) => story.slug === 'three-jars') || stories[0] || null;
  const continueReads = stories.filter((story) => featured && story.slug !== featured.slug)
    .sort((a, b) => {
      const rank = (isPrimary(a) ? 0 : isFeatured(a) ? 1 : 2) - (isPrimary(b) ? 0 : isFeatured(b) ? 1 : 2);
      return rank || byStable(a, b);
    })
    .slice(0, 4);
  const termMap = new Map();
  stories.forEach((story) => story.terms.forEach((term) => {
    const existing = termMap.get(term.name);
    if (existing) { existing.storySlugs.push(story.slug); existing.stories.push(story); existing.scenes.push(story.seriesSlug); existing.tags.push(...story.tags); existing.levels.push(story.level); }
    else termMap.set(term.name, { id: term.name, name: term.name, alias: term.alias || [], definition: term.definition,
      storySlugs: [story.slug], stories: [story], scenes: [story.seriesSlug], tags: [...story.tags], levels: [story.level] });
  }));
  const seriesBySlug = Object.fromEntries(seriesModels.map((s) => [s.slug, s]));
  lifeStops.forEach((stop) => {
    const seriesItem = seriesBySlug[stop.seriesSlug];
    stop.seriesTitle = seriesItem ? seriesItem.title : '';
  });
  const lifeNavBySlug = {};
  lifeStops.forEach((stop, index) => {
    const existing = lifeNavBySlug[stop.storySlug];
    if (existing) {
      existing.currentIds.push(stop.id);
      return;
    }
    lifeNavBySlug[stop.storySlug] = {
      currentIds: [stop.id],
      prev: index > 0 ? lifeStops[index - 1] : null,
      next: index < lifeStops.length - 1 ? lifeStops[index + 1] : null,
    };
  });
  const lifeReadableSlugs = new Set(lifeStops.filter((stop) => stop.readable).map((stop) => stop.storySlug));
  const lifePlannedSlugs = new Set(lifeStops.filter((stop) => !stop.readable).map((stop) => stop.storySlug));
  const life = {
    title: lifeRaw.title,
    summary: lifeRaw.summary,
    stops: lifeStops,
    stageCount: lifeStops.length,
    readableCount: lifeReadableSlugs.size,
    plannedCount: lifePlannedSlugs.size,
    navBySlug: lifeNavBySlug,
  };
  const businessRaw = JSON.parse(read('content/business-path.json'));
  const businessArticle = loadBusinessArticle();
  const resolveBusinessEntry = (entry, knowledge) => {
    const slug = entry.storySlug;
    const story = storyBySlug[slug];
    const plannedItem = plannedBySlug[slug];
    const readable = Boolean(story);
    const seriesSlug = readable ? story.seriesSlug : ((plannedItem && plannedItem.seriesSlug) || '');
    const seriesItem = seriesBySlug[seriesSlug];
    return {
      id: entry.id || slug,
      storySlug: slug,
      knowledge: knowledge || '',
      readable,
      planned: !readable,
      title: readable ? story.title : ((plannedItem && plannedItem.title) || '正文待供稿'),
      summary: readable ? (story.hook || story.summary || '') : '',
      level: readable ? story.level : (levelMap[entry.plannedDifficulty || (plannedItem && (plannedItem.difficulty || plannedItem.level))] || 'L2'),
      seriesSlug,
      seriesTitle: seriesItem ? seriesItem.title : '',
      url: readable ? `/story/${slug}/` : '',
    };
  };
  const businessHooks = (businessRaw.stories || []).map((entry) => resolveBusinessEntry(entry, entry.teaser || ''));
  const businessRelated = (businessRaw.relatedStories || []).map((entry) => resolveBusinessEntry(entry, ''));
  const businessSeen = new Set();
  let businessReadableCount = 0;
  let businessPlannedCount = 0;
  [...businessHooks, ...businessRelated].forEach((entry) => {
    if (businessSeen.has(entry.storySlug)) return;
    businessSeen.add(entry.storySlug);
    if (entry.readable) businessReadableCount += 1;
    else businessPlannedCount += 1;
  });
  const businessNavBySlug = {};
  businessRelated.forEach((entry) => {
    businessNavBySlug[entry.storySlug] = { role: 'related', hooks: businessHooks };
  });
  businessHooks.forEach((entry, index) => {
    businessNavBySlug[entry.storySlug] = {
      role: 'hook',
      knowledge: entry.knowledge,
      prev: index > 0 ? businessHooks[index - 1] : null,
      next: index < businessHooks.length - 1 ? businessHooks[index + 1] : null,
    };
  });
  const articleById = Object.fromEntries(businessArticle.sections.filter((section) => section.id).map((section) => [section.id, section]));
  const businessSections = (businessRaw.sections || []).map((section) => articleById[section.id]).filter(Boolean);
  const business = {
    title: businessRaw.title,
    summary: businessRaw.summary,
    route: businessRaw.route || '/business/',
    ledeHtml: businessArticle.ledeHtml,
    ledeHeadline: businessArticle.ledeHeadline,
    introHtml: businessArticle.introHtml,
    sections: businessSections,
    toc: [...(businessRaw.sections || []).map((section) => ({ id: section.id, title: section.title })), { id: 'business-stories', title: '相关故事' }],
    hooks: businessHooks,
    related: businessRelated,
    readableCount: businessReadableCount,
    plannedCount: businessPlannedCount,
    uniqueCount: businessSeen.size,
    countsTowardRunning: [...businessHooks, ...businessRelated].some((entry) => entry.seriesSlug === 'running-a-business'),
    navBySlug: businessNavBySlug,
  };
  return { series: seriesModels, stories, allStories, terms: [...termMap.values()], levelMap, seriesBySlug,
    coverage: coverageOf(stories), readableSeries, preparingSeries, featured, continueReads,
    previewCount: planned.length, life, business };
}
module.exports = function(eleventyConfig) {
  const data = loadContent();
  eleventyConfig.addGlobalData('contentData', data);
  eleventyConfig.addGlobalData('taxonomy', JSON.parse(read('content/taxonomy.json')));
  eleventyConfig.addGlobalData('pathPrefix', pathPrefix);
  eleventyConfig.addCollection('series', () => data.series);
  eleventyConfig.addCollection('stories', () => data.stories);
  eleventyConfig.addFilter('format', (format, number) => format.replace('%02d', String(number).padStart(2, '0')));
  eleventyConfig.addFilter('unique', (items) => [...new Set(items)]);
  eleventyConfig.addFilter('pluck', (items, key) => items.map((item) => item[key]));
  eleventyConfig.addFilter('json', (value) => JSON.stringify(value));
  eleventyConfig.addFilter('dateCN', (value) => String(value).slice(0, 10));
  eleventyConfig.addFilter('bySlug', (items, slug) => (items || []).find((item) => item.slug === slug));
  eleventyConfig.addPassthroughCopy('src/assets', '/assets');
  eleventyConfig.addWatchTarget('content/');
  return {
    pathPrefix,
    dir: { input: 'src', output: '_site', includes: '_includes' },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
