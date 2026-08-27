---
title: 思维链（Chain-of-Thought, CoT）
description: 让模型"一步步思考"再给答案的技巧。讲清为什么分步推理能提准、怎么写、以及经典示例对照。
difficulty: 中级
readingTime: 8 分钟
tags: [进阶技巧, 推理, CoT]
---

# 思维链（Chain-of-Thought, CoT）

你有没有碰到过这种情况：问模型一道小学算术题，它"唰"地秒回一个答案，结果——是错的。不是它不会，而是它"跳步"了：直接凭直觉蹦答案，中间的逻辑全跳过了。

思维链（Chain-of-Thought，CoT）干的事特别简单：**让模型别急着给答案，先把它脑子里的推理步骤一步步写出来，最后再下结论。**

::: tip 一句话定义
**思维链（Chain-of-Thought，CoT）** = 在提示里引导大语言模型（LLM）把推理过程拆成若干中间步骤，逐步推导，再得出最终答案。
:::

## 为什么"一步步想"就更准

想象你自己算 `48 × 7 + 13`。如果有人逼你"立刻报数"，你很可能嘴瓢算错；但如果在纸上列竖式、一步步来，正确率立刻上去。模型也一样。

研究者（Wei 等，2022，Google）发现：对于数学、常识推理、符号逻辑这类**多步推理**任务，让模型把中间步骤写出来，准确率能大幅跳升。原因有两点：

- **把难问题拆小**：复杂任务一旦拆成小步，每步都变简单，累积出错的概率被压低。
- **推理可见、可纠错**：步骤摊开在明面上，你一眼就能看出它哪一步拐歪了，方便回头改提示。

> 一句话类比：CoT 就是让模型"把草稿纸亮给你看"，而不是直接甩个结果。

## CoT 怎么写

两条路子，按场景选：

### 路子一：Zero-shot CoT（零样本思维链）—— 最省事

你什么都不用教，只在提示末尾加一句魔法咒语：

> **"Let's think step by step."**（咱们一步步来思考。）

就这么一句，很多模型会主动把推理步骤列出来。这是 2022 年 Kojima 等人发现的"意外"技巧：连范例都不用给，光这句话就能触发推理。想要中文输出，也可以写：「请一步步思考，再给出答案。」

### 路子二：Few-shot CoT（少样本思维链）—— 更稳

你在提示里放 1~2 个**带完整推理过程**的范例，模型照着学，连思考的"格式"都模仿你。适合要严格控制输出结构的场景。比如给一个范例：先写"已知…、所以…、答案…"，模型就会照这个模板走。

## 推理流程长这样

```mermaid
flowchart LR
    Q[问题] --> S1[步骤1: 拆解已知条件]
    S1 --> S2[步骤2: 列出中间算式/逻辑]
    S2 --> S3[步骤3: 逐步推导]
    S3 --> S4[步骤4: 验算]
    S4 --> A[最终答案]
```

关键点：**箭头是串起来的**，前一步的输出是后一步的输入。模型一旦学会"走完这条链"，就不会再跳步。

## 可复制示例（OpenAI 格式）

下面用经典算术题演示。注意对比：同一个问题，直接问会答错，加 "Let's think step by step" 后就对了。

```js
// 需 API Key：https://platform.openai.com 获取，设为环境变量 OPENAI_API_KEY
// 模型：gpt-4o（OpenAI，2024 年发布）；可换成 deepseek-chat / qwen-plus
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ❌ 直接要答案：模型容易"跳步"算错
const badCompletion = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'user',
      content: '食堂里有 23 个苹果。如果用掉 20 个做午餐，又买来 6 个，现在有几个？只给数字。',
    },
  ],
})
// 可能错误输出：27（直接 23+6，忘了先减 20）

// ✅ 加一句"一步步思考"
const goodCompletion = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'user',
      content: `食堂里有 23 个苹果。如果用掉 20 个做午餐，又买来 6 个，现在有几个？
请一步步思考（Let's think step by step），最后用"答案：X"给出结果。`,
    },
  ],
})
console.log(goodCompletion.choices[0].message.content)
// 正确输出大致为：
// 一开始有 23 个苹果。
// 用掉 20 个做午餐，剩下 23 - 20 = 3 个。
// 又买来 6 个，现在有 3 + 6 = 9 个。
// 答案：9
```

::: warning 常见坑
- **用 CoT 答"事实类"问题反而啰嗦**：像"法国首都是哪"，直接答"巴黎"就好，硬让模型分步推理只会拖慢、还可能绕晕自己。CoT 主要吃**推理/计算/多步**任务。
- **温度（temperature）调太高会胡扯**：推理任务建议把温度设低（如 0~0.3），让输出更稳定。
- **以为"加一句就万能"**：Zero-shot CoT 不保证每次都触发，关键任务用 few-shot CoT 给范例更稳。
:::

## 进阶小贴士

除了手动写提示，还有两个方向值得知道。一是**自动思维链（Auto-CoT）**：先让模型自己生成一批推理范例，再拿去喂 few-shot，省去你手写范例的功夫。二是**推理模型已内建 CoT**：像 OpenAI o1/o3、DeepSeek-R1 这类"会自己琢磨"的模型，内部就已经跑很长一条推理链了，你往往不用显式写 "step by step" 也能拿到好处。但话说回来，在 gpt-4o、qwen、deepseek-chat 这类普通模型上，显式 CoT 依旧是性价比最高的"提准开关"——一句话成本，多步推理准确率却能上一个台阶。

## 速查清单 ✅

- [ ] 能说出 CoT 的核心：让模型展示中间推理步骤
- [ ] 知道零样本 CoT 的魔法句："Let's think step by step"
- [ ] 知道少样本 CoT 要拿"带推理的范例"喂
- [ ] 明白 CoT 最适合数学/逻辑/多步推理，不适合纯事实问答
- [ ] 推理任务把温度调低
- [ ] 知道进阶玩法：多条链投票（见[自洽性](/advanced/self-consistency)）

## 和其他技巧怎么搭配

CoT 是很多进阶技巧的"地基"。把它和[自洽性](/advanced/self-consistency)叠用，就是"多条链投票"；把它和[思维树](/advanced/tot)叠用，树的每条边都是一段思维链；现代推理模型（o1/o3、DeepSeek-R1）更是把 CoT 藏进了模型内部。所以你真正要掌握的，是先让模型"愿意一步步说"，其余玩法都是在这条链上做文章。

## 记忆卡片 🃏

> **思维链 CoT** = 让模型把推理拆成步骤，再给答案。
> 一句咒语："Let's think step by step"。
> 适用：数学、逻辑、多步推理；不适用：纯事实问答。

## 小结

思维链就是**逼模型"把草稿纸亮出来"**——不跳步、逐步推导，多步推理的准确率能明显提升。最省事的做法是加一句 "Let's think step by step"；要更稳就给带推理的范例。它特别适合数学、逻辑、推理类任务，相关应用可看[推理应用篇](/applications/reasoning)。下一篇讲怎么让 CoT 更可靠：[自洽性（Self-Consistency）](/advanced/self-consistency)。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
