---
title: 数据生成
description: 用提示工程让大模型造数据——合成数据、种子数据扩增、训练/测试样本生成，并讲清「先定 schema→few-shot→校验去重」的流程。
difficulty: 中级
readingTime: 9 分钟
tags: [应用, 数据生成, 合成数据]
---

# 数据生成

你做机器学习，差 500 条标注样本；或者你想测系统，需要一批假用户数据——这种**让大模型凭空（或基于种子）造出结构化数据**的活，就是**数据生成（Data Generation）**。它比手标快 100 倍，但得防「长得像、其实重复」的坑。

::: tip 一句话定义
**数据生成（Data Generation）** = 用模型批量产出结构化或文本数据，用于训练、测试、扩增等场景。
:::

## 为什么值得专门学

- **补数据缺口**：标注样本不够，模型造一批顶上。
- **造测试集**：压测、回归测试要批量假数据，秒出。
- **可控多样性**：通过提示控制分布（如「覆盖 10 个行业、各 50 条」）。

> 类比：生成数据像让模型当「数据工厂」——你给图纸（schema），它批量出货。

## 三种典型用法

| 用法 | 中文（English） | 说明 |
| --- | --- | --- |
| 合成数据 | 合成数据（Synthetic Data） | 从零造一批原创样本 |
| 种子扩增 | 数据扩增（Augmentation） | 给少量真实样本，让模型变异出更多 |
| 训练/测试样本 | 样本生成（Sample Generation） | 按标签分布造带标注数据 |

## 怎么做：三步走

1. **先定 schema**：要哪些字段、取值域、格式（JSON / CSV），写死。
2. **few-shot 打样**：给 2–3 条满意样本当范例，模型照着产，风格才一致。
3. **校验 + 去重**：代码侧查重、校验字段合法、过滤脏数据，必要时循环补足。

> 关键：别指望一次生成就完美。把它当流水线——生成 → 校验 → 补缺口，迭代几轮。

## 可复制示例（OpenAI 格式）

```js
// 需 API Key：https://platform.openai.com 获取，设为环境变量 OPENAI_API_KEY
// 模型：gpt-4o-mini（OpenAI, 2024 年发布，批量生成性价比高）；可换成 deepseek-chat
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ② few-shot：先给 2 条范例定调
const fewShot = [
  { text: '这家店的服务态度太差了，再也不来了', label: '负面' },
  { text: '物流很快，包装也很用心，好评', label: '正面' },
]

const completion = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  response_format: { type: 'json_object' },
  messages: [
    {
      role: 'system',
      content: '你是数据生成器，按 schema 产出 JSON 数组，不重复、不编造字段。',
    },
    {
      role: 'user',
      content: `请生成 5 条中文电商评论及情感标签，覆盖正面/负面/中性。
① schema：{ "data": [ { "text": "评论", "label": "正面|负面|中性" } ] }
② 参考范例（风格/口径）：
${JSON.stringify(fewShot, null, 2)}
③ 只返回 JSON，不要解释。`,
    },
  ],
})

const result = JSON.parse(completion.choices[0].message.content)
console.log(result.data)
// 输出示例（节选）：
// [ { text: '东西一般，没什么惊喜', label: '中性' },
//   { text: '客服耐心解答，非常满意', label: '正面' }, ... ]
```

**适用模型建议**：批量造数据用 `gpt-4o-mini` / `DeepSeek-V3` 省钱；要求高质量多样样本时可用 `gpt-4o` / `Claude 3.5 Sonnet`。

::: warning 常见坑
- **不定 schema**：字段乱飞，下游没法用。先锁死结构。
- **不 few-shot**：零样本造出来的语气/分布可能跑偏，给 2–3 条范例定调。
- **不去重**：模型爱生成「高频套路句」，重复率可能很高，必须代码去重。
- **不校验**：偶尔字段非法（如 label 拼错），代码侧校验过滤不可省。
:::

## 速查清单 ✅

- [ ] 先定死 schema（字段/类型/格式）
- [ ] 用 few-shot 给 2–3 条范例定调
- [ ] 代码侧查重 + 校验字段
- [ ] 生成→校验→补缺口，迭代几轮
- [ ] 批量用便宜模型（gpt-4o-mini / deepseek-chat）

## 记忆卡片 🃏

> **数据生成** = 让模型当数据工厂，批量造样本。
> 流程：定 schema → few-shot 打样 → 校验去重。别信一次成型。

## 小结

数据生成是**用模型批量造结构化数据**的流水线，核心是「先定 schema → few-shot 打样 → 校验去重」三步。它不一次成型，要生成→校验→补缺口迭代。七篇应用文到此收尾，更多技巧见 [技巧篇](/techniques/zero-shot) 与 [进阶篇](/advanced/cot)。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
