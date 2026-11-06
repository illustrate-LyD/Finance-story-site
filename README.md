# 金融知识故事站 · P0

基于 Eleventy (11ty) + Nunjucks + Markdown/JSON 的模块化静态站；无 React/Vue。

**GitHub Pages（目标）**：`https://illustrate-LyD.github.io/Finance-story-site/`  
仓：[`illustrate-LyD/Finance-story-site`](https://github.com/illustrate-LyD/Finance-story-site)（project Pages，**pathPrefix 必须为** `/Finance-story-site/`，大小写与仓名一致）。

## 给 Dong：本地预览

环境：Node.js 20+（本项目在 Node 24 验证）。

```bash
cd finance-story-site
npm install                # 已安装时无需重复
npm start                  # 开发预览 + 内容变更自动刷新（pathPrefix=/）
```

终端会显示本地地址，通常是：

- 本机：<http://localhost:8080/>
- 局域网预览：`npm start -- --host=0.0.0.0`

路由：首页 `/`；系列 `/series/markets-cycles/` 等；故事 `/story/new-ship-and-resale/` 等；索引 `/terms/`。  
筛选示例：`/terms/?scene=markets-cycles&tag=投资&difficulty=L1`。

## 构建

```bash
npm run build              # 本地根路径 pathPrefix=/ → 输出 _site/
npm run build:pages        # Pages 用 PATH_PREFIX=/Finance-story-site/
npm test                   # 在已有 _site/（通常先 npm run build）上跑 smoke tests
```

`pathPrefix` 由环境变量 `PATH_PREFIX` 注入（见 `.eleventy.js`）；模板里所有根绝对链接经 Eleventy `| url` 过滤器，Pages 下会带上 `/Finance-story-site/`。  
GitHub Actions（`.github/workflows/pages.yml`）在 push `main` 时执行 `npm ci && npm run build:pages`，上传 `_site` 并用 `actions/deploy-pages` 发布——**不要提交预构建 `_site`**，以免 prefix 错位。

仓库需在 Settings → Pages 选择 **GitHub Actions** 作为源。

## 模块与供稿

```text
.eleventy.js                 # 内容加载、PATH_PREFIX、Term 合并、11ty 配置
.github/workflows/pages.yml  # Pages 构建与部署
content/
  series/*.md                # 六系列（首发三系 + 三系预告）
  stories/*.md               # Bullie 的三篇完整故事；原文不覆盖
  planned-stories.json       # 从 OUTLINES 转的六张预告卡，不生成假故事页
  taxonomy.json              # 三轴与 query 约定
src/
  index.njk / series.njk / story.njk / terms.njk
  _includes/base.njk         # AppShell；html[data-base] = pathPrefix
  _includes/components.njk   # 卡片、筛选器等（href 均 | url）
  assets/site.css / site.js  # token + ThemeToggle + FilterBar
scripts/smoke-test.mjs       # P0 结构自测（针对 pathPrefix=/ 的 _site）
docs/                        # IA / schema / 设计交接
```

加一篇：把 Bullie 的 Markdown 放入 `content/stories/` 并构建。同名大纲卡自动消失。字段见 `docs/CONTENT_SCHEMA.md`。

## 已完成 / 待后续

- 已用真实供稿：新船下水与旧船转手、三个罐子、用明天的粮票买今天的仓，共 **3 篇、9 个术语**。
- 已实现：六卡首页、系列锁定筛选、索引场景/标签/难度筛选、URL 刷新保持、空态、入门/进阶/精读、文内 Toc、故事对应列、索引反查、篇级声明、深浅主题、**Pages pathPrefix**。
- 六张 OUTLINES 预告别无正文；P1 未做：搜索、拼音轨、TermDetail 抽屉、移动 Sheet、主题跟随系统、相关推荐算法。

修改筛选布局或组件找 UI-web；事实与难度找 Bullie。本站内容仅作金融知识科普，不构成投资建议。
