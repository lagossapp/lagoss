import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';

fs.stat('./dist/install.js')
  .then(async () => {
    await import('../dist/install.js');
  })
  .catch(async err => {
    console.error('Lagoss cli js files not found', err.message);
    console.log('Building the lagoss cli ...');
    const { status } = spawnSync('pnpm', ['build:js']);
    if (status !== 0) {
      throw new Error('Failed to build the lagoss cli');
    } else {
      await import('../dist/install.js');
    }
  });
