# ![](https://github.com/WatchCatHQ/watchcat-assets/blob/main/watchcat_logo_tiny.png?raw=true) @watchcathq/javascript

Monorepo with all Javascript SDKs for [watchcat.io](https://watchcat.io).

## SDKs

### Frontend/browser

- `@watchcathq/browser` - [packages/browser/README.md](packages/browser/README.md)
- `@watchcathq/react` - [packages/react/README.md](packages/react/README.md)
- `@watchcathq/vue` - [packages/vue/README.md](packages/vue/README.md)

### Backend/server

- `@watchcathq/node` - [packages/node/README.md](packages/node/README.md)
- `@watchcathq/express` - [packages/express/README.md](packages/express/README.md)
- `@watchcathq/fastify` - [packages/fastify/README.md](packages/fastify/README.md)

## Development

[Lerna](https://lerna.js.org/) is used for managing the repository.

### Init

```shell
lerna bootstrap
```

Init single package
```shell
lerna bootstrap --scope="@watchcathq/node"
```

### Build and publish

```shell
lerna build
lerna publish
```

If something goes wrong and you need republish same content:

```shell
lerna publish --loglevel=verbose --force-publish
```