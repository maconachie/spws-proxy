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
    "test":"concurrently \"nodemon ./node_modules/spws-proxy\" \"jest --watch\"",
  }
}
```

## Testing with Jest

Testing SharePoint 2010 web services when using SPServices is difficult as it's not designed to with es6 modules.

To test using jest add the following code to the **jest.setup.js** (or however your just setup files are configured).

```
// Libraries
// Used for async requests
import "regenerator-runtime";

// This library exposes jQuery and SPervices to the window (uses for testing SPServices)
import "spsvcs";

// Import config
import config from "./spws.proxy.config";

// Set default webURL
window.$().SPServices.defaults.webURL = `//localhost:5050/http://mysite/sites/hr`;

// Or, set the default webURL with the config
window.$().SPServices.defaults.webURL = `//${config.host}:${config.port}/${config.baseUrl}/sites/hr`;

```


## Authentication

There are two ways to authenticate.

1. Use the **spws.proxy.config** file to store credentials (recommended).
2. Set the request headers in your web requests with the headers
   1. username
   2. password

This method is not scure and should **never** be used for production applications.

The example below shows how to set the request headers.

```javascript
xhr = new XMLHttpRequest();
xhr.open(
  "GET",
  `/sites/testing/_vti_bin/ListData.svc/UserInformationList(1)`,
  false
);
xhr.setRequestHeader("username", `john.smith`);
xhr.setRequestHeader("username", `password1`);
```


