# ![](https://github.com/WatchCatHQ/watchcat-assets/blob/main/watchcat_logo_tiny.png?raw=true) @watchcathq/browser

Browser SDK for [watchcat.io](https://watchcat.io).

## Installation and Usage

To install the package, use your preferred package manager:

```shell
npm install @watchcathq/browser
yarn add @watchcathq/browser
```

Alternatively, you can include the package directly on your web page:

```html
<script src="https://unpkg.com/@watchcathq/browser/dist/watchcat.js"></script>

<!-- UMD -->
<script src="https://unpkg.com/@watchcathq/browser/dist/watchcat.umd.js"></script>
```

To set up the package, import it and initialize it with your application token:

```javascript
import WatchCat from "@watchcathq/browser";

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

## Documentation

See https://watchcat.io/docs
