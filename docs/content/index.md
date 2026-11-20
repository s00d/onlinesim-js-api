---
title: onlinesim-js-api
description: Typed, zero-dependency JavaScript/TypeScript client for the OnlineSim API — SMS numbers, rent, account and free numbers.
---

## Install

Node.js 18 or newer (or any browser): the client uses the global `fetch` and has no runtime dependencies. Ships ESM, CommonJS and TypeScript types.

::code-group
```bash [npm]
npm install onlinesim-js-api
```

```bash [pnpm]
pnpm add onlinesim-js-api
```

```bash [yarn]
yarn add onlinesim-js-api
```
::

## Quick start

Check the balance, order a number, wait for the SMS code.

```ts
import { OnlineSim } from 'onlinesim-js-api'

const client = new OnlineSim({ apiKey: process.env.ONLINESIM_KEY })

const { balance, zbalance } = await client.user.balance()
console.log(`available: ${balance - Math.max(zbalance, 0)} USD`)

const order = await client.numbers.getWithNumber('google', 44)
console.log(`enter ${order.number} in the app`)

// Polls every 5 s for up to 10 min, then closes the operation.
const code = await client.numbers.waitCode(order.tzid)
console.log(`code: ${code}`)
```

CommonJS: `const { OnlineSim } = require('onlinesim-js-api')`. The client class is also the default export.

## Client options

```ts
import { OnlineSim } from 'onlinesim-js-api'

const client = new OnlineSim({
  apiKey: 'your-api-key',
  lang: 'en',
  timeout: 15_000,
})
```

| Option | Type | Default | Description |
|---|---|---|---|
| `apiKey` | `string` | — | Sent as `Authorization: Bearer <apiKey>`, never in the URL. Not needed for tariffs and free numbers. |
| `baseUrl` | `string` | `https://onlinesim.host/api/` | API base; trailing slash optional. |
| `lang` | `string` | `en` | Language of server texts (`lang` query parameter). |
| `devId` | `string \| number` | — | Partner developer id (`dev_id`), sent only when set. |
| `timeout` | `number` | `30000` | Per-request timeout, ms. |
| `fetch` | `FetchLike` | global `fetch` | Transport: a proxy agent, a custom TLS setup, or a fake in tests. |

Sections: [`client.numbers`](/numbers), [`client.rent`](/rent), [`client.user`](/user), [`client.free`](/free). Webhook bodies are parsed by the standalone [`parseWebhook`](/webhooks).

Returned objects keep the server's snake_case field names. Two things are normalised: money that the server sends as a decimal string (`balance`, rent `sum` in `rent.state`) becomes a number, and maps that arrive as an empty PHP array `[]` become `{}`. `paymentHistory().paylist` is left as sent: a JSON array when its ids are 0, 1, 2…

## Error handling

Every error extends `OnlineSimError`.

| Class | When | Fields |
|---|---|---|
| `ApiError` | The API answered with an error code (also a wrong key, HTTP 456, and the rate limit, HTTP 429 `TRY_AGAIN_LATER`). | `code`, `message` |
| `NoNumberError` | `NO_NUMBER`: no number right now. Subclass of `ApiError`. | `code`, `message` |
| `TransportError` | Network error, request timeout, or a body that is not JSON. | `status` (`null` without a response), `body` (first 500 chars) |
| `TimeoutError` | `waitCode` got no code within its `timeout`. | — |

```ts
import { ApiError, NoNumberError, TransportError } from 'onlinesim-js-api'

try {
  await client.numbers.get('google', 44)
} catch (error) {
  if (error instanceof NoNumberError) {
    // try another country or later
  } else if (error instanceof ApiError) {
    console.error(error.code, error.message) // e.g. WARNING_LOW_BALANCE
  } else if (error instanceof TransportError) {
    console.error('network', error.status, error.body)
  } else {
    throw error
  }
}
```

`message` is the server's text when it sends one, otherwise a short English description of the code (`ERROR_MESSAGES`), otherwise the code itself. Profile validation failures become `ApiError` with code `VALIDATION_ERROR`.
