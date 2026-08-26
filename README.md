# 提示工程指南（通俗中文版）

一个**本地化、通俗易懂的中文提示工程（Prompt Engineering）学习站点**，基于 [VitePress](https://vitepress.dev/) 构建。

本项目旨在把原本偏机器翻译味的 [`promptingguide.ai/zh`](https://www.promptingguide.ai/zh) 与部分过时的中文资料（参考 [deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide)）重新组织、改写为自然流畅的中文，面向中文读者系统讲解提示工程。

> 本项目当前为**脚手架阶段**：仅包含站点框架与首页，正式教程内容（约 40+ 篇文章）将在后续任务中补充。

---

## 内容规划（9 大板块）

后续文章将按以下 9 个板块组织：

1. **入门** —— 什么是提示工程、基础概念、环境准备。
2. **基础技巧** —— 零样本 / 少样本提示、指令式提示、格式约束等。
3. **进阶技巧** —— 思维链（CoT）、自洽性、主动提示、自动推理等。
4. **应用** —— 文本摘要、问答、信息抽取、代码生成、对话等场景。
5. **模型** —— 主流大语言模型（LLM）的特性与调用方式。
6. **智能体** —— 工具调用、规划、记忆与多智能体协作。
7. **风险与安全** —— 提示注入、越狱、幻觉、对齐与安全实践。
8. **优化与评测** —— 提示优化方法（如 APE）、评测指标与基准。
9. **资源** —— 论文、工具、数据集、延伸阅读。

> 导航与侧边栏将在上述文章页面创建后（后续任务 T10）一并补全。当前 `config.ts` 中已预留 `// TODO(T10): expand` 标记。

---

## 目录结构

```
PEG-VitePress/
├── .vitepress/
│   ├── config.ts            # 站点配置（含 mermaid / pagefind 搜索 / 国际化结构）
│   └── theme/
│       ├── index.ts        # 主题入口
│       └── style.css       # 基础样式
├── docs/
│   └── index.md            # 首页
├── public/
│   └── img/                # 图片资源（由 scripts/sync-images.mjs 同步）
├── scripts/
│   └── sync-images.mjs     # 图片同步脚本
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages 部署工作流
├── LICENSE                 # MIT License（Copyright 2022 DAIR.AI）
├── README.md
├── TERMINOLOGY.md          # 术语与译名对照表
└── package.json
```

---

## 本地开发

```bash
npm install
npm run dev      # 启动本地开发服务器
npm run build    # 构建静态站点（含 pagefind 搜索索引）
npm run preview  # 预览构建产物
```

构建产物位于 `dist/`，其中 `/pagefind/` 为自动生成的搜索索引。

---

## 部署

`.github/workflows/deploy.yml` 已配置标准的 GitHub Pages 部署流程：在 `main` 分支推送时，自动安装依赖、执行 `vitepress build`，并将 `dist/` 部署到 GitHub Pages。

如需自托管，只需将 `dist/` 目录作为静态资源发布即可。

---

## 术语与译名

参见 [`TERMINOLOGY.md`](./TERMINOLOGY.md)，约定了 `prompt → 提示词`、`LLM → 大语言模型` 等统一译名规则。

---

## 来源与版权声明

- 本项目改编自 **[dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)**，遵循 **MIT License**（Copyright 2022 DAIR.AI）。
- 原始英文站点：[promptingguide.ai](https://www.promptingguide.ai)。
- 中文资料参考：[deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide)。
- 本项目仅供学习交流使用，所有文章页面将保留 MIT 来源声明（来源页脚）。

MIT 许可原文见 [`LICENSE`](./LICENSE)。
