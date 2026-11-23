# 生意篇：IA 与落地说明（2026-11-23）

给 Nibble 落地。设计范围只加这条读法，**不拆现有「做生意」系列，不重做深浅色主题**，沿用 Cool Ink Press D + 方案 B 表面 token。

读者仍是有一点投资经验的人；语气与现有故事站一致。三篇故事与总览正文由 Bullie 定稿，**已到位**。框架口径以总览文稿为准，不要改指标、公式、阈值。

请从 GitHub `main` / 当前线上落地，不要用可能落后的本地 `src/` 旧模板覆盖：https://illustrate-LyD.github.io/Finance-story-site/

> **正文到位后的数据源（以这个为准，覆盖同日稍早的 JSON 内嵌表方案）：**
> - 路径索引：`content/business-path.json`（`title` / `summary` / `route` / `stories` / `relatedStories` / `sections`）
> - 总览正文：`content/business-path.md`（与 inbox 副本 `content/inbox-business-path/business-overview.md` 相同）。这不是故事，**不要**按 `content/stories` 或 `running-a-business` 采集，也不要生成 `/story/business-path/`。
> - 三篇新稿已在 `content/stories/`：`profit-rich-cash-poor`、`big-customer-nearly-failed`、`high-margin-still-losing`。不要再写入 `planned-stories.json`。

---

## 1. 决定（先看这个）

生意篇是**一条框架索引**，不是第 8 个系列，也不是第 4 条筛选轴，也**不是**人生那样的时间线。

- 现有系列卡、系列页、`seriesSlug` 规则全部保留。每篇故事仍然**恰好属于一个系列**。本路径上的故事一律归 `running-a-business`（做生意），URL 仍是 `/story/<slug>/`。
- 总览只是另一条读法：先把「看什么数」讲清楚，再链到故事。已有两篇只挂上，**不改写、不改系列**。
- 不要在首页系列栅格里加一张「生意」SeriesCard，以免和「场景」计数混在一起。
- 不要新增 `?business=` 筛选，也不要给故事 frontmatter 加生意字段。归属以 `content/business-path.json` 的 `stories` / `relatedStories` 为准。
- FilterBar、Hero 主 CTA、深浅色主题和现有色板 token **这次都不要改**。
- 路由：**`/business/`**。导航文案：**生意**。页头 H1 用 JSON `title`：**生意**（与文稿 H1 一致）。眉题（UI chrome）：**生意路径**。不要再叠一个「生意篇」当第二标题。
- 新 CSS 只挂在生意篇的新 class 上（`#business-path`、`.business-*`）。**不要**复用 `.life-timeline` / `.life-stop` / `.life-path-nav`。

---

## 2. 怎么进入

| 入口 | 做法 |
|------|------|
| AppBar | 在「人生」和「索引」之间加一项 **生意**，链到 `/business/`。顺序写死为：`首页 · 系列▾ · 人生 · 生意 · 索引`。当前页为 `/business/` 时，与「人生 / 首页 / 索引」相同的选中态（`aria-current="page"`）。窄屏仍放在主导航里（两字，不要进「系列」下拉）。内链必须走现有 pathPrefix `/Finance-story-site/`（例如 `/Finance-story-site/business/`），不要写成站点根路径 `/business/`。 |
| 首页 `/` | 在 `#life-path` **之后**、标签快捷**之前**，新增一节 `#business-path`「按生意读」。见 §5.2。不要和人生时间线并排成两列。 |
| 系列页 | 仅 `/series/running-a-business/`：若本路径 JSON 里至少有一篇属于该系列，页头导语下加一行小字 + 链，「本系列有 n 篇也出现在[生意篇](/business/)」。n = `stories` + `relatedStories` 的唯一 slug。其他系列不出现这行。 |
| 故事页 | 仅当本篇 `slug` 出现在 JSON 的 `stories` 或 `relatedStories` 时，显示「生意路径」模块（§6）。面包屑和「返回 · 做生意」保持不变，不要改成返回总览。 |
| Hero | **不要改**主 CTA（「先读这一篇」等）。 |

---

## 3. 故事挂法

三篇新钩子（均为 L2，主系列 `running-a-business`，正文已在 `content/stories/`）：

| 序 | stories[].id / storySlug | 标题（取故事 frontmatter） | 知识点（取 JSON `teaser`） |
|----|--------------------------|---------------------------|---------------------------|
| 1 | `profit-rich-cash-poor` | 利润 200 万，账上只有 20 万 | 利润 vs 现金流、应收/存货 |
| 2 | `big-customer-nearly-failed` | 接了一个大客户，公司差点倒闭 | 客户集中度、垫资、CCC |
| 3 | `high-margin-still-losing` | 毛利率 40%，为什么越卖越亏 | 固定成本、费用率、盈亏平衡 |

注意：Bullie 的 JSON 里，`teaser` 是**知识点一行**，不是预告标题。卡片标题、摘要、难度一律取已发布故事的 frontmatter，不要用 `teaser` 覆盖标题。

已有两篇作延伸阅读，只挂不改（`hangOnly: true` 只是标记，不要去改这两篇 MD）：

| storySlug | 现题 |
|-----------|------|
| `better-sales-thinner-margin` | 卖得更好，为什么下一季的利更薄？ |
| `one-silver-three-ledgers` | 同一串银子，为什么能把三本账都写满？ |

三篇已成文，**不必**再写入 `planned-stories.json`。若构建时找不到某篇 MD，再按预告规则处理（标题可回退为故事未到时的短题，难度用 `plannedDifficulty`，且无假链）。

---

## 4. 数据与正文

两份文件一起用，**不要**再把框架表写回 JSON，以免和文稿双源漂移。

### 4.1 `content/business-path.json`

- `title`：页头 H1 / 默认文档标题（「生意」）。
- `summary`：页头导语。
- `route`：`/business/`（渲染时加 pathPrefix）。
- `stories[]`：三个钩子。字段为 `id`、`teaser`（知识点）、`storySlug`、`plannedDifficulty`。用 `storySlug` 查 `content/stories/<slug>.md`：有正文则为可读；无正文才是预告。
- `relatedStories[]`：已有两篇，只写 `storySlug`（及 `hangOnly` 标记）。按现有故事渲染。
- `sections[]`：七节目录。`id` 用作标题锚点，`title` 用作目录文案。与文稿 H2 的对应：

| sections[].id | 文稿 H2 |
|---------------|---------|
| `four-questions` | 一、先问四个问题 |
| `nine-metrics` | 二、9 个核心指标 |
| `three-statements` | 三、三张报表一句话 |
| `dashboard` | 四、老板的仪表盘 |
| `stage-and-industry` | 五、不同阶段和行业，重点不一样 |
| `six-mistakes` | 六、六个最常见的错误 |
| `five-numbers` | 七、如果只能看 5 个数 |

把这些 `id` 写到对应 H2 上（或包一层 `section`），供 `.business-toc` 跳转。

### 4.2 `content/business-path.md`

总览正文的唯一文案源。构建时渲染为 `/business/` 的主体。

- 文稿开头的 `# 生意` **不要再输出一遍**（页头已有 H1）。从开篇误区那段开始渲染。
- 文内链接写成了根路径（如 `/story/profit-rich-cash-poor/`）。必须走站点现有的 URL / pathPrefix 过滤器，渲染为 `/Finance-story-site/story/<slug>/`，不要原样输出导致 Pages 上 404。
- inbox 目录里的 `business-overview.md` 与故事草稿只是工作副本，不要发布成独立页面。
- 文稿末的「## 从这里读进去」与站点 Footer 的「非投资建议」会和组件重复：正文渲染到第七节（五个数）为止；故事列表改由下方 StoryCard 承担（§5.1）。文末那段「非投资建议……」若全站 Footer 已有同类声明，不要再跟一份；若 Footer 没有「本文为经营知识框架导读」这句，可在卡片区下保留这一小段，不要出现两个完整免责声明。

数字规则（首页与 `/business/` 共用），**禁止手写死数**：

```
框架导读 · {唯一可读 slug 数} 篇可读 · {唯一预告 slug 数} 篇预告
```

- 「框架导读」是固定文案，不要数成「7 个章节」。
- 可读 / 预告按 **`stories` + `relatedStories` 的唯一 slug** 计，与全站 §7 名词一致。
- 正文已到齐，当前应为 `框架导读 · 5 篇可读 · 0 篇预告`。预告为 0 时仍显示该行。
- **不要**把生意篇算进首页 Hero 的「N 个场景」。

---

## 5. 页面结构

### 5.1 `/business/`（总览，不是时间线）

```
[AppBar：首页  系列▾  人生  生意  索引  主题]
[页头]
  眉题（eyebrow，accent）：生意路径
  H1（衬线 600）：生意
  导语：先盯现金、单位经济和周转。每篇仍留在「做生意」系列里，这里只是另一条读法。
  数字行（.small）：框架导读 · M 篇可读 · K 篇预告
[页内目录 .business-toc]  ← 取 sections[]
  先问四个问题 · 9 个核心指标 · 三张报表一句话 · 老板的仪表盘
  · 不同阶段和行业 · 六个最常见的错误 · 如果只能看 5 个数 · 相关故事
[正文 .business-body]
  渲染 business-path.md（误区段至第七节）
  开篇第一段用 .business-lede 强调（左边 3px accent，与 .featured-pick / .takeaways 同类，不要外发光）
[相关故事 #business-stories]
  三个钩子（主）+ 两篇延伸阅读（次）
[Footer：非投资建议声明]
```

`/business/` **不要** FilterBar。也不要做成计算器、可勾选仪表盘或登录进度。

页内目录：为这页长内容服务。窄屏（`<720px`）做成一行可横滑的锚点 chip，`position: sticky`，`top` 要让过 AppBar 和 `env(safe-area-inset-top)`；chip 最小高度 44px，各节设 `scroll-margin-top`，避免跳转后标题被粘性条挡住。宽屏可把同一组链接放在页头下或侧边，不要另做一套信息。最后一项「相关故事」指向 `#business-stories`。

正文是一篇带表的框架文章，用现有文章排版 token 即可，不必把每一节拆成自定义组件。表格与列表的表现：

| 块 | 建议 |
|----|------|
| 开篇误区 | 文稿第一段（含加粗那句）。页头不要再重复一遍误区全文。 |
| 四个问题、九个指标、三张报表、仪表盘、阶段与行业 | 保留文稿里的 Markdown 表。宽屏（`≥720px`）用真正的 `table`（有表头）。Compact（`<720px`）**不要整页横滑**：把每一行变成一张卡，字段上下排列，表头作为可见标签。 |
| CCC 说明、13 周说明、初创替换说明 | 跟在相应表后，用现有 muted 提示块或正文段落，不要做成可填写控件。 |
| 六个错误、五个数 | 文稿已是有序清单，保持即可；错误标题已加粗。 |
| 相关故事 | 钩子用现有 StoryCard 节奏：标题、知识点一行（JSON `teaser`，`.small`）、LevelBadge、所属系列 Chip、「进入 →」。延伸阅读稍弱（小标题「延伸阅读」+ 同样规则的卡，或文本链 + LevelBadge）。五篇目前都是可读，不要画成预告。若日后缺稿，预告卡走现有 `.planned`：`--bg-muted` + dashed 边，标题不是链接，无假链。 |

难度：**只用现有 LevelBadge**（L1 入门 / L2 进阶 / L3 精读）。总览本身没有难度筛选。

### 5.2 首页区块 `#business-path`

紧挨 `#life-path` 下方，间距、标题级与现有 `.section` 一致。

```
[眉题：生意路径]
[H2 衬线 600：按生意读]          [右侧数字：框架导读 · M 篇可读 · K 篇预告]
[一句误区（文稿第一段加粗句：「老板最该盯的不是『利润』，是『现金、单位经济、周转』。」不要把整页表格搬到首页）]
[三张钩子紧凑卡：故事标题 + 知识点（teaser）+ LevelBadge + 进入]
[延伸阅读：两篇已有故事的文本链（可省略摘要）]
[块底文本链] 查看生意篇总览 →   指向 /business/
```

首页不要展开九个指标或仪表盘。这是入口，不是第二份总览。

---

## 6. 故事页「生意路径」模块

选择器：`.business-path-nav`，放在正文完成后、「继续读这个系列」**上方**（与 `.life-path-nav` 同层；若极少数篇同时出现两个模块，人生在上、生意在下）。不要插进故事正文。

三个钩子篇：

```
生意路径
本篇对着：{stories[].teaser}
上一篇：《标题》  |  下一篇：《标题》
查看生意篇总览 →
```

- 上一 / 下一按 `stories[]` 数组顺序，不是按系列、也不是按 related。
- 邻篇可读：文本链到该故事。邻篇预告：不可点，并标明「预告」。
- 第一篇隐藏「上一篇」，最后一篇隐藏「下一篇」。

两篇延伸阅读：

```
生意路径 · 延伸阅读
本篇也出现在生意总览里。
查看生意篇总览 →
```

不要给延伸阅读硬编上一/下一钩子（以免读起来像时间线）。可选：在模块里用文本链列出已发布的钩子标题。

返回链、面包屑仍回 `/series/running-a-business/`。

---

## 7. 视觉、手机端与工程约束

- 字体、间距、圆角、深浅色 token **全部沿用** DESIGN_HANDOFF §3 / §8。不要新调色。深色页底 `#0A0C10`、卡片 `#222833`、边 `#3A4250`、muted `#2A313E` 不要改。
- 断点跟全站：Compact `<720px`，Medium `720–1039`，Wide `≥1040`。总览在 Compact 单列，表格改卡片；Medium 宽表可改为单列或卡片，以免公式挤掉；Wide 表格正常展示。
- 触控：目录 chip、故事卡「进入」、延伸阅读链的热区高度至少 44px（建议 48px）。
- 左右内边距走现有 container（20/14），并尊重 `env(safe-area-inset-*)`（若全站壳已有则不要另做一套冲突的 padding）。
- 允许页面缩放；不要为这一页加 `user-scalable=no`。
- 可访问：总览各节用带 `id` 的 `section` 或 H2；目录是页内链接；预告不要做成残链；宽屏表有表头，窄屏卡片字段有可见标签。焦点环用现有 `--focus-ring`。
- 构建通过后再推 Pages。加入内链后确认 `/business/` 为 200（含 pathPrefix），文内与卡片的故事链都带前缀且可打开。
- 新 CSS 仅限：`#business-path`、`.business-toc`、`.business-lede`、`.business-body`、`.business-body table` / 窄屏行卡片、`.business-stories`、`.business-path-nav`，以及导航当前态。不要改 FilterBar / Hero / 主题文件的色板。

---

## 8. 这次不要做

- 不重做主题，不改 Hero 主 CTA，不改 FilterBar。
- 不把生意篇做成新系列，不把已有故事改系列或改正文。
- 不做成人生那样的时间线，不复用 `.life-timeline`。
- 不做生意筛选、不做进度/登录、不做现金流计算器或大插画。
- 不把 `content/business-path.md` 或 inbox 草稿采集成故事。
- 手机术语表卡片化仍然不做。

---

## 9. 验收

1. 导航顺序为「首页 · 系列 · 人生 · 生意 · 索引」；「生意」可进 `/business/`（含 pathPrefix）；窄屏主导航里看得见「生意」；`/business/` 当前项有选中态。
2. 首页 `#life-path` 下方出现「按生意读」：一句误区、三张钩子卡（标题取故事、知识点取 `teaser`）、延伸阅读入口、底链进 `/business/`；不进入系列栅格，也不进 Hero 场景数。当前计数为 `框架导读 · 5 篇可读 · 0 篇预告`。
3. `/business/` 无 FilterBar；页头 H1 为「生意」；正文自上而下包含开篇误区与七节框架（口径与 `business-path.md` 一致），并在文后用卡片链到三篇新故事和两篇已有故事。文内 `/story/…` 链接带 pathPrefix 且可打开。不出现双 H1、双「从这里读进去」、双份完整免责声明。
4. 五篇均为可读卡，无假链、无预告态。已有两篇正文、系列未改。计数构建时计算。
5. `/series/running-a-business/` 出现「本系列有 n 篇也出现在生意篇」（n 应为 5）；其他系列页没有这行。三篇新稿因 `seriesSlug` 正确，也出现在该系列页。
6. 故事页只对 `stories` / `relatedStories` 里的篇显示 `.business-path-nav`；钩子篇有按 `stories[]` 顺序的上一/下一；返回链仍回「做生意」系列。
7. Compact 宽（例如 360–390）总览无页面级横向滚动，九个指标等宽表不以多列强迫横滑；目录可跳到各节且标题不被粘性条挡住。
8. 深浅色外观与上线前一致，只多了生意模块；色板 token 未改。

---

## 10. 建议实施顺序

1. 从 `main` 拉代码。加路由 `src/business.njk`（或等价）、读取 `business-path.json` + 渲染 `business-path.md`、导航「生意」。不要把总览 MD 加进 stories 集合。
2. 总览框架 + 首页 `#business-path` + 五张故事卡（三钩子 + 两篇延伸阅读）。
3. 系列页提示、故事页 `.business-path-nav`（五篇都挂上）。
4. 按 §9 自测（含 360 宽与桌面 1280、深浅色、带前缀的故事链）后发布 Pages，再叫我复扫。
