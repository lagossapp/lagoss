import '#nitro-internal-pollyfills';
import { useNitroApp } from 'nitropack/runtime';
import { isPublicAssetURL } from '#nitro-internal-virtual/public-assets';

const nitroApp = useNitroApp();

export async function handler(request: Request) {
  const url = new URL(request.url);

  if (isPublicAssetURL(url.pathname)) {
    return;
  }

  let body;
  if (request.body) {
    body = await request.arrayBuffer();
  }

  return nitroApp.localFetch(url.pathname + url.search, {
    host: url.hostname,
    protocol: url.protocol,
    headers: request.headers,
    method: request.method,
    redirect: request.redirect,
    body,
  });
}
