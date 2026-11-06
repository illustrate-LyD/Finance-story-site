# IA：场景 × 标签 × 难度

读者：有一点投资经验；全文中文。

## 三轴与内容

1. 场景：每篇恰好一个。首发 `markets-cycles` 市场与周期、`first-paycheck` 第一笔工资、`home-and-debt` 买房与负债；另三个规划系列列卡预告。
2. 标签：可多选「投资 / 保险 / 宏观 / 微观 / 交易」。
3. 难度：内容保持 Bullie 的 L1/L2/L3，展示层为「入门 / 进阶 / 精读」。

## 路由

| 路由 | 页面 | 说明 |
|---|---|---|
| `/` | 首页 | Hero、六系列卡、五标签快捷、精选故事 |
| `/series/<slug>/` | 系列 | 场景锁定、标签多选、难度单选、故事与预告、空态 |
| `/story/<slug>/` | 故事 | 故事 → 术语表 → 实例 → 可选「带走这几句」 |
| `/terms/` | 索引 | 术语扁平列表、同筛选器、反查故事 |

统一查询：`?scene=&tag=&difficulty=`；tag 可重复或逗号分隔，difficulty 为 L1/L2/L3 或空。变更写 URL，刷新保持。

详见 `docs/CONTENT_SCHEMA.md`、`docs/DESIGN_HANDOFF.md`。
