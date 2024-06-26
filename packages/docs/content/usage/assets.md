# Assets

Lagoss can host and serve assets such as images, CSS files, and JavaScript files. These assets are static files that are not generated dynamically by your Function.

When deploying a Function, you can specify an assets directory using the [`--public` or `-p`](../cli.md#lagoss-deploy) flag. This directory will be served by Lagoss at the root of your Function's URL.

## Automatic assets serving

Let's say you have a Function inside an `index.ts` file, with a favicon and an image:

```
index.ts
public/
  favicon.ico
  images/
    image.png
```

To deploy this Function with these assets, you can use the `-p` or `--public` flag:

```bash
lagoss deploy ./index.ts --public public
# Same as
lagoss deploy ./index.ts -p public
```

Your Function is now deployed to `example.lagoss.com`. You can access the favicon and the image at the following URLs:

- `example.lagoss.com/favicon.ico`
- `example.lagoss.com/images/image.png`

In your HTML, you can reference these files using relative paths:

```html
<link rel="icon" href="/favicon.ico" />
<!-- ... -->
<img src="/images/image.png" />
```

## Limits

The number of assets per Deployment is limited to 100 for Personal plans, and 1000 for Pro plans. The size of each asset is also limited to prevent abuses. [Learn more about the assets limits](./limits.md).
