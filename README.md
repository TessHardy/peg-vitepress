# 提示工程指南（通俗中文版）

一个**本地化、通俗易懂的中文提示工程（Prompt Engineering）学习站点**，基于 [VitePress](https://vitepress.dev/) 构建。

本项目旨在把原本偏机器翻译味的 [`promptingguide.ai/zh`](https://www.promptingguide.ai/zh) 与部分过时的中文资料（参考 [deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide)）重新组织、改写为自然流畅的中文，面向中文读者系统讲解提示工程。

当前已完成 **9 大板块 44 篇文章**，每篇均含「速查清单」与「记忆卡片」；站点内置 Pagefind 中文分词搜索、KaTeX 数学公式与 Mermaid 流程图。

---

## 内容结构（9 大板块）

1. **入门** —— 什么是提示工程、基础概念、环境准备。
2. **基础技巧** —— 零样本 / 少样本提示、指令式提示、格式约束等。
3. **进阶技巧** —— 思维链（CoT）、自洽性、主动提示、自动推理等。
4. **应用** —— 文本摘要、问答、信息抽取、代码生成、对话等场景。
5. **模型** —— 主流大语言模型（LLM）的特性与调用方式。
6. **智能体** —— 工具调用、规划、记忆与多智能体协作。
7. **风险与安全** —— 提示注入、越狱、幻觉、对齐与安全实践。
8. **优化与评测** —— 提示优化方法（如 APE）、评测指标与基准。
9. **资源** —— 论文、工具、数据集、延伸阅读。

---

## 目录结构

```
PEG-VitePress/
├── .vitepress/
│   ├── config.ts            # 站点配置（mermaid / pagefind 搜索 / 死链门禁 / SEO / 中文本地化）
│   └── theme/
│       ├── index.ts         # 主题入口（文章顶部「难度 / 阅读时间」徽标）
│       └── style.css        # 基础样式
├── docs/                    # 内容源目录（srcDir），9 大板块各一个子目录
│   ├── index.md             # 首页
│   ├── introduction/        # 入门（3 篇）
│   ├── techniques/          # 基础技巧（4 篇）
│   ├── advanced/            # 进阶技巧（10 篇）
│   ├── applications/        # 应用（7 篇）
│   ├── models/              # 模型（6 篇）
│   ├── agents/              # 智能体（4 篇）
│   ├── risks/               # 风险与安全（4 篇）
│   ├── optimization/        # 优化与评测（2 篇）
│   └── resources/           # 资源（4 篇）
├── scripts/
│   ├── vitepress.mjs        # 构建启动包装（隔离本地环境的 NODE_OPTIONS 注入）
│   └── sync-images.mjs      # 图片同步脚本（可选：仅当引用原仓库图片时使用）
├── .github/workflows/
│   └── deploy.yml           # GitHub Pages 部署工作流
├── LICENSE                  # MIT License（Copyright 2022 DAIR.AI）
├── README.md
├── TERMINOLOGY.md           # 术语与译名对照表
└── package.json
```

---

## 本地开发

```bash
npm install
npm run dev      # 启动本地开发服务器
npm run build    # 构建静态站点（含 pagefind 搜索索引与 sitemap.xml）
npm run preview  # 预览构建产物
```

构建产物位于 `dist/`，其中 `/pagefind/` 为自动生成的搜索索引。

> `npm run build` 会做**死链检查**：任何指向不存在页面的内部链接都会导致构建失败，以保证站点链接质量。

---

## 部署

`.github/workflows/deploy.yml` 已配置标准的 GitHub Pages 部署流程：在 `main` 分支推送时，自动安装依赖、执行 `vitepress build`，并将 `dist/` 部署到 GitHub Pages（项目页，base 为 `/peg-vitepress/`）。

如需自托管或换仓库名，只需将 `dist/` 目录作为静态资源发布，并把 `.vitepress/config.ts` 中的 `base` 改成对应子路径（根路径部署则设为 `'/'`）。

---

## 写作约定

- 新文章放在对应板块目录下，并在 `.vitepress/config.ts` 的 `sidebar` 中登记。
- 每篇文章 frontmatter 需包含 `title`、`description`、`difficulty`（初级/中级/高级）、`readingTime`、`tags`；主题会自动在文章顶部渲染「难度 / 阅读时间」徽标。
- 文末保留「速查清单 ✅」与「记忆卡片 🃏」两个小节，体例参见现有文章。
- 术语译名统一遵循 [`TERMINOLOGY.md`](./TERMINOLOGY.md)。

---

## 来源与版权声明

- 本项目改编自 **[dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)**，遵循 **MIT License**（Copyright 2022 DAIR.AI）。
- 原始英文站点：[promptingguide.ai](https://www.promptingguide.ai)。
- 中文资料参考：[deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide](https://deepwiki.com.cn/dair-ai/Prompt-Engineering-Guide)。
- 本项目仅供学习交流使用，所有文章页面保留 MIT 来源声明（来源页脚）。

MIT 许可原文见 [`LICENSE`](./LICENSE)。
