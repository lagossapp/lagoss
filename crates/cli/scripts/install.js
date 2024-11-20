#!/usr/bin/env node

// @ts-check

let core;

try {
  core = require('../dist/core.js');
  // import { install } from '../dist/core.js';
} catch (error) {
  //
}

if (core) {
  core.install();
}
