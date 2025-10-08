#!/usr/bin/env node

import updateNotifier from 'update-notifier';
import { getBinary } from './get-binary';
import packageJson from '../package.json' assert { type: 'json' };

async function run() {
  updateNotifier({ pkg: packageJson }).notify();

  await getBinary().run();
}

async function install() {
  // Prevent exiting with code 1 when
  // the changeset PR is created

  const processExit = process.exit;

  // @ts-expect-error This is a hack to prevent the process from exiting
  process.exit = (): never => {};

  await getBinary().install();

  // Restore the original process.exit
  process.exit = processExit;
}

export { run, install };
