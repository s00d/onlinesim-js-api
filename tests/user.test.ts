import { describe, expect, it } from 'vitest'
import { fakeClient, fixture, query } from './helpers'

describe('user', () => {
  it('balance sends income=1 and parses the decimal string', async () => {
    const { client, last } = fakeClient([{ json: fixture('getBalance') }])
    await expect(client.user.balance()).resolves.toEqual({ balance: 1442.33, zbalance: 1023.41, income: 9.78 })
    expect(last().url.pathname).toBe('/api/getBalance.php')
    expect(query(last())).toEqual({ income: '1' })
  })

  it('balance without income', async () => {
    const { client } = fakeClient([{ json: { response: '1', balance: '0.000', zbalance: 0 } }])
    await expect(client.user.balance()).resolves.toEqual({ balance: 0, zbalance: 0 })
  })

  it('profile', async () => {
    const { client, last } = fakeClient([{ json: fixture('getProfile') }])
    const profile = await client.user.profile()
    expect(last().url.pathname).toBe('/api/getProfile.php')
    expect(profile).toMatchObject({ id: 1, webhook_url: 'https://example.com/hook', number_reject: ['333'] })
  })

  it('paymentHistory normalises the [] paylist', async () => {
    const { client, last } = fakeClient([{ json: fixture('getPaymentHistory') }])
    const history = await client.user.paymentHistory(2)
    expect(last().url.pathname).toBe('/api/getPaymentHistory.php')
    expect(query(last())).toEqual({ page: '2' })
    expect(history.paylist).toEqual({})
    expect(history.orders.data[0]).toMatchObject({ id: 9462, sum: '89.00' })
  })

  it('setWebhookUrl posts JSON', async () => {
    const { client, last } = fakeClient([{ json: { response: '1', user: { id: 2 } } }])
    await expect(client.user.setWebhookUrl('https://example.com/hook')).resolves.toBe(true)
    const call = last()
    expect(call.method).toBe('POST')
    expect(call.url.pathname).toBe('/api/profile.php')
    expect(call.headers['Content-Type']).toBe('application/json')
    expect(call.headers.Authorization).toBe('Bearer test-key')
    expect(call.body).toEqual({ profile: { webhook_url: 'https://example.com/hook' } })
  })

  it('clearWebhookUrl posts webhook_url: null', async () => {
    const { client, last } = fakeClient([{ json: { response: '1', user: { id: 2 } } }])
    await expect(client.user.clearWebhookUrl()).resolves.toBe(true)
    expect(last().method).toBe('POST')
    expect(last().body).toEqual({ profile: { webhook_url: null } })
  })

  it('webhookLogs returns the paginator', async () => {
    const page = {
      current_page: 1,
      data: [
        {
          id: 7,
          user_id: 2,
          webhook_url: 'https://example.com/hook',
          type: 'receiving_sms',
          params: { webhook_type: 'receiving_sms', operation_id: 1520, code: '195895' },
          status: 'success',
          error: null,
          created_at: '2026-11-19 10:00:01',
          updated_at: '2026-11-19 10:00:01',
        },
      ],
      from: 1,
      to: 1,
      last_page: 1,
      per_page: 10,
      total: 1,
    }
    const { client, last } = fakeClient([{ json: { response: '1', data: page } }])
    await expect(client.user.webhookLogs()).resolves.toEqual(page)
    expect(last().url.pathname).toBe('/api/webhook-logs')
    expect(query(last())).toEqual({ page: '1' })
  })
})
