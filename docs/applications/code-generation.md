---
title: 代码生成
description: 用提示工程让大模型写代码——补全、翻译、解释、写测试，并讲清「给上下文+约束+示例」与「先想后写」两个提质量的关键。
difficulty: 中级
readingTime: 9 分钟
tags: [应用, 代码, 编程]
---

# 代码生成

你想让模型「写个快速排序」或者「把这段 Python 翻成 Go」——这种**让大模型产出代码**的活，就是**代码生成（Code Generation）**。它现在强到能当结对编程搭子，但提示写不好，出来的代码就是能跑的「半成品」。

::: tip 一句话定义
**代码生成（Code Generation）** = 给模型需求（或现有代码），让它产出、补全、翻译或解释代码片段。
:::

## 为什么值得专门学

- **省去样板代码**：增删改查、解析、测试桩，秒出。
- **跨语言翻译**：Python ↔ Go ↔ TypeScript，模型转换又快又准。
- **解释与复盘**：贴一段看不懂的代码，让它讲人话。

> 类比：模型像实习生，你交代越清楚（上下文+约束+示例），它交活越像样。

## 四类常见任务

| 任务 | 中文（English） | 关键点 |
| --- | --- | --- |
| 补全 | 代码补全（Completion） | 给上下文，让它接龙 |
| 翻译 | 代码翻译（Translation） | 说明源/目标语言与版本 |
| 解释 | 代码解释（Explanation） | 让它用中文逐步讲 |
| 测试 | 测试生成（Test Generation） | 给函数签名，要覆盖边界 |

## 怎么写提示质量最高

**1. 给足上下文 + 约束 + 示例**（三件套）：
- 上下文：相关函数、依赖、框架版本；
- 约束：语言/版本、风格、不许用某库、要带注释；
- 示例：贴一段你项目里已有的同类代码让它模仿。

**2. 提示「先想后写」**：让模型先列思路/伪代码，再写正式代码——推理类模型（如 o 系列）尤其吃这套，能大幅减少逻辑 bug。

## 可复制示例（OpenAI 格式）

```js
// 需 API Key：https://platform.openai.com 获取，设为环境变量 OPENAI_API_KEY
// 模型：gpt-4o（OpenAI, 2024 年发布，代码能力强）；可换成 claude-3-5-sonnet / deepseek-coder
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const completion = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: '你是资深 TypeScript 工程师，代码要带类型、有注释、可运行。',
    },
    {
      role: 'user',
      content: `请为一个函数写单元测试，要求：
- 用 Vitest；
- 先简述测试思路，再给代码；
- 覆盖正常输入、空数组、超大数组三种情况。

函数：
\`\`\`ts
export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}
\`\`\``,
    },
  ],
})

console.log(completion.choices[0].message.content)
// 输出示例（节选）：
// 测试思路：1) 正常求和 2) 空数组返回 0 3) 大数组不溢出
// 代码：
// import { describe, it, expect } from 'vitest'
// import { sum } from './sum'
// describe('sum', () => {
//   it('正常求和', () => expect(sum([1,2,3])).toBe(6))
//   it('空数组返回 0', () => expect(sum([])).toBe(0))
//   it('大数组', () => expect(sum(new Array(10000).fill(1))).toBe(10000))
// })
```

**适用模型建议**：`gpt-4o` / `Claude 3.5 Sonnet` / `DeepSeek-Coder-V2`，代码场景优先选代码向模型；需要强推理的复杂算法可用 `o1` / `o3`。

::: warning 常见坑
- **没给上下文**：脱离项目的函数，模型不知道你的类型/依赖，写出来的跑不通。
- **不要求「先想后写」**：复杂逻辑直接写容易藏 bug，先让列思路更稳。
- **不指定语言/版本**：默认可能给你 Python3 而非你要的 Python2，或漏掉类型。
- **直接信任输出**：模型会编不存在的 API，务必跑一遍测试再合并。
:::

## 速查清单 ✅

- [ ] 代码提示带齐 上下文 + 约束 + 示例
- [ ] 复杂任务要求「先想后写」
- [ ] 指定语言、版本、框架
- [ ] 测试任务覆盖边界与异常
- [ ] 生成代码先跑测试再采用

## 记忆卡片 🃏

> **代码生成** = 给需求/代码，让模型产出、翻译、解释、测代码。
> 上下文+约束+示例三件套；复杂任务先想后写，输出必跑测试。

## 小结

代码生成靠**给足上下文、约束和示例**把质量拉满，复杂任务让模型「先想后写」能少踩逻辑坑。但生成代码务必跑测试再采用。下一篇讲**推理**：[/applications/reasoning](/applications/reasoning)。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
