import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';

fs.stat('../bin/install.js')
  .then(() => {
    import('../bin/install.js');
  })
  .catch(() => {
    console.log('Building the lagoss cli ...');
    const { status } = spawnSync('pnpm', ['build']);
    if (status !== 0) {
      throw new Error('Failed to build the lagoss cli');
    } else {
      import('../bin/install.js');
    }
  });
