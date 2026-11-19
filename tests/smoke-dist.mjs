// Runs the BUILT package (ESM and CJS) on the current Node with a fake fetch.
// CI uses it on the Node floor (18), where the dev toolchain (vitest, tsup) no longer runs.
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const fetch = async (url, init) => {
  assert.equal(init.headers.Authorization, 'Bearer k')
  assert.match(url, /^https:\/\/api\.test\/api\/getBalance\.php\?income=1&lang=en$/)
  return new Response('{"response":"1","balance":"10.500","zbalance":1}', { status: 200 })
}

const esm = await import('../dist/index.js')
const cjs = createRequire(import.meta.url)('../dist/index.cjs')
for (const [name, mod] of [['esm', esm], ['cjs', cjs]]) {
  assert.equal(mod.default, mod.OnlineSim, `${name}: default export`)
  const client = new mod.OnlineSim({ apiKey: 'k', baseUrl: 'https://api.test/api/', fetch })
  assert.deepEqual(await client.user.balance(), { balance: 10.5, zbalance: 1 })
  assert.equal(mod.parseWebhook('{"operation_id":"5"}').operation_id, 5)
  const mock = new mod.MockOnlineSim()
  const mocked = mock.client()
  const tzid = await mocked.numbers.get('google', 44)
  mock.addSmsAfter(tzid, 'code 12-34', 1)
  assert.equal(await mocked.numbers.waitCode(tzid, { interval: 0 }), '1234')
  console.log(`${name}: ok`)
}
