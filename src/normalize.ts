/** Client-side normalisation of server quirks, shared by the sections and `parseWebhook`. */

/** PHP sends an empty map as `[]`: return `{}` for it, the value otherwise. */
export function map<T>(value: Record<string, T> | readonly unknown[] | null | undefined): Record<string, T> {
  return value && !Array.isArray(value) ? (value as Record<string, T>) : {}
}

/** Number from a number or a numeric string (`"1442.330"`); `null` when missing or not numeric. */
export function num(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}
