import assert from 'node:assert/strict';
import test from 'node:test';
import * as Cesium from 'cesium';
import { createGhostMapsLayer } from './index.js';
import { createApplicationGhostMaps } from '../../app/layers/ghostMaps.js';

function element(localName, children = [], value = '', attributes = {}) {
  const node = {
    localName,
    children,
    get textContent() {
      return value + children.map((child) => child.textContent).join('');
    },
    getAttribute: (key) => attributes[key] ?? null,
    getElementsByTagName(name) {
      return children.flatMap((child) => [
        ...(name === '*' || name === child.localName ? [child] : []),
        ...child.getElementsByTagName(name),
      ]);
    },
  };
  for (const child of children) child.parentElement = node;
  return node;
}

function documentFixture() {
  return element('document', [
    element('kml', [
      element('Document', [
        element(
          'Style',
          [
            element('IconStyle', [
              element('Icon', [element('href', [], 'icon.png')]),
            ]),
          ],
          '',
          { id: 'pin' },
        ),
        element('Placemark', [
          element('name', [], 'Test report'),
          element('styleUrl', [], '#pin'),
          element('Point', [element('coordinates', [], '12,34')]),
        ]),
      ]),
    ]),
  ]);
}

// A stored KMZ with a local icon; the XML DOM double supplies its one point.
function fixtureKmz(
  files = [
    ['doc.kml', '<kml/>'],
    ['icon.png', 'packed icon'],
  ],
) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const [name, value] of files) {
    const key = Buffer.from(name);
    const bytes = Buffer.from(value);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50);
    header.writeUInt32LE(bytes.length, 18);
    header.writeUInt32LE(bytes.length, 22);
    header.writeUInt16LE(key.length, 26);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50);
    directory.writeUInt32LE(bytes.length, 20);
    directory.writeUInt32LE(bytes.length, 24);
    directory.writeUInt16LE(key.length, 28);
    directory.writeUInt32LE(offset, 42);
    local.push(header, key, bytes);
    central.push(directory, key);
    offset += header.length + key.length + bytes.length;
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return new Uint8Array(Buffer.concat([...local, directory, end]));
}

function fixture(
  t,
  {
    beforeFileReturns,
    onCreateUrl,
    document: documentOverride,
    files,
    options = {},
    catalog: catalogOverride,
    onAdd,
    factory = createGhostMapsLayer,
  } = {},
) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'DOMParser');
  globalThis.DOMParser = class {
    parseFromString() {
      return documentOverride || documentFixture();
    }
  };
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'DOMParser', previous);
    else delete globalThis.DOMParser;
  });
  const created = [];
  const revoked = [];
  t.mock.method(URL, 'createObjectURL', () => {
    const url = `blob:local-${created.length}`;
    created.push(url);
    onCreateUrl?.(layer);
    return url;
  });
  t.mock.method(URL, 'revokeObjectURL', (url) => revoked.push(url));
  t.mock.method(console, 'warn', () => {});
  const mounted = new Set();
  const viewer = {
    scene: { requestRender() {} },
    dataSources: {
      async add(dataSource) {
        onAdd?.(dataSource);
        mounted.add(dataSource);
        return dataSource;
      },
      remove(dataSource) {
        return mounted.delete(dataSource);
      },
    },
  };
  const layer = factory({
    storage: null,
    source: {
      getCatalog: async () => ({
        ...catalogOverride,
        products: catalogOverride?.products || [
          { id: 'cip', version: 'a'.repeat(40), defaultOn: true },
        ],
      }),
      getFile: async () => {
        beforeFileReturns?.(layer);
        return fixtureKmz(files);
      },
    },
    ...options,
  });
  layer.init(viewer);
  layer.enable();
  t.after(() => layer.destroy());
  return { layer, viewer, mounted, created, revoked };
}

test('[ghostmaps-029] cancelling a file read does not allocate packed-image URLs', async (t) => {
  const { layer, viewer, mounted, created, revoked } = fixture(t, {
    beforeFileReturns: (layer) => queueMicrotask(() => layer.disable()),
  });
  await layer.update(viewer);
  assert.equal(created.length, 0);
  assert.equal(revoked.length, 0);
  assert.equal(mounted.size, 0);
});

test('[ghostmaps-029] cancellation during parsing releases every packed-image URL', async (t) => {
  const { layer, viewer, mounted, created, revoked } = fixture(t, {
    onCreateUrl: (layer) => layer.disable(),
  });
  await layer.update(viewer);
  assert.equal(created.length, 1);
  assert.deepEqual(revoked, created);
  assert.equal(mounted.size, 0);
});

test('[ghostmaps-029] entity construction failure releases parsed image URLs', async (t) => {
  const { layer, viewer, mounted, created, revoked } = fixture(t);
  t.mock.method(Cesium.EntityCollection.prototype, 'add', () => {
    throw new Error('fixture entity failure');
  });
  await layer.update(viewer);
  assert.equal(created.length, 1);
  assert.deepEqual(revoked, created);
  assert.equal(mounted.size, 0);
  assert.equal(layer.getStats().error, 'fixture entity failure');
});

test('[ghostmaps-030] successful load keeps icons until the product is disabled', async (t) => {
  const { layer, viewer, mounted, created, revoked } = fixture(t);
  await layer.update(viewer);
  assert.equal(created.length, 1);
  assert.equal(revoked.length, 0);
  assert.equal(mounted.size, 1);
  assert.equal(layer.getStats().count, 1);
  layer.disable();
  assert.deepEqual(revoked, created);
  assert.equal(mounted.size, 0);
});

const textNode = (name, value) => element(name, [], value);
const pointNode = (value = '12,34') =>
  element('Point', [textNode('coordinates', value)]);
const lineNode = () =>
  element('LineString', [textNode('coordinates', '0,0 4,4')]);
const polygonNode = () =>
  element('Polygon', [
    element('outerBoundaryIs', [
      element('LinearRing', [textNode('coordinates', '0,0 6,0 6,6')]),
    ]),
    element('innerBoundaryIs', [
      element('LinearRing', [textNode('coordinates', '1,1 2,1 2,2')]),
    ]),
  ]);
const reportDoc = ({
  name = 'Report',
  folder = 'Folder',
  description = '',
  geometry = pointNode(),
  styles = [],
  style = null,
} = {}) =>
  element('document', [
    element('Document', [
      textNode('name', folder),
      ...styles,
      element('Placemark', [
        textNode('name', name),
        textNode('description', description),
        ...(style ? [style] : []),
        geometry,
      ]),
    ]),
  ]);
const plainProduct = (id = 'cip', version = 'a') => ({
  id,
  version,
  defaultOn: true,
  fileTitle: 'Edition',
  title: 'Custom product',
});
const settleLayer = () => new Promise((resolve) => setImmediate(resolve));

function selectionFixture(t, config = {}) {
  const published = [];
  const opened = [];
  const owners = [];
  let picked = { id: 'ghostmaps:cip:0:0' };
  let hit = null;
  let free = true;
  let click;
  let destroyed = 0;
  const controls = {
    overlayHost: {
      setEntries: (source, entries, options) =>
        published.push({ source, entries, options }),
      setVisible: (source, visible) => {
        controls.visible = [source, visible];
      },
      hitTest: () => hit,
    },
    screenSpaceEventHandlerFactory: () => ({
      setInputAction: (fn, type) => {
        assert.equal(type, 2);
        click = fn;
      },
      destroy: () => {
        destroyed++;
      },
    }),
    picking: {
      registerPickOwner: (id, predicate) => owners.push({ id, predicate }),
      unregisterPickOwner: (id) => {
        controls.unregistered = id;
      },
      resolvePickId: (value) => value.id,
      isOwnedByOtherLayer: (_id, value) => value === 'other',
    },
    pointer: { isPointerFree: () => free },
    openExternal: (url) => opened.push(url),
    ...config.options,
  };
  const h = fixture(t, {
    document: reportDoc(config),
    catalog: { products: [plainProduct(config.productId)] },
    ...config,
    options: controls,
  });
  h.viewer.scene.pick = () => picked;
  return {
    ...h,
    published,
    opened,
    owners,
    controls,
    click: (value = { id: 'ghostmaps:cip:0:0' }) => {
      picked = value;
      click({ position: { x: 8, y: 9 } });
    },
    hit: (value) => {
      hit = value;
    },
    free: (value) => {
      free = value;
    },
    card: () => published.at(-1)?.entries[0],
    destroyed: () => destroyed,
  };
}

test('[ghostmaps-030] The layer creates point line and polygon entities', async (t) => {
  const geometry = element('MultiGeometry', [
    pointNode(),
    lineNode(),
    polygonNode(),
  ]);
  const h = fixture(t, { document: reportDoc({ geometry }) });
  await h.layer.update();
  const ds = [...h.mounted][0];
  assert.equal(ds.name, 's2-ghostmaps:cip');
  assert.equal(ds.entities.values.length, 4);
  const [pin, line, poly, outline] = ds.entities.values;
  assert.equal(pin.id, 'ghostmaps:cip:0:0');
  assert.equal(pin.billboard.heightReference.getValue(), 1);
  assert.equal(pin.billboard.disableDepthTestDistance.getValue(), Infinity);
  assert.equal(pin.billboard.scale.getValue(), 0.7);
  assert.equal(line.polyline.width.getValue(), 2);
  assert.equal(line.polyline.clampToGround.getValue(), true);
  assert.equal(poly.polygon.hierarchy.getValue().holes.length, 1);
  assert.equal(poly.polygon.material.color.getValue().alpha, 0.25);
  assert.equal(outline.id, 'ghostmaps:cip:0:2:outline');
  assert.equal(outline.polyline.width.getValue(), 2);
  assert.deepEqual(h.layer.getAnalystRecords(), [
    { product: 'cip', name: 'Report', folder: 'Folder', lon: 12, lat: 34 },
  ]);
  assert.deepEqual(h.layer.getAnalystRecords(0), []);
});

for (const [name, geometry, lon, lat] of [
  ['line', lineNode, 2, 2],
  ['polygon', polygonNode, 4, 2],
]) {
  test(`[ghostmaps-030] The layer anchors a ${name} at its mean coordinates`, async (t) => {
    const h = fixture(t, { document: reportDoc({ geometry: geometry() }) });
    await h.layer.update();
    assert.deepEqual(h.layer.getAnalystRecords(), [
      { product: 'cip', name: 'Report', folder: 'Folder', lon, lat },
    ]);
  });
}

for (const [name, style, expected] of [
  [
    'line width',
    element('Style', [
      element('LineStyle', [
        textNode('width', '20'),
        textNode('color', 'ff0000ff'),
      ]),
    ]),
    { width: 8, outline: 6, alpha: 0.25 },
  ],
  [
    'polygon color',
    element('Style', [element('PolyStyle', [textNode('color', '8000ff00')])]),
    { width: 2, outline: 2, alpha: 128 / 255 },
  ],
  [
    'polygon fill',
    element('Style', [element('PolyStyle', [textNode('fill', '0')])]),
    { width: 2, outline: 2, alpha: 0 },
  ],
  [
    'polygon outline',
    element('Style', [element('PolyStyle', [textNode('outline', '0')])]),
    { width: 2, outline: null, alpha: 0.25 },
  ],
]) {
  test(`[ghostmaps-030] The layer applies the ${name}`, async (t) => {
    const h = fixture(t, {
      document: reportDoc({
        geometry: element('MultiGeometry', [lineNode(), polygonNode()]),
        style,
      }),
    });
    await h.layer.update();
    const entities = [...h.mounted][0].entities.values;
    assert.equal(entities[0].polyline.width.getValue(), expected.width);
    assert.equal(
      entities[1].polygon.material.color.getValue().alpha,
      expected.alpha,
    );
    assert.equal(
      entities[2]?.polyline.width.getValue() ?? null,
      expected.outline,
    );
    if (name === 'line width')
      assert.equal(entities[0].polyline.material.color.getValue().red, 1);
  });
}

for (const [name, href, size, expected] of [
  ['packed icon', 'icon.png', 4, true],
  ['absent icon', 'absent.png', 4, false],
  ['large icon', 'icon.png', 524289, false],
  ['maximum icon', 'icon.png', 524288, true],
]) {
  test(`[ghostmaps-030] The layer checks the ${name}`, async (t) => {
    const style = element('Style', [
      element('IconStyle', [
        element('Icon', [textNode('href', href)]),
        textNode('color', 'ff0000ff'),
        textNode('scale', '4'),
      ]),
    ]);
    const h = fixture(t, {
      document: reportDoc({ style }),
      files: [
        ['doc.kml', '<kml/>'],
        ['icon.png', 'x'.repeat(size)],
      ],
    });
    await h.layer.update();
    const pin = [...h.mounted][0].entities.values[0];
    assert.equal(h.created.length, expected ? 1 : 0);
    if (expected) assert.equal(pin.billboard.image.getValue(), 'blob:local-0');
    assert.equal(pin.billboard.scale.getValue(), 1.5);
    assert.equal(
      pin.billboard.color?.getValue().red ?? null,
      expected ? 1 : null,
    );
  });
}

test('[ghostmaps-030] The layer uses a canvas marker and caches its image', async (t) => {
  const old = Object.getOwnPropertyDescriptor(globalThis, 'document');
  let canvases = 0;
  const context = { beginPath() {}, arc() {}, fill() {}, stroke() {} };
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      createElement: () => {
        canvases++;
        return { getContext: () => context, toDataURL: () => 'data:marker' };
      },
    },
  });
  t.after(() =>
    old
      ? Object.defineProperty(globalThis, 'document', old)
      : delete globalThis.document,
  );
  const h = fixture(t, {
    document: reportDoc({
      geometry: element('MultiGeometry', [pointNode(), pointNode()]),
    }),
    catalog: { products: [plainProduct('iran-cip')] },
  });
  await h.layer.update();
  assert.equal(canvases, 1);
  assert.equal(
    [...h.mounted][0].entities.values[0].billboard.image.getValue(),
    'data:marker',
  );
  assert.equal(context.fillStyle, '#39d0ff');
});

test('[ghostmaps-029] A KMZ without a KML document reports an error', async (t) => {
  const h = fixture(t, { files: [['icon.png', 'x']] });
  await h.layer.update();
  assert.equal(h.layer.getStats().error, 'That KMZ holds no KML document.');
  assert.equal(h.mounted.size, 0);
});

test('[ghostmaps-031] A chip change stores the whole current selection', async (t) => {
  const writes = [];
  const h = fixture(t, {
    options: {
      storage: { getItem: () => null, setItem: (...args) => writes.push(args) },
    },
  });
  await h.layer.update();
  h.layer.getRowControls().chips[0].onClick();
  await settleLayer();
  assert.deepEqual(writes, [['gev.ghostmaps.products', '[]']]);
  assert.equal(h.mounted.size, 0);
  h.layer.getRowControls().chips[0].onClick();
  await settleLayer();
  assert.deepEqual(writes[1], ['gev.ghostmaps.products', '["cip"]']);
  assert.equal(h.mounted.size, 1);
});

for (const [name, getItem, active] of [
  ['empty list', () => '[]', false],
  ['id list', () => '["cip"]', true],
  ['invalid JSON', () => '{', true],
  ['object', () => '{}', true],
  [
    'blocked storage',
    () => {
      throw new Error('blocked');
    },
    true,
  ],
]) {
  test(`[ghostmaps-031] The layer reads the ${name} case from storage`, async (t) => {
    const h = fixture(t, {
      options: {
        storage: {
          getItem,
          setItem() {
            throw new Error('blocked');
          },
        },
      },
    });
    await h.layer.update();
    assert.equal(h.layer.getRowControls().chips[0].active, active);
    h.layer.getRowControls().chips[0].onClick();
    assert.equal(h.layer.getRowControls().chips[0].active, !active);
    await settleLayer();
  });
}

test('[ghostmaps-032] The layer replaces a changed product after it adds the new data', async (t) => {
  let catalog = { products: [plainProduct()] };
  const order = [];
  const h = fixture(t, {
    options: {
      source: {
        getCatalog: async () => catalog,
        getFile: async () => fixtureKmz(),
      },
    },
  });
  const add = h.viewer.dataSources.add;
  h.viewer.dataSources.add = async (ds) => {
    order.push('add');
    return add(ds);
  };
  const remove = h.viewer.dataSources.remove;
  h.viewer.dataSources.remove = (ds) => {
    order.push('remove');
    return remove(ds);
  };
  await h.layer.update();
  await h.layer.update();
  assert.deepEqual(order, ['add']);
  catalog = { products: [plainProduct('cip', 'b')] };
  await h.layer.update();
  assert.deepEqual(order, ['add', 'add', 'remove']);
  assert.equal(h.mounted.size, 1);
  catalog = { products: [] };
  await h.layer.update();
  assert.equal(h.mounted.size, 0);
});

test('[ghostmaps-032] A disabled layer rejects updates and removes its records', async (t) => {
  let catalogs = 0;
  const h = fixture(t, {
    options: {
      source: {
        getCatalog: async () => {
          catalogs++;
          return { products: [plainProduct()] };
        },
        getFile: async () => fixtureKmz(),
      },
    },
  });
  await h.layer.update();
  h.layer.disable();
  assert.equal(await h.layer.update(), false);
  assert.equal(catalogs, 1);
  assert.deepEqual(h.layer.getAnalystRecords(), []);
  assert.throws(() => h.layer.init(h.viewer), /already initialized/);
});

test('[ghostmaps-032] The layer rejects an absent catalog source', () => {
  assert.throws(() => createGhostMapsLayer(), /catalog source/);
  assert.throws(() => createGhostMapsLayer({ source: {} }), /catalog source/);
});

test('[ghostmaps-032] An aborted signal rejects the catalog update', async (t) => {
  const h = fixture(t);
  assert.equal(
    await h.layer.update(null, { signal: AbortSignal.abort() }),
    false,
  );
  assert.equal(h.mounted.size, 0);
});

for (const name of ['late catalog', 'late error', 'signal error']) {
  test(`[ghostmaps-032] The layer rejects a ${name} after cancellation`, async (t) => {
    const controller = new AbortController();
    let h;
    h = fixture(t, {
      options: {
        source: {
          getCatalog: async () => {
            if (name === 'signal error') controller.abort();
            else h.layer.disable();
            if (name !== 'late catalog') throw new Error('late');
            return { products: [] };
          },
        },
      },
    });
    assert.equal(
      await h.layer.update(null, { signal: controller.signal }),
      false,
    );
    assert.equal(h.mounted.size, 0);
  });
}

for (const [name, error, expected] of [
  ['template', { template: 'Template', message: 'Message' }, 'Template'],
  ['message', { message: 'Message' }, 'Message'],
  ['default text', null, 'GhostMaps file could not be read'],
]) {
  test(`[ghostmaps-034] A file error uses its ${name}`, async (t) => {
    const h = fixture(t, {
      options: {
        source: {
          getCatalog: async () => ({ products: [plainProduct()] }),
          getFile: async () => {
            throw error;
          },
        },
      },
    });
    await h.layer.update();
    assert.equal(h.layer.getStats().error, expected);
    const chip = h.layer.getRowControls().chips[0];
    assert.equal(chip.state, 'error');
    assert.equal(chip.title, `Edition · ${expected}`);
    assert.equal(chip.busy, false);
  });
}

for (const [name, error, expected] of [
  ['message', new Error('Catalog error'), 'Catalog error'],
  ['default text', null, 'GhostMaps catalog unavailable'],
]) {
  test(`[ghostmaps-034] A catalog error uses its ${name}`, async (t) => {
    const h = fixture(t, {
      options: {
        source: {
          getCatalog: async () => {
            throw error;
          },
        },
      },
    });
    assert.equal(await h.layer.update(), true);
    assert.equal(h.layer.getStats().error, expected);
  });
}

test('[ghostmaps-034] The layer reports initial state and live stream data', async (t) => {
  let onCatalog;
  let onState;
  let subscriptions = 0;
  let stops = 0;
  let rows = 0;
  const h = fixture(t, {
    options: {
      source: {
        getCatalog: async () => ({ products: [] }),
        subscribe: (catalog, state) => {
          subscriptions++;
          onCatalog = catalog;
          onState = state;
          return () => {
            stops++;
          };
        },
      },
    },
  });
  h.layer.setRowControlsListener(() => rows++);
  assert.equal(h.layer.id, 's2-ghostmaps');
  assert.equal(h.layer.updateInterval, 300000);
  assert.equal(h.layer.getRowControls().chips.length, 0);
  assert.match(h.layer.getRowControls().info, /Connecting/);
  assert.deepEqual(h.layer.getStats(), {
    count: 0,
    products: [],
    commit: null,
    lastUpdate: null,
    checkedAt: null,
    stream: 'closed',
    loading: false,
    error: null,
    fallback: false,
  });
  h.layer.enable();
  assert.equal(subscriptions, 1);
  onState('closed');
  assert.equal(rows, 0);
  onState('open');
  onCatalog({
    products: [],
    commit: '123456789',
    committedAt: 100,
    changedAt: 200,
    checkedAt: 300,
    pollMs: 20000,
    message: 'Update',
  });
  await settleLayer();
  assert.match(
    h.layer.getRowControls().info,
    /LIVE · GitHub 1234567 · Update · checked every 20s/,
  );
  assert.equal(h.layer.getStats().lastUpdate, 100);
  assert.equal(h.layer.getStats().checkedAt, 300);
  onCatalog({ products: [], commit: '123456789', changedAt: 200 });
  await settleLayer();
  assert.match(h.layer.getRowControls().info, /checked every 15s/);
  assert.match(h.layer.getRowControls().info, /—/);
  assert.equal(h.layer.getStats().lastUpdate, 200);
  onState('connecting');
  assert.match(h.layer.getRowControls().info, /reconnecting/);
  assert.match(h.layer.getRowControls().info, /—/);
  onCatalog({
    products: [],
    commit: '123456789',
    message: 'Other',
    error: 'Remote error',
  });
  await settleLayer();
  assert.match(h.layer.getRowControls().info, /Other/);
  assert.equal(h.layer.getStats().error, 'Remote error');
  h.layer.disable();
  onCatalog({ products: [], commit: 'ignored' });
  assert.equal(h.layer.getStats().commit, '123456789');
  assert.equal(stops, 1);
});

test('[ghostmaps-033] A selected marker publishes a card and opens its source link', async (t) => {
  const h = selectionFixture(t, {
    description:
      '<tr><td>Note</td><td>Detail</td></tr><tr><td>Research</td><td><a href="https://a.test/">https://a.test/</a></td></tr><tr><td>Other</td><td><a href="https://b.test/">https://b.test/</a></td></tr>',
  });
  await h.layer.update();
  h.click();
  const card = h.card();
  assert.equal(h.owners[0].id, 's2-ghostmaps');
  assert.equal(h.owners[0].predicate('ghostmaps:cip:0:0'), true);
  assert.equal(h.owners[0].predicate('other'), false);
  assert.equal(h.owners[0].predicate(8), false);
  assert.equal(card.id, 'ghostmaps-card:cip:0');
  assert.equal(card.title, 'S2 · Report');
  assert.deepEqual(card.details, [
    'Intel Picture · Folder',
    'Note: Detail',
    '2 source links ↗ · click card to open the first',
  ]);
  assert.equal(card.accent, '#c8ff00');
  assert.equal(card.stateless, true);
  assert.equal(card.horizonCull, true);
  assert.equal(card.interactive, true);
  assert.equal(card.activate(), true);
  assert.deepEqual(h.opened, ['https://a.test/']);
  assert.deepEqual(h.published.at(-1).options, {
    cohortLimit: 1,
    collisionCapacity: 1,
    moving: false,
  });
  assert.deepEqual(h.controls.visible, ['s2-ghostmaps', true]);
  h.hit({ entryId: 'ghostmaps-card:cip:0' });
  h.click();
  assert.deepEqual(h.opened, ['https://a.test/', 'https://a.test/']);
  h.layer.disable();
  assert.equal(h.published.at(-1).entries.length, 0);
  assert.equal(h.controls.unregistered, 's2-ghostmaps');
  assert.equal(h.destroyed(), 1);
});

for (const [name, picked] of [
  ['number', { id: 8 }],
  ['foreign prefix', { id: 'other' }],
  ['lookalike prefix', { id: 'xxxxxxxxxxcip:0:0' }],
  ['absent index', { id: 'ghostmaps:cip:9:0' }],
  ['empty ground', null],
  ['empty id', { id: '' }],
]) {
  test(`[ghostmaps-033] The card closes for the ${name} pick`, async (t) => {
    const h = selectionFixture(t);
    await h.layer.update();
    h.click();
    assert.equal(h.card().title, 'S2 · Report');
    h.controls.picking.isOwnedByOtherLayer = () => false;
    h.click(picked);
    assert.equal(h.card(), undefined);
  });
}

test('[ghostmaps-033] The pointer owner and foreign picks keep the current card', async (t) => {
  const h = selectionFixture(t);
  await h.layer.update();
  h.click();
  h.free(false);
  h.click(null);
  assert.equal(h.card().title, 'S2 · Report');
  h.free(true);
  h.click({ id: 'other' });
  assert.equal(h.card().title, 'S2 · Report');
  h.hit({ entryId: 'another-card' });
  h.click(null);
  assert.equal(h.card(), undefined);
});

for (const [name, config, title, heading] of [
  [
    'folder title',
    { name: '', folder: 'TestFolder' },
    'S2 · Test Folder',
    'Intel Picture · Test Folder',
  ],
  ['default title', { name: '', folder: '' }, 'S2 · Report', 'Intel Picture'],
  [
    'custom product',
    { productId: 'custom', geometry: lineNode() },
    'S2 · Report',
    'Custom product · Folder',
  ],
]) {
  test(`[ghostmaps-033] The card uses the ${name}`, async (t) => {
    const h = selectionFixture(t, config);
    await h.layer.update();
    h.click({ id: `ghostmaps:${config.productId || 'cip'}:0:0` });
    assert.equal(h.card().title, title);
    assert.equal(h.card().details[0], heading);
    if (name === 'custom product')
      assert.equal(h.layer.getRowControls().chips[0].label, 'Custom product');
    assert.equal(h.card().interactive, false);
    assert.equal(h.card().accent, '#c8ff00');
    assert.equal(h.card().activate, undefined);
    h.hit({ entryId: h.card().id });
    h.click(null);
    assert.equal(h.card().title, title);
  });
}

test('[ghostmaps-030] The horizon callback updates point visibility after a camera change', async (t) => {
  let frame;
  const h = fixture(t, { document: reportDoc() });
  h.viewer.camera = {
    positionWC: Cesium.Cartesian3.fromDegrees(12, 34, 1000000),
  };
  h.viewer.scene.preRender = {
    addEventListener: (fn) => {
      frame = fn;
      return () => {};
    },
  };
  await h.layer.update();
  const pin = [...h.mounted][0].entities.values[0];
  assert.equal(pin.show, true);
  h.viewer.camera.positionWC = Cesium.Cartesian3.fromDegrees(
    -168,
    -34,
    1000000,
  );
  frame();
  assert.equal(pin.show, false);
  [...h.mounted][0].show = false;
  h.layer.enable();
  assert.equal([...h.mounted][0].show, true);
});

test('[ghostmaps-033] The card caps fields and excludes the repeated feature name', async (t) => {
  const description =
    '<tr><td>Type</td><td>Report</td></tr>' +
    Array.from(
      { length: 20 },
      (_, i) => `<tr><td>Field${i}</td><td>Text</td></tr>`,
    ).join('');
  const h = selectionFixture(t, {
    description,
    catalog: { products: [{ ...plainProduct(), dateMs: 1780272000000 }] },
  });
  await h.layer.update();
  h.click();
  assert.equal(h.card().details.length, 12);
  assert.equal(h.card().details[1], 'Field 0: Text');
  assert.match(h.card().details[0], /06-01/);
});

test('[ghostmaps-033] A plain description gives an unlabelled card line', async (t) => {
  const h = selectionFixture(t, {
    description: 'Plain report',
    options: { pointer: null, openExternal: null },
  });
  await h.layer.update();
  h.click();
  assert.deepEqual(h.card().details, [
    'Intel Picture · Folder',
    'Plain report',
  ]);
});

for (const key of [
  'overlayHost',
  'screenSpaceEventHandlerFactory',
  'picking',
]) {
  test(`[ghostmaps-033] An absent ${key === 'picking' ? 'pick registry' : key} prevents card input`, async (t) => {
    let handlers = 0;
    const options = {
      overlayHost: { setEntries() {} },
      screenSpaceEventHandlerFactory: () => {
        handlers++;
        return { setInputAction() {}, destroy() {} };
      },
      picking: {},
      [key]: null,
    };
    const h = fixture(t, { options });
    await h.layer.update();
    assert.equal(handlers, 0);
    assert.equal(h.layer.getStats().count, 1);
  });
}

test('[ghostmaps-032] The layer accepts an update before a viewer exists', async () => {
  const layer = createGhostMapsLayer({
    storage: null,
    source: { getCatalog: async () => ({ products: [plainProduct()] }) },
  });
  layer.enable();
  assert.equal(await layer.update(), true);
  assert.equal(layer.getStats().count, 0);
  layer.destroy();
});

for (const [name, descriptor] of [
  ['absent storage', { value: undefined }],
  ['valid storage', { value: { getItem: () => '[]' } }],
  [
    'blocked storage',
    {
      get() {
        throw new Error('blocked');
      },
    },
  ],
]) {
  test(`[ghostmaps-031] The default storage handles ${name}`, async (t) => {
    const old = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      ...descriptor,
    });
    t.after(() =>
      old
        ? Object.defineProperty(globalThis, 'localStorage', old)
        : delete globalThis.localStorage,
    );
    const h = fixture(t, { options: { storage: undefined } });
    await h.layer.update();
    assert.equal(
      h.layer.getRowControls().chips[0].active,
      name !== 'valid storage',
    );
  });
}

for (const name of ['signal', 'disabled flag', 'old signal']) {
  test(`[ghostmaps-029] The layer frees constructed icons after the ${name} changes`, async (t) => {
    const h = fixture(t);
    const resume = Cesium.EntityCollection.prototype.resumeEvents;
    t.mock.method(
      Cesium.EntityCollection.prototype,
      'resumeEvents',
      function () {
        resume.call(this);
        if (name === 'disabled flag') h.layer.enable();
        h.layer.disable();
        if (name === 'old signal') h.layer.enable();
      },
    );
    await h.layer.update();
    assert.equal(h.created.length, 1);
    assert.deepEqual(h.revoked, ['blob:local-0']);
    assert.equal(h.mounted.size, 0);
  });
}

test('[ghostmaps-032] A row callback error does not block the next catalog', async (t) => {
  const h = fixture(t);
  let rows = 0;
  h.layer.setRowControlsListener(() => {
    if (++rows === 2) throw new Error('row');
  });
  assert.equal(await h.layer.update(), true);
  h.layer.setRowControlsListener(null);
  assert.equal(await h.layer.update(), true);
  assert.equal(h.layer.getStats().count, 1);
});

test('[ghostmaps-031] A saved chip callback accepts an absent catalog after destruction', async (t) => {
  const h = fixture(t);
  await h.layer.update();
  const chip = h.layer.getRowControls().chips[0];
  h.layer.destroy();
  chip.onClick();
  await settleLayer();
  assert.equal(h.layer.getStats().count, 0);
});

test('[ghostmaps-033] A chip change removes the selected card', async (t) => {
  const h = selectionFixture(t);
  await h.layer.update();
  h.click();
  h.layer.getRowControls().chips[0].onClick();
  await settleLayer();
  assert.equal(h.card(), undefined);
});

test('[ghostmaps-033] A custom catalog can remove the feature during a pick', async (t) => {
  const products = [plainProduct()];
  const h = selectionFixture(t, { catalog: { products } });
  await h.layer.update();
  products.find = () => {
    h.layer.disable();
    return null;
  };
  h.click();
  assert.equal(h.card(), undefined);
  assert.equal(h.published.at(-1).entries.length, 0);
});

test('[ghostmaps-033] A custom catalog can remove product metadata during a pick', async (t) => {
  const products = [plainProduct()];
  const h = selectionFixture(t, { catalog: { products } });
  await h.layer.update();
  products.find = () => null;
  h.click();
  assert.equal(h.card().details[0], 'Folder');
});

test('[ghostmaps-035] The application card opens the link through the window host', async (t) => {
  const old = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const calls = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { open: (...args) => calls.push(args) },
  });
  t.after(() =>
    old
      ? Object.defineProperty(globalThis, 'window', old)
      : delete globalThis.window,
  );
  let click;
  let card;
  const h = fixture(t, {
    factory: createApplicationGhostMaps,
    document: reportDoc({
      description: '<a href="https://a.test/">Source</a>',
    }),
    options: {
      overlayHost: {
        setEntries: (_source, entries) => {
          card = entries[0];
        },
      },
      screenSpaceEventHandlerFactory: () => ({
        setInputAction: (fn) => {
          click = fn;
        },
        destroy() {},
      }),
      picking: { resolvePickId: () => 'ghostmaps:cip:0:0' },
    },
  });
  h.viewer.scene.pick = () => ({});
  await h.layer.update();
  click({ position: { x: 0, y: 0 } });
  assert.equal(card.activate(), true);
  assert.deepEqual(calls, [
    ['https://a.test/', '_blank', 'noopener,noreferrer'],
  ]);
});

test('[ghostmaps-032] A stale chip cannot load data without a catalog', async (t) => {
  const h = fixture(t);
  await h.layer.update();
  const chip = h.layer.getRowControls().chips[0];
  h.layer.destroy();
  h.layer.init(h.viewer);
  h.layer.enable();
  chip.onClick();
  await settleLayer();
  assert.equal(h.mounted.size, 0);
});

for (const [name, config] of [
  ['absent link', { description: 'Report text' }],
  [
    'absent external host',
    {
      description: '<a href="https://a.test/">Source</a>',
      options: { openExternal: null },
    },
  ],
]) {
  test(`[ghostmaps-033] The card stays plain with an ${name}`, async (t) => {
    const h = selectionFixture(t, config);
    await h.layer.update();
    h.click();
    assert.equal(h.card().interactive, false);
    assert.equal(
      h.card().details.some((line) => line.includes('click card')),
      false,
    );
    h.hit({ entryId: h.card().id });
    h.click();
    assert.deepEqual(h.opened, []);
  });
}

for (const [name, options] of [
  ['absent host', { overlayHost: null }],
  ['absent factory', { screenSpaceEventHandlerFactory: null }],
  ['absent registry', { picking: null }],
]) {
  test(`[ghostmaps-033] The application accepts an ${name}`, async (t) => {
    const h = fixture(t, { factory: createApplicationGhostMaps, options });
    await h.layer.update();
    assert.equal(h.layer.getStats().count, 1);
  });
}

test('[ghostmaps-031] A stored object cannot use an inherited array method', async (t) => {
  const old = Object.getOwnPropertyDescriptor(Object.prototype, 'map');
  Object.defineProperty(Object.prototype, 'map', {
    configurable: true,
    value: () => [],
  });
  t.after(() =>
    old
      ? Object.defineProperty(Object.prototype, 'map', old)
      : delete Object.prototype.map,
  );
  const h = fixture(t, { options: { storage: { getItem: () => '{}' } } });
  await h.layer.update();
  assert.equal(h.layer.getRowControls().chips[0].active, true);
});

for (const [id, label, color] of [
  ['cip', 'Intel Picture', '#c8ff00'],
  ['kinetic-30d', 'Kinetic 30d', '#ff5a36'],
  ['border-crisis', 'Border Crisis', '#ffb547'],
  ['iran-cip', 'Iran Picture', '#39d0ff'],
  ['iran-kinetic', 'Iran Kinetic', '#ff3b8d'],
  ['yemen-flot', 'Yemen FLOT', '#5dff9f'],
  ['latest-drop', 'Latest Drop', '#b48cff'],
]) {
  test(`[ghostmaps-030 ghostmaps-033 ghostmaps-034] The ${id} product uses its label and color`, async (t) => {
    const h = selectionFixture(t, { productId: id, geometry: lineNode() });
    await h.layer.update();
    h.click({ id: `ghostmaps:${id}:0:0` });
    assert.equal(h.card().accent, color);
    assert.equal(h.card().details[0], `${label} · Folder`);
    const chip = h.layer.getRowControls().chips[0];
    assert.equal(chip.label, label);
    assert.equal(chip.color, color);
    assert.equal(chip.state, undefined);
    assert.equal(chip.busy, false);
    assert.equal(chip.title, 'Edition · 1 placemark');
    assert.equal(
      [...h.mounted][0].entities.values[0].polyline.material.color
        .getValue()
        .toCssHexString(),
      color,
    );
  });
}

test('[ghostmaps-032] A product getter can cancel before its file request', async (t) => {
  let calls = 0;
  let h;
  const product = {
    id: 'cip',
    version: 'a',
    get defaultOn() {
      h.layer.disable();
      return true;
    },
  };
  h = fixture(t, {
    options: {
      source: {
        getCatalog: async () => ({ products: [product] }),
        getFile: async () => {
          calls++;
          return fixtureKmz();
        },
      },
    },
  });
  await h.layer.update();
  assert.equal(calls, 0);
});

test('[ghostmaps-032] An absent viewer prevents access to catalog products', async () => {
  let fields = 0;
  const catalog = {
    get products() {
      fields++;
      return [];
    },
  };
  const layer = createGhostMapsLayer({
    storage: null,
    source: { getCatalog: async () => catalog },
  });
  layer.enable();
  await layer.update();
  assert.equal(fields, 0);
  assert.equal(layer.getStats().error, null);
  layer.destroy();
});

test('[ghostmaps-032] The disabled state prevents access to catalog products', async (t) => {
  let fields = 0;
  const product = plainProduct();
  const catalog = {
    get products() {
      fields++;
      return [product];
    },
  };
  const h = fixture(t, {
    options: {
      source: {
        getCatalog: async () => catalog,
        getFile: async () => fixtureKmz(),
      },
    },
  });
  await h.layer.update();
  const chip = h.layer.getRowControls().chips[0];
  h.layer.disable();
  chip.onClick();
  await settleLayer();
  fields = 0;
  chip.onClick();
  await settleLayer();
  assert.equal(fields, 0);
});

test('[ghostmaps-033] An invalid feature index prevents access to product metadata', async (t) => {
  let reads = 0;
  const products = [plainProduct()];
  products.find = (...args) => {
    reads++;
    return Array.prototype.find.apply(products, args);
  };
  const h = selectionFixture(t, { catalog: { products } });
  await h.layer.update();
  h.click({ id: 'ghostmaps:cip:99:0' });
  assert.equal(reads, 0);
  assert.equal(h.card(), undefined);
});

test('[ghostmaps-033] The layer does not create an input handler without a viewer', () => {
  let handlers = 0;
  const layer = createGhostMapsLayer({
    storage: null,
    source: { getCatalog: async () => ({ products: [] }) },
    overlayHost: { setEntries() {} },
    picking: {},
    screenSpaceEventHandlerFactory: () => {
      handlers++;
      return { setInputAction() {}, destroy() {} };
    },
  });
  layer.enable();
  assert.equal(handlers, 0);
  layer.destroy();
});

test('[ghostmaps-033] The layer keeps one input handler after a repeated enable call', async (t) => {
  const h = selectionFixture(t);
  h.layer.enable();
  assert.equal(h.owners.length, 1);
});

test('[ghostmaps-033] An empty pick id does not call another owner', async (t) => {
  let checks = 0;
  const h = selectionFixture(t, {
    options: {
      picking: {
        resolvePickId: () => '',
        isOwnedByOtherLayer: () => {
          checks++;
          return true;
        },
      },
    },
  });
  await h.layer.update();
  h.click({ id: '' });
  assert.equal(checks, 0);
  assert.equal(h.card(), undefined);
});

test('[ghostmaps-032] A row callback can remove the catalog before synchronization', async (t) => {
  const h = fixture(t);
  h.layer.setRowControlsListener(() => {
    h.layer.destroy();
    h.layer.init(h.viewer);
    h.layer.enable();
  });
  assert.equal(await h.layer.update(), true);
  assert.equal(h.layer.getStats().error, null);
});

test('[ghostmaps-033] A false product value does not supply an inherited title', async (t) => {
  const old = Object.getOwnPropertyDescriptor(Number.prototype, 'title');
  Object.defineProperty(Number.prototype, 'title', {
    configurable: true,
    value: 'Numeric metadata',
  });
  t.after(() =>
    old
      ? Object.defineProperty(Number.prototype, 'title', old)
      : delete Number.prototype.title,
  );
  const products = [plainProduct()];
  const h = selectionFixture(t, { catalog: { products } });
  await h.layer.update();
  products.find = () => 0;
  h.click();
  assert.equal(h.card().details[0], 'Folder');
});

test('[ghostmaps-033] An absent product label stays empty with a custom locale', async (t) => {
  const { getLocale, setLocale, getCatalog } =
    await import('../../i18n/index.js');
  const locale = getLocale();
  const dictionary = getCatalog('es');
  const old = Object.getOwnPropertyDescriptor(dictionary, 'undefined');
  dictionary.undefined = 'Fake title';
  setLocale('es');
  t.after(() => {
    setLocale(locale);
    if (old) Object.defineProperty(dictionary, 'undefined', old);
    else delete dictionary.undefined;
  });
  const products = [plainProduct()];
  const h = selectionFixture(t, { catalog: { products } });
  await h.layer.update();
  products.find = () => null;
  h.click();
  assert.equal(h.card().details[0], 'Folder');
  assert.equal(
    h.layer.getRowControls().chips[0].title.includes('Fake title'),
    false,
  );
});

test('[ghostmaps-030] The polygon alpha value takes precedence over the inherited color alpha', async (t) => {
  const old = Object.getOwnPropertyDescriptor(Object.prototype, 'polyColor');
  const reads = new WeakMap();
  Object.defineProperty(Object.prototype, 'polyColor', {
    configurable: true,
    get() {
      const value = (reads.get(this) || 0) + 1;
      reads.set(this, value);
      return value === 1 ? [1, 0, 0, 1] : null;
    },
  });
  t.after(() =>
    old
      ? Object.defineProperty(Object.prototype, 'polyColor', old)
      : delete Object.prototype.polyColor,
  );
  const h = fixture(t, { document: reportDoc({ geometry: polygonNode() }) });
  await h.layer.update();
  const material = [...h.mounted][0].entities.values[0].polygon.material;
  assert.equal(material.color.getValue().alpha, 0.25);
});

test('[ghostmaps-030 ghostmaps-032 ghostmaps-034] The layer owns all products and all report records', async (t) => {
  let frame;
  const document = element('document', [
    element('Placemark', [textNode('name', 'One'), pointNode()]),
    element('Placemark', [textNode('name', 'Two'), pointNode('20,40')]),
  ]);
  const h = fixture(t, {
    document,
    catalog: {
      products: [
        plainProduct('cip'),
        plainProduct('kinetic-30d'),
        plainProduct('yemen-flot'),
      ],
    },
  });
  h.viewer.camera = {
    positionWC: Cesium.Cartesian3.fromDegrees(12, 34, 1000000),
  };
  h.viewer.scene.preRender = {
    addEventListener: (fn) => {
      frame = fn;
      return () => {};
    },
  };
  await h.layer.update();
  assert.equal(h.mounted.size, 3);
  assert.equal(h.layer.getStats().count, 6);
  assert.deepEqual(h.layer.getStats().products, [
    'cip',
    'kinetic-30d',
    'yemen-flot',
  ]);
  assert.deepEqual(h.layer.getAnalystRecords(3), [
    { product: 'cip', name: 'One', folder: '', lon: 12, lat: 34 },
    { product: 'cip', name: 'Two', folder: '', lon: 20, lat: 40 },
    { product: 'kinetic-30d', name: 'One', folder: '', lon: 12, lat: 34 },
  ]);
  h.viewer.camera.positionWC = Cesium.Cartesian3.fromDegrees(
    -168,
    -34,
    1000000,
  );
  frame();
  assert.deepEqual(
    [...h.mounted].flatMap((ds) =>
      ds.entities.values.map((entity) => entity.show),
    ),
    [false, false, false, false, false, false],
  );
  for (const ds of h.mounted) ds.show = false;
  h.layer.enable();
  assert.deepEqual(
    [...h.mounted].map((ds) => ds.show),
    [true, true, true],
  );
  h.layer.disable();
  assert.equal(h.mounted.size, 0);
  assert.deepEqual(h.layer.getAnalystRecords(), []);
});
