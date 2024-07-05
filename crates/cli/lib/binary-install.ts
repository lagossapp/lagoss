// All credit goes to Cloudflare wrangler-legacy and
// the initial binary-install package, which this code
// is heavily based on.
//
// Cloudflare wrangler-legacy: https://github.com/cloudflare/wrangler-legacy/blob/master/npm/binary-install.js
// binary-install: https://github.com/EverlastingBugstopper/binary-install#readme
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import axios from 'axios';
import * as tar from 'tar';
import { rimraf } from 'rimraf';

const error = (msg: string | Error) => {
  console.error(msg);
  process.exit(1);
};

export class Binary {
  private url: string;
  private name: string;
  private version: string;
  private installDirectory: string;

  constructor(
    url: string,
    data: {
      name: string;
      version: string;
      installDirectory: string;
    },
  ) {
    this.url = url;
    this.name = data.name;
    this.version = data.version;
    this.installDirectory = data.installDirectory;
  }

  _getInstallDirectory() {
    return this.installDirectory;
  }

  _getBinaryDirectory() {
    return join(this._getInstallDirectory(), 'bin');
  }

  _getBinaryPath() {
    return join(this._getBinaryDirectory(), this.name);
  }

  _isInstalled() {
    return existsSync(this._getBinaryPath());
  }

  _getInstalledVersion() {
    const { stdout } = spawnSync(this._getBinaryPath(), ['--version'], { encoding: 'utf-8' });
    return stdout.trim();
  }

  _isUpToDate() {
    return this._isInstalled() && this.version === this._getInstalledVersion();
  }

  async install() {
    if (this._isUpToDate()) {
      return;
    }

    const dir = this._getInstallDirectory();
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const binaryDirectory = this._getBinaryDirectory();
    if (existsSync(binaryDirectory)) {
      rimraf.sync(binaryDirectory);
    }
    mkdirSync(binaryDirectory, { recursive: true });

    console.log(`Downloading release from ${this.url}`);

    try {
      const res = await axios({ url: this.url, responseType: 'stream' });

      const writer = tar.x({ strip: 1, C: binaryDirectory });

      await new Promise((resolve, reject) => {
        res.data.pipe(writer);
        let error: Error | null = null;
        writer.on('error', err => {
          error = err;
          reject(err);
        });
        writer.on('close', () => {
          if (!error) {
            resolve(true);
          }
        });
      });

      console.log(`${this.name} has been installed!`);
    } catch (e) {
      error(`Error fetching release: ${(e as Error).message}`);
    }
  }

  uninstall() {
    if (existsSync(this._getInstallDirectory())) {
      rimraf.sync(this.installDirectory);
      console.log(`${this.name} has been uninstalled`);
    }
  }

  async run(shouldInstall = true) {
    if (!this._isInstalled() && shouldInstall) {
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
