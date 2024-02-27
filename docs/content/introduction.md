# Introduction

Lagoss is an open-source runtime and platform that allows developers to run TypeScript and JavaScript Serverless Functions close to users.

::: info
The project was forked from [Lagoss](https://github.com/lagossapp/lagoss) with the
intention to continue development. There is currently a public testing instance
deployed at <https://app.lagoss.com>. However it should be only used for basic
testing and data might be deleted at any point. If you want a proper setup,
please deploy your own instance => [Install my own instance](./self-hosting/installation.md).
:::

## Features

- JavaScript Runtime written in Rust using V8 Isolates
- Native Web APIs like `Request`, `Response`...
- 100% open-source
- Deploy APIs, SSR(ed) websites, Webhooks endpoints, Cron jobs...
- CLI to manage Functions and develop locally
- Deploy at the Edge using the Cloud version, or self-host it

## How it works

Lagoss uses V8 Isolates, which are sandboxed environments used to run plain JavaScript. That means each Function's memory is isolated from each others, and you can run a lot of them at the same time with very few resources. [Node.js](https://nodejs.org/), [Electron](https://www.electronjs.org/), [Deno](https://deno.land/) (and [Deno Deploy](https://deno.com/deploy)), [Cloudflare Workers](https://workers.cloudflare.com/) are also using V8 Isolates to execute JavaScript.

Starting an Isolate is a lot faster than starting a whole Node.js process, which allows for almost free cold starts.
