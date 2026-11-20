---
title: Numbers
description: Order a number, read its SMS, close it — client.numbers.
navigation:
  order: 1
---

An operation (`tzid`) is one ordered number. Order it with `get`/`getWithNumber`, read the SMS with `stateOne` or `waitCode`, finish it with `close` (or `ban`). Countries are phone codes (`7`, `44`, …), services are slugs (`google`, `vkcom`, …) as returned by `tariffs`.

## price

Price of one number, USD; `null` when the country has no price for the service.

```ts
price(service: string, country = 7): Promise<number | null>
```

| Param | Type | Default | Description |
|---|---|---|---|
| `service` | `string` | — | Service slug. |
| `country` | `number` | `7` | Country code. |

```ts
const usd = await client.numbers.price('google', 44)
```

Errors: `ApiError` `ERROR_NO_SERVICE`, `UNDEFINED_COUNTRY`.

## get

Order a number; returns the operation id. Freezes the price on the balance.

```ts
get(service: string, country = 7, options?: { reject?: Array<string | number> }): Promise<number>
```

| Param | Type | Default | Description |
|---|---|---|---|
| `service` | `string` | — | Service slug. |
| `country` | `number` | `7` | Country code. |
| `options.reject` | `Array<string \| number>` | profile list | Number prefixes to skip, e.g. `['4470']`. |

```ts
const tzid = await client.numbers.get('google', 44, { reject: ['4470'] })
```

Errors: `NoNumberError`; `ApiError` `WARNING_LOW_BALANCE`, `ERROR_NO_SERVICE`, `UNDEFINED_COUNTRY`, `EXCEEDED_CONCURRENT_OPERATIONS`, `INTERVAL_CONCURRENT_REQUESTS_ERROR`, `TRY_AGAIN_LATER`.

## getWithNumber

Same as `get`, but returns the number right away.

```ts
getWithNumber(service: string, country = 7, options?: { reject?: Array<string | number> }): Promise<NumberOrder>
```

Returns `NumberOrder`: `{ tzid, number, country, time, service, title?, guard_interval_remaining_seconds? }` — `number` with `+`, `time` in seconds left.

```ts
const { tzid, number } = await client.numbers.getWithNumber('google', 44)
```

Errors: as `get`.

## state

All operations of the account; `[]` when there are none.

```ts
state(options?: { messageToCode?: boolean; orderBy?: 'asc' | 'desc'; msgList?: boolean }): Promise<Operation[]>
```

| Option | Type | Default | Description |
|---|---|---|---|
| `messageToCode` | `boolean` | `true` | `msg` is the code only; `false` — the full SMS text. |
| `orderBy` | `'asc' \| 'desc'` | `'asc'` | Order of operations. |
| `msgList` | `boolean` | `false` | `msg` is a list of all SMS (`OperationSms[]`). |

`Operation`: `{ tzid, response, number?, service?, country?, sum?, time?, msg?, guard_interval_remaining_seconds?, … }`.
`response` is the state: `TZ_INPOOL` (number being assigned), `TZ_NUM_WAIT` (waiting for SMS), `TZ_NUM_ANSWER` (SMS arrived), `TZ_OVER_OK` (finished), `ERROR_NO_ITEMS` (failed). `msg` is absent until the first SMS. The server caches answers for a few seconds.

```ts
for (const op of await client.numbers.state({ orderBy: 'desc' })) {
  console.log(op.tzid, op.response, op.msg)
}
```

## stateOne

One operation.

```ts
stateOne(tzid: number, options?: { messageToCode?: boolean; msgList?: boolean }): Promise<Operation>
```

```ts
const op = await client.numbers.stateOne(tzid)
if (op.response === 'TZ_NUM_ANSWER') console.log(op.msg)
```

Errors: `ApiError` `ERROR_NO_OPERATIONS` when the operation does not exist (any more).

## waitCode

Poll the operation until a code arrives, then close it and return the code.

```ts
waitCode(tzid: number, options?: WaitCodeOptions): Promise<string>
```

| Option | Type | Default | Description |
|---|---|---|---|
| `interval` | `number` | `5000` | Poll interval, ms. |
| `timeout` | `number` | `600000` | Give up after, ms. |
| `keepOpen` | `boolean` | `false` | Call `next(tzid)` instead of `close(tzid)`, to wait for another SMS. |
| `fullMessage` | `boolean` | `false` | Return the full SMS text instead of the code. |
| `since` | `string \| null` | `null` | Ignore this value (the previous code). |
| `sleep`, `now` | functions | real timers | Injectable for tests. |

Transient errors are retried until the timeout: `TransportError`, and `ApiError` `TRY_AGAIN_LATER` (the HTTP 429 rate limit), `ERROR_UNDEFINED` and `INTERVAL_CONCURRENT_REQUESTS_ERROR`. Any other `ApiError` is thrown at once.

```ts
const first = await client.numbers.waitCode(tzid, { keepOpen: true })
const second = await client.numbers.waitCode(tzid, { since: first })
```

Errors: `TimeoutError`; `ApiError` with code `TZ_OVER_OK` or `ERROR_NO_ITEMS` when the operation ended without a new code; any other `ApiError` from `stateOne`/`close`/`next`.

## next

Switch the operation to its next SMS and keep it open (for services that send several SMS).

```ts
next(tzid: number): Promise<true>
```

```ts
await client.numbers.next(tzid)
```

Errors: `ApiError` `ERROR_WRONG_TZID` (not an operation of your account), `ERROR_NO_TZID`.

## close

Finish the operation. An operation without SMS can be closed only after its guard interval (`guard_interval_remaining_seconds`); every attempt locks the tzid for 5 s.

```ts
close(tzid: number): Promise<true>
```

```ts
await client.numbers.close(tzid)
```

Errors: `ApiError` `NO_COMPLETE_TZID`, `INTERVAL_CONCURRENT_REQUESTS_ERROR`, `ERROR_WRONG_TZID`.

## ban

Finish the operation and report the number as bad. Only before any SMS arrived.

```ts
ban(tzid: number): Promise<true>
```

```ts
await client.numbers.ban(tzid)
```

Errors: as `close`; `ApiError` with code `"0"` when the operation already has an SMS — nothing is changed then.

## tariffs

Services, prices and stock of every country, keyed by country code. No API key needed. The answer is large (a few MB); prefer `tariffsOne`.

```ts
tariffs(): Promise<Record<string, CountryStat>>
```

`CountryStat`: `{ name, locale_name?, position, code, other?, new, enabled, services }`; `services` maps `service_<slug>` to `{ count, popular, code, price, id, service, slug }`.

```ts
const all = await client.numbers.tariffs()
console.log(Object.keys(all).length, 'countries')
```

## tariffsOne

Services, prices and stock of one country.

```ts
tariffsOne(country = 7): Promise<CountryStat>
```

```ts
const uk = await client.numbers.tariffsOne(44)
for (const s of Object.values(uk.services)) console.log(s.slug, s.price, s.count)
```

Errors: `ApiError` `NO_COUNTRY`.
