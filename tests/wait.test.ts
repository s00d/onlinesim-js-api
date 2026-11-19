import { describe, expect, it } from 'vitest'
import { ApiError, TimeoutError, TransportError, waitCode } from '../src'
import type { Operation, OperationStatus } from '../src'
import { fakeClient } from './helpers'

type Step = Partial<Operation> | Error

/** Fake numbers section on a fake clock: `sleep` only moves `now`, nothing really waits. */
function setup(steps: Step[]) {
  let clock = 0
  const log: string[] = []
  const queue = [...steps]
  const numbers = {
    async stateOne(tzid: number, opts?: { messageToCode?: boolean }) {
      log.push(`state ${tzid} code=${opts?.messageToCode}`)
      const step = queue.shift() ?? {}
      if (step instanceof Error) throw step
      return { tzid, response: 'TZ_NUM_WAIT' as OperationStatus, ...step }
    },
    async close(tzid: number) {
      log.push(`close ${tzid}`)
      return true as const
    },
    async next(tzid: number) {
      log.push(`next ${tzid}`)
      return true as const
    },
  }
  const sleep = async (ms: number) => {
    log.push(`sleep ${ms}`)
    clock += ms
  }
  return { numbers, log, sleep, now: () => clock }
}

describe('waitCode', () => {
  it('returns the code once it arrives and closes the operation', async () => {
    const t = setup([{}, {}, { response: 'TZ_NUM_ANSWER', msg: '195895' }])
    await expect(waitCode(t.numbers, 7, { sleep: t.sleep, now: t.now })).resolves.toBe('195895')
    expect(t.log).toEqual([
      'state 7 code=true',
      'sleep 5000',
      'state 7 code=true',
      'sleep 5000',
      'state 7 code=true',
      'close 7',
    ])
  })

  it('keepOpen calls next instead of close; since skips the previous code; fullMessage asks for text', async () => {
    const t = setup([{ msg: 'old' }, { msg: 'Your code is 2991' }])
    const code = await waitCode(t.numbers, 7, { keepOpen: true, since: 'old', fullMessage: true, interval: 1000, sleep: t.sleep, now: t.now })
    expect(code).toBe('Your code is 2991')
    expect(t.log).toEqual(['state 7 code=false', 'sleep 1000', 'state 7 code=false', 'next 7'])
  })

  it.each<OperationStatus>(['TZ_OVER_OK', 'ERROR_NO_ITEMS'])('raises ApiError(%s) at once for a finished operation', async (status) => {
    const t = setup([{ response: status }])
    const error = await waitCode(t.numbers, 7, { sleep: t.sleep, now: t.now }).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: status })
    expect(t.log).toEqual(['state 7 code=true'])
  })

  it('a finished operation that still carries a new code returns it', async () => {
    const t = setup([{ response: 'TZ_OVER_OK', msg: '1234' }])
    await expect(waitCode(t.numbers, 7, { sleep: t.sleep, now: t.now })).resolves.toBe('1234')
  })

  it('raises TimeoutError when no code arrives; the last sleep is cut to the deadline', async () => {
    const t = setup([])
    const error = await waitCode(t.numbers, 7, { interval: 4000, timeout: 10_000, sleep: t.sleep, now: t.now }).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(TimeoutError)
    expect(t.log.filter((l) => l.startsWith('sleep'))).toEqual(['sleep 4000', 'sleep 4000', 'sleep 2000'])
    expect(t.log.filter((l) => l.startsWith('state'))).toHaveLength(4)
    expect(t.now()).toBe(10_000)
  })

  it('retries a transient TransportError', async () => {
    const t = setup([new TransportError('Network error: reset'), { msg: '42' }])
    await expect(waitCode(t.numbers, 7, { sleep: t.sleep, now: t.now })).resolves.toBe('42')
    expect(t.log).toEqual(['state 7 code=true', 'sleep 5000', 'state 7 code=true', 'close 7'])
  })

  it('raises any ApiError at once', async () => {
    const t = setup([new ApiError('ERROR_NO_OPERATIONS')])
    await expect(waitCode(t.numbers, 7, { sleep: t.sleep, now: t.now })).rejects.toMatchObject({ code: 'ERROR_NO_OPERATIONS' })
    expect(t.log).toEqual(['state 7 code=true'])
  })

  it('is exposed as client.numbers.waitCode', async () => {
    const { client, calls } = fakeClient([
      { json: [{ tzid: 9, response: 'TZ_NUM_ANSWER', msg: '555' }] },
      { json: { response: 1, tzid: 9 } },
    ])
    await expect(client.numbers.waitCode(9, { sleep: async () => {} })).resolves.toBe('555')
    expect(calls.map((c) => c.url.pathname)).toEqual(['/api/getState.php', '/api/setOperationOk.php'])
  })
})
