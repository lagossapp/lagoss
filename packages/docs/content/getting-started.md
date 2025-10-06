# Getting started

This page will guide you through creating a simple JavaScript/TypeScript function and deploying it to Lagoss using the CLI. The edge function will be accessible through an unique URL.

## Installation

The first step is to install the Lagoss CLI. For more information about it, read the [CLI documentation](./cli.md).

```bash
# NPM
npm install --global @lagoss/cli esbuild
# Yarn
yarn global add @lagoss/cli esbuild
# PNPM
pnpm install --global @lagoss/cli esbuild
```

## Create a new project

We will now create a new function, that listens for `Request`s and replies with `Response`s. Remember the `fetch` function from browsers? We use the same native Web APIs!

Create a new file called `hello.js` / `hello.ts` and add the following code:

```javascript
// hello.js
export function handler(request) {
  return new Response('Hello, <b>World!</b>', {
    headers: { 'content-type': 'text/html' },
  });
}
```

```typescript
// hello.ts
export function handler(request: Request) {
  return new Response('Hello, <b>World!</b>', {
    headers: { 'content-type': 'text/html' },
  });
}
```

## Deploy the function

TODO: point users to self-hosting

Head over to the Dashboard at [https://app.lagoss.com](https://app.lagoss.com) and create an account. Once you're logged in, go back to a terminal and login with your newly created account:

```bash
lagoss login
```

This command will open a new tab in your browser, where you can copy an authentication token. Paste it in the terminal and press enter. You should now be logged in!

Now, let's deploy our Function:

```bash
# JavaScript
lagoss deploy hello.js
# TypeScript
lagoss deploy hello.ts
```

You will be asked to select the Organization where you want to deploy this Function. Press enter to select the one you just created.

Then, you will be asked to either **link this Function to an existing one**, or **create a new Function**. Here, we don't have any Function created yet, so press `n` to create a new one. Enter the name to give for this new Function, and press enter.

Wait a few seconds, and you should now see a message with an URL, indicating that your Function has been deployed successfully! You can now `curl` this URL, or access it directly in your browser. [Learn more about the Runtime APIs](./runtime-apis.md).

## Going further

### Updating the Function's code

Now that we have a Function deployed, we would like to add a new feature and return the name of the user that is making the request. To do so, we will need to update the Function's code:

```javascript {3-4,6}
// hello.js
export function handler(request) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name') || 'World';

  return new Response(`Hello, <b>${name}!</b>`, {
    headers: { 'content-type': 'text/html' },
  });
}
```

```typescript {3-4,6}
// hello.ts
export function handler(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name') || 'World';

  return new Response(`Hello, <b>${name}!</b>`, {
    headers: { 'content-type': 'text/html' },
  });
}
```

We can now re-deploy the Function with the same command as before, and append `--prod` to automatically promote this new Deployment to Production:

```bash
# JavaScript
lagoss deploy hello.js --prod
# TypeScript
lagoss deploy hello.ts --prod
```

Try to access your Function's URL again with `/?name=Your name`, and you should see the new message!

### Debugging

During development, you can use [`lagoss dev`](./cli.md#lagoss-dev) to launch a local development server that will automatically watch your Function's code:

```bash
# JavaScript
lagoss dev hello.js
# TypeScript
lagoss dev hello.ts
```

Running the above code will start a local server on port `1234` by default. You can now access your Function at [http://localhost:1234](http://localhost:1234).

You can also use the [`console` API](./runtime-apis.md#console) to log messages, objects and more. When using [`lagoss dev`](./cli.md#lagoss-dev), the logs are displayed in your terminal. When the Function is deployed, the logs are accessible in the Dashboard. [Learn more about logs](./usage/logs.md).
