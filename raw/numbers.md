# Numbers

> Order a number, read its SMS, close it — client.numbers.

An operation (`tzid`) is one ordered number. Order it with `get`/`getWithNumber`, read the SMS with `stateOne` or `waitCode`, finish it with `close` (or `ban`). Countries are phone codes (`7`, `44`, …), services are slugs (`google`, `vkcom`, …) as returned by `tariffs`.

## price

Price of one number, USD; `null` when the country has no price for the service.

```ts
price(service: string, country = 7): Promise<number | null>
```

<table>
<thead>
  <tr>
    <th>
      Param
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      Description
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        service
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      Service slug.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        country
      </code>
    </td>
    
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      <code>
        7
      </code>
    </td>
    
    <td>
      Country code.
    </td>
  </tr>
</tbody>
</table>

```ts
const usd = await client.numbers.price('google', 44)
```

Errors: `ApiError` `ERROR_NO_SERVICE`, `UNDEFINED_COUNTRY`.

## get

Order a number; returns the operation id. Freezes the price on the balance.

```ts
get(service: string, country = 7, options?: { reject?: Array<string | number> }): Promise<number>
```

<table>
<thead>
  <tr>
    <th>
      Param
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      Description
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        service
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      Service slug.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        country
      </code>
    </td>
    
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      <code>
        7
      </code>
    </td>
    
    <td>
      Country code.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        options.reject
      </code>
    </td>
    
    <td>
      <code>
        Array<string | number>
      </code>
    </td>
    
    <td>
      profile list
    </td>
    
    <td>
      Number prefixes to skip, e.g. <code>
        ['4470']
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

```ts
const tzid = await client.numbers.get('google', 44, { reject: ['4470'] })
```

Errors: `NoNumberError`; `ApiError` `WARNING_LOW_BALANCE`, `ERROR_NO_SERVICE`, `UNDEFINED_COUNTRY`, `EXCEEDED_CONCURRENT_OPERATIONS`, `INTERVAL_CONCURRENT_REQUESTS_ERROR`, `TRY_AGAIN_LATER`.

## getWithNumber

Same as `get`, but returns the number right away.

```ts
getWithNumber(service: string, country = 7, options?: { reject?: Array<string | number> }): Promise<NumberOrder>
```

Returns `NumberOrder`: `{ tzid, number, country, time, service, title?, guard_interval_remaining_seconds? }` — `number` with `+`, `time` in seconds left.

```ts
const { tzid, number } = await client.numbers.getWithNumber('google', 44)
```

Errors: as `get`.

## state

All operations of the account; `[]` when there are none.

```ts
state(options?: { messageToCode?: boolean; orderBy?: 'asc' | 'desc'; msgList?: boolean }): Promise<Operation[]>
```

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      Description
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        messageToCode
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
    
    <td>
      <code>
        msg
      </code>
      
       is the code only; <code>
        false
      </code>
      
       — the full SMS text.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        orderBy
      </code>
    </td>
    
    <td>
      <code>
        'asc' | 'desc'
      </code>
    </td>
    
    <td>
      <code>
        'asc'
      </code>
    </td>
    
    <td>
      Order of operations.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        msgList
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      <code>
        msg
      </code>
      
       is a list of all SMS (<code>
        OperationSms[]
      </code>
      
      ).
    </td>
  </tr>
</tbody>
</table>

`Operation`: `{ tzid, response, number?, service?, country?, sum?, time?, msg?, guard_interval_remaining_seconds?, … }`.
`response` is the state: `TZ_INPOOL` (number being assigned), `TZ_NUM_WAIT` (waiting for SMS), `TZ_NUM_ANSWER` (SMS arrived), `TZ_OVER_OK` (finished), `ERROR_NO_ITEMS` (failed). `msg` is absent until the first SMS. The server caches answers for a few seconds.

```ts
for (const op of await client.numbers.state({ orderBy: 'desc' })) {
  console.log(op.tzid, op.response, op.msg)
}
```

## stateOne

One operation.

```ts
stateOne(tzid: number, options?: { messageToCode?: boolean; msgList?: boolean }): Promise<Operation>
```

```ts
const op = await client.numbers.stateOne(tzid)
if (op.response === 'TZ_NUM_ANSWER') console.log(op.msg)
```

Errors: `ApiError` `ERROR_NO_OPERATIONS` when the operation does not exist (any more).

## waitCode

Poll the operation until a code arrives, then close it and return the code.

```ts
waitCode(tzid: number, options?: WaitCodeOptions): Promise<string>
```

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      Description
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        interval
      </code>
    </td>
    
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      <code>
        5000
      </code>
    </td>
    
    <td>
      Poll interval, ms.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        timeout
      </code>
    </td>
    
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      <code>
        600000
      </code>
    </td>
    
    <td>
      Give up after, ms.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keepOpen
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Call <code>
        next(tzid)
      </code>
      
       instead of <code>
        close(tzid)
      </code>
      
      , to wait for another SMS.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        fullMessage
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Return the full SMS text instead of the code.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        since
      </code>
    </td>
    
    <td>
      <code>
        string | null
      </code>
    </td>
    
    <td>
      <code>
        null
      </code>
    </td>
    
    <td>
      Ignore this value (the previous code).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sleep
      </code>
      
      , <code>
        now
      </code>
    </td>
    
    <td>
      functions
    </td>
    
    <td>
      real timers
    </td>
    
    <td>
      Injectable for tests.
    </td>
  </tr>
</tbody>
</table>

Transient errors are retried until the timeout: `TransportError`, and `ApiError` `TRY_AGAIN_LATER` (the HTTP 429 rate limit), `ERROR_UNDEFINED` and `INTERVAL_CONCURRENT_REQUESTS_ERROR`. Any other `ApiError` is thrown at once.

```ts
const first = await client.numbers.waitCode(tzid, { keepOpen: true })
const second = await client.numbers.waitCode(tzid, { since: first })
```

Errors: `TimeoutError`; `ApiError` with code `TZ_OVER_OK` or `ERROR_NO_ITEMS` when the operation ended without a new code; any other `ApiError` from `stateOne`/`close`/`next`.

## next

Switch the operation to its next SMS and keep it open (for services that send several SMS).

```ts
next(tzid: number): Promise<true>
```

```ts
await client.numbers.next(tzid)
```

Errors: `ApiError` `ERROR_WRONG_TZID` (not an operation of your account), `ERROR_NO_TZID`.

## close

Finish the operation. An operation without SMS can be closed only after its guard interval (`guard_interval_remaining_seconds`); every attempt locks the tzid for 5 s.

```ts
close(tzid: number): Promise<true>
```

```ts
await client.numbers.close(tzid)
```

Errors: `ApiError` `NO_COMPLETE_TZID`, `INTERVAL_CONCURRENT_REQUESTS_ERROR`, `ERROR_WRONG_TZID`.

## ban

Finish the operation and report the number as bad. Only before any SMS arrived.

```ts
ban(tzid: number): Promise<true>
```

```ts
await client.numbers.ban(tzid)
```

Errors: as `close`; `ApiError` with code `"0"` when the operation already has an SMS — nothing is changed then.

## tariffs

Services, prices and stock of every country, keyed by country code. No API key needed. The answer is large (a few MB); prefer `tariffsOne`.

```ts
tariffs(): Promise<Record<string, CountryStat>>
```

`CountryStat`: `{ name, locale_name?, position, code, other?, new, enabled, services }`; `services` maps `service_<slug>` to `{ count, popular, code, price, id, service, slug }`.

```ts
const all = await client.numbers.tariffs()
console.log(Object.keys(all).length, 'countries')
```

## tariffsOne

Services, prices and stock of one country.

```ts
tariffsOne(country = 7): Promise<CountryStat>
```

```ts
const uk = await client.numbers.tariffsOne(44)
for (const s of Object.values(uk.services)) console.log(s.slug, s.price, s.count)
```

Errors: `ApiError` `NO_COUNTRY`.
