---
outline: deep
---

# 🛠️ Methods

## 📊 `tariffs`

- **Type**: `() => Promise<Tariff>`
- **Description**: Retrieves the tariffs for proxies.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.proxy();

getter.tariffs().then((result) => {
  console.log(result);
  // Output: { days: { config: { type1: { type: 'type1', enabled: true, days: { 1: 10 } } }, operators: ['mts', 'megafon'], connect: ['https', 'socks'] }, traffic: { config: { code1: { name: 'name1', cities: { city1: 'city1' }, operators: { code1: 'operator1' } } }, price: { tariff1: 10 } } }
});
```

## 📱 `get`

- **Type**: `(cl?: 'days' | 'traffic', type?: 'shared' | 'sharednowait' | 'private' | 'privatenowait' | 'multiport', connect?: 'https' | 'socks', count?: number, operator?: 'mts' | 'megafon' | 'beeline' | 'tele2' | null, country?: string, city?: string, port_count?: number, session?: boolean) => Promise<Get>`
- **Description**: Retrieves a new proxy.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_proxy_getProxy)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_proxy_getProxy)]
- **Parameters**:
    - **cl**: `'days' | 'traffic'` — Optional. Default is 'days'.
    - **type**: `'shared' | 'sharednowait' | 'private' | 'privatenowait' | 'multiport'` — Optional. Default is 'private'.
    - **connect**: `'https' | 'socks'` — Optional. Default is 'https'.
    - **count**: `number` — Optional. Default is 1.
    - **operator**: `'mts' | 'megafon' | 'beeline' | 'tele2' | null` — Optional. Default is null.
    - **country**: `string` — Optional. Default is 'any'.
    - **city**: `string` — Optional. Default is 'any'.
    - **port_count**: `number` — Optional. Default is 1.
    - **session**: `boolean` — Optional. Default is true.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.proxy();

getter.get('days', 'private', 'https', 1, 'mts', '7', 'any', 1, true).then((result) => {
  console.log(result);
  // Output: { type: 'private', connect_type: 'https', host: 'example.com', port: 8080, user: 'user', pass: 'pass', operator: 'mts', status: 1, country: 7, rent: '2023-01-01', comment: 'comment', port_count: 1, session: true, city: 'any', traffic: '100MB', general_traffic: '1GB', stop_at: '2023-01-01', check_at: '2023-01-01', created_at: '2023-01-01', updated_at: '2023-01-01', tzid: 123, time: 1234567890, days: 1, hours: 24, change_ip: true, change_type: true, rotate: true }
});
```

## 📜 `state`

- **Type**: `(orderby?: 'ASC' | 'DESC') => Promise<Array<Get>>`
- **Description**: Retrieves the list of proxies.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_proxy_getState_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_proxy_getState_php)]
- **Parameters**:
    - **orderby**: `'ASC' | 'DESC'` — Optional. Default is 'ASC'.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.proxy();

getter.state('ASC').then((result) => {
  console.log(result);
  // Output: [{ type: 'private', connect_type: 'https', host: 'example.com', port: 8080, user: 'user', pass: 'pass', operator: 'mts', status: 1, country: 7, rent: '2023-01-01', comment: 'comment', port_count: 1, session: true, city: 'any', traffic: '100MB', general_traffic: '1GB', stop_at: '2023-01-01', check_at: '2023-01-01', created_at: '2023-01-01', updated_at: '2023-01-01', tzid: 123, time: 1234567890, days: 1, hours: 24, change_ip: true, change_type: true, rotate: true }]
});
```

## 📜 `stateOne`

- **Type**: `(tzid: number) => Promise<Get>`
- **Description**: Retrieves the selected proxy.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_proxy_getState_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_proxy_getState_php)]
- **Parameters**:
    - **tzid**: `number` — The operation tzid.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.proxy();

getter.stateOne(123).then((result) => {
  console.log(result);
  // Output: { type: 'private', connect_type: 'https', host: 'example.com', port: 8080, user: 'user', pass: 'pass', operator: 'mts', status: 1, country: 7, rent: '2023-01-01', comment: 'comment', port_count: 1, session: true, city: 'any', traffic: '100MB', general_traffic: '1GB', stop_at: '2023-01-01', check_at: '2023-01-01', created_at: '2023-01-01', updated_at: '2023-01-01', tzid: 123, time: 1234567890, days: 1, hours: 24, change_ip: true, change_type: true, rotate: true }
});
```

## 🔄 `changeIp`

- **Type**: `(tzid: number) => Promise<boolean>`
- **Description**: Changes the proxy IP.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_proxy_changeIp_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_proxy_changeIp_php)]
- **Parameters**:
    - **tzid**: `number` — The operation tzid.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.proxy();

getter.changeIp(123).then((result) => {
  console.log(result);
  // Output: true
});
```

## 🔄 `changeType`

- **Type**: `(tzid: number) => Promise<string>`
- **Description**: Changes the proxy type.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_proxy_changeType_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_proxy_changeType_php)]
- **Parameters**:
    - **tzid**: `number` — The operation tzid.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.proxy();

getter.changeType(123).then((result) => {
  console.log(result);
  // Output: 'socks'
});
```

## 💬 `setComment`

- **Type**: `(tzid: number, comment?: string) => Promise<boolean>`
- **Description**: Adds a comment to the proxy.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_proxy_setComment_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_proxy_setComment_php)]
- **Parameters**:
    - **tzid**: `number` — The operation tzid.
    - **comment**: `string` — Optional. The comment for the proxy. Empty string to delete the comment.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.proxy();

getter.setComment(123, 'New comment').then((result) => {
  console.log(result);
  // Output: true
});
```

# Example

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.proxy();

getter.get().then((result) => {
  console.log(result);
});

getter.state().then((result) => {
  console.log(result);
});

// or
getter.stateOne(res.tzid).then((result) => {
  console.log(result);
});
```
