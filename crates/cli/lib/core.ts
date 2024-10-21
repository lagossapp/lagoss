#!/usr/bin/env node

import updateNotifier from 'update-notifier';
import { getBinary } from './get-binary';
import packageJson from '../package.json' assert { type: 'json' };

function run() {
  updateNotifier({ pkg: packageJson }).notify();

  getBinary().run();
}

function install() {
  // Prevent exiting with code 1 when
  // the changeset PR is created
  // @ts-expect-error This is a hack to prevent the process from exiting
  process.exit = (): never => {};

  getBinary().install();
}

export { run, install };
