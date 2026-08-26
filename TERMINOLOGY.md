# 术语与译名对照表

为保证全站术语统一、便于中文读者理解，本文档规定核心术语的译法规则。

## 核心规则

- **首现规则**：术语在全文首次出现时，使用「中文译名（English 原文）」的形式；后续出现只使用中文译名。
- 代码示例、API 名称、专有名词（如模型名 `GPT-4`）保留英文原文。

## 术语对照

| 英文原文 | 中文译名 | 备注 / 首现写法 |
| --- | --- | --- |
| prompt | 提示词 | 首次出现写作「提示词（prompt）」 |
| prompting | 提示 | 指「给出提示」这一动作 |
| prompt engineering | 提示工程 | 复合词，首次出现写作「提示工程（Prompt Engineering）」 |
| LLM | 大语言模型 | 首次出现写作「大语言模型（LLM）」，后续简称「大语言模型」 |
| Large Language Model | 大语言模型 | 同上 |
| Chain-of-Thought / CoT | 思维链 | 首次出现写作「思维链（Chain-of-Thought，CoT）」 |
| few-shot / few-shot prompting | 少样本提示 | 对照「零样本」使用 |
| zero-shot / zero-shot prompting | 零样本提示 | — |
| in-context learning | 上下文学习 | 首次出现写作「上下文学习（in-context learning）」 |
| instruction tuning | 指令微调 | — |
| RLHF | 基于人类反馈的强化学习 | 首次出现写作「基于人类反馈的强化学习（RLHF）」，后续可用缩写 |
| fine-tuning | 微调 | — |
| hallucination | 幻觉 | 指模型生成不实内容 |
| grounding | 事实 grounding / 事实对齐 | 建议写作「事实对齐」并加以解释 |
| agent / AI agent | 智能体 | 首次出现写作「智能体（agent）」 |
| tool use / function calling | 工具调用 / 函数调用 | — |
| retrieval-augmented generation / RAG | 检索增强生成 | 首次出现写作「检索增强生成（RAG）」 |
| embedding | 嵌入 / 向量表示 | 上下文决定，常用「嵌入」 |
| temperature | 温度 | 指采样温度超参数 |
| token | 词元 | 也可用「令牌」，全站统一用「词元」 |
| prompt injection | 提示注入 | 安全风险相关 |
| jailbreak | 越狱 | 指绕过安全限制 |
| self-consistency | 自洽性 | 进阶技巧 |
| automatic prompt engineering / APE | 自动提示工程 | 首次出现写作「自动提示工程（APE）」 |

## 译名约定补充

- 不把 `prompt` 翻译成「提示」或「命令」单独使用；统一用「提示词」以避免歧义。
- 图、表、代码块标题中的术语遵循同一首现规则。
- 外文专有名词（产品名、论文名）保持原文，可在括号中给出中文说明。
