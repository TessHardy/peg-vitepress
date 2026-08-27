// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { useData } from 'vitepress'
import './style.css'

// 在文档正文顶部注入「难度 / 阅读时间」徽标（取自每篇 frontmatter）
function Badge() {
  const { frontmatter } = useData()
  const d = frontmatter.value?.difficulty
  const t = frontmatter.value?.readingTime
  if (!d && !t) return null
  return h('div', { class: 'peg-badge' }, [
    d
      ? h('span', { class: `peg-badge-item peg-diff peg-diff-${levelClass(d)}` }, `难度 · ${d}`)
      : null,
    t ? h('span', { class: 'peg-badge-item peg-time' }, `阅读 · ${t}`) : null,
  ])
}

function levelClass(d: string): string {
  if (d.includes('初')) return 'easy'
  if (d.includes('高')) return 'hard'
  return 'mid'
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(Badge),
    })
  },
}
