// TODO: directly fetch assets from db using drizzle
export function parseAssets(assets: string | string[]): string[] {
  if (typeof assets === 'string') {
    return JSON.parse(assets);
  }

  return assets;
}
