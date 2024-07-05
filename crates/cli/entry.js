import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';

fs.stat('bin/install.js')
  .then(async () => {
    await import('./bin/install.js');
  })
  .catch(async () => {
    const { status } = spawnSync('pnpm', ['build']);
    if (status !== 0) {
      throw new Error('Failed to build the lagoss cli');
    } else {
      await import('./bin/install.js');
    }
  });
