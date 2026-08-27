---
title: 文本分类
description: 用提示工程让大模型给文本贴标签——情感分类、主题分类、打标签，并讲清零样本分类和少样本分类怎么选。
difficulty: 初级
readingTime: 8 分钟
tags: [应用, 分类, 标签]
---

# 文本分类

你有一堆用户评论，想快速知道哪些是好评、哪些是差评——这种「给一段文本归个类、贴个标签」的活，就叫**文本分类（Text Classification）**。大模型不用训练就能干，而且比传统模型省事太多。

::: tip 一句话定义
**文本分类（Text Classification）** = 给模型一段文本和一套类别，让它判断这段文本属于哪类（或贴哪些标签）。
:::

## 为什么值得专门学

- **不用训练**：传统方法要标数据、训模型；大模型零样本直接分。
- **类别随时改**：今天分「正负中性」，明天加「愤怒/焦虑」，改提示词就行。
- **多标签友好**：一条评论可以同时是「物流差 + 价格敏感」，模型能一次输出多个标签。

> 类比：分类就像让助手当分拣员，你定好筐（类别），它把每封信丢进对应筐里。

## 两种写法：零样本 vs 少样本

| 写法 | 中文（English） | 何时用 |
| --- | --- | --- |
| 零样本 | 零样本分类（Zero-Shot） | 类别清晰、模型懂概念（如情感正负） |
| 少样本 | 少样本分类（Few-Shot） | 类别模糊、要特定判定标准、格式严格 |

零样本写法见 [零样本提示](/techniques/zero-shot)，少样本写法见 [少样本提示](/techniques/few-shot)。**经验法则**：先试零样本，分不准再补 2–3 个范例。

## 怎么做

1. **列清类别**：把所有可能的类写全，避免模型自创类别。
2. **定输出格式**：要它只回「正面/负面/中性」还是回 JSON？明说。
3. **给判定标准**（难分情况时）：比如「含『还行』但无明确贬义 → 中性」。
4. **批量时降温度**：`temperature` 设低（如 0），结果更稳更一致。

## 可复制示例（OpenAI 格式）

```js
// 需 API Key：https://platform.openai.com 获取，设为环境变量 OPENAI_API_KEY
// 模型：gpt-4o-mini（OpenAI, 2024 年发布，分类任务性价比高）；可换成 deepseek-chat / qwen-plus
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const review = '物流挺快，但包装有点破，整体还行吧。'

const completion = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  temperature: 0, // 分类要稳定，温度调低
  messages: [
    {
      role: 'system',
      content: '你是电商评论分类器，只输出指定标签，不解释。',
    },
    {
      role: 'user',
      content: `请把评论分到以下标签（可多选）：
[物流差, 物流好, 包装差, 包装好, 价格敏感, 满意, 中性]

判定标准：
- 提到发货/收货快 → 物流好；破损/慢 → 物流差
- 提到包装破损 → 包装差
- 无明显褒贬 → 中性

只返回标签列表（逗号分隔）。

评论：${review}`,
    },
  ],
})

console.log(completion.choices[0].message.content)
// 输出示例：物流好, 包装差, 中性
```

**适用模型建议**：分类任务不挑模型，`gpt-4o-mini` / `DeepSeek-V3` / `Qwen2.5-72B` 都行；量大时用小模型更省成本。

::: warning 常见坑
- **类别列不全**：模型遇到没列出的类会自己编一个，结果不可控。
- **零样本分不准就硬试**：类别有歧义时，补 1–2 个范例（few-shot）立竿见影。
- **温度太高**：默认温度分类结果会飘，记得设 `temperature: 0`。
- **要 JSON 却没说格式**：想拿去程序里用，明确要「只返回 JSON 数组」。
:::

## 速查清单 ✅

- [ ] 会用零样本和少样本两种分类写法
- [ ] 分类提示里列全类别、定好输出格式
- [ ] 难分情况补 few-shot 范例
- [ ] 批量分类设 `temperature: 0`
- [ ] 程序消费时要求返回 JSON

## 记忆卡片 🃏

> **文本分类** = 给文本贴类别/标签，零训练。
> 先零样本，不准再 few-shot；类别列全、温度调低。

## 小结

文本分类是**给文本归类的零训练方案**，先试零样本、不准再上少样本。列全类别、定清格式、把温度调低，结果就稳。下一篇讲**信息抽取**：[/applications/extraction](/applications/extraction)。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
