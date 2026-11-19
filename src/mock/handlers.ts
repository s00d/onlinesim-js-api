/**
 * The mock's routes: endpoint path (relative to `/api/`) → handler. A handler gets the state and the request
 * and returns the JSON body the real backend would send (HTTP 200). Shapes follow the OpenAPI spec and the
 * live captures: `response` as int or string per endpoint, decimal-string money, `[]` for empty maps.
 * Auth, queued failures, 456 and 404 are the transport's job (`index.ts`), not the handlers'.
 */
import {
  extractCode,
  fromMills,
  MOCK_USER_ID,
  MockState,
  OPERATION_TIME,
  stamp,
  toMills,
  type MockOperation,
  type MockRent,
  type MockRequest,
  type MockSms,
} from './state'

type Json = unknown
export type Handler = (state: MockState, req: MockRequest) => Json

/** Endpoints that answer without a key. */
export const PUBLIC_PATHS: readonly string[] = ['getNumbersStats.php', 'rent/tariffsRent.php', 'getFreeList']

const COUNTRY_NAMES: Record<number, [name: string, locale: string]> = {
  7: ['russia', 'Russia'],
  44: ['united_kingdom', 'United Kingdom'],
}

const error = (code: string) => ({ response: code })

const flag = (req: MockRequest, key: string): boolean => req.query[key] !== undefined && req.query[key] !== '0'

function int(req: MockRequest, key: string, fallback: number): number {
  const n = Number(req.query[key])
  return req.query[key] === undefined || !Number.isInteger(n) ? fallback : n
}

/** USD with 3 decimals, as the backend sends `balance`. */
const decimal = (mills: number, digits = 3): string => fromMills(mills).toFixed(digits)

function countryName(code: number): [string, string] {
  return COUNTRY_NAMES[code] ?? [`country_${code}`, `Country ${code}`]
}

/** Laravel paginator over `items`. */
function paginate<T>(items: T[], page: number, perPage: number, path: string) {
  const total = items.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const data = items.slice((page - 1) * perPage, page * perPage)
  const url = (p: number) => `https://onlinesim.host/api/${path}?page=${p}`
  return {
    current_page: page,
    data,
    first_page_url: url(1),
    from: data.length ? (page - 1) * perPage + 1 : null,
    last_page: lastPage,
    last_page_url: url(lastPage),
    links: [],
    next_page_url: page < lastPage ? url(page + 1) : null,
    path: `https://onlinesim.host/api/${path}`,
    per_page: perPage,
    prev_page_url: page > 1 ? url(page - 1) : null,
    to: data.length ? (page - 1) * perPage + data.length : null,
    total,
  }
}

// ----- numbers -----

const msgOf = (sms: MockSms, toCode: boolean): string => (toCode ? (sms.code ?? sms.text) : sms.text)

function operationView(state: MockState, op: MockOperation, req: MockRequest) {
  const toCode = flag(req, 'message_to_code')
  const open = op.status !== 'TZ_OVER_OK'
  const view: Record<string, Json> = {
    country: op.country,
    sum: op.sum,
    service: op.service,
    number: op.number,
    subscription_package_id: null,
    webhook_url: state.webhookUrl,
    response: op.status,
    tzid: op.tzid,
    time: open ? OPERATION_TIME : 0,
    form: 'index',
  }
  if (flag(req, 'msg_list')) {
    if (op.messages.length) view.msg = op.messages.map((s) => ({ service: s.service, msg: msgOf(s, toCode) }))
  } else {
    const current = op.messages[op.cursor]
    if (current) view.msg = msgOf(current, toCode)
  }
  if (req.query.number !== undefined) {
    view.guard_interval_remaining_seconds = open && !op.messages.length ? state.guardInterval : 0
  }
  return view
}

const getPrice: Handler = (state, req) => {
  const prices = state.prices[int(req, 'country', 7)]
  if (!prices) return error('UNDEFINED_COUNTRY')
  return { response: '1', price: prices[req.query.service ?? ''] ?? null }
}

const getNum: Handler = (state, req) => {
  const country = int(req, 'country', 7)
  const service = req.query.service ?? ''
  const prices = state.prices[country]
  if (!prices) return error('UNDEFINED_COUNTRY')
  const price = prices[service]
  if (price === undefined) return error('ERROR_NO_SERVICE')
  const cost = toMills(price)
  if (state.available < cost) return error('WARNING_LOW_BALANCE')

  const number = `+${country}${MockState.shortNumber(state.peekId())}`
  const reject = (req.query.reject ?? '').split(',').filter(Boolean)
  if (reject.some((prefix) => number.slice(1).startsWith(prefix))) return error('NO_NUMBER')

  const tzid = state.nextId()
  state.frozen += cost
  state.operations.set(tzid, { tzid, service, country, number, sum: price, status: 'TZ_NUM_WAIT', messages: [], cursor: 0 })
  if (req.query.number === undefined) return { response: 1, tzid }
  return { response: 1, tzid, number, country, time: OPERATION_TIME, service }
}

const getState: Handler = (state, req) => {
  const tzid = req.query.tzid === undefined ? undefined : int(req, 'tzid', -1)
  let ops = tzid === undefined ? [...state.operations.values()] : [state.operations.get(tzid)].filter((o) => o !== undefined)
  for (const op of ops) state.poll(op.tzid)
  if (!ops.length) return error('ERROR_NO_OPERATIONS')
  ops = ops.sort((a, b) => (req.query.orderby === 'desc' ? b.tzid - a.tzid : a.tzid - b.tzid))
  return ops.map((op) => operationView(state, op, req))
}

const setOperationRevise: Handler = (state, req) => {
  const tzid = int(req, 'tzid', 0)
  const op = state.operations.get(tzid)
  // Always succeeds, even for unknown tzids, like the backend.
  if (op && op.status !== 'TZ_OVER_OK') {
    op.cursor = op.messages.length
    op.status = 'TZ_NUM_WAIT'
  }
  return { response: 1, tzid }
}

const setOperationOk: Handler = (state, req) => {
  const tzid = int(req, 'tzid', 0)
  const op = state.operations.get(tzid)
  if (!op || op.status === 'TZ_OVER_OK') return error('ERROR_WRONG_TZID')
  const received = op.messages.length > 0
  if (flag(req, 'ban') && received) return { response: '0' }
  if (!received && state.guardInterval > 0) return error('NO_COMPLETE_TZID')
  const cost = toMills(op.sum)
  state.frozen -= cost
  if (received) state.balance -= cost
  op.status = 'TZ_OVER_OK'
  return { response: 1, tzid }
}

function countryStat(state: MockState, code: number) {
  const [name, locale] = countryName(code)
  const services: Record<string, Json> = {}
  Object.entries(state.prices[code] ?? {}).forEach(([slug, price], i) => {
    services[`service_${slug}`] = { count: 100, popular: false, code, price, id: i + 1, service: slug, slug }
  })
  return {
    name,
    position: code,
    code,
    other: false,
    new: false,
    enabled: true,
    services: Object.keys(services).length ? services : [],
    locale_name: locale,
  }
}

const getNumbersStats: Handler = (state, req) => {
  if (req.query.country === 'all') {
    const all: Record<string, Json> = {}
    for (const code of Object.keys(state.prices)) all[code] = countryStat(state, Number(code))
    return Object.keys(all).length ? all : []
  }
  const code = int(req, 'country', 7)
  return state.prices[code] ? countryStat(state, code) : error('NO_COUNTRY')
}

// ----- rent -----

function rentItem(state: MockState, rent: MockRent, req: MockRequest) {
  const tariff = state.rentTariffs[rent.country]
  const extendable = rent.extension && tariff?.extend === 1
  const start = rent.tzid
  const item: Record<string, Json> = {
    status: 1,
    extension: rent.extension ? 1 : 0,
    messages: [...rent.messages].reverse().map((m) => ({
      id: m.id,
      service: m.service,
      text: m.text,
      code: m.code ?? '',
      created_at: m.created_at,
    })),
    webhook_url: state.webhookUrl,
    sum: decimal(toMills(rent.sum), 2),
    country: rent.country,
    start_time: stamp(start),
    stop_time: stamp(start + rent.days * 86_400),
    checked_time: stamp(start),
    number: rent.number,
    days_autoextend: 0,
    rent: 1,
    tzid: rent.tzid,
    time: rent.days * 24 * 60,
    days: rent.days,
    hours: rent.days * 24,
    extend: extendable ? { ...tariff.days } : [],
    checked: true,
    reload: null,
    day_extend: extendable ? (tariff.days[1] ?? 0) : 0,
    m_ext: false,
    freeze: false,
  }
  if (req.query.number !== undefined) item.time_seconds = rent.days * 86_400
  return item
}

const getRentNum: Handler = (state, req) => {
  const country = int(req, 'country', 7)
  const tariff = state.rentTariffs[country]
  if (!tariff) return error('NO_COUNTRY')
  const days = int(req, 'days', 1)
  const price = tariff.days[days]
  if (price === undefined) return error('UNDEFINED_DAYS')
  if (state.available < toMills(price)) return error('WARNING_LOW_BALANCE')
  const tzid = state.nextId()
  state.balance -= toMills(price)
  const rent: MockRent = {
    tzid,
    country,
    number: MockState.shortNumber(tzid),
    days,
    sum: price,
    // `extension` defaults to 1 on the server; `0` makes the rent non-extendable for good.
    extension: req.query.extension !== '0',
    messages: [],
  }
  state.rents.set(tzid, rent)
  return { response: 1, item: rentItem(state, rent, req) }
}

const getRentState: Handler = (state, req) => {
  const tzid = req.query.tzid === undefined ? undefined : int(req, 'tzid', -1)
  const rents = tzid === undefined ? [...state.rents.values()] : [state.rents.get(tzid)].filter((r) => r !== undefined)
  for (const rent of rents) state.poll(rent.tzid)
  return { response: 1, list: rents.map((r) => rentItem(state, r, req)) }
}

const extendRentState: Handler = (state, req) => {
  const rent = state.rents.get(int(req, 'tzid', 0))
  if (!rent) return error('ERROR_WRONG_TZID')
  const tariff = state.rentTariffs[rent.country]
  if (!rent.extension || tariff?.extend !== 1) return error('TRY_AGAIN_LATER')
  const days = int(req, 'days', 1)
  const price = tariff.days[days]
  if (price === undefined) return error('UNDEFINED_DAYS')
  if (state.available < toMills(price)) return error('WARNING_LOW_BALANCE')
  state.balance -= toMills(price)
  rent.days += days
  rent.sum = fromMills(toMills(rent.sum) + toMills(price))
  return { response: 1, item: rentItem(state, rent, req) }
}

const closeRentNum: Handler = (state, req) => {
  const tzid = int(req, 'tzid', 0)
  if (!state.rents.delete(tzid)) return error('ERROR_WRONG_TZID')
  state.scheduled.delete(tzid)
  return { response: '1' }
}

const tariffsRent: Handler = (state, req) => {
  const tariff = (code: number) => {
    const t = state.rentTariffs[code]
    if (!t) return []
    const [name] = countryName(code)
    const count = Object.fromEntries(Object.keys(t.days).map((d) => [d, 100]))
    return { code, enabled: true, name, new: false, position: code, count, days: { ...t.days }, extend: t.extend, confirm: false, ext_counts: count }
  }
  if (req.query.country !== undefined) return tariff(int(req, 'country', 0))
  const all = Object.fromEntries(Object.keys(state.rentTariffs).map((code) => [code, tariff(Number(code))]))
  return Object.keys(all).length ? all : []
}

// ----- user -----

const getBalance: Handler = (state, req) => {
  const res: Record<string, Json> = { response: '1', balance: decimal(state.balance), zbalance: fromMills(state.frozen) }
  if (req.query.income !== undefined) Object.assign(res, { income: 0, income_usd: '0.000' })
  return res
}

const getProfile: Handler = (state) => ({
  response: '1',
  profile: {
    id: MOCK_USER_ID,
    hash_id: 'mock',
    name: 'mock@example.com',
    username: 'mock@example.com',
    email: 'mock@example.com',
    email_verified_at: stamp(),
    active: 'true',
    apikey: state.apiKey,
    api_access: true,
    is_api: true,
    number: null,
    country: null,
    locale: 'en',
    currency: 'USD',
    number_region: null,
    number_country: null,
    number_reject: [],
    ugroup: 1,
    verify: 0,
    block: 0,
    resetCount: null,
    created_at: stamp(),
    notification_at: null,
    first_login: false,
    sub: 0,
    disable: false,
    webhook_url: state.webhookUrl,
    is_project_subscription: false,
  },
})

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname !== ''
  } catch {
    return false
  }
}

const profile: Handler = (state, req) => {
  const body = req.body as { profile?: { webhook_url?: unknown } } | undefined
  if (req.method !== 'POST' || typeof body?.profile !== 'object' || body.profile === null) return error('ERROR_PARAMS')
  const url = body.profile.webhook_url
  if (url !== null && url !== undefined && (typeof url !== 'string' || !isHttpUrl(url))) {
    return { response: { webhook_url: ['The webhook url must be a valid URL.'] } }
  }
  if (url !== undefined) state.webhookUrl = url
  return { response: '1', user: { id: MOCK_USER_ID, webhook_url: state.webhookUrl } }
}

const webhookLogs: Handler = (state, req) => ({
  response: '1',
  data: paginate([...state.webhookLogs].reverse(), int(req, 'page', 1), 10, 'webhook-logs'),
})

const getPaymentHistory: Handler = (_state, req) => ({
  response: '1',
  orders: paginate([], int(req, 'page', 1), 10, 'getPaymentHistory.php'),
  paylist: [],
  domains: [],
  currency: { USD: 1 },
})

// ----- free -----

const FREE: Record<number, { name: string; text: string; numbers: Record<string, Array<[sender: string, text: string]>> }> = {
  44: {
    name: 'united_kingdom',
    text: 'United Kingdom',
    numbers: {
      '7459608320': [
        ['Amazon', 'Amazon: Use 195895 to reset your password.'],
        ['Microsoft', 'Microsoft access code: 2991'],
      ],
    },
  },
  7: { name: 'russia', text: 'Russia', numbers: { '9001234567': [['Telegram', 'Telegram code: 51423']] } },
}

const getFreeList: Handler = (_state, req) => {
  const codes = Object.keys(FREE).map(Number)
  const wanted = int(req, 'country', 44)
  const country = FREE[wanted] ? wanted : codes[0]!
  const data = FREE[country]!
  const numbers = Object.fromEntries(
    Object.keys(data.numbers).map((n) => [
      n,
      { country, country_original: data.name, data_humans: '1 day ago', full_number: `${country}${n}`, is_archive: false },
    ]),
  )
  const number = req.query.number && data.numbers[req.query.number] ? req.query.number : Object.keys(data.numbers)[0]!
  const messages = data.numbers[number]!.map(([sender, text], i) => ({
    id: i + 1,
    text,
    in_number: sender,
    my_number: number,
    created_at: stamp(i),
    data_humans: '1 day ago',
    code: extractCode(text) ?? '-',
  }))
  return {
    response: 1,
    countries: codes.map((c) => ({ country: c, country_text: FREE[c]!.text, country_original: FREE[c]!.name })),
    numbers,
    messages: { ...paginate(messages, int(req, 'page', 1), int(req, 'count', 10), 'getFreeList'), number, country },
  }
}

export const ROUTES: Readonly<Record<string, Handler>> = {
  'getPrice.php': getPrice,
  'getNum.php': getNum,
  'getState.php': getState,
  'setOperationRevise.php': setOperationRevise,
  'setOperationOk.php': setOperationOk,
  'getNumbersStats.php': getNumbersStats,
  'rent/getRentNum.php': getRentNum,
  'rent/getRentState.php': getRentState,
  'rent/extendRentState.php': extendRentState,
  'rent/closeRentNum.php': closeRentNum,
  'rent/tariffsRent.php': tariffsRent,
  'getBalance.php': getBalance,
  'getProfile.php': getProfile,
  'profile.php': profile,
  'webhook-logs': webhookLogs,
  'getPaymentHistory.php': getPaymentHistory,
  getFreeList,
}
