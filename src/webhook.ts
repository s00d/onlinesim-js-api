import { OnlineSimError } from './errors'
import { num } from './normalize'
import type { WebhookPayload, WebhookType } from './types'

/**
 * Parse an inbound webhook body (`receiving_sms` or `rent_sms`) from a JSON string or an already parsed object.
 * Lenient: numeric fields may arrive as strings, missing or malformed fields become `null`, unknown fields are dropped.
 * Throws `OnlineSimError` only when the input is not a JSON object at all.
 */
export function parseWebhook(payload: string | Record<string, unknown>): WebhookPayload {
  let data: unknown = payload
  if (typeof payload === 'string') {
    try {
      data = JSON.parse(payload)
    } catch {
      throw new OnlineSimError('Webhook payload is not valid JSON')
    }
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new OnlineSimError('Webhook payload is not a JSON object')
  }
  const d = data as Record<string, unknown>
  const type = d.webhook_type
  return {
    webhook_type: type === 'receiving_sms' || type === 'rent_sms' ? (type as WebhookType) : null,
    operation_id: num(d.operation_id),
    user_id: num(d.user_id),
    country_code: num(d.country_code),
    number: str(d.number),
    sender: str(d.sender),
    message: str(d.message),
    code: str(d.code),
    time_start: str(d.time_start),
    time_left: num(d.time_left),
  }
}

function str(value: unknown): string | null {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return null
}
