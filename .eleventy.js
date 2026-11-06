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
  const coverageOf = (list) => ({
    tags: [...new Set(list.flatMap((s) => s.tags || []))],
    levels: [...new Set(list.map((s) => s.level).filter(Boolean))],
  });
  const seriesModels = series.map((s) => {
    const storiesIn = bySeries[s.slug] || [];
    const publishedStories = storiesIn.filter((x) => !x.planned);
    return { ...s, stories: storiesIn, publishedStories, coverage: coverageOf(publishedStories),
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
  return { series: seriesModels, stories, allStories, terms: [...termMap.values()], levelMap, seriesBySlug,
    coverage: coverageOf(stories), readableSeries, preparingSeries, featured, continueReads,
    previewCount: planned.length };
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
