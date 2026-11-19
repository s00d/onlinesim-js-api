import type { RequestFn } from './client'
import { map } from './normalize'
import type { FreeList, FreeListOptions } from './types'

/** Public free numbers: `client.free`. No key needed. */
export class FreeApi {
  readonly #request: RequestFn

  constructor(request: RequestFn) {
    this.#request = request
  }

  /** Countries, the numbers of the selected country and the SMS of the selected number. */
  async list({ country, number, page, count }: FreeListOptions = {}): Promise<FreeList> {
    const res = await this.#request<FreeList>('getFreeList', { query: { country, number, page, count } })
    return { countries: res.countries, numbers: map(res.numbers), messages: res.messages }
  }
}
