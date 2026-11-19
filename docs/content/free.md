---
title: Free numbers
description: Public numbers and their SMS — client.free. No API key needed.
navigation:
  order: 4
---

## list

Countries, the numbers of the selected country and the SMS of the selected number, in one call.

```ts
list(options?: { country?: number; number?: string; page?: number; count?: number }): Promise<FreeList>
```

| Option | Type | Default | Description |
|---|---|---|---|
| `country` | `number` | `44` (server) | Country code; an unknown one falls back to the first available. |
| `number` | `string` | first number | Number **without** the country code, as the keys of `numbers`. |
| `page` | `number` | `1` | Page of `messages`. |
| `count` | `number` | server default | SMS per page, 10–500. |

`FreeList`:

- `countries`: `{ country, country_text, country_original }[]`
- `numbers`: `Record<string, { country, country_original, full_number, data_humans, is_archive }>`, keyed by the short number
- `messages`: a paginator of `{ id, text, in_number, my_number, code, created_at, data_humans }` plus `number` and `country`; `code` is `-` when no code was found

```ts
const { numbers } = await client.free.list({ country: 44 })
const short = Object.keys(numbers)[0]
if (short) {
  const { messages } = await client.free.list({ country: 44, number: short, count: 20 })
  for (const sms of messages.data) console.log(sms.in_number, sms.code, sms.text)
}
```
