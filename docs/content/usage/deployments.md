## Deploying a new Function

A Function is bound to Deployments: **Production** and **Preview** deployments. [Default and custom Domains](./usage/domains.md) always points to the current production Deployment.

Your Function always has a single production Deployment and typically has multiple preview Deployments. Each Deployment is immutable, and always accessible via a unique URL.

### Using the CLI

You can deploy a new Function using the `lagoss deploy` command:

```bash
lagoss deploy your-file.ts
```

This will create a new Function and a new production Deployment. You can then deploy again this Function using the same command:

::: info
By default, `lagoss deploy` will create a preview Deployment. You can use the `--prod` flag to automatically promote this new Deployment to production.
:::

```bash
# Create a preview deployment
lagoss deploy your-file.ts
# Create a production deployment
lagoss deploy --prod your-file.ts
```

Follow the [`lagoss deploy` documentation](./cli.md#lagoss-deploy) to learn more.

### Using the GitHub Action

If you are using GitHub and want to automate your Deployments with [GitHub Actions](https://github.com/features/actions), you can use the [Lagoss GitHub Action](https://github.com/lagossapp/github-action).

Follow the [Lagoss GitHub Action documentation](https://github.com/lagossapp/github-action) to learn more.

### Using the Dashboard

You can also create Functions and Deployments through the [Dashboard](https://app.lagoss.com), using the Playground.

Head over to the [Dashboard](https://app.lagoss.com), and click on the "Create a Function" button. You will be redirected to the Playground, where you can see your new Function, with the code at the left and the deployed result at the right:

![Playground](/images/playground.png)

You can now edit the code in the Playground, and click on the "Deploy" button to create a new production Deployment.You will see the result of your changes at the right.

## Cold starts

When a Deployment is requested for the first time in a [region](./usage/regions.md), Lagoss will spin up a new V8 Isolate, triggering a cold start. This might take a few milliseconds, depending on the size of your Deployment.

On subsequent requests, the same Isolate will be reused, allowing for much faster response times. After 15 minutes without any requests, the Isolate is spun down, and the next request will trigger a new cold start.
