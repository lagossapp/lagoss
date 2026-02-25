import type { AstroAdapter, AstroConfig, AstroIntegration } from 'astro';
import esbuild from 'esbuild';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

interface Options {
  port?: number;
  hostname?: string;
}

export function getAdapter(args?: Options): AstroAdapter {
  return {
    name: '@lagoss/astro',
    serverEntrypoint: '@lagoss/astro/server.js',
    supportedAstroFeatures: {
      hybridOutput: 'stable',
      staticOutput: 'stable',
      serverOutput: 'stable',
      sharpImageService: 'stable',
    },
    args: args ?? {},
    exports: ['handler'],
  };
}

export default function createIntegration(args?: Options): AstroIntegration {
  let _buildConfig: AstroConfig['build'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let _vite: any;
  return {
    name: '@lagoss/astro',
    hooks: {
      'astro:config:done': ({ setAdapter, config }) => {
        setAdapter(getAdapter(args));
        _buildConfig = config.build;

        if (config.output === 'static') {
          console.warn(`[@lagoss/astro] \`output: "server"\` is required to use this adapter.`);
        }
      },
      'astro:build:setup': ({ vite, target }) => {
        if (target === 'server') {
          _vite = vite;
          vite.resolve = vite.resolve || {};
          vite.resolve.alias = vite.resolve.alias || {};

          const aliases = [{ find: 'react-dom/server', replacement: 'react-dom/server.browser' }];

          if (Array.isArray(vite.resolve.alias)) {
            vite.resolve.alias = [...vite.resolve.alias, ...aliases];
          } else {
            for (const alias of aliases) {
              (vite.resolve.alias as Record<string, string>)[alias.find] = alias.replacement;
            }
          }
          vite.ssr = vite.ssr || {};
          vite.ssr.target = vite.ssr.target || 'webworker';
        }
      },
      'astro:build:done': async () => {
        const entryUrl = new URL(_buildConfig.serverEntry, _buildConfig.server);
        const pth = fileURLToPath(entryUrl);
        await esbuild.build({
          target: 'es2020',
          platform: 'browser',
          entryPoints: [pth],
          outfile: pth,
          allowOverwrite: true,
          format: 'esm',
          bundle: true,
          minify: _vite.build?.minify !== false,
        });

        const configPath = path.join(_vite.root, '.lagoss/config.json');
        let shouldCreateConfig = false;

        try {
          await fs.access(configPath);
          shouldCreateConfig = false;
        } catch {
          shouldCreateConfig = true;
        }

        if (shouldCreateConfig) {
          const index = path.relative(_vite.root, pth);
          const assets = path.relative(_vite.root, fileURLToPath(_buildConfig.client));

          console.log();
          console.log('Wrote Lagoss configuration to .lagoss/config.json');

          await fs.mkdir(path.dirname(configPath), { recursive: true });
          await fs.writeFile(
            configPath,
            JSON.stringify({
              function_id: '',
              organization_id: '',
              index,
              client: null,
              assets,
            }),
          );
        }

        // Remove chunks, if they exist. Since we have bundled via esbuild these chunks are trash.
        try {
          const chunkFileNames = _vite.build?.rollupOptions?.output?.chunkFileNames ?? 'chunks/chunk.[hash].mjs';
          const chunkPath = path.dirname(chunkFileNames);
          const chunksDirUrl = new URL(chunkPath + '/', _buildConfig.server);
          await fs.rm(chunksDirUrl, { recursive: true, force: true });
        } catch {
          // No chunks to remove.
        }

        console.log();
        console.log('Run `lagoss dev` / `lagoss deploy` to start your app!');
        console.log();
      },
    },
  };
}
