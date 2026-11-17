# UI-web 对接清单（给 Nibble）

落地目标：**静态 HTML + CSS**，`html[data-theme="light|dark"]`；无框架。模块化 partial（`_includes`）便于加系列。

设计页（可对照）：[金融知识故事站 · UI/IA 设计说明](https://cursor.com/canvas/store-0a778d36-2353-4703-8e82-392174bb999d/b48f1bd5-6846-477d-8b16-7b941ad558f9)

---

## 1. 页面线框

### 首页 `/`

```
[AppBar: Logo | 首页 系列▾ 术语 | ThemeToggle]
[Hero: 一句话定位 + CTA「从场景开始」/「术语索引」]
[HeroNote 诚实数字：N 个场景 · M 篇可读 · K 篇预告]  ← 口径见 §7
[系列栅格 SeriesCard（有文可进 / 筹备中 soon）]
[标签快捷 TagChip × 5 → 写入 ?tag= ]
[「先读这一篇」：1 主推 + 最多 4 续读]  ← 见 §7
[Footer: 非投资建议短声明]
```

### 系列页 `/series/<slug>/`

```
[AppBar]
[系列名 + 导语 + 「M 篇可读 · K 篇预告」]  ← 勿写「共 N 篇」混装
[FilterBar: 场景 Chip 锁定只读 | 标签多选 | 难度 Segmented]
[已选摘要 + 清除]  [结果：可读 a · 预告 b]
[分区：已发布 | 接下来（预告）| 筹备中空态]  ← 见 §7
[StoryCard 竖列 | EmptyState]
```

### 故事页 `/story/<slug>/`（对照样例 `content/stories/new-ship-and-resale.md`）

```
[AppBar]
[BackLink「返回 · 市场与周期」| 面包屑 首页 / 市场与周期 / 本篇]
[H1 新船下水与旧船转手]
[LevelBadge L1入门 | TagChip 投资·交易（只读，点 → /terms/?tag=）]
[summary 一行钩子]
[Toc sticky: 故事 | 术语表 | 实例 | 带走这几句]

[#故事] 正文段落（MD → HTML）；故事内加粗术语可与表行互链（P1）

[#术语表] TermTable 三列（与 MD 表一致）：
| 术语 | 解释 | 故事里对应 |
| 一级市场 | … | 下水码头 |  ← 术语名链 /terms/#…
表头 bg-muted；窄屏允许横滑，勿折坏三列语义

[#实例] example_title 作小节导语（若有）
  ### 1. … / ### 2. … 卡片或普通 H3+段落

[#带走这几句]（可选）BulletList 2–4 条，视觉略强调（左边线 accent）

[相关故事 2–3 · 同系列优先]
[Footer disclaimer：frontmatter.disclaimer 或站点默认]
```

### 篇型：`format: story | brief`（2026-11-06）

| | story（默认） | brief |
|--|--|--|
| 用途 | 场景寓言 | 公开理念 / 事实梳理（如巴菲特护城河） |
| 系列例 | 市场与周期等 | `investor-ideas`（名人投资理念） |
| Toc 第一节 | **故事** → `#story` | **理念** → `#story`（锚点可仍为 story，**文案**改「理念」） |
| 其余 Toc | 术语表 · 实例 · 带走这几句 | 同左；无则隐藏 |
| 卡片角标 | 无或「故事」 | 小 Chip「理念」`format-chip`，与 LevelBadge 并列 |
| Hero/系列导语 | 不变 | 系列页可写「本系列非寓言」一句（系列 MD 已有） |

Nibble：`format` 缺省 = `story`；brief 时 Toc 第一项 label=`理念`，相关区标题仍「继续读这个系列」。首页精选与 StoryCard 对 brief 显示「理念」角标即可。

### 术语索引 `/terms/`

```
[AppBar]
[FilterBar: 场景可多选/全部 + 标签 + 难度]
[术语列表 TermRow：词条、短释义、出现篇数]
[点开：释义 + 出现该术语的故事链接]
```

---

## 2. 筛选交互

| 轴 | 控件 | 规则 |
|----|------|------|
| 场景 | Chip / 锁定 | 系列页锁定当前 `slug`；首页与术语页可选「全部」或（P1）多选 |
| 标签 | 多选 Chip | OR；再点取消；未选=全部 |
| 难度 | Segmented | 单选 `L1/L2/L3` 或全部 |

- 桌面：FilterBar 横排，难度靠右；标签可换行。
- 窄屏：标签与难度进 Sheet / 「筛选」按钮。
- 故事页不出现完整 FilterBar，只用只读 Badge/Chip。
- 0 结果：EmptyState + 一键清除，不要空白列表。

---

## 3. 深浅色 Token

切换只改 `data-theme`，组件不写死色值。

**2026-11-15**：Dong 不满意现网深色（Warm Editorial C），要求**整案重做**，不要在 C 上小修。新方案采用方向 **D · Cool Ink Press（墨栏）**。目标是耐看的深色阅读，而不是再铺一层暖色滤镜。浅色纸色与结构保留，仅把 accent 从青绿改为同族青铜，保证深浅是一套系统。

**2026-11-17**：页底 `#0A0C10` 不动。Dong 选定方案 **B · 中等石板**，只抬深色表面层级——现网 `--bg-surface: #12151B` 与页底对比仅 **1.07:1**，系列卡几乎融进背景。因该 token 同时用于顶栏、Filter、StoryCard、TermRow，一并更新，避免只改系列卡造成断层。`--bg-muted` 同步上移一档，保持 canvas < surface < muted，避免表头 / Toc / 预告卡比卡片更暗。浅色与 accent / 栏线金不动。对照预览：`docs/_preview/card-surface-options.html`。

| Token | 旧（D 初版） | 新（B · 中等石板，采用） | 说明 |
|-------|--------------|--------------------------|------|
| `--bg-canvas` | `#0A0C10` | **不变** | 页底凉墨 |
| `--bg-surface` | `#12151B` | `#222833` | 与页底对比 1.32:1 |
| `--border-subtle` | `#252A33` | `#3A4250` | 边随底抬亮 |
| `--bg-muted` | `#1A1E26` | `#2A313E` | 比 surface 再亮一档（对比约 1.13:1） |

正文 `#F3F5F7` on 新 surface **13.5:1**；次要字 `#9AA3B0` **5.8:1**，均过 4.5:1。

预览稿（非现网）：`docs/_preview/theme-d-cool-ink.html`（截图 `theme-d-hero.png` / `theme-d-full.png`）；卡片底对照：`docs/_preview/card-surface-options.html`。

### 3.1 浅色（结构沿用，accent 对齐 D）

| Token | light | 用途 |
|-------|-------|------|
| `--bg-canvas` | `#F7F5F0` | 页底（暖纸，不变） |
| `--bg-surface` | `#FFFCF8` | 卡片/顶栏 |
| `--bg-muted` | `#EFEBE3` | Chip/表头 |
| `--text-primary` | `#1A1A1A` | 正文 |
| `--text-secondary` | `#5C5A55` | 元信息 |
| `--border-subtle` | `#E2DDD3` | 边线 |
| `--accent` | `#6B4F1A` ← 自 `#1A7A68` 改为青铜 | 链接/眉题/选中字 |
| `--accent-soft` | `#F0E6D0` ← 自薄荷绿改 | 选中 Chip |
| `--level-beginner` | `#2F6F4E` | 入门 |
| `--level-intermediate` | `#9A6B12` | 进阶 |
| `--level-advanced` | `#8B3A3A` | 精读 |
| `--focus-ring` | = accent | 键盘焦点 |
| `--shadow` | `0 8px 28px rgb(26 26 26 / .05)` | 下拉抬升 |
| `--button-primary-bg` | `#1A1A1A` | 浅色主按钮：墨底纸字（与深色浅钢对仗） |
| `--button-primary-fg` | `#FFFCF8` | 主按钮字色 |

浅色主按钮不再用青绿填充，改墨色实心，避免切回深色时「一边绿、一边金」。

### 3.2 深色重做（2026-11-15 · 方向 D）

#### 已弃方案（不要退回）

| 方案 | Token 特征 | 为什么弃 |
|------|------------|----------|
| 初版 zinc | `#09090B` / `#2DD4BF` | 普通 AI/SaaS 深色模板 |
| C · Warm Editorial | `#0C0B0A` / `#F5F0E8` / `#3DDCB0` | 整页暖褐+奶油字，是一层暖色滤镜；青绿强调仍像模板 |

#### 参考（只取原则，不抄品牌色值）

| 来源 | 取 | 不取 |
|------|----|------|
| Linear | 近黑画布几乎无色相；层级靠亮度台阶；发丝边约 8% 白；主按钮常用浅钢，品牌色不铺满 | 靛紫 `#5E6AD2`（会像再套一个产品站） |
| Vercel | 高对比、无染色、字是主角 | 纯 `#000` 广告黑、无编辑气质 |
| Stripe | 略偏蓝黑的墨底，比纯灰更有空气 | 后台海军大色块、仪表盘密度 |
| Bloomberg / 财经阅读 | 黑底不暖化；强调色跨深浅保持同一色相；标题字重约 600，不靠加粗喊 | 终端橙、密集行情条 |
| 明确不做 | — | FT 鲑鱼正文（又是暖色字）；渐变、发光描边、大面积彩色底 |

#### 采用：D · Cool Ink Press（墨栏）

气质：**夜间书桌读财经长文**。底是凉的墨，字是凉的纸白；唯一的温度在**栏线金**（链接、眉题、选中、焦点），不进背景。标题用宋/衬线，和系统无衬线 UI 分工，阅读页更像刊物而不是后台。

| Token | dark D（采用） | light（对照） | 用途 |
|-------|----------------|---------------|------|
| `--bg-canvas` | `#0A0C10` | `#F7F5F0` | 页底：凉墨 / 暖纸 |
| `--bg-surface` | `#222833` | `#FFFCF8` | 顶栏、卡片、Filter（2026-11-17 方案 B） |
| `--bg-muted` | `#2A313E` | `#EFEBE3` | Chip 底、表头、Toc（随 surface 上移） |
| `--text-primary` | `#F3F5F7` | `#1A1A1A` | 纸白 / 墨（**禁止奶油 `#F5F0E8`**） |
| `--text-secondary` | `#9AA3B0` | `#5C5A55` | 元信息（深色 7.7:1 @ canvas） |
| `--border-subtle` | `#3A4250` | `#E2DDD3` | 发丝边（随 surface 抬亮；也可用 `color-mix(in srgb, #fff 12%, transparent)`） |
| `--accent` | `#E2C58D` | `#6B4F1A` | 栏线金 / 青铜；链接、眉题、选中 |
| `--accent-soft` | `#221E16` | `#F0E6D0` | 选中 Chip、带走这几句浅底（深色几乎无色相，仅微金） |
| `--level-beginner` | `#6FCF9F` | `#2F6F4E` | 入门 |
| `--level-intermediate` | `#E0B25A` | `#9A6B12` | 进阶 |
| `--level-advanced` | `#E07A7A` | `#8B3A3A` | 精读 |
| `--focus-ring` | `#E2C58D` | = accent | 焦点 |
| `--shadow` | `0 16px 48px rgb(0 0 0 / .55)` | `0 8px 28px rgb(26 26 26 / .05)` | 下拉 |
| `--button-primary-bg` | `#E8EAED` | `#1A1A1A` | 深色主按钮=浅钢；浅色=墨 |
| `--button-primary-fg` | `#0A0C10` | `#FFFCF8` | 主按钮字色 |

对比（已测）：正文 `#F3F5F7` on `#0A0C10` **17.9:1**；on surface `#222833` **13.5:1**；链接 `#E2C58D` on canvas **11.8:1**；次要字 `#9AA3B0` on canvas **7.7:1**、on surface **5.8:1**。系列卡与页底 **1.32:1**（旧值仅 1.07:1）。

#### 组件状态（深色，按此映射，勿保留旧青绿填充）

| 组件 | 默认 | 悬停 / 选中 / 禁用 |
|------|------|-------------------|
| 链接 | accent，下划线 1px offset .2em | 悬停加粗到 2px；不要改成青绿或高亮发光 |
| `.button` 主 | bg `--button-primary-bg`，字 `--button-primary-fg`，边同底，radius 6px，padding `9px 18px` | 悬停略亮（深色钢色可 `color-mix(..., #fff 6%)`）；深色**禁止**再用 accent 填满主按钮 |
| `.button.secondary` | 透明底 + primary 字 + `--border-subtle` | 悬停边/字可转 accent |
| Chip 默认 | canvas 底 + secondary 字 + subtle 边 | — |
| Chip / Segmented 选中 | accent-soft 底 + accent 字 + accent 边 + weight 700 | 禁用：opacity .5，不可点档保持「筹备中」文案 |
| `.format-badge` / 预告徽章 | 同选中 Chip 的金边金字，pill | — |
| `.featured-pick` | surface + 左侧 **3px accent** 条（已有，保留） | 不要再加外发光 |
| PreviewCard `.planned` | muted 底 + **dashed** 边 +「预告」徽章 | 无假链接 |
| `.takeaways` | accent-soft 底 + 左侧 2px accent 栏线（不要整块亮金或旧薄荷绿） | — |
| `.brand-mark` | accent 底 + canvas 字；衬线 | — |
| `.story-toc` | muted 底、subtle 左边线；当前节 accent 字 | — |
| AppBar | surface 90% + `blur(12px)` + subtle 底边 | — |
| 输入 / 搜索 | canvas 底 + primary 字 + subtle 边 | 焦点：`--focus-ring` 2px offset 2–4px |
| Hero / 故事 H1 | primary，**衬线**，字重 **600**（不要 800，不要渐变字） | — |

#### 字体（深浅共用，见 §8.1）

- UI / 正文：系统无衬线（PingFang SC / Hiragino / YaHei 等，根 17px / 行高 1.7；故事正文 1.02rem / 1.95）
- 标题（`h1`、系列名、故事 H2 节题）：`--font-serif`：`"Noto Serif SC", "Songti SC", "STSong", Georgia, serif`
- 可选：引入 [Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC)（OFL），仅标题；未加载则走系统宋体回退，**不要为了字体阻塞上线**
- 序号 / 等宽：`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
- 中文标题字距接近 0（`-0.02em` 即可），不要套拉丁标题的大负字距

#### 给 Nibble 的落地清单（今晚可上线）

1. 整段替换 `html[data-theme="dark"]` 为下方 D 值（含 `--button-primary-*`、`--level-*`、`--shadow`）。
2. 浅色 `:root`：改 `--accent: #6B4F1A`、`--accent-soft: #F0E6D0`、`--focus-ring`、以及 `--button-primary-bg/fg`；纸色 token 不动。
3. `.button` 改读 `--button-primary-*`，删掉「深色按钮字用 canvas、底用 accent」的旧规则。
4. `.brand-mark` 深色：`background: var(--accent); color: var(--bg-canvas)`。
5. `h1`、`.page-header h1`、`.story-header h1`、`.featured-pick h2`、内容区 `h2`：`font-family: var(--font-serif); font-weight: 600`。
6. Chip / Segmented / badge / takeaways 按上表，清掉旧 `--accent` 实心主按钮和旧薄荷绿大色块。
7. **禁止再出现** `#0C0B0A` `#161412` `#F5F0E8` `#3DDCB0` `#12352F` `#09090B` `#2DD4BF`。
8. 不加渐变、发光、暖色 canvas 染色。
9. 间距、栅格、圆角、口径（§5–§8.4 / §7）**不要重做**；只换色、字、按钮语义。
10. 推 Pages 后让 UI-web 复扫：深色首页 + 故事页 + `/terms/` + 浅色对照一页。
11. **2026-11-17 补丁（方案 B）**：仅改 dark 的 `--bg-surface: #222833`、`--border-subtle: #3A4250`、`--bg-muted: #2A313E`。`--bg-canvas` 及其他 token **不要动**。改完推 Pages，再让 UI-web 复扫深色首页系列卡与故事页。

```css
/* Nibble：:root 增补（浅色） */
:root {
  --accent: #6B4F1A;
  --accent-soft: #F0E6D0;
  --focus-ring: #6B4F1A;
  --button-primary-bg: #1A1A1A;
  --button-primary-fg: #FFFCF8;
  --font-serif: "Noto Serif SC", "Songti SC", "STSong", Georgia, serif;
}

/* Nibble：整段替换 dark 主题 */
html[data-theme="dark"] {
  --bg-canvas: #0A0C10;
  --bg-surface: #222833;
  --bg-muted: #2A313E;
  --text-primary: #F3F5F7;
  --text-secondary: #9AA3B0;
  --border-subtle: #3A4250;
  --accent: #E2C58D;
  --accent-soft: #221E16;
  --level-beginner: #6FCF9F;
  --level-intermediate: #E0B25A;
  --level-advanced: #E07A7A;
  --focus-ring: #E2C58D;
  --shadow: 0 16px 48px rgb(0 0 0 / .55);
  --button-primary-bg: #E8EAED;
  --button-primary-fg: #0A0C10;
  color-scheme: dark;
}

.button {
  background: var(--button-primary-bg);
  color: var(--button-primary-fg);
  border-color: var(--button-primary-bg);
}
html[data-theme="dark"] .button { color: var(--button-primary-fg); } /* 覆盖旧「深色按钮字=canvas」 */
.button.secondary {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border-subtle);
}
h1, .story-content h2, .page-header h1, .featured-pick h2, .section-heading h2 {
  font-family: var(--font-serif);
  font-weight: 600;
}
```

---

## 4. 组件清单（partial 建议）

| 组件 | 状态 | 说明 |
|------|------|------|
| `app-bar` | 默认 | Logo、主导航、ThemeToggle；移动汉堡 |
| `theme-toggle` | light/dark | |
| `filter-bar` | 完整 / 场景锁定 | URL 同步 |
| `series-card` | default / soon（筹备中） | 底部「M 篇可读 · K 篇预告」或「筹备中」；soon 不可进假列表 |
| `story-card` | 列表 / 主推 / 续读 / 预告 | 主推仅 1 张；预告不可点进假页，角标「预告」 |
| `level-badge` | L1/L2/L3 | 色 + 文字双通道 |
| `tag-chip` | default/selected/readonly | |
| `term-table` | 1–5 行 | 术语 \| 解释 \| 故事里对应；术语链 `/terms/#` |
| `story-toc` | 侧栏/折叠 | 当前节高亮 |
| `back-link` | | 文案写清目的地，勿只写「返回」 |
| `empty-state` | 筛选无果 / 系列筹备中 | 筛选无果→清除；筹备中→引导首发系列（见 §7） |
| `term-row` | | 索引列表行 |
| `takeaways` | 可选 | 「带走这几句」列表；无则整块不渲染 |
| `disclaimer` | | 页脚；优先篇级 disclaimer |

内容字段对齐 `docs/CONTENT_SCHEMA.md` 与 `content/taxonomy.json`（`difficulty`: L1|L2|L3；`tags` 中文 id）。

---

## 5. 断点与可访问性

- 断点建议：`<720` 单列；`≥720` 系列栅格 2 列；`≥1040` 故事页 Toc 左侧 sticky + 正文。
- 焦点可见（`--focus-ring`）；Skip 链到 `#main`；对比度正文 ≥ 4.5:1。
- Chip 选中不只靠颜色（字重或勾）。
- 语义：`nav` / `main` / `article` / 表格用真实 `table`；链接与按钮勿混用。
- 动效可关：尊重 `prefers-reduced-motion`。

---

## 6. 落地优先级

### P0（可访问预览，验收前）

1. AppShell + 四路由静态页（可用样例 JSON/MD）
2. 首页系列栅格（首批 3）+ 精选
3. 系列页 FilterBar + StoryCard + 空态
4. 故事页 BackLink、Badge、正文、TermTable、实例、简易 Toc
5. `/terms/` 扁平列表 + 同 FilterBar + 反查故事
6. `data-theme` + ThemeToggle + 上表 token
7. 筛选 ↔ URL query
8. 基础 a11y + 页脚非投资建议声明

### P1

搜索；术语字母/拼音轨；相关推荐精修；跟随系统主题；滚动收起 AppBar；CMS/Git 内容流；OG 分享卡。

---

## 7. 结果口径修真（本周 · 给 Nibble）

目标：页面上的数字与分区**只反映真实可点内容**，不把大纲预告算进「已发布 / 故事」，空系列不假装有列表。手机术语表卡片化本周不做。

### 7.1 名词（全站统一）

| 文案 | 含义 | 数据来源 |
|------|------|----------|
| **可读** | 已有完整故事/理念页、可点进 `/story/<slug>/` | `content/stories/*.md`（含 `format: brief`） |
| **预告** | 仅大纲、无正文页 | `planned-stories.json`；同 slug 故事上线后自动消失 |
| **筹备中** | 该系列可读=0 且预告=0（或产品决定暂不开放入口） | 系列 frontmatter / 计数双零 |

禁止再用含混「共 N 篇」「N 篇故事」把预告混进可读。brief 计数用语：**理念** 可替代「故事」（如 `1 篇理念 · 4 篇预告`），勿写「1 篇故事」指 brief。

### 7.2 首页 Hero 诚实数字

现网示例：`7 个场景 · 5 篇已发布 · 12 篇大纲预告` —— 结构可用，文案收紧为：

```
{场景数} 个场景 · {可读数} 篇可读 · {预告数} 篇预告
```

规则：

1. **场景数** = 导航/栅格里露出的系列数（含筹备中卡），与 IA 一致。
2. **可读数** = 全站已发布 story+brief 篇数；**预告数** = 全站 planned 条数。
3. 三个数均服务端/构建时写入，禁止手写死数；构建无内容时显示 `0`，不要藏掉整行。
4. 副文案仍可保留「不是先背定义…」；数字行用 `.small` / secondary，勿做成大统计墙。

### 7.3 「先读这一篇」：1 主推 + 续读

区块标题保持 **「先读这一篇」**（或等价）。

| 槽位 | 数量 | UI |
|------|------|-----|
| **主推** | **恰好 1** | 大卡：可用 1 列通栏或左宽；`format-badge`（理念时）、Level、场景 Chip、钩子、主 CTA「开始阅读」 |
| **续读** | **0–4** | 较小 StoryCard 栅格（桌面 2 列，窄屏 1 列）；无「开始阅读」大按钮，标题可点即可 |
| 预告 | **不进本区** | 预告只出现在系列页「接下来」 |

内容侧（Bullie/Salt）用 frontmatter 标主推（如 `featured: primary` / `featured: true` 且排序第一）；工程若多篇标了 primary，**只取排序第一篇**为主推，其余降为续读。无主推时：取最近可读 1 篇顶上，续读接后，勿留空主推槽。

### 7.4 系列卡底部与保险入口

`SeriesCard` 底部文案：

| 状态 | 底部 | 点击 |
|------|------|------|
| 有可读或有预告 | `{M} 篇可读 · {K} 篇预告`（M/K 为 0 时可省略零项，但两者都 0 走下一行） | 进入系列页 |
| brief 系列 | `{M} 篇理念 · {K} 篇预告` | 同上 |
| **筹备中** | 文案 **「筹备中」**（替代现网「即将上线」，语义更准）+ 可选一行小字「首篇供稿中」 | **仍可进系列页**看筹备中态；或 `soon` 卡不进——二选一须全站统一。**推荐：可进**，避免死链感 |
| 保险 / `family-protection` | 在首篇 L1 上线前按筹备中态；首篇上线后立刻切「1 篇可读 · …」 | 同上 |

`soon` 样式：opacity ~0.65 可保留；不要用「0 篇故事 · 0 篇预告」充当底部主文案（数字可放系列页页头）。

### 7.5 系列页分区：已发布 / 接下来 / 筹备中

页头计数：

```
{M} 篇可读 · {K} 篇预告
```

筛选结果行（Filter 下方）拆分，勿只写「N 个结果」：

```
可读 {a} · 预告 {b}
```

`a/b` 为**当前筛选后**的可读/预告数；筛选只影响列表，不改页头全量计数（页头始终全系列未筛选总量）。若实现成本高，页头与结果行可都跟筛选走，但须在结果行标注「筛选后」。

列表结构（有内容时）：

```
## 已发布          ← 仅可读卡；无则整节不渲染
[StoryCard…]

## 接下来          ← 仅预告卡；无则整节不渲染
[PreviewCard：标题+钩子+「预告」角标；不可进 /story/ 假页]
```

空系列（可读+预告皆 0，或筛选后双 0 且无筛选条件）：

```
[筹备中条 PreparingBanner]
  标题：这个场景正在筹备中
  说明：内容供稿中。可先读「市场与周期 / 第一笔工资 / 买房与负债」。
  CTA：链到一个首发系列（默认 markets-cycles）
```

筛选后无命中（但系列本身有文）：沿用现有 EmptyState +「清除筛选」，**不要**用筹备中文案。

### 7.6 PreviewCard（预告）

- 视觉：同 StoryCard 外轮廓，但 `border-style: dashed` 或右上角 Chip「预告」。
- 不可 `href` 到不存在的 story URL；整卡 `aria-disabled` 或仅为占位，标题用 `<span>` 非空链。
- 可显示难度/标签（若大纲有）；不显示「开始阅读」。

### 7.7 Nibble 验收清单（口径）

1. Hero 三数字 = 构建时真实场景/可读/预告，与内容目录一致。  
2. 「先读这一篇」主推 ≤1，预告不出现在该区。  
3. 系列卡与系列页头用「可读·预告」拆分；筹备中文案统一。  
4. 系列页「已发布 / 接下来」分区；空系列筹备中条+首发 CTA。  
5. 筛选结果行拆分可读/预告；筛选无果 ≠ 筹备中。  
6. 预告卡无假故事链接。  

---

## 8. 视觉细节规范（字体 / 配色 / 间距 / 组件）

供工程直接抄变量；与现网 Warm Editorial C 对齐。改色只改 token，不改组件内魔法色。

### 8.1 字体

| 角色 | 栈 | 说明 |
|------|-----|------|
| **正文 UI** | `-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif` | 系统优先，中文可读 |
| **标题衬线** `--font-serif` | `"Noto Serif SC", "Songti SC", "STSong", Georgia, serif` | `h1`、故事/系列 H2、主推标题；可选加载 Noto Serif SC |
| **品牌角标「知」** | 同 `--font-serif` | `.brand-mark` |
| **序号 / 等宽点缀** | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | `.series-order`、`.section-number` |

**字号阶梯（根 17px）**

| Token / 用途 | Size | Weight | Line-height | Letter-spacing |
|--------------|------|--------|-------------|----------------|
| Display / `h1` | `clamp(2rem, 4vw, 3.1rem)` · 衬线 | **600** | 1.25 | -0.02em |
| Title / `h2` | `clamp(1.4rem, 2.5vw, 1.85rem)` · 衬线 | **600** | 1.25 | -0.02em |
| Heading / `h3` | 1.15–1.3rem | 650–700 | 1.3 | 0 |
| Body | 17px（1rem） | 400 | **1.7** | 0 |
| Article body | 1.02rem | 400 | **1.95** | 0 |
| Lead / `.hero-lead` | 1.12rem | 400 | 1.8 | 0 |
| UI / nav | 0.92rem | 400–500 | 1.4 | 0 |
| Meta / `.small` | 0.78–0.82rem | 400 | 1.4 | 0 |
| Eyebrow | 0.78rem | 700 | 1.2 | 0.15em；大写可选 |
| Chip / badge | 0.72–0.8rem | 650–700 | 1.4 | 0 |
| Button | 0.9rem | 650 | 1.2 | 0 |

中文勿用过负字距；`h1–h3` 可用 `text-wrap: balance`。

### 8.2 配色（完整 token 表）

以 **§3.2 方向 D** 为准（下表与之同步）。深色禁止 zinc 与 Warm Editorial C 旧值。

| Token | Light | Dark D · Cool Ink Press |
|-------|-------|--------------------------|
| `--bg-canvas` | `#F7F5F0` | `#0A0C10` |
| `--bg-surface` | `#FFFCF8` | `#222833` |
| `--bg-muted` | `#EFEBE3` | `#2A313E` |
| `--text-primary` | `#1A1A1A` | `#F3F5F7` |
| `--text-secondary` | `#5C5A55` | `#9AA3B0` |
| `--border-subtle` | `#E2DDD3` | `#3A4250` |
| `--accent` | `#6B4F1A` | `#E2C58D` |
| `--accent-soft` | `#F0E6D0` | `#221E16` |
| `--level-beginner` | `#2F6F4E` | `#6FCF9F` |
| `--level-intermediate` | `#9A6B12` | `#E0B25A` |
| `--level-advanced` | `#8B3A3A` | `#E07A7A` |
| `--focus-ring` | = accent | `#E2C58D` |
| `--shadow` | `0 8px 28px rgb(26 26 26 / .05)` | `0 16px 48px rgb(0 0 0 / .55)` |
| `--button-primary-bg` | `#1A1A1A` | `#E8EAED` |
| `--button-primary-fg` | `#FFFCF8` | `#0A0C10` |

对比：正文 ≥ 4.5:1（深色 canvas 17.9:1，surface 13.5:1）；链接 `#E2C58D` on canvas 11.8:1。深色 **禁止** `#09090B` / `#2DD4BF` / `#0C0B0A` / `#F5F0E8` / `#3DDCB0`。`--bg-surface` / `--border-subtle` / `--bg-muted` 以 2026-11-17 方案 B 为准，勿退回 `#12151B` / `#252A33` / `#1A1E26`。

### 8.3 页边距 · 内容宽 · 栅格 · 间距节奏

| 项 | 值 |
|----|-----|
| **最大内容宽** `.container` | `1160px` |
| **水平页边** | 桌面两侧合计：`calc(100% - 40px)` → 约各 20px；窄屏 `<720`：`calc(100% - 28px)` |
| **AppBar 高** | min-height **68px**；sticky；`backdrop-filter: blur(12px)` |
| **故事 Toc + 正文** | 桌面 `170px + minmax(0,730px)`，gap **56px**；平板 Toc 130px gap 32px；窄屏 Toc 置顶横滑 |
| **系列栅格** | ≥1040：3 列；720–1039：2 列；&lt;720：1 列；gap **16px** |
| **精选续读栅格** | 桌面 2 列；窄屏 1 列；gap 16px |
| **区块竖距** `.section` | padding-top **56px**（窄屏 40px） |
| **Hero** | padding `88px 0 72px`（窄屏 `48px 0`） |
| **间距阶梯** | `--space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 20 · `6` 24 · `8` 32 · `10` 40 · `12` 48 |
| **卡片内边距** | Series/Story：**24px**；Filter panel：24px；Term row：`20px 24px` |
| **Footer** | margin-top 72px；padding 28px 0 |

### 8.4 圆角 · 阴影 · 边线

| Token | 值 | 用于 |
|-------|-----|------|
| `--radius-sm` | **6px** | 按钮、输入、brand-mark、小菜单项 |
| `--radius-md` | **10px** | Filter、StoryCard、TermRow、下拉 |
| `--radius-lg` | **16px** | SeriesCard |
| Pill | `999px` | Chip、format-badge、theme-toggle |
| 边线 | `1px solid var(--border-subtle)` | 默认；选中/强调改 accent |
| 阴影 | `var(--shadow)` | 下拉、少量抬升；卡片默认**无阴影**，靠边线 |

### 8.5 组件尺寸速查

**按钮 `.button`**

- padding `9px 18px`；radius sm；font 0.9rem / 650  
- Primary：bg `--button-primary-bg`，字 `--button-primary-fg`（浅色墨底、深色浅钢；**不再用 accent 填满**）  
- Secondary：透明底 + primary 字 + `--border-subtle` 边；悬停可转 accent  
- 主操作区按钮 gap 12px  

**Chip / Segmented**

- Chip padding `4px 12px`；font 0.8rem；默认 canvas 底 + secondary 字  
- 选中：accent-soft 底 + accent 字 + accent 边 + weight 700  
- Segmented 外壳 padding 3px；项 `3px 14px`  

**Format badge「理念」**

- font 0.72rem / 700；padding `1px 8px`；pill；accent-soft + accent 边字  

**SeriesCard**

- min-height **228px**；padding 24px；radius lg  
- 标题约 1.3rem；摘要 0.9rem secondary  
- soon：opacity 0.65；底部「筹备中」  

**StoryCard**

- padding 24px；radius md  
- 主推：可加 `border-color: accent` 或左侧 3px accent 条以区分续读（任选一，全站统一）  
- 预告：dashed 边或「预告」Chip，见 §7.6  

**TermTable**

- font 0.88rem / lh 1.7；单元格 padding **16px**  
- thead：bg muted；术语列 min-width 90px、字色 accent  
- 外层 `.table-wrap { overflow-x: auto }`；窄屏不拆三列语义  

**Brand mark**

- 32×32；radius sm；浅：accent 底 + surface 字；深：accent 底 + canvas 字  

**Theme toggle**

- padding `5px 10px`；pill；muted 底；窄屏可藏文字只留图标  

### 8.6 断点（与 §5 一致，便于复制）

| 名称 | 宽度 | 行为 |
|------|------|------|
| Compact | `<720px` | 单列；Hero 单栏；Toc 横排；Filter 改纵排 |
| Medium | `720–1039` | 系列 2 列；故事 Toc 变窄 |
| Wide | `≥1040` | 系列 3 列；Toc sticky 左侧 |

### 8.7 工程自检（视觉）

1. 深浅切换无组件内写死 hex（除 `:root` / `[data-theme]`）。  
2. 正文 17px/1.7，故事正文 ~1.95 行高；`h1`/`h2` 为衬线 600。  
3. container 1160、水平边 20/14。  
4. 圆角仅用 sm/md/lg/pill 四档。  
5. 深色 token = **Cool Ink Press D + 方案 B 表面**（页底 `#0A0C10` / 卡片 `#222833` / 边 `#3A4250` / muted `#2A313E` / 字 `#F3F5F7` / 栏线金 `#E2C58D` / 浅钢按钮），非 zinc，亦非 Warm Editorial C，亦非 D 初版卡片 `#12151B`。  
6. 源码中不得残留 `#3DDCB0`、`#0C0B0A`、`#F5F0E8`、`#2DD4BF`、`#09090B`。  

---

## 9. Feature Map（给工程对照，改深色时认这些入口）

一份界面地图，避免改错块或漏状态。路由与口径仍以 §1 / §7 为准；本表只标「今晚换肤」要碰的位置。

### 9.1 文件

| 路径 | 作用 |
|------|------|
| `src/assets/site.css` | 几乎全部视觉 token 与组件皮肤；**今晚主战场** |
| `src/assets/site.js` | ThemeToggle（`localStorage['finance-story-theme']`）；一般不用改 |
| `src/_includes/*`、`src/index.njk`、`src/series.njk`、`src/story.njk`、`src/terms.njk` | 结构/class；仅当缺 `--font-serif` 挂钩或主按钮 class 时才改 |
| `docs/_preview/theme-d-cool-ink.html` | 设计预览，不必部署到 Pages |

### 9.2 页面块

```
全站壳
  header.app-bar                粘顶、blur、品牌「知」、导航、[data-theme-toggle]
    .brand-mark                 金底墨字（深色）
    .series-menu                筹备中项为 span.is-preparing，不是死链
  main#main
  footer.site-footer

/  首页
  .hero
    h1                          衬线 600
    .hero-lead
    .hero-note                  数字行：N 个场景 · M 篇可读 · K 篇预告
                                窄屏：只藏长文案，保留数字（Nibble 另项，可同批）
    .hero-actions .button       主=浅钢，次=描边
  #series .series-grid          仅有内容的系列卡
    .series-card / .card-bottom 「M 篇可读 · K 篇预告」
    aside.preparing-block       筹备中条（做生意 · 养老与传承）
  #start                        「先读这一篇」
    .story-card.featured-pick   仅 1；左 3px accent；CTA「开始阅读」
    .continue-reads             续读 0–4，无预告

/series/<slug>/
  .page-header                  「M 篇可读 · K 篇预告」
  .filter-panel                 Chip / Segmented；筹备中档 disabled
  .result-line                  「可读 a · 预告 b」+「筛选后」
  [data-published-list]         已发布
  details.preview-block         接下来；.story-card.planned dashed，h3 为 span 无假链
  空系列                        筹备中条 + 首发 CTA（勿用筛选无果文案）

/story/<slug>/
  .back-link / .breadcrumb
  .story-header h1              衬线 600
  .story-toc                    muted 底；brief 首项文案「理念」
  .article-body                 17–1.02rem / 1.95
  .term-table                   thead muted
  .takeaways                    accent-soft + 左栏线
  .related                      「继续读这个系列」

/terms/
  .term-search input
  .term-row                     :target 边 = accent
```

### 9.3 主题开关（不要改逻辑）

- `html[data-theme="light|dark"]`
- 首屏脚本读 `localStorage.finance-story-theme`
- 按钮：`[data-theme-toggle]`、`[data-theme-label]`、`[data-theme-icon]`

---

改筛选摆法或组件找 UI-web；改事实与难度找 Bullie；工程实现找 Nibble；协调找 Salt。
