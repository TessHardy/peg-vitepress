---
title: 程序辅助语言模型（PAL）
description: 让模型生成代码来求解、交给解释器执行。讲清它为什么比"嘴算"更准、流程与可运行示例。
difficulty: 中级
readingTime: 8 分钟
tags: [进阶技巧, 推理, PAL, 代码]
---

# 程序辅助语言模型（PAL）

前面几种技巧，不管是[思维链](/advanced/cot)还是思维树，模型最终都是**用自然语言把推理写给你看**。可模型"嘴上算数"并不总靠谱——它推理链写得漂漂亮亮，最后一步加减法却能算错。

程序辅助语言模型（Program-Aided Language models，PAL）换了个思路：**别让模型自己算，让它把问题翻译成一段代码，然后交给真正的解释器（比如 Python）去跑。** 算得对不对，由机器兜底。

::: tip 一句话定义
**程序辅助语言模型（PAL）** = 让大语言模型（LLM）生成可执行代码（而非自然语言推理）来表达解法，再由外部解释器运行代码、得到准确结果。
:::

## 为什么"让代码算"更稳

模型做算术/符号运算，本质是"凭语感猜下一个词元（token）"，并不真在算。而 Python 的 `1+1` 永远等于 `2`。

PAL（Gao 等，2022，UC Berkeley 等）的核心洞察是：**把"推理"和"计算"拆开**——模型负责把问题理解成逻辑（写代码），执行交给确定性程序。这样一来：

- **计算零误差**：循环、大数、浮点都由解释器算，模型不再在最后一步翻车。
- **逻辑可复用**：生成的代码能直接跑、能测试、能嵌进你的系统。
- **可解释**：代码本身就是一份"可执行的解题说明"。

> 类比：思维链是让人在草稿纸上心算；PAL 是让模型写个公式，交给计算器算。

## 怎么做：三步

1. **提示模型"用代码思考"**：在提示里要求它输出可运行代码（常配合少样本范例，展示"问题→代码"的写法）。
2. **抽取并执行代码**：你的程序把模型产出的代码块抠出来，在沙箱里用 Python 运行。
3. **回填结果**：把运行输出拼回提示，让模型用自然语言总结成最终答案。

## 流程图

```mermaid
flowchart LR
    Q[自然语言问题] --> C[模型生成求解代码]
    C --> E[解释器执行代码]
    E --> R[运行结果]
    R --> A[模型总结成答案]
```

关键点：模型只"写代码"，**执行权在解释器手里**。

## 可复制示例（Python）

下面给一个**真实可运行**的片段：模型把数学题写成 Python，我们执行后回填。

```python
# 需 API Key：https://platform.openai.com 获取，设为环境变量 OPENAI_API_KEY
# 模型：gpt-4o（OpenAI，2024）；也可换 deepseek-chat / qwen-plus
# 运行依赖：pip install openai
import os, re, subprocess, tempfile
from openai import OpenAI
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

prompt = """把下面问题写成 Python 代码求解，只输出代码，不要解释。
问题：食堂有 23 个苹果，用掉 20 个做午餐，又买来 6 个，现在有几个？"""

resp = client.chat.completions.create(
    model='gpt-4o',
    messages=[{'role': 'user', 'content': prompt}],
)
code = resp.choices[0].message.content
code = re.sub(r'```python|```', '', code).strip()  # 去掉 markdown 代码围栏

print('模型生成的代码：\n', code)
# 模型输出示例：
# apples = 23
# apples -= 20
# apples += 6
# print(apples)

# 在沙箱子进程里执行，捕获 stdout（关键：绝不裸 exec）
with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False) as f:
    f.write(code + '\n')
exe = subprocess.run(['python', f.name], capture_output=True, text=True)
print('执行结果：', exe.stdout.strip())  # 输出：9
```

::: warning 常见坑
- **直接 exec 模型代码 = 裸奔**：模型可能生成删库、读敏感文件的代码。**务必在沙箱/子进程里跑，限制权限与网络**。
- **模型写出跑不通的代码**：语法错、变量未定义时有发生。要加"执行失败→把报错反馈给模型让它改"的回路。
- **不是所有问题都适合**：纯文字、创意、开放式任务，PAL 没用武之地；它专攻可程序化的计算/逻辑题。
- **别和思维链搞混**：思维链是"用自然语言推理"，PAL 是"用代码推理 + 机器执行"，两者可结合（代码里写注释当思路）。
:::

## 进阶小贴士

PAL 不是万金油，但它在对的题上极香。最合适的一类是**可程序化的计算/逻辑题**：应用题列式、单位换算、日期推算、带循环或条件判断的小逻辑、甚至数据清洗规则。这类题模型"嘴算"容易错，写成代码交给解释器就稳了。第二类是**要落地进系统的逻辑**：生成的代码能直接跑、能单测，比一段自然语言推理好维护。生态上，PandasAI、Excel 里的"用自然语言写公式"都属这个思路。最后提醒：PAL 和[思维链](/advanced/cot)不矛盾——在代码里写中文注释当思路，等于"代码版思维链"，既准又可解释。

## 速查清单 ✅

- [ ] 能说出 PAL = 模型写代码、解释器执行
- [ ] 知道它把"推理"和"计算"拆开，算数交给机器
- [ ] 明白代码必须在沙箱里跑，不能裸 exec
- [ ] 知道要加"执行失败→反馈模型修正"的回路
- [ ] 知道 PAL 适合可程序化的计算题，不适合开放创作

## 和其他技巧怎么搭配

PAL 最自然的搭档是思维链：让模型"用代码思考"，同时在代码里写中文注释当思路，等于把 CoT 和 PAL 合二为一——既准又可解释。如果你的题既要推理又要实时/精准计算，可以走"ReAct 调 PAL"的路线：模型用 Action 生成并执行代码（Observation 拿到运行结果），再决定下一步。这样模型负责"翻译问题"，解释器负责"算得准"，工具负责"取实时数据"，三方各司其职。

## 记忆卡片 🃏

> **PAL** = 让模型写代码，解释器来算。
> 模型只负责"翻译问题成逻辑"，执行权交给 Python。
> 铁律：代码必须沙箱执行，绝不裸跑。

## 小结

PAL 的思路很干脆：**模型别自己算，把问题写成代码，交给 Python 解释器跑。** 它把"推理"和"计算"拆开，绕开了模型"嘴算翻车"的老毛病，特别适合数学、符号、可程序化的题。代价是你要管好代码执行的安全（沙箱 + 失败回路）。它和[思维链](/advanced/cot)能互补：代码里写注释，就是"代码版思维链"。

---

> **来源与授权**：本文改编自 [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)（MIT License，Copyright 2022 DAIR.AI），并参考 [promptingguide.ai](https://www.promptingguide.ai) 与 [deepwiki.com.cn](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide) 的中文内容。仅供学习交流，保留原作者版权声明。
