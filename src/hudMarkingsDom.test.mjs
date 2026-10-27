// The page that the HUD builds: the test for the top bar reads the real markup
// that `_buildDOM` writes, in place of the text of the source file.
// hud.js imports `mgrs`, a CommonJS package whose named exports Node's ESM
// loader cannot see, so a module hook swaps that one specifier for a stub. The
// import happens before any DOM global exists, as in hudAltitudeDatum.test.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

const MGRS_STUB_URL = 'gev-test-stub:mgrs-markings';
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === 'mgrs') return { url: MGRS_STUB_URL, shortCircuit: true };
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url === MGRS_STUB_URL) {
      return {
        format: 'module',
        shortCircuit: true,
        source:
          'export function forward() { return "10SEG55776339"; }\nexport default { forward };\n',
      };
    }
    return next(url, context);
  },
});

const { IntelHUD } = await import('./hud.js');

function viewer() {
  const listener = { addEventListener() {}, removeEventListener() {} };
  return {
    camera: {
      pitch: -Math.PI / 2,
      positionCartographic: { latitude: 0.6, longitude: -2.1, height: 1000 },
      computeViewRectangle: () => undefined,
      moveStart: listener,
      moveEnd: listener,
    },
  };
}

test('[hud-markings-003] builds the top bar with its three parts and with no marking text', () => {
  const root = { innerHTML: '', dataset: {} };
  const previous = globalThis.document;
  globalThis.document = {
    getElementById: (id) => (id === 'intel-hud' ? root : null),
    querySelectorAll: () => [],
    addEventListener() {},
    removeEventListener() {},
  };
  let hud;
  try {
    hud = new IntelHUD(viewer());
    for (const name of ['hud-top-bar-left', 'hud-top-bar-center', 'hud-top-bar-right']) {
      assert.ok(root.innerHTML.includes(`<span class="${name}">`), `the page has the part ${name}`);
    }
    assert.ok(
      root.innerHTML.includes('<span class="hud-readout"><span class="hud-top-bar-left"></span></span>'),
      'the left part is empty and has its readout wrapper',
    );
    assert.equal(/TOP SECRET|SI-TK|NOFORN|hud-classification/.test(root.innerHTML), false);
  } finally {
    hud?.destroy();
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
});
