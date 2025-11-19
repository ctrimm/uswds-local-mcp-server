// Jest setup file to handle undici issues in Node 18
// undici expects File to be globally available but it's not in the Jest environment

// Polyfill File for undici compatibility
if (typeof global.File === 'undefined') {
  global.File = class File extends Blob {
    constructor(bits, name, options) {
      super(bits, options);
      this.name = name;
      this.lastModified = options?.lastModified || Date.now();
    }
  };
}

// Polyfill FormData if needed
if (typeof global.FormData === 'undefined') {
  global.FormData = class FormData {
    constructor() {
      this._data = new Map();
    }
    append(key, value) {
      this._data.set(key, value);
    }
    get(key) {
      return this._data.get(key);
    }
  };
}
