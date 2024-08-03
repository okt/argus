## What is Argus?

## Getting Started
```sh
git clone git@github.com:okt/argus.git
cd argus
bun install
```

Serve `index.ts` with hot reloading enabled
```sh
bun run dev
```

Build the `dist/client.js` from `client.ts`
```sh
bun run build
```

Run the built `dist/client.js`
```sh
bun run client
```

Remove the `stats.db` database and the built `dist/client.js`
```sh
bun run clean
```
## API

### GET /
html list of `/api/stats`
### GET /api/stats
json list of `/api/stats`
### POST /api/stats
```js
{
  hostname: String,
  memory: String, // Memory % usage
  uptime: String // Full uptime text
}
```