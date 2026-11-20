/**
 * State of the mock backend. `MockState` is the single owner of everything the fake API remembers:
 * balance, operations, rents, the profile's webhook URL and its delivery log, scheduled SMS, the
 * failure queue and the request log. Handlers (`handlers.ts`) read and change it only through this object.
 *
 * Deterministic: ids and numbers come from a counter, timestamps from a fixed epoch plus that counter.
 * Money is kept in integer thousandths of a USD ("mills") so sums never drift.
 */

/** Prices of numbers: country code → service slug → USD. */
export type MockPrices = Record<number, Record<string, number>>

/** Rent tariff of one country: rent days → USD, and whether rents can be extended (`1`) or not (`0`). */
export interface MockRentTariff {
  days: Record<number, number>
  extend: number
}

export interface MockOptions {
  /** Key the mock accepts as `Authorization: Bearer <apiKey>`. Default `mock-key`. */
  apiKey?: string
  /** Starting balance, USD. Default `100`. */
  balance?: number
  /** Number prices; replaces the defaults. */
  prices?: MockPrices
  /** Rent tariffs; replaces the defaults. */
  rentTariffs?: Record<number, MockRentTariff>
  /**
   * Guard interval of new operations and rents, seconds. `> 0`: an operation without SMS, or an unconfirmed rent without
   * any SMS, cannot be closed (`NO_COMPLETE_TZID`). Default `0`.
   */
  guardInterval?: number
}

/** One SMS received by an operation or a rent. */
export interface MockSms {
  service: string
  text: string
  /** Code extracted from `text` (first run of 4–8 digits), `null` when there is none. */
  code: string | null
  /** Seconds after the mock epoch when it arrived. */
  at: number
}

/** A number operation as the mock stores it. */
export interface MockOperation {
  tzid: number
  service: string
  country: number
  /** Full number with `+`. */
  number: string
  /** Price, USD. Frozen while open; spent on close after an SMS, refunded on close without one. */
  sum: number
  status: 'TZ_NUM_WAIT' | 'TZ_NUM_ANSWER' | 'TZ_OVER_OK'
  messages: MockSms[]
  /** Index of the SMS shown in `msg`; `next` (setOperationRevise) moves it past the last one. */
  cursor: number
}

/** A rent as the mock stores it. Closed rents are removed. */
export interface MockRent {
  tzid: number
  country: number
  /** Number without the country code, as the backend sends it for rents. */
  number: string
  /** Total rent days: the initial period plus extensions. */
  days: number
  /** The initial period (`days` of getRentNum). */
  initialDays: number
  /** `0`: reserved, waiting for the first SMS; `1`: confirmed by an SMS that is not `notify`, price charged. */
  status: 0 | 1
  /** Total cost incl. extensions, USD. Frozen while `status` is 0. */
  sum: number
  extension: boolean
  /** Oldest first. */
  messages: Array<MockSms & { id: number; created_at: string }>
}

/** Sender of a rent SMS from a prohibited sender: it gets the integer `code` `0` and does not confirm the rent. */
export const NOTIFY = 'notify'

/** One request the mock received. */
export interface MockRequest {
  method: string
  /** Path relative to `/api/`, e.g. `getNum.php`, `rent/getRentNum.php`, `getFreeList`. */
  path: string
  query: Record<string, string>
  /** Parsed JSON body of a POST, `undefined` for GET. */
  body: unknown
}

export interface MockWebhookLog {
  id: number
  user_id: number
  webhook_url: string
  type: 'receiving_sms' | 'rent_sms'
  params: Record<string, string | number>
  status: 'success'
  error: null
  created_at: string
  updated_at: string
}

/** A queued failure: the next matching request answers `{"response": code}`, or a non-JSON HTTP `status`. */
export type MockFailure = { endpoint?: string } & ({ code: string } | { status: number })

interface ScheduledSms {
  text: string
  service: string | undefined
  /** getState/getRentState polls of this tzid still to pass before the SMS arrives. */
  polls: number
}

export const DEFAULT_PRICES: MockPrices = {
  7: { vkcom: 0.5, telegram: 1.2, google: 0.3 },
  44: { google: 0.2, vkcom: 0.36 },
}

export const DEFAULT_RENT_TARIFFS: Record<number, MockRentTariff> = {
  7: { days: { 1: 1.0, 3: 2.5, 7: 5.0 }, extend: 1 },
}

export const MOCK_USER_ID = 1
/** Seconds an operation stays open, as reported in `time`. The mock has no clock, so it never runs down. */
export const OPERATION_TIME = 1200
/** Minutes an unconfirmed rent waits for its first SMS (`stop_time` = start + this). */
export const RENT_FIRST_SMS_MINUTES = 20

// 2026-01-01 00:00:00 UTC. A literal, not `Date.UTC(...)`: a top-level call would defeat tree-shaking.
const EPOCH = 1_767_225_600_000

/** `YYYY-MM-DD HH:MM:SS` at `seconds` after the fixed mock epoch. */
export function stamp(seconds = 0): string {
  return new Date(EPOCH + seconds * 1000).toISOString().slice(0, 19).replace('T', ' ')
}

/**
 * The code rule shared by every SDK mock: dashes/spaces between digits are removed, then the first run of
 * 4–8 digits (not part of a longer run) is the code; `null` when there is none.
 */
export function extractCode(text: string): string | null {
  const joined = text.replace(/(\d)[\s-]+(?=\d)/g, '$1')
  return /(?<!\d)\d{4,8}(?!\d)/.exec(joined)?.[0] ?? null
}

export const toMills = (usd: number): number => Math.round(usd * 1000)
export const fromMills = (mills: number): number => mills / 1000

export class MockState {
  readonly apiKey: string
  readonly guardInterval: number
  readonly prices: MockPrices
  readonly rentTariffs: Record<number, MockRentTariff>

  /** Total balance incl. the frozen part, mills. */
  balance = 0
  /** Frozen by open operations and unconfirmed rents, mills. */
  frozen = 0
  operations = new Map<number, MockOperation>()
  rents = new Map<number, MockRent>()
  webhookUrl: string | null = null
  webhookLogs: MockWebhookLog[] = []
  requests: MockRequest[] = []
  failures: MockFailure[] = []
  scheduled = new Map<number, ScheduledSms[]>()
  /** Source of tzids, numbers, message ids and timestamps. */
  seq = 0

  readonly #startBalance: number

  constructor(options: MockOptions = {}) {
    this.apiKey = options.apiKey ?? 'mock-key'
    this.guardInterval = options.guardInterval ?? 0
    this.prices = options.prices ?? DEFAULT_PRICES
    this.rentTariffs = options.rentTariffs ?? DEFAULT_RENT_TARIFFS
    this.#startBalance = toMills(options.balance ?? 100)
    this.reset()
  }

  reset(): void {
    this.balance = this.#startBalance
    this.frozen = 0
    this.operations.clear()
    this.rents.clear()
    this.webhookUrl = null
    this.webhookLogs = []
    this.requests = []
    this.failures = []
    this.scheduled.clear()
    this.seq = 0
  }

  /** Available balance (total minus frozen), mills. */
  get available(): number {
    return this.balance - this.frozen
  }

  /** The id the next operation/rent will get. */
  peekId(): number {
    return this.seq + 1
  }

  nextId(): number {
    return ++this.seq
  }

  /** Short (country-less) number for an id: deterministic, 9 digits. */
  static shortNumber(id: number): string {
    return String(900_000_000 + id)
  }

  /** Remove and return the first queued failure that applies to `path`. */
  takeFailure(path: string): MockFailure | undefined {
    const i = this.failures.findIndex((f) => f.endpoint === undefined || f.endpoint === path)
    return i < 0 ? undefined : this.failures.splice(i, 1)[0]
  }

  /** An SMS arrives at operation or rent `tzid` now. Returns `false` when there is no open one. */
  deliver(tzid: number, text: string, service?: string): boolean {
    const op = this.operations.get(tzid)
    if (op && op.status !== 'TZ_OVER_OK') {
      const sms: MockSms = { service: service ?? op.service, text, code: extractCode(text), at: this.seq }
      op.messages.push(sms)
      op.status = 'TZ_NUM_ANSWER'
      // Activation: `+<digits>`, seconds left, the order time.
      this.#webhook('receiving_sms', tzid, op.country, op.number, sms, OPERATION_TIME, stamp(op.tzid))
      return true
    }
    const rent = this.rents.get(tzid)
    if (rent) {
      const id = this.nextId()
      const sms: MockSms = { service: service ?? 'other', text, code: extractCode(text), at: id }
      rent.messages.push({ ...sms, id, created_at: stamp(id) })
      if (rent.status === 0 && sms.service !== NOTIFY) {
        // The first real SMS confirms the rent: the reservation is charged.
        const cost = toMills(rent.sum)
        this.frozen -= cost
        this.balance -= cost
        rent.status = 1
      }
      // Rent: full number in digits without `+`, minutes left, the SMS time.
      const minutesLeft = rent.status === 1 ? rent.days * 24 * 60 : RENT_FIRST_SMS_MINUTES
      this.#webhook('rent_sms', tzid, rent.country, `${rent.country}${rent.number}`, sms, minutesLeft, stamp(id))
      return true
    }
    return false
  }

  schedule(tzid: number, text: string, polls: number, service?: string): void {
    const list = this.scheduled.get(tzid) ?? []
    list.push({ text, service, polls })
    this.scheduled.set(tzid, list)
  }

  /** One state poll of `tzid`: delivers the scheduled SMS whose polls ran out, counts down the rest. */
  poll(tzid: number): void {
    const list = this.scheduled.get(tzid)
    if (!list) return
    const due = list.filter((s) => s.polls <= 0)
    const rest = list.filter((s) => s.polls > 0)
    for (const s of rest) s.polls--
    if (rest.length) this.scheduled.set(tzid, rest)
    else this.scheduled.delete(tzid)
    // Dropped silently when the operation was closed meanwhile: a real SMS would not arrive either.
    for (const s of due) this.deliver(tzid, s.text, s.service)
  }

  /** No HTTP call: the mock only records what the backend would have sent. */
  #webhook(
    type: MockWebhookLog['type'],
    tzid: number,
    country: number,
    number: string,
    sms: MockSms,
    timeLeft: number,
    timeStart: string,
  ): void {
    if (!this.webhookUrl) return
    const id = this.webhookLogs.length + 1
    const time = stamp(sms.at)
    this.webhookLogs.push({
      id,
      user_id: MOCK_USER_ID,
      webhook_url: this.webhookUrl,
      type,
      params: {
        webhook_type: type,
        operation_id: tzid,
        user_id: MOCK_USER_ID,
        country_code: country,
        number,
        sender: sms.service,
        message: sms.text,
        code: sms.code ?? '',
        time_start: timeStart,
        time_left: timeLeft,
      },
      status: 'success',
      error: null,
      created_at: time,
      updated_at: time,
    })
  }
}
