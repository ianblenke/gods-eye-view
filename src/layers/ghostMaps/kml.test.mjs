import test from 'node:test';
import assert from 'node:assert/strict';
import { parseKmlCoordinates, readGhostMapsKml } from './kml.js';

function el(localName, children = [], value = '', attributes = {}) {
  const node = {
    localName,
    children,
    textContent: value,
    getAttribute: (key) => attributes[key] ?? null,
    getElementsByTagName: () =>
      children.flatMap((child) => [child, ...child.getElementsByTagName('*')]),
  };
  for (const child of children) child.parentElement = node;
  return node;
}
const text = (name, value) => el(name, [], value);
const point = (value = '12,34') => el('Point', [text('coordinates', value)]);
const mark = (children = [point()]) => el('Placemark', children);
const doc = (children) => el('document', children);
const read = (children, resolver) => readGhostMapsKml(doc(children), resolver);
const ring = (name, value) =>
  el(name, [el('LinearRing', [text('coordinates', value)])]);

for (const [name, value, expected] of [
  ['finite longitude', 'NaN,1', []],
  ['finite latitude', '1,NaN', []],
  ['the north bound', '1,91', []],
  ['the south bound', '1,-91', []],
  ['the east bound', '181,1', []],
  ['the west bound', '-181,1', []],
  [
    'bounds',
    '-180,-90 180,90',
    [
      [-180, -90],
      [180, 90],
    ],
  ],
  ['altitude', '12,34,99', [[12, 34]]],
  ['absent text', undefined, []],
]) {
  test(`[ghostmaps-025] The coordinate parser checks ${name}`, () => {
    assert.deepEqual(parseKmlCoordinates(value), expected);
  });
}

for (const name of [
  'Point',
  'LineString',
  'LinearRing',
  'Polygon',
  'MultiGeometry',
]) {
  test(`[ghostmaps-026] The reader accepts ${name}`, () => {
    const geometry =
      name === 'Point'
        ? point()
        : name === 'Polygon'
          ? el(name, [
              ring('outerBoundaryIs', '0,0 4,0 4,4'),
              ring('innerBoundaryIs', '1,1 2,1 2,2'),
              ring('innerBoundaryIs', '0,0'),
            ])
          : name === 'MultiGeometry'
            ? el(name, [
                point(),
                el('LineString', [text('coordinates', '0,0 4,4')]),
              ])
            : el(name, [text('coordinates', '0,0 4,4')]);
    const result = read([
      el('Folder', [
        text('name', 'Folder'),
        mark([text('name', 'Report'), text('description', 'Text'), geometry]),
      ]),
    ]);
    assert.equal(result.features[0].name, 'Report');
    assert.equal(result.features[0].folder, 'Folder');
    assert.equal(result.features[0].description, 'Text');
    const expected =
      name === 'Point'
        ? [{ type: 'point', position: [12, 34] }]
        : name === 'Polygon'
          ? [
              {
                type: 'polygon',
                outer: [
                  [0, 0],
                  [4, 0],
                  [4, 4],
                ],
                holes: [
                  [
                    [1, 1],
                    [2, 1],
                    [2, 2],
                  ],
                ],
              },
            ]
          : name === 'MultiGeometry'
            ? [
                { type: 'point', position: [12, 34] },
                {
                  type: 'line',
                  positions: [
                    [0, 0],
                    [4, 4],
                  ],
                },
              ]
            : [
                {
                  type: 'line',
                  positions: [
                    [0, 0],
                    [4, 4],
                  ],
                },
              ];
    assert.deepEqual(result.features[0].geometries, expected);
    assert.equal(
      result.positions,
      name === 'Polygon'
        ? 6
        : name === 'MultiGeometry'
          ? 3
          : name === 'Point'
            ? 1
            : 2,
    );
  });
}

for (const [name, geometry] of [
  ['point', point('bad')],
  ['line', el('LineString', [text('coordinates', '1,2')])],
  ['polygon', el('Polygon', [ring('outerBoundaryIs', '1,2 3,4')])],
  ['model', el('Model')],
  ['network link', el('NetworkLink')],
]) {
  test(`[ghostmaps-026] The reader excludes an invalid ${name}`, () => {
    assert.deepEqual(read([mark([geometry])]), {
      features: [],
      positions: 0,
      over: false,
    });
  });
}

test('[ghostmaps-026] The reader excludes hidden placemarks', () => {
  assert.deepEqual(read([mark([text('visibility', '0'), point()])]), {
    features: [],
    positions: 0,
    over: false,
  });
});

test('[ghostmaps-026] The reader uses the nearest named folder or document', () => {
  const result = read([
    el('Document', [text('name', 'Root'), el('Folder', [mark()])]),
    mark(),
  ]);
  assert.deepEqual(
    result.features.map((f) => f.folder),
    ['Root', ''],
  );
});

test('[ghostmaps-026] The reader caps report names and folder names', () => {
  const result = read([
    el('Folder', [
      text('name', 'x'.repeat(130)),
      mark([text('name', 'y'.repeat(220)), point()]),
    ]),
  ]);
  assert.equal(result.features[0].name.length, 200);
  assert.equal(result.features[0].folder.length, 120);
});

function style(children, id = 's') {
  return el('Style', children, '', { id });
}
const lineStyle = (width = '3', color = 'ff0000ff') =>
  el('LineStyle', [text('width', width), text('color', color)]);
const mapStyle = (id, pair) => el('StyleMap', pair ? [pair] : [], '', { id });
const pair = (children) => el('Pair', [text('key', 'normal'), ...children]);

for (const [name, children, expected] of [
  ['line', [lineStyle()], { lineWidth: 3, lineColor: [1, 0, 0, 1] }],
  [
    'polygon',
    [
      el('PolyStyle', [
        text('color', 'ff00ff00'),
        text('fill', '0'),
        text('outline', '0'),
      ]),
    ],
    { polyColor: [0, 1, 0, 1], fill: false, outline: false },
  ],
  [
    'polygon defaults',
    [el('PolyStyle')],
    { polyColor: null, fill: true, outline: true },
  ],
  [
    'icon',
    [
      el('IconStyle', [
        el('Icon', [text('href', 'pin.png')]),
        text('scale', '2'),
        text('color', 'ffff0000'),
      ]),
    ],
    { icon: 'blob:packed', iconScale: 2, iconColor: [0, 0, 1, 1] },
  ],
  [
    'icon defaults',
    [el('IconStyle')],
    { icon: null, iconScale: 1, iconColor: null },
  ],
  [
    'invalid number',
    [lineStyle('bad')],
    { lineWidth: 1, lineColor: [1, 0, 0, 1] },
  ],
  ['absent number', [el('LineStyle')], { lineWidth: 1, lineColor: null }],
]) {
  test(`[ghostmaps-027] The reader resolves the ${name} style`, () => {
    const calls = [];
    const result = read(
      [style(children), mark([text('styleUrl', '#s'), point()])],
      (href) => {
        calls.push(href);
        return 'blob:packed';
      },
    );
    assert.deepEqual(result.features[0].style, expected);
    assert.deepEqual(calls, name === 'icon' ? ['pin.png'] : []);
  });
}

for (const [name, defs, url, expected] of [
  [
    'normal map',
    [style([lineStyle()]), mapStyle('m', pair([text('styleUrl', '#s')]))],
    '#m',
    { lineWidth: 3, lineColor: [1, 0, 0, 1] },
  ],
  [
    'inline map',
    [mapStyle('m', pair([style([lineStyle()])]))],
    '#m',
    { lineWidth: 3, lineColor: [1, 0, 0, 1] },
  ],
  ['absent map id', [mapStyle('', pair([text('styleUrl', '#s')]))], '#m', {}],
  ['absent normal pair', [mapStyle('m')], '#m', {}],
  ['absent style id', [style([lineStyle()], '')], '#s', {}],
  ['remote style', [style([lineStyle()], 'remote/s')], 'remote/s', {}],
  ['cycle', [mapStyle('m', pair([text('styleUrl', '#m')]))], '#m', {}],
  ['unknown style', [], '#absent', {}],
  ['absent style', [], '', {}],
]) {
  test(`[ghostmaps-027] The reader checks the ${name}`, () => {
    assert.deepEqual(
      read([...defs, mark([text('styleUrl', url), point()])]).features[0].style,
      expected,
    );
  });
}

test('[ghostmaps-027] An inline style replaces the shared values', () => {
  assert.deepEqual(
    read([
      style([
        lineStyle(),
        el('PolyStyle', [text('fill', '0'), text('outline', '0')]),
      ]),
      mark([
        text('styleUrl', '#s'),
        style([lineStyle('5', 'ffff0000')], ''),
        point(),
      ]),
    ]).features[0].style,
    {
      lineWidth: 5,
      lineColor: [0, 0, 1, 1],
      polyColor: null,
      fill: false,
      outline: false,
    },
  );
});

test('[ghostmaps-027] The default resolver rejects an image URL', () => {
  assert.equal(
    read([
      mark([
        style([
          el('IconStyle', [
            el('Icon', [text('href', 'https://remote.test/icon.png')]),
          ]),
        ]),
        point(),
      ]),
    ]).features[0].style.icon,
    null,
  );
});

test('[ghostmaps-051] The reader accepts an absent document', () => {
  assert.deepEqual(readGhostMapsKml(null), {
    features: [],
    positions: 0,
    over: false,
  });
  assert.deepEqual(readGhostMapsKml({}), {
    features: [],
    positions: 0,
    over: false,
  });
});

test('[ghostmaps-028] The reader caps the feature total', () => {
  const result = read(Array.from({ length: 20001 }, () => mark()));
  assert.equal(result.features.length, 20000);
  assert.equal(result.over, true);
});

test('[ghostmaps-028] The reader caps the position total', () => {
  const result = read([
    mark([el('LineString', [text('coordinates', '0,0 '.repeat(250001))])]),
  ]);
  assert.equal(result.features.length, 0);
  assert.equal(result.over, true);
});

test('[ghostmaps-027] A style map without children gives an empty style', () => {
  const map = { localName: 'StyleMap', getAttribute: () => 'm' };
  const placemark = mark([text('styleUrl', '#m'), point()]);
  const document = { getElementsByTagName: () => [map, placemark] };
  assert.deepEqual(readGhostMapsKml(document).features[0].style, {});
});

test('[ghostmaps-027] The reader accepts a null style URL from a custom element', () => {
  const url = text('styleUrl', '');
  url.textContent = { trim: () => null };
  assert.deepEqual(read([mark([url, point()])]).features[0].style, {});
});
