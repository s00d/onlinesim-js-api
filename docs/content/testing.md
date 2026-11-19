---
title: Testing
description: Test your integration offline with MockOnlineSim — no network, key or money.
navigation:
  order: 6
---

`MockOnlineSim` is an in-process fake of the OnlineSim API that ships with the package. It is a `fetch` implementation that answers like the real backend — same shapes, same error codes, HTTP 456 for a wrong key — and keeps a balance, operations and rents. Your code talks to a normal `OnlineSim` client, so nothing in it changes for tests. It is deterministic: no randomness, no clock, numbers and ids come from a counter.

## Setup

```ts
import { MockOnlineSim } from 'onlinesim-js-api'

const mock = new MockOnlineSim({ balance: 10 })
const client = mock.client() // an OnlineSim wired to the mock
```

```ts
new MockOnlineSim(options?: {
  apiKey?: string        // default 'mock-key'
  balance?: number       // USD, default 100
  prices?: Record<number, Record<string, number>>                                 // country → service → USD
  rentTariffs?: Record<number, { days: Record<number, number>; extend: number }>  // country → tariff
  guardInterval?: number // seconds, default 0
})
```

| Option | Default | Description |
|---|---|---|
| `apiKey` | `'mock-key'` | Key the mock accepts. `mock.client()` uses it; `mock.client({ apiKey: 'x' })` tests a wrong key. |
| `balance` | `100` | Starting balance, USD. |
| `prices` | `{ 7: { vkcom: 0.5, telegram: 1.2, google: 0.3 }, 44: { google: 0.2, vkcom: 0.36 } }` | Number prices; replaces the defaults. Also feeds `numbers.tariffs()`. |
| `rentTariffs` | `{ 7: { days: { 1: 1, 3: 2.5, 7: 5 }, extend: 1 } }` | Rent prices; `extend: 0` makes rents of that country non-extendable. |
| `guardInterval` | `0` | `> 0`: an operation without SMS cannot be closed (`NO_COMPLETE_TZID`). |

`mock.client(options?)` takes the usual [client options](/#client-options) except `fetch`. To build the client yourself, pass `mock.transport` as `fetch`; any `baseUrl` works:

```ts
import { MockOnlineSim, OnlineSim } from 'onlinesim-js-api'

const mock = new MockOnlineSim()
const client = new OnlineSim({ apiKey: 'mock-key', fetch: mock.transport })
```

## A full example

Order a number, let an SMS arrive while `waitCode` polls, check the code and the money. `addSmsAfter` delivers the SMS after a number of polls instead of after some time, so `waitCode` runs with `interval: 0` and the test takes milliseconds.

```ts
import { expect, it } from 'vitest'
import { MockOnlineSim } from 'onlinesim-js-api'

it('receives the code', async () => {
  const mock = new MockOnlineSim({ balance: 10 })
  const client = mock.client()

  const { tzid, number } = await client.numbers.getWithNumber('google', 44)
  expect(number).toBe('+44900000001')

  mock.addSmsAfter(tzid, 'Your Google code: 123-456', 2) // the third poll sees it
  const code = await client.numbers.waitCode(tzid, { interval: 0 })

  expect(code).toBe('123456')
  expect(mock.operations()[0]?.status).toBe('TZ_OVER_OK') // waitCode closed it
  expect(mock.balance()).toBe(9.8) // the price is spent once an SMS arrived
})
```

The `msg` of an operation is the code by default: the first run of 4–8 digits, with spaces and dashes between digits removed (`123-456` → `123456`); a text without such a run comes back whole. `messageToCode: false` (or `fullMessage` in `waitCode`) gives the full text.

## Errors

`failNext(code)` makes the next request answer `{"response": code}` — the client turns it into `ApiError` (or `NoNumberError`) exactly as for the real server. Pass `endpoint` to fail only that endpoint. `failNextTransport()` makes the next request fail with a non-JSON HTTP 502 (`TransportError`).

```ts
import { expect, it } from 'vitest'
import { MockOnlineSim, NoNumberError, TransportError } from 'onlinesim-js-api'

it('handles a missing number and a network hiccup', async () => {
  const mock = new MockOnlineSim()
  const client = mock.client()

  mock.failNext('NO_NUMBER', { endpoint: 'getNum.php' })
  await expect(client.numbers.get('google')).rejects.toBeInstanceOf(NoNumberError)

  mock.failNextTransport({ status: 503 })
  await expect(client.user.balance()).rejects.toBeInstanceOf(TransportError)

  await expect(client.user.balance()).resolves.toMatchObject({ balance: 100 }) // one-shot
})
```

The state itself produces the real error codes too: `WARNING_LOW_BALANCE` when the balance is short, `NO_NUMBER` when `reject` matches the next number, `UNDEFINED_COUNTRY` / `ERROR_NO_SERVICE` for unknown prices, `ERROR_WRONG_TZID` for an unknown or closed operation, `TRY_AGAIN_LATER` when extending a non-extendable rent, `ERROR_WRONG_KEY` (HTTP 456) for a wrong key.

## Inspecting requests

`mock.requests` lists every request received: `{ method, path, query, body }`, `path` relative to `/api/`.

```ts
import { expect, it } from 'vitest'
import { MockOnlineSim } from 'onlinesim-js-api'

it('sends reject as a comma list', async () => {
  const mock = new MockOnlineSim()
  await mock.client().numbers.get('google', 44, { reject: ['4470', '4471'] })

  expect(mock.requests).toEqual([
    { method: 'GET', path: 'getNum.php', query: { service: 'google', country: '44', reject: '4470,4471', lang: 'en' }, body: undefined },
  ])
})
```

## Control API

| Member | Description |
|---|---|
| `client(options?)` | A normal `OnlineSim` wired to the mock. |
| `transport` | The fake `fetch`. |
| `addSms(tzid, text, { service? })` | An SMS arrives now at a number operation or a rent (detected by `tzid`). Throws for an unknown or closed one. |
| `addSmsAfter(tzid, text, polls, { service? })` | The SMS arrives after `polls` state requests for `tzid` (`numbers.state`/`stateOne`, `rent.state`/`stateOne`). |
| `failNext(code, { endpoint? })` | The next request (to `endpoint` only, e.g. `'getNum.php'`) answers `{"response": code}`. |
| `failNextTransport({ status?, endpoint? })` | The next request fails with a non-JSON body and HTTP `status` (default `502`). |
| `setBalance(usd)` / `balance()` | Set / read the total balance, USD (it includes the part frozen by open operations, as `user.balance()` reports it). |
| `operations()` / `rents()` | Copies of the current number operations / open rents, for assertions. |
| `requests` | Log of the requests received. |
| `reset()` | Back to the constructor's state. |

## What the mock does

- **Numbers**: `get` freezes the price; `close` after an SMS spends it, `close` without one refunds it; `ban` after an SMS answers `"0"`, like the server. Numbers are `+<country>9000000NN`, ids count from 1. `next` switches to the following SMS. The operation's `time` stays at 1200 s — there is no clock.
- **Rent**: `get` charges at once and keeps the `extension` flag; `extend` charges again; `close` removes the rent. SMS appear in `messages`, newest first.
- **User**: `balance` (frozen part included), a fixed profile, `setWebhookUrl` validates `http(s)` URLs (`VALIDATION_ERROR` otherwise), `webhookLogs` lists the deliveries the mock *recorded* when an SMS arrived while a webhook URL was set — it makes no HTTP call. `paymentHistory` is empty.
- **Free**: `free.list` returns two fixed countries with one number and a few SMS each.
- Not imitated: the server's 5 s lock after `setOperationOk` (`INTERVAL_CONCURRENT_REQUESTS_ERROR`) and anything else that needs real time.
