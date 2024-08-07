# Runtime APIs

The following APIs are the same as the native Web APIS you already know. We also follow the [WinterCG](https://wintercg.org/) conventions. Lagoss's Runtime uses the V8 engine and is written in both Rust and TypeScript.

## Handler

The only required code to make your Function runnable is to export a `handler` function, that accepts a [`Request`](#request) and returns a [`Response`](#response) (or a promise returning a Response):

```typescript
export function handler(request: Request) {
  return new Response('Hello World!');
}
```

Starting from this simple code, you can do whatever you wish, using the Web APIs you already know.

## Additional Headers

The `Request` object coming from the `handler` function also contains additional headers:

- `X-Lagoss-Region`: the [region](./usage/regions.md) where this Function is executing
- `X-Forwarded-For`: the IP address of the client that made the request

You can access them the same as any other header:

```typescript {2-3}
export function handler(request: Request) {
  const region = request.headers.get('x-lagoss-region');
  const ip = request.headers.get('x-forwarded-for');

  return new Response(`Region: ${region}, User IP: ${ip}`);
}
```

The `X-Lagoss-Region` header is also automatically added to each response, making it easy to identify which Region served the request.

::: info
When developing locally using [`lagoss dev`](./cli.md#lagoss-dev), the `X-Lagoss-Region` header will be set to `local`.
:::

## NPM support

Lagoss's Runtime supports any NPM package. The only requirement is that the package must not use Node.js-specific APIs (e.g `Buffer`, `fs`, `path`, etc.). This is because Lagoss's Runtime **is not Node.js**, but a browser-like environment.

## Global objects

### `AbortController`

The standard `AbortController` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

### `AbortSignal`

The standard `AbortSignal` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).

### `AsyncContext`

An early implementation of the [Async Context proposal](https://github.com/tc39/proposal-async-context). You shouldn't use this API yet, as it is still experimental and subject to change.

### `AsyncLocalStorage`

A minimal implementation of [Node.js's AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage). The following methods are supported:

- `getStore()`
- `run(store, callback, ...args)`

### `Blob`

The standard `Blob` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

### Compression Stream APIs

Lagoss supports all three compression formats: `gzip`, `deflate` and `deflate-raw`.

#### `CompressionStream`

The standard `CompressionStream` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream).

#### `DecompressionStream`

The standard `DecompressionStream` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream).

### `console`

Similar to the standard `console` object on the browser and Node.js, except that it only supports the following methods:

- `log`
- `info`
- `debug`
- `warn`
- `error`

You can log multiple objects, and use string substitution. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/console#outputting_text_to_the_console). See the [Logs](./usage/logs.md) documentation to learn more.

### `crypto`

The standard `crypto` object.

#### `crypto.randomUUID()`

The standard `randomUUID()` method. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID).

#### `crypto.getRandomValues()`

The standard `getRandomValues()` method. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues).

#### `crypto.subtle`

The standard `CryptoSubtle` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto).

::: info

The following table summarizes the supported algorithms on each method:

|                   | `sign()`, `verify()` | `encrypt()`, `decrypt()` | `digest()` | `deriveBits()`, `deriveKey()` | `wrapKey()`, `unwrapKey()` |
| ----------------- | -------------------- | ------------------------ | ---------- | ----------------------------- | -------------------------- |
| RSASSA-PKCS1-v1_5 | ✅                   |                          |            |                               |                            |
| RSA-PSS           | ✅                   |                          |            |                               |                            |
| ECDSA             | ✅                   |                          |            |                               |                            |
| HMAC              | ✅                   |                          |            |                               |                            |
| RSA-OAEP          |                      | ✅                       |            |                               | ✅                         |
| AES-CTR           |                      | ✅                       |            |                               | ✅                         |
| AES-CBC           |                      | ✅                       |            |                               | ✅                         |
| AES-GCM           |                      | ✅                       |            |                               | ✅                         |
| SHA-1             |                      |                          | ✅         |                               |                            |
| SHA-256           |                      |                          | ✅         |                               |                            |
| SHA-384           |                      |                          | ✅         |                               |                            |
| SHA-512           |                      |                          | ✅         |                               |                            |
| ECDH              |                      |                          |            | ✅                            |                            |
| HKDF              |                      |                          |            | ✅                            |                            |
| PBKDF2            |                      |                          |            | ✅                            |                            |
| AES-KW            |                      |                          |            |                               | ❌                         |

:::

### `CustomEvent`

The standard `CustomEvent` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).

### `Event`

The standard `Event` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Event).

### `EventTarget`

The standard `EventTarget` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget).

### Fetch APIs

::: info
Looking for the `fetch()` method? [Jump to fetch()](#fetch).
:::

#### `Headers`

The standard `Headers` object. It also supports the [`getSetCookie()` method](https://fetch.spec.whatwg.org/#dom-headers-getsetcookie). [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

#### `Request`

The standard `Request` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Request).

#### `Response`

The standard `Response` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Response).

**Streaming**:
You can pass a [`ReadableStream`](#readablestream) object as the `body` of a `Response` to stream the response as more data becomes available. Often, you won't need to implement the logic yourself as it is implemented by the frameworks and libraries you use.

#### `URL`

The standard `URL` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL).

::: warning
This URL implementation only supports URLs with a scheme.
:::

#### `URLSearchParams`

The standard `URLSearchParams` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).

### `File`

The standard `File` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/File).

### `FileReader`

The standard `FileReader` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileReader).

### `FormData`

The standard `FormData` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

### `navigator.userAgent`

`navigator.userAgent` is a fixed string that can be used to detect the current runtime. Its value is always `Lagoss/VERSION`, where `VERSION` is the current version of the Lagoss Runtime.

### `process.env`

The only usage of `process` is to access environment variables. By default, it will only contain the `NODE_ENV` variable, which is set to `"production"` when deployed, and to `"development"` when using [`lagoss dev`](./cli.md#lagoss-dev).

[Learn more about environment variables](./usage/environment-variables.md).

### `ProgressEvent`

The standard `ProgressEvent` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent).

### Stream APIs

#### `ReadableStream`

The standard `ReadableStream` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

#### `ReadableStreamDefaultReader`

The standard `ReadableStreamDefaultReader` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader).

#### `TransformStream`

The standard `TransformStream` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream).

#### `WritableStream`

The standard `WritableStream` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream).

#### `WritableStreamDefaultWriter`

The standard `WritableStreamDefaultWriter` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter).

### `TextEncoder`

The standard `TextEncoder` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder).

### `TextDecoder`

The standard `TextDecoder` object. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder).

## Global methods

### `atob()`

The standard `atob` method. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/atob).

### `btoa()`

The standard `btoa` method. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/btoa).

### `clearInterval()`

The standard `clearInterval` method. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval).

### `clearTimeout()`

The standard `clearTimeout` method. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout).

### `fetch()`

The standard `fetch` method. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

::: info
`fetch()` supports both HTTP/1.1 and HTTP/2. Additionally, there are [some limits](./usage/limits.md#functions) in place to prevent abuses.
:::

### `queueMicrotask()`

The standard `queueMicrotask` method. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask).

### `setInterval()`

The standard `setInterval` method. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/setInterval).

### `setTimeout()`

The standard `setTimeout` method. [See the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout).
