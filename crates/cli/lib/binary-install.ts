// All credit goes to Cloudflare wrangler-legacy and
// the initial binary-install package, which this code
// is heavily based on.
//
// Cloudflare wrangler-legacy: https://github.com/cloudflare/wrangler-legacy/blob/master/npm/binary-install.js
// binary-install: https://github.com/EverlastingBugstopper/binary-install#readme
import { stat, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pipeline } from 'node:stream/promises';

import * as tar from 'tar';
import { color } from './console.js';

function error(msg: string | Error) {
  // Prepend a red cross to errors for visibility
  console.error(color.red(`❌ ${msg}`));
  process.exit(1);
}

export class Binary {
  private url: string;
  private name: string;
  private version: string;
  private installationDirectory: string;

  constructor(
    url: string,
    data: {
      name: string;
      version: string;
      installationDirectory: string;
    },
  ) {
    this.url = url;
    this.name = data.name;
    this.version = data.version;
    this.installationDirectory = data.installationDirectory;
  }

  _getInstallationDirectory() {
    return this.installationDirectory;
  }

  _getBinaryDirectory() {
    return join(this._getInstallationDirectory(), 'bin');
  }

  _getBinaryPath() {
    return join(this._getBinaryDirectory(), this.name);
  }

  async _exists(path: string) {
    return stat(path)
      .then(() => true)
      .catch(() => false);
  }

  async _isInstalled() {
    return this._exists(this._getBinaryPath());
  }

  _getInstalledVersion() {
    const { stdout } = spawnSync(this._getBinaryPath(), ['--version'], { encoding: 'utf-8' });
    return stdout.trim();
  }

  async _isUpToDate() {
    return (await this._isInstalled()) && this.version === this._getInstalledVersion();
  }

  async install() {
    if (await this._isUpToDate()) {
      return;
    }

    const installationDirectory = this._getInstallationDirectory();
    if (!(await this._exists(installationDirectory))) {
      await mkdir(installationDirectory, { recursive: true });
    }

    const binaryDirectory = this._getBinaryDirectory();
    if (!(await this._exists(binaryDirectory))) {
      await rm(binaryDirectory, { recursive: true, force: true });
    }
    await mkdir(binaryDirectory, { recursive: true });

    console.log(`⬇️ Downloading ${this.name} version ${color.green(this.version)} ...`);

    try {
      const res = await fetch(this.url, { method: 'GET' });
      if (!res.ok) {
        throw new Error(`Failed to fetch release: ${res.status} ${res.statusText}`);
      }

      if (!res.body) {
        throw new Error(`No response body`);
      }

      const writer = tar.x({ strip: 1, C: binaryDirectory });

      // res.body is a WHATWG ReadableStream in newer Node versions
      await pipeline(res.body as unknown as NodeJS.ReadableStream, writer);

      console.log(`✔️ ${this.name} version ${color.green(this.version)} has been installed!`);
    } catch (e) {
      error(`Error fetching release: ${(e as Error).message}`);
    }
  }

  async uninstall() {
    if (await this._exists(this._getInstallationDirectory())) {
      await rm(this.installationDirectory, { recursive: true, force: true });
      console.log(`🗑️ ${this.name} has been uninstalled`);
    }
  }

  async run(shouldInstall = true) {
    if (!(await this._isUpToDate()) && shouldInstall) {
      await this.install();
    }

    const binaryPath = this._getBinaryPath();
    const [, , ...args] = process.argv;

    const result = spawnSync(binaryPath, args, { cwd: process.cwd(), stdio: 'inherit' });

    if (result.error) {
      error(result.error);
    }

    process.exit(result.status || 0);
  }
}
