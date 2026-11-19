import { describe, expect, it } from 'vitest'
import { ApiError } from '../src'
import type { CountryStat, Operation } from '../src'
import { fakeClient, fixture, query } from './helpers'

const path = (url: URL) => url.pathname

describe('numbers', () => {
  it('price', async () => {
    const { client, last } = fakeClient([{ json: { response: '1', price: 0.36 } }])
    await expect(client.numbers.price('vkcom', 44)).resolves.toBe(0.36)
    expect(path(last().url)).toBe('/api/getPrice.php')
    expect(query(last())).toEqual({ service: 'vkcom', country: '44' })
  })

  it('price is null when the server has none', async () => {
    const { client } = fakeClient([{ json: { response: '1', price: null } }])
    await expect(client.numbers.price('vkcom')).resolves.toBeNull()
  })

  it('get sends no `number` flag and reject as a comma list', async () => {
    const { client, last } = fakeClient([{ json: { response: 1, tzid: 1520 } }])
    await expect(client.numbers.get('google', 44, { reject: ['4470', 4471] })).resolves.toBe(1520)
    expect(path(last().url)).toBe('/api/getNum.php')
    expect(query(last())).toEqual({ service: 'google', country: '44', reject: '4470,4471' })
  })

  it('get defaults to country 7 and omits an empty reject', async () => {
    const { client, last } = fakeClient([{ json: { response: 1, tzid: 1 } }])
    await client.numbers.get('google', undefined, { reject: [] })
    expect(query(last())).toEqual({ service: 'google', country: '7' })
  })

  it('getWithNumber sends number=1 and returns the order', async () => {
    const order = { tzid: 1520, number: '+447459608320', country: 44, time: 1200, service: 'google' }
    const { client, last } = fakeClient([{ json: { response: 1, ...order } }])
    await expect(client.numbers.getWithNumber('google', 44)).resolves.toEqual(order)
    expect(query(last())).toEqual({ service: 'google', country: '44', number: '1' })
  })

  it('state sends booleans as 1/0, lowercase orderby and the number flag', async () => {
    const ops = fixture<Operation[]>('getState')
    const { client, last } = fakeClient([{ json: ops }])
    const result = await client.numbers.state({ orderBy: 'desc', msgList: true })
    expect(result).toEqual(ops)
    expect(result[0]?.msg).toBe('195895')
    expect(path(last().url)).toBe('/api/getState.php')
    expect(query(last())).toEqual({ message_to_code: '1', orderby: 'desc', msg_list: '1', number: '1' })
  })

  it('state defaults', async () => {
    const { client, last } = fakeClient([{ json: [] }])
    await client.numbers.state()
    expect(query(last())).toEqual({ message_to_code: '1', orderby: 'asc', msg_list: '0', number: '1' })
  })

  it('state returns [] on ERROR_NO_OPERATIONS', async () => {
    const { client } = fakeClient([{ json: { response: 'ERROR_NO_OPERATIONS' } }])
    await expect(client.numbers.state()).resolves.toEqual([])
  })

  it('stateOne returns the operation', async () => {
    const ops = fixture<Operation[]>('getState')
    const { client, last } = fakeClient([{ json: [ops[0]] }])
    await expect(client.numbers.stateOne(594, { messageToCode: false })).resolves.toEqual(ops[0])
    expect(query(last())).toEqual({ tzid: '594', message_to_code: '0', msg_list: '0', number: '1' })
  })

  it('stateOne raises ERROR_NO_OPERATIONS', async () => {
    const { client } = fakeClient([{ json: { response: 'ERROR_NO_OPERATIONS' } }, { json: [] }])
    await expect(client.numbers.stateOne(1)).rejects.toMatchObject({ code: 'ERROR_NO_OPERATIONS' })
    await expect(client.numbers.stateOne(1)).rejects.toBeInstanceOf(ApiError)
  })

  it('next', async () => {
    const { client, last } = fakeClient([{ json: { response: '1', tzid: '1520' } }])
    await expect(client.numbers.next(1520)).resolves.toBe(true)
    expect(path(last().url)).toBe('/api/setOperationRevise.php')
    expect(query(last())).toEqual({ tzid: '1520' })
  })

  it('close', async () => {
    const { client, last } = fakeClient([{ json: { response: 1, tzid: 1520 } }])
    await expect(client.numbers.close(1520)).resolves.toBe(true)
    expect(path(last().url)).toBe('/api/setOperationOk.php')
    expect(query(last())).toEqual({ tzid: '1520' })
  })

  it('ban', async () => {
    const { client, last } = fakeClient([{ json: { response: 1, tzid: 1520 } }])
    await expect(client.numbers.ban(1520)).resolves.toBe(true)
    expect(query(last())).toEqual({ tzid: '1520', ban: '1' })
  })

  it('close surfaces NO_COMPLETE_TZID', async () => {
    const { client } = fakeClient([{ json: { response: 'NO_COMPLETE_TZID' } }])
    await expect(client.numbers.close(1)).rejects.toMatchObject({ code: 'NO_COMPLETE_TZID' })
  })

  it('tariffs requests country=all and normalises [] services', async () => {
    const uk = fixture<CountryStat>('getNumbersStats_44')
    const { client, last } = fakeClient([{ json: { 44: uk, 7: { ...uk, code: 7, services: [] } } }])
    const all = await client.numbers.tariffs()
    expect(path(last().url)).toBe('/api/getNumbersStats.php')
    expect(query(last())).toEqual({ country: 'all' })
    expect(all['44']?.services.service_vkcom?.slug).toBe('vkcom')
    expect(all['7']?.services).toEqual({})
  })

  it('tariffsOne', async () => {
    const uk = fixture<CountryStat>('getNumbersStats_44')
    const { client, last } = fakeClient([{ json: uk }])
    await expect(client.numbers.tariffsOne(44)).resolves.toEqual(uk)
    expect(query(last())).toEqual({ country: '44' })
  })

  it('tariffsOne raises NO_COUNTRY', async () => {
    const { client } = fakeClient([{ json: { response: 'NO_COUNTRY' } }])
    await expect(client.numbers.tariffsOne(999)).rejects.toMatchObject({ code: 'NO_COUNTRY' })
  })
})
