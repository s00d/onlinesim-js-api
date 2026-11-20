# User

> Balance, profile, payments and the webhook URL — client.user.

## balance

Balance in USD.

```ts
balance(): Promise<{ balance: number; zbalance: number; income?: number }>
```

`balance` includes the sum frozen by numbers and unconfirmed rents in progress (`zbalance`, which may be negative): available = `balance − max(zbalance, 0)`. `income` is the partner income. The server caches the answer for 60 s.

```ts
const { balance, zbalance } = await client.user.balance()
const available = balance - Math.max(zbalance, 0)
```

Errors: `ApiError` `ERROR_WRONG_KEY`, `ACCOUNT_BLOCKED`, `API_ACCESS_DISABLED`, `API_ACCESS_IP`.

## profile

The account profile.

```ts
profile(): Promise<Profile>
```

`Profile`: `{ id, name, username, email, locale, currency, number_country, number_reject, webhook_url, api_access, … }`.

```ts
const { email, webhook_url } = await client.user.profile()
```

## paymentHistory

Top-up orders (paginated, newest first) and the available payment methods.

```ts
paymentHistory(page = 1): Promise<PaymentHistory>
```

`PaymentHistory`: `{ orders: Paginator<PaymentOrder>, paylist, domains?, forms?, currency?, buttons? }`. `PaymentOrder.sum` stays a decimal string (`"89.00"`); `currency` and `form_text` may be `null`. `paylist` maps a group id to its payment methods, or is a list when the ids are 0, 1, 2… (the server sends a JSON array then).

```ts
const { orders } = await client.user.paymentHistory()
console.log(`${orders.total} orders, page ${orders.current_page}/${orders.last_page}`)
```

## setWebhookUrl

Set the URL that receives SMS webhooks (see [Webhooks](/webhooks)).

```ts
setWebhookUrl(url: string): Promise<true>
```

```ts
await client.user.setWebhookUrl('https://example.com/onlinesim-hook')
```

Errors: `ApiError` `VALIDATION_ERROR` for an invalid URL; `message` holds the server's field messages.

## clearWebhookUrl

Remove the webhook URL, also from operations in progress.

```ts
clearWebhookUrl(): Promise<true>
```

```ts
await client.user.clearWebhookUrl()
```

## webhookLogs

Webhook delivery log, newest first, 10 per page.

```ts
webhookLogs(page = 1): Promise<Paginator<WebhookLog>>
```

`WebhookLog`: `{ id, user_id, webhook_url, type, params, status, error, created_at, updated_at }` — `type` is `receiving_sms` or `rent_sms`, `status` is `success`, `fail` or `pending`, `params` the payload that was sent.

```ts
const logs = await client.user.webhookLogs()
for (const log of logs.data) console.log(log.created_at, log.status, log.error)
```
