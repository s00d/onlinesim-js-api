---
outline: deep
---

# 🛠️ Methods

## 💰 `price`

- **Type**: `(service: string, country?: number) => Promise<string>`
- **Description**: Retrieves the price for a specific service in a given country.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/Onlinesim-API-UN/info#getprice)] [[en](https://onlinesim.io/openapi_docs/Onlinesim-API-UN/info#getprice)]
- **Parameters**:
    - **service**: `string` — The service identifier.
    - **country**: `number` — Optional. The country code. Default is 7.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.price('service1', 7).then((result) => {
  console.log(result);
  // Output: "10" (assuming the price is 10)
});
```

## 📱 `get`

- **Type**: `(service: string, country?: number, reject?: Array<number>, extension?: boolean) => Promise<number>`
- **Description**: Retrieves a new number for a specific service.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/Onlinesim-API-UN/info#getnum)] [[en](https://onlinesim.io/openapi_docs/Onlinesim-API-UN/info#getnum)]
- **Parameters**:
    - **service**: `string` — The service identifier.
    - **country**: `number` — Optional. The country code. Default is 7.
    - **reject**: `Array<number>` — Optional. Exclusion list.
    - **extension**: `boolean` — Optional. Extension flag. Default is false.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.get('service1', 7, [1, 2], false).then((result) => {
  console.log(result);
  // Output: 123 (assuming the tzid is 123)
});
```

## 📱 `getWithNumber`

- **Type**: `(service: string, country?: number, reject?: Array<number>, extension?: boolean) => Promise<{tzid: number, number: string, country: number}>`
- **Description**: Retrieves a new number for a specific service and returns the tzid, number, and country.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/Onlinesim-API-UN/info#getnum)] [[en](https://onlinesim.io/openapi_docs/Onlinesim-API-UN/info#getnum)]
- **Parameters**:
    - **service**: `string` — The service identifier.
    - **country**: `number` — Optional. The country code. Default is 7.
    - **reject**: `Array<number>` — Optional. Exclusion list.
    - **extension**: `boolean` — Optional. Extension flag. Default is false.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.getWithNumber('service1', 7, [1, 2], false).then((result) => {
  console.log(result);
  // Output: { tzid: 123, number: '1234567890', country: 7 }
});
```

## 📜 `state`

- **Type**: `(message_to_code?: number, orderby?: 'ASC' | 'DESC', msg_list?: boolean, clean?: boolean, repeat?: boolean) => Promise<Array<StateOne>>`
- **Description**: Retrieves the list of numbers for a specific service.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/Onlinesim-API-UN/info#getstate)] [[en](https://onlinesim.io/openapi_docs/Onlinesim-API-UN/info#getstate)]
- **Parameters**:
    - **message_to_code**: `number` — Optional. 1 - show code, 0 - show full message. Default is 1.
    - **orderby**: `'ASC' | 'DESC'` — Optional. Sort order. Default is 'ASC'.
    - **msg_list**: `boolean` — Optional. Show all messages or one message. Default is true.
    - **clean**: `boolean` — Optional. Display messages in a circle. Default is true.
    - **repeat**: `boolean` — Optional. Repeat flag. Default is false.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.state(1, 'ASC', true, true, false).then((result) => {
  console.log(result);
  // Output: [{ tzid: 1, response: 'ok', number: 1234567890, service: 'service1', time: 1234567890, msg: 'message', extend: 1, country: 7 }]
});
```

## 📜 `stateOne`

- **Type**: `(tzid: number, message_to_code?: number, msg_list?: boolean, clean?: boolean, repeat?: boolean) => Promise<StateOne>`
- **Description**: Retrieves the selected number for a specific service.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/Onlinesim-API-UN/info#getstate)] [[en](https://onlinesim.io/openapi_docs/Onlinesim-API-UN/info#getstate)]
- **Parameters**:
    - **tzid**: `number` — The operation id.
    - **message_to_code**: `number` — Optional. 1 - show code, 0 - show full message. Default is 1.
    - **msg_list**: `boolean` — Optional. Show all messages or one message. Default is true.
    - **clean**: `boolean` — Optional. Display messages in a circle. Default is true.
    - **repeat**: `boolean` — Optional. Repeat flag. Default is false.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.stateOne(123, 1, true, true, false).then((result) => {
  console.log(result);
  // Output: { tzid: 123, response: 'ok', number: 1234567890, service: 'service1', time: 1234567890, msg: 'message', extend: 1, country: 7 }
});
```

## ⏭️ `next`

- **Type**: `(tzid: number) => Promise<boolean>`
- **Description**: Selects the next message.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_setOperationRevise_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_setOperationRevise_php)]
- **Parameters**:
    - **tzid**: `number` — The operation id.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.next(123).then((result) => {
  console.log(result);
  // Output: true
});
```

## 🔒 `close`

- **Type**: `(tzid: number) => Promise<boolean>`
- **Description**: Closes the selected number for a specific service.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_setOperationOk_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_setOperationOk_php)]
- **Parameters**:
    - **tzid**: `number` — The operation id.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.close(123).then((result) => {
  console.log(result);
  // Output: true
});
```

## 🚫 `ban`

- **Type**: `(tzid: number) => Promise<boolean>`
- **Description**: Bans the selected number for a specific service.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_setOperationOk_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_setOperationOk_php)]
- **Parameters**:
    - **tzid**: `number` — The operation id.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.ban(123).then((result) => {
  console.log(result);
  // Output: true
});
```

## 📊 `tariffs`

- **Type**: `() => Promise<{[country: string]: TariffCountryOne }>`
- **Description**: Retrieves the list of tariffs for numbers for a specific service.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_getNumbersStats_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_getNumbersStats_php)]
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.tariffs().then((result) => {
  console.log(result);
  // Output: { country1: { name: 'USA', code: 1, new: false, enabled: true, services: { service1: { count: 10, popular: true, price: 10, id: '1', service: 'service1', slug: 'service1' } } } }
});
```

## 📊 `tariffsOne`

- **Type**: `(country?: number) => Promise<TariffCountryOne>`
- **Description**: Retrieves the tariff for a specific country.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_getNumbersStats_php)] [[en](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_getNumbersStats_php)]
- **Parameters**:
    - **country**: `number` — Optional. The country code. Default is 7.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.tariffsOne(1).then((result) => {
  console.log(result);
  // Output: { name: 'USA', code: 1, new: false, enabled: true, services: { service1: { count: 10, popular: true, price: 10, id: '1', service: 'service1', slug: 'service1' } } }
});
```

## 📜 `service`

- **Type**: `() => Promise<Array<string>>`
- **Description**: Retrieves the list of available services.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.service().then((result) => {
  console.log(result);
  // Output: ['service1', 'service2']
});
```

## 📜 `serviceNumber`

- **Type**: `(service: string) => Promise<Array<string>>`
- **Description**: Retrieves the list of available numbers for a specific service.
- **Parameters**:
    - **service**: `string` — The service identifier.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.serviceNumber('service1').then((result) => {
  console.log(result);
  // Output: ['1234567890', '0987654321']
});
```

## 🕒 `wait_code`

- **Type**: `(tzid: number, timeout?: number, callback?: callbackType, not_end?: boolean, full_message?: boolean) => Promise<string>`
- **Description**: Waits for the code and returns it.
- **Parameters**:
    - **tzid**: `number` — The operation id.
    - **timeout**: `number` — Optional. Timeout in seconds. Default is 10.
    - **callback**: `callbackType` — Optional. Callback function.
    - **not_end**: `boolean` — Optional. Flag to indicate if the operation should not end. Default is false.
    - **full_message**: `boolean` — Optional. Flag to indicate if the full message should be returned. Default is false.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.wait_code(123, 10, (code) => {
  console.log(code);
}, false, false).then((result) => {
  console.log(result);
  // Output: '123456'
});
```

# Example

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.numbers();

getter.tariffs().then((result) => {
  console.log(result);
});

getter.get('3223').then((result) => {
  console.log(result);
});

getter.state().then((result) => {
  console.log(result);
});

// or
getter.stateOne(res.tzid).then((result) => {
  console.log(result);
});

// next message
getter.next(res.tzid).then((result) => {
  console.log(result);
});

getter.state().then((result) => {
  console.log(result);
});

getter.close(res.tzid).then((result) => {
  console.log(result);
});
```

# Diagram

![Diagram](/GetNumber.png "Workflow Diagram")
