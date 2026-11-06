# UI-web 对接清单（给 Nibble）

落地目标：**静态 HTML + CSS**，`html[data-theme="light|dark"]`；无框架。模块化 partial（`_includes`）便于加系列。

设计页（可对照）：[金融知识故事站 · UI/IA 设计说明](https://cursor.com/canvas/store-0a778d36-2353-4703-8e82-392174bb999d/b48f1bd5-6846-477d-8b16-7b941ad558f9)

---

## 1. 页面线框

### 首页 `/`

```
[AppBar: Logo | 首页 系列▾ 术语 | ThemeToggle]
[Hero: 一句话定位 + CTA「从场景开始」/「术语索引」]
[系列栅格 SeriesCard × 首批 3，其余可灰显「即将」]
[标签快捷 TagChip × 5 → 写入 ?tag= 刷新精选或跳系列列表过滤态]
[精选故事 StoryCard 列表]
[Footer: 非投资建议短声明]
```

### 系列页 `/series/<slug>/`

```
[AppBar]
[系列名 + 导语 + 篇数]
[FilterBar: 场景 Chip 锁定只读 | 标签多选 | 难度 Segmented 全部/入门/进阶/精读]
[已选摘要 + 清除]  [共 N 篇]
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

| Token | light | dark | 用途 |
|-------|-------|------|------|
| `--bg-canvas` | `#F7F5F0` | `#12141A` | 页底 |
| `--bg-surface` | `#FFFFFF` | `#1A1D26` | 卡片/顶栏 |
| `--bg-muted` | `#EFEBE3` | `#242833` | Chip/表头 |
| `--text-primary` | `#1A1A1A` | `#F2F0EA` | 正文 |
| `--text-secondary` | `#5C5A55` | `#A8A59C` | 元信息 |
| `--border-subtle` | `#E2DDD3` | `#2E3340` | 边线 |
| `--accent` | `#1F6B5C` | `#3D9B88` | 链接/主按钮 |
| `--accent-soft` | `#E4F2EE` | `#1A3330` | 选中 Chip |
| `--level-l1` | `#2F6F4E` | `#5CB88A` | 入门 |
| `--level-l2` | `#9A6B12` | `#E0B84A` | 进阶 |
| `--level-l3` | `#8B3A3A` | `#E07A7A` | 精读 |
| `--focus-ring` | = accent | = accent | 键盘焦点 2px |

配套：`--radius-sm/md/lg` = 6/10/16；间距 4 的倍数（8–48）；正文 16–18px / 行高 ~1.7。  
`ThemeToggle` 写入 `localStorage`；跟随系统为 P1。

---

## 4. 组件清单（partial 建议）

| 组件 | 状态 | 说明 |
|------|------|------|
| `app-bar` | 默认 | Logo、主导航、ThemeToggle；移动汉堡 |
| `theme-toggle` | light/dark | |
| `filter-bar` | 完整 / 场景锁定 | URL 同步 |
| `series-card` | default / soon | 标题、摘要、篇数、难度点 |
| `story-card` | 列表/精选 | 场景角标、标签、难度、钩子 |
| `level-badge` | L1/L2/L3 | 色 + 文字双通道 |
| `tag-chip` | default/selected/readonly | |
| `term-table` | 1–5 行 | 术语 \| 解释 \| 故事里对应；术语链 `/terms/#` |
| `story-toc` | 侧栏/折叠 | 当前节高亮 |
| `back-link` | | 文案写清目的地，勿只写「返回」 |
| `empty-state` | | 说明 + 清除筛选 |
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

改筛选摆法或组件找 UI-web；改事实与难度找 Bullie；工程实现找 Nibble；协调找 Salt。
