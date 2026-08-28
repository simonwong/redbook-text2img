---
status: accepted
---

# 移除标题装饰与装饰颜色配置

标题装饰（无/直线/波浪/高亮）与装饰颜色两个配置字段在实际使用中价值不足：用户明确反馈该功能不需要，且装饰颜色只服务标题装饰、语义孤立。本决策将两者端到端移除，h1–h2 回归纯文字渲染。

## Decision

- 样式配置不再包含标题装饰与装饰颜色。`StyleAdjustments`、`StyleConfiguration`、选项表、diff/sanitize/read 全链路删除这两个字段，设置面板"正文标题"分组只保留"正文标题对齐"。
- 渲染链路同步收敛：`HeadingStyle.decoration`、`deriveDecoration`、`createHeadingDecoration` 与 `GeneratedStyles.headingInner` 删除，预览与主题缩略图不再包裹标题内层 span。
- 装饰颜色曾承担的"高亮装饰对标题文字保持 4.5:1 对比度"派生逻辑（含对比度求解）随功能一并删除；Markdown 语义色本就不受装饰颜色影响，无需替代处理。
- 旧持久化值（`headingDecoration`、`decorationColor`，以及更早的 `accentColor` 与 `transparent` 哨兵）由 hydrate 白名单静默丢弃，不提升 persist 版本号，也不再保留专门的 transparent 迁移特判。

## Considered Options

- 保留装饰但简化选项（如只留高亮）：拒绝。用户明确要求去掉该功能；保留任一装饰形态都要继续维护对比度派生与导出兼容约束。
- 保留 decorationColor 字段供未来复用：拒绝。无消费方的字段只会制造"它到底影响什么"的困惑；将来若需要强调色，按届时语义重新设计。
- 提升 persist 版本号并显式迁移：拒绝。与 ADR 0002 一致，白名单丢弃已覆盖全部旧值形态，版本迁移无额外收益。

## Consequences

- 樱花奶霜（原波浪）、蜜光暖阳（原高亮）、三角极简与墨夜极光（原直线）的标题变为纯文字；主题间视觉区分由画布背景与 Foundation 语义色承担。
- 配置维度减少后，"任意两主题至少两个可见配置维度不同"的守卫降级为"至少一个"（清新白/蜜光暖阳仅背景预设不同，观感差异由 Foundation 样式保证）。
- ADR 0001 中"装饰颜色只参与标题装饰派生"一点随之失效，其余决策继续有效。
