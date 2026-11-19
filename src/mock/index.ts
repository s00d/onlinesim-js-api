import { OnlineSim } from '../client'
import type { ClientOptions, FetchLike } from '../types'
import { PUBLIC_PATHS, ROUTES } from './handlers'
import { fromMills, MockState, toMills } from './state'
import type { MockOperation, MockOptions, MockRent, MockRequest } from './state'

/** Base URL of clients made by `mock.client()`. Never contacted: the mock answers in-process. */
export const MOCK_BASE_URL = 'https://mock.onlinesim.invalid/api/'

/**
 * In-process fake OnlineSim API for tests: no network, no key, no money, no clock.
 * It is a `fetch` implementation (`mock.transport`) that answers like the real backend; `mock.client()`
 * returns a normal `OnlineSim` wired to it. Test helpers add SMS, queue failures and expose the state.
 *
 * ```ts
 * const mock = new MockOnlineSim({ balance: 10 })
 * const client = mock.client()
 * const tzid = await client.numbers.get('google', 44)
 * mock.addSmsAfter(tzid, 'Your code: 123-456', 2)
 * await client.numbers.waitCode(tzid, { interval: 0 }) // '123456'
 * ```
 */
export class MockOnlineSim {
  readonly #state: MockState

  /** The fake `fetch`; pass it as `fetch` when you build the client yourself. Any base URL works. */
  readonly transport: FetchLike = (input, init) => Promise.resolve(this.#handle(input, init))

  constructor(options: MockOptions = {}) {
    this.#state = new MockState(options)
  }

  /** A normal client wired to the mock. `apiKey` defaults to the mock's key; override it to test a wrong key. */
  client(options: Omit<ClientOptions, 'fetch'> = {}): OnlineSim {
    return new OnlineSim({ apiKey: this.#state.apiKey, baseUrl: MOCK_BASE_URL, ...options, fetch: this.transport })
  }

  /** An SMS arrives now at number operation or rent `tzid`. Throws when there is no open operation or rent with that id. */
  addSms(tzid: number, text: string, { service }: { service?: string } = {}): void {
    if (!this.#state.deliver(tzid, text, service)) throw new Error(`MockOnlineSim: no open operation or rent ${tzid}`)
  }

  /**
   * The SMS arrives after `polls` state requests for `tzid` (getState / rent getRentState, listing it alone
   * or with others): with `polls = 2` the third poll sees it. Lets `waitCode` run with `interval: 0`.
   */
  addSmsAfter(tzid: number, text: string, polls: number, { service }: { service?: string } = {}): void {
    if (!this.#state.operations.has(tzid) && !this.#state.rents.has(tzid)) {
      throw new Error(`MockOnlineSim: no operation or rent ${tzid}`)
    }
    this.#state.schedule(tzid, text, polls, service)
  }

  /** The next request (to `endpoint` only, e.g. `getNum.php`, when given) answers `{"response": code}`. */
  failNext(code: string, { endpoint }: { endpoint?: string } = {}): void {
    this.#state.failures.push({ code, endpoint })
  }

  /** The next request (to `endpoint` only, when given) fails at transport level: a non-JSON body with HTTP `status` (default 502). */
  failNextTransport({ status = 502, endpoint }: { status?: number; endpoint?: string } = {}): void {
    this.#state.failures.push({ status, endpoint })
  }

  /** Set the total balance, USD. */
  setBalance(usd: number): void {
    this.#state.balance = toMills(usd)
  }

  /** Total balance, USD, including the part frozen by open operations (as `getBalance` reports it). */
  balance(): number {
    return fromMills(this.#state.balance)
  }

  /** Number operations, oldest first (copies). */
  operations(): MockOperation[] {
    return structuredClone([...this.#state.operations.values()])
  }

  /** Open rents, oldest first (copies). */
  rents(): MockRent[] {
    return structuredClone([...this.#state.rents.values()])
  }

  /** Every request received, in order. */
  get requests(): readonly MockRequest[] {
    return this.#state.requests
  }

  /** Back to the constructor's state: balance, no operations, rents, logs, schedules or failures. */
  reset(): void {
    this.#state.reset()
  }

  #handle(input: string, init: RequestInit): Response {
    const url = new URL(input)
    const at = url.pathname.indexOf('/api/')
    const req: MockRequest = {
      method: (init.method ?? 'GET').toUpperCase(),
      path: at < 0 ? url.pathname.replace(/^\//, '') : url.pathname.slice(at + 5),
      query: Object.fromEntries(url.searchParams),
      body: typeof init.body === 'string' ? JSON.parse(init.body) : undefined,
    }
    const state = this.#state
    state.requests.push(req)

    const failure = state.takeFailure(req.path)
    if (failure) return 'code' in failure ? json({ response: failure.code }) : text(failure.status, 'Mock transport failure')

    const handler = Object.hasOwn(ROUTES, req.path) ? ROUTES[req.path] : undefined
    if (!handler) return text(404, 'Not Found')
    if (!PUBLIC_PATHS.includes(req.path) && authorization(init.headers) !== `Bearer ${state.apiKey}`) {
      return json({ response: 'ERROR_WRONG_KEY' }, 456)
    }
    return json(handler(state, req))
  }
}

function authorization(headers: RequestInit['headers']): string | null {
  return new Headers(headers).get('authorization')
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

function text(status: number, body: string): Response {
  return new Response(`<html><body>${status} ${body}</body></html>`, { status, headers: { 'Content-Type': 'text/html' } })
}

export type { MockOperation, MockOptions, MockPrices, MockRent, MockRentTariff, MockRequest, MockSms } from './state'
