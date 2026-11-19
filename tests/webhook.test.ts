import { describe, expect, it } from 'vitest'
import { OnlineSimError, parseWebhook } from '../src'

describe('parseWebhook', () => {
  it('parses a receiving_sms JSON string', () => {
    const body = JSON.stringify({
      webhook_type: 'receiving_sms',
      operation_id: 1520,
      user_id: 2,
      country_code: 7,
      number: '+79001234567',
      sender: 'VK',
      message: 'VK: 195895 is your code',
      code: '195895',
      time_start: '2026-11-19 10:00:00',
      time_left: 1100,
    })
    expect(parseWebhook(body)).toEqual({
      webhook_type: 'receiving_sms',
      operation_id: 1520,
      user_id: 2,
      country_code: 7,
      number: '+79001234567',
      sender: 'VK',
      message: 'VK: 195895 is your code',
      code: '195895',
      time_start: '2026-11-19 10:00:00',
      time_left: 1100,
    })
  })

  it('is lenient: numeric strings, missing fields, unknown fields and types', () => {
    const parsed = parseWebhook({ webhook_type: 'rent_sms', operation_id: '430', code: 2991, time_left: 'soon', extra: true })
    expect(parsed).toEqual({
      webhook_type: 'rent_sms',
      operation_id: 430,
      user_id: null,
      country_code: null,
      number: null,
      sender: null,
      message: null,
      code: '2991',
      time_start: null,
      time_left: null,
    })
    expect(parseWebhook({ webhook_type: 'other' }).webhook_type).toBeNull()
  })

  it('throws OnlineSimError only for input that is not a JSON object', () => {
    expect(() => parseWebhook('not json')).toThrow(OnlineSimError)
    expect(() => parseWebhook('[1,2]')).toThrow('not a JSON object')
    expect(() => parseWebhook('null')).toThrow(OnlineSimError)
  })
})
