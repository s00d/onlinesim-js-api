/**
 * Type-checks the code examples of README.md and docs/content/*.md against src/, so the docs cannot drift
 * from the API. A ```ts block counts as an example when it uses `client` or imports something; the other
 * ts blocks are signatures. Undeclared `client` / `tzid` get an ambient declaration.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { expect, it } from 'vitest'

const root = fileURLToPath(new URL('..', import.meta.url))
const sources = ['README.md', ...readdirSync(`${root}docs/content`).map((f) => `docs/content/${f}`)].filter((f) => f.endsWith('.md'))

function examples(): Map<string, string> {
  const files = new Map<string, string>()
  for (const source of sources) {
    const md = readFileSync(root + source, 'utf8')
    let i = 0
    for (const [, code] of md.matchAll(/```ts[^\n]*\n([\s\S]*?)```/g)) {
      if (!code || !/\bclient\b|^import /m.test(code)) continue
      const prelude = [
        "import type { OnlineSim as DocsClient } from 'onlinesim-js-api'",
        /\b(const|let)\s+client\b/.test(code) ? '' : 'declare const client: DocsClient',
        /\b(const|let)\s+(\{[^}]*\btzid\b[^}]*\}|tzid\b)/.test(code) ? '' : 'declare const tzid: number',
      ]
      files.set(`${root}.docs-examples/${source.replace(/\W/g, '_')}_${i++}.ts`, `${prelude.join('\n')}\n${code}\nexport {}\n`)
    }
  }
  return files
}

it('docs examples type-check against the SDK', () => {
  const files = examples()
  expect(files.size).toBeGreaterThan(20)

  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
    types: ['node'],
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    paths: { 'onlinesim-js-api': [`${root}src/index.ts`] },
  }
  const host = ts.createCompilerHost(options)
  const { fileExists, readFile, getSourceFile } = host
  host.fileExists = (f) => files.has(f) || fileExists(f)
  host.readFile = (f) => files.get(f) ?? readFile(f)
  host.getSourceFile = (f, lang, ...rest) => {
    const text = files.get(f)
    return text === undefined ? getSourceFile(f, lang, ...rest) : ts.createSourceFile(f, text, lang)
  }

  const program = ts.createProgram([...files.keys()], options, host)
  const errors = ts.getPreEmitDiagnostics(program).map((d) => {
    const where = d.file ? `${d.file.fileName.slice(root.length)}:${d.file.getLineAndCharacterOfPosition(d.start ?? 0).line + 1}` : ''
    return `${where} ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}${d.file && files.has(d.file.fileName) ? `\n${d.file.text}` : ''}`
  })
  expect(errors).toEqual([])
})
