# spws-proxy

A SharePoint 2010 Web Service Proxy Server that uses NTLM authentication.


## Installation

```bash
$ npm i spws-proxy
$ npm i -g nodemon
```

## Getting Started

Create a **spws.proxy.config.js** file in the root of your directory.

It is **strongly** recommended that you use environment variables or add *spws.proxy.config.js* .gitignore.

```javascript
const config = {
  // The base URL of your SharePoint site
  baseUrl: "http://contoso/",
  // Windows username
  username: "john.smith",
  // Windows password
  password: "password1",
  // SharePoint Domain
  domain: "xyz",
  // Host
  host: "localhost",
  // Port
  port: 3050,
    // Object containing logging options
  logging: {
    // If true, responses from SharePoint will be logged in the console
    responses: true,
  },
};

module.exports = config;
```

## How to run commands

Run directly from the command line.

```bash
$ nodemon ./node_modules/spws-proxy
```

You may find it easier to add the swps-proxy command to the scripts object in your package.json file and call it from an npm run script.

```json
{
  "scripts": {
    "spws-proxy": "nodemon ./node_modules/spws-proxy"
  }
}
```

The proxy may only need to ran for specific reasons such as testing. In the example below a npm package named **['concurrently'](https://www.npmjs.com/package/concurrently)** is used to run the proxy and jest at the same time.

```json
{
  "scripts": {
    "test":" concurrently \"nodemon ./node_modules/spws-proxy\" \"jest --watch\"",
  }
}
```

