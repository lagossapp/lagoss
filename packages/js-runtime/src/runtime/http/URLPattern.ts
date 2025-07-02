(globalThis => {
  const { URLPattern } = require('urlpattern-polyfill');

  globalThis.URLPattern = URLPattern;
})(globalThis);
