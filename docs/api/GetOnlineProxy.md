---
outline: deep
---

# 🛠️ Methods

## 🌍 `getProxy`

- **Type**: `(id: string) => Promise<Proxy>`
- **Description**: Retrieves the proxy with the specified ID.
- **docs**: [[ru](https://onlineproxy.io/ru/documentation/api/get/proxies_id_)] [[de](https://onlineproxy.io/de/documentation/api/get/proxies_id_)] [[en](https://onlineproxy.io/documentation/api/get/proxies_id_)].
- **Parameters**:
  - **id**: `string` — The ID of the proxy.
- **Example**:

```typescript
const driver = new OnlineProxyAPI('APIKEY', 'en', 123);

driver.getProxy('proxy_id').then((result) => {
  console.log(result);
  // Output: { id: 'proxy_id', ip: '127.0.0.1', port: 8080, type: 'HTTP', country: 'USA', city: 'New York', anonymity: 'High', speed: 100, uptime: 99, lastChecked: '2023-01-01', createdAt: '2023-01-01', updatedAt: '2023-01-01', comment: 'Proxy comment' }
});
```

## 📜 `getProxyList`

- **Type**: `() => Promise<ProxyList>`
- **Description**: Retrieves the list of all available proxies.
- **docs**: [[ru](https://onlineproxy.io/ru/documentation/api/get/proxies)] [[de](https://onlineproxy.io/de/documentation/api/get/proxies)] [[en](https://onlineproxy.io/documentation/api/get/proxies)].
- **Example**:

```typescript
const driver = new OnlineProxyAPI('APIKEY', 'en', 123);

driver.getProxyList().then((result) => {
  console.log(result);
  // Output: { proxies: [{ id: 'proxy_id', ip: '127.0.0.1', port: 8080, type: 'HTTP', country: 'USA', city: 'New York', anonymity: 'High', speed: 100, uptime: 99, lastChecked: '2023-01-01', createdAt: '2023-01-01', updatedAt: '2023-01-01', comment: 'Proxy comment' }] }
});
```

## 🔄 `rotateProxy`

- **Type**: `(token: string) => Promise<RotateResult>`
- **Description**: Rotates the IP address of the proxy.
- **docs**: [[ru](https://onlineproxy.io/ru/documentation/api/get/rotate)] [[de](https://onlineproxy.io/de/documentation/api/get/rotate)] [[en](https://onlineproxy.io/documentation/api/get/rotate)].
- **Example**:

```typescript
const driver = new OnlineProxyAPI('APIKEY', 'en', 123);

driver.rotateProxy(token).then((result) => {
  console.log(result);
  // Output: { success: true, newIp: '127.0.0.2' }
});
```

## 💬 `createOrUpdateProxyComment`

- **Type**: `(id: string, comment: string) => Promise<CommentResult>`
- **Description**: Creates or updates the comment for a specific proxy.
- **docs**: [[ru](https://onlineproxy.io/ru/documentation/api/post/proxies_id__comment)] [[de](https://onlineproxy.io/de/documentation/api/post/proxies_id__comment)] [[en](https://onlineproxy.io/documentation/api/post/proxies_id__comment)].
- **Parameters**:
  - **id**: `string` — The ID of the proxy.
  - **comment**: `string` — The comment to create or update.
- **Example**:

```typescript
const driver = new OnlineProxyAPI('APIKEY', 'en', 123);

driver.createOrUpdateProxyComment('proxy_id', 'New comment').then((result) => {
  console.log(result);
  // Output: { success: true, message: 'Comment updated' }
});
```

## 📋 `getAvailableProxiesForOrder`

- **Type**: `() => Promise<AvailableProxies>`
- **Description**: Retrieves the list of proxies available for order, matching the input filtering criteria.
- **docs**: [[ru](https://onlineproxy.io/ru/documentation/api/get/filters)] [[de](https://onlineproxy.io/de/documentation/api/get/filters)] [[en](https://onlineproxy.io/documentation/api/get/filters)].
- **Example**:

```typescript
const driver = new OnlineProxyAPI('APIKEY', 'en', 123);

driver.getAvailableProxiesForOrder().then((result) => {
  console.log(result);
  // Output: { proxies: [{ id: 'proxy_id', ip: '127.0.0.1', port: 8080, type: 'HTTP', country: 'USA', city: 'New York', anonymity: 'High', speed: 100, uptime: 99, lastChecked: '2023-01-01', createdAt: '2023-01-01', updatedAt: '2023-01-01', comment: 'Proxy comment' }] }
});
```

## 🛒 `orderProxy`

- **Type**: `(orderData: any) => Promise<OrderResult>`
- **Description**: Orders a proxy.
- **docs**: [[ru](https://onlineproxy.io/ru/documentation/api/post/order)] [[de](https://onlineproxy.io/de/documentation/api/post/order)] [[en](https://onlineproxy.io/documentation/api/post/order)].
- **Parameters**:
  - **orderData**: `any` — The data required to place an order.
- **Example**:

```typescript
const driver = new OnlineProxyAPI('APIKEY', 'en', 123);

const orderData = { proxyId: 'proxy_id', quantity: 1 };
driver.orderProxy(orderData).then((result) => {
  console.log(result);
  // Output: { success: true, orderId: 'order123' }
});
```

## 📊 `getProxyTariffs`

- **Type**: `() => Promise<Tariffs>`
- **docs**: [[ru](https://onlineproxy.io/ru/documentation/api/get/tariffs)] [[de](https://onlineproxy.io/de/documentation/api/get/tariffs)] [[en](https://onlineproxy.io/documentation/api/get/tariffs)].
- **Description**: Retrieves the available periods and the minimum order price of proxies, matching the input filtering criteria.
- **Example**:

```typescript
const driver = new OnlineProxyAPI('APIKEY', 'en', 123);

driver.getProxyTariffs().then((result) => {
  console.log(result);
  // Output: { tariffs: [{ period: '1 month', price: 10 }] }
});
```

## 💰 `getUserBalance`

- **Type**: `() => Promise<UserBalance>`
- **Description**: Retrieves the user balance.
- **docs**: [[ru](https://onlineproxy.io/ru/documentation/api/get/balance)] [[de](https://onlineproxy.io/documentation/api/get/balance)] [[en](https://onlineproxy.io/documentation/api/get/balance)].
- **Example**:

```typescript
const driver = new OnlineProxyAPI('APIKEY', 'en', 123);

driver.getUserBalance().then((result) => {
  console.log(result);
  // Output: { balance: 100 }
});
```

# Example

```typescript
const driver = new OnlineProxyAPI('APIKEY', 'en', 123);

driver.getProxy('proxy_id').then((proxy) => {
  console.log('Proxy:', proxy);
});

driver.getUserBalance().then((balance) => {
  console.log('Balance:', balance);
});
```
