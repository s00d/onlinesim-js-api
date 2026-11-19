import { describe, expect, it } from 'vitest'
import type { FreeList } from '../src'
import { fakeClient, fixture, query } from './helpers'

describe('free', () => {
  it('list: no .php suffix, only the set parameters', async () => {
    const body = fixture<FreeList & { response: number }>('getFreeList')
    const { client, last } = fakeClient([{ json: body }])
    const list = await client.free.list({ country: 44, number: '7459608320', count: 20 })
    expect(last().url.pathname).toBe('/api/getFreeList')
    expect(query(last())).toEqual({ country: '44', number: '7459608320', count: '20' })
    expect(Object.keys(list)).toEqual(['countries', 'numbers', 'messages'])
    expect(list.numbers['7459608320']?.full_number).toBe('447459608320')
    expect(list.messages.data[0]?.code).toBe('195895')
  })

  it('list normalises [] numbers', async () => {
    const { client, last } = fakeClient([{ json: { response: 1, countries: [], numbers: [], messages: { data: [] } } }])
    await expect(client.free.list()).resolves.toMatchObject({ numbers: {} })
    expect(query(last())).toEqual({})
  })
})
