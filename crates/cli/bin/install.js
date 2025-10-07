#!/usr/bin/env node

async function run() {
  let core;

  try {
    core = await import('../dist/core.js');
  } catch (error) {
    //
  }

  if (core) {
    core.install();
  }
}

run();
