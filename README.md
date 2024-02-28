<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/icon-white.png">
    <source media="(prefers-color-scheme: light)" srcset="./assets/icon-black.png">
    <img alt="Lagoss logo" height="60px" src="./assets/logo-white.png">
  </picture>
  <p align="center">
    Deploy Serverless Functions at the Edge
    <br />
    <br />
    <a href="https://github.com/lagossapp/lagoss/actions/workflows/wpt.yml" alt="web-platform-tests"><img src="https://wpt.lagoss.com" /></a>
  </p>
</p>

<hr />

![Dashboard](./assets/dashboard.png)

## About

Lagoss is a fork of [Lagon](https://github.com/lagonapp/lagon) an open-source runtime and platform that allows developers to run TypeScript and JavaScript Serverless Functions.

> [!NOTE]
> The project was forked from [Lagon](https://github.com/lagonapp/lagon) with the
> intention to continue development. There is currently a public testing instance
> deployed at <https://app.lagoss.com>. However it should be only used for basic
> testing and data might be deleted at any point. If you want a proper setup,
> please deploy your own instance => [Install my own instance](https://docs.lagoss.com).

## Packages

- **[cli](./crates/cli)** CLI to manage Functions
- **[dashboard](./packages/dashboard)** Dashboard and API
- **[docs](./packages/docs)** Documentation website
- **[js-runtime](./packages/js-runtime)** JavaScript code for the Runtime, containing the Web APIs
- **[runtime](./crates/runtime)** Rust JavaScript Runtime, using V8 Isolates
- **[serverless](./crates/serverless)** HTTP entrypoint for Functions, using the Runtime and exporting metrics
- **[ui](./packages/ui)** Design system
- **[wpt-runner](./crates/wpt-runner)** Run web-platform-tests on Lagoss

## Features

- JavaScript Runtime written in Rust using V8 Isolates
- Native Web APIs like `Request`, `Response`...
- 100% open-source
- Deploy APIs, SSR(ed) websites, Webhooks endpoints, Cron jobs...
- CLI to manage Functions and develop locally
- Deploy at the Edge using the Cloud version, or self-host it

## Contributing

[See the contributing guide](https://docs.lagoss.com/contributing)

## How it works

Lagoss uses V8 Isolates, which are sandboxed environments used to run plain JavaScript. That means each Function's memory is isolated from each others, and you can run a lot of them at the same time with very few resources. [Node.js](https://nodejs.org/), [Electron](https://www.electronjs.org/), [Deno](https://deno.land/) (and [Deno Deploy](https://deno.com/deploy)), [Cloudflare Workers](https://workers.cloudflare.com/) are also using V8 Isolates to execute JavaScript.

Starting an Isolate is a lot faster than starting a whole Node.js process, which allows for almost free cold starts.

## Installation

Learn how you can [install](https://docs.lagoss.com) your own Lagoss instance.

## License

[GNU AGPLv3](./LICENSE)