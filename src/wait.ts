import { ApiError, TimeoutError, TransportError } from './errors'
import type { NumbersApi } from './numbers'
import type { Operation, WaitCodeOptions } from './types'

/** Error codes that mean "try again": rate limit (HTTP 429), a transient server error, too many requests. */
const RETRYABLE = new Set(['TRY_AGAIN_LATER', 'ERROR_UNDEFINED', 'INTERVAL_CONCURRENT_REQUESTS_ERROR'])

const realSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * Poll `stateOne(tzid)` every `interval` ms until a code different from `since` arrives, then `close`
 * (or `next` with `keepOpen`) and return it. A finished operation (TZ_OVER_OK, ERROR_NO_ITEMS) without a
 * new code throws `ApiError` with that state as the code; running out of `timeout` throws `TimeoutError`.
 * `TransportError` and the transient `ApiError` codes `TRY_AGAIN_LATER`, `ERROR_UNDEFINED` and
 * `INTERVAL_CONCURRENT_REQUESTS_ERROR` are retried until the timeout; any other `ApiError` is thrown at once.
 */
export async function waitCode(
  numbers: Pick<NumbersApi, 'stateOne' | 'close' | 'next'>,
  tzid: number,
  {
    interval = 5_000,
    timeout = 600_000,
    keepOpen = false,
    fullMessage = false,
    since = null,
    sleep = realSleep,
    now = Date.now,
  }: WaitCodeOptions = {},
): Promise<string> {
  const deadline = now() + timeout
  for (;;) {
    let op: Operation | undefined
    try {
      op = await numbers.stateOne(tzid, { messageToCode: !fullMessage })
    } catch (error) {
      const transient = error instanceof TransportError || (error instanceof ApiError && RETRYABLE.has(error.code))
      if (!transient) throw error
    }

    if (op) {
      const code = typeof op.msg === 'string' && op.msg !== '' && op.msg !== since ? op.msg : undefined
      if (code !== undefined) {
        await (keepOpen ? numbers.next(tzid) : numbers.close(tzid))
        return code
      }
      if (op.response === 'TZ_OVER_OK' || op.response === 'ERROR_NO_ITEMS') throw new ApiError(op.response)
    }

    const left = deadline - now()
    if (left <= 0) throw new TimeoutError(`No code for operation ${tzid} within ${timeout} ms`)
    await sleep(Math.min(interval, left))
  }
}
