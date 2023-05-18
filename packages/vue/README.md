# ![](https://github.com/WatchCatHQ/watchcat-assets/blob/main/watchcat_logo_tiny.png?raw=true) @watchcathq/vue

Vue SDK for [watchcat.io](https://watchcat.io).

## Installation and Usage

To install the package, use your preferred package manager:

```shell
npm install @watchcathq/vue
yarn add @watchcathq/vue
```

## Basic usage

To set up the package, import it and initialize it with your application token:

```javascript
import WatchCat from "@watchcathq/vue";

WatchCat.init({
    token: "APP_TOKEN"
})
```

## Error Handler

Assign a global handler for uncaught errors propagating from within the application:

```javascript
// app init

app.config.errorHandler = WatchCat.errorHandler

// app mount
```

## Logging

Use the following methods to log warnings, errors, and exceptions:

```javascript
WatchCat.warn('warning message');
WatchCat.error('error message');
WatchCat.exception(new Error('exception message'));
```

You can also add custom, application-related information:

```javascript
WatchCat
    .withApplication({
        userId: 1234
    })
    .error('error message');
```

## Source Maps

To translate a stack trace from bundled code to its original position and obtain meaningful information, you need to provide source maps (see https://web.dev/source-maps/).

First, ensure that source maps are generated during the build phase. In your build directory, there should be a file ending with `.map`.
For example, for a Vue build, the output looks like this:

```shell
main.c1411ba0.js
main.c1411ba0.js.map
```

If you don't see such files, please refer to your build tool's documentation.

### Uploading source maps

The easiest way is to install the WatchCat CLI tool:

```shell
npm install @watchcathq/cli --save-dev
```

This tool will recursively search for maps in the specified directory and upload them for a given application, determined by the provided token. The token can be found in the application details at https://app.watchcat.io/applications.

```
watchcat sourcemap [app_token] [directory]
```

Once the source maps are uploaded, you should see a stack trace leading to the original source, and you can quickly identify where the issue lies.

#### Example

```shell
watchcat sourcemap app_12345 build/
```

In the example above, `app_12345` is the application token, and `build/` is the directory where the command will recursively search for source maps to upload.

## Documentation

See https://watchcat.io/docs
