---
title: Anthropic Claude
description: 讲清 Claude 的强项——编程能力、Artifacts 可交互产物、Computer Use 操作界面，以及它超长的上下文与代码实力。适合开发者重度使用。
difficulty: 中级
readingTime: 9 分钟
tags: [模型, Anthropic, Claude, 编程]
---

# Anthropic Claude

如果你主要用 AI 写代码、改 bug、读长文档，圈子里提到最多的名字多半是 **Claude**。它不像有些模型「啥都会一点」，而是在「严谨、听话、长文本、写代码」这几件事上特别顶。

这篇带你认识 Claude 的招牌能力，以及——到了 2026 年，它家已经迭代到哪一代了。

::: tip 一句话定义
**Anthropic Claude** 是一个以「代码能力强、指令遵循严、上下文长」著称的大语言模型（LLM）家族；招牌功能包括 **Artifacts（可交互产物）** 和 **Computer Use（计算机使用）**，擅长开发与企业知识工作。
:::

## 为什么开发者偏爱 Claude

很多人的真实体验是：让某模型写一段完整可运行的代码，它爱偷懒给片段；让 Claude 写，常常直接给出整文件，还顺手解释架构选择。

> Claude 像是「听话且靠谱的资深同事」：你定死的格式，它能整段对话都守住；你让它改代码，它不会顺手把你别的逻辑也改坏。

另外，Claude 的**长上下文**是早期卖点之一——早期 3.5 系列就有 20 万 token，后续版本进一步拉长，适合一次性塞进整份代码库或长合同。

## 两个招牌功能

### 1. Artifacts（可交互产物）
你让 Claude 画一个 HTML 小图表、做个能点按钮的网页 Demo，它会把成果放进一个独立面板，代码可预览、可改、可下载。对做原型、教学、可视化特别方便——等于 Claude 不只是「聊天」，还能「交付东西」。

### 2. Computer Use（计算机使用）
Claude 能像人一样「看屏幕、点鼠标、敲键盘」去操作软件界面：打开浏览器、填表单、点按钮。适合那些没有 API、只能靠界面交互的老系统自动化。它仍不完美、偶尔出错，但方向很关键。

## 2026 年的 Claude：已到 4 代

你在老教程里常见的是 **Claude 3.5 Sonnet / 3.7 Sonnet**（2024–2025 年的编程主力）。到了 2026 年，家族已升级到 **Claude 4**：

| 型号（2026） | 定位 | 上下文 | 价格档（约） |
| --- | --- | --- | --- |
| Claude Opus 4.7 | 旗舰，最强推理/编程/视觉 | 20 万+ token | 高（$5/$25 每百万） |
| Claude Sonnet 4.6 | 均衡主力，日常编码首选 | 100 万 token（测试） | 中（$3/$15 每百万） |
| Claude Haiku 4.5 | 快而便宜，高吞吐 | 20 万 token | 低 |

Claude 4 的 **扩展思考（extended thinking）** 相当于 OpenAI 的推理模式：开开关后，模型会先一步步想再答，数学/逻辑/调试更稳，但更慢更贵。编程上 Opus 4.7 在 SWE-bench 等基准上跳得很快，被很多开发者当作「编码默认模型」。

在真实开发里，Claude 的两类用法最常见：一是**长会话里改代码**——它有个口碑优势是「读得懂上下文再动手」，不会随手把无关的共享逻辑改坏，长文件重构比很多模型稳；二是**配合 Claude Code / Cursor 这类工具做智能体式编码**，让它自己读仓库、写代码、跑测试、看报错、再迭代。这也是为什么它常被当作「编码副驾」的首选。只不过，超长重构（比如上千行的文件）在接近结尾时仍可能丢上下文，关键改动还是要人 review。

> 顺带一提：Claude 不只走 Anthropic 官方 API，也能通过 **AWS Bedrock** 和 **Google Cloud Vertex AI** 调用——对已经在用这两朵云、要求数据留在本云内的企业很友好，不用把流量导到第三方。

给 Claude 写提示还有两个小提醒：一是它**指令遵循很严**，所以你定的格式约束（比如「只输出 JSON」「绝不用标题」）整段对话都守得住，这正好适合把 [零样本提示](/techniques/zero-shot) 的「角色 + 任务 + 格式」三件套写死；二是它的 **Constitutional AI** 训练让它偏「诚实拒答」而非陪聊附和，遇到高风险或它不确定的问题会直接说不清，这反而利于生产环境减少幻觉，你提示里可以鼓励它「不确定就明说」。

## 可复制示例

下面是 Claude 官方 SDK 的最简调用（注意它用 `messages`，和 OpenAI 结构类似但字段不同）：

```js
// 需 API Key：https://console.anthropic.com 获取，设为环境变量 ANTHROPIC_API_KEY
// 模型：claude-sonnet-4-6（Anthropic, 2026-02）；可换 claude-opus-4-7
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const msg = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: '用 Python 写一个函数，统计一段文本里每个单词出现的次数，返回排序后的前 5 个。',
    },
  ],
})
console.log(msg.content)
// 想开启推理：加 thinking: { type: 'enabled', budget_tokens: 4000 }（示意）
```

::: warning 常见坑
- **拿 Claude 3.5 当最新**：2026 已是 Claude 4 时代，老型号能力差距明显，新项目直接用 4 代。
- **忽略扩展思考的额外成本**：开 thinking 会多耗 token，实时对话慎用，离线批处理更合适。
- **以为 Computer Use 已完美**：它仍会点错、卡住，关键操作要有人兜底或加校验。
- **长上下文≠随便塞**：把一百万 token 代码库整坨丢进去问「找 bug」，检索准确率会下降，先按文件范围收敛更好。
- **混用 OpenAI 字段**：Claude 用 `max_tokens` 必填，`messages` 结构相似但参数名不同，别直接复制 GPT 代码。
:::

## 速查清单 ✅

- [ ] Claude 强在：编程、指令遵循、长上下文、企业知识工作
- [ ] Artifacts = 直接产出可交互产物（网页/Demo）
- [ ] Computer Use = 像人一样操作软件界面
- [ ] 2026 主力是 Claude 4（Opus 4.7 / Sonnet 4.6 / Haiku 4.5）
- [ ] 难任务开「扩展思考」，但注意更慢更贵
- [ ] 调用别照搬 OpenAI 字段，`max_tokens` 必填

## 记忆卡片 🃏

> **Claude** = 靠谱的资深同事：代码强、听话、上下文长。
> 招牌：Artifacts（交付物）、Computer Use（操作界面）。
> 2026 看 Claude 4；难任务开扩展思考，但更慢更贵。

## 小结

Claude 的核心标签是**编程强、指令严、上下文长**，招牌功能 Artifacts 能直接交付可交互产物、Computer Use 能操作真实界面。到了 2026 年主力已是 Claude 4 家族，配扩展思考模式应对硬核推理。如果你是开发者，它值得当作编码默认模型。继续看长上下文见长的 [Google Gemini](/models/gemini)，或想自己部署的 [Meta Llama](/models/llama)。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
