/** MockOnlineSim through the real client: every endpoint, every control helper. */
import { describe, expect, it } from 'vitest'
import { ApiError, MockOnlineSim, NoNumberError, OnlineSim, TransportError } from '../src'

const noSleep = { interval: 0, sleep: async () => {} }

async function rejects(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    () => {
      throw new Error('expected a rejection')
    },
    (e: unknown) => e,
  )
}

describe('MockOnlineSim: auth and transport', () => {
  it('wrong or missing key answers HTTP 456 ERROR_WRONG_KEY, which the client maps to ApiError', async () => {
    const mock = new MockOnlineSim()
    for (const apiKey of ['nope', '']) {
      const error = await rejects(mock.client({ apiKey }).user.balance())
      expect(error).toBeInstanceOf(ApiError)
      expect(error).toMatchObject({ code: 'ERROR_WRONG_KEY' })
    }
  })

  it('tariffs and free numbers need no key', async () => {
    const client = new MockOnlineSim().client({ apiKey: '' })
    await expect(client.numbers.tariffsOne(44)).resolves.toMatchObject({ code: 44 })
    await expect(client.rent.tariffsOne(7)).resolves.toMatchObject({ code: 7 })
    await expect(client.free.list()).resolves.toMatchObject({ messages: { country: 44 } })
  })

  it('works as the transport of a client built by hand, with any base URL', async () => {
    const mock = new MockOnlineSim({ apiKey: 'k', balance: 5 })
    const client = new OnlineSim({ apiKey: 'k', fetch: mock.transport })
    await expect(client.user.balance()).resolves.toEqual({ balance: 5, zbalance: 0, income: 0 })
    expect(mock.requests).toEqual([{ method: 'GET', path: 'getBalance.php', query: { income: '1', lang: 'en' }, body: undefined }])
  })

  it('an unknown endpoint is a non-JSON 404', async () => {
    const mock = new MockOnlineSim()
    const res = await mock.transport('https://x.test/api/nope.php', {})
    expect(res.status).toBe(404)
  })
})

describe('MockOnlineSim: numbers', () => {
  it('price: number, null for an unknown service, UNDEFINED_COUNTRY for an unknown country', async () => {
    const client = new MockOnlineSim().client()
    await expect(client.numbers.price('telegram', 7)).resolves.toBe(1.2)
    await expect(client.numbers.price('nope', 7)).resolves.toBeNull()
    await expect(client.numbers.price('google', 999)).rejects.toMatchObject({ code: 'UNDEFINED_COUNTRY' })
  })

  it('get freezes the price; numbers are deterministic; getWithNumber returns the order', async () => {
    const mock = new MockOnlineSim()
    const client = mock.client()
    await expect(client.numbers.get('google', 44)).resolves.toBe(1)
    await expect(client.numbers.getWithNumber('vkcom')).resolves.toEqual({
      tzid: 2,
      number: '+7900000002',
      country: 7,
      time: 1200,
      service: 'vkcom',
    })
    expect(mock.requests.map((r) => r.query.number)).toEqual([undefined, '1'])
    await expect(client.user.balance()).resolves.toEqual({ balance: 100, zbalance: 0.7, income: 0 })
    expect(mock.operations().map((o) => [o.tzid, o.number, o.status])).toEqual([
      [1, '+44900000001', 'TZ_NUM_WAIT'],
      [2, '+7900000002', 'TZ_NUM_WAIT'],
    ])
  })

  it('get errors: unknown country/service, low balance, reject', async () => {
    const mock = new MockOnlineSim({ balance: 0.25 })
    const client = mock.client()
    await expect(client.numbers.get('google', 999)).rejects.toMatchObject({ code: 'UNDEFINED_COUNTRY' })
    await expect(client.numbers.get('nope', 7)).rejects.toMatchObject({ code: 'ERROR_NO_SERVICE' })
    await expect(client.numbers.get('google', 7)).rejects.toMatchObject({ code: 'WARNING_LOW_BALANCE' })
    const error = await rejects(client.numbers.get('google', 44, { reject: ['4490', '7'] }))
    expect(error).toBeInstanceOf(NoNumberError)
    expect(mock.requests.at(-1)?.query.reject).toBe('4490,7')
    // a non-matching reject passes; the rejected attempt did not consume a number
    await expect(client.numbers.getWithNumber('google', 44, { reject: ['4480'] })).resolves.toMatchObject({ number: '+44900000001' })
    // 0.25 - 0.2 frozen = 0.05 available
    await expect(client.numbers.get('google', 44)).rejects.toMatchObject({ code: 'WARNING_LOW_BALANCE' })
  })

  it('state: [] without operations, list/one, TZ_NUM_WAIT → TZ_NUM_ANSWER → TZ_OVER_OK', async () => {
    const mock = new MockOnlineSim()
    const client = mock.client()
    await expect(client.numbers.state()).resolves.toEqual([])
    const a = await client.numbers.get('google', 44)
    const b = await client.numbers.get('vkcom', 7)
    const one = await client.numbers.stateOne(a)
    expect(one).toMatchObject({ tzid: a, response: 'TZ_NUM_WAIT', number: '+44900000001', sum: 0.2, guard_interval_remaining_seconds: 0 })
    expect(one).not.toHaveProperty('msg')

    mock.addSms(a, 'Your Google code is G-123 456. Do not share it.')
    expect(await client.numbers.stateOne(a)).toMatchObject({ response: 'TZ_NUM_ANSWER', msg: '123456' })
    expect(await client.numbers.stateOne(a, { messageToCode: false })).toMatchObject({ msg: 'Your Google code is G-123 456. Do not share it.' })
    expect((await client.numbers.state({ orderBy: 'desc' })).map((o) => o.tzid)).toEqual([b, a])

    await client.numbers.close(a)
    expect(await client.numbers.stateOne(a)).toMatchObject({ response: 'TZ_OVER_OK', time: 0 })
    await expect(client.numbers.stateOne(999)).rejects.toMatchObject({ code: 'ERROR_NO_OPERATIONS' })
  })

  it('a text without a code gives the full text; next switches to the following SMS; msgList lists all', async () => {
    const mock = new MockOnlineSim()
    const client = mock.client()
    const tzid = await client.numbers.get('telegram')
    mock.addSms(tzid, 'Welcome!', { service: 'telegram' })
    expect((await client.numbers.stateOne(tzid)).msg).toBe('Welcome!')
    await client.numbers.next(tzid)
    expect(await client.numbers.stateOne(tzid)).toMatchObject({ response: 'TZ_NUM_WAIT' })
    expect(await client.numbers.stateOne(tzid)).not.toHaveProperty('msg')
    mock.addSms(tzid, 'code 98765')
    expect((await client.numbers.stateOne(tzid)).msg).toBe('98765')
    expect((await client.numbers.stateOne(tzid, { msgList: true })).msg).toEqual([
      { service: 'telegram', msg: 'Welcome!' },
      { service: 'telegram', msg: '98765' },
    ])
    await expect(client.numbers.next(424242)).resolves.toBe(true) // always succeeds, like the backend
  })

  it('close after an SMS spends the price, without one refunds it; ban after an SMS answers "0"', async () => {
    const mock = new MockOnlineSim({ balance: 10 })
    const client = mock.client()
    const paid = await client.numbers.get('telegram')
    const empty = await client.numbers.get('telegram')
    mock.addSms(paid, '1111')
    await expect(client.numbers.ban(paid)).rejects.toMatchObject({ code: '0' })
    await client.numbers.close(paid)
    await client.numbers.close(empty)
    await expect(client.user.balance()).resolves.toMatchObject({ balance: 8.8, zbalance: 0 })
    expect(mock.balance()).toBe(8.8)
    await expect(client.numbers.close(paid)).rejects.toMatchObject({ code: 'ERROR_WRONG_TZID' })
    await expect(client.numbers.close(999)).rejects.toMatchObject({ code: 'ERROR_WRONG_TZID' })
    const banned = await client.numbers.get('google')
    await expect(client.numbers.ban(banned)).resolves.toBe(true)
    expect(mock.operations().find((o) => o.tzid === banned)?.status).toBe('TZ_OVER_OK')
  })

  it('guardInterval: an operation without SMS cannot be closed', async () => {
    const mock = new MockOnlineSim({ guardInterval: 120 })
    const client = mock.client()
    const tzid = await client.numbers.get('google')
    expect(await client.numbers.stateOne(tzid)).toMatchObject({ guard_interval_remaining_seconds: 120 })
    await expect(client.numbers.close(tzid)).rejects.toMatchObject({ code: 'NO_COMPLETE_TZID' })
    mock.addSms(tzid, '5555')
    expect(await client.numbers.stateOne(tzid)).toMatchObject({ guard_interval_remaining_seconds: 0 })
    await expect(client.numbers.close(tzid)).resolves.toBe(true)
  })

  it('waitCode with addSmsAfter and a zero interval: no clock, no real waiting', async () => {
    const mock = new MockOnlineSim()
    const client = mock.client()
    const tzid = await client.numbers.get('google', 44)
    mock.addSmsAfter(tzid, 'Your code: 4321', 2)
    await expect(client.numbers.waitCode(tzid, { interval: 0 })).resolves.toBe('4321')
    expect(mock.requests.map((r) => r.path)).toEqual(['getNum.php', 'getState.php', 'getState.php', 'getState.php', 'setOperationOk.php'])
    expect(mock.operations()[0]?.status).toBe('TZ_OVER_OK')
  })

  it('waitCode keepOpen + since waits for the next SMS; polls listing all operations count too', async () => {
    const mock = new MockOnlineSim()
    const client = mock.client()
    const tzid = await client.numbers.get('google', 44)
    mock.addSmsAfter(tzid, '1111', 0)
    const first = await client.numbers.waitCode(tzid, { ...noSleep, keepOpen: true })
    mock.addSmsAfter(tzid, '2222', 1)
    await client.numbers.state() // one poll of every operation
    await expect(client.numbers.waitCode(tzid, { ...noSleep, since: first })).resolves.toBe('2222')
  })

  it('tariffs from the prices: service_<slug> keys, count 100; NO_COUNTRY for an unknown one', async () => {
    const client = new MockOnlineSim().client()
    const all = await client.numbers.tariffs()
    expect(Object.keys(all)).toEqual(['7', '44'])
    expect(all['44']?.services.service_vkcom).toEqual({ count: 100, popular: false, code: 44, price: 0.36, id: 2, service: 'vkcom', slug: 'vkcom' })
    await expect(client.numbers.tariffsOne(1)).rejects.toMatchObject({ code: 'NO_COUNTRY' })
    const empty = new MockOnlineSim({ prices: { 1: {} } }).client()
    await expect(empty.numbers.tariffsOne(1)).resolves.toMatchObject({ services: {} }) // `[]` on the wire
  })
})

describe('MockOnlineSim: rent', () => {
  it('get charges, state lists, extend, close; extend refused for non-extendable rents', async () => {
    const mock = new MockOnlineSim({ balance: 10 })
    const client = mock.client()
    const rent = await client.rent.get(7, 3)
    expect(rent).toMatchObject({ tzid: 1, number: '900000001', sum: 2.5, days: 3, time: 3 * 1440, time_seconds: 3 * 86400, extension: 1, messages: [] })
    expect(rent.extend).toEqual({ 1: 1, 3: 2.5, 7: 5 })
    expect(mock.balance()).toBe(7.5)

    mock.addSms(rent.tzid, 'Bank: 777 888', { service: 'bank' })
    mock.addSms(rent.tzid, 'no code here')
    const state = await client.rent.stateOne(rent.tzid)
    expect(state.messages.map((m) => [m.service, m.code])).toEqual([
      ['other', ''],
      ['bank', '777888'],
    ]) // newest first

    expect(await client.rent.extend(rent.tzid, 1)).toMatchObject({ days: 4, sum: 3.5 })
    expect(mock.balance()).toBe(6.5)

    const fixed = await client.rent.get(7, 1, false)
    expect(fixed).toMatchObject({ extension: 0, extend: {} })
    await expect(client.rent.extend(fixed.tzid)).rejects.toMatchObject({ code: 'TRY_AGAIN_LATER' })
    expect((await client.rent.state()).map((r) => r.tzid)).toEqual([rent.tzid, fixed.tzid])

    await client.rent.close(fixed.tzid)
    expect(mock.rents().map((r) => r.tzid)).toEqual([rent.tzid])
    await expect(client.rent.stateOne(fixed.tzid)).rejects.toMatchObject({ code: 'ERROR_NO_OPERATIONS' })
    await expect(client.rent.close(fixed.tzid)).rejects.toMatchObject({ code: 'ERROR_WRONG_TZID' })
  })

  it('rent errors: unknown country, unknown days, low balance', async () => {
    const client = new MockOnlineSim({ balance: 1.5 }).client()
    await expect(client.rent.get(44)).rejects.toMatchObject({ code: 'NO_COUNTRY' })
    await expect(client.rent.get(7, 2)).rejects.toMatchObject({ code: 'UNDEFINED_DAYS' })
    await expect(client.rent.get(7, 3)).rejects.toMatchObject({ code: 'WARNING_LOW_BALANCE' })
  })

  it('addSmsAfter works for rents; tariffs; [] for an unknown country', async () => {
    const mock = new MockOnlineSim()
    const client = mock.client()
    const { tzid } = await client.rent.get()
    mock.addSmsAfter(tzid, '6060', 1)
    expect((await client.rent.stateOne(tzid)).messages).toEqual([])
    expect((await client.rent.state())[0]?.messages[0]).toMatchObject({ code: '6060', service: 'other' })
    expect(await client.rent.tariffs()).toEqual({
      7: { code: 7, enabled: true, name: 'russia', new: false, position: 7, count: { 1: 100, 3: 100, 7: 100 }, days: { 1: 1, 3: 2.5, 7: 5 }, extend: 1, confirm: false, ext_counts: { 1: 100, 3: 100, 7: 100 } },
    })
    await expect(client.rent.tariffsOne(44)).rejects.toMatchObject({ code: 'NO_COUNTRY' })
  })
})

describe('MockOnlineSim: user and free', () => {
  it('profile, webhook set/validate/clear, logs recorded when an SMS arrives', async () => {
    const mock = new MockOnlineSim({ apiKey: 'secret' })
    const client = mock.client()
    expect(await client.user.profile()).toMatchObject({ id: 1, apikey: 'secret', webhook_url: null })
    await expect(client.user.setWebhookUrl('ftp://x')).rejects.toMatchObject({ code: 'VALIDATION_ERROR', message: 'The webhook url must be a valid URL.' })
    await client.user.setWebhookUrl('https://example.com/hook')
    expect(mock.requests.at(-1)).toMatchObject({ method: 'POST', path: 'profile.php', body: { profile: { webhook_url: 'https://example.com/hook' } } })
    expect((await client.user.profile()).webhook_url).toBe('https://example.com/hook')

    const tzid = await client.numbers.get('google', 44)
    mock.addSms(tzid, 'code 1234')
    const rent = await client.rent.get()
    mock.addSms(rent.tzid, 'code 5678')
    const logs = await client.user.webhookLogs()
    expect(logs).toMatchObject({ total: 2, current_page: 1, per_page: 10 })
    expect(logs.data.map((l) => [l.type, l.params.operation_id, l.params.code])).toEqual([
      ['rent_sms', rent.tzid, '5678'],
      ['receiving_sms', tzid, '1234'],
    ])

    await client.user.clearWebhookUrl()
    expect((await client.user.profile()).webhook_url).toBeNull()
  })

  it('balance includes the frozen part; payment history is empty', async () => {
    const mock = new MockOnlineSim({ balance: 3 })
    const client = mock.client()
    await client.numbers.get('telegram')
    await expect(client.user.balance()).resolves.toEqual({ balance: 3, zbalance: 1.2, income: 0 })
    const history = await client.user.paymentHistory()
    expect(history).toMatchObject({ paylist: {}, orders: { data: [], total: 0, current_page: 1 } })
  })

  it('free list: countries, numbers keyed by the short number, messages of the selected number', async () => {
    const client = new MockOnlineSim().client()
    const uk = await client.free.list()
    expect(uk.countries.map((c) => c.country)).toEqual([7, 44])
    expect(Object.keys(uk.numbers)).toEqual(['7459608320'])
    expect(uk.messages).toMatchObject({ number: '7459608320', country: 44, total: 2 })
    expect(uk.messages.data[0]?.code).toBe('195895')
    const ru = await client.free.list({ country: 7 })
    expect(ru.messages.data[0]).toMatchObject({ code: '51423', my_number: '9001234567' })
  })
})

describe('MockOnlineSim: control API', () => {
  it('failNext answers an error code once, optionally only for one endpoint', async () => {
    const mock = new MockOnlineSim()
    const client = mock.client()
    mock.failNext('NO_NUMBER', { endpoint: 'getNum.php' })
    await expect(client.user.balance()).resolves.toMatchObject({ balance: 100 }) // other endpoint: untouched
    await expect(client.numbers.get('google')).rejects.toBeInstanceOf(NoNumberError)
    await expect(client.numbers.get('google')).resolves.toBe(1)
    mock.failNext('TRY_AGAIN_LATER')
    await expect(client.user.profile()).rejects.toMatchObject({ code: 'TRY_AGAIN_LATER' })
  })

  it('failNextTransport fails once with a non-JSON body; waitCode retries it', async () => {
    const mock = new MockOnlineSim()
    const client = mock.client()
    mock.failNextTransport()
    const error = await rejects(client.user.balance())
    expect(error).toBeInstanceOf(TransportError)
    expect(error).toMatchObject({ status: 502 })

    const tzid = await client.numbers.get('google')
    mock.addSms(tzid, '3030')
    mock.failNextTransport({ status: 503, endpoint: 'getState.php' })
    await expect(client.numbers.waitCode(tzid, noSleep)).resolves.toBe('3030')
  })

  it('addSms/addSmsAfter reject unknown ids; setBalance; requests log; reset', async () => {
    const mock = new MockOnlineSim({ balance: 1 })
    const client = mock.client({ lang: 'ru' })
    expect(() => mock.addSms(5, 'x')).toThrow(/no open operation or rent 5/)
    expect(() => mock.addSmsAfter(5, 'x', 1)).toThrow(/no operation or rent 5/)
    mock.setBalance(50)
    expect(mock.balance()).toBe(50)
    const tzid = await client.numbers.get('telegram')
    await client.numbers.close(tzid)
    expect(() => mock.addSms(tzid, 'late')).toThrow() // closed
    expect(mock.requests[0]).toEqual({ method: 'GET', path: 'getNum.php', query: { service: 'telegram', country: '7', lang: 'ru' }, body: undefined })

    mock.failNext('NO_NUMBER')
    mock.reset()
    expect(mock.balance()).toBe(1)
    expect(mock.operations()).toEqual([])
    expect(mock.rents()).toEqual([])
    expect(mock.requests).toEqual([])
    await expect(client.numbers.get('google', 44)).resolves.toBe(1) // ids restart, failure queue cleared
  })

  it('operations() returns copies', async () => {
    const mock = new MockOnlineSim()
    await mock.client().numbers.get('google')
    mock.operations()[0]!.status = 'TZ_OVER_OK'
    expect(mock.operations()[0]?.status).toBe('TZ_NUM_WAIT')
  })
})
