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

切换只改 `data-theme`，组件不写死色值。深色按 Dong 反馈 #1 重做（Warm Editorial）；浅色仅微调 surface/accent。

### 3.1 浅色（沿用）

| Token | light | 用途 |
|-------|-------|------|
| `--bg-canvas` | `#F7F5F0` | 页底 |
| `--bg-surface` | `#FFFCF8` | 卡片/顶栏（暖白，与 §3.2 一致） |
| `--bg-muted` | `#EFEBE3` | Chip/表头 |
| `--text-primary` | `#1A1A1A` | 正文 |
| `--text-secondary` | `#5C5A55` | 元信息 |
| `--border-subtle` | `#E2DDD3` | 边线 |
| `--accent` | `#1A7A68` | 链接/主按钮（与现网一致） |
| `--accent-soft` | `#E4F2EE` | 选中 Chip |
| `--level-l1` / `--level-beginner` | `#2F6F4E` | 入门 |
| `--level-l2` / `--level-intermediate` | `#9A6B12` | 进阶 |
| `--level-l3` / `--level-advanced` | `#8B3A3A` | 精读 |
| `--focus-ring` | = accent | 键盘焦点 |

### 3.2 深色重做（Dong 反馈 #1 · 杂志感）

现网深色偏「普通 zinc 模板」。下列三向短评后，**采用方向 C**。

#### 三向短评

| 方向 | 参考 | 气质 | 评价 |
|------|------|------|------|
| A · Cold Gallery | Godly、v0、Bolt 系近黑+青 | 画廊克制、对比极强 | 干净，但易像 AI 默认深色；长文略冷硬 |
| B · Product Slate | Refero、Mobbin、Lovable 系蓝灰 | 产品/后台感 | 筛选区舒服，故事站缺「刊物」温度 |
| **C · Warm Editorial（推荐）** | Awwwards 编辑向、Land-book 青绿、WebSim/same 实验站的纸感暗页 | 暖炭黑 + 奶油字 + 青绿点缀 | 适合寓言长文；有辨识度又不花哨 |

#### 推荐：方向 C — Warm Editorial Dark

浅色：**微调**（见下），不大改结构。

| Token | dark C（推荐） | light 微调 | 用途 |
|-------|----------------|------------|------|
| `--bg-canvas` | `#0C0B0A` | `#F7F5F0`（不变） | 页底：暖炭黑 / 暖纸 |
| `--bg-surface` | `#161412` | `#FFFcf8` ← 略暖白 | 顶栏、卡片、Filter |
| `--bg-muted` | `#221F1C` | `#EFEBE3`（不变） | Chip 底、表头、Toc |
| `--text-primary` | `#F5F0E8` | `#1A1A1A`（不变） | 奶油墨 / 暖墨 |
| `--text-secondary` | `#A39E94` | `#5C5A55`（不变） | 元信息 |
| `--border-subtle` | `#2C2925` | `#E2DDD3`（不变） | 发丝边 |
| `--accent` | `#3DDCB0` | `#1A7A68` ← 略提亮对齐深色 | 链接、主按钮、选中字 |
| `--accent-soft` | `#12352F` | `#E4F2EE`（不变） | 选中 Chip / Segmented |
| `--level-beginner` | `#5EE9B5` | `#2F6F4E` | 入门 |
| `--level-intermediate` | `#E4B84A` | `#9A6B12` | 进阶 |
| `--level-advanced` | `#F07178` | `#8B3A3A` | 精读 |
| `--focus-ring` | `#3DDCB0` | = accent | 焦点 |
| `--shadow` | `0 16px 48px rgb(0 0 0 / .55)` | `0 8px 28px rgb(26 26 26 / .05)` | 可选抬升 |

Chip 规则（深色）：默认 = muted 底 + secondary 字 + subtle 边；选中 = accent-soft 底 + accent 字 + accent 边 + font-weight 700。

#### 给 Nibble 的落地清单（仅 CSS 变量 / 映射，不改 IA）

1. 替换 `html[data-theme="dark"] { … }` 为上表 dark C 值（含 `--level-*` 与 `--shadow`）。
2. 浅色 `:root`：仅改 `--bg-surface: #FFFcf8`、`--accent: #1A7A68`（及 `--focus-ring` 跟 accent）；其余不动。
3. `.brand-mark` 深色：`background: var(--accent); color: var(--bg-canvas)`。
4. AppBar：继续半透明 surface + blur；`border-bottom` 用新 `--border-subtle`。
5. `.chip.selected` / Segmented checked：强制 `background: var(--accent-soft); color: var(--accent); border-color: var(--accent)`。
6. `.term-table thead`、`.story-toc`：`background: var(--bg-muted)`。
7. Hero / 故事 H1：深色下可用略暖字色（已是 `--text-primary`）；**不加渐变、不加发光描边**（避免模板感）。
8. 对比自检：正文 `#F5F0E8` on `#0C0B0A`；链接 `#3DDCB0` on canvas/surface ≥ 3:1（大字/UI）。
9. 推 Pages 后让 UI-web 再扫深色首页 + 故事页 + `/terms/`。

```css
/* Nibble：整段替换 dark 主题 */
html[data-theme="dark"] {
  --bg-canvas: #0C0B0A;
  --bg-surface: #161412;
  --bg-muted: #221F1C;
  --text-primary: #F5F0E8;
  --text-secondary: #A39E94;
  --border-subtle: #2C2925;
  --accent: #3DDCB0;
  --accent-soft: #12352F;
  --level-beginner: #5EE9B5;
  --level-intermediate: #E4B84A;
  --level-advanced: #F07178;
  --focus-ring: #3DDCB0;
  --shadow: 0 16px 48px rgb(0 0 0 / .55);
  color-scheme: dark;
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
| **正文 UI** | `-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif` | 系统优先，中文可读 |
| **品牌角标「知」** | `Georgia, "Noto Serif SC", serif` | 仅 `.brand-mark` |
| **序号 / 等宽点缀** | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | `.series-order`、`.section-number` |

**字号阶梯（根 17px）**

| Token / 用途 | Size | Weight | Line-height | Letter-spacing |
|--------------|------|--------|-------------|----------------|
| Display / `h1` | `clamp(2rem, 4vw, 3.35rem)` | 700 | 1.25 | -0.035em |
| Title / `h2` | `clamp(1.4rem, 2.5vw, 1.85rem)` | 700 | 1.25 | -0.02em |
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

与 §3 一致，此处给工程一张可复制总表：

| Token | Light | Dark（Warm Editorial C） |
|-------|-------|--------------------------|
| `--bg-canvas` | `#F7F5F0` | `#0C0B0A` |
| `--bg-surface` | `#FFFCF8` | `#161412` |
| `--bg-muted` | `#EFEBE3` | `#221F1C` |
| `--text-primary` | `#1A1A1A` | `#F5F0E8` |
| `--text-secondary` | `#5C5A55` | `#A39E94` |
| `--border-subtle` | `#E2DDD3` | `#2C2925` |
| `--accent` | `#1A7A68` | `#3DDCB0` |
| `--accent-soft` | `#E4F2EE` | `#12352F` |
| `--level-beginner` | `#2F6F4E` | `#5EE9B5` |
| `--level-intermediate` | `#9A6B12` | `#E4B84A` |
| `--level-advanced` | `#8B3A3A` | `#F07178` |
| `--focus-ring` | = accent | `#3DDCB0` |
| `--shadow` | `0 8px 28px rgb(26 26 26 / .05)` | `0 16px 48px rgb(0 0 0 / .55)` |

对比：正文 primary on canvas ≥ 4.5:1；accent 作大字/UI ≥ 3:1。深色 **禁止** zinc `#09090B` / `#2DD4BF`。

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
- Primary：bg accent + 边 accent；浅色字 surface，深色字 canvas  
- Secondary：透明底 + accent 字 + accent 边  
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
2. 正文 17px/1.7，故事正文 ~1.95 行高。  
3. container 1160、水平边 20/14。  
4. 圆角仅用 sm/md/lg/pill 四档。  
5. 深色 token = Warm Editorial C，非 zinc。  

---

改筛选摆法或组件找 UI-web；改事实与难度找 Bullie；工程实现找 Nibble；协调找 Salt。
