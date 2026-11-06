# 内容迭代清单 · 2026-11-06（Bullie → Salt / Nibble）

站点：https://illustrate-LyD.github.io/Finance-story-site/  
规范：`docs/CONTENT_SCHEMA.md`；新字段 **`format`**: `story`（寓言，默认）| `brief`（事实/公开理念，不用小故事）

## A. 市场与周期 · 康波及相关

| slug | 标题 | 难度 | format | 状态 | 备注 |
|------|------|------|--------|------|------|
| kondratiev-long-wave | 五十年一遇的潮汐表 | L2 | story | **样例已交** | 康波定义、长波尺度、技术—信用联动；强调争议与不可作买卖时钟 |
| juglar-vs-kitchin | 库存的浪花与设备的潮 | L2 | story | 大纲 | 基钦/朱格拉与康波尺度对照 |
| tide-goes-out | 退潮才看见谁没穿泳裤 | L2 | story | 已有大纲 | 可与康波篇互链（杠杆×流动性） |
| debt-supercycle-sketch | 债台与水位线 | L3 | story | 大纲 | 长债务周期叙事（示意级，非预测） |

## B. 新系列 `investor-ideas` · 名人投资理念（非寓言）

系列页：`content/series/investor-ideas.md`（order 7, batch 1）

| slug | 标题 | 难度 | format | 状态 |
|------|------|------|--------|------|
| buffett-moat-margin | 巴菲特：护城河与安全边际 | L1 | brief | **样例已交** |
| soros-reflexivity | 索罗斯：反射性与盛衰序列 | L2 | brief | 大纲 |
| duan-buy-good-wait | 段永平：买好的、等等、少动作 | L1 | brief | 大纲 |
| graham-mr-market | 格雷厄姆：市场先生与安全边际源流 | L1 | brief | 大纲（可作巴菲特前传） |
| lynch-know-what-you-own | 彼得·林奇：只买你懂的生意 | L1 | brief | 大纲 |

## 样例路径

- `content/stories/kondratiev-long-wave.md`
- `content/stories/buffett-moat-margin.md`

## 给 Nibble

1. 认 `format`（story|brief）；brief 页可把 Toc「故事」文案改为「正文」或「理念」（UI-web 可定）
2. 新系列 `investor-ideas` 已进 `taxonomy.json` 与 `content/series/`
3. 重建并推 Pages；大纲项可进 `planned-stories.json` 显示预告卡
