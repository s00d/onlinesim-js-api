import type { RequestFn } from './client'
import { ApiError } from './errors'
import { map, num } from './normalize'
import type { RentItem, RentTariff } from './types'

/** Server shape before normalisation: `sum` is a number (getRentNum, extendRentState) or a decimal string (getRentState), `extend` may be `[]`. */
type RawRentItem = Omit<RentItem, 'sum' | 'extend'> & { sum: string | number; extend: Record<string, number> | [] }

// Always sent: flat `messages` list and `time_seconds`.
const DETAIL = { pagination: 0, number: 1 } as const

/** Rented numbers: `client.rent`. */
export class RentApi {
  readonly #request: RequestFn

  constructor(request: RequestFn) {
    this.#request = request
  }

  /** Rent a number for `days` days. `extension: false` makes the rent non-extendable for good. */
  async get(country = 7, days = 1, extension = true): Promise<RentItem> {
    const res = await this.#request<{ item: RawRentItem }>('rent/getRentNum.php', {
      query: { country, days, extension, ...DETAIL },
    })
    return rentItem(res.item)
  }

  /** All rents of the account. */
  async state(): Promise<RentItem[]> {
    const res = await this.#request<{ list: RawRentItem[] }>('rent/getRentState.php', { query: { ...DETAIL } })
    return res.list.map(rentItem)
  }

  /** One rent. Throws `ApiError('ERROR_NO_OPERATIONS')` when it does not exist. */
  async stateOne(tzid: number): Promise<RentItem> {
    const res = await this.#request<{ list: RawRentItem[] }>('rent/getRentState.php', { query: { tzid, ...DETAIL } })
    const item = res.list[0]
    if (!item) throw new ApiError('ERROR_NO_OPERATIONS')
    return rentItem(item)
  }

  /** Extend a rent by `days` days (only rents created with `extension: true`). */
  async extend(tzid: number, days = 1): Promise<RentItem> {
    const res = await this.#request<{ item: RawRentItem }>('rent/extendRentState.php', {
      query: { tzid, days, ...DETAIL },
    })
    return rentItem(res.item)
  }

  /** Rent prices of every country, keyed by country code. No key needed. */
  async tariffs(): Promise<Record<string, RentTariff>> {
    return map(await this.#request<Record<string, RentTariff> | []>('rent/tariffsRent.php'))
  }

  /** Rent prices of one country. Throws `ApiError('NO_COUNTRY')` for a country without rent. No key needed. */
  async tariffsOne(country = 7): Promise<RentTariff> {
    const res = await this.#request<RentTariff | []>('rent/tariffsRent.php', { query: { country } })
    // An unknown country answers `[]`.
    if (Array.isArray(res) || !('code' in res)) throw new ApiError('NO_COUNTRY')
    return res
  }

  /** Return the number before the rent period ends. */
  async close(tzid: number): Promise<true> {
    await this.#request('rent/closeRentNum.php', { query: { tzid } })
    return true
  }
}

function rentItem(raw: RawRentItem): RentItem {
  return {
    ...raw,
    sum: num(raw.sum) ?? 0,
    extend: map(raw.extend),
    messages: Array.isArray(raw.messages) ? raw.messages : [],
  }
}
