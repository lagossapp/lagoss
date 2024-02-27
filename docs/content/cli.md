The easiest way to deploy and manage Functions is through our [Command-line interface](https://en.wikipedia.org/wiki/Command-line_interface).

## Installation

Lagoss CLI is available for the following operating systems:

- macOS (Intel and M1)
- Linux (x64 and arm64)
- Windows (x64)

We recommend installing the CLI globally, using the package manager of your choice. You will also need [ESBuild](https://esbuild.github.io/) installed globally on your machine, as we use it to bundle your Function's code:

```bash
# NPM
npm install --global @lagoss/cli esbuild
# Yarn
yarn global add @lagoss/cli esbuild
# PNPM
pnpm install --global @lagoss/cli esbuild
```

## Usage

Once installed, execute the `lagoss` CLI to see all the commands available.

### `lagoss login`

Before being able to deploy and manage Functions, you will need to log in. Make sure you have already [created an account](./usage/account.md). If you try to execute a command that requires being logged in, you will be warned and the command will be aborted.

To proceed, run `lagoss login` and follow the instructions.

### `lagoss logout`

If you want, you can log out at any time. For security, you will be asked to confirm that you want to log out.

To proceed, run `lagoss logout` and follow the instructions.

### `lagoss deploy`

Create a new Function or a new Deployment in the given directory. Make sure you are [logged in](#lagoss-login) before proceeding. If you are executing the command for the first time:

1. You will be prompted to select an Organization
2. You will be able to link to an existing Function, or create a new one by specifying a name

If you then want to trigger a new Deployment, re-run the same command. By default, subsequent Deployments are created in preview mode. Specify `--prod` to deploy in production mode.

This command accepts the following arguments and options:

- `[PATH]` is an optional path to a file or directory containing the Function. (Default: `.`)
- `--client, -c <CLIENT>` allows you to specify a path to an additional file to bundle as a client-side script.
- `--public, -p <<PUBLIC_DIR>>` allows you to specify a path to a directory containing assets to be served statically.
- `--production, --prod` allows you to deploy the Function in production mode. (Default: `false`)

Examples:

```bash
# Deploy the current directory to Production
lagoss deploy --prod
# Deploy the index.ts file
lagoss deploy ./index.ts
# Deploy the my-project directory and override the public directory
lagoss deploy ./my-project --public ./my-project/assets
```

### `lagoss ls`

List all the Deployments of the given directory. Make sure you are [logged in](#lagoss-login) before proceeding. This command accepts only one argument:

- `[DIRECTORY]` is an optional path to a directory containing the Function. (Default: `.`)

Example:

```bash
# List Deployments in the current directory
lagoss ls
# List Deployments of the my-project directory
lagoss ls ./my-project
```

### `lagoss promote`

Promote the given Deployment to production. Make sure you are [logged in](#lagoss-login) before proceeding. This command accepts the following arguments:

- `<DEPLOYMENT_ID>` the ID of the Deployment to promote.
- `[DIRECTORY]` is an optional path to a directory containing the Function. (Default: `.`)

Example:

```bash
# Promote the cl...km Deployment in the current directory
lagoss promote claxnlc230738q5pa7iximskm
# Promote the cl...km Deployment of the my-project directory
lagoss promote claxnlc230738q5pa7iximskm ./my-project
```

### `lagoss undeploy`

Un-deploy a Deployment. Make sure you are [logged in](#lagoss-login) before proceeding. This command accepts the following arguments:

- `<DEPLOYMENT_ID>` the ID of the Deployment to undeploy.
- `[DIRECTORY]` is an optional path to a directory containing the Function. (Default: `.`)

Example:

```bash
# Undeploy the cl...km Deployment in the current directory
lagoss undeploy claxnlc230738q5pa7iximskm
# Undeploy the cl...km Deployment of the my-project directory
lagoss undeploy claxnlc230738q5pa7iximskm ./my-project
```

### `lagoss rm`

::: danger
Deleting a Function also deletes permanently all of its Deployments, statistics and logs.
:::

Delete completely a Function. You'll be asked to confirm before proceeding. Make sure you are [logged in](#lagoss-login) before proceeding. This command accepts only one argument:

- `[DIRECTORY]` is an optional path to a directory containing the Function. (Default: `.`)

Example:

```bash
# Delete the current directory's Function
lagoss rm
# Delete the my-project directory's Function
lagoss rm ./my-project
```

### `lagoss dev`

Launch a local dev server, using the same Runtime as when deployed to the Cloud. You can either:

- Use this command without arguments, to use the current directory configuration
- Specify a path to a directory containing a Function and its configuration
- Specify a path to a file containing a Function

This command accepts the following arguments and options:

- `[PATH]` is an optional path to a directory or file containing the Function. (Default: `.`)
- `--client, -c <CLIENT>` allows you to specify a path to an additional file to bundle as a client-side script.
- `--public, -p <<PUBLIC_DIR>>` allows you to specify a path to a directory containing assets to be served statically.
- `--hostname <HOSTNAME>` allows you to specify a custom hostname to start the server on. (Default: `127.0.0.1`)
- `--port <PORT>` allows you to specify a custom port to start the server on. (Default: `1234`)
- `--env <FILE>` allows you to specify a custom path to an environment file to inject [environment variables](./usage/environment-variables.md). (Default: `.env`)
- `--allow-code-generation` allows you to enable code generation from strings (`eval` / `new Function`)
- `--prod` allows you to set `process.env.NODE_ENV` to `"production"` instead of `"development"`

Examples:

```bash
# Run a local dev server in the current directory
lagoss dev
# Run a local dev server with a file entrypoint and some assets
lagoss dev ./server.tsx --public ./assets
# Run a local dev server inside the my-project directory using a custom port
lagoss dev ./my-project --port 56565
```

::: warning
Although the `dev` command uses the same Runtime as when deployed, the local HTTP server itself doesn't have the same
optimizations. As such, you shouldn't run any production environment on it, or run any kind of load tests/benchmarks.
:::

### `lagoss build`

For debugging purposes, you can build a Function and see its output without deploying it. Under the hood, `lagoss build` does the same steps as `lagoss deploy`, but skips the deployment part and instead writes the output to a local `.lagoss` folder.

This command accepts the following arguments and options:

- `[PATH]` is an optional path to a file or directory containing the Function. (Default: `.`)
- `--client, -c <CLIENT>` allows you to specify a path to an additional file to bundle as a client-side script.
- `--public, -p <<PUBLIC_DIR>>` allows you to specify a path to a directory containing assets to be served statically.

Examples:

```bash
lagoss build ./server.tsx --client App.tsx --public ./assets
tree .lagoss/
# .lagoss/
#   index.js
#   App.js
#   assets/
```

### `lagoss link`

Link a local Function to a deployed one, without triggering a new Deployment. Make sure you are [logged in](#lagoss-login) before proceeding. This command accepts only one argument:

- `[DIRECTORY]` is an optional path to a directory containing the Function. (Default: `.`)

Example:

```bash
lagoss link ./index.ts
```

## Self-hosting configuration

If you are [self-hosting](./self-hosting/installation.md) Lagoss, you will need to update the default site URL to the one used by your installation. To do so, find the configuration file located in `~/.lagoss/config.json`:

```json
{
  "token": "**************",
  "site_url": "https://app.lagoss.com" // Replace this field
}
```

Replace the `site_url` field with the one configured during the installation. To verify if it's working correctly, log in to your installation using `lagoss login`.
