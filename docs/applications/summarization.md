---
title: 文本摘要
description: 用提示工程让大模型帮你把长文压成短文——讲清要点摘要、长文压缩、多文档摘要，以及「抽取式 vs 生成式」和「先提纲再缩写」两个核心技巧。
difficulty: 初级
readingTime: 8 分钟
tags: [应用, 摘要, 压缩]
---

# 文本摘要

你肯定遇到过：一篇 5000 字报告，老板只要「3 句话说清讲了啥」。这种「把长文压成短文」的活，就叫**文本摘要（Summarization）**——而大模型干这个又快又稳。

::: tip 一句话定义
**文本摘要（Summarization）** = 给模型一段或多段长文本，让它产出更短、但抓住核心信息的版本。
:::

## 为什么值得专门学

- **省时间**：人读 1 篇长文要 10 分钟，模型 10 秒出摘要。
- **可批量**：几百份文档也能一键提炼，人做不了。
- **新模型更会抓重点**：GPT-4o / Claude 3.5 / DeepSeek-V3 这类强模型，摘要质量已经很接近人工。

> 类比：摘要就像让助手先替你「读一遍并划重点」，你只看划出来的部分。

## 怎么做：两类摘要

摘要分两种思路，写提示前先想清楚你要哪种：

| 类型 | 中文（English） | 特点 | 适合 |
| --- | --- | --- | --- |
| 抽取式 | 抽取式（Extractive） | 直接从原文挑句子拼起来，不编造 | 要保真、不能出错（合同/论文） |
| 生成式 | 生成式（Abstractive） | 用自己的话重写、可概括合并 | 要通顺、要简短（周报/新闻） |

> 实际提示里，你通过指令控制：「只从原文摘句」→ 偏抽取式；「用你自己的话重写」→ 偏生成式。

## 核心技巧：先提纲再缩写

长文（比如万字以上）别一上来就要「总结」。分两步更稳：

1. **先出提纲**：让模型列出 5–8 个要点/小节标题；
2. **再缩写**：把提纲喂回去，让它基于提纲写成通顺短文。

这样能避免模型「开头很详细、后面直接跳过」的常见翻车。多文档摘要同理：先把每篇各摘一遍，再让模型「综合这几份摘要，去重合并」。

## 可复制示例（OpenAI 格式）

```js
// 需 API Key：https://platform.openai.com 获取，设为环境变量 OPENAI_API_KEY
// 模型：gpt-4o（OpenAI, 2024 年发布）；可换成 claude-3-5-sonnet / deepseek-chat / qwen-plus
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const longText = `（这里放你的长文，例如一篇产品复盘，5000 字以内效果最佳）`

const completion = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: '你是一名擅长抓重点的内容编辑，摘要必须忠于原文、不编造。',
    },
    {
      role: 'user',
      content: `请对下面这篇长文做生成式摘要，要求：
- 先列出 5 个核心要点（每条一句话）；
- 再基于要点写一段不超过 150 字的通顺总结；
- 不出现原文没有的事实。

长文：
"""
${longText}
"""`,
    },
  ],
})

console.log(completion.choices[0].message.content)
```

**适用模型建议**：`gpt-4o` / `Claude 3.5 Sonnet` / `DeepSeek-V3` / `Qwen2.5-72B`，长文场景优先选上下文长的模型。

::: warning 常见坑
- **不指定长度**：只说「总结一下」，模型可能给你照样长篇大论。务必写明「≤150 字 / 3 条要点」。
- **要保真却没说「不编造」**：生成式摘要可能改写出错，合同、论文类务必加「忠于原文、不得添加新信息」。
- **一次塞超长文**：超出上下文会截断。超长文档先切片或先提纲。
- **忽略受众**：给老板和给同事的摘要口径不同，提示里写清「面向谁」。
:::

## 速查清单 ✅

- [ ] 知道抽取式 vs 生成式的区别
- [ ] 长文会用「先提纲再缩写」两步法
- [ ] 摘要提示里写明长度与受众
- [ ] 保真场景加了「不编造」约束
- [ ] 多文档先各摘再合并去重

## 记忆卡片 🃏

> **文本摘要** = 把长文压成短文，抓住核心。
> 抽取式保真、生成式通顺；长文先提纲再缩写。
> 别忘了写清长度、受众、是否允许改写。

## 小结

文本摘要就是**让模型把长文压短、抓重点**，分抽取式和生成式两类。长文用「先提纲再缩写」最稳，多文档先各自摘再合并。下一篇讲怎么用模型**问答（QA）**：[/applications/qa](/applications/qa)。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
