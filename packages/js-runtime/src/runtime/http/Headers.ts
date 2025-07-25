(globalThis => {
  const SET_COOKIE = 'set-cookie';
  const CONTENT_TYPE = 'content-type';

  globalThis.Headers = class {
    private h: [string, string][] = [];
    private hasContentType = false;
    immutable = false;

    constructor(init?: HeadersInit) {
      if (init === null) {
        throw new TypeError('HeadersInit must not be null');
      }

      if (init) {
        if (Array.isArray(init)) {
          for (const entry of init) {
            if (entry.length !== 2) {
              throw new TypeError('HeadersInit must be an array of 2-tuples');
            }

            this.append(entry[0], entry[1]);
          }
        } else {
          if (init instanceof Headers) {
            // @ts-expect-error we access a private field
            this.h = init.h;
            return;
          }

          if (typeof init !== 'object') {
            throw new TypeError('HeadersInit must be an object or an array of 2-tuples');
          }

          for (const [key, value] of Object.entries(init)) {
            this.append(key, value);
          }
        }
      }
    }

    getSetCookie(): string[] {
      const result: string[] = [];

      for (const [key, value] of this.h) {
        if (key === SET_COOKIE) {
          result.push(value);
        }
      }

      return result;
    }

    append(name: string, value: string) {
      if (this.immutable) {
        throw new TypeError('Headers are immutable');
      }

      name = name.toLowerCase();
      value = String(value);

      if (name === CONTENT_TYPE) {
        this.hasContentType = true;
      }

      this.h.push([name, value]);
    }

    delete(name: string) {
      if (this.immutable) {
        throw new TypeError('Headers are immutable');
      }

      name = name.toLowerCase();

      const newHeaders: [string, string][] = [];

      for (const [key, value] of this.h) {
        if (key !== name) {
          newHeaders.push([key, value]);
        }
      }

      this.h = newHeaders;
    }

    *entries(): HeadersIterator<[string, string]> {
      const temp = new Map<string, string[]>();

      for (const [key, value] of this.h) {
        if (!temp.has(key)) {
          temp.set(key, []);
        }

        temp.get(key)!.push(value);
      }

      const sorted = [...temp.entries()].sort(([a], [b]) => a.localeCompare(b));

      for (const [key, values] of sorted) {
        if (key == SET_COOKIE) {
          for (const value of values) {
            yield [key, value];
          }
        } else {
          yield [key, values.join(', ')];
        }
      }
    }

    get(name: string): string | null {
      name = name.toLowerCase();

      const result: string[] = [];

      for (const [key, value] of this.h) {
        if (key === name) {
          result.push(value);
        }
      }

      return result.join(', ') || null;
    }

    has(name: string): boolean {
      name = name.toLowerCase();

      for (const [key] of this.h) {
        if (key === name) {
          return true;
        }
      }

      return false;
    }

    *keys(): HeadersIterator<string> {
      for (const [key] of this.h) {
        yield key;
      }
    }

    set(name: string, value: string) {
      if (this.immutable) {
        throw new TypeError('Headers are immutable');
      }

      this.delete(name);
      this.append(name, value);
    }

    *values(): HeadersIterator<string> {
      for (const [, value] of this.h) {
        yield value;
      }
    }

    forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: unknown) {
      for (const [key, value] of this.entries()) {
        callbackfn.call(thisArg, value, key, this);
      }
    }

    [Symbol.iterator](): HeadersIterator<[string, string]> {
      return this.entries();
    }
  };
})(globalThis);
