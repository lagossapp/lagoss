import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../';

describe('randomUUID', () => {
  beforeEach(() => {
    globalThis.LagossSync = {
      ...globalThis.LagossSync,
      uuid: vi.fn(),
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call LagossSync.uuid', () => {
    // @ts-expect-error LagossSync is not defined
    globalThis.LagossSync.uuid.mockReturnValueOnce('dff2d1a4-32b8-4a83-b455-88707848227a');

    const uuid = crypto.randomUUID();

    expect(uuid).toEqual('dff2d1a4-32b8-4a83-b455-88707848227a');
  });
});

describe('getRandomValues', () => {
  beforeEach(() => {
    globalThis.LagossSync = {
      ...globalThis.LagossSync,
      randomValues: vi.fn(),
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call LagossSync.randomValues', () => {
    // @ts-expect-error LagossSync is not defined
    globalThis.LagossSync.randomValues.mockImplementationOnce(typedArray => typedArray);

    const uuid = crypto.getRandomValues(new Uint8Array([0, 8, 2]));

    expect(uuid).toEqual(new Uint8Array([0, 8, 2]));
  });
});
