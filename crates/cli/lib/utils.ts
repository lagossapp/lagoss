import os from 'node:os';

export function getPlatform() {
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
