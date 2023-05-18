# ![](https://github.com/WatchCatHQ/watchcat-assets/blob/main/watchcat_logo_tiny.png?raw=true) @watchcathq/express

Express.js plugin for [watchcat.io](https://watchcat.io).

## Installation and Usage

To install the package, use your preferred package manager:

```shell
npm install @watchcathq/express
yarn add @watchcathq/express
```

Once you have installed the package, you need to set it up by importing the package
and initializing it with your application token:

```javascript
// ESM
import WatchCat from "@watchcathq/express";

// CommonJS
const WatchCat = require("@watchcathq/express").default;

WatchCat.init({
    token: "APP_TOKEN"
})
```

Next, you need to set up the error handler. Apply it after all routers as the last middleware:

```javascript
// Your routes are here

app.use(WatchCat.errorHandler)

// Start server via app.listen
```

## Documentation

See https://watchcat.io/docs
