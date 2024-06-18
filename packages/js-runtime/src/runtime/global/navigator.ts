// esbuild will inline the version as a const, and since both
// runtime and js-runtime are versioned together, we can safely
// import the version from the package.json instead of injecting
// it from the Rust code.
import { version } from '../../../package.json';

(globalThis => {
  Object.defineProperty(globalThis, 'navigator', {
    value: {
      ...globalThis.navigator,
      userAgent: `Lagoss/${version}`,
    },
    writable: true,
    configurable: true,
  });
})(globalThis);
