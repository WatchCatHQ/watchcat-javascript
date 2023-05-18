# ![](https://github.com/WatchCatHQ/watchcat-assets/blob/main/watchcat_logo_tiny.png?raw=true) @watchcathq/node

This is the Node.js SDK for [watchcat.io](https://watchcat.io).

## Installation and Usage

To install the package, use your preferred package manager:

```shell
npm install @watchcathq/node
yarn add @watchcathq/node
```

To set up the package, import it and initialize it with your application token:

```javascript
// ESM
import WatchCat from "@watchcathq/node";

// CommonJS
const WatchCat = require("@watchcathq/node").default;

WatchCat.init({
    token: "APP_TOKEN"
})
```

Once installed and set up, all unhandled exceptions will be automatically reported.
You can also manually send logs and exceptions using the following methods:

```javascript

WatchCat.warn('Warning message!')
WatchCat.error('Error message!')

try {
    const res = yourService.call(data)
} catch (e) {
    WatchCat.exception(e)
}
```

You can also add custom, application-related information:

```javascript
WatchCat
    .withMeta({
        userId: 1234
    })
    .error('error message');
```

Alternatively, you can set default metadata when initializing:

```javascript
WatchCat.init({
    token: "APP_TOKEN",
    meta: {
        version: "1.0.0"
    }
})
```

## Setting up monitors

To set up uptime monitoring for one or more urls, use the `monitors` property and specify the following options:
- `url` (required) - the URL to monitor
- `httpCodes` (optional) - the HTTP codes to validate, same format as in UI, e.g. "200-204,304"
- `phrase` (optional) - a phrase to check for on the page
- `imterval` (optional) - test interval, default is 30s (other valid options are 1m, 5m, 30m, 1h)

__Note__: Monitors will be synchronized at the application start.

Here's an example of how to set up monitor:

```javascript
WatchCat.init({
    token: "APP_TOKEN",
    monitors: [
        { url: "https://watchcat.io", httpCodes: "200-201", phrase: "watchcat", interval: "30s"}
    ]
})
```

Specified monitors that do not exist will be created. If you remove a monitor, it will not be deleted automatically;
you will have to delete it manually in the UI.

If you want to also delete monitors that you have removed from the code, use the `fullMonitorSync` parameter:

```javascript
WatchCat.init({
    //...
    fullMonitorSync: true
})
```


## Documentation

See https://watchcat.io/docs
