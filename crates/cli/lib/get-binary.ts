import { createRequire } from 'node:module';
import { Binary } from './binary-install';
import os from 'node:os';
import path from 'node:path';

function getPlatform() {
  const type = os.type();
  const arch = os.arch();

  if (type === 'Windows_NT') {
    return {
      platform: 'lagoss-win-x64',
      name: 'lagoss.exe',
    };
  }

  if (type === 'Linux' && arch === 'x64') {
    return {
      platform: 'lagoss-linux-x64',
      name: 'lagoss',
    };
  }

  if (type === 'Linux' && arch === 'arm64') {
    return {
      platform: 'lagoss-linux-arm64',
      name: 'lagoss',
    };
  }

  if (type === 'Darwin' && arch === 'x64') {
    return {
      platform: 'lagoss-darwin-x64',
      name: 'lagoss',
    };
  }

  if (type === 'Darwin' && arch === 'arm64') {
    return {
      platform: 'lagoss-darwin-arm64',
      name: 'lagoss',
    };
  }

  throw new Error(`Unsupported platform: ${type} ${arch}`);
}

export function getBinary() {
  const { platform, name } = getPlatform();
  const customRequire = createRequire(import.meta.url);

  const { name: packageName, version } = customRequire('../package.json') as {
    name: string;
    version: string;
  };

  const url = `https://github.com/lagossapp/lagoss/releases/download/${packageName}@${version}/${platform}.tar.gz`;
  const installDirectory = path.join(os.homedir(), '.lagoss');

  return new Binary(url, { name, installDirectory, version });
}
