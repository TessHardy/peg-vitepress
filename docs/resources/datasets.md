---
title: 常用数据集与基准
description: 提示工程和 LLM 评测里最常被引用的几个数据集与基准，每个讲清它到底在测什么、适合拿来验证你的哪类提示词，附 HuggingFace / arXiv 链接。
difficulty: 中级
readingTime: 9 分钟
tags: [资源, 数据集, 评测]
---

# 常用数据集与基准

你写完一条提示词，感觉「好像变好了」，但又说不出好在哪、好多少。这种「凭手感」最危险——换批数据可能立刻翻车。

这一篇帮你把「手感」换成「标尺」：**挑几个公认的数据集，每次改完提示词都在这上面跑一遍**，分数涨了才是真涨。

::: tip 一句话定义
**基准（benchmark）** = 一份固定不变的题目 + 标准答案，用来在相同条件下比较不同提示词（或不同模型）的表现。**数据集** 是这些题目的集合，基准通常还附带评测脚本和指标。
:::

## 为什么你需要关心基准

不跑基准，你只有两种状态：要么盲目自信（「我觉得不错」），要么盲目焦虑（「是不是该换模型了」）。

跑基准的好处很实在：

- **回归保护**：你加了一个花哨技巧，分数反而掉了，立刻知道别合进去。
- **横向对比**：同样一条提示词，在 GPT-4o 和 DeepSeek-V3 上各跑一遍，选型有依据。
- **沟通语言**：跟老板/同事说「这条提示在 GSM8K 上从 72% 提到 85%」，比「效果好多了」有说服力一百倍。

> 基准不是用来「刷分」的，是用来**在改提示词时给你一个不撒谎的反馈信号**。

## 怎么用：最小评测闭环

不用一上来就全跑。先定一个小闭环：

| 步骤 | 做什么 | 你要拿到什么 |
| --- | --- | --- |
| 1. 选一个贴近你业务的基准 | 做数学题就 GSM8K，做代码就 HumanEval | 题目和答案都现成 |
| 2. 抽 50~100 道当「冒烟测试集」 | 别每次都跑全量，太慢 | 一个能反复跑的小样本 |
| 3. 把你的提示词套上去跑 | 同一套调用代码，只换提示词 | 一个可比对的分数 |
| 4. 改提示词再跑，对比分数 | 每次只改一处 | 知道哪一处真的有用 |

想看怎么把「跑分」做成可量化流程，接着读 [提示评测](/optimization/evaluation)。

## 一、知识与推理类：测模型「懂不懂、会不会想」

| 数据集 | 测什么 | 一句话说明 | 链接 |
| --- | --- | --- | --- |
| [MMLU](https://arxiv.org/abs/2009.03300) | 多学科知识 | 57 个学科、上万个选择题，从初中到专家级，测「知识广度」最常用 | [HuggingFace](https://huggingface.co/datasets/cais/mmlu) |
| [GSM8K](https://arxiv.org/abs/2110.14168) | 小学应用题 | 小学数学文字题，需多步推理，测思维链（CoT）效果的标配 | [HuggingFace](https://huggingface.co/datasets/openai/gsm8k) |
| [ARC](https://arxiv.org/abs/1803.05457) | 科学推理 | 小学到初中科学选择题，分 Easy / Challenge 两档，测推理而非死记 | [HuggingFace](https://huggingface.co/datasets/allenai/ai2_arc) |
| [Big-Bench](https://arxiv.org/abs/2206.04615) | 综合能力 | 200+ 项任务的大杂烩，专门挑「当前模型还做不好」的难题，看能力上限 | [官网](https://benchmarks.llm.jp) |

## 二、代码与事实类：测「能不能落地、会不会胡编」

| 数据集 | 测什么 | 一句话说明 | 链接 |
| --- | --- | --- | --- |
| [HumanEval](https://arxiv.org/abs/2107.08473) | 代码生成 | 给函数签名和说明，让模型写实现并通过单元测试，测「代码真能跑」 | [HuggingFace](https://huggingface.co/datasets/openai_humaneval) |
| [TruthfulQA](https://arxiv.org/abs/2109.07958) | 事实性 | 专问那些模型容易「顺嘴编」的陷阱题，测幻觉和事实可靠性 | [HuggingFace](https://huggingface.co/datasets/truthful_qa) |
| [TriviaQA](https://arxiv.org/abs/1705.03551) | 阅读理解 | 真实问答对，测从长文本里抓事实的能力 | [HuggingFace](https://huggingface.co/datasets/mandarjoshi/trivia_qa) |
| [HellaSwag](https://arxiv.org/abs/1905.07830) | 常识推理 | 给前半句选最合理的后半句，测常识，题目故意做得「机器容易选错」 | [HuggingFace](https://huggingface.co/datasets/Rowan/hellaswag) |

## 三、对话与指令遵循类：测「听不听话、聊不聊得下去」

| 数据集 | 测什么 | 一句话说明 | 链接 |
| --- | --- | --- | --- |
| [MT-Bench](https://arxiv.org/abs/2306.05685) | 多轮对话 | 80 道两轮对话题，常用 **LLM 当裁判（LLM-as-judge）** 打分，测指令遵循和连贯性 | [GitHub](https://github.com/lm-sys/mt-bench) |
| [AlpacaEval](https://arxiv.org/abs/2404.04475) | 指令遵循 | 用「胜率」对比你的模型/提示和参考回答，自动化、跑得快 | [GitHub](https://github.com/tatsu-lab/alpaca_eval) |

## 一个小例子：用 GSM8K 验证思维链有没有用

假设你不确定「加不加 Let's think step by step」有区别，可以这样最小验证：

```text
# 1. 从 GSM8K 抽 100 题放进 questions.txt
# 2. 写两个版本的提示词：
#    版本A（直答）："请回答下面的数学题，只给最终数字答案：\n{题目}"
#    版本B（CoT）："请一步步思考再给答案：\n{题目}"
# 3. 同一个模型、同一个解码参数，各跑 100 题
# 4. 比对最终答案的准确率 —— 多数模型在版本B上明显更高
```

这不是伪代码，是真实可执行的评测骨架；把 `{题目}` 换成读文件、把模型调用换成你的 SDK 即可。

::: warning 常见坑
- **只跑全量、不跑小样本**：全量动辄上千题，每次改提示都跑一遍太慢，反馈周期长到没意义。先抽 50~100 题当冒烟集。
- **拿训练集当测试集**：很多模型在训练时就见过这些题（数据泄漏），分数虚高。报告时注明用的是哪一分片。
- **只看总分、不看分项**：MMLU 总分涨了，可能是某一学科涨了，另一学科其实掉了。按维度拆开看。
- **忽略随机性**：同一个提示跑两次分数可能差一两个点，多跑几次取平均再下结论。
:::

## 速查清单 ✅

- [ ] 知道 GSM8K 测数学推理、HumanEval 测代码、TruthfulQA 测事实性
- [ ] 会给自己的业务挑一个最贴近的基准
- [ ] 建了一个 50~100 题的小样本「冒烟测试集」反复跑
- [ ] 改提示词时只改一处、对比一处，而不是一次性全改
- [ ] 报告分数时注明数据集分片和模型版本
- [ ] 知道 MT-Bench 常用 LLM 当裁判来打对话质量

## 记忆卡片 🃏

> **基准** = 固定题目 + 标准答案，用来给提示词改动能不能真变好一个不撒谎的反馈。
> 分类记忆：知识推理（MMLU / GSM8K / ARC）→ 落地事实（HumanEval / TruthfulQA / TriviaQA）→ 对话指令（MT-Bench / AlpacaEval）。
> 关键是小闭环：抽一小批题，改一处跑一次，对比分数，别凭手感。

## 小结

数据集不是论文里的摆设，是你每次调提示词时的「刻度尺」。先从跟你业务最像的那个基准里抽 50 题，养成「改完就跑」的习惯，比背一打技巧都实在。想把这些分数变成可持续的评测流程，看 [提示评测](/optimization/evaluation)；想找更多题目来源，回 [必读论文清单](/resources/papers) 里那些带数据集链接的论文。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
