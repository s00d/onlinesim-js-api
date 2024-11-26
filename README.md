# Onlinesim JS API

[![npm version](https://badge.fury.io/js/onlinesim-js-api.svg)](https://badge.fury.io/js/onlinesim-js-api)

Wrapper for automatic reception of SMS-messages by [onlinesim.io](https://onlinesim.io) and managing proxies from [onlineproxy.io](https://onlineproxy.io) for Node.js and Vanilla JS.

## 🌟 Features

- 📱 **SMS Reception**: Automatically receive SMS messages for various services using onlinesim.io.
- 🌐 **Proxy Management**: Manage and use proxies from onlineproxy.io for enhanced privacy and security.
- 🔒 **Full Typescript Support**: Enjoy full Typescript support for type-safe development.
- 🛠️ **Easy Integration**: Seamlessly integrate with your Node.js or Vanilla JS projects.
- 📚 **Comprehensive Documentation**: Detailed documentation and examples to help you get started quickly.
- 🐞 **Bug Reporting**: Easily report and track bugs through GitHub Issues.

## ✨ Introduction

`Onlinesim JS API` is a powerful and easy-to-use wrapper designed to simplify the process of integrating SMS and proxy services into your Node.js or Vanilla JS projects. With full Typescript support, you can enjoy type-safe development and efficient coding.

## ⚙️ Quick Setup

Install the package in your project with:

### Using npm:
```bash
npm install onlinesim-js-api
```

### Using pnpm:
```bash
pnpm install onlinesim-js-api
```

### Using yarn:
```bash
yarn add onlinesim-js-api
```

Then, integrate it into your project:

```js
import OnlineSimDriver from "onlinesim-js-api";

const apikey = 'your_apikey_here';
const driver = new OnlineSimDriver(apikey);

// Example usage for SMS reception
driver.numbers().get('service_name').then((result) => {
  console.log(result);
});

// Example usage for proxy management
driver.onlineProxy().getProxyList().then((result) => {
  console.log(result);
});
```

## 🗂 Documentation

For detailed documentation and examples, please visit the **[Documentation](https://s00d.github.io/onlinesim-js-api/)**.

## 🐞 Bugs

If you encounter any issues or have suggestions for improvements, please create an issue [here](https://github.com/s00d/onlinesim-js-api/issues).

## 🌐 OnlineProxy.io Integration

The `Onlinesim JS API` also includes support for managing proxies from [onlineproxy.io](https://onlineproxy.io). This allows you to enhance your privacy and security by using high-quality proxies for your applications.

### Example Usage

```js
import OnlineSimDriver from "onlinesim-js-api";

const apikey = 'your_apikey_here';
const driver = new OnlineSimDriver(apikey);

// Example usage for proxy management
driver.onlineProxy().getProxyList().then((result) => {
  console.log(result);
});
```

## 📚 Additional Resources

- **[onlinesim.io](https://onlinesim.io)**: Official website for SMS-message services.
- **[onlineproxy.io](https://onlineproxy.io)**: Official website for proxy services.
- **[GitHub Repository](https://github.com/s00d/onlinesim-js-api)**: Source code and issue tracking.
