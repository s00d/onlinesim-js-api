---
title: Webhooks
description: Receive SMS as HTTP callbacks and parse them with parseWebhook.
navigation:
  order: 5
---

Set a URL with [`client.user.setWebhookUrl`](/user#setwebhookurl). For each SMS the server POSTs a JSON body to it: `webhook_type` `receiving_sms` for numbers, `rent_sms` for rents. Delivery attempts are listed by [`client.user.webhookLogs`](/user#webhooklogs).

## parseWebhook

Parse an inbound webhook body from a JSON string or an already parsed object.

```ts
parseWebhook(payload: string | Record<string, unknown>): WebhookPayload
```

Lenient: numeric fields may arrive as strings, missing or malformed fields become `null`, unknown fields are dropped. It throws `OnlineSimError` only when the input is not a JSON object.

```ts
import { createServer } from 'node:http'
import { parseWebhook } from 'onlinesim-js-api'

createServer((req, res) => {
  let body = ''
  req.on('data', (chunk) => (body += chunk))
  req.on('end', () => {
    const hook = parseWebhook(body)
    if (hook.webhook_type === 'receiving_sms') console.log(hook.operation_id, hook.code)
    res.end('ok')
  })
}).listen(8080)
```

## Payload fields

| Field | Type | Description |
|---|---|---|
| `webhook_type` | `'receiving_sms' \| 'rent_sms' \| null` | Kind of operation. |
| `operation_id` | `number \| null` | `tzid` of the operation or rent. |
| `user_id` | `number \| null` | Account id. |
| `country_code` | `number \| null` | Country code of the number. |
| `number` | `string \| null` | The number, e.g. `+79001234567`. |
| `sender` | `string \| null` | Sender of the SMS, e.g. `VK`. |
| `message` | `string \| null` | Full SMS text. |
| `code` | `string \| null` | Code extracted from the SMS. |
| `time_start` | `string \| null` | Start of the operation. |
| `time_left` | `number \| null` | Time left. |
