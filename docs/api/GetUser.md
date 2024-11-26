---
outline: deep
---

# 🛠️ Methods

## 💰 `balance`

- **Type**: `() => Promise<{ balance: number, zbalance: number, income: number }>`
- **Description**: Retrieves the user's balance and income.
- **docs**: [[ru](https://onlinesim.io/ru/openapi_docs/onlinesim-api-un/get/api_getBalance_php)] [[en](https://onlinesim.io/openapi_docs/onlinesim-api-un/get/api_getBalance_php)]
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.user();

getter.balance().then((result) => {
  console.log(result);
  // Output: { balance: 100, zbalance: 50, income: 150 }
});
```

## 👤 `profile`

- **Type**: `() => Promise<User>`
- **Description**: Retrieves the user's profile.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.user();

getter.profile().then((result) => {
  console.log(result);
  // Output: { id: 1, name: 'John Doe', username: 'johndoe', email: 'john@example.com', apikey: 'apikey123', api_access: true, locale: 'en', number_region: 1, number_country: 7, number_reject: null, ugroup: 1, verify: 1, block: 0, payment: { payment: 100, income: 150, spent: 50, now: 200 } }
});
```

## 📜 `getPaymentHistory`

- **Type**: `() => Promise<PayList>`
- **Description**: Retrieves the user's payment history.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.user();

getter.getPaymentHistory().then((result) => {
  console.log(result);
  // Output: { forms: { 1: 'Credit Card' }, currency: { RUB: 1, USD: 0.013 }, orders: { current_page: 1, first_page_url: '...', from: 1, last_page: 1, last_page_url: '...', data: { 1: { id: 1, id_user: 1, stat: 1, sum: '100', cashback: 0, form: 1, id_sale: null, promo: null, original_sum: 100, currency: 'RUB', pay_at: '2023-01-01', created_at: '2023-01-01', updated_at: '2023-01-01' } } }, paylist: { 1: { list_id: 1, enable: true, id: 1, name: 'Credit Card', title: 'Credit Card', image: '...', invert: false, add: {}, coofPersent: 0, curr: { RUB: true, USD: false, CNY: false, EUR: false, cryptocurrency: false }, links_method: '...', links: [{ sum: 100, id: '1', classes: '...' }] } } }
});
```

## 🛠️ `createEmpty`

- **Type**: `(params: {[key:string]: any}) => Promise<Pay>`
- **Description**: Creates an empty payment.
- **Parameters**:
    - **params**: `{[key:string]: any}` — The parameters for the payment.
- **Example**:

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.user();

const params = { sum: '100', comment: 'Test payment' };
getter.createEmpty(params).then((result) => {
  console.log(result);
  // Output: { payId: 1, params: { url: 'http://example.com', label: 'Payment', sum: '100', comment: 'Test payment', newtab: true, noreferrer: true } }
});
```

# Example

```typescript
const driver = new OnlineSimDriver('APIKEY');
const getter = driver.user();

getter.balance().then((result) => {
  console.log(result);
});
```
