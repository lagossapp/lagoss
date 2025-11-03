import { deploymentSchema } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';

async function scanHtmlForFavicon(url: string): Promise<string | null> {
  const response = await fetch(url, {
    method: 'GET',
  });
  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  const linkRegex = /<link[^>]+rel=["'](?:shortcut icon|icon)["'][^>]*>/gi;
  const hrefRegex = /href=["']([^"']+)["']/i;
  const links = html.match(linkRegex);

  for (const link of links ?? []) {
    const hrefMatch = link.match(hrefRegex);
    if (hrefMatch && hrefMatch[1]) {
      let faviconUrl = hrefMatch[1];
      // Handle relative URLs
      if (faviconUrl.startsWith('/')) {
        const urlObj = new URL(url);
        return `${urlObj.protocol}//${urlObj.host}${faviconUrl}`;
      } else if (!faviconUrl.startsWith('http')) {
        const urlObj = new URL(url);
        return `${urlObj.protocol}//${urlObj.host}/${faviconUrl}`;
      }
    }
  }

  return null;
}

async function _tryToFetchFavicon(url: string): Promise<Response | null> {
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Response(new Uint8Array(arrayBuffer), {
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'image/png' },
    });
  } catch (error) {
    console.error(`Failed to fetch favicon from ${url}:`, error);
    return null;
  }
}

async function tryToFetchFavicon(baseUrl: string): Promise<Response | null> {
  // Try to scan HTML for favicon link
  const scannedFaviconUrl = await scanHtmlForFavicon(baseUrl);
  if (scannedFaviconUrl) {
    const favicon = await _tryToFetchFavicon(scannedFaviconUrl);
    if (favicon) {
      return favicon;
    }
  }

  const faviconIco = await _tryToFetchFavicon(`${baseUrl}/favicon.ico`);
  if (faviconIco) {
    return faviconIco;
  }

  const faviconPng = await _tryToFetchFavicon(`${baseUrl}/favicon.png`);
  if (faviconPng) {
    return faviconPng;
  }

  return null;
}

export default defineEventHandler(async event => {
  const db = await useDB();
  const app = await requireApp(event);

  // return favicon of the latest deployment
  const deployment = await getFirst(
    db
      .select()
      .from(deploymentSchema)
      .where(and(eq(deploymentSchema.appId, app.id), eq(deploymentSchema.isProduction, 1))),
  );
  if (!deployment) {
    throw createError({ statusCode: 404, statusMessage: 'Deployment not found' });
  }

  const deploymentUrl = getDeploymentDomain({ name: deployment.id });

  const faviconData = await tryToFetchFavicon(deploymentUrl);
  if (!faviconData) {
    return sendRedirect(event, '/icon-black.png');
  }

  return new Response(faviconData.body, {
    headers: {
      ...faviconData.headers,
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  });
});
