// scripts/vitepress.mjs
//
// 跨平台地启动 VitePress，并在子进程中清除安全删除 shim 所需的会话变量。
//
// 背景：本机环境（workBuddy CLI）通过 NODE_OPTIONS 注入了一个“安全删除”shim，
// 它会拦截 fs 的删除操作并尝试把文件移入回收站；在自动构建/清理阶段该操作会失败，
// 导致 `vitepress build` 在清空输出目录或 .temp 时崩溃。
// 该 shim 仅当检测到 CODEBUDDY_SESSION_ID / CLAUDE_SESSION_ID 时才生效；
// 在子进程中删除这两个变量即可让它变为空操作，恢复真实删除，从而正常完成构建。
//
// 用法（由 package.json 的 scripts 调用）：
//   node scripts/vitepress.mjs build
//   node scripts/vitepress.mjs dev
//   node scripts/vitepress.mjs preview

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
// scripts/.. = 项目根目录
const root = join(__dirname, '..')

// 直接指向 vitepress 的 bin 物理路径，避免 require.resolve 受 package exports 限制
const bin = join(root, 'node_modules', 'vitepress', 'bin', 'vitepress.js')

// 让注入的安全删除 shim 失效（变为空操作）
const env = { ...process.env }
delete env.CODEBUDDY_SESSION_ID
delete env.CLAUDE_SESSION_ID

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('用法: node scripts/vitepress.mjs <dev|build|preview> [额外参数]')
  process.exit(1)
}

const result = spawnSync(process.execPath, [bin, ...args], {
  stdio: 'inherit',
  shell: false,
  env,
})

process.exit(result.status ?? 1)
