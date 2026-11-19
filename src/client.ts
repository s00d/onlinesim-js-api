import { ApiError, NoNumberError, TransportError } from './errors'
import { FreeApi } from './free'
import { NumbersApi } from './numbers'
import { RentApi } from './rent'
import type { ClientOptions, FetchLike } from './types'
import { UserApi } from './user'

export const DEFAULT_BASE_URL = 'https://onlinesim.host/api/'
const DEFAULT_TIMEOUT = 30_000
const BODY_EXCERPT = 500

export type QueryValue = string | number | boolean | null | undefined | ReadonlyArray<string | number>

export interface RequestOptions {
  /** Query parameters. `undefined`/`null`/empty are omitted, booleans become `1`/`0`, arrays a comma list. */
  query?: Record<string, QueryValue>
  /** JSON body; switches the request to POST. */
  body?: unknown
}

/** The one request function the sections call. `endpoint` is relative to `baseUrl`, suffix included (`getNum.php`). */
export type RequestFn = <T>(endpoint: string, options?: RequestOptions) => Promise<T>

/**
 * OnlineSim API client.
 *
 * ```ts
 * const client = new OnlineSim({ apiKey: process.env.ONLINESIM_KEY })
 * const { balance } = await client.user.balance()
 * ```
 */
export class OnlineSim {
  readonly numbers: NumbersApi
  readonly rent: RentApi
  readonly user: UserApi
  readonly free: FreeApi

  readonly #apiKey: string | undefined
  readonly #baseUrl: string
  readonly #lang: string
  readonly #devId: string | undefined
  readonly #timeout: number
  readonly #fetch: FetchLike

  constructor(options: ClientOptions = {}) {
    this.#apiKey = options.apiKey || undefined
    const base = options.baseUrl ?? DEFAULT_BASE_URL
    this.#baseUrl = base.endsWith('/') ? base : `${base}/`
    this.#lang = options.lang ?? 'en'
    this.#devId = options.devId === undefined || options.devId === '' ? undefined : String(options.devId)
    this.#timeout = options.timeout ?? DEFAULT_TIMEOUT
    if (!options.fetch && typeof globalThis.fetch !== 'function') {
      throw new TypeError('No fetch implementation: use Node >= 18 or pass options.fetch')
    }
    // Wrapped: the global fetch called as a method of another object throws "Illegal invocation" in browsers.
    this.#fetch = options.fetch ?? ((input, init) => globalThis.fetch(input, init))

    const request: RequestFn = (endpoint, opts) => this.#request(endpoint, opts)
    this.numbers = new NumbersApi(request)
    this.rent = new RentApi(request)
    this.user = new UserApi(request)
    this.free = new FreeApi(request)
  }

  async #request<T>(endpoint: string, { query = {}, body }: RequestOptions = {}): Promise<T> {
    const url = new URL(endpoint, this.#baseUrl)
    for (const [key, value] of Object.entries({ ...query, lang: this.#lang, dev_id: this.#devId })) {
      const encoded = encodeQueryValue(value)
      if (encoded !== undefined) url.searchParams.set(key, encoded)
    }

    const headers: Record<string, string> = { Accept: 'application/json' }
    if (this.#apiKey) headers.Authorization = `Bearer ${this.#apiKey}`
    const init: RequestInit = { method: 'GET', headers }
    if (body !== undefined) {
      init.method = 'POST'
      headers['Content-Type'] = 'application/json'
      init.body = JSON.stringify(body)
    }

    const controller = new AbortController()
    init.signal = controller.signal
    const timer = setTimeout(() => controller.abort(), this.#timeout)
    let status: number
    let text: string
    try {
      const response = await this.#fetch(url.toString(), init)
      status = response.status
      text = await response.text()
    } catch (error) {
      if (controller.signal.aborted) throw new TransportError(`Request timed out after ${this.#timeout} ms`)
      throw new TransportError(`Network error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      clearTimeout(timer)
    }

    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      throw new TransportError(`HTTP ${status}: response is not JSON`, status, text.slice(0, BODY_EXCERPT))
    }
    // The body is checked before the status: a wrong key is HTTP 456 with {"response":"ERROR_WRONG_KEY"}.
    if (isObject(data) && 'response' in data) return unwrap(data) as T
    if (status < 200 || status >= 300) throw new TransportError(`HTTP ${status}`, status, text.slice(0, BODY_EXCERPT))
    return data as T
  }
}

/** Success: strip `response`, return the rest. Error code: throw. */
function unwrap(data: Record<string, unknown>): Record<string, unknown> {
  const { response, ...rest } = data
  if (response === 1 || response === '1') return rest
  if (isObject(response)) {
    // profile.php validation errors: {"response":{"webhook_url":["The webhook url must be a valid URL."]}}
    const message = Object.values(response).flat().map(String).join('; ')
    throw new ApiError('VALIDATION_ERROR', message || undefined)
  }
  const code = String(response)
  // Debug backends echo the code as `message`; prefer the readable fallback then.
  const message = typeof rest.message === 'string' && rest.message !== code ? rest.message : undefined
  if (code === 'NO_NUMBER' || code === 'NO_NUMBER_FOR_FORWARD') throw new NoNumberError(code, message)
  throw new ApiError(code, message)
}

function encodeQueryValue(value: QueryValue): string | undefined {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'boolean') return value ? '1' : '0'
  if (Array.isArray(value)) return value.length ? value.join(',') : undefined
  return String(value)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
