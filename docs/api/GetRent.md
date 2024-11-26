---
outline: deep
---

# 🛠️ Methods

## 📱 `get`

- **Type**: `(country?: number, days?: number, extension?: boolean) => Promise<Get>`
- **Description**: Retrieves a new rent number.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_rent_getRentNum_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_rent_getRentNum_php)]
- **Parameters**:
    - **country**: `number` — Optional. The country code. Default is 7.
    - **days**: `number` — Optional. The number of rent days. Default is 1.
    - **extension**: `boolean` — Optional. Auto extension flag. Default is false.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.rent();

getter.get(7, 1, false).then((result) => {
  console.log(result);
  // Output: { tzid: 1, status: 1, messages: [], country: 7, rent: 1, extension: 0, sum: 10, number: '1234567890', time: 1234567890, hours: 24, extend: [], checked: false, reload: 0, day_extend: 0 }
});
```

## 📜 `state`

- **Type**: `() => Promise<Array<Get>>`
- **Description**: Retrieves the list of rent numbers.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_rent_getRentState_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_rent_getRentState_php)]
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.rent();

getter.state().then((result) => {
  console.log(result);
  // Output: [{ tzid: 1, status: 1, messages: [], country: 7, rent: 1, extension: 0, sum: 10, number: '1234567890', time: 1234567890, hours: 24, extend: [], checked: false, reload: 0, day_extend: 0 }]
});
```

## 📜 `stateOne`

- **Type**: `(tzid: number) => Promise<Get>`
- **Description**: Retrieves the selected rent number.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_rent_getRentState_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_rent_getRentState_php)]
- **Parameters**:
    - **tzid**: `number` — The operation tzid.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.rent();

getter.stateOne(1).then((result) => {
  console.log(result);
  // Output: { tzid: 1, status: 1, messages: [], country: 7, rent: 1, extension: 0, sum: 10, number: '1234567890', time: 1234567890, hours: 24, extend: [], checked: false, reload: 0, day_extend: 0 }
});
```

## 🔄 `extend`

- **Type**: `(tzid: number, days?: number) => Promise<Get>`
- **Description**: Extends the user number.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_rent_extendRentState_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_rent_extendRentState_php)]
- **Parameters**:
    - **tzid**: `number` — The operation tzid.
    - **days**: `number` — Optional. The number of days to extend. Default is 1.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.rent();

getter.extend(1, 1).then((result) => {
  console.log(result);
  // Output: { tzid: 1, status: 1, messages: [], country: 7, rent: 1, extension: 0, sum: 10, number: '1234567890', time: 1234567890, hours: 24, extend: [], checked: false, reload: 0, day_extend: 0 }
});
```


## 📊 `tariffs`

- **Type**: `() => Promise<{ [code: string]: Tariff }>`
- **Description**: Retrieves the rent tariffs.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_rent_tariffsRent_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_rent_tariffsRent_php)]
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.rent();

getter.tariffs().then((result) => {
  console.log(result);
  // Output: { code1: { code: 1, enabled: true, name: 'USA', new: false, position: 1, count: { count1: 10 }, days: { days1: 1 }, extend: 1 } }
});
```

## 📊 `tariffsOne`

- **Type**: `(country?: number) => Promise<Tariff>`
- **Description**: Retrieves the tariff for a specific country.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_rent_tariffsRent_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_rent_tariffsRent_php)]
- **Parameters**:
    - **country**: `number` — Optional. The country code. Default is 7.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.rent();

getter.tariffsOne(1).then((result) => {
  console.log(result);
  // Output: { code: 1, enabled: true, name: 'USA', new: false, position: 1, count: { count1: 10 }, days: { days1: 1 }, extend: 1 }
});
```

## 🔒 `close`

- **Type**: `(tzid: number) => Promise<boolean>`
- **Description**: Closes the selected number.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_rent_closeRentNum_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_rent_closeRentNum_php)]
- **Parameters**:
    - **tzid**: `number` — The operation tzid.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.rent();

getter.close(1).then((result) => {
  console.log(result);
  // Output: true
});
```

# Example

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.rent();

getter.tariffs().then((result) => {
  console.log(result);
});

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

getter.close(res.tzid).then((result) => {
  console.log(result);
});
```

# Diagram

![Diagram](/GetRent.png "Workflow Diagram")
