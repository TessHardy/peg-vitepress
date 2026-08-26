// scripts/sync-images.mjs
//
// 扫描 docs/**\/*.{md,mdx} 中的图片引用（![]() 与 <img src>），
// 将引用且真实存在于原始仓库图片目录中的图片，
// 复制到本项目的 public/img/ 下，并输出复制 / 缺失报告。
//
// 用法： node scripts/sync-images.mjs
//
// 说明：当前脚手架阶段还没有带图片的教程正文，脚本运行后可能报告
// “no references yet”，这是预期行为，不会抛错。

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 项目根目录（scripts/ 的上一级）
const PROJECT_ROOT = path.resolve(__dirname, '..')
// 原始仓库（Nextra）的图片根目录
const SRC_IMG_ROOT = path.resolve(
  PROJECT_ROOT,
  '..',
  'Prompt-Engineering-Guide',
  'img'
)
// 本项目的图片输出目录
const DEST_IMG_ROOT = path.resolve(PROJECT_ROOT, 'public', 'img')
// 待扫描的文档目录
const DOCS_ROOT = path.resolve(PROJECT_ROOT, 'docs')

// 匹配 Markdown 图片：![alt](src "title?")
const MD_IMG_RE = /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g
// 匹配 HTML 图片：<img ... src="..." ...>
const HTML_IMG_RE = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi

// 从一段 URL/路径中剥离查询串与锚点。
function stripQueryHash(p) {
  return p.split(/[?#]/)[0]
}

// 根据引用字符串，列举在原始图片目录中可能的候选源文件路径。
// 处理常见写法：../img/foo.png、/img/foo.png、img/foo.png、./foo.png。
function candidateSources(ref) {
  const cleaned = stripQueryHash(ref)
  const candidates = []

  // 1) 形如 .../img/<rest> 或 /img/<rest>：取 img/ 之后的相对部分
  const imgIdx = cleaned.lastIndexOf('/img/')
  if (imgIdx !== -1) {
    const rel = cleaned.slice(imgIdx + '/img/'.length)
    candidates.push(path.join(SRC_IMG_ROOT, rel))
  }

  // 2) 仅文件名：直接在 SRC_IMG_ROOT 下查找
  const base = path.basename(cleaned)
  if (base && base !== cleaned) {
    candidates.push(path.join(SRC_IMG_ROOT, base))
  } else if (base) {
    candidates.push(path.join(SRC_IMG_ROOT, base))
  }

  // 3) 其他相对写法：用相对于 docs 根的路径拼接
  if (!cleaned.startsWith('/') && !cleaned.startsWith('http')) {
    candidates.push(path.join(SRC_IMG_ROOT, cleaned.replace(/^\.?\//, '')))
  }

  // 去重
  return [...new Set(candidates)]
}

// 递归收集 docs 下的 .md / .mdx 文件。
function collectDocs(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...collectDocs(full))
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

function extractRefs(content) {
  const refs = []
  let m
  while ((m = MD_IMG_RE.exec(content)) !== null) refs.push(m[1])
  while ((m = HTML_IMG_RE.exec(content)) !== null) refs.push(m[1])
  return refs
}

function main() {
  console.log('== sync-images ==')
  console.log('src img root :', SRC_IMG_ROOT)
  console.log('dest img root:', DEST_IMG_ROOT)
  console.log('docs root    :', DOCS_ROOT)
  console.log('')

  if (!fs.existsSync(SRC_IMG_ROOT)) {
    console.warn('[warn] 原始仓库图片目录不存在，跳过复制：', SRC_IMG_ROOT)
  }

  const docs = collectDocs(DOCS_ROOT)
  if (docs.length === 0) {
    console.log('未找到任何 Markdown 文档，没有可处理的图片引用。')
    return
  }

  const copied = new Map() // dest -> src
  const missing = new Set()
  let totalRefs = 0

  for (const doc of docs) {
    const content = fs.readFileSync(doc, 'utf8')
    const refs = extractRefs(content)
    if (refs.length === 0) continue
    const docRel = path.relative(PROJECT_ROOT, doc)
    for (const ref of refs) {
      totalRefs++
      // 跳过外部链接
      if (/^(https?:)?\/\//i.test(ref)) {
        continue
      }
      const candidates = candidateSources(ref)
      const found = candidates.find((c) => fs.existsSync(c))
      if (found) {
        const rel = path.relative(SRC_IMG_ROOT, found)
        const dest = path.join(DEST_IMG_ROOT, rel)
        copied.set(dest, found)
      } else {
        missing.add(ref)
        console.log(`  [missing] ${docRel}: ${ref}`)
      }
    }
  }

  if (copied.size > 0) {
    fs.mkdirSync(DEST_IMG_ROOT, { recursive: true })
    for (const [dest, src] of copied) {
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(src, dest)
      console.log(
        `  [copied] ${path.relative(
          SRC_IMG_ROOT,
          src
        )} -> public/img/${path.relative(DEST_IMG_ROOT, dest)}`
      )
    }
  }

  console.log('')
  console.log('== 报告 ==')
  console.log(`扫描文档数     : ${docs.length}`)
  console.log(`图片引用总数   : ${totalRefs}`)
  console.log(`成功复制       : ${copied.size}`)
  console.log(`缺失(未找到源) : ${missing.size}`)
  if (totalRefs === 0) {
    console.log('（当前没有图片引用，符合脚手架阶段的预期）')
  }
}

main()
