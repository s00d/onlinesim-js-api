# onlinesim-js-api

[![npm version](https://img.shields.io/npm/v/onlinesim-js-api.svg)](https://www.npmjs.com/package/onlinesim-js-api)
[![CI](https://github.com/s00d/onlinesim-js-api/actions/workflows/ci.yml/badge.svg)](https://github.com/s00d/onlinesim-js-api/actions/workflows/ci.yml)

Typed JavaScript/TypeScript client for the [OnlineSim](https://onlinesim.io) API: SMS numbers, rent, account and free numbers.
Zero runtime dependencies (global `fetch`), Node.js 18+ and browsers, ESM and CommonJS.

```bash
npm install onlinesim-js-api
```

```ts
import { OnlineSim } from 'onlinesim-js-api'

const client = new OnlineSim({ apiKey: process.env.ONLINESIM_KEY })

const { balance, zbalance } = await client.user.balance()
console.log(`available: ${balance - zbalance} USD`)

const { tzid, number } = await client.numbers.getWithNumber('google', 44)
console.log(`enter ${number} in the app`)
console.log('code:', await client.numbers.waitCode(tzid))
```

## Testing

`MockOnlineSim` is a built-in offline fake of the API: test your integration without network, key or money.
More in the [testing guide](https://s00d.github.io/onlinesim-js-api/testing).

```ts
import assert from 'node:assert/strict'
import { MockOnlineSim } from 'onlinesim-js-api'

const mock = new MockOnlineSim({ balance: 10 })
const client = mock.client()

const tzid = await client.numbers.get('google', 44)
mock.addSmsAfter(tzid, 'Your code: 123-456', 2) // arrives on the third poll
assert.equal(await client.numbers.waitCode(tzid, { interval: 0 }), '123456')
assert.equal(mock.balance(), 9.8)
```

Documentation: **https://s00d.github.io/onlinesim-js-api/** · Changes: [CHANGELOG.md](CHANGELOG.md) · License: Apache-2.0
