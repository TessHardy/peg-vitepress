---
title: 信息抽取
description: 用提示工程从自由文本里抠出结构化数据——讲清命名实体识别、关系抽取、事件抽取，并强调输出结构化 JSON 的写法。
difficulty: 中级
readingTime: 9 分钟
tags: [应用, 抽取, 结构化]
---

# 信息抽取

你有一堆客服对话，想自动知道「谁、在什么时候、投诉了什么问题」——这种**从自由文本里抠出整齐字段**的活，就叫**信息抽取（Information Extraction，IE）**。大模型最香的用处之一，就是把它变成结构化 JSON，直接进数据库。

::: tip 一句话定义
**信息抽取（Information Extraction，IE）** = 从非结构化文本中识别并提取出结构化信息（实体、关系、事件等）。
:::

## 为什么值得专门学

- **非结构化 → 结构化**：文本、对话、合同变 JSON，下游系统才能用。
- **零训练定制 schema**：想抽什么字段，改提示词即可，不用标数据训模型。
- **可组合多种子任务**：实体、关系、事件一次抽齐。

> 类比：抽取就像从一叠发票里把「日期 / 金额 / 商家」分别填进表格——模型当你的录单员。

## 三类常见抽取

| 类型 | 中文（English） | 抽什么 |
| --- | --- | --- |
| 实体识别 | 命名实体识别（NER） | 人名、地名、组织、时间、金额 |
| 关系抽取 | 关系抽取（Relation Extraction） | 实体间关系，如「A 任职于 B」 |
| 事件抽取 | 事件抽取（Event Extraction） | 谁在何时何地做了什么 |

进阶的结构化输出技巧（约束 JSON 字段、保证可解析）看 [结构化输出](/advanced/structured-output)。

## 怎么做

1. **定义 schema**：先想清楚要哪些字段、类型是什么（字符串 / 数组 / 枚举）。
2. **强制 JSON**：提示里写明「只返回合法 JSON，不要解释、不要 markdown 代码块包裹」。
3. **给缺省规则**：抽不到就填 `null`，别让模型瞎编。
4. **校验兜底**：代码侧用 JSON Schema 校验，解析失败再重试或兜底。

## 可复制示例（OpenAI 格式）

```js
// 需 API Key：https://platform.openai.com 获取，设为环境变量 OPENAI_API_KEY
// 模型：gpt-4o（OpenAI, 2024 年发布，结构化输出稳定）；可换成 claude-3-5-sonnet / deepseek-chat
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const text = '张三于 2024 年 3 月 15 日在北京投诉，说购买的手机充电故障。'

const completion = await client.chat.completions.create({
  model: 'gpt-4o',
  response_format: { type: 'json_object' }, // 强制 JSON 输出
  messages: [
    {
      role: 'system',
      content: '你是信息抽取器，严格按 schema 输出 JSON，缺失字段填 null，不编造。',
    },
    {
      role: 'user',
      content: `从文本中抽取以下字段，只返回 JSON：
{
  "person": "人名或 null",
  "date": "YYYY-MM-DD 或 null",
  "location": "地点或 null",
  "complaint": "投诉内容或 null",
  "product": "涉及产品或 null"
}

文本：${text}`,
    },
  ],
})

console.log(JSON.parse(completion.choices[0].message.content))
// 输出示例：
// { person: "张三", date: "2024-03-15", location: "北京",
//   complaint: "手机充电故障", product: "手机" }
```

**适用模型建议**：`gpt-4o` / `Claude 3.5 Sonnet` / `DeepSeek-V3`，需要可靠 JSON 时优先选支持 `response_format: json_object` 的模型。

::: warning 常见坑
- **没强制 JSON**：模型可能加一句「这是结果：」再给 JSON，下游解析直接炸。务必要求「只返回 JSON」。
- **抽不到就编**：必须写「缺失填 null」，否则模型会脑补合理值。
- **schema 太复杂**：字段嵌套太深易出错，先抽扁平结构，必要时二次抽取。
- **不做代码校验**：模型偶尔跑偏，代码侧 JSON Schema 校验 + 重试必不可少。
:::

## 速查清单 ✅

- [ ] 先定义清晰的 JSON schema
- [ ] 提示强制「只返回 JSON、缺失填 null」
- [ ] 优先用 `response_format: json_object`
- [ ] 代码侧加 JSON Schema 校验与重试
- [ ] NER / 关系 / 事件按需组合

## 记忆卡片 🃏

> **信息抽取** = 把自由文本变结构化 JSON。
> 先定 schema，强制 JSON 输出，缺失填 null，代码兜底校验。

## 小结

信息抽取是**把非结构化文本转成整齐 JSON** 的利器，覆盖实体、关系、事件三类。关键是先定 schema、强制 JSON 输出、缺失填 null，再在代码侧校验。下一篇讲**代码生成**：[/applications/code-generation](/applications/code-generation)。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
