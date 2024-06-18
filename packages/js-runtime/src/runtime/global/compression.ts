(globalThis => {
  globalThis.CompressionStream = class {
    private readonly transform;

    constructor(format: CompressionFormat) {
      const id = LagossSync.compressionCreate(format, false);

      this.transform = new TransformStream({
        transform(chunk, controller) {
          const output = LagossSync.compressionWrite(id, chunk);

          controller.enqueue(output);
        },
        flush(controller) {
          const output = LagossSync.compressionFinish(id);

          controller.enqueue(output);
        },
      });
    }

    get readable() {
      return this.transform.readable;
    }

    get writable() {
      return this.transform.writable;
    }
  };

  globalThis.DecompressionStream = class {
    private readonly transform;

    constructor(format: CompressionFormat) {
      const id = LagossSync.compressionCreate(format, true);

      this.transform = new TransformStream({
        transform(chunk, controller) {
          const output = LagossSync.compressionWrite(id, chunk);

          controller.enqueue(output);
        },
        flush(controller) {
          const output = LagossSync.compressionFinish(id);

          controller.enqueue(output);
        },
      });
    }

    get readable() {
      return this.transform.readable;
    }

    get writable() {
      return this.transform.writable;
    }
  };
})(globalThis);
