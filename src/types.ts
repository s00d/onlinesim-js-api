/**
 * Wire types. They mirror the schemas of the OnlineSim OpenAPI spec (snake_case field names as sent by the server),
 * with three client-side normalisations: decimal-string money (`balance`, rent `sum`) becomes a number,
 * and maps the server may send as an empty PHP array `[]` become `{}`.
 */

/** Minimal `fetch` signature the client needs; the global `fetch` and test fakes both match it. */
export type FetchLike = (input: string, init: RequestInit) => Promise<Response>

export interface ClientOptions {
  /** API key, sent as `Authorization: Bearer <apiKey>`. Not needed for tariffs and free numbers. */
  apiKey?: string
  /** Full API base. Default `https://onlinesim.host/api/`; trailing slash optional. */
  baseUrl?: string
  /** Language of server texts (`lang` query parameter). Default `en`. */
  lang?: string
  /** Partner developer id (`dev_id` query parameter), sent only when set. */
  devId?: string | number
  /** Per-request timeout in milliseconds. Default `30000`. */
  timeout?: number
  /** Transport. Default: the global `fetch`. */
  fetch?: FetchLike
}

// ----- numbers -----

/** State of a number operation (`Operation.response`). */
export type OperationStatus = 'TZ_INPOOL' | 'TZ_NUM_WAIT' | 'TZ_NUM_ANSWER' | 'TZ_OVER_OK' | 'ERROR_NO_ITEMS'

/** One SMS of an operation when `msgList` is set. */
export interface OperationSms {
  service: string
  msg?: string
  text?: string
  code?: string
}

/** Number operation (getState item). */
export interface Operation {
  tzid: number
  response: OperationStatus
  number?: string
  service?: string
  country?: number
  sum?: number
  /** Seconds left. */
  time?: number
  form?: string
  subscription_package_id?: number | null
  webhook_url?: string | null
  /** Absent until an SMS arrives. Code (or full text) by default, a list with `msgList`. */
  msg?: string | OperationSms[] | false
  extend?: number
  /** Seconds until the operation may be closed. */
  guard_interval_remaining_seconds?: number
}

/** Result of `numbers.getWithNumber`. */
export interface NumberOrder {
  tzid: number
  /** Full number with `+`, e.g. `+447459608320`. */
  number: string
  country: number
  /** Seconds left. */
  time: number
  service: string
  title?: string
  guard_interval_remaining_seconds?: number
}

export interface ServiceStat {
  /** Numbers in stock; `"?"` when unknown. */
  count: number | string
  popular: boolean
  code: number
  price: number
  id: number
  /** Display name. */
  service: string
  /** Service id for `numbers.get` / `numbers.price`. */
  slug: string
}

export interface CountryStat {
  name: string
  locale_name?: string
  position: number
  code: number
  /** Price of other services; `false` when not set. */
  other?: number | false
  new: boolean
  enabled: boolean
  /** Map `service_<slug>` → service. */
  services: Record<string, ServiceStat>
}

export interface GetNumberOptions {
  /** Number prefixes to skip, e.g. `['4470', '4471']`. */
  reject?: Array<string | number>
}

export interface StateOptions {
  /** `true` (default): `msg` is the code only; `false`: the full SMS text. */
  messageToCode?: boolean
  /** Default `asc`. */
  orderBy?: 'asc' | 'desc'
  /** `true`: `msg` is a list of all SMS. Default `false`. */
  msgList?: boolean
}

export type StateOneOptions = Omit<StateOptions, 'orderBy'>

export interface WaitCodeOptions {
  /** Poll interval in ms. Default `5000`. */
  interval?: number
  /** Give up after this many ms. Default `600000`. */
  timeout?: number
  /** Call `next(tzid)` instead of `close(tzid)` after the code, to wait for another SMS. Default `false`. */
  keepOpen?: boolean
  /** Return the full SMS text instead of the code. Default `false`. */
  fullMessage?: boolean
  /** Ignore this value (the previous code when waiting for the next one). */
  since?: string | null
  /** Injectable sleep (tests). */
  sleep?: (ms: number) => Promise<void>
  /** Injectable clock in ms (tests). */
  now?: () => number
}

// ----- rent -----

export interface RentSms {
  id: number
  service: string
  text: string
  code: string
  created_at: string
}

/** Rent operation. */
export interface RentItem {
  tzid: number
  status: number
  number: string
  country: number
  /** Price paid, USD (parsed from the server's decimal string). */
  sum: number
  days: number
  hours: number
  /** Minutes left. */
  time: number
  /** Seconds left. */
  time_seconds?: number
  guard_interval_remaining_seconds?: number
  /** 0 – not extendable, 1 – extendable, 2 – auto-extension. */
  extension: number
  days_autoextend?: number
  rent?: number
  start_time: string
  stop_time: string
  checked_time?: string | null
  checked?: boolean
  freeze?: boolean
  reload?: number | null
  m_ext?: boolean
  /** Price of one day of extension; 0 when not configured. */
  day_extend?: number
  /** Days → extension price; `{}` when not extendable. */
  extend: Record<string, number>
  webhook_url?: string | null
  /** SMS, newest first. */
  messages: RentSms[]
}

export interface RentTariff {
  code: number
  name: string
  enabled: boolean
  new: boolean
  position: number
  extend: number
  confirm?: boolean
  /** Rent days → price, USD. */
  days: Record<string, number>
  /** Rent days → numbers available. */
  count: Record<string, number>
  ext_counts?: Record<string, number>
}

// ----- user -----

export interface Balance {
  /** Total balance, USD. Includes `zbalance`: available = balance − zbalance. */
  balance: number
  /** Sum frozen by numbers in progress. */
  zbalance: number
  /** Partner income. */
  income?: number
}

export interface Profile {
  id: number
  hash_id?: string | null
  name?: string | null
  username?: string | null
  email?: string | null
  email_verified_at?: string | null
  apikey?: string
  /** `true`, or a map of allowed IPs. */
  api_access?: boolean | Record<string, unknown>
  locale?: string
  currency?: string
  number_country?: number | null
  number_reject?: string[] | Record<string, string> | null
  webhook_url?: string | null
  number?: string | null
  country?: number | null
  number_region?: number | null
  is_api?: boolean
  active?: string
  block?: number
  disable?: boolean
  verify?: number
  ugroup?: number
  sub?: number
  first_login?: boolean
  is_project_subscription?: boolean
  resetCount?: number | null
  created_at?: string
  notification_at?: string | null
}

/** Laravel paginator. */
export interface Paginator<T> {
  current_page: number
  data: T[]
  from: number | null
  to: number | null
  last_page: number
  per_page: number
  total: number
  first_page_url?: string
  last_page_url?: string
  next_page_url?: string | null
  prev_page_url?: string | null
  path?: string
  links?: Array<Record<string, unknown>>
}

export interface PaymentOrder {
  id: number
  /** Decimal string, e.g. `"89.00"`. */
  sum: string
  currency: string
  stat: number
  form_text?: string
  status_text?: string
  created_at: string
  [key: string]: unknown
}

export interface PaymentHistory {
  orders: Paginator<PaymentOrder>
  /** Payment methods by list id. */
  paylist: Record<string, unknown>
  domains?: string[]
  forms?: Record<string, string>
  currency?: Record<string, number>
  buttons?: Record<string, number[]>
}

export type WebhookType = 'receiving_sms' | 'rent_sms'

/** Inbound webhook body as normalised by `parseWebhook`: missing fields are `null`. */
export interface WebhookPayload {
  webhook_type: WebhookType | null
  operation_id: number | null
  user_id: number | null
  country_code: number | null
  number: string | null
  sender: string | null
  message: string | null
  code: string | null
  time_start: string | null
  time_left: number | null
}

export interface WebhookLog {
  id: number
  user_id: number
  webhook_url: string
  type: WebhookType
  /** Payload as sent by the server (not normalised). */
  params: Partial<WebhookPayload>
  status: 'success' | 'fail' | 'pending'
  error: string | null
  created_at: string
  updated_at: string
}

// ----- free -----

export interface FreeCountry {
  country: number
  country_text: string
  country_original: string
}

export interface FreeNumber {
  country: number
  country_original: string
  full_number: string
  data_humans: string
  is_archive: boolean
}

export interface FreeMessage {
  id: number
  text: string
  /** Sender. */
  in_number: string
  my_number: string
  /** `-` when no code was found. */
  code: string
  created_at: string
  data_humans: string
}

export interface FreeListOptions {
  /** Country code. Server default 44. */
  country?: number
  /** Number without the country code, as the keys of `numbers`. */
  number?: string
  /** Page of `messages`. */
  page?: number
  /** SMS per page, 10–500. */
  count?: number
}

export interface FreeList {
  countries: FreeCountry[]
  /** Keyed by number without the country code. */
  numbers: Record<string, FreeNumber>
  messages: Paginator<FreeMessage> & { number: string | null; country: number }
}
