import { readFileSync } from 'node:fs'
import { OnlineSim } from '../src'
import type { ClientOptions } from '../src'

/** A canned answer: a JSON value, or `{ raw }` for a non-JSON body. */
export type Reply = { status?: number; json?: unknown; raw?: string } | Error

export interface Call {
  url: URL
  method: string
  headers: Record<string, string>
  body: unknown
}

export function fixture<T = unknown>(name: string): T {
  return JSON.parse(readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), 'utf8')) as T
}

/** Client on a fake `fetch` that answers `replies` in order and records every call. */
export function fakeClient(replies: Reply[], options: ClientOptions = {}) {
  const calls: Call[] = []
  const queue = [...replies]
  const fetch = async (input: string, init: RequestInit): Promise<Response> => {
    calls.push({
      url: new URL(input),
      method: init.method ?? 'GET',
      headers: { ...(init.headers as Record<string, string>) },
      body: typeof init.body === 'string' ? JSON.parse(init.body) : undefined,
    })
    const reply = queue.shift()
    if (!reply) throw new Error(`unexpected request ${input}`)
    if (reply instanceof Error) throw reply
    const body = reply.raw ?? JSON.stringify(reply.json)
    return new Response(body, { status: reply.status ?? 200 })
  }
  const client = new OnlineSim({ apiKey: 'test-key', baseUrl: 'https://api.test/api/', fetch, ...options })
  /** The only call made; fails when there were more or none. */
  const last = (): Call => {
    if (calls.length !== 1) throw new Error(`expected 1 request, got ${calls.length}`)
    return calls[0]!
  }
  return { client, calls, last }
}

/** Query of a call as a plain object, without the `lang` every request carries. */
export function query(call: Call): Record<string, string> {
  const q = Object.fromEntries(call.url.searchParams)
  delete q.lang
  return q
}
