import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TILE_RENDER_REASON,
  TILE_RETRY_DELAY_MS,
  createRecentImageryRenderer,
} from './rendering.js';
import { BOX, manualTimers } from './testDoubles.mjs';

/** A provider whose tile requests stay pending until the test settles them. */
class UrlTemplateImageryProvider {
  constructor(options) {
    this.options = options;
    this.calls = [];
    this.pending = [];
  }
  requestImage(x, y, level) {
    this.calls.push([x, y, level]);
    return new Promise((resolve) => this.pending.push(resolve));
  }
}

function fakeCesium(requestImage) {
  class Provider extends UrlTemplateImageryProvider {}
  if (requestImage) Provider.prototype.requestImage = requestImage;
  return {
    UrlTemplateImageryProvider: Provider,
    WebMercatorTilingScheme: class {},
    Rectangle: {
      fromDegrees: (west, south, east, north) => ({ west, south, east, north }),
    },
    SplitDirection: { LEFT: -1, NONE: 0, RIGHT: 1 },
  };
}

function fakeCollection() {
  const layers = [];
  return {
    layers,
    addImageryProvider(provider) {
      const layer = Object.assign(
        Object.create({ alpha: 1, splitDirection: 0 }),
        { provider },
      );
      layers.push(layer);
      return layer;
    },
    remove(layer, destroy) {
      layers.splice(layers.indexOf(layer), 1);
      layer.destroyed = destroy;
    },
  };
}

const S30 = { key: 'S30:2026-09-18', product: 'S30', day: '2026-09-18' };
const L30 = { key: 'L30:2026-09-16', product: 'L30', day: '2026-09-16' };
const VIIRS = { key: 'VIIRS:2026-09-20', product: 'VIIRS', day: '2026-09-20' };

function fixture({ requestImage, maxTileRequests, ...options } = {}) {
  const renders = [];
  const timers = manualTimers();
  const renderer = createRecentImageryRenderer({
    ...options,
    cesium: fakeCesium(requestImage),
    maxTileRequests,
    requestRender: (reason) => renders.push(reason),
    setTimeoutImpl: timers.setTimeoutImpl,
    clearTimeoutImpl: timers.clearTimeoutImpl,
  });
  const globe = fakeCollection();
  renderer.rebind({ collection: globe, kind: 'globe' });
  const tileFrames = () =>
    renders.filter((reason) => reason === TILE_RENDER_REASON).length;
  return { renderer, globe, renders, timers, tileFrames };
}

test('[recent-imagery-018] a slot drapes one GIBS provider bounded to the box; the same day only restyles it', () => {
  const { renderer, globe, renders } = fixture();
  assert.equal(renderer.showSlot('a', S30, BOX, { alpha: 0.8 }), true);
  const [layer] = globe.layers;
  assert.match(
    layer.provider.options.url,
    /^https:\/\/gibs-\{s\}\.earthdata\.nasa\.gov\/.*HLS_S30.*\/2026-09-18\/GoogleMapsCompatible_Level12\/\{z\}\/\{y\}\/\{x\}\.png$/,
  );
  assert.deepEqual(layer.provider.options.subdomains, ['a', 'b', 'c']);
  assert.equal(layer.provider.options.credit, 'NASA GIBS');
  assert.deepEqual(layer.provider.options.rectangle, {
    west: -97.8,
    south: 30.2,
    east: -97.7,
    north: 30.3,
  });
  assert.equal(layer.alpha, 0.8);
  assert.deepEqual(renders, ['recent-imagery-show']);
  assert.deepEqual(renderer.getOwned().a, {
    key: 'S30:2026-09-18',
    kind: 'globe',
    alpha: 0.8,
    split: 'none',
  });
  renderer.showSlot('a', S30, BOX, { alpha: 0.5, splitDirection: 'left' });
  assert.deepEqual(globe.layers, [layer], 'the layer is reused');
  assert.equal(layer.splitDirection, -1);
  // A different day replaces the layer in its own collection.
  renderer.showSlot('a', L30, BOX);
  assert.equal(layer.destroyed, true);
  assert.equal(globe.layers.length, 1);
  // VIIRS is a level-9 JPEG overview with no alpha channel.
  renderer.showSlot('b', VIIRS, BOX, { splitDirection: 'right' });
  assert.equal(globe.layers[1].provider.options.maximumLevel, 9);
  assert.equal(globe.layers[1].provider.options.hasAlphaChannel, false);
  assert.equal(globe.layers[1].splitDirection, 1);
  renderer.setAlpha('b', 7);
  assert.equal(globe.layers[1].alpha, 1, 'alpha clamps to 0–1');
});

test('[recent-imagery-019] rapid replacement never owns more than two layers', () => {
  const { renderer, globe } = fixture();
  const days = [S30, L30, VIIRS];
  for (let i = 0; i < 10; i += 1) {
    renderer.showSlot('a', days[i % 3], BOX);
    renderer.showSlot('b', days[(i + 1) % 3], BOX);
    if (i % 4 === 0) renderer.hideSlot('a');
    assert.ok(globe.layers.length <= 2 && renderer.ownedCount() <= 2);
  }
  renderer.hideSlot('a');
  renderer.hideSlot('b');
  assert.equal(globe.layers.length, 0);
});

test('[recent-imagery-020] rebind rebuilds the owned layers on the new host and leaves the old one empty', () => {
  const { renderer, globe } = fixture();
  renderer.showSlot('a', S30, BOX, { alpha: 0.6, splitDirection: 'left' });
  renderer.showSlot('b', L30, BOX, { splitDirection: 'right' });
  const tileset = fakeCollection();
  renderer.rebind({ collection: tileset, kind: 'tileset' });
  assert.equal(globe.layers.length, 0);
  assert.deepEqual(
    tileset.layers.map((layer) => [layer.alpha, layer.splitDirection]),
    [
      [0.6, -1],
      [1, 1],
    ],
  );
  assert.equal(renderer.getOwned().a.kind, 'tileset');
  renderer.rebind({ collection: null, kind: 'none' });
  assert.equal(tileset.layers.length, 0);
  assert.equal(renderer.showSlot('a', S30, BOX), false);
  renderer.rebind({ collection: globe, kind: 'globe' });
  renderer.showSlot('a', S30, BOX);
  renderer.destroy();
  assert.equal(globe.layers.length, 0);
  assert.equal(renderer.showSlot('a', S30, BOX), false, 'destroyed');
});

test('[recent-imagery-021] above the tile limit a request defers silently; its settlement asks for exactly one frame', async () => {
  const { renderer, globe, timers, tileFrames } = fixture({
    maxTileRequests: 1,
  });
  renderer.showSlot('a', S30, BOX);
  const { provider } = globe.layers[0];
  const first = provider.requestImage(0, 0, 1);
  assert.ok(first instanceof Promise);
  for (let i = 1; i <= 120; i += 1)
    assert.equal(provider.requestImage(i, 0, 1), undefined);
  assert.equal(provider.calls.length, 1, 'deferred requests never go out');
  assert.equal(tileFrames(), 0, 'a deferral asks for no frame');
  assert.equal(timers.armed(), 0);
  provider.pending[0]('tile');
  await first;
  assert.equal(tileFrames(), 1, 'the settlement asks for the retry frame');
  assert.ok(provider.requestImage(200, 0, 1) instanceof Promise);
});

test('[recent-imagery-022] upstream deferrals from both slots share one delayed retry frame; destroy disarms it', () => {
  let throwNext = false;
  const { renderer, globe, timers, tileFrames } = fixture({
    maxTileRequests: 1,
    requestImage() {
      if (throwNext) throw new Error('boom');
      return undefined;
    },
  });
  renderer.showSlot('a', S30, BOX);
  renderer.showSlot('b', L30, BOX);
  for (const { provider } of globe.layers)
    for (let i = 0; i < 40; i += 1)
      assert.equal(provider.requestImage(i, 0, 0), undefined);
  // Every deferral released its slot (the limit is one), and none asked
  // for a frame of its own: one timer holds the single retry.
  assert.equal(tileFrames(), 0);
  assert.equal(timers.armed(), 1);
  assert.equal([...timers.pending.values()][0].ms, 250);
  timers.flush();
  assert.equal(tileFrames(), 1);
  // A throwing provider releases its slot too.
  throwNext = true;
  assert.throws(() => globe.layers[0].provider.requestImage(0, 0, 0), /boom/);
  throwNext = false;
  globe.layers[0].provider.requestImage(0, 0, 0);
  assert.equal(timers.armed(), 1, 'the next deferral arms a fresh timer');
  renderer.destroy();
  assert.equal(timers.armed(), 0, 'destroy disarms the retry');
  assert.equal(tileFrames(), 1);
});

test('[recent-imagery-018] against the basemap slot a splits left with no second layer, and leaving the swipe only restyles it', () => {
  const { renderer, globe, renders } = fixture();
  renderer.showSlot('a', S30, BOX, { splitDirection: 'left' });
  renderer.hideSlot('b');
  assert.equal(globe.layers.length, 1, 'the basemap is the right side');
  assert.equal(globe.layers[0].splitDirection, -1);
  assert.equal(renderer.getOwned().b, null);
  const [layer] = globe.layers;
  renderer.showSlot('a', S30, BOX, { splitDirection: 'none' });
  assert.deepEqual(globe.layers, [layer], 'no rebuild for a new look');
  assert.equal(layer.splitDirection, 0);
  assert.deepEqual(renders, ['recent-imagery-show', 'recent-imagery-look']);
});

test('[recent-imagery-018 recent-imagery-020] invalid slot input and host changes release the owned images', () => {
  const f = fixture();
  assert.equal(f.renderer.showSlot('a', null, BOX), false);
  assert.equal(f.renderer.showSlot('a', S30, null), false);
  f.renderer.showSlot('a', S30, BOX, { alpha: 'bad', splitDirection: 'bad' });
  const layer = f.globe.layers[0];
  assert.equal(Object.hasOwn(layer, 'alpha'), true);
  assert.equal(layer.alpha, 1);
  assert.equal(layer.splitDirection, 0);
  f.renderer.setAlpha('a', 0.25);
  assert.equal(layer.alpha, 0.25);
  assert.equal(f.renders.at(-1), 'recent-imagery-alpha');
  f.globe.remove = () => {
    throw new Error('gone');
  };
  f.renderer.rebind(null);
  assert.equal(f.renderer.ownedCount(), 0);
  f.renderer.destroy();
  f.renderer.destroy();
  assert.equal(f.renderer.showSlot('a', S30, BOX), false);
});

test('[recent-imagery-018] an absent split enum sets a zero value on the slot itself', () => {
  const cesium = fakeCesium();
  delete cesium.SplitDirection;
  const renderer = createRecentImageryRenderer({ cesium });
  const collection = fakeCollection();
  renderer.rebind({ collection, kind: 'globe' });
  renderer.showSlot('a', S30, BOX);
  assert.equal(Object.hasOwn(collection.layers[0], 'splitDirection'), true);
  assert.equal(collection.layers[0].splitDirection, 0);
  renderer.destroy();
});

test('[recent-imagery-019] a replacement destroys the old layer in both slots', () => {
  const f = fixture();
  for (const slot of ['a', 'b']) {
    f.renderer.showSlot(slot, S30, BOX);
    const layer = f.globe.layers.at(-1);
    f.renderer.showSlot(slot, L30, BOX);
    assert.equal(layer.destroyed, true);
  }
  f.renderer.destroy();
  assert.equal(f.globe.layers.length, 0);
});

test('[recent-imagery-022] the default provider returns undefined and the renderer owns zero layers', async () => {
  const renderer = createRecentImageryRenderer({
    cesium: fakeCesium(() => undefined),
  });
  const collection = fakeCollection();
  renderer.rebind({ collection, kind: 'globe' });
  renderer.showSlot('a', S30, BOX);
  assert.equal(collection.layers[0].provider.requestImage(0, 0, 0), undefined);
  await new Promise((resolve) => setTimeout(resolve, 260));
  assert.equal(collection.layers[0].provider.requestImage(0, 0, 0), undefined);
  renderer.destroy();
  assert.equal(renderer.ownedCount(), 0);
});

test('[recent-imagery-018] a change to west replaces the provider', async () => {
  const f = fixture();
  f.renderer.showSlot('a', S30, BOX);
  const first = f.globe.layers[0];
  f.renderer.showSlot('a', S30, { ...BOX, west: -97.81 });
  assert.equal(first.destroyed, true);
  assert.equal(f.globe.layers.length, 1);
  assert.equal(f.globe.layers[0].provider.options.rectangle.west, -97.81);
  f.renderer.destroy();
});

test('[recent-imagery-018] a change to south replaces the provider', async () => {
  const f = fixture();
  f.renderer.showSlot('a', S30, BOX);
  const first = f.globe.layers[0];
  f.renderer.showSlot('a', S30, { ...BOX, south: 30.19 });
  assert.equal(first.destroyed, true);
  assert.equal(f.globe.layers.length, 1);
  assert.equal(f.globe.layers[0].provider.options.rectangle.south, 30.19);
  f.renderer.destroy();
});

test('[recent-imagery-018] a change to east replaces the provider', async () => {
  const f = fixture();
  f.renderer.showSlot('a', S30, BOX);
  const first = f.globe.layers[0];
  f.renderer.showSlot('a', S30, { ...BOX, east: -97.69 });
  assert.equal(first.destroyed, true);
  assert.equal(f.globe.layers.length, 1);
  assert.equal(f.globe.layers[0].provider.options.rectangle.east, -97.69);
  f.renderer.destroy();
});

test('[recent-imagery-018] a change to north replaces the provider', async () => {
  const f = fixture();
  f.renderer.showSlot('a', S30, BOX);
  const first = f.globe.layers[0];
  f.renderer.showSlot('a', S30, { ...BOX, north: 30.31 });
  assert.equal(first.destroyed, true);
  assert.equal(f.globe.layers.length, 1);
  assert.equal(f.globe.layers[0].provider.options.rectangle.north, 30.31);
  f.renderer.destroy();
});

test('[recent-imagery-020] a host change moves slot a alone', () => {
  const f = fixture();
  f.renderer.showSlot('a', S30, BOX);
  const old = f.globe.layers[0];
  const next = fakeCollection();
  f.renderer.rebind({ collection: next, kind: 'tileset' });
  assert.equal(old.destroyed, true);
  assert.equal(f.globe.layers.length, 0);
  assert.equal(next.layers.length, 1);
  f.renderer.destroy();
});

test('[recent-imagery-020] a host change moves slot b alone', () => {
  const f = fixture();
  f.renderer.showSlot('b', S30, BOX);
  const old = f.globe.layers[0];
  const next = fakeCollection();
  f.renderer.rebind({ collection: next, kind: 'tileset' });
  assert.equal(old.destroyed, true);
  assert.equal(f.globe.layers.length, 0);
  assert.equal(next.layers.length, 1);
  f.renderer.destroy();
});

test('[recent-imagery-018] an alpha change alone updates the current image', async () => {
  const f = fixture();
  f.renderer.showSlot('a', S30, BOX, { alpha: 0.8 });
  f.renderer.showSlot('a', S30, BOX, { alpha: 0.5 });
  assert.equal(f.globe.layers[0].alpha, 0.5);
  f.renderer.destroy();
});

test('[recent-imagery-018] an empty slot ignores an alpha change', async () => {
  const f = fixture();
  assert.doesNotThrow(() => f.renderer.setAlpha('a', 0.5));
  assert.deepEqual(f.renders, []);
  f.renderer.destroy();
});

test('[recent-imagery-018] the same alpha value does not add a frame', async () => {
  const f = fixture();
  f.renderer.showSlot('a', S30, BOX, { alpha: 0.5 });
  f.renderer.setAlpha('a', 0.5);
  assert.deepEqual(f.renders, ['recent-imagery-show']);
  f.renderer.destroy();
});

test('[recent-imagery-020] the same host does not change the current image', async () => {
  const f = fixture();
  f.renderer.showSlot('a', S30, BOX);
  f.renderer.rebind({ collection: f.globe, kind: 'globe' });
  assert.deepEqual(f.renders, ['recent-imagery-show']);
  assert.equal(f.globe.layers.length, 1);
  f.renderer.destroy();
});

test('[recent-imagery-020] a host collection change replaces the current slot', async () => {
  const f = fixture(),
    host = { collection: f.globe, kind: 'globe' };
  f.renderer.rebind(host);
  f.renderer.showSlot('a', S30, BOX);
  const next = fakeCollection();
  host.collection = next;
  f.renderer.showSlot('a', S30, BOX);
  assert.equal(f.globe.layers.length, 0);
  assert.equal(next.layers.length, 1);
  f.renderer.destroy();
});

test('[recent-imagery-019] an A image alone asks for a frame at renderer destruction', () => {
  const f = fixture();
  f.renderer.showSlot('a', S30, BOX);
  f.renderer.destroy();
  assert.deepEqual(f.renders, [
    'recent-imagery-show',
    'recent-imagery-destroy',
  ]);
});

test('[recent-imagery-019] a destroyed renderer still rejects an image after a host update', () => {
  const f = fixture();
  f.renderer.destroy();
  f.renderer.rebind({ collection: f.globe, kind: 'globe' });
  assert.equal(f.renderer.showSlot('a', S30, BOX), false);
  assert.equal(f.globe.layers.length, 0);
});

test('replacement imagery uses source-owned tile URLs and credit and tears down normally', () => {
  const { renderer, globe } = fixture({
    tileTemplate: (product, day) =>
      `https://tiles.example/${product}/${day}/{z}/{x}/{y}`,
    credit: 'Example imagery',
  });
  assert.equal(renderer.showSlot('a', S30, BOX), true);
  const layer = globe.layers[0];
  assert.equal(
    layer.provider.options.url,
    'https://tiles.example/S30/2026-09-18/{z}/{x}/{y}',
  );
  assert.equal(layer.provider.options.credit, 'Example imagery');
  renderer.destroy();
  assert.equal(globe.layers.length, 0);
  assert.equal(layer.destroyed, true);
});
