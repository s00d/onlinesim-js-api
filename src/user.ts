import type { RequestFn } from './client'
import { num } from './normalize'
import type { Balance, Paginator, PaymentHistory, Profile, WebhookLog } from './types'

/** Account: `client.user`. */
export class UserApi {
  readonly #request: RequestFn

  constructor(request: RequestFn) {
    this.#request = request
  }

  /** Balance in USD. `balance` includes the frozen `zbalance`: available = balance − max(zbalance, 0). */
  async balance(): Promise<Balance> {
    const res = await this.#request<{ balance: string | number; zbalance: number | string; income?: number | string }>(
      'getBalance.php',
      { query: { income: 1 } },
    )
    const out: Balance = { balance: num(res.balance) ?? 0, zbalance: num(res.zbalance) ?? 0 }
    const income = num(res.income)
    if (income !== null) out.income = income
    return out
  }

  /** Account profile. */
  async profile(): Promise<Profile> {
    const res = await this.#request<{ profile: Profile }>('getProfile.php')
    return res.profile
  }

  /** Top-up orders (paginated, newest first) and the available payment methods. */
  async paymentHistory(page = 1): Promise<PaymentHistory> {
    // `paylist` stays as sent: a non-empty JSON array is real data (ids 0..n), not PHP's empty map.
    return this.#request<PaymentHistory>('getPaymentHistory.php', { query: { page } })
  }

  /** Set the URL that receives SMS webhooks. Throws `ApiError('VALIDATION_ERROR')` for an invalid URL. */
  async setWebhookUrl(url: string): Promise<true> {
    await this.#request('profile.php', { body: { profile: { webhook_url: url } } })
    return true
  }

  /** Remove the webhook URL (also from operations in progress). */
  async clearWebhookUrl(): Promise<true> {
    await this.#request('profile.php', { body: { profile: { webhook_url: null } } })
    return true
  }

  /** Webhook delivery log, newest first, 10 per page. */
  async webhookLogs(page = 1): Promise<Paginator<WebhookLog>> {
    const res = await this.#request<{ data: Paginator<WebhookLog> }>('webhook-logs', { query: { page } })
    return res.data
  }
}
