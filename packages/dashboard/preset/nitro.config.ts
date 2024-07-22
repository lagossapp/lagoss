import type { PackageJson } from 'pkg-types';
import { resolve, relative } from 'pathe';
import type { NitroPreset } from 'nitropack';
import { writeFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/**
 * Both function_id and organization_id fields are required but only used when deploying the function
 * Ref: https://github.com/lagonapp/lagon/blob/06093d051898d7603f356b9cae5e3f14078d480a/crates/cli/src/utils/deployments.rs#L34
 */
export interface LagossFunctionConfig {
  function_id: string;
  organization_id: string;
  index: string;
  client?: string;
  assets?: string;
}

export default <NitroPreset>{
  extends: 'base-worker',
  entry: fileURLToPath(new URL('entry.ts', import.meta.url)),
  exportConditions: ['lagoss'],
  commands: {
    preview: 'npx lagoss dev',
    deploy: 'npx lagoss deploy',
  },
  rollupConfig: {
    output: {
      entryFileNames: 'index.mjs',
      format: 'esm',
    },
  },
  hooks: {
    async compiled(nitro) {
      // Write Lagoss config
      const rootDir = resolve(nitro.options.rootDir);
      const indexPath = relative(rootDir, resolve(nitro.options.output.serverDir, 'index.mjs'));
      const assetsDir = relative(rootDir, nitro.options.output.publicDir);

      await mkdir(resolve(rootDir, '.lagoss'), { recursive: true });

      const configPath = resolve(rootDir, '.lagoss', 'config.json');
      const configExists = (await stat(configPath).catch(() => null)) !== null;
      if (!configExists) {
        await writeFile(
          resolve(rootDir, '.lagoss', 'config.json'),
          JSON.stringify({
            function_id: '',
            organization_id: '',
            index: indexPath,
            assets: assetsDir,
          } satisfies LagossFunctionConfig),
        );
      }

      // Write package.json for deployment
      await writeFile(
        resolve(nitro.options.output.dir, 'package.json'),
        JSON.stringify(
          <PackageJson>{
            private: true,
            scripts: {
              dev: 'npx @lagoss/cli lagoss dev',
              deploy: 'npx @lagoss/cli lagoss deploy',
            },
          },
          null,
          2,
        ),
      );
    },
  },
};
