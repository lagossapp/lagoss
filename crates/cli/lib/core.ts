#!/usr/bin/env node

import path from 'node:path';
import os from 'node:os';
import updateNotifier from 'update-notifier';

import packageJson from '../package.json' assert { type: 'json' };
import { Binary } from './binary';
import { getPlatform } from './utils';

export function getBinary() {
  const { platform, name } = getPlatform();
  const { name: packageName, version } = packageJson;

  const url = `https://github.com/lagossapp/lagoss/releases/download/${packageName}@${version}/${platform}.tar.gz`;
  const installationDirectory = path.join(os.homedir(), '.lagoss');

  return new Binary(url, { name, installationDirectory, version });
}

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
