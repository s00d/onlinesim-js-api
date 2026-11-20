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

  it('decodes the spec shapes: sum as a number (getRentNum) or a string (getRentState), code 0 for a notify SMS', async () => {
    const item = {
      ...state().list[0],
      status: 0,
      checked: false,
      sum: 1.5,
      messages: [
        { id: 2, service: 'notify', text: 'Messages from this sender are not accepted', code: 0, created_at: '2026-11-19 10:01:12' },
        { id: 1, service: 'Google', text: 'G-070051', code: '070051', created_at: '2026-11-19 10:01:00' },
      ],
    }
    const { client } = fakeClient([{ json: { response: 1, item } }, { json: { response: 1, list: [{ ...item, sum: '2.40' }] } }])
    const rent = await client.rent.get(7, 3)
    expect(rent).toMatchObject({ status: 0, checked: false, sum: 1.5 })
    expect(rent.messages.map((m) => m.code)).toEqual([0, '070051'])
    expect((await client.rent.stateOne(rent.tzid)).sum).toBe(2.4)
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
