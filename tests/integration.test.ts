/**
 * Opt-in integration test against a LOCAL backend. Skipped unless both are set:
 *   ONLINESIM_IT_BASE=https://on.test/api/  ONLINESIM_IT_KEY=<apikey>
 * With ONLINESIM_IT_MOCK=1 it also runs the number lifecycle on the provider-free `test` driver
 * (`spec/verify/backend_mock.php setup` first, a key of a user without webhook_url, teardown after).
 */
import { request } from 'node:https'
import { describe, expect, it } from 'vitest'
import { ApiError, NoNumberError, OnlineSim } from '../src'
import type { FetchLike } from '../src'

const BASE = process.env.ONLINESIM_IT_BASE
const KEY = process.env.ONLINESIM_IT_KEY
const MOCK = process.env.ONLINESIM_IT_MOCK === '1'
const enabled = Boolean(BASE && KEY)

if (enabled) {
  const host = new URL(BASE!).hostname
  if (!(host === 'localhost' || host === '127.0.0.1' || host.endsWith('.test') || host.endsWith('.localhost'))) {
    throw new Error(`refusing non-local integration host ${host}`)
  }
}

/** Test-only transport: local backends use a self-signed certificate. Not part of the SDK API. */
const insecureFetch: FetchLike = (input, init) =>
  new Promise((resolve, reject) => {
    const req = request(
      input,
      { method: init.method, headers: init.headers as Record<string, string>, rejectUnauthorized: false, signal: init.signal ?? undefined },
      (res) => {
        const chunks: Buffer[] = []
        res.on('data', (c: Buffer) => chunks.push(c))
        res.on('end', () => resolve(new Response(Buffer.concat(chunks), { status: res.statusCode ?? 0 })))
        res.on('error', reject)
      },
    )
    req.on('error', reject)
    if (typeof init.body === 'string') req.write(init.body)
    req.end()
  })

const client = new OnlineSim({ apiKey: KEY, baseUrl: BASE, fetch: insecureFetch })

describe.skipIf(!enabled)('integration: read-only', { timeout: 30_000 }, () => {
  it('user.balance', async () => {
    const b = await client.user.balance()
    expect(typeof b.balance).toBe('number')
    expect(typeof b.zbalance).toBe('number')
  })

  it('user.profile', async () => {
    expect((await client.user.profile()).id).toBeTypeOf('number')
  })

  it('numbers.tariffsOne(44)', async () => {
    const uk = await client.numbers.tariffsOne(44)
    expect(uk.code).toBe(44)
    expect(typeof uk.services).toBe('object')
  })

  it('numbers.state', async () => {
    expect(Array.isArray(await client.numbers.state())).toBe(true)
  })

  it('rent.tariffsOne(7)', async () => {
    expect((await client.rent.tariffsOne(7)).code).toBe(7)
  })

  it('rent.state', async () => {
    for (const r of await client.rent.state()) {
      expect(typeof r.sum).toBe('number')
      expect(Array.isArray(r.messages)).toBe(true)
      expect(Array.isArray(r.extend)).toBe(false)
    }
  })

  it('user.paymentHistory', async () => {
    const h = await client.user.paymentHistory()
    expect(Array.isArray(h.orders.data)).toBe(true)
    expect(Array.isArray(h.paylist)).toBe(false)
  })

  it('user.webhookLogs', async () => {
    expect(Array.isArray((await client.user.webhookLogs()).data)).toBe(true)
  })

  it('free.list', async () => {
    const f = await client.free.list()
    expect(Array.isArray(f.countries)).toBe(true)
    expect(Array.isArray(f.numbers)).toBe(false)
  })

  it('wrong key → ApiError ERROR_WRONG_KEY', async () => {
    const bad = new OnlineSim({ apiKey: 'wrong-key', baseUrl: BASE, fetch: insecureFetch })
    await expect(bad.user.balance()).rejects.toMatchObject({ code: 'ERROR_WRONG_KEY' })
  })
})

describe.skipIf(!enabled || !MOCK)('integration: number lifecycle (test driver)', { timeout: 60_000 }, () => {
  const COUNTRY = 44
  const SERVICE = 'google'

  /** Inject an SMS through the test driver callback (local backends only, no auth). */
  async function injectSms(tzid: number, text: string) {
    const res = await insecureFetch(new URL('sms_in_getaways/test', BASE).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: tzid, phoneFrom: 'VK', text }),
    })
    expect(res.status).toBe(200)
  }

  it('price → get → getWithNumber → state → SMS → waitCode → close', async () => {
    expect(await client.numbers.price(SERVICE, COUNTRY)).toBeTypeOf('number')

    const tzid = await client.numbers.get(SERVICE, COUNTRY)
    expect(tzid).toBeTypeOf('number')
    const order = await client.numbers.getWithNumber(SERVICE, COUNTRY)
    expect(order.number).toMatch(/^\+?44\d+$/)
    expect(order.country).toBe(COUNTRY)

    const ids = (await client.numbers.state()).map((op) => op.tzid)
    expect(ids).toEqual(expect.arrayContaining([tzid, order.tzid]))
    expect((await client.numbers.stateOne(tzid)).response).toMatch(/^TZ_/)

    // The test driver answers NO_NUMBER to any reject list: proves `reject` is sent.
    await expect(client.numbers.get(SERVICE, COUNTRY, { reject: ['4470'] })).rejects.toBeInstanceOf(NoNumberError)

    // No SMS yet: the guard interval keeps it open.
    await expect(client.numbers.close(order.tzid)).rejects.toMatchObject({ code: 'NO_COMPLETE_TZID' })

    await injectSms(tzid, 'VK: 195895 is your code')
    await expect(client.numbers.waitCode(tzid, { interval: 1_000, timeout: 30_000 })).resolves.toBe('195895')
  })

  it('setWebhookUrl → validation error → clearWebhookUrl', async () => {
    await expect(client.user.setWebhookUrl('https://example.com/hook')).resolves.toBe(true)
    expect((await client.user.profile()).webhook_url).toBe('https://example.com/hook')
    const error = await client.user.setWebhookUrl('not a url').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'VALIDATION_ERROR' })
    await expect(client.user.clearWebhookUrl()).resolves.toBe(true)
    expect((await client.user.profile()).webhook_url).toBeNull()
  })
})
