---
title: 问答（QA）
description: 用提示工程让大模型回答问题——讲清开放域问答和基于文档的闭域问答，以及「把资料塞进上下文再问」的 RAG 思路。
difficulty: 初级
readingTime: 8 分钟
tags: [应用, 问答, RAG]
---

# 问答（QA）

你问模型「光合作用是怎么回事」，它答得上来——这叫问答（Question Answering，QA）。但你问「我们公司年假规定是几天」，它就没谱了，因为它没看过你的员工手册。这篇就讲清楚：模型「自己知道的」和「你得喂给它的」怎么配合。

::: tip 一句话定义
**问答（Question Answering，QA）** = 给模型一个问题（必要时再给它资料），让它产出准确答案。
:::

## 为什么值得专门学

- **开放问题秒回**：常识、解释、计算类问题，模型比搜引擎快。
- **闭域问题靠喂料**：公司制度、私域文档这种「模型没学过」的内容，把资料塞进去它就能答——这就是 RAG 的思路。
- **可对话可批量**：既能聊天问，也能批量跑几千条问答对做评测。

> 类比：开放域问答像考「常识」；闭域问答像开卷考试——书（资料）得放桌上。

## 两种问答

| 类型 | 中文（English） | 资料从哪来 | 风险 |
| --- | --- | --- | --- |
| 开放域 | 开放域问答（Open-domain QA） | 模型自己的参数记忆 | 可能记错（幻觉） |
| 闭域 | 闭域问答（Closed-domain QA） | 你提供的文档/上下文 | 资料没覆盖就答不出 |

闭域问答的本质就是 **检索增强生成（RAG，Retrieval-Augmented Generation）** 的核心：先拿到相关资料，再让模型「只依据这些资料回答」。深入原理看 [RAG 进阶篇](/advanced/rag)。

## 怎么做

**开放域**：直接问，但加约束减少瞎编——「如果不确定，就明说不知道」。

**闭域（RAG 思路）**：
1. 把文档切段， relevant 段落作为上下文；
2. 提示里写「请只根据下面资料回答，资料没有就答『无法回答』」；
3. 把问题和资料一起发给模型。

> 关键约束是「只依据给定资料」——否则模型还是会用自己的记忆补窟窿，给出资料里根本没有的答案。

## 可复制示例（OpenAI 格式）

```js
// 需 API Key：https://platform.openai.com 获取，设为环境变量 OPENAI_API_KEY
// 模型：gpt-4o（OpenAI, 2024 年发布）；可换成 claude-3-5-sonnet / deepseek-chat
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const context = `公司《员工手册》第 12 条：正式员工带薪年假为 10 天/年，
入职满 3 年增至 15 天。病假需提供三甲医院证明。`

const question = '正式员工一年有多少天年假？'

const completion = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: '你是公司 HR 助手，只依据给定资料回答，资料未提及就如实说「无法回答」。',
    },
    {
      role: 'user',
      content: `资料：
"""
${context}
"""

问题：${question}

请只根据资料作答，并引用相关条款。`,
    },
  ],
})

console.log(completion.choices[0].message.content)
// 输出示例：正式员工带薪年假为 10 天/年（依据《员工手册》第 12 条）。
```

**适用模型建议**：`gpt-4o` / `Claude 3.5 Sonnet` / `DeepSeek-V3`，闭域问答对长上下文和指令遵循要求高，优先选强模型。

::: warning 常见坑
- **闭域却没限制「只依据资料」**：模型会用记忆乱补，给出资料里没有的答案。
- **资料太长被截断**：超长文档先检索出相关段落再喂，别整篇硬塞。
- **问题有歧义**：「这个怎么算」不如「年假按自然年还是入职年计算」——问题写具体。
- **开放域默认模型全知**：冷门/时效性强的问题，务必加「不确定就明说」。
:::

## 速查清单 ✅

- [ ] 分清开放域（靠记忆）和闭域（靠喂料）
- [ ] 闭域提示加「只依据资料、没有就答无法回答」
- [ ] 长文档先检索相关段落再问
- [ ] 开放域问题加「不确定就明说」
- [ ] 知道 RAG 是闭域问答的工程化形态

## 记忆卡片 🃏

> **问答 QA** = 给问题（必要时给资料），要准确答案。
> 开放域靠记忆、闭域靠喂料；闭域务必加「只依据资料」约束。

## 小结

问答分开放域（模型凭记忆答）和闭域（你把资料喂进去它再答），后者就是 RAG 的核心思路。闭域提示一定要加「只依据给定资料」的约束，否则模型容易用记忆补窟窿。下一篇讲**文本分类**：[/applications/classification](/applications/classification)。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
