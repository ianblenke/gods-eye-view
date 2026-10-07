import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSceneDocument,
  stringifySceneDocument,
  validateSceneDocument,
} from './document.js';
import { createDefaultProject, normalizeProject } from '../scenes/project.js';

const fixture = () => ({
  version: 3,
  scenes: [
    {
      id: 'scene',
      title: 'My scene',
      shots: [
        {
          id: 'shot',
          title: 'My shot',
          durationSec: 3,
          holdSec: 0,
          camera: { lat: 1, lon: 2, alt: 42, pitch: 0 },
          layers: {
            traffic: { enabled: true, params: { nested: [1, 'two', null] } },
          },
        },
      ],
    },
  ],
});
test('[director-001] all built-in authored content exports and normalizes without edit loss', () => {
  const project = createDefaultProject();
  const migrated = normalizeProject(
    parseSceneDocument(stringifySceneDocument(project)),
  );
  assert.deepEqual(
    JSON.parse(stringifySceneDocument(migrated)),
    JSON.parse(stringifySceneDocument(project)),
  );
  const edited = normalizeProject(fixture());
  edited.scenes[0].appliedShotPacks = [
    { id: 'pack', version: 3, shotBindings: { Original: 'shot' } },
  ];
  assert.deepEqual(
    normalizeProject(parseSceneDocument(stringifySceneDocument(edited))),
    edited,
  );
  assert.equal(edited.scenes[0].shots[0].camera.pitch, 0);
  assert.equal(edited.scenes[0].shots[0].camera.alt, 42);
});
test('[director-003] v1/v2 bloom migrates once; IDs, edits, pack bindings and zero holds survive', () => {
  for (const version of [undefined, 1, 2]) {
    const project = fixture();
    project.version = version;
    project.scenes[0].shots[0].visual = {
      bloom: { enabled: true, intensity: 25 },
    };
    const migrated = normalizeProject(
      parseSceneDocument(JSON.stringify(project)),
    );
    assert.equal(migrated.version, 6);
    assert.equal(migrated.scenes[0].shots[0].visual.bloom.intensity, 150);
    assert.equal(migrated.scenes[0].shots[0].id, 'shot');
    assert.deepEqual(
      normalizeProject(parseSceneDocument(stringifySceneDocument(migrated))),
      migrated,
    );
  }
});
test('[director-002] an intentionally empty project stays empty', () => {
  assert.deepEqual(
    normalizeProject(parseSceneDocument('{"version":3,"scenes":[]}')).scenes,
    [],
  );
});
test('[director-003] missing legacy IDs become stable after the first saved migration', () => {
  const project = { scenes: [{ shots: [{}] }] };
  const migrated = normalizeProject(validateSceneDocument(project));
  assert.ok(migrated.scenes[0].id);
  assert.ok(migrated.scenes[0].shots[0].id);
  assert.deepEqual(
    normalizeProject(parseSceneDocument(stringifySceneDocument(migrated))),
    migrated,
  );
});
test('[director-004] invalid shapes, versions, unknown fields and unsafe keys fail with field paths', () => {
  for (const text of [
    'null',
    '[]',
    '{}',
    '{"version":99,"scenes":[]}',
    '{"version":3,"scenes":[],"run":{}}',
    '{"scenes":[],"__proto__":{}}',
  ]) {
    assert.throws(() => parseSceneDocument(text), {
      name: 'SceneDocumentError',
    });
  }
  const project = fixture();
  project.scenes[0].shots[0].camera.lat = 91;
  assert.throws(
    () => validateSceneDocument(project),
    /\$\.scenes\[0\]\.shots\[0\]\.camera.lat/,
  );
  project.scenes[0].shots[0].camera.lat = 1;
  project.scenes[0].shots.push(structuredClone(project.scenes[0].shots[0]));
  assert.throws(() => validateSceneDocument(project), /duplicate ID/);
});
test('[director-013] document byte, nesting, collection, finite-number and string bounds are enforced', () => {
  assert.throws(() => parseSceneDocument(' '.repeat(5242881)), /5 MiB/);
  assert.throws(
    () =>
      parseSceneDocument(
        JSON.stringify({
          scenes: [],
          createdAt: 'é'.repeat(2621440),
        }),
      ),
    /5 MiB/,
  );
  const project = fixture();
  project.scenes[0].shots[0].camera.lat = Infinity;
  assert.throws(() => validateSceneDocument(project), /JSON value/);
  project.scenes[0].shots[0].camera.lat = 1;
  let nested = project.scenes[0].shots[0].layers.traffic.params;
  for (let i = 0; i < 30; i++) nested = nested.child = {};
  assert.throws(() => validateSceneDocument(project), /complexity/);
  assert.throws(
    () => validateSceneDocument({ scenes: Array(257).fill({ shots: [] }) }),
    /256/,
  );
});

test('[director-015] captured scope and extended detection edits survive migration', () => {
  const project = fixture();
  project.scenes[0].shots[0].visual = {
    scope: { enabled: true, featherPct: 11 },
    detection: {
      mode: 'DENSE',
      density: 75,
      allocation: 'ELASTIC',
      fadePct: 7,
      outsideOpacityPct: 1,
    },
  };
  const migrated = normalizeProject(
    parseSceneDocument(JSON.stringify(project)),
  );
  assert.deepEqual(migrated.scenes[0].shots[0].visual.scope, {
    enabled: true,
    featherPct: 11,
  });
  assert.deepEqual(migrated.scenes[0].shots[0].visual.detection, {
    mode: 'DENSE',
    density: 75,
    allocation: 'ELASTIC',
    fadePct: 7,
    outsideOpacityPct: 1,
  });
});

test('[director-013] The parser rejects nontext input', () => {
  assert.throws(() => parseSceneDocument({}), /5 MiB/);
});

test('[director-013] The parser rejects excess character length', () => {
  const encoder = globalThis.TextEncoder;
  globalThis.TextEncoder = class {
    encode() {
      return { byteLength: 0 };
    }
  };
  try {
    assert.throws(() => parseSceneDocument(' '.repeat(5242881)), /5 MiB/);
  } finally {
    globalThis.TextEncoder = encoder;
  }
});

test('[director-013] The parser rejects excess UTF8 bytes', () => {
  assert.throws(() => parseSceneDocument('é'.repeat(2621441)), /5 MiB/);
});

test('[director-013] The parser reports invalid JSON', () => {
  assert.throws(() => parseSceneDocument('{'), /invalid JSON/);
});

test('[director-004] The validator rejects an unsupported version', () => {
  assert.throws(
    () => validateSceneDocument({ version: 7, scenes: [] }),
    /unsupported scene project version/,
  );
});

test('[director-014] The visual check rejects invalid style', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { style: 1 };
  assert.throws(() => validateSceneDocument(p), /visual\.style/);
});

test('[director-014] The visual check rejects invalid mapStack', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { mapStack: 1 };
  assert.throws(() => validateSceneDocument(p), /visual\.mapStack/);
});

test('[director-014] The visual check rejects invalid style parameters', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { styleParams: [] };
  assert.throws(() => validateSceneDocument(p), /styleParams/);
});

test('[director-015] The visual bloom accepts its enabled field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { bloom: { enabled: true } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.bloom.enabled = {};
  assert.throws(() => validateSceneDocument(p), /visual\.bloom\.enabled/);
});

test('[director-015] The visual bloom accepts its intensity field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { bloom: { intensity: 20 } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.bloom.intensity = {};
  assert.throws(() => validateSceneDocument(p), /visual\.bloom\.intensity/);
});

test('[director-015] The visual bloom accepts its version field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { bloom: { version: 1 } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.bloom.version = {};
  assert.throws(() => validateSceneDocument(p), /visual\.bloom\.version/);
});

test('[director-015] The visual sharpen accepts its enabled field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { sharpen: { enabled: true } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.sharpen.enabled = {};
  assert.throws(() => validateSceneDocument(p), /visual\.sharpen\.enabled/);
});

test('[director-015] The visual sharpen accepts its intensity field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { sharpen: { intensity: 20 } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.sharpen.intensity = {};
  assert.throws(() => validateSceneDocument(p), /visual\.sharpen\.intensity/);
});

test('[director-015] The visual hud accepts its visible field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { hud: { visible: true } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.hud.visible = {};
  assert.throws(() => validateSceneDocument(p), /visual\.hud\.visible/);
});

test('[director-015] The visual hud accepts its variant field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { hud: { variant: 'x' } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.hud.variant = {};
  assert.throws(() => validateSceneDocument(p), /visual\.hud\.variant/);
});

test('[director-015] The visual detection accepts its mode field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { detection: { mode: 'x' } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.detection.mode = {};
  assert.throws(() => validateSceneDocument(p), /visual\.detection\.mode/);
});

test('[director-015] The visual detection accepts its density field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { detection: { density: 20 } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.detection.density = {};
  assert.throws(() => validateSceneDocument(p), /visual\.detection\.density/);
});

test('[director-015] The visual detection accepts its allocation field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { detection: { allocation: 'x' } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.detection.allocation = {};
  assert.throws(
    () => validateSceneDocument(p),
    /visual\.detection\.allocation/,
  );
});

test('[director-015] The visual detection accepts its fadePct field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { detection: { fadePct: 20 } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.detection.fadePct = {};
  assert.throws(() => validateSceneDocument(p), /visual\.detection\.fadePct/);
});

test('[director-015] The visual detection accepts its outsideOpacityPct field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { detection: { outsideOpacityPct: 20 } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.detection.outsideOpacityPct = {};
  assert.throws(
    () => validateSceneDocument(p),
    /visual\.detection\.outsideOpacityPct/,
  );
});

test('[director-015] The visual scope accepts its enabled field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { scope: { enabled: true } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.scope.enabled = {};
  assert.throws(() => validateSceneDocument(p), /visual\.scope\.enabled/);
});

test('[director-015] The visual scope accepts its featherPct field', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { scope: { featherPct: 20 } };
  assert.equal(validateSceneDocument(p), p);
  p.scenes[0].shots[0].visual.scope.featherPct = {};
  assert.throws(() => validateSceneDocument(p), /visual\.scope\.featherPct/);
});

test('[director-015] The visual bloom bounds its intensity field', () => {
  for (const value of [-101, 10001]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { bloom: { intensity: value } };
    assert.throws(() => validateSceneDocument(p));
  }
  for (const value of [-100, 10000]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { bloom: { intensity: value } };
    assert.equal(validateSceneDocument(p), p);
  }
});

test('[director-015] The visual bloom bounds its version field', () => {
  for (const value of [0, 101]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { bloom: { version: value } };
    assert.throws(() => validateSceneDocument(p));
  }
  for (const value of [1, 100]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { bloom: { version: value } };
    assert.equal(validateSceneDocument(p), p);
  }
});

test('[director-015] The visual sharpen bounds its intensity field', () => {
  for (const value of [-1, 101]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { sharpen: { intensity: value } };
    assert.throws(() => validateSceneDocument(p));
  }
  for (const value of [0, 100]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { sharpen: { intensity: value } };
    assert.equal(validateSceneDocument(p), p);
  }
});

test('[director-015] The visual detection bounds its density field', () => {
  for (const value of [-1, 101]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { detection: { density: value } };
    assert.throws(() => validateSceneDocument(p));
  }
  for (const value of [0, 100]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { detection: { density: value } };
    assert.equal(validateSceneDocument(p), p);
  }
});

test('[director-015] The visual detection bounds its fadePct field', () => {
  for (const value of [-1, 101]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { detection: { fadePct: value } };
    assert.throws(() => validateSceneDocument(p));
  }
  for (const value of [0, 100]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { detection: { fadePct: value } };
    assert.equal(validateSceneDocument(p), p);
  }
});

test('[director-015] The visual detection bounds its outsideOpacityPct field', () => {
  for (const value of [-1, 101]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { detection: { outsideOpacityPct: value } };
    assert.throws(() => validateSceneDocument(p));
  }
  for (const value of [0, 100]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { detection: { outsideOpacityPct: value } };
    assert.equal(validateSceneDocument(p), p);
  }
});

test('[director-015] The visual scope bounds its featherPct field', () => {
  for (const value of [-1, 101]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { scope: { featherPct: value } };
    assert.throws(() => validateSceneDocument(p));
  }
  for (const value of [0, 100]) {
    const p = fixture();
    p.scenes[0].shots[0].visual = { scope: { featherPct: value } };
    assert.equal(validateSceneDocument(p), p);
  }
});

test('[director-016] The document checks its createdAt field', () => {
  assert.throws(
    () => validateSceneDocument({ scenes: [], createdAt: 1 }),
    /createdAt/,
  );
});

test('[director-016] The document checks its updatedAt field', () => {
  assert.throws(
    () => validateSceneDocument({ scenes: [], updatedAt: 1 }),
    /updatedAt/,
  );
});

test('[director-016] The document checks installed scene IDs', () => {
  assert.throws(
    () => validateSceneDocument({ scenes: [], installedBuiltInSceneIds: [1] }),
    /installedBuiltInSceneIds/,
  );
});

test('[director-017] The shot checks its durationSec field', () => {
  for (const value of [-1, 86401, '2']) {
    const p = fixture();
    p.scenes[0].shots[0].durationSec = value;
    assert.throws(() => validateSceneDocument(p), /durationSec/);
  }
  for (const value of [0, 86400]) {
    const p = fixture();
    p.scenes[0].shots[0].durationSec = value;
    assert.equal(validateSceneDocument(p), p);
  }
});

test('[director-017] The shot checks its holdSec field', () => {
  for (const value of [-1, 86401, '2']) {
    const p = fixture();
    p.scenes[0].shots[0].holdSec = value;
    assert.throws(() => validateSceneDocument(p), /holdSec/);
  }
  for (const value of [0, 86400]) {
    const p = fixture();
    p.scenes[0].shots[0].holdSec = value;
    assert.equal(validateSceneDocument(p), p);
  }
});

test('[director-016] The shot checks its sourcePackVersion field', () => {
  for (const value of [0, 1000001, '2']) {
    const p = fixture();
    p.scenes[0].shots[0].sourcePackVersion = value;
    assert.throws(() => validateSceneDocument(p), /sourcePackVersion/);
  }
  for (const value of [1, 1000000]) {
    const p = fixture();
    p.scenes[0].shots[0].sourcePackVersion = value;
    assert.equal(validateSceneDocument(p), p);
  }
});

test('[director-016] The pack bindings check every value', () => {
  const p = fixture();
  p.scenes[0].appliedShotPacks = [
    { id: 'p', shotBindings: { A: 'shot', B: 1 } },
  ];
  assert.throws(() => validateSceneDocument(p), /shotBindings\.B/);
});

test('[director-016] The pack versions accept legacy text only', () => {
  const p = fixture();
  p.scenes[0].appliedShotPacks = [{ id: 'p', version: '1' }];
  assert.throws(() => validateSceneDocument(p), /version/);
  p.version = 2;
  assert.equal(validateSceneDocument(p), p);
});

test('[director-016] The scene checks its title field', () => {
  const p = fixture();
  p.scenes[0].title = 1;
  assert.throws(() => validateSceneDocument(p), /title/);
});

test('[director-016] The scene checks its releaseLayerIds field', () => {
  const p = fixture();
  p.scenes[0].releaseLayerIds = 1;
  assert.throws(() => validateSceneDocument(p), /releaseLayerIds/);
});

test('[director-016] The shot checks its title field', () => {
  const p = fixture();
  p.scenes[0].shots[0].title = 1;
  assert.throws(() => validateSceneDocument(p), /title/);
});

test('[director-016] The shot checks its sourcePackId field', () => {
  const p = fixture();
  p.scenes[0].shots[0].sourcePackId = 1;
  assert.throws(() => validateSceneDocument(p), /sourcePackId/);
});

test('[director-018] The layer entry needs a boolean state', () => {
  const p = fixture();
  p.scenes[0].shots[0].layers = { a: false, b: { enabled: 1 } };
  assert.throws(() => validateSceneDocument(p), /layers\.b\.enabled/);
});

test('[director-018] The layer parameters need an object', () => {
  const p = fixture();
  p.scenes[0].shots[0].layers = { a: { enabled: true, params: [] } };
  assert.throws(() => validateSceneDocument(p), /params/);
});

test('[director-018] The shot total spans scene boundaries', () => {
  const p = {
    version: 3,
    scenes: [
      { shots: Array.from({ length: 6000 }, () => ({})) },
      { shots: Array.from({ length: 4001 }, () => ({})) },
    ],
  };
  assert.throws(() => validateSceneDocument(p), /too many shots/);
});

test('[director-004] The version rejects an early anchors field', () => {
  const p = fixture();
  p.version = 3;
  p.scenes[0].anchors = [];
  assert.throws(() => validateSceneDocument(p), /unsupported field/);
});

test('[director-004] The version rejects an early dataPacks field', () => {
  const p = fixture();
  p.version = 4;
  p.scenes[0].dataPacks = [];
  assert.throws(() => validateSceneDocument(p), /unsupported field/);
});

test('[director-004] The version rejects an early move field', () => {
  const p = fixture();
  p.version = 3;
  p.scenes[0].shots[0].move = [];
  assert.throws(() => validateSceneDocument(p), /unsupported field/);
});

test('[director-004] The version rejects an early dataPackIds field', () => {
  const p = fixture();
  p.version = 4;
  p.scenes[0].shots[0].dataPackIds = [];
  assert.throws(() => validateSceneDocument(p), /unsupported field/);
});

test('[director-004] The version rejects an early interactions field', () => {
  const p = fixture();
  p.version = 5;
  p.scenes[0].shots[0].interactions = [];
  assert.throws(() => validateSceneDocument(p), /unsupported field/);
});

test('[director-018] The layer check validates a second layer ID', () => {
  const p = fixture();
  p.scenes[0].shots[0].layers = { a: true, [' ']: true };
  assert.throws(() => validateSceneDocument(p), /expected nonempty text/);
});

test('[director-018] The layer check accepts boolean entries', () => {
  const p = fixture();
  p.scenes[0].shots[0].layers = { a: true };
  assert.equal(validateSceneDocument(p), p);
});

test('[director-001] The export keeps authored text and time', () => {
  const p = {
    version: 3,
    scenes: [
      { id: 'a', title: 'A', shots: [{ id: 's', durationSec: 2, holdSec: 0 }] },
    ],
  };
  assert.deepEqual(JSON.parse(stringifySceneDocument(p)), {
    version: 3,
    scenes: [
      { id: 'a', title: 'A', shots: [{ id: 's', durationSec: 2, holdSec: 0 }] },
    ],
  });
});

test('[director-002] The parser keeps an empty scene list', () => {
  assert.deepEqual(parseSceneDocument('{"version":3,"scenes":[]}'), {
    version: 3,
    scenes: [],
  });
});

test('[director-003] The legacy document accepts absent IDs', () => {
  assert.deepEqual(validateSceneDocument({ scenes: [{ shots: [{}] }] }), {
    scenes: [{ shots: [{}] }],
  });
});

test('[director-003] The absent version allows legacy numeric text', () => {
  assert.doesNotThrow(() =>
    validateSceneDocument({ scenes: [{ shots: [{ holdSec: '2' }] }] }),
  );
});

test('[director-015] The visual check rejects invalid number type', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { bloom: { intensity: {} } };
  assert.throws(() => validateSceneDocument(p), /bloom\.intensity/);
});

test('[director-015] The visual check rejects invalid text type', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { hud: { variant: {} } };
  assert.throws(() => validateSceneDocument(p), /hud\.variant/);
});

test('[director-015] The visual check rejects invalid boolean type', () => {
  const p = fixture();
  p.scenes[0].shots[0].visual = { scope: { enabled: 1 } };
  assert.throws(() => validateSceneDocument(p), /scope\.enabled/);
});

test('[director-014] The visual rejects an unknown field', () => {
  const project = fixture();
  project.scenes[0].shots[0].visual = { extra: true };
  assert.throws(() => validateSceneDocument(project), {
    name: 'SceneDocumentError',
    path: '$.scenes[0].shots[0].visual.extra',
  });
});

test('[director-015] The visual group rejects an unknown field', () => {
  const project = fixture();
  project.scenes[0].shots[0].visual = { bloom: { extra: true } };
  assert.throws(() => validateSceneDocument(project), {
    name: 'SceneDocumentError',
    path: '$.scenes[0].shots[0].visual.bloom.extra',
  });
});

test('[director-016] The pack entry rejects an unknown field', () => {
  const project = fixture();
  project.scenes[0].appliedShotPacks = [{ id: 'pack', extra: true }];
  assert.throws(() => validateSceneDocument(project), {
    name: 'SceneDocumentError',
    path: '$.scenes[0].appliedShotPacks[0].extra',
  });
});

test('[director-018] The layer entry rejects an unknown field', () => {
  const project = fixture();
  project.scenes[0].shots[0].layers = {
    traffic: { enabled: true, extra: true },
  };
  assert.throws(() => validateSceneDocument(project), {
    name: 'SceneDocumentError',
    path: '$.scenes[0].shots[0].layers.traffic.extra',
  });
});

test('[director-004] The document rejects a duplicate scene ID', () => {
  const project = fixture();
  project.scenes.push(structuredClone(project.scenes[0]));
  assert.throws(() => validateSceneDocument(project), {
    name: 'SceneDocumentError',
    path: '$.scenes[1].id',
  });
});

test('[director-016] The document rejects a duplicate pack ID', () => {
  const project = fixture();
  project.scenes[0].appliedShotPacks = [{ id: 'pack' }, { id: 'pack' }];
  assert.throws(() => validateSceneDocument(project), {
    name: 'SceneDocumentError',
    path: '$.scenes[0].appliedShotPacks[1].id',
  });
});

test('[director-003] The import accepts anchors and move at versions 4 through 6', () => {
  for (const version of [4, 5, 6]) {
    const project = fixture();
    project.version = version;
    project.scenes[0].anchors = [
      { id: 'anchor', lat: 1, lon: 2, alt: 42, altitudeReference: 'ellipsoid' },
    ];
    const shot = project.scenes[0].shots[0];
    shot.camera.altitudeReference = 'ellipsoid';
    shot.move = {
      from: { lat: 1, lon: 2, alt: 42, altitudeReference: 'ellipsoid' },
      easing: 'linear',
    };
    const result = parseSceneDocument(JSON.stringify(project));
    assert.ok([4, 5, 6].includes(result.version));
    assert.equal(result.scenes[0].anchors[0].id, 'anchor');
    assert.equal(result.scenes[0].shots[0].move.easing, 'linear');
  }
});

test('[director-003] The import accepts data packs at versions 5 and 6', () => {
  for (const version of [5, 6]) {
    const project = fixture();
    project.version = version;
    project.scenes[0].dataPacks = [
      {
        id: 'data',
        version: 1,
        format: 'geojson',
        source: { adapter: 'local', path: 'data.json' },
        attribution: { text: 'Data', license: 'Public' },
        placement: { altitudeReference: 'ellipsoid' },
      },
    ];
    project.scenes[0].shots[0].dataPackIds = ['data'];
    const result = parseSceneDocument(JSON.stringify(project));
    assert.ok([5, 6].includes(result.version));
    assert.equal(result.scenes[0].dataPacks[0].id, 'data');
    assert.deepEqual(result.scenes[0].shots[0].dataPackIds, ['data']);
  }
});

test('[director-003] The import rejects fields below each version gate', () => {
  for (const version of [1, 2, 3]) {
    for (const field of ['anchors', 'move']) {
      const project = fixture();
      project.version = version;
      if (field === 'anchors') project.scenes[0].anchors = [];
      else project.scenes[0].shots[0].move = {};
      assert.throws(
        () => parseSceneDocument(JSON.stringify(project)),
        /unsupported field/,
      );
    }
  }
  for (const version of [1, 2, 3, 4]) {
    for (const field of ['dataPacks', 'dataPackIds']) {
      const project = fixture();
      project.version = version;
      if (field === 'dataPacks') project.scenes[0].dataPacks = [];
      else project.scenes[0].shots[0].dataPackIds = [];
      assert.throws(
        () => parseSceneDocument(JSON.stringify(project)),
        /unsupported field/,
      );
    }
  }
});
