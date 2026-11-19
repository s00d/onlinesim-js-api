// Smoke test of the PUBLISHED artifact: `npm pack` the built package, check the tarball holds only
// dist/ + README/LICENSE/CHANGELOG, install it into an empty project and run the README "Testing" example
// (offline, against MockOnlineSim) on the current Node, plus a CommonJS require. Needs `npm run build` first.
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
// Use the npm that ships with the Node running this script (CI runs it on the Node floor too).
const env = { ...process.env, PATH: `${dirname(process.execPath)}${delimiter}${process.env.PATH}` }
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })

const tmp = mkdtempSync(join(tmpdir(), 'onlinesim-smoke-'))
try {
  const [pack] = JSON.parse(run('npm', ['pack', '--json', '--pack-destination', tmp], root))
  const files = pack.files.map((f) => f.path).sort()
  const stray = files.filter((f) => !/^(dist\/.+|README\.md|LICENSE|CHANGELOG\.md|package\.json)$/.test(f))
  assert.deepEqual(stray, [], 'tarball holds only dist/, README, LICENSE, CHANGELOG, package.json')
  for (const f of ['dist/index.js', 'dist/index.cjs', 'dist/index.d.ts', 'dist/index.d.cts', 'README.md', 'LICENSE', 'CHANGELOG.md']) {
    assert.ok(files.includes(f), `tarball contains ${f}`)
  }
  console.log(`packed ${pack.filename}: ${files.length} files`)

  const app = join(tmp, 'app')
  mkdirSync(app)
  writeFileSync(join(app, 'package.json'), '{ "name": "smoke-app", "private": true, "type": "module" }\n')
  run('npm', ['install', join(tmp, pack.filename), '--no-audit', '--no-fund', '--no-package-lock'], app)

  const readme = readFileSync(join(app, 'node_modules/onlinesim-js-api/README.md'), 'utf8')
  const example = /^## Testing\n[\s\S]*?```ts\n([\s\S]*?)```/m.exec(readme)?.[1]
  assert.ok(example, 'README.md has a "## Testing" section with a ts example')
  writeFileSync(join(app, 'readme-testing.mjs'), example)
  run(process.execPath, ['readme-testing.mjs'], app)
  console.log('README "Testing" example (ESM): ok')

  writeFileSync(
    join(app, 'cjs.cjs'),
    `const assert = require('node:assert/strict')
const { MockOnlineSim, OnlineSim } = require('onlinesim-js-api')
assert.equal(require('onlinesim-js-api/package.json').version, ${JSON.stringify(pack.version)})
const client = new MockOnlineSim({ balance: 2 }).client()
assert.ok(client instanceof OnlineSim)
client.user.balance().then((b) => assert.deepEqual(b, { balance: 2, zbalance: 0, income: 0 }))
`,
  )
  run(process.execPath, ['cjs.cjs'], app)
  console.log(`CommonJS require: ok (node ${process.version})`)
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
