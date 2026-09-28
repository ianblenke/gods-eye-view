import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import { createOshCommandView } from './view.js';
import { createOshLayer } from '../osh/index.js';
import * as Cesium from 'cesium';

function fakeDocument() {
  const documentImpl = { activeElement: null, createElement(tagName) { return { tagName, children: [], textContent: '', value: '', hidden: false, disabled: false, append(...children) { this.children.push(...children); }, replaceChildren(...children) { this.children = [...children]; }, addEventListener(name, fn) { this[`on${name}`] = fn; }, click() { this.onclick?.(); }, focus() { documentImpl.activeElement = this; } }; } };
  return documentImpl;
}

const target = { system: 'sys-fixture-one', commands: { mavRTLControl: { fields: { rtl: { type: 'boolean' } } }, mavTakeoffControl: { fields: { TakeoffAltitudeAGL: { type: 'number', min: 1, max: 120, unit: 'm' } } } } };
function nodes(root) { return [root, ...root.children.flatMap(nodes)]; }
function byText(root, text) { return nodes(root).find((node) => node.textContent === text); }

test('[osh-control-016] Confirm a command before the browser sends it', async () => {
  const documentImpl = fakeDocument();
  const host = documentImpl.createElement('div');
  const sends = [];
  const view = createOshCommandView({ host, documentImpl, client: { targets: async () => ({ enabled: true, targets: [target] }), send: async (body) => { sends.push(body); return { outcome: 'sent' }; } } });
  await view.show({ systemId: 'sys-fixture-one', systemName: 'Fixture drone' });
  assert.equal(host.hidden, false);
  byText(host, 'mavTakeoffControl').click();
  assert.equal(sends.length, 0);
  assert.equal(nodes(host).some((node) => node.textContent.includes('Fixture drone') && node.textContent.includes('sys-fixture-one')), true);
  assert.equal(nodes(host).some((node) => node.textContent.includes('mavTakeoffControl') && node.textContent.includes('m')), true);
  assert.equal(documentImpl.activeElement, byText(host, 'Cancel'));
  await byText(host, 'Send command').onclick();
  assert.equal(sends.length, 1);
  assert.deepEqual(sends[0], { system: 'sys-fixture-one', command: 'mavTakeoffControl', parameters: { TakeoffAltitudeAGL: 1 } });
});

test('[osh-control-017] Close confirmation on Cancel, a selection change, a clear, and the time limit', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const documentImpl = fakeDocument();
    const host = documentImpl.createElement('div');
    const sends = [];
    const view = createOshCommandView({ host, documentImpl, client: { targets: async () => ({ enabled: true, targets: [target] }), send: async (body) => sends.push(body) } });
    await view.show({ systemId: 'sys-fixture-one', systemName: 'Fixture drone' });
    byText(host, 'mavRTLControl').click();
    byText(host, 'Cancel').click();
    assert.equal(byText(host, 'Send command'), undefined);
    byText(host, 'mavRTLControl').click();
    await view.show({ systemId: 'sys-fixture-two', systemName: 'Other' });
    assert.equal(byText(host, 'Send command'), undefined);
    await view.show({ systemId: 'sys-fixture-one', systemName: 'Fixture drone' });
    byText(host, 'mavRTLControl').click();
    view.clear();
    assert.equal(host.hidden, true);
    await view.show({ systemId: 'sys-fixture-one', systemName: 'Fixture drone' });
    byText(host, 'mavRTLControl').click();
    mock.timers.tick(30_000);
    assert.equal(byText(host, 'Send command'), undefined);
    assert.equal(sends.length, 0);
  } finally { mock.timers.reset(); }
});

test('[osh-control-016] Show a refused command result', async () => {
  const documentImpl = fakeDocument();
  const host = documentImpl.createElement('div');
  const view = createOshCommandView({ host, documentImpl, client: { targets: async () => ({ enabled: true, targets: [target] }), send: async () => ({ outcome: 'refused', reason: 'command_not_found' }) } });
  await view.show({ systemId: 'sys-fixture-one', systemName: 'Fixture drone' });
  byText(host, 'mavRTLControl').click();
  await byText(host, 'Send command').onclick();
  assert.equal(byText(host, 'command_not_found')?.textContent, 'command_not_found');
});

test('[osh-control-017] Keep the host hidden for a disabled or absent target', async () => {
  const documentImpl = fakeDocument();
  const host = documentImpl.createElement('div');
  let answer = { enabled: false, targets: [target] };
  const view = createOshCommandView({ host, documentImpl, client: { targets: async () => answer, send: async () => { throw new Error('unexpected'); } } });
  await view.show({ systemId: 'sys-fixture-one' });
  assert.equal(host.hidden, true);
  answer = { enabled: true, targets: [target] };
  await view.show({ systemId: 'sys-fixture-two' });
  assert.equal(host.hidden, true);
});

test('[osh-control-017] Ignore an old target answer after `clear()`', async () => {
  const documentImpl = fakeDocument();
  const host = documentImpl.createElement('div');
  let release;
  const view = createOshCommandView({ host, documentImpl, client: { targets: () => new Promise((resolve) => { release = resolve; }), send: async () => { throw new Error('unexpected'); } } });
  const showing = view.show({ systemId: 'sys-fixture-one' });
  view.clear();
  release({ enabled: true, targets: [target] });
  await showing;
  assert.equal(host.hidden, true);
});

test('[osh-control-016] Show a failed command and block a second click while it waits', async () => {
  const documentImpl = fakeDocument();
  const host = documentImpl.createElement('div');
  let release;
  let sends = 0;
  const view = createOshCommandView({ host, documentImpl, client: { targets: async () => ({ enabled: true, targets: [target] }), send: () => { sends += 1; return new Promise((_resolve, reject) => { release = reject; }); } } });
  await view.show({ systemId: 'sys-fixture-one' });
  byText(host, 'mavRTLControl').click();
  const sending = byText(host, 'Send command').onclick();
  byText(host, 'mavRTLControl').click();
  await byText(host, 'Send command').onclick();
  assert.equal(sends, 1);
  release(new Error('fixture failure'));
  await sending;
  assert.equal(byText(host, 'failed')?.textContent, 'failed');
});

test('[osh-control-017] Keep the host hidden when the targets GET fails', async () => {
  const documentImpl = fakeDocument();
  const host = documentImpl.createElement('div');
  const view = createOshCommandView({ host, documentImpl, client: { targets: async () => { throw new Error('fixture failure'); }, send: async () => { throw new Error('unexpected'); } } });
  await assert.doesNotReject(view.show({ systemId: 'sys-fixture-one' }));
  assert.equal(host.hidden, true);
});

test('[osh-control-016 osh-control-017] Show and clear the optional command view with the layer selection', async (t) => {
  const originalDocument = globalThis.document;
  globalThis.document = { addEventListener() {}, removeEventListener() {} };
  let clickAction;
  const originalSetInputAction = Cesium.ScreenSpaceEventHandler.prototype.setInputAction;
  Cesium.ScreenSpaceEventHandler.prototype.setInputAction = function (action, type) {
    if (type === Cesium.ScreenSpaceEventType.LEFT_CLICK) clickAction = action;
    return originalSetInputAction.call(this, action, type);
  };
  let picked = null;
  const camera = { moveEnd: new Cesium.Event(), positionWC: Cesium.Cartesian3.fromDegrees(1, 2, 1_500_000) };
  const viewer = { scene: { canvas: { addEventListener() {}, removeEventListener() {} }, pick() { return picked; } }, camera, dataSources: { add() {}, remove() {} } };
  const events = [];
  const commandView = { show(value) { events.push(['show', value]); }, clear() { events.push(['clear']); } };
  const source = { getSystems: async () => ({ keyRequired: false, systems: [{ id: 'sys-fixture-one', name: 'Fixture drone', lon: 1, lat: 2, alt: 0 }], stale: false }), getDatastreams: async () => ({ keyRequired: false, datastreams: [] }) };
  const layer = createOshLayer({ source, commandView });
  t.after(() => {
    layer.destroy(viewer);
    Cesium.ScreenSpaceEventHandler.prototype.setInputAction = originalSetInputAction;
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  });
  layer.init(viewer);
  layer.enable(viewer);
  assert.equal(await layer.update(), true);
  picked = { id: 'osh:sys-fixture-one' };
  clickAction({ position: {} });
  assert.deepEqual(events.at(-1), ['show', { systemId: 'sys-fixture-one', systemName: 'Fixture drone' }]);
  picked = null;
  clickAction({ position: {} });
  assert.deepEqual(events.at(-1), ['clear']);
});
