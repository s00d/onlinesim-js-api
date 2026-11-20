import { describe, expect, it, vi } from 'vitest'
import OnlineSimDefault, { ApiError, NoNumberError, OnlineSim, TransportError } from '../src'
import { fakeClient } from './helpers'

describe('client options and encoding', () => {
  it('default export is the client class', () => {
    expect(OnlineSimDefault).toBe(OnlineSim)
  })

  it('sends the key as a Bearer header, never in the query, plus lang', async () => {
    const { client, last } = fakeClient([{ json: { response: '1', price: 0.36 } }])
    await client.numbers.price('vkcom', 44)
    const call = last()
    expect(call.headers.Authorization).toBe('Bearer test-key')
    expect(call.headers.Accept).toBe('application/json')
    expect(call.url.searchParams.has('apikey')).toBe(false)
    expect(call.url.searchParams.get('lang')).toBe('en')
    expect(call.url.searchParams.has('dev_id')).toBe(false)
  })

  it('applies lang, devId and a base URL without trailing slash', async () => {
    const { client, last } = fakeClient([{ json: { response: '1', price: 1 } }], {
      baseUrl: 'https://api.test/api',
      lang: 'ru',
      devId: 42,
    })
    await client.numbers.price('vkcom')
    const { url } = last()
    expect(url.origin + url.pathname).toBe('https://api.test/api/getPrice.php')
    expect(url.searchParams.get('lang')).toBe('ru')
    expect(url.searchParams.get('dev_id')).toBe('42')
  })

  it('sends no Authorization header without a key', async () => {
    const { client, last } = fakeClient([{ json: { response: '1', price: 1 } }], { apiKey: undefined })
    await client.numbers.price('vkcom')
    expect(last().headers.Authorization).toBeUndefined()
  })

  it('uses https://onlinesim.host/api/ by default', async () => {
    const { client, last } = fakeClient([{ json: { response: '1', price: 1 } }], { baseUrl: undefined })
    await client.numbers.price('vkcom')
    expect(last().url.href.startsWith('https://onlinesim.host/api/getPrice.php?')).toBe(true)
  })
})

describe('response handling', () => {
  it('maps NO_NUMBER to NoNumberError (an ApiError)', async () => {
    const { client } = fakeClient([{ json: { response: 'NO_NUMBER' } }])
    const error = await client.numbers.get('google', 44).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(NoNumberError)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'NO_NUMBER', message: 'No numbers available for this service right now' })
  })

  it('maps HTTP 429 TRY_AGAIN_LATER (rate limit) to ApiError, not TransportError', async () => {
    const { client } = fakeClient([{ status: 429, json: { response: 'TRY_AGAIN_LATER' } }])
    const error = await client.numbers.state().catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).not.toBeInstanceOf(TransportError)
    expect(error).toMatchObject({ code: 'TRY_AGAIN_LATER' })
  })

  it('maps a missing key (HTTP 200 ERROR_WRONG_KEY) to ApiError', async () => {
    const { client } = fakeClient([{ json: { response: 'ERROR_WRONG_KEY' } }], { apiKey: undefined })
    await expect(client.user.balance()).rejects.toMatchObject({ code: 'ERROR_WRONG_KEY', message: 'Wrong or missing API key' })
  })

  it('maps HTTP 456 ERROR_WRONG_KEY to ApiError, not TransportError (body before status)', async () => {
    const { client } = fakeClient([{ status: 456, json: { response: 'ERROR_WRONG_KEY' } }])
    const error = await client.user.balance().catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).not.toBeInstanceOf(TransportError)
    expect(error).toMatchObject({ code: 'ERROR_WRONG_KEY', message: 'Wrong or missing API key' })
  })

  it('prefers the server message, but not when it only echoes the code', async () => {
    const { client } = fakeClient([
      { json: { response: 'TRY_AGAIN_LATER', message: 'Maintenance until 12:00' } },
      { json: { response: 'UNDEFINED_COUNTRY', message: 'UNDEFINED_COUNTRY' } },
      { json: { response: 'SOMETHING_NEW' } },
    ])
    await expect(client.numbers.get('x')).rejects.toMatchObject({ code: 'TRY_AGAIN_LATER', message: 'Maintenance until 12:00' })
    await expect(client.numbers.get('x')).rejects.toMatchObject({ code: 'UNDEFINED_COUNTRY', message: 'Unknown country' })
    await expect(client.numbers.get('x')).rejects.toMatchObject({ code: 'SOMETHING_NEW', message: 'SOMETHING_NEW' })
  })

  it('maps a validation object in response to VALIDATION_ERROR with the field messages', async () => {
    const { client } = fakeClient([
      { json: { response: { webhook_url: ['The webhook url must be a valid URL.', 'Too long.'], name: ['Required.'] } } },
    ])
    await expect(client.user.setWebhookUrl('nope')).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      message: 'The webhook url must be a valid URL.; Too long.; Required.',
    })
  })

  it('maps a non-JSON body to TransportError with status and body excerpt', async () => {
    const { client } = fakeClient([{ status: 502, raw: '<html>Bad gateway</html>' }])
    const error = await client.user.balance().catch((e: unknown) => e)
    expect(error).toBeInstanceOf(TransportError)
    expect(error).toMatchObject({ status: 502, body: '<html>Bad gateway</html>' })
  })

  it('maps a JSON error status without `response` to TransportError', async () => {
    const { client } = fakeClient([{ status: 500, json: { error: 'boom' } }])
    await expect(client.user.balance()).rejects.toMatchObject({ name: 'TransportError', status: 500 })
  })

  it('maps a network failure to TransportError without status', async () => {
    const { client } = fakeClient([new TypeError('fetch failed')])
    await expect(client.user.balance()).rejects.toMatchObject({
      name: 'TransportError',
      status: null,
      message: 'Network error: fetch failed',
    })
  })

  it('aborts after the default 30 s timeout and raises TransportError', async () => {
    vi.useFakeTimers()
    try {
      const fetch = (_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
        })
      const client = new OnlineSim({ apiKey: 'k', fetch })
      const pending = expect(client.user.balance()).rejects.toMatchObject({
        name: 'TransportError',
        status: null,
        message: 'Request timed out after 30000 ms',
      })
      await vi.advanceTimersByTimeAsync(29_999)
      await vi.advanceTimersByTimeAsync(1)
      await pending
    } finally {
      vi.useRealTimers()
    }
  })

  it('returns bodies without `response` as they are', async () => {
    const { client } = fakeClient([{ json: [] }])
    await expect(client.numbers.state()).resolves.toEqual([])
  })
})
