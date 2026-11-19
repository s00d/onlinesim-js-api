# Changelog

## 2.1.0

### Added

- `MockOnlineSim`: a built-in, in-process fake of the OnlineSim API for testing integrations offline — no network, key, money or clock. `mock.client()` returns a normal `OnlineSim` wired to it (`mock.transport` is the fake `fetch`). It answers every endpoint the SDK calls like the real backend (HTTP 456 for a wrong key, string/int `response`, decimal-string money, `[]` for empty maps) and keeps balance, operations and rents. Test helpers: `addSms`, `addSmsAfter` (lets `waitCode` run with `interval: 0`), `failNext`, `failNextTransport`, `setBalance`, `balance`, `operations`, `rents`, `requests`, `reset`. Exported from the main entry; tree-shaken away when unused. See the [testing guide](https://s00d.github.io/onlinesim-js-api/testing).
- `"./package.json"` in `exports`; `CHANGELOG.md` in the package.
- Packaging checks in CI: `publint --strict`, `attw --pack` (ESM, CJS and types), and a smoke test that installs the packed tarball into an empty project and runs the README "Testing" example on Node 18 and 22.

## 2.0.0

A rewrite. The public API changed; see the [docs](https://s00d.github.io/onlinesim-js-api/).

### Removed

- The proxy API (`client.proxy()`, deprecated by the backend) and `onlineProxy()` (onlineproxy.io, a different service).
- `numbers.repeat` (getNumRepeat), `numbers.service` (getService), `numbers.serviceNumber` (getServiceNumber): no backend route.
- `rent.portReload`: deprecated no-op on the backend.
- `user.createEmpty` (pay/createEmpty).
- `free.countries`, `free.numbers`, `free.messages`: the backend returns empty data for them; use `free.list`.
- `setBase`, `setOauth`, `setToken`, `setLang` setters and the global `window.OnlineSimDriver`.
- The `axios` dependency; committed `dist/`.

### Changed

- One client: `new OnlineSim({ apiKey, baseUrl, lang, devId, timeout, fetch })`; sections are properties (`client.numbers`, `client.rent`, `client.user`, `client.free`) instead of factory methods. Named exports plus the client class as default export.
- The API key is sent as `Authorization: Bearer <key>`, never in the query string.
- Errors: `OnlineSimError` → `ApiError` (`code`, `message`), `NoNumberError` (subclass of `ApiError`), `TransportError` (`status`, `body`), `TimeoutError`. Replace `RequestException` / `NoNumberException`.
- `numbers.wait_code(tzid, timeout, callback, not_end, full_message)` → `numbers.waitCode(tzid, { interval, timeout, keepOpen, fullMessage, since })`, with milliseconds and injectable `sleep` / `now`.
- `numbers.get` / `getWithNumber`: options object `{ reject }`; `getWithNumber` returns `{ tzid, number, country, time, service }`.
- `numbers.state({ messageToCode, orderBy, msgList })` / `stateOne(tzid, { … })` take booleans; `orderBy` is lowercase.
- `rent.get(country, days, extension)`: `extension` defaults to `true` (the server default; `false` makes the rent non-extendable for good).
- `user.getPaymentHistory()` → `user.paymentHistory(page)`; `free.freeList()` → `free.list({ country, number, page, count })`.
- Money parsed to numbers: `user.balance().balance`, rent `sum`.
- ESM + CommonJS + `.d.ts` built with tsup; Node.js ≥ 18; license field matches LICENSE (Apache-2.0); repository URLs fixed.

### Fixed

- `reject` was sent in bracket form (`reject[]=…`); it is now a comma list. Booleans are sent as `1`/`0`; unset parameters are omitted.
- `state` sent `orderby=ASC`; the server accepts only lowercase.
- `wait_code` polled every 10 ms and gave up after 10 polls.
- An HTTP 456 wrong-key answer is an `ApiError`, not a transport error; non-JSON answers raise `TransportError`.
- `state()` returns `[]` instead of throwing when there are no operations.
- Empty maps sent by PHP as `[]` (rent `extend`, `paylist`, free `numbers`, country `services`) are returned as `{}`.
- Rent requests always send `pagination=0`, so `messages` is a flat list.

### Added

- `user.setWebhookUrl(url)`, `user.clearWebhookUrl()`, `user.webhookLogs(page)`.
- `parseWebhook(payload)` for inbound `receiving_sms` / `rent_sms` webhooks.
- `numbers.waitCode` options `keepOpen`, `since`; retries transient network errors.
- Injectable `fetch` transport and per-request `timeout`.
- Offline test suite (vitest, fake `fetch`), opt-in integration test, CI on Node 18/22/24.
- New documentation site (Nuxt Content).
