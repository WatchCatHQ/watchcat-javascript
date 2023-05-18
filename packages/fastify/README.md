# ![](https://github.com/WatchCatHQ/watchcat-assets/blob/main/watchcat_logo_tiny.png?raw=true) @watchcathq/fastify

Fastify plugin for [watchcat.io](https://watchcat.io).

## Installation and Usage

To install the package, use your preferred package manager:

```shell
npm install @watchcathq/fastify
yarn add @watchcathq/fastify
```

Once you have installed the package, you need to set it up by importing the package
and initializing it with your application token:

```javascript
// ESM
import WatchCat from "@watchcathq/fastify";

// CommonJS
const WatchCat = require("@watchcathq/fastify").default;

WatchCat.init({
    token: "APP_TOKEN"
})
```

Next, you need to set up the error logging:

```javascript
fastify.addHook('onError', WatchCat.onError);
```

## Documentation

See https://watchcat.io/docs
