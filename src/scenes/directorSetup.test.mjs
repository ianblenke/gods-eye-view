import assert from 'node:assert/strict';
import test from 'node:test';
import { SceneDirector } from './director.js';
import { SCENE_RECIPES } from './recipes.js';

const KEY = 'godsEyeView.sceneProject.v2';
function project() {
  return {
    version: 3,
    scenes: [
      {
        id: 'scene-1',
        title: 'Fixture Scene',
        shots: [
          {
            id: 'shot-a',
            title: 'Shot A',
            durationSec: 0.2,
            holdSec: 0,
            camera: {
              lat: 10,
              lon: 20,
              alt: 500000,
              heading: 0,
              pitch: -40,
              roll: 0,
            },
            visual: { style: 'normal' },
            layers: {},
          },
          {
            id: 'shot-b',
            title: 'Shot B',
            durationSec: 0.2,
            holdSec: 0,
            camera: {
              lat: -30,
              lon: 140,
              alt: 900000,
              heading: 0,
              pitch: -40,
              roll: 0,
            },
            visual: { style: 'retro' },
            layers: {},
          },
        ],
      },
    ],
  };
}
function setup(t, options = {}) {
  const original = {
    document: globalThis.document,
    localStorage: globalThis.localStorage,
    warn: console.warn,
  };
  const writes = [],
    events = [],
    removals = [];
  const stored = new Map([
    [
      KEY,
      Object.hasOwn(options, 'raw')
        ? options.raw
        : JSON.stringify(options.project || project()),
    ],
  ]);
  const classList = {
    add() {},
    remove() {},
    toggle() {},
    contains: () => false,
  };
  globalThis.document = {
    getElementById: () => null,
    addEventListener() {},
    removeEventListener() {},
    createElement: () => ({
      classList,
      style: {},
      appendChild() {},
      remove() {},
    }),
    body: { classList, appendChild() {} },
  };
  globalThis.localStorage = {
    getItem: (k) => stored.get(k) ?? null,
    setItem: (k, v) => {
      writes.push([k, v]);
      stored.set(k, v);
    },
    removeItem: (k) => stored.delete(k),
  };
  if (options.getError)
    localStorage.getItem = () => {
      throw Error('blocked');
    };
  if (options.setError)
    localStorage.setItem = () => {
      throw Error('quota');
    };
  console.warn = () => {};
  const canvas = {
    addEventListener: (event, fn, opts) => events.push({ event, fn, opts }),
    removeEventListener: (event, fn) => removals.push({ event, fn }),
  };
  const viewer = {
    scene: { canvas },
    camera: { cancelFlight() {}, setView() {} },
  };
  if (options.noScene) delete viewer.scene;
  const style = {
    subscribeCameraHandoff(fn) {
      this.handoff = fn;
      return () => {
        this.handoff = null;
      };
    },
    runImmediateNavigation: (_name, fn) => fn(),
    getCameraState: () => ({}),
    getVisualState: () => ({}),
    setRecordingMode() {},
  };
  const data = {
    getAll: () => [],
    getLayerParams: () => null,
    subscribeVisibilityRequests(fn) {
      this.visibility = fn;
      return () => {
        this.visibility = null;
      };
    },
  };
  if (options.noHandoff) delete style.subscribeCameraHandoff;
  let d;
  const proto = SceneDirector.prototype;
  const oldBootstrap = proto._bootstrapLegacyShotPacks;
  const oldAppend = proto.appendShotPack;
  const oldLoad = proto._loadProject;
  try {
    if (options.load) proto._loadProject = options.load;
    if (options.noBootstrap) proto._bootstrapLegacyShotPacks = () => {};
    if (options.append) proto.appendShotPack = options.append;
    d = new SceneDirector(viewer, style, data, options.constructorOptions);
  } finally {
    proto._bootstrapLegacyShotPacks = oldBootstrap;
    proto.appendShotPack = oldAppend;
    proto._loadProject = oldLoad;
  }
  t.after(async () => {
    try {
      await d.destroy();
    } finally {
      globalThis.document = original.document;
      globalThis.localStorage = original.localStorage;
      console.warn = original.warn;
    }
  });
  return { d, writes, stored, viewer, style, data, events, removals };
}

test('[director-111] The initial selection', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  assert.equal(d._selectedSceneId, 'scene-1');
  assert.equal(d._selectedShotId, 'shot-a');
  assert.equal(d._presentation.status, 'Ready');
});

test('[director-116] The project normalization', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  assert.equal(d._project.version, 6);
  assert.equal(d._project.scenes[0].shots[0].camera.pitch, -40);
});

test('[director-121] The absent migration anchor', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  assert.deepEqual(
    d._project.scenes.map((s) => s.id),
    ['scene-1'],
  );
  assert.equal(writes.length, 0);
});

test('[director-129] The shutdown promise', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const a = d.destroy();
  const b = d.destroy();
  assert.equal(a, b);
  await a;
  assert.equal(d._destroyed, true);
});

test('[director-132] The project timestamp', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project.updatedAt = '2000-01-01T00:00:00.000Z';
  const NativeDate = Date;
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length ? args : ['2026-10-06T12:00:00.000Z']));
    }
  };
  try {
    d._saveProject();
  } finally {
    globalThis.Date = NativeDate;
  }
  assert.equal(writes.length, 1);
  const saved = JSON.parse(writes[0][1]);
  assert.equal(writes[0][0], 'godsEyeView.sceneProject.v2');
  assert.equal(saved.version, 6);
  assert.equal(saved.updatedAt, '2026-10-06T12:00:00.000Z');
});

test('[director-133] The invalid project document', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const notices = [];
  d._toastStorageError = (m) => notices.push(m);
  d._project.scenes[0].shots[0].camera.lat = 91;
  d._saveProject();
  assert.equal(writes.length, 0);
  assert.match(notices[0], /Scene not saved/);
  assert.match(notices[0], /lat/);
});

test('[director-134] The storage quota error', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  localStorage.setItem = () => {
    throw Error('quota');
  };
  const notices = [];
  d._toastStorageError = (m) => notices.push(m);
  d._saveProject();
  assert.deepEqual(notices, [undefined]);
});

test('[director-136] The scene selector', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._selectedSceneId = 'absent';
  const seen = [];
  d.subscribe((n) => {
    if (n.change) seen.push(n.change.type);
  });
  d._renderSceneSelect();
  assert.equal(d._selectedSceneId, 'scene-1');
  assert.deepEqual(seen, ['scene-options-changed']);
});

test('[director-137] The shot list selection', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._selectedShotId = 'absent';
  const seen = [];
  d.subscribe((n) => {
    if (n.change) seen.push(n.change.type);
  });
  d._renderShotList();
  assert.equal(d._selectedShotId, 'shot-a');
  assert.deepEqual(seen, ['shots-changed']);
});

test('[director-138] The scene and shot lookup', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  assert.equal(d._getSelectedScene().title, 'Fixture Scene');
  assert.equal(d._getShot('scene-1', 'shot-b').shot.title, 'Shot B');
  assert.equal(d._getShot('absent', 'shot-a').scene, undefined);
  assert.equal(d._getShot('scene-1', 'absent').shot, undefined);
  d._selectedSceneId = 'absent';
  assert.equal(d._getSelectedScene(), null);
});

test('[director-139] The scene creation name', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._createScene('  North  ');
  const s = d._project.scenes[1];
  assert.equal(s.title, 'North');
  assert.deepEqual(s.shots, []);
  assert.equal(d._getSelectedScene().title, 'North');
  assert.equal(d._selectedShotId, null);
  assert.equal(writes.length, 1);
});

test('[director-140] The blank scene name', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._createScene('  ');
  assert.equal(d._project.scenes[1].title, 'Scene 2');
});

test('[director-141] The absent scene name', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._createScene('');
  d._createScene(null);
  assert.equal(d._project.scenes.length, 1);
  assert.equal(writes.length, 0);
});

test('[director-142] The scene deletion', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._createScene('North');
  writes.length = 0;
  d._deleteSelectedScene();
  assert.deepEqual(
    d._project.scenes.map((s) => s.id),
    ['scene-1'],
  );
  assert.equal(d._selectedSceneId, 'scene-1');
  assert.equal(d._selectedShotId, 'shot-a');
  assert.equal(writes.length, 1);
});

test('[director-143] The last scene deletion', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._deleteSelectedScene();
  assert.ok(d._project.scenes.some((s) => s.id === 'flights-radar'));
  assert.equal(writes.length, 1);
});

test('[director-144] The layer state snapshot', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  data.getAll = () => [
    { id: 'one', enabled: 1 },
    { id: 'two', enabled: 0 },
  ];
  data.getLayerParams = (id) => (id === 'one' ? { scale: 7 } : null);
  assert.deepEqual(d._captureLayerStates(), {
    one: { enabled: true, params: { scale: 7 } },
    two: { enabled: false },
  });
});

test('[director-145] The shot outcome', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const seen = [];
  d.subscribe((n) => {
    if (n.change) seen.push(n);
  });
  const s = d._project.scenes[0];
  d._shotOutcome('shot-loaded', s, s.shots[1]);
  assert.equal(seen[0].change.index, 1);
  assert.equal(seen[0].change.sceneId, 'scene-1');
  assert.equal(seen[0].change.sceneTitle, 'Fixture Scene');
  assert.equal(seen[0].change.shot.id, 'shot-b');
  assert.equal(seen[0].state.status, 'Loaded: Fixture Scene / Shot B');
  d._shotOutcome('shot-renamed', s, s.shots[0], 8);
  assert.equal(seen[1].change.index, 8);
  assert.equal(seen[1].state.status, 'Loaded: Fixture Scene / Shot B');
});

test('[director-146] The control actions', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._controls.actions.selectShot('shot-b');
  assert.equal(d._selectedShotId, 'shot-b');
  d._controls.actions.renameShot('scene-1', 'shot-b', '  East  ');
  assert.equal(d._project.scenes[0].shots[1].title, 'East');
  assert.equal(writes.length, 1);
  d._controls.actions.renameShot('scene-1', 'shot-b', '   ');
  assert.equal(d._project.scenes[0].shots[1].title, 'East');
  d._controls.actions.renameShot('scene-1', 'absent', 'West');
  assert.equal(writes.length, 2);
});

test('[director-112] The empty project selects no scene or shot', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    { project: { version: 3, scenes: [] } },
  );
  assert.equal(d._selectedSceneId, null);
  assert.equal(d._selectedShotId, null);
  assert.deepEqual(d._project.scenes, []);
});

test('[director-113] The absent project uses default scenes', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    { raw: null },
  );
  assert.ok(d._project.scenes.some((s) => s.id === 'flights-radar'));
  assert.equal(d._storageReadError, undefined);
});

test('[director-114] The rejected project protects its saved bytes', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    { raw: '{"version":99,"scenes":[]}' },
  );
  assert.ok(d._storageReadError);
  assert.match(d._presentation.status, /saved project could not be read/i);
  d._saveProject();
  assert.equal(writes.filter(([key]) => key === KEY).length, 0);
  assert.equal(stored.get(KEY), '{"version":99,"scenes":[]}');
});

test('[director-115] The storage access error gives default scenes', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    { getError: true },
  );
  assert.equal(d._storageReadError.message, 'blocked');
  assert.ok(d._project.scenes.some((s) => s.id === 'flights-radar'));
});

test('[director-117] The migration uses the primary anchor', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      noBootstrap: true,
      project: {
        ...project(),
        scenes: [{ ...project().scenes[0], id: 'bhote-koshi-flood' }],
      },
    },
  );
  assert.deepEqual(
    d._project.scenes.map((s) => s.id),
    ['bhote-koshi-flood', 'bhote-koshi-nepal-scene'],
  );
  assert.deepEqual(d._project.installedBuiltInSceneIds, [
    'bhote-koshi-nepal-scene',
  ]);
  assert.equal(writes.length, 1);
  assert.equal(JSON.parse(writes[0][1]).version, 6);
});

test('[director-118] The migration uses the fallback anchor', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      noBootstrap: true,
      project: {
        ...project(),
        scenes: [{ ...project().scenes[0], id: 'flights-radar' }],
      },
    },
  );
  assert.deepEqual(
    d._project.scenes.map((s) => s.id),
    ['flights-radar', 'bhote-koshi-nepal-scene'],
  );
  assert.deepEqual(d._project.installedBuiltInSceneIds, [
    'bhote-koshi-nepal-scene',
  ]);
  assert.equal(writes.length, 1);
  assert.equal(JSON.parse(writes[0][1]).version, 6);
});

test('[director-119] The installation marker prevents a second scene', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      noBootstrap: true,
      project: {
        ...project(),
        installedBuiltInSceneIds: ['bhote-koshi-nepal-scene'],
        scenes: [{ ...project().scenes[0], id: 'bhote-koshi-flood' }],
      },
    },
  );
  assert.deepEqual(
    d._project.scenes.map((s) => s.id),
    ['bhote-koshi-flood'],
  );
  assert.equal(writes.length, 0);
});

test('[director-120] The migration checks the scene id', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      noBootstrap: true,
      project: {
        ...project(),
        scenes: [
          { ...project().scenes[0], id: 'bhote-koshi-flood' },
          {
            id: 'other',
            title: 'Other',
            shots: [],
            id: 'bhote-koshi-nepal-scene',
          },
        ],
      },
    },
  );
  assert.equal(d._project.scenes.length, 2);
  assert.deepEqual(d._project.installedBuiltInSceneIds, [
    'bhote-koshi-nepal-scene',
  ]);
  assert.equal(writes.length, 1);
});

test('[director-120] The migration checks the scene title', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      noBootstrap: true,
      project: {
        ...project(),
        scenes: [
          { ...project().scenes[0], id: 'bhote-koshi-flood' },
          {
            id: 'other',
            title: 'Other',
            shots: [],
            title: 'Nepal Flood Incident',
          },
        ],
      },
    },
  );
  assert.equal(d._project.scenes.length, 2);
  assert.deepEqual(d._project.installedBuiltInSceneIds, [
    'bhote-koshi-nepal-scene',
  ]);
  assert.equal(writes.length, 1);
});

test('[director-122] The migration survives a storage error', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      noBootstrap: true,
      setError: true,
      project: {
        ...project(),
        scenes: [{ ...project().scenes[0], id: 'bhote-koshi-flood' }],
      },
    },
  );
  assert.deepEqual(
    d._project.scenes.map((s) => s.id),
    ['bhote-koshi-flood', 'bhote-koshi-nepal-scene'],
  );
  assert.equal(d._storageReadError, undefined);
});

test('[director-123] The installed pack checks version 17', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      noBootstrap: true,
      project: {
        ...project(),
        scenes: [
          {
            ...project().scenes[0],
            appliedShotPacks: [
              { id: 'bhote-koshi-nepal-evidence-pack', version: 17 },
            ],
          },
        ],
      },
      append: function (...args) {
        (this._appendCalls ||= []).push(args);
      },
    },
  );
  assert.equal(d._appendCalls?.length || 0, 1);
  assert.deepEqual(d._appendCalls[0], [
    'scene-1',
    'bhote-koshi-nepal-evidence-pack',
    { render: false, announce: false },
  ]);
});

test('[director-123] The installed pack checks version 0', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      noBootstrap: true,
      load: () => ({
        ...project(),
        scenes: [
          {
            ...project().scenes[0],
            appliedShotPacks: [
              { id: 'bhote-koshi-nepal-evidence-pack', version: 0 },
            ],
          },
        ],
      }),
      append: function (...args) {
        (this._appendCalls ||= []).push(args);
      },
    },
  );
  assert.equal(d._appendCalls?.length || 0, 0);
});

test('[director-123] The installed pack checks version 18', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      noBootstrap: true,
      project: {
        ...project(),
        scenes: [
          {
            ...project().scenes[0],
            appliedShotPacks: [
              { id: 'bhote-koshi-nepal-evidence-pack', version: 18 },
            ],
          },
        ],
      },
      append: function (...args) {
        (this._appendCalls ||= []).push(args);
      },
    },
  );
  assert.equal(d._appendCalls?.length || 0, 0);
});

test('[director-123] The unknown pack does not request an upgrade', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      noBootstrap: true,
      project: {
        ...project(),
        scenes: [
          {
            ...project().scenes[0],
            appliedShotPacks: [{ id: 'unknown', version: 1 }],
          },
        ],
      },
      append: function (...args) {
        (this._appendCalls ||= []).push(args);
      },
    },
  );
  assert.equal(d._appendCalls, undefined);
});

test('[director-124] The canvas registers pointerdown', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  assert.equal(events.filter((e) => e.event === 'pointerdown').length, 1);
  assert.deepEqual(events.find((e) => e.event === 'pointerdown').opts, {
    passive: true,
  });
  d._usesAuthoredCamera = true;
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  events.find((e) => e.event === 'pointerdown').fn({ type: 'pointerdown' });
  assert.deepEqual(stops, ['Camera ownership changed']);
});

test('[director-124] The canvas registers wheel', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  assert.equal(events.filter((e) => e.event === 'wheel').length, 1);
  assert.deepEqual(events.find((e) => e.event === 'wheel').opts, {
    passive: true,
  });
  d._usesAuthoredCamera = true;
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  events.find((e) => e.event === 'wheel').fn({ type: 'wheel' });
  assert.deepEqual(stops, ['Camera ownership changed']);
});

test('[director-124] The camera gesture checks _usesAuthoredCamera', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._usesAuthoredCamera = false;
  d._claimingCamera = false;
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  style.handoff({ type: 'wheel' });
  assert.deepEqual(stops, []);
});

test('[director-124] The camera gesture checks _claimingCamera', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._usesAuthoredCamera = true;
  d._claimingCamera = true;
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  style.handoff({ type: 'wheel' });
  assert.deepEqual(stops, []);
});

test('[director-125] The active pointer action keeps camera ownership', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._usesAuthoredCamera = true;
  d._interactions.getState = () => ({ active: true });
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  style.handoff({ type: 'pointerdown' });
  assert.deepEqual(stops, []);
  style.handoff({ type: 'wheel' });
  assert.deepEqual(stops, ['Camera ownership changed']);
});

test('[director-125] The inactive pointer action yields camera ownership', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._usesAuthoredCamera = true;
  d._interactions.getState = () => ({ active: false });
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  style.handoff({ type: 'pointerdown' });
  assert.deepEqual(stops, ['Camera ownership changed']);
});

test('[director-126] The user request disables a scene layer', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project.scenes[0].releaseLayerIds = ['one'];
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  data.visibility({ enabled: false, origin: 'user', layerId: 'one' });
  assert.deepEqual(stops, ['Scene layer turned off']);
});

test('[director-126] The voice request disables a scene layer', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project.scenes[0].releaseLayerIds = ['one'];
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  data.visibility({ enabled: false, origin: 'voice', layerId: 'one' });
  assert.deepEqual(stops, ['Scene layer turned off']);
});

test('[director-126] The tool request disables a scene layer', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project.scenes[0].releaseLayerIds = ['one'];
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  data.visibility({ enabled: false, origin: 'tool', layerId: 'one' });
  assert.deepEqual(stops, ['Scene layer turned off']);
});

test('[director-127] The visibility request checks its enabled', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project.scenes[0].releaseLayerIds = ['one'];
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  data.visibility({ enabled: true, origin: 'user', layerId: 'one' });
  assert.deepEqual(stops, []);
});

test('[director-127] The visibility request checks its origin', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project.scenes[0].releaseLayerIds = ['one'];
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  data.visibility({ enabled: false, origin: 'scene', layerId: 'one' });
  assert.deepEqual(stops, []);
});

test('[director-127] The visibility request checks its layer', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project.scenes[0].releaseLayerIds = ['one'];
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  data.visibility({ enabled: false, origin: 'user', layerId: 'other' });
  assert.deepEqual(stops, []);
});

test('[director-128] The work set removes success results', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  delete d._pendingWork;
  const p = Promise.resolve(7);
  assert.equal(d._trackWork(p), p);
  assert.equal(d._pendingWork.size, 1);
  await p.catch(() => {});
  assert.equal(d._pendingWork.size, 0);
});

test('[director-128] The work set removes error results', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  delete d._pendingWork;
  const p = Promise.reject(Error('work'));
  assert.equal(d._trackWork(p), p);
  assert.equal(d._pendingWork.size, 1);
  await p.catch(() => {});
  assert.equal(d._pendingWork.size, 0);
});

test('[director-130] The shutdown disposes each resource', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  for (const key of [
    '_cameraMotion',
    '_sharing',
    '_interactions',
    '_dataPacks',
    '_controls',
  ])
    d[key] = { destroy: () => calls.push(key) };
  d._bundleAssets = { clear: () => calls.push('assets') };
  d._state = { destroy: () => calls.push('state') };
  d._clock = { destroy: () => calls.push('clock') };
  d.stopScene = (m) => calls.push(m);
  d._cancelActiveSceneTravel = () => calls.push('travel');
  d._loadAbort = { abort: () => calls.push('load') };
  viewer.camera.cancelFlight = () => calls.push('flight');
  await d.destroy();
  assert.deepEqual(calls, [
    '_cameraMotion',
    '_sharing',
    'assets',
    '_interactions',
    '_dataPacks',
    '_controls',
    'state',
    'Stopped',
    'load',
    'flight',
    'clock',
    'travel',
  ]);
  assert.equal(data.visibility, null);
  assert.equal(style.handoff, null);
  assert.equal(d._loadGeneration, 1);
  assert.equal(d._sceneSeekGeneration, 1);
  assert.deepEqual(
    removals.map((e) => e.event),
    ['pointerdown', 'wheel'],
  );
});

test('[director-131] The shutdown waits for unsettled work', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  let finish;
  const p = new Promise((r) => {
    finish = r;
  });
  d._trackWork(p);
  let done = false;
  const shutdown = d.destroy().then(() => {
    done = true;
  });
  await new Promise(setImmediate);
  assert.equal(done, false);
  finish();
  await shutdown;
  assert.equal(done, true);
});

test('[director-135] The toast uses its default text', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._toastStorageError();
  assert.equal(
    d._presentation.status,
    'Scene not saved — browser storage unavailable',
  );
});

test('[director-135] The toast removes its visible class after the deadline', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  const toast = {
    textContent: '',
    classList: {
      add: (v) => calls.push(['add', v]),
      remove: (v) => calls.push(['remove', v]),
    },
  };
  document.getElementById = () => toast;
  const oldSet = globalThis.setTimeout,
    oldClear = globalThis.clearTimeout;
  let callback;
  globalThis.setTimeout = (fn, ms) => {
    callback = fn;
    calls.push(['delay', ms]);
    return 19;
  };
  globalThis.clearTimeout = (id) => calls.push(['cancel', id]);
  try {
    d._toastStorageError('Storage error');
    assert.equal(toast.textContent, 'Storage error');
    assert.equal(d._presentation.status, 'Storage error');
    assert.equal(d._storageToastTimer, 19);
    callback();
    assert.deepEqual(calls, [
      ['add', 'visible'],
      ['cancel', undefined],
      ['delay', 2600],
      ['remove', 'visible'],
    ]);
  } finally {
    globalThis.setTimeout = oldSet;
    globalThis.clearTimeout = oldClear;
  }
});

test('[director-135] The toast tolerates a document error', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  document.getElementById = () => {
    throw Error('document');
  };
  assert.doesNotThrow(() => d._toastStorageError('Storage error'));
  assert.equal(d._presentation.status, 'Storage error');
});

test('[director-136] The selector keeps a valid scene', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project.scenes.push({ id: 'second', title: 'Second', shots: [] });
  d._selectedSceneId = 'second';
  d._renderSceneSelect();
  assert.equal(d._selectedSceneId, 'second');
});

test('[director-136] The selector uses null for an empty project', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    { project: { version: 3, scenes: [] } },
  );
  d._renderSceneSelect();
  assert.equal(d._selectedSceneId, null);
});

test('[director-137] The shot list keeps a valid selection', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._selectedShotId = 'shot-b';
  d._renderShotList();
  assert.equal(d._selectedShotId, 'shot-b');
});

test('[director-137] The shot list accepts an absent scene', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._selectedSceneId = 'absent';
  d._selectedShotId = null;
  assert.doesNotThrow(() => d._renderShotList());
  assert.equal(d._selectedShotId, null);
});

test('[director-142] The absent scene selection leaves the project unchanged', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._selectedSceneId = 'absent';
  d._deleteSelectedScene();
  assert.equal(d._project.scenes.length, 1);
  assert.equal(writes.length, 0);
});

test('[director-146] The scene control selects its first shot', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._renderShotList = () => {};
  d._controls.actions.selectScene('scene-1');
  assert.equal(d._selectedSceneId, 'scene-1');
  assert.equal(d._selectedShotId, 'shot-a');
  d._controls.actions.selectScene('absent');
  assert.equal(d._selectedSceneId, 'absent');
  assert.equal(d._selectedShotId, null);
});

test('[director-146] The controls give the project state', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._running = true;
  d._lastRunJson = '{}';
  const state = d._controls.read();
  assert.equal(state.selectedSceneId, 'scene-1');
  assert.equal(state.selectedShotId, 'shot-a');
  assert.equal(state.running, true);
  assert.equal(state.hasRun, true);
  assert.equal(state.scenes[0].title, 'Fixture Scene');
  d._running = false;
});

function actionPanel(d, viewer) {
  const buttons = [];
  document.createElement = (tag) => {
    const listeners = new Map();
    const node = {
      dataset: {},
      style: {},
      setAttribute() {},
      append() {},
      replaceChildren() {},
      remove() {},
      addEventListener: (type, fn) => listeners.set(type, fn),
      removeEventListener() {},
      click: () => listeners.get('click')?.(),
    };
    if (tag === 'button') buttons.push(node);
    return node;
  };
  viewer.container = { append() {} };
  const shot = {
    interactions: [
      {
        id: 'one',
        label: 'Focus',
        target: { packId: 'data', featureId: 'point' },
        action: { type: 'focus', anchorId: 'view' },
      },
    ],
  };
  d._interactions.activate(shot, new Map([['["data","point"]', {}]]));
  return buttons[0];
}

test('[director-147] The action checks _destroyed', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d._executeInteraction = (action, signal) => {
    calls.push([action.type, signal instanceof AbortSignal]);
    return Promise.resolve(true);
  };
  const button = actionPanel(d, viewer);
  d._destroyed = true;
  button.click();
  for (let i = 0; i < 12; i++) await Promise.resolve();
  assert.deepEqual(calls, []);
  d._destroyed = false;
});

test('[director-147] The action checks _running', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d._executeInteraction = (action, signal) => {
    calls.push([action.type, signal instanceof AbortSignal]);
    return Promise.resolve(true);
  };
  const button = actionPanel(d, viewer);
  d._running = true;
  button.click();
  for (let i = 0; i < 12; i++) await Promise.resolve();
  assert.deepEqual(calls, []);
  d._running = false;
});

test('[director-147] The action checks trackedEntity', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d._executeInteraction = (action, signal) => {
    calls.push([action.type, signal instanceof AbortSignal]);
    return Promise.resolve(true);
  };
  const button = actionPanel(d, viewer);
  viewer.trackedEntity = { id: 'tracked' };
  button.click();
  for (let i = 0; i < 12; i++) await Promise.resolve();
  assert.deepEqual(calls, []);
});

test('[director-147] The action checks available', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d._executeInteraction = (action, signal) => {
    calls.push([action.type, signal instanceof AbortSignal]);
    return Promise.resolve(true);
  };
  const button = actionPanel(d, viewer);
  button.click();
  for (let i = 0; i < 12; i++) await Promise.resolve();
  assert.deepEqual(calls, [['focus', true]]);
  assert.equal(d._pendingWork.size, 0);
});

test('[director-148] The camera callback gives the authored pose', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const oldPerformance = globalThis.performance;
  globalThis.performance = { now: () => 0 };
  t.after(() => {
    globalThis.performance = oldPerformance;
  });
  const poses = [];
  d._setCameraView = (pose) => {
    poses.push(pose);
    return false;
  };
  assert.equal(
    await d._cameraMotion.play(
      {
        durationSec: 2,
        easing: 'linear',
        from: { lat: 0, lon: 0, alt: 100, heading: 0, pitch: 0, roll: 0 },
        to: { lat: 2, lon: 2, alt: 200, heading: 0, pitch: 0, roll: 0 },
      },
      {},
    ),
    false,
  );
  assert.deepEqual(poses, [
    { lat: 0, lon: 0, alt: 100, heading: 0, pitch: 0, roll: 0 },
  ]);
});

test('[director-148] The clock callbacks give state shot time and progress', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._running = true;
  assert.equal(d._clock.isRunning(), true);
  d._running = false;
  assert.equal(d._clock.isRunning(), false);
  d._sceneTimingForShot = (scene, shot) => [scene.id, shot.id];
  assert.deepEqual(
    d._clock.timingForShot({ id: 'scene-1' }, { id: 'shot-a' }),
    ['scene-1', 'shot-a'],
  );
  const progress = [];
  d._setProgress = (value) => progress.push(value);
  d._clock.onProgress(0.25);
  assert.deepEqual(progress, [0.25]);
  assert.equal(d._isMapStackAvailable('osm'), false);
});

test('[director-149] The initial snapshot gives the panel state', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d.getPlaybackStatus = () => ({
    status: 'parent',
    progress: 'parent',
    runtime: 'parent',
    playbackActive: 'parent',
    keyboardEnabled: 'parent',
    hasRun: 'parent',
  });
  const snapshots = [];
  d.subscribe((n) => snapshots.push(n));
  assert.equal(snapshots[0].initial, true);
  assert.equal(snapshots[0].state.status, 'Ready');
  assert.equal(snapshots[0].state.progress, 0);
  assert.equal(snapshots[0].state.runtime, '');
  assert.equal(snapshots[0].state.playbackActive, false);
  assert.equal(snapshots[0].state.keyboardEnabled, false);
  assert.equal(snapshots[0].state.hasRun, false);
  assert.equal(Object.isFrozen(snapshots[0].state), true);
  d._lastRunJson = '{}';
  d._publish({ type: 'test' });
  assert.equal(snapshots[1].state.hasRun, true);
});

test('[director-130] The shutdown removes pointerdown', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  await d.destroy();
  assert.equal(removals.filter((e) => e.event === 'pointerdown').length, 1);
  assert.equal(
    removals.find((e) => e.event === 'pointerdown').fn,
    events.find((e) => e.event === 'pointerdown').fn,
  );
});

test('[director-130] The shutdown removes wheel', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  await d.destroy();
  assert.equal(removals.filter((e) => e.event === 'wheel').length, 1);
  assert.equal(
    removals.find((e) => e.event === 'wheel').fn,
    events.find((e) => e.event === 'wheel').fn,
  );
});

test('[director-131] The shutdown accepts an absent work set', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  delete d._pendingWork;
  await assert.doesNotReject(d.destroy());
});

test('[director-123] The constructor accepts absent pack markers', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    {
      load: () => ({ scenes: [{ id: 'custom', title: 'Custom', shots: [] }] }),
      noBootstrap: true,
    },
  );
  assert.equal(d._project.scenes[0].id, 'custom');
});

test('[director-137] The empty shot list leaves its selection', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project.scenes[0].shots = [];
  d._selectedShotId = null;
  d._renderShotList();
  assert.equal(d._selectedShotId, null);
});

test('[director-146] The scene control selects an empty scene', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project.scenes.push({ id: 'empty', title: 'Empty', shots: [] });
  d._controls.actions.selectScene('empty');
  assert.equal(d._selectedShotId, null);
});

test('[director-146] The controls call create', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d._createScene = (...args) => calls.push(args);
  d._controls.actions.create('scene-1', 'shot-a');
  assert.deepEqual(calls, [['scene-1']]);
});

test('[director-146] The controls call deleteScene', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d._deleteSelectedScene = (...args) => calls.push(args);
  d._controls.actions.deleteScene('scene-1', 'shot-a');
  assert.deepEqual(calls, [[]]);
});

test('[director-146] The controls call capture', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d.captureShot = (...args) => calls.push(args);
  d._controls.actions.capture('scene-1', 'shot-a');
  assert.deepEqual(calls, [[]]);
});

test('[director-146] The controls call update', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d.updateSelectedShot = (...args) => calls.push(args);
  d._controls.actions.update('scene-1', 'shot-a');
  assert.deepEqual(calls, [[]]);
});

test('[director-146] The controls call start', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d.startScene = (...args) => calls.push(args);
  d._controls.actions.start('scene-1', 'shot-a');
  assert.deepEqual(calls, [['scene-1']]);
});

test('[director-146] The controls call stop', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d.stopScene = (...args) => calls.push(args);
  d._controls.actions.stop('scene-1', 'shot-a');
  assert.deepEqual(calls, [['scene-1']]);
});

test('[director-146] The controls call next', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d.runNextScene = (...args) => calls.push(args);
  d._controls.actions.next('scene-1', 'shot-a');
  assert.deepEqual(calls, [[]]);
});

test('[director-146] The controls call export', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d.exportProject = (...args) => calls.push(args);
  d._controls.actions.export('scene-1', 'shot-a');
  assert.deepEqual(calls, [[]]);
});

test('[director-146] The controls call import', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d.importProjectFile = (...args) => calls.push(args);
  d._controls.actions.import('scene-1', 'shot-a');
  assert.deepEqual(calls, [['scene-1']]);
});

test('[director-146] The controls call download', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d.downloadLastRunMetadata = (...args) => calls.push(args);
  d._controls.actions.download('scene-1', 'shot-a');
  assert.deepEqual(calls, [[]]);
});

test('[director-146] The controls call load', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d.loadShot = (...args) => calls.push(args);
  d._controls.actions.load('scene-1', 'shot-a');
  assert.deepEqual(calls, [['scene-1', 'shot-a']]);
});

test('[director-146] The controls call deleteShot', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d.deleteShot = (...args) => calls.push(args);
  d._controls.actions.deleteShot('scene-1', 'shot-a');
  assert.deepEqual(calls, [['scene-1', 'shot-a']]);
});

test('[director-146] The controls call reviewImport', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const calls = [];
  d._sharing.preview = (file) => calls.push(file);
  d._controls.actions.reviewImport('file');
  assert.deepEqual(calls, ['file']);
});

test('[director-118] The primary anchor takes precedence over the fallback', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._project = null;
  const value = project();
  value.scenes[0].id = 'bhote-koshi-flood';
  value.scenes.push({ id: 'flights-radar', title: 'Fallback', shots: [] });
  stored.set(KEY, JSON.stringify(value));
  const loaded = d._loadProject();
  assert.deepEqual(
    loaded.scenes.map((s) => s.id),
    ['bhote-koshi-flood', 'bhote-koshi-nepal-scene', 'flights-radar'],
  );
  d._project = loaded;
});

test('[director-121] The absent fallback avoids extra field access', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  let reads = 0;
  const recipe = {
    id: 'custom',
    title: 'Custom',
    installAlongsideSceneId: 'absent',
    get installAlongsideFallbackSceneId() {
      reads++;
      return undefined;
    },
  };
  SCENE_RECIPES.push(recipe);
  try {
    stored.set(
      KEY,
      JSON.stringify({
        version: 3,
        scenes: [
          { id: 'one', title: 'One', shots: [] },
          { id: 'two', title: 'Two', shots: [] },
        ],
      }),
    );
    const loaded = d._loadProject();
    assert.deepEqual(
      loaded.scenes.map((s) => s.id),
      ['one', 'two'],
    );
    assert.equal(reads, 1);
  } finally {
    SCENE_RECIPES.pop();
  }
});

test('[director-121] The recipe check rejects a nontext anchor', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  let reads = 0;
  const recipe = {
    id: 'custom',
    get installAlongsideSceneId() {
      reads++;
      return 42;
    },
  };
  SCENE_RECIPES.push(recipe);
  try {
    stored.set(
      KEY,
      JSON.stringify({
        version: 3,
        scenes: [
          { id: 'one', title: 'One', shots: [] },
          { id: 'two', title: 'Two', shots: [] },
        ],
      }),
    );
    const loaded = d._loadProject();
    assert.deepEqual(
      loaded.scenes.map((s) => s.id),
      ['one', 'two'],
    );
    assert.equal(reads, 1);
  } finally {
    SCENE_RECIPES.pop();
  }
});

test('[director-146] The blank shot title keeps its saved title', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._controls.actions.renameShot('scene-1', 'shot-b', '   ');
  assert.equal(d._project.scenes[0].shots[1].title, 'Shot B');
});

test('[director-144] The layer snapshot includes one', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  data.getAll = () => [{ id: 'one', enabled: true }];
  data.getLayerParams = () => ({ scale: 7 });
  assert.deepEqual(d._captureLayerStates(), {
    one: { enabled: true, params: { scale: 7 } },
  });
});

test('[director-144] The layer snapshot includes two', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  data.getAll = () => [{ id: 'two', enabled: true }];
  data.getLayerParams = () => ({ scale: 7 });
  assert.deepEqual(d._captureLayerStates(), {
    two: { enabled: true, params: { scale: 7 } },
  });
});

test('[director-144] The layer snapshot excludes absent parameters', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  data.getAll = () => [{ id: 'one', enabled: false }];
  data.getLayerParams = () => null;
  assert.deepEqual(d._captureLayerStates(), { one: { enabled: false } });
});

test('[director-142] The scene deletion accepts an empty shot list', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  const removed = { id: 'remove', shots: [] };
  d._selectedSceneId = 'remove';
  d._project.scenes = {
    find: () => removed,
    filter: () => [{ id: 'remaining', title: 'Remaining', shots: [] }],
  };
  d._saveProject = () => {};
  d._publish = () => {};
  d._deleteSelectedScene();
  assert.equal(d._selectedSceneId, 'remaining');
  assert.equal(d._selectedShotId, null);
});

test('[director-143] The last scene deletion uses an empty recipe list', async (t) => {
  const { d } = setup(t);
  const recipes = SCENE_RECIPES.splice(0);
  try {
    d._deleteSelectedScene();
    assert.deepEqual(d._project.scenes, []);
    assert.equal(d._selectedSceneId, null);
    assert.equal(d._selectedShotId, null);
  } finally {
    SCENE_RECIPES.push(...recipes);
  }
});

test('[director-124] The constructor accepts a viewer without a scene', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(
    t,
    { noScene: true },
  );
  assert.deepEqual(events, []);
  await assert.doesNotReject(d.destroy());
  assert.deepEqual(removals, []);
});

test('[director-124] The camera gesture accepts an absent event', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._usesAuthoredCamera = true;
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  style.handoff();
  assert.deepEqual(stops, ['Camera ownership changed']);
});

test('[director-125] The pointer press accepts an absent interaction owner', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._interactions = undefined;
  d._usesAuthoredCamera = true;
  const stops = [];
  d.stopScene = (m) => stops.push(m);
  style.handoff({ type: 'pointerdown' });
  assert.deepEqual(stops, ['Camera ownership changed']);
});

test('[director-130] The shutdown accepts absent optional owners', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._visibilityUnsubscribe?.();
  d._cameraHandoffUnsubscribe?.();
  for (const key of [
    '_visibilityUnsubscribe',
    '_cameraHandoffUnsubscribe',
    '_removeCameraInput',
    '_cameraMotion',
    '_sharing',
    '_bundleAssets',
    '_interactions',
    '_dataPacks',
    '_controls',
  ])
    d[key] = null;
  await assert.doesNotReject(d.destroy());
});

test('[director-145] The outcome accepts an absent state owner', async (t) => {
  const { d, writes, stored, viewer, style, data, events, removals } = setup(t);
  d._state.destroy();
  d._state = undefined;
  assert.doesNotThrow(() => d._publish({ type: 'test' }));
  d._state = { destroy() {} };
});

test('[director-146] The controls publish selection and name changes', async (t) => {
  const { d } = setup(t);
  const changes = [];
  d.subscribe(({ change }) => {
    if (change) changes.push(change);
  });
  d._controls.actions.selectShot('shot-b');
  d._controls.actions.selectScene('scene-1');
  d._controls.actions.renameShot('scene-1', 'shot-b', ' East ');
  assert.deepEqual(
    changes.map((change) => change.type),
    ['selection-changed', 'shots-changed', 'shot-renamed'],
  );
  assert.equal(changes[2].index, 1);
  assert.equal(changes[2].shot.title, 'East');
});

test('[director-124] The constructor accepts an absent camera subscription', async (t) => {
  const { d } = setup(t, { noHandoff: true });
  assert.equal(d._cameraHandoffUnsubscribe, undefined);
  await assert.doesNotReject(d.destroy());
});

test('[director-123] The constructor checks each scene and pack marker', async (t) => {
  const { d } = setup(t, {
    noBootstrap: true,
    load: () => ({
      scenes: [
        { id: 'first', title: 'First', shots: [], appliedShotPacks: [] },
        {
          id: 'second',
          title: 'Second',
          shots: [],
          appliedShotPacks: [
            { id: 'unknown', version: 17 },
            { id: 'bhote-koshi-nepal-evidence-pack', version: 17 },
          ],
        },
      ],
    }),
    append: function (...args) {
      (this._appendCalls ||= []).push(args);
    },
  });
  assert.deepEqual(d._appendCalls, [
    [
      'second',
      'bhote-koshi-nepal-evidence-pack',
      { render: false, announce: false },
    ],
  ]);
});

test('[director-149] The initial snapshot gives the storage error', async (t) => {
  const { d } = setup(t, {
    noBootstrap: true,
    raw: '{"version":99,"scenes":[]}',
  });
  const seen = [];
  d.subscribe((n) => seen.push(n));
  assert.equal(
    seen[0].state.status,
    'Saved project could not be read; storage preserved. Import a valid file to resume saving.',
  );
});

test('[director-121] The project checks recipe bhote-koshi-nepal-scene', async (t) => {
  const { d } = setup(t);
  let accesses = 0;
  const index = SCENE_RECIPES.findIndex(
    (recipe) => recipe.id === 'bhote-koshi-nepal-scene',
  );
  const recipe = SCENE_RECIPES[index];
  SCENE_RECIPES[index] = new Proxy(recipe, {
    get(target, key) {
      if (key === 'installAlongsideSceneId') accesses++;
      return Reflect.get(target, key);
    },
  });
  try {
    const loaded = d._loadProject();
    assert.deepEqual(
      loaded.scenes.map((scene) => scene.id),
      ['scene-1'],
    );
    assert.equal(accesses, 2);
  } finally {
    SCENE_RECIPES[index] = recipe;
  }
});

test('[director-121] The project checks recipe flights-radar', async (t) => {
  const { d } = setup(t);
  let accesses = 0;
  const index = SCENE_RECIPES.findIndex(
    (recipe) => recipe.id === 'flights-radar',
  );
  const recipe = SCENE_RECIPES[index];
  SCENE_RECIPES[index] = new Proxy(recipe, {
    get(target, key) {
      if (key === 'installAlongsideSceneId') accesses++;
      return Reflect.get(target, key);
    },
  });
  try {
    const loaded = d._loadProject();
    assert.deepEqual(
      loaded.scenes.map((scene) => scene.id),
      ['scene-1'],
    );
    assert.equal(accesses, 1);
  } finally {
    SCENE_RECIPES[index] = recipe;
  }
});

test('[director-121] The project checks recipe orbital-watch', async (t) => {
  const { d } = setup(t);
  let accesses = 0;
  const index = SCENE_RECIPES.findIndex(
    (recipe) => recipe.id === 'orbital-watch',
  );
  const recipe = SCENE_RECIPES[index];
  SCENE_RECIPES[index] = new Proxy(recipe, {
    get(target, key) {
      if (key === 'installAlongsideSceneId') accesses++;
      return Reflect.get(target, key);
    },
  });
  try {
    const loaded = d._loadProject();
    assert.deepEqual(
      loaded.scenes.map((scene) => scene.id),
      ['scene-1'],
    );
    assert.equal(accesses, 1);
  } finally {
    SCENE_RECIPES[index] = recipe;
  }
});

test('[director-121] The project checks recipe thermal-threats', async (t) => {
  const { d } = setup(t);
  let accesses = 0;
  const index = SCENE_RECIPES.findIndex(
    (recipe) => recipe.id === 'thermal-threats',
  );
  const recipe = SCENE_RECIPES[index];
  SCENE_RECIPES[index] = new Proxy(recipe, {
    get(target, key) {
      if (key === 'installAlongsideSceneId') accesses++;
      return Reflect.get(target, key);
    },
  });
  try {
    const loaded = d._loadProject();
    assert.deepEqual(
      loaded.scenes.map((scene) => scene.id),
      ['scene-1'],
    );
    assert.equal(accesses, 1);
  } finally {
    SCENE_RECIPES[index] = recipe;
  }
});

test('[director-121] The project checks recipe city-overload', async (t) => {
  const { d } = setup(t);
  let accesses = 0;
  const index = SCENE_RECIPES.findIndex(
    (recipe) => recipe.id === 'city-overload',
  );
  const recipe = SCENE_RECIPES[index];
  SCENE_RECIPES[index] = new Proxy(recipe, {
    get(target, key) {
      if (key === 'installAlongsideSceneId') accesses++;
      return Reflect.get(target, key);
    },
  });
  try {
    const loaded = d._loadProject();
    assert.deepEqual(
      loaded.scenes.map((scene) => scene.id),
      ['scene-1'],
    );
    assert.equal(accesses, 1);
  } finally {
    SCENE_RECIPES[index] = recipe;
  }
});

test('[director-121] The project checks recipe omniscience-pullback', async (t) => {
  const { d } = setup(t);
  let accesses = 0;
  const index = SCENE_RECIPES.findIndex(
    (recipe) => recipe.id === 'omniscience-pullback',
  );
  const recipe = SCENE_RECIPES[index];
  SCENE_RECIPES[index] = new Proxy(recipe, {
    get(target, key) {
      if (key === 'installAlongsideSceneId') accesses++;
      return Reflect.get(target, key);
    },
  });
  try {
    const loaded = d._loadProject();
    assert.deepEqual(
      loaded.scenes.map((scene) => scene.id),
      ['scene-1'],
    );
    assert.equal(accesses, 1);
  } finally {
    SCENE_RECIPES[index] = recipe;
  }
});

test('[director-123] The constructor reads an unknown pack marker', async (t) => {
  let accesses = 0;
  const { d } = setup(t, {
    noBootstrap: true,
    load: () => ({
      scenes: [
        {
          id: 'custom',
          title: 'Custom',
          shots: [],
          appliedShotPacks: [
            {
              get id() {
                accesses++;
                return 'unknown';
              },
              version: 17,
            },
            { id: 'bhote-koshi-nepal-evidence-pack', version: 17 },
          ],
        },
      ],
    }),
    append: function (...args) {
      (this._appendCalls ||= []).push(args);
    },
  });
  assert.equal(accesses, 1);
  assert.deepEqual(d._appendCalls, [
    [
      'custom',
      'bhote-koshi-nepal-evidence-pack',
      { render: false, announce: false },
    ],
  ]);
});

test('[director-123] The constructor reads an empty scene marker list', async (t) => {
  let accesses = 0;
  const { d } = setup(t, {
    noBootstrap: true,
    load: () => ({
      scenes: [
        {
          id: 'first',
          title: 'First',
          shots: [],
          get appliedShotPacks() {
            accesses++;
            return [];
          },
        },
        {
          id: 'second',
          title: 'Second',
          shots: [],
          appliedShotPacks: [
            { id: 'bhote-koshi-nepal-evidence-pack', version: 17 },
          ],
        },
      ],
    }),
    append: function (...args) {
      (this._appendCalls ||= []).push(args);
    },
  });
  assert.equal(accesses, 1);
  assert.deepEqual(d._appendCalls, [
    [
      'second',
      'bhote-koshi-nepal-evidence-pack',
      { render: false, announce: false },
    ],
  ]);
});

test('[director-138] The absent scene lookup returns null', async (t) => {
  const { d } = setup(t);
  d._selectedSceneId = 'absent';
  assert.equal(d._getSelectedScene(), null);
});

test('[director-150] The constructor gives its byte store to the bundle source', async (t) => {
  let calls = 0,
    accesses = 0;
  const source = () => {
    calls++;
    throw Error('external');
  };
  const { d } = setup(t, {
    constructorOptions: {
      dataPacks: { sources: { external: source, 'scene-bundle': source } },
    },
  });
  assert.deepEqual(d._dataPacks.sourceIds(), ['external', 'scene-bundle']);
  d._bundleAssets.replace(
    new Map([
      [
        'empty.bin',
        {
          get bytes() {
            accesses++;
            return new Uint8Array(0);
          },
          mimeType: 'application/octet-stream',
        },
      ],
    ]),
  );
  await assert.rejects(
    d._dataPacks.load([
      {
        id: 'data',
        version: 1,
        format: 'geojson',
        source: { adapter: 'scene-bundle', path: 'empty.bin' },
        attribution: { text: 'Example', license: 'CC0' },
        placement: { altitudeReference: 'ellipsoid' },
      },
    ]),
    /Data pack could not load/,
  );
  assert.equal(calls, 0);
  assert.equal(accesses, 2);
});

test('[director-114] The invalid document text protects saved bytes', async (t) => {
  const { d, writes, stored } = setup(t, { noBootstrap: true, raw: '{' });
  assert.ok(d._storageReadError);
  d._saveProject();
  assert.equal(writes.length, 0);
  assert.equal(stored.get(KEY), '{');
});
