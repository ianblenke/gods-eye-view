import test from 'node:test';
import assert from 'node:assert/strict';
import { cockpitContactDotImage } from './cockpitContactDot.js';

test('[cockpit-contact-dot-001] the cockpit draws the contact dot once, and every later call gives the same data URL', () => {
  const calls = [];
  const context = new Proxy(
    {},
    {
      get:
        (_, key) =>
        (...args) =>
          calls.push([key, args]),
      set: () => true,
    },
  );
  const original = globalThis.document;
  let canvases = 0;
  globalThis.document = {
    createElement(name) {
      assert.equal(name, 'canvas');
      canvases += 1;
      return {
        width: 0,
        height: 0,
        getContext: () => context,
        toDataURL: (type) => `data:${type};base64,DOT`,
      };
    },
  };
  try {
    const first = cockpitContactDotImage();
    assert.equal(first, 'data:image/png;base64,DOT');
    assert.equal(cockpitContactDotImage(), first);
    assert.equal(canvases, 1);
  } finally {
    globalThis.document = original;
    cockpitContactDotImage._dataUrl = null;
  }
});
