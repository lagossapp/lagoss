#!/usr/bin/env node

import fs from 'node:fs';
import process from 'node:process';

const hasDist = fs.existsSync('dist');
if (hasDist) {
  process.exit(1);
}
