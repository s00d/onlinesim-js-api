---
title: Changelog
description: Release notes of onlinesim-js-api.
navigation:
  order: 7
---

The full history is in [CHANGELOG.md](https://github.com/s00d/onlinesim-js-api/blob/master/CHANGELOG.md).

## 2.1.0

- New: `MockOnlineSim`, an offline fake of the API for your tests — see [Testing](/testing).
- `exports` includes `"./package.json"`; the package ships `CHANGELOG.md`.

## 2.0.0

A rewrite with a new API; v1 code does not run unchanged.

- One client, `new OnlineSim({ apiKey })`, with the sections as properties: `client.numbers`, `client.rent`, `client.user`, `client.free`.
- Zero runtime dependencies (global `fetch`, Node.js 18+), ESM + CommonJS + types.
- The key is sent as a Bearer header, never in the URL.
- Typed errors: `ApiError`, `NoNumberError`, `TransportError`, `TimeoutError`.
- `numbers.waitCode` replaces `wait_code`: real interval and timeout, `keepOpen`, `since`, retries network errors.
- `rent.get` creates extendable rents by default (`extension = true`).
- New: `user.setWebhookUrl` / `clearWebhookUrl` / `webhookLogs`, `parseWebhook`.
- Removed: the proxy API, `onlineProxy`, `numbers.repeat`, `numbers.service`, `numbers.serviceNumber`, `rent.portReload`, `user.createEmpty`, `free.countries` / `numbers` / `messages` (use `free.list`).
