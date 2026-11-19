import type { RequestFn } from './client'
import { ApiError } from './errors'
import { map } from './normalize'
import type {
  CountryStat,
  GetNumberOptions,
  NumberOrder,
  Operation,
  StateOneOptions,
  StateOptions,
  WaitCodeOptions,
} from './types'
import { waitCode } from './wait'

/** Numbers for receiving SMS: `client.numbers`. */
export class NumbersApi {
  readonly #request: RequestFn

  constructor(request: RequestFn) {
    this.#request = request
  }

  /** Price (USD) of one number of `service` in `country`; `null` when the country has no price for it. */
  async price(service: string, country = 7): Promise<number | null> {
    const res = await this.#request<{ price: number | null }>('getPrice.php', { query: { service, country } })
    return res.price ?? null
  }

  /** Order a number. Returns the operation id (`tzid`). */
  async get(service: string, country = 7, { reject }: GetNumberOptions = {}): Promise<number> {
    const res = await this.#request<{ tzid: number }>('getNum.php', { query: { service, country, reject } })
    return res.tzid
  }

  /** Order a number and get it right away together with the operation id. */
  async getWithNumber(service: string, country = 7, { reject }: GetNumberOptions = {}): Promise<NumberOrder> {
    // `number` is a presence flag on getNum: sent here only.
    return this.#request<NumberOrder>('getNum.php', { query: { service, country, reject, number: 1 } })
  }

  /** All operations of the account; `[]` when there are none. */
  async state({ messageToCode = true, orderBy = 'asc', msgList = false }: StateOptions = {}): Promise<Operation[]> {
    try {
      return await this.#request<Operation[]>('getState.php', {
        query: { message_to_code: messageToCode, orderby: orderBy, msg_list: msgList, number: 1 },
      })
    } catch (error) {
      if (error instanceof ApiError && error.code === 'ERROR_NO_OPERATIONS') return []
      throw error
    }
  }

  /** One operation. Throws `ApiError('ERROR_NO_OPERATIONS')` when it does not exist (any more). */
  async stateOne(tzid: number, { messageToCode = true, msgList = false }: StateOneOptions = {}): Promise<Operation> {
    const list = await this.#request<Operation[]>('getState.php', {
      query: { tzid, message_to_code: messageToCode, msg_list: msgList, number: 1 },
    })
    const op = list[0]
    if (!op) throw new ApiError('ERROR_NO_OPERATIONS')
    return op
  }

  /** Switch the operation to its next SMS and keep it open. */
  async next(tzid: number): Promise<true> {
    await this.#request('setOperationRevise.php', { query: { tzid } })
    return true
  }

  /** Finish the operation. */
  async close(tzid: number): Promise<true> {
    await this.#request('setOperationOk.php', { query: { tzid } })
    return true
  }

  /** Finish the operation and report the number as bad (only before any SMS arrived). */
  async ban(tzid: number): Promise<true> {
    await this.#request('setOperationOk.php', { query: { tzid, ban: true } })
    return true
  }

  /** Services, prices and stock of every country, keyed by country code. No key needed. */
  async tariffs(): Promise<Record<string, CountryStat>> {
    const all = await this.#request<Record<string, CountryStat>>('getNumbersStats.php', { query: { country: 'all' } })
    return Object.fromEntries(Object.entries(map(all)).map(([code, c]) => [code, country(c)]))
  }

  /** Services, prices and stock of one country. No key needed. */
  async tariffsOne(code = 7): Promise<CountryStat> {
    return country(await this.#request<CountryStat>('getNumbersStats.php', { query: { country: code } }))
  }

  /** Poll the operation until an SMS code arrives, then close it (or `next` with `keepOpen`). See `WaitCodeOptions`. */
  waitCode(tzid: number, options: WaitCodeOptions = {}): Promise<string> {
    return waitCode(this, tzid, options)
  }
}

function country(c: CountryStat): CountryStat {
  return { ...c, services: map(c.services) }
}
