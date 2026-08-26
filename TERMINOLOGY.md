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

## 文章统一结构规范（写作模板）

全站每篇文章都按以下顺序组织，保证一致、好懂、可扫读。各模块均已体现在样板篇 `docs/introduction/what-is.md` 与 `docs/techniques/zero-shot.md` 中。

1. **frontmatter**：`title` / `description` / `difficulty`（初级｜中级｜高级）/ `readingTime`（X 分钟）/ `tags`。
2. **大白话开场**：1–2 句，用「你」拉近距离，别一上来就下定义。
3. **一句定义**：放在 `::: tip` 提示框，用「一句话定义」标签。
4. **为什么**：讲清价值/动机，最好有个好懂的类比。
5. **怎么做**：要点化，必要时用表格或 `mermaid` 流程图。
6. **可复制示例**（技巧/应用类必带）：真实 `messages` 结构；代码块上方标注「需 API Key」，并在注释里写明**模型版本 + 年份**（如 `gpt-4o (2024)`）。
7. **常见坑**：放在 `::: warning` 提示框，点出最易踩的 2–4 个雷。
8. **速查清单**：`✅` 风格、4–6 条、可勾选感，让读者自检「我会了没」。
9. **记忆卡片**：`>` 引用块，一句话定义 + 2–3 条核心要点，方便记忆。
10. **小结**：2–3 句收尾，必要时指向下一篇。
11. **MIT 来源脚注**：每篇固定保留（见样板文末格式）。

### 示例写法规范
- 统一用 OpenAI `messages` 结构（`role: system / user / assistant`）。
- 模型名标注版本与年份；若示例为示意（非实跑），在注释写明「示意」。
- 示例要能真实运行或明确标注假设，禁止「伪代码」冒充可复制示例。
