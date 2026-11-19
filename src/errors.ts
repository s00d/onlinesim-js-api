/** Base class of every error thrown by the SDK. */
export class OnlineSimError extends Error {
  constructor(message: string) {
    super(message)
    this.name = new.target.name
  }
}

/** The API answered with an error code in `response`. */
export class ApiError extends OnlineSimError {
  /** Raw error code, e.g. `ERROR_WRONG_KEY`. */
  readonly code: string

  constructor(code: string, message?: string) {
    super(message || ERROR_MESSAGES[code] || code)
    this.code = code
  }
}

/** No number is available right now (`NO_NUMBER`, `NO_NUMBER_FOR_FORWARD`). Retry later or pick another country. */
export class NoNumberError extends ApiError {}

/** Network failure, request timeout, or a response that is not JSON. */
export class TransportError extends OnlineSimError {
  /** HTTP status, or `null` when no response arrived (network error, timeout). */
  readonly status: number | null
  /** Start of the response body (up to 500 chars), empty when none. */
  readonly body: string

  constructor(message: string, status: number | null = null, body = '') {
    super(message)
    this.status = status
    this.body = body
  }
}

/** `waitCode` gave up: no code arrived within its `timeout`. */
export class TimeoutError extends OnlineSimError {}

/** Fallback messages for error codes the server sends without a `message`. */
export const ERROR_MESSAGES: Readonly<Record<string, string>> = {
  ACCOUNT_BLOCKED: 'Account is blocked',
  ERROR_WRONG_KEY: 'Wrong API key',
  ERROR_NO_KEY: 'API key is missing',
  ERROR_NO_SERVICE: 'Service is not specified',
  API_ACCESS_DISABLED: 'API access is disabled in the profile',
  API_ACCESS_IP: 'API access from this IP is not allowed in the profile',
  ERROR_NO_TZID: 'tzid is not specified',
  ERROR_WRONG_TZID: 'Wrong tzid',
  ERROR_NO_OPERATIONS: 'No operations',
  NO_NUMBER: 'No numbers available for this service right now',
  NO_NUMBER_FOR_FORWARD: 'No numbers available for forwarding',
  NO_COUNTRY: 'Country not found',
  UNDEFINED_COUNTRY: 'Unknown country',
  WARNING_LOW_BALANCE: 'Not enough balance',
  EXCEEDED_CONCURRENT_OPERATIONS: 'Too many concurrent operations for this account',
  INTERVAL_CONCURRENT_REQUESTS_ERROR: 'Too many concurrent requests, try again in a few seconds',
  TRY_AGAIN_LATER: 'Temporarily unable to perform the request, try again later',
  ACCOUNT_IDENTIFICATION_REQUIRED: 'Account identification is required',
  ERROR_PARAMS: 'Wrong parameters',
  API_DISABLED: 'API is disabled',
  NO_COMPLETE_TZID: 'The operation cannot be closed yet',
  NO_CLOSE_RENT_US: 'US rent numbers cannot be closed early',
  UNDEFINED_DAYS: 'Unknown rent period',
  VALIDATION_ERROR: 'Validation failed',
  TZ_OVER_OK: 'Operation finished without a new code',
  ERROR_NO_ITEMS: 'Operation failed',
}
