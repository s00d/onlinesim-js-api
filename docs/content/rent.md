---
title: Rent
description: Rent a number for days and receive every SMS sent to it — client.rent.
navigation:
  order: 2
---

A rent keeps a number for `days` days. Its SMS come in `RentItem.messages`, newest first.

`RentItem`: `{ tzid, status, number, country, sum, days, hours, time, time_seconds?, extension, extend, messages, start_time, stop_time, day_extend?, … }` —
`sum` is the price paid in USD (a number; the server sends a decimal string), `time` minutes left, `time_seconds` seconds left,
`extension` `0` not extendable / `1` extendable / `2` auto-extension, `extend` maps days to the extension price (`{}` when not extendable),
`messages` is `RentSms[]`: `{ id, service, text, code, created_at }`.

## get

Rent a number and charge the balance.

```ts
get(country = 7, days = 1, extension = true): Promise<RentItem>
```

| Param | Type | Default | Description |
|---|---|---|---|
| `country` | `number` | `7` | Country code. |
| `days` | `number` | `1` | One of the tariff's `days` keys. |
| `extension` | `boolean` | `true` | `false` makes the rent non-extendable for good. |

```ts
const rent = await client.rent.get(7, 7)
console.log(rent.tzid, rent.number, rent.sum)
```

Errors: `NoNumberError`; `ApiError` `UNDEFINED_DAYS`, `UNDEFINED_COUNTRY`, `WARNING_LOW_BALANCE`, `INTERVAL_CONCURRENT_REQUESTS_ERROR`, `TRY_AGAIN_LATER`.

## state

All rents of the account.

```ts
state(): Promise<RentItem[]>
```

```ts
for (const rent of await client.rent.state()) {
  console.log(rent.number, rent.messages[0]?.code)
}
```

## stateOne

One rent.

```ts
stateOne(tzid: number): Promise<RentItem>
```

```ts
const { messages } = await client.rent.stateOne(tzid)
```

Errors: `ApiError` `ERROR_NO_OPERATIONS` for an unknown tzid.

## extend

Extend a rent by `days` days and charge the balance. Only rents created with `extension: true`.

```ts
extend(tzid: number, days = 1): Promise<RentItem>
```

```ts
const rent = await client.rent.extend(tzid, 3)
console.log(rent.stop_time)
```

Errors: `ApiError` `TRY_AGAIN_LATER` (not extendable, unknown tzid or period, a repeat within 10 s), `WARNING_LOW_BALANCE`.

## close

Return the number before the period ends. A rent that is not confirmed yet and has no SMS can be closed only after 120 s; US numbers cannot be closed early.

```ts
close(tzid: number): Promise<true>
```

```ts
await client.rent.close(tzid)
```

Errors: `ApiError` `ERROR_NO_OPERATIONS`, `NO_COMPLETE_TZID`, `NO_CLOSE_RENT_US`, `TRY_AGAIN_LATER`.

## tariffs

Rent prices of every country, keyed by country code. No API key needed.

```ts
tariffs(): Promise<Record<string, RentTariff>>
```

`RentTariff`: `{ code, name, enabled, new, position, extend, confirm?, days, count, ext_counts? }` — `days` maps rent days to the price in USD, `count` to the numbers available.

```ts
const tariffs = await client.rent.tariffs()
```

## tariffsOne

Rent prices of one country.

```ts
tariffsOne(country = 7): Promise<RentTariff>
```

```ts
const { days } = await client.rent.tariffsOne(7)
console.log(days['7']) // price of 7 days
```

Errors: `ApiError` `NO_COUNTRY` for a country without rent.
