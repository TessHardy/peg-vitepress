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
  // 显式指定构建产物目录为项目根下的 dist/（与部署工作流一致）
  outDir: 'dist',
  // 内容增量开发期：忽略尚未创建的文章页前向链接（如 few-shot / zero-shot 互链）。
  // T12 验证阶段将改用 linkinator 做真实死链检查，彼时会把本项收紧或关闭。
  ignoreDeadLinks: [
    './LICENSE',
    /^\/introduction\//,
    /^\/techniques\//,
    /^\/applications\//,
    /^\/models\//,
    /^\/agents\//,
    /^\/risks\//,
    /^\/optimization\//,
    /^\/resources\//,
  ],

  // 内置 KaTeX 数学公式支持（无需额外依赖包）
  markdown: {
    math: true,
  },

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
    docFooter: {
      prev: true,
      next: true,
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '入门', link: '/introduction/what-is' },
      { text: '基础技巧', link: '/techniques/zero-shot' },
    ],
    // TODO(T10): expand with all 9 content sections once the full content push lands
    sidebar: {
      '/introduction/': [
        {
          text: '入门',
          items: [{ text: '什么是提示工程', link: '/introduction/what-is' }],
        },
      ],
      '/techniques/': [
        {
          text: '基础技巧',
          items: [{ text: '零样本提示（Zero-Shot）', link: '/techniques/zero-shot' }],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/dair-ai/Prompt-Engineering-Guide',
      },
    ],
  },

  // 国际化结构：当前仅中文（root），预留英文（en）扩展位
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '提示工程指南（通俗中文版）',
      description:
        '一份面向中文读者的、通俗易懂的提示工程（Prompt Engineering）学习指南，改编自 dair-ai/Prompt-Engineering-Guide（MIT）。',
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
