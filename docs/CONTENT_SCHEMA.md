# 内容供稿 Schema（P0）

主内容源是 `content/series/*.md`、`content/stories/*.md` 与共享术语。构建器在 `.eleventy.js` 把作者字段映射到 UI-web 的 Series / Story / Term 模型；**原始文件无需改写字段，也不覆盖 Bullie 正文**。

## Series

路径：`content/series/<slug>.md`

```yaml
---
slug: markets-cycles       # 也兼容现有 id；用于 /series/:slug/
title: 市场与周期
summary: 系列一句话简介
order: 1                   # 首页卡片顺序
batch: 1                   # 1=首发，2=规划（展示用）
---
系列详情（可选 Markdown）
```

对象：`{ slug, title, summary, order }`。首发三系：`markets-cycles`、`first-paycheck`、`home-and-debt`。其余三个系列可保留文件，首页显示「即将上线」。

## Story

路径：`content/stories/<slug>.md`

```yaml
---
slug: new-ship-and-resale  # 可省略，默认文件名；用于 /story/:slug/
title: 新船下水与旧船转手
seriesSlug: markets-cycles # 兼容现有 series
tags: [投资, 交易]         # 投资|保险|宏观|微观|交易
difficulty: L1             # 兼容 level；展示映射 L1→入门，L2→进阶，L3→精读
summary: 一句话钩子        # 兼容 hook
terms:                     # 兼容 termIds；每篇 1–5 个
  - id: 一级市场            # 可省略，默认 name；跨故事同名合并
    name: 一级市场
    gloss: 白话解释         # 兼容 definition
    alias: [发行市场]        # 可选
example_title: 可选
disclaimer: 本篇声明       # 可省略，使用站点默认
updated: YYYY-MM-DD         # 兼容 updatedAt
author: Bullie
---
故事正文（Markdown）

## 术语表
| 术语 | 解释 | 故事里对应 |
| ---- | ---- | ---------- |
| 一级市场 | … | 下水码头 |

## 实例
……

## 带走这几句          # 可选；没有则隐藏对应 Toc 与区块
- …
```

正文请继续保留「故事 → 术语表 → 实例」。构建器自动裁去正文中的手写术语表，改由 frontmatter 生成统一样式的四列表格（第三列取原表「故事里对应」，第四列为索引链）。「带走这几句」可省略。

内部对象：`{ slug, seriesSlug, title, hook, bodyMd, exampleMd, level, tags[], termIds[], updatedAt }`；渲染时额外生成 HTML 与完整 `terms[]`。

## Term

不必另建文件：构建从所有故事的 `terms` 取出，按同名 `id/name` 合并，反查 `storySlugs[]`。模型：`{ id, name, alias[], definition, storySlugs[] }`。索引为 `/terms/`，词条锚点 `/terms/#term-一级市场`。若后续同一术语需要统一长释义，可再拆共享 JSON，保持页面接口不变。

## 大纲预告

`content/planned-stories.json` 来自 `OUTLINES_BATCH1.md`，仅驱动「大纲预告」卡，不生成假故事页。故事 MD 到位后，同 slug 的预告自动移除。

## 路由与筛选

- `/`、`/series/<slug>/`、`/story/<slug>/`、`/terms/`
- `?scene=<slug>&tag=投资&tag=交易&difficulty=L1`
- 标签多选为 OR；scene 与 difficulty 单选；空值为全部；刷新、分享、后退保持一致。
- 系列页锁定 scene；故事页标签跳索引；难度 query 为 difficulty=L1|L2|L3。

事实、术语与难度由 Bullie 定稿；不荐具体买卖；每篇与页脚均有非投资建议声明。
