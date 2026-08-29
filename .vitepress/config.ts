import { withMermaid } from 'vitepress-plugin-mermaid'
import { pagefindPlugin, chineseSearchOptimize } from 'vitepress-plugin-pagefind'
import { createRequire } from 'node:module'

// vitepress-plugin-pagefind ships raw .vue SFCs that use imported TS types in
// <script setup> (e.g. defineProps<X>()). @vitejs/plugin-vue does not register
// a TypeScript loader for @vue/compiler-sfc, so compileScript fails with
// "No fs option provided ... required for resolving imported types".
// Registering a TS loader here lets compiler-sfc fall back to ts.sys for fs.
const _require = createRequire(import.meta.url)
function registerTsLoaderPlugin() {
  return {
    name: 'peg-register-ts-loader',
    configResolved() {
      try {
        const { registerTS } = _require('@vue/compiler-sfc')
        registerTS(() => _require('typescript'))
      } catch {
        /* no-op */
      }
    },
  }
}

// https://vitepress.dev/reference/site-config
export default withMermaid({
  lang: 'zh-CN',
  title: '提示工程指南（通俗中文版）',
  description:
    '一份面向中文读者的、通俗易懂的提示工程（Prompt Engineering）学习指南，改编自 dair-ai/Prompt-Engineering-Guide（MIT）。',
  lastUpdated: true,
  // 内容源目录；显式声明避免构建产物被嵌套到 /docs/ 子路径
  srcDir: 'docs',
  // GitHub Pages 项目页部署在子路径下，必须设置 base，否则 CSS/JS 资源 404
  // 若你的仓库名不是 peg-vitepress，请把这里改成 /<你的仓库名>/
  base: '/peg-vitepress/',
  // 显式指定构建产物目录为项目根下的 dist/（与部署工作流一致）
  outDir: 'dist',
  // 死链检查：9 大板块 44 篇文章已全部就位，内部链接（171 处）已逐一验证有效，
  // 不再放宽 ignoreDeadLinks——今后任何死链都会让构建直接失败，作为质量门禁。
  // 若后续临时需要放宽，请在此显式列出具体链接，而不是整段关闭。

  // 内置 KaTeX 数学公式支持（无需额外依赖包）
  markdown: {
    math: true,
  },

  // 生成 sitemap.xml
  // 注意：VitePress 1.x 生成 sitemap 时不会自动拼接 base，
  // 页面 URL 是相对 hostname 解析的，因此 hostname 必须带上子路径（含结尾斜杠）。
  sitemap: {
    hostname: 'https://tesshardy.github.io/peg-vitepress/',
  },

  // 站点级 SEO 元信息（各文章页的 description 来自各自 frontmatter）
  head: [
    ['meta', { property: 'og:site_name', content: '提示工程指南' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],

  // Pagefind 站内搜索（CJK 中文分词优化）
  vite: {
    plugins: [
      registerTsLoaderPlugin(),
      pagefindPlugin({
        btnPlaceholder: '搜索',
        placeholder: '搜索文档',
        emptyText: '没有找到相关结果',
        heading: '共 {{searchResult}} 条结果',
        customSearchQuery: chineseSearchOptimize,
      }),
    ],
  },

  themeConfig: {
    // 「上一篇 / 下一篇」等界面文案属于中文本地化内容，统一放在 locales.root.themeConfig
    nav: [
      { text: '首页', link: '/' },
      { text: '入门', link: '/introduction/what-is' },
      { text: '基础技巧', link: '/techniques/zero-shot' },
      { text: '进阶技巧', link: '/advanced/cot' },
      { text: '应用', link: '/applications/summarization' },
      { text: '模型', link: '/models/overview' },
      { text: '智能体', link: '/agents/what-is-agent' },
      { text: '风险', link: '/risks/adversarial' },
      { text: '资源', link: '/resources/papers' },
    ],
    sidebar: {
      '/introduction/': [
        {
          text: '入门',
          items: [
            { text: '什么是提示工程', link: '/introduction/what-is' },
            { text: '提示的组成部分', link: '/introduction/elements' },
            { text: '提示工程基础原则', link: '/introduction/basics' },
          ],
        },
      ],
      '/techniques/': [
        {
          text: '基础技巧',
          items: [
            { text: '零样本提示（Zero-Shot）', link: '/techniques/zero-shot' },
            { text: '少样本提示（Few-Shot）', link: '/techniques/few-shot' },
            { text: '指令式提示', link: '/techniques/instructions' },
            { text: '指定输出格式', link: '/techniques/format' },
          ],
        },
      ],
      '/advanced/': [
        {
          text: '进阶技巧',
          items: [
            { text: '思维链（CoT）', link: '/advanced/cot' },
            { text: '自洽性（Self-Consistency）', link: '/advanced/self-consistency' },
            { text: '思维树（ToT）', link: '/advanced/tot' },
            { text: 'ReAct（推理 + 行动）', link: '/advanced/react' },
            { text: '程序辅助语言模型（PAL）', link: '/advanced/pal' },
            { text: '自动提示工程（APE）', link: '/advanced/ape' },
            { text: '主动提示（Active Prompting）', link: '/advanced/active-prompt' },
            { text: '检索增强生成（RAG）', link: '/advanced/rag' },
            { text: '多模态提示', link: '/advanced/multimodal' },
            { text: '结构化输出（JSON / Function Calling）', link: '/advanced/structured-output' },
          ],
        },
      ],
      '/applications/': [
        {
          text: '应用',
          items: [
            { text: '文本摘要', link: '/applications/summarization' },
            { text: '问答（QA）', link: '/applications/qa' },
            { text: '文本分类', link: '/applications/classification' },
            { text: '信息抽取', link: '/applications/extraction' },
            { text: '代码生成', link: '/applications/code-generation' },
            { text: '推理', link: '/applications/reasoning' },
            { text: '数据生成', link: '/applications/data-generation' },
          ],
        },
      ],
      '/models/': [
        {
          text: '模型',
          items: [
            { text: '模型概览与选型', link: '/models/overview' },
            { text: 'OpenAI GPT 系列', link: '/models/gpt' },
            { text: 'Anthropic Claude', link: '/models/claude' },
            { text: 'Google Gemini', link: '/models/gemini' },
            { text: 'Meta Llama', link: '/models/llama' },
            { text: '国产模型', link: '/models/domestic' },
          ],
        },
      ],
      '/agents/': [
        {
          text: '智能体',
          items: [
            { text: '什么是智能体（Agent）', link: '/agents/what-is-agent' },
            { text: '智能体的核心组成', link: '/agents/components' },
            { text: '函数调用与工具调用', link: '/agents/function-calling' },
            { text: '上下文工程', link: '/agents/context-engineering' },
          ],
        },
      ],
      '/risks/': [
        {
          text: '风险与安全',
          items: [
            { text: '对抗攻击', link: '/risks/adversarial' },
            { text: '提示注入', link: '/risks/injection' },
            { text: '越狱（Jailbreak）', link: '/risks/jailbreak' },
            { text: '可靠性与事实性', link: '/risks/reliability' },
          ],
        },
      ],
      '/optimization/': [
        {
          text: '优化与评测',
          items: [
            { text: '提示优化方法', link: '/optimization/optimizing-prompts' },
            { text: '提示评测', link: '/optimization/evaluation' },
          ],
        },
      ],
      '/resources/': [
        {
          text: '资源',
          items: [
            { text: '必读论文清单', link: '/resources/papers' },
            { text: '实用工具与框架', link: '/resources/tools' },
            { text: '常用数据集与基准', link: '/resources/datasets' },
            { text: '学习路径与课程', link: '/resources/courses' },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/TessHardy/peg-vitepress',
      },
    ],
    editLink: {
      pattern: 'https://github.com/TessHardy/peg-vitepress/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
  },

  // 国际化结构：当前仅中文（root），预留英文（en）扩展位
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '提示工程指南（通俗中文版）',
      description:
        '一份面向中文读者的、通俗易懂的提示工程（Prompt Engineering）学习指南，改编自 dair-ai/Prompt-Engineering-Guide（MIT）。',
      // VitePress 默认主题不内置中文界面文案，这里逐项汉化
      themeConfig: {
        outline: { label: '本页目录' },
        lastUpdated: { text: '上次更新' },
        docFooter: { prev: '上一篇', next: '下一篇' },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '目录',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        langMenuLabel: '切换语言',
        skipToContentLabel: '跳转到内容',
        notFound: {
          code: '404',
          title: '页面不存在',
          quote: '你要找的页面不在这里……可能是链接打错了，或者页面还没写完。',
          linkLabel: '返回首页',
          linkText: '返回首页',
        },
      },
    },
    // en: {
    //   label: 'English',
    //   lang: 'en',
    //   title: 'Prompt Engineering Guide',
    //   description: 'A comprehensive guide to prompt engineering.',
    //   themeConfig: {
    //     nav: [{ text: 'Home', link: '/en/' }],
    //     sidebar: [],
    //   },
    // },
  },
})
