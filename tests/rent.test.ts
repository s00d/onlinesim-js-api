import { describe, expect, it } from 'vitest'
import type { RentTariff } from '../src'
import { fakeClient, fixture, query } from './helpers'

interface RawList {
  list: Array<Record<string, unknown>>
}
const state = () => fixture<RawList>('rent_getRentState')
const DETAIL = { pagination: '0', number: '1' }

describe('rent', () => {
  it('get sends extension explicitly, pagination=0 and number; parses sum', async () => {
    const item = state().list[0]
    const { client, last } = fakeClient([{ json: { response: 1, item } }])
    const rent = await client.rent.get(7, 3)
    expect(last().url.pathname).toBe('/api/rent/getRentNum.php')
    expect(query(last())).toEqual({ country: '7', days: '3', extension: '1', ...DETAIL })
    expect(rent.sum).toBe(5.14)
    expect(rent.extend).toEqual({ 1: 14.7, 3: 25.3, 7: 51 })
    expect(rent.messages[0]?.code).toBe('195895')
  })

  it('get with extension=false sends extension=0', async () => {
    const { client, last } = fakeClient([{ json: { response: 1, item: state().list[1] } }])
    await client.rent.get(7, 1, false)
    expect(query(last())).toMatchObject({ extension: '0' })
  })

  it('state normalises sum and the [] extend map', async () => {
    const { client, last } = fakeClient([{ json: state() }])
    const list = await client.rent.state()
    expect(last().url.pathname).toBe('/api/rent/getRentState.php')
    expect(query(last())).toEqual(DETAIL)
    expect(list.map((r) => r.sum)).toEqual([5.14, 0])
    expect(list[1]?.extend).toEqual({})
  })

  it('stateOne', async () => {
    const raw = state()
    const { client, last } = fakeClient([{ json: { response: 1, list: [raw.list[0]] } }])
    await expect(client.rent.stateOne(430)).resolves.toMatchObject({ tzid: 430, sum: 5.14 })
    expect(query(last())).toEqual({ tzid: '430', ...DETAIL })
  })

  it('stateOne raises ERROR_NO_OPERATIONS for an unknown tzid (empty list)', async () => {
    const { client } = fakeClient([{ json: { response: 1, list: [] } }])
    await expect(client.rent.stateOne(1)).rejects.toMatchObject({ code: 'ERROR_NO_OPERATIONS' })
  })

  it('extend', async () => {
    const { client, last } = fakeClient([{ json: { response: 1, item: state().list[0] } }])
    await expect(client.rent.extend(430, 3)).resolves.toMatchObject({ tzid: 430 })
    expect(last().url.pathname).toBe('/api/rent/extendRentState.php')
    expect(query(last())).toEqual({ tzid: '430', days: '3', ...DETAIL })
  })

  it('tariffs', async () => {
    const tariffs = fixture<Record<string, RentTariff>>('rent_tariffsRent')
    const { client, last } = fakeClient([{ json: tariffs }])
    await expect(client.rent.tariffs()).resolves.toEqual(tariffs)
    expect(last().url.pathname).toBe('/api/rent/tariffsRent.php')
    expect(query(last())).toEqual({})
  })

  it('tariffsOne', async () => {
    const ru = fixture<Record<string, RentTariff>>('rent_tariffsRent')['7']
    const { client, last } = fakeClient([{ json: ru }])
    await expect(client.rent.tariffsOne()).resolves.toEqual(ru)
    expect(query(last())).toEqual({ country: '7' })
  })

  it('tariffsOne raises NO_COUNTRY for the [] answer', async () => {
    const { client } = fakeClient([{ json: [] }])
    await expect(client.rent.tariffsOne(999)).rejects.toMatchObject({ code: 'NO_COUNTRY' })
  })

  it('close', async () => {
    const { client, last } = fakeClient([{ json: { response: '1' } }])
    await expect(client.rent.close(430)).resolves.toBe(true)
    expect(last().url.pathname).toBe('/api/rent/closeRentNum.php')
    expect(query(last())).toEqual({ tzid: '430' })
  })

  it('close surfaces NO_CLOSE_RENT_US', async () => {
    const { client } = fakeClient([{ json: { response: 'NO_CLOSE_RENT_US' } }])
    await expect(client.rent.close(1)).rejects.toMatchObject({ code: 'NO_CLOSE_RENT_US' })
  })
})
