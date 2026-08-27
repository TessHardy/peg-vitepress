---
title: 必读论文清单
description: 提示工程与大语言模型领域最值得读的 20 多篇论文，每篇一句话讲清它到底贡献了什么，附 arXiv 原文链接与阅读顺序建议。
difficulty: 中级
readingTime: 12 分钟
tags: [资源, 论文, 进阶]
---

# 必读论文清单

你大概已经会写提示词（prompt）了，但心里总有点不踏实：为什么「一步步思考」这四个字就能提准？为什么给几个例子模型就学会了？这些问题的答案，都躺在几篇论文里。

这一篇不做文献综述，只干一件事：**把真正值得你花时间的论文挑出来，每篇用一句话说清它贡献了什么**，你按需点开原文即可。

::: tip 一句话定义
**必读论文** = 那些「读完之后你会改变写提示词方式」的论文——它们要么发明了一个你天天在用的技巧，要么解释了一个你一直没想通的现象。
:::

## 为什么要读原文，而不是只看二手解读

二手解读省时间，但有两个通病：一是**结论被简化到失真**（比如把思维链说成「万能提准咒语」，原文其实明确说了小模型上无效）；二是**丢掉了适用边界**。论文里最值钱的往往不是主结论，而是「在什么条件下失效」的那几段消融实验。

> 二手解读告诉你「这招有用」，原文才告诉你「这招什么时候没用」。

对做工程的人来说，后者更重要——它直接决定你要不要在生产环境里用这一招。

## 怎么读：30 分钟速读法

论文不用逐字啃。按这个顺序扫，大部分论文 30 分钟能拿到八成信息：

| 步骤 | 看哪里 | 你要拿到什么 |
| --- | --- | --- |
| 1. 定位 | 摘要 + 图 1 | 它解决什么问题，方法长什么样 |
| 2. 抓方法 | Method 一节的提示词示例 | 提示词具体怎么写的，能不能直接抄 |
| 3. 看边界 | 实验表格 + Limitations | 在哪些模型/任务上有效，哪些无效 |
| 4. 复现 | 挑一个例子手动跑一遍 | 亲手验证，比读十遍都记得牢 |

**优先读带提示词原文的论文**。提示工程（Prompt Engineering）这个领域最实用的资产就是附录里那些真实提示词模板，抄下来改改就能用。

## 一、地基篇：先搞懂模型为什么能被「提示」

| 论文 | 年份 | 一句话贡献 |
| --- | --- | --- |
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 2017 | 提出 Transformer 架构，抛掉循环结构只靠注意力机制，是此后所有大模型的地基 |
| [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165)（GPT-3） | 2020 | 首次系统证明：不改一个权重，只在提示里塞几个例子，模型就能干新活——少样本提示与上下文学习（in-context learning）从此成立 |
| [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361) | 2020 | 模型规模、数据量、算力与效果之间存在可预测的幂律关系，「把模型做大」第一次有了理论依据 |
| [Training Compute-Optimal LLMs](https://arxiv.org/abs/2203.15556)（Chinchilla） | 2022 | 纠正了上一篇的偏差：光堆参数不够，训练数据量必须配套增长 |
| [Emergent Abilities of LLMs](https://arxiv.org/abs/2206.07682) | 2022 | 有些能力在小模型上完全测不出来，规模过线后突然「涌现」——这解释了为什么很多技巧只在大模型上灵 |

> 只读一篇的话，选 GPT-3 那篇。你现在用的少样本提示，源头就在这里。

## 二、提示技巧篇：你天天在用的招数出自哪

| 论文 | 年份 | 一句话贡献 |
| --- | --- | --- |
| [Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903)（Wei 等） | 2022 | 提出思维链（Chain-of-Thought，CoT）：给几个带完整推理步骤的范例，多步推理准确率大幅跳升 |
| [LLMs are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)（Kojima 等） | 2022 | 发现一句 "Let's think step by step" 就能触发推理，连范例都不用给——史上性价比最高的一行提示词 |
| [Self-Consistency](https://arxiv.org/abs/2203.11171) | 2022 | 提出自洽性（self-consistency）：让模型跑多条推理链，对答案投票取多数，比单条链更准 |
| [Least-to-Most Prompting](https://arxiv.org/abs/2205.10625) | 2022 | 先让模型把难题拆成子问题，再逐个解决，比一口气推理更擅长处理超出范例难度的题 |
| [Tree of Thoughts](https://arxiv.org/abs/2305.10601) | 2023 | 把线性推理链升级成树：允许探索多个分支、评估优劣、回溯剪枝，专治需要试错的规划题 |
| [Automatic Chain-of-Thought](https://arxiv.org/abs/2210.03493)（Auto-CoT） | 2022 | 让模型自己生成推理范例，省掉人工手写少样本示例的功夫 |
| [LLMs Are Human-Level Prompt Engineers](https://arxiv.org/abs/2211.01910)（APE） | 2022 | 自动提示工程（APE）的开山作：用模型自动生成并筛选提示词，效果能超过人类手写 |
| [Active-Prompt](https://arxiv.org/abs/2302.12246) | 2023 | 用「模型答得最不确定的题」来挑选该标注哪些范例，把人工标注花在最值钱的地方 |

## 三、智能体与工具篇：让模型动手做事

| 论文 | 年份 | 一句话贡献 |
| --- | --- | --- |
| [ReAct](https://arxiv.org/abs/2210.03629) | 2022 | 把「推理」和「行动」交替进行（想一步 → 调工具 → 看结果 → 再想），是几乎所有智能体（agent）框架的思想原型 |
| [PAL: Program-aided Language Models](https://arxiv.org/abs/2211.10435) | 2022 | 让模型别自己算数，改成生成代码交给解释器执行——数学题准确率立刻上台阶 |
| [Toolformer](https://arxiv.org/abs/2302.04761) | 2023 | 用自监督方式教模型「什么时候该调哪个 API」，工具调用从提示技巧变成模型能力 |
| [Reflexion](https://arxiv.org/abs/2303.11366) | 2023 | 让模型把失败原因写成文字反思、存进记忆，下一轮据此改进，实现「不改权重的自我进步」 |
| [Self-Refine](https://arxiv.org/abs/2303.17651) | 2023 | 同一个模型自己出稿、自己批评、自己改稿的循环，无需外部反馈就能提升输出质量 |

## 四、检索与知识篇：给模型接上外部资料

| 论文 | 年份 | 一句话贡献 |
| --- | --- | --- |
| [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)（Lewis 等） | 2020 | 提出检索增强生成（RAG）：先检索相关文档、再让模型基于文档作答，是治幻觉（hallucination）最主流的方案 |
| [Lost in the Middle](https://arxiv.org/abs/2307.03172) | 2023 | 实测发现模型对长上下文「头尾记得清、中间容易漏」，做 RAG 时把最关键的资料放两头 |

> 这两篇搭配读，你就懂了 RAG 系统里「召回准不准」和「摆放顺序对不对」是两件独立的事。

## 五、对齐与安全篇：模型为什么听话，以及怎么被骗

| 论文 | 年份 | 一句话贡献 |
| --- | --- | --- |
| [Deep RL from Human Preferences](https://arxiv.org/abs/1706.03741)（Christiano 等） | 2017 | 基于人类反馈的强化学习（RLHF）的技术源头：用人的偏好比较来训奖励模型 |
| [Learning to Summarize from Human Feedback](https://arxiv.org/abs/2009.01325) | 2020 | 首次把 RLHF 用在语言任务上并明显打赢监督微调（fine-tuning），铺平了通往 ChatGPT 的路 |
| [InstructGPT](https://arxiv.org/abs/2203.02155)（Ouyang 等） | 2022 | 指令微调 + RLHF 的完整配方；1.3B 的对齐模型在人类评价上打败 175B 的原始 GPT-3——「听话」比「更大」更重要 |
| [Constitutional AI](https://arxiv.org/abs/2212.08073) | 2022 | Anthropic 的路线：用一套书面原则让模型自我批评修正，大幅减少对人工标注有害样本的依赖 |
| [Ignore Previous Prompt](https://arxiv.org/abs/2211.09527) | 2022 | 系统性提出提示注入（prompt injection）攻击，指出「用户输入能覆盖系统指令」这个结构性缺陷 |
| [Universal and Transferable Adversarial Attacks](https://arxiv.org/abs/2307.15043) | 2023 | 用梯度自动搜出一串乱码后缀就能越狱（jailbreak），且能跨模型迁移，说明安全护栏远没那么牢 |
| [GPT-4 Technical Report](https://arxiv.org/abs/2303.08774) | 2023 | 不公开架构细节，但那份 System Card 的风险评估与红队方法论，是做 AI 产品安全的必读材料 |

## 六、综述与年度报告：想快速铺开视野就读这几篇

| 论文 | 年份 | 一句话贡献 |
| --- | --- | --- |
| [Pre-train, Prompt, and Predict](https://arxiv.org/abs/2107.13586)（Liu 等） | 2021 | 第一篇把提示范式讲透的综述，给出了统一的术语框架，历史脉络看它最清楚 |
| [The Prompt Report](https://arxiv.org/abs/2406.06608) | 2024 | 系统梳理 58 种以上文本提示技巧并统一命名，当作「技巧字典」查最方便 |
| [A Prompt Pattern Catalog](https://arxiv.org/abs/2302.11382) | 2023 | 用软件工程的「设计模式」思路给提示词分类，做产品化提示模板时很好用 |
| [Graph of Thoughts](https://arxiv.org/abs/2308.09687) | 2023 | 把思维树再推广成图，允许思路合并与复用，了解结构化推理的演进方向 |

## 顺手用的检索式

想追某个方向的最新进展，直接把下面这条丢进 [arXiv 检索](https://arxiv.org/list/cs.CL/recent) 或 Google Scholar：

```text
# arXiv 全文检索（按提交时间倒序看最新）
all:"prompt engineering" AND cat:cs.CL

# 追某篇论文的后续工作：在 Google Scholar 打开该论文 → 点「被引用次数」→ 勾选「按日期排序」
```

也可以让模型帮你做初筛，这个提示词模板挺好用：

```text
你是一名 NLP 方向的博士生。下面是一篇论文的摘要，请回答：
1. 它解决的核心问题是什么？（一句话）
2. 方法的关键改动是什么？（不超过 3 点）
3. 实验在哪些模型和任务上有效？在哪些情况下作者承认无效？
4. 如果我只做提示工程、不训练模型，这篇对我有什么可直接抄的做法？
若摘要信息不足以回答某项，请直接写「摘要未提及」，不要猜。

摘要：<把摘要粘在这里>
```

::: warning 常见坑
- **把结论当万能药**：思维链在小模型上几乎无效、对纯事实问答还会拖后腿，原文都写了，转述里常被吃掉。
- **只读摘要就下判断**：摘要只报好消息，真实边界藏在实验表格和 Limitations 里。
- **迷信榜单数字**：论文里的分数受提示模板、评测脚本、随机种子影响很大，换个写法就可能差好几个点。
- **只读新论文**：2020—2022 那批「老」论文奠定了整套词汇体系，跳过它们，后面的新论文你会读得云里雾里。
:::

## 速查清单 ✅

- [ ] 知道少样本提示与上下文学习出自 GPT-3 那篇
- [ ] 能说清思维链、自洽性、思维树三者的递进关系
- [ ] 知道 ReAct 是智能体框架的思想原型
- [ ] 知道 RAG 出自 Lewis 2020，且「资料摆放位置」会影响效果
- [ ] 知道 InstructGPT 证明了「对齐比堆参数更重要」
- [ ] 会用 30 分钟速读法：定位 → 抓方法 → 看边界 → 手动复现一例

## 记忆卡片 🃏

> **读论文的目的** = 拿到技巧的**适用边界**，不是背结论。
> 五条主线：地基（Transformer / GPT-3）→ 技巧（CoT / 自洽性 / 思维树）→ 行动（ReAct / PAL）→ 知识（RAG）→ 对齐与安全（InstructGPT / 提示注入）。
> 最实用的部分往往在附录：真实提示词模板，抄了就能用。

## 小结

这份清单的用法不是从头读到尾，而是**遇到问题时回来查**：推理不准就翻思维链和自洽性，模型胡说就翻 RAG 和 Lost in the Middle，要做智能体就翻 ReAct 和 Reflexion。读的时候记住一件事——你要找的是「这招什么时候没用」。

想动手把这些想法跑起来，接着看 [实用工具与框架](/resources/tools)；想知道论文里的分数怎么来的，看 [常用数据集与基准](/resources/datasets)；不知道从哪学起，看 [学习路径与课程](/resources/courses)。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
