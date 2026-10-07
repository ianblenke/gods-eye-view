import assert from 'node:assert/strict';
import test from 'node:test';
import { ownCameraArrival } from '../data/cameraArrival.js';
import { SceneDirector } from './director.js';
import { createDefaultScenePacks } from './packs/defaults.js';

function shot(id = 'a') {
  return {
    id,
    title: id.toUpperCase(),
    durationSec: 4,
    holdSec: 3,
    camera: { lon: 20, lat: 10, alt: 500000, heading: 12, pitch: -40, roll: 6 },
    visual: { style: 'normal' },
    layers: {},
  };
}
function setup() {
  const scene = {
    id: 's',
    title: 'Scene',
    shots: [shot(), shot('b')],
    releaseLayerIds: [],
  };
  const calls = [];
  const d = Object.create(SceneDirector.prototype);
  Object.assign(d, {
    _project: { version: 6, scenes: [scene] },
    _selectedSceneId: 's',
    _selectedShotId: 'a',
    _loadedSceneId: null,
    _destroyed: false,
    _running: false,
    _loadGeneration: 0,
    _sceneSeekGeneration: 0,
    _sceneTravelGeneration: 0,
    _activeSceneTravel: null,
    _loadAbort: null,
    _runIdleResolvers: new Set(),
    _scenePacks: createDefaultScenePacks(),
    _isMapStackAvailable: () => false,
    _clock: {
      stopShot: () => calls.push(['stop']),
      activeTimers: 2,
      snapshot: { phase: 'hold' },
      publish: (...args) => calls.push(['clock', ...args]),
      subscribe: (fn) => fn('clock'),
    },
    _cameraMotion: { cancel: () => calls.push(['motion']), active: false },
    _interactions: { clear: () => calls.push(['interactions']) },
    _dataPacks: { clear: () => calls.push(['packs']) },
    viewer: {
      camera: {
        cancelFlight: () => calls.push(['cancel']),
        setView: (value) => calls.push(['view', value]),
      },
    },
    styleManager: {
      getCameraState: () => ({
        lon: 30,
        lat: 15,
        alt: 800,
        heading: 2,
        pitch: 0,
        roll: 4,
      }),
      getVisualState: () => ({ style: 'retro' }),
      clearSearchedLocation: () => calls.push(['search']),
      runImmediateNavigation: (name, fn) => {
        calls.push(['claim', name, d._claimingCamera]);
        return fn();
      },
      applyVisualState: async (state, options) => {
        calls.push(['visual', state, options]);
      },
    },
    dataManager: {
      layers: new Map(),
      getAll: () => [{ id: 'one', enabled: true }],
      getLayerParams: () => ({ value: 7 }),
      setLayerParams: (...args) => {
        calls.push(['params', ...args]);
        return true;
      },
      setEnabled: async (...args) => {
        calls.push(['enabled', ...args]);
        return true;
      },
    },
    _saveProject: () => calls.push(['save']),
    _renderSceneSelect: () => calls.push(['scenes']),
    _renderShotList: () => calls.push(['shots']),
    _shotOutcome: (...args) => calls.push(['outcome', ...args]),
    _updateStatus: (value) => calls.push(['status', value]),
    _updateRuntime: (value) => calls.push(['runtime', value]),
    _setProgress: (value) => calls.push(['progress', value]),
    _startShotProgress: (...args) => calls.push(['phase', ...args]),
    _applyLayerStates: async (...args) => {
      calls.push(['layers', ...args]);
      return { refused: [] };
    },
    _applyDataPacks: async (...args) => {
      calls.push(['data', ...args]);
      return true;
    },
    _releaseSceneLayers: async (...args) => {
      calls.push(['leave', ...args]);
      return true;
    },
    _flyShotCamera: async (...args) => calls.push(['flight', ...args]),
    _activateInteractions: (...args) => calls.push(['actions', ...args]),
    stopScene: () => {
      calls.push(['scene-stop']);
      d._loadAbort?.abort();
      d._loadGeneration++;
      d._sceneSeekGeneration++;
    },
  });
  return { d, scene, a: scene.shots[0], b: scene.shots[1], calls };
}
function entries(calls, name) {
  return calls.filter((c) => c[0] === name);
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
}
function seek(a) {
  return {
    shot: a,
    camera: { lon: 25, lat: 15, alt: 1000, pitch: 0 },
    cameraProgress: 1,
    sceneProgress: 0.5,
    sceneElapsedSec: 7,
    shotElapsedSec: 7,
    flightDurationSec: 4,
    holdDurationSec: 3,
  };
}

// The fixture keeps browser state outside the shot methods.
test('[director-186] The capture records live fields and selects the new shot', () => {
  const { d, scene, calls } = setup();
  d.captureShot();
  assert.equal(scene.shots.length, 3);
  const s = scene.shots[2];
  assert.equal(s.title, 'Shot 3');
  assert.equal(s.camera.lon, 30);
  assert.equal(s.visual.style, 'retro');
  assert.deepEqual(s.layers, { one: { enabled: true, params: { value: 7 } } });
  assert.equal(s.durationSec, 4);
  assert.equal(s.holdSec, 0.9);
  assert.equal(d._selectedShotId, s.id);
  assert.equal(entries(calls, 'outcome')[0][1], 'shot-captured');
  assert.equal(entries(calls, 'save').length, 1);
});
for (const field of ['scene', 'camera'])
  test(`[director-187] The capture rejects an absent ${field}`, () => {
    const { d, scene, calls } = setup();
    if (field === 'scene') d._selectedSceneId = 'absent';
    else d.styleManager.getCameraState = () => null;
    d.captureShot();
    assert.equal(scene.shots.length, 2);
    assert.equal(entries(calls, 'save').length, 0);
  });
for (const move of [false, true])
  test(`[director-188] The update uses a ${move ? 'move' : 'static'} camera`, () => {
    const { d, a, calls } = setup();
    if (move) a.move = {};
    d.updateSelectedShot();
    assert.deepEqual(a.camera, {
      lon: 30,
      lat: 15,
      alt: 800,
      heading: 2,
      pitch: 0,
      roll: 4,
      ...(move ? { altitudeReference: 'ellipsoid' } : {}),
    });
    assert.deepEqual(a.visual, { style: 'retro' });
    assert.deepEqual(a.layers, {
      one: { enabled: true, params: { value: 7 } },
    });
    assert.equal(entries(calls, 'save').length, 1);
    assert.equal(entries(calls, 'outcome')[0][1], 'shot-updated');
  });
for (const field of ['scene', 'shot', 'camera'])
  test(`[director-189] The update rejects an absent ${field}`, () => {
    const { d, a, calls } = setup();
    if (field === 'scene') d._selectedSceneId = 'absent';
    if (field === 'shot') d._selectedShotId = 'absent';
    if (field === 'camera') d.styleManager.getCameraState = () => null;
    d.updateSelectedShot();
    assert.equal(a.camera.lon, 20);
    assert.equal(entries(calls, 'save').length, 0);
  });
for (const mode of ['first', 'last', 'absent scene', 'absent shot'])
  test(`[director-190] The deletion handles the ${mode}`, () => {
    const { d, scene, calls } = setup();
    if (mode === 'last') scene.shots.splice(1);
    d.deleteShot(
      mode === 'absent scene' ? 'absent' : 's',
      mode === 'absent shot' ? 'absent' : 'a',
    );
    assert.deepEqual(
      scene.shots.map((s) => s.id),
      mode === 'first' ? ['b'] : mode === 'last' ? [] : ['a', 'b'],
    );
    if (!mode.startsWith('absent')) {
      assert.equal(d._selectedShotId, mode === 'last' ? null : 'b');
      assert.equal(entries(calls, 'outcome')[0][1], 'shot-deleted');
      assert.equal(entries(calls, 'outcome')[0][4], 0);
    }
  });
for (const [mode, reason] of [
  ['destroyed', 'destroyed'],
  ['running', 'already-running'],
  ['scene', 'shot-not-found'],
  ['shot', 'shot-not-found'],
])
  test(`[director-191] The load rejects ${mode}`, async () => {
    const { d, calls } = setup();
    if (mode === 'destroyed') d._destroyed = true;
    if (mode === 'running') d._running = true;
    assert.deepEqual(
      await d.loadShot(
        mode === 'scene' ? 'absent' : 's',
        mode === 'shot' ? 'absent' : 'a',
      ),
      { started: false, reason },
    );
    assert.equal(entries(calls, 'visual').length, 0);
  });
test('[director-192] The camera refusal stops the load before visual state', async () => {
  const { d, calls } = setup();
  d.styleManager.runImmediateNavigation = () => false;
  assert.deepEqual(await d.loadShot('s', 'a'), {
    started: false,
    reason: 'camera-unavailable',
  });
  assert.equal(entries(calls, 'visual').length, 0);
});
for (const move of [false, true])
  test(`[director-193] The default flight uses the ${move ? 'move' : 'static'} duration`, async () => {
    const { d, a, calls } = setup();
    if (move) a.move = {};
    assert.deepEqual(await d.loadShot('s', 'a'), {
      started: true,
      shotId: 'a',
    });
    assert.equal(entries(calls, 'flight')[0][3], move ? 4 : 2.2);
  });
test('[director-194] The other scene stops before target visual state', async () => {
  const { d, calls } = setup();
  d._project.scenes.push({ id: 'old', title: 'Old', shots: [] });
  d._loadedSceneId = 'old';
  const gate = deferred();
  d._releaseSceneLayers = async (...args) => {
    calls.push(['leave', ...args]);
    return gate.promise;
  };
  const work = d.loadShot('s', 'a');
  assert.equal(entries(calls, 'visual').length, 0);
  gate.resolve(true);
  await work;
  assert.equal(entries(calls, 'leave')[0][1].id, 'old');
  assert.equal(d._loadedSceneId, 's');
});
for (const cancelled of [false, true])
  test(`[director-195] The scene departure handles ${cancelled ? 'cancellation' : 'refusal'}`, async () => {
    const { d, calls } = setup();
    d._project.scenes.push({ id: 'old', title: 'Old', shots: [] });
    d._loadedSceneId = 'old';
    d._releaseSceneLayers = async () => {
      if (cancelled) d._loadGeneration++;
      return cancelled;
    };
    assert.equal(await d.loadShot('s', 'a'), undefined);
    assert.equal(entries(calls, 'visual').length, 0);
    assert.equal(entries(calls, 'status').length, cancelled ? 0 : 1);
  });
test('[director-196] The newer load cancels an older visual wait', async () => {
  const { d, calls } = setup();
  const gate = deferred();
  let current;
  d.styleManager.applyVisualState = async (_, options) => {
    if (!current) {
      current = options;
      await gate.promise;
    }
  };
  const old = d.loadShot('s', 'a');
  const signal = d._loadAbort.signal;
  await d.loadShot('s', 'b');
  gate.resolve();
  assert.equal(await old, undefined);
  assert.equal(signal.aborted, true);
  assert.equal(current.isCurrent(), false);
  assert.deepEqual(
    entries(calls, 'layers').map((c) => c[2].cancelled),
    [false],
  );
  assert.equal(d._selectedShotId, 'b');
  assert.equal(d._loadGeneration, 2);
});
for (const kind of ['layers', 'packs'])
  test(`[director-197] The load reports ${kind} refusal`, async () => {
    const { d, calls } = setup();
    if (kind === 'layers')
      d._applyLayerStates = async () => ({ refused: ['one'] });
    else d._applyDataPacks = async () => false;
    assert.deepEqual(await d.loadShot('s', 'a'), {
      started: false,
      reason: kind === 'layers' ? 'layers-refused' : 'data-packs-unavailable',
    });
    assert.equal(entries(calls, 'flight').length, 0);
    assert.equal(d._sceneMediaModules.size, 0);
  });
test('[director-198] The load completes flight before the hold phase', async () => {
  const { d, calls } = setup();
  await d.loadShot('s', 'a', { flyDuration: 4 });
  assert.deepEqual(
    entries(calls, 'phase').map((c) => [c[2], c[3], c[4]]),
    [
      [4, 0, 2 / 7],
      [3, 2 / 7, 0.5],
    ],
  );
  assert.deepEqual(
    entries(calls, 'phase').map((c) => [
      c[5].sceneElapsedFrom,
      c[5].sceneElapsedTo,
    ]),
    [
      [0, 4],
      [4, 7],
    ],
  );
  assert.equal(entries(calls, 'outcome')[0][1], 'shot-loaded');
  assert.equal(entries(calls, 'runtime')[0][1], '');
  assert.equal(d._loadAbort, null);
  assert.equal(entries(calls, 'actions').length, 1);
});
for (const stale of [false, true])
  test(`[director-199] The flight error handles a ${stale ? 'stale' : 'live'} token`, async () => {
    const { d, calls } = setup();
    d._flyShotCamera = async () => {
      if (stale) d._loadGeneration++;
      throw Error('flight');
    };
    await assert.rejects(d.loadShot('s', 'a'), /flight/);
    assert.equal(entries(calls, 'stop').length, stale ? 1 : 2);
    assert.equal(d._activeSceneTravel, null);
  });
for (const id of ['one', 'two'])
  test(`[director-200] The media owner reaches layer ${id}`, () => {
    const { d, scene, a } = setup();
    const grants = [];
    d.dataManager.layers.set(id, {
      module: { setSceneMediaPlayback: (value) => grants.push(value) },
    });
    a.layers = { [id]: { enabled: true } };
    let cancelled = false;
    const token = {
      get cancelled() {
        return cancelled;
      },
    };
    d._setSceneMediaPlayback(scene, a, token);
    assert.equal(grants.length, 1);
    assert.equal(grants[0].sceneId, 's');
    assert.equal(grants[0].shotId, 'a');
    assert.equal(Object.hasOwn(grants[0], 'token'), true);
    assert.equal(grants[0].token.cancelled, false);
    cancelled = true;
    assert.equal(grants[0].token.cancelled, true);
    assert.equal(d._sceneMediaModules.size, 1);
  });
for (const kind of [
  'disabled',
  'absent module',
  'nonfunction',
  'absent layers',
])
  test(`[director-200] The media method skips ${kind === 'nonfunction' ? 'a value that is not a function' : kind}`, () => {
    const { d, scene, a } = setup();
    const grants = [];
    a.layers =
      kind === 'absent layers'
        ? undefined
        : { one: { enabled: kind !== 'disabled' } };
    if (kind !== 'absent module')
      d.dataManager.layers.set('one', {
        module: {
          setSceneMediaPlayback:
            kind === 'nonfunction' ? 1 : (value) => grants.push(value),
        },
      });
    d._setSceneMediaPlayback(scene, a, { cancelled: false });
    assert.equal(grants.length, 0);
  });
for (const kind of ['scene', 'shot', 'token', 'cancelled', 'aborted'])
  test(`[director-201] The media guard checks ${kind}`, () => {
    const { d, scene, a } = setup();
    let old = 0,
      grants = 0;
    d._sceneMediaModules = new Set([
      { setSceneMediaPlayback: () => old++ },
      { setSceneMediaPlayback: () => old++ },
    ]);
    a.layers = { one: { enabled: true } };
    d.dataManager.layers.set('one', {
      module: { setSceneMediaPlayback: () => grants++ },
    });
    const token = {
      cancelled: kind === 'cancelled',
      signal: { aborted: kind === 'aborted' },
    };
    d._setSceneMediaPlayback(
      kind === 'scene' ? null : scene,
      kind === 'shot' ? null : a,
      kind === 'token' ? null : token,
    );
    assert.equal(old, 2);
    assert.equal(grants, 0);
    assert.equal(d._sceneMediaModules.size, 0);
  });
function state(control, enabled = true) {
  return { enabled, params: { sceneControls: { [control]: true } } };
}
for (const [method, control, id] of [
  ['_settleShotLayerStates', 'deferEvidenceUntilCameraSettled', 202],
  ['_publishShotTravel', 'evidencePathDuringCamera', 204],
  ['_cancelActiveSceneTravel', 'evidencePathDuringCamera', 205],
]) {
  for (const layer of ['one', 'two'])
    test(`[director-${id}] The ${method.slice(1)} reaches layer ${layer}`, () => {
      const { d, scene, a, calls } = setup();
      let options;
      d._layerStatesForShot = (_s, _a, o) => {
        options = o;
        return { [layer]: state(control) };
      };
      const travel = d._beginShotTravel(scene, a, 4);
      if (method === '_cancelActiveSceneTravel')
        assert.equal(d[method](), true);
      else if (method === '_publishShotTravel') d[method](scene, a, travel);
      else d[method](scene, a, { cancelled: false }, travel);
      assert.equal(entries(calls, 'params').length, 1);
      assert.equal(entries(calls, 'params')[0][1], layer);
      assert.deepEqual(entries(calls, 'params')[0][3], { origin: 'scene' });
      if (method === '_publishShotTravel')
        assert.equal(options.cameraTravel.id, 1);
      if (method === '_settleShotLayerStates') {
        assert.deepEqual(options.cameraTravel, {
          id: 1,
          durationSec: 4,
          active: false,
          completed: true,
          cancelled: false,
        });
        assert.equal(d._activeSceneTravel, null);
      }
      if (method === '_cancelActiveSceneTravel') {
        assert.deepEqual(options.cameraTravel, {
          id: 1,
          durationSec: 4,
          active: false,
          completed: false,
          cancelled: true,
        });
        assert.equal(d._activeSceneTravel, null);
      }
    });
  for (const kind of ['disabled', 'control'])
    test(`[director-${id}] The ${method.slice(1)} skips the ${kind} layer`, () => {
      const { d, scene, a, calls } = setup();
      d._layerStatesForShot = () => ({
        one:
          kind === 'disabled'
            ? state(control, false)
            : { enabled: true, params: {} },
      });
      d._beginShotTravel(scene, a, 4);
      if (method === '_cancelActiveSceneTravel') d[method]();
      else d[method](scene, a, null, { id: 1 });
      assert.equal(entries(calls, 'params').length, 0);
    });
}
test('[director-202] The cancelled token does not settle layers', () => {
  const { d, scene, a, calls } = setup();
  a.layers = { one: state('deferEvidenceUntilCameraSettled') };
  assert.equal(d._settleShotLayerStates(scene, a, { cancelled: true }), false);
  assert.equal(entries(calls, 'params').length, 0);
});
test('[director-202] The absent travel does not change another travel owner', () => {
  const { d, scene, a } = setup();
  d._beginShotTravel(scene, a, 4);
  assert.equal(d._settleShotLayerStates(scene, a), true);
  assert.equal(d._activeSceneTravel.id, 1);
});
for (const [value, want] of [
  [4, 4],
  [-1, 0.2],
  ['bad', 4],
])
  test(`[director-203] The travel duration ${value} gives ${want} seconds`, () => {
    const { d, scene, a } = setup();
    const travel = d._beginShotTravel(scene, a, value);
    assert.deepEqual(travel, {
      id: 1,
      durationSec: want,
      active: true,
      completed: false,
      cancelled: false,
    });
    assert.equal(d._beginShotTravel(scene, a, 2).id, 2);
  });
test('[director-205] The absent travel still cancels camera motion', () => {
  const { d, calls } = setup();
  d._usesAuthoredCamera = true;
  assert.equal(d._cancelActiveSceneTravel(), false);
  assert.equal(d._usesAuthoredCamera, false);
  assert.equal(entries(calls, 'motion').length, 1);
});
for (const mode of ['false', 'throw', 'reject disable', 'throw disable'])
  test(`[director-206] The travel cancellation handles ${{ false: 'a parameter refusal', throw: 'a parameter error', 'reject disable': 'an asynchronous layer error', 'throw disable': 'a synchronous layer error' }[mode]}`, async () => {
    const { d, scene, a, calls } = setup();
    const warnings = [];
    const warn = console.warn;
    console.warn = (...args) => warnings.push(args);
    try {
      d._layerStatesForShot = () => ({
        one: state('evidencePathDuringCamera'),
      });
      d._beginShotTravel(scene, a, 4);
      d.dataManager.setLayerParams = () => {
        if (mode === 'throw') throw Error('params');
        return false;
      };
      d.dataManager.setEnabled = (...args) => {
        calls.push(['enabled', ...args]);
        if (mode === 'throw disable') throw Error('disable');
        return mode === 'reject disable'
          ? Promise.reject(Error('disable'))
          : Promise.resolve(true);
      };
      assert.equal(d._cancelActiveSceneTravel(), true);
      await Promise.resolve();
      await Promise.resolve();
      assert.deepEqual(entries(calls, 'enabled'), [
        ['enabled', 'one', false, { origin: 'scene' }],
      ]);
      assert.equal(warnings.length, mode === 'false' ? 0 : 1);
    } finally {
      console.warn = warn;
    }
  });
for (const move of [false, true])
  test(`[director-207] The replay uses a ${move ? 'move' : 'static'} shot`, async () => {
    const { d, a, b, calls } = setup();
    b.camera.lon = 40;
    if (move) a.move = {};
    d.loadShot = async (...args) => {
      calls.push(['load', ...args]);
      return { started: true, shotId: 'a' };
    };
    assert.deepEqual(await d.replayShot('s', 'a'), {
      started: true,
      shotId: 'a',
    });
    const options = entries(calls, 'load')[0][3];
    assert.equal(options.playMedia, true);
    assert.equal(options.flyDuration, 4);
    assert.equal(options.fromCamera === null, move);
    if (!move) assert.equal(options.fromCamera.lon, 40);
  });
test('[director-207] The replay uses the default duration and cancellation result', async () => {
  const { d, a, calls } = setup();
  a.durationSec = 0;
  d.loadShot = async (...args) => {
    calls.push(['load', ...args]);
  };
  assert.deepEqual(await d.replayShot('s', 'a'), {
    started: false,
    reason: 'cancelled',
  });
  assert.equal(entries(calls, 'load')[0][3].flyDuration, 4);
});
for (const mode of ['destroyed', 'running', 'scene', 'shot'])
  test(`[director-208] The replay rejects ${mode}`, async () => {
    const { d } = setup();
    let calls = 0;
    const load = d.loadShot.bind(d);
    d.loadShot = (...args) => {
      calls++;
      return load(...args);
    };
    d._destroyed = mode === 'destroyed';
    d._running = mode === 'running';
    assert.deepEqual(
      await d.replayShot(
        mode === 'scene' ? 'absent' : 's',
        mode === 'shot' ? 'absent' : 'a',
      ),
      {
        started: false,
        reason:
          mode === 'destroyed'
            ? 'destroyed'
            : mode === 'running'
              ? 'already-running'
              : 'shot-not-found',
      },
    );
    assert.equal(calls, 0);
  });
test('[director-209] The scene request starts after the selected shot', async () => {
  const { d, calls } = setup();
  d.startScene = (...args) => {
    calls.push(['start', ...args]);
    return 'result';
  };
  assert.equal(await d.continueScene('s', 'a'), 'result');
  assert.deepEqual(entries(calls, 'start'), [
    ['start', 's', { single: true, afterShotId: 'a', preview: false }],
  ]);
});
for (const field of ['scene', 'shot'])
  test(`[director-209] The scene request rejects an absent ${field}`, async () => {
    const { d } = setup();
    assert.deepEqual(
      await d.continueScene(
        field === 'scene' ? 'absent' : 's',
        field === 'shot' ? 'absent' : 'a',
      ),
      { started: false, reason: 'shot-not-found' },
    );
  });
for (const direction of [-1, 1])
  test(`[director-210] The adjacent direction ${direction} selects its target`, async () => {
    const { d, calls } = setup();
    d.loadShot = async (...args) => {
      calls.push(['load', ...args]);
      return { started: true };
    };
    assert.equal(
      await d.loadAdjacentShot('s', direction < 0 ? 'b' : 'a', direction),
      true,
    );
    assert.deepEqual(entries(calls, 'load'), [
      ['load', 's', direction < 0 ? 'a' : 'b'],
    ]);
  });
for (const mode of [
  'destroyed',
  'running',
  'scene',
  'first',
  'last',
  'refusal',
])
  test(`[director-211] The adjacent request rejects ${mode}`, async () => {
    const { d } = setup();
    let calls = 0;
    d._destroyed = mode === 'destroyed';
    d._running = mode === 'running';
    d.loadShot = async () => {
      calls++;
      return { started: false };
    };
    assert.equal(
      await d.loadAdjacentShot(
        mode === 'scene' ? 'absent' : 's',
        mode === 'last' ? 'b' : 'a',
        mode === 'first' ? -1 : 1,
      ),
      false,
    );
    assert.equal(calls, mode === 'refusal' ? 1 : 0);
  });
for (const active of [false, true])
  test(`[director-212] The clock timer total checks camera motion ${active}`, () => {
    const { d } = setup();
    d._cameraMotion.active = active;
    assert.deepEqual(d.getPlaybackTimingState(), {
      activeTimers: active ? 3 : 2,
      snapshot: { phase: 'hold' },
    });
    let value;
    assert.equal(
      d.subscribeSceneClock((v) => {
        value = v;
        return 'subscribed';
      }),
      'subscribed',
    );
    assert.equal(value, 'clock');
  });
for (const running of [false, true])
  test(`[director-213] The idle promise handles an ${running ? 'active' : 'idle'} scene`, async () => {
    const { d } = setup();
    d._running = running;
    let done = false;
    const work = d._waitForRunIdle().then(() => {
      done = true;
    });
    await Promise.resolve();
    assert.equal(done, !running);
    assert.equal(d._runIdleResolvers.size, running ? 1 : 0);
    for (const resolve of d._runIdleResolvers) resolve();
    await work;
    assert.equal(done, true);
  });
for (const layer of ['one', 'two'])
  test(`[director-214] The direct seek updates layer ${layer} and the camera`, () => {
    const { d, scene, a, calls } = setup();
    d._loadedSceneId = 's';
    a.layers = { [layer]: { enabled: true, params: { value: 7 } } };
    d._loadAbort = new AbortController();
    const signal = d._loadAbort.signal;
    assert.equal(d._seekLoadedShot(scene, seek(a)), true);
    assert.equal(signal.aborted, true);
    assert.equal(d._loadAbort, null);
    assert.equal(d._loadGeneration, 1);
    assert.deepEqual(entries(calls, 'params'), [
      ['params', layer, { value: 7 }, { origin: 'scene' }],
    ]);
    assert.equal(entries(calls, 'view').length, 1);
    assert.deepEqual(entries(calls, 'progress'), [['progress', 0.5]]);
    assert.equal(entries(calls, 'clock')[0][3], 7);
    assert.deepEqual(entries(calls, 'clock')[0][4], {
      running: false,
      seeking: true,
    });
  });
for (const mode of [
  'destroyed',
  'scene',
  'shot',
  'packs',
  'actions',
  'loaded scene',
  'selected shot',
])
  test(`[director-215] The direct seek guard checks ${mode}`, () => {
    const { d, scene, a, calls } = setup();
    d._loadedSceneId = 's';
    d._destroyed = mode === 'destroyed';
    if (mode === 'packs') a.dataPackIds = ['p'];
    if (mode === 'actions') a.interactions = [{}];
    if (mode === 'loaded scene') d._loadedSceneId = 'other';
    if (mode === 'selected shot') d._selectedShotId = 'b';
    assert.equal(
      d._seekLoadedShot(
        mode === 'scene' ? null : scene,
        mode === 'shot' ? {} : seek(a),
      ),
      false,
    );
    assert.equal(entries(calls, 'view').length, 0);
  });
for (const kind of ['camera', 'params'])
  test(`[director-216] The direct seek rejects ${kind} refusal`, () => {
    const { d, scene, a, calls } = setup();
    d._loadedSceneId = 's';
    a.layers = { one: { enabled: true, params: { value: 7 } } };
    if (kind === 'camera') d.styleManager.runImmediateNavigation = () => false;
    else d.dataManager.setLayerParams = () => false;
    assert.equal(d._seekLoadedShot(scene, seek(a)), false);
    assert.equal(entries(calls, 'view').length, 0);
  });
for (const kind of ['disabled', 'params'])
  test(`[director-214] The direct seek skips absent ${kind}`, () => {
    const { d, scene, a, calls } = setup();
    d._loadedSceneId = 's';
    a.layers = {
      one:
        kind === 'disabled'
          ? { enabled: false, params: { value: 7 } }
          : { enabled: true },
    };
    assert.equal(d._seekLoadedShot(scene, seek(a)), true);
    assert.equal(entries(calls, 'params').length, 0);
  });
for (const loaded of [false, true])
  test(`[director-217] The scene seek uses the ${loaded ? 'direct' : 'load'} path`, async () => {
    const { d, calls } = setup();
    if (loaded) d._loadedSceneId = 's';
    assert.equal(await d.seekScene('s', 0.1), true);
    assert.equal(entries(calls, 'visual').length, loaded ? 0 : 1);
    assert.equal(entries(calls, 'clock')[0][4].seeking, true);
    assert.equal(entries(calls, 'view').length, 1);
  });
for (const kind of ['destroyed', 'scene', 'empty', 'stale', 'absent state'])
  test(`[director-218] The scene seek rejects ${kind}`, async () => {
    const { d, scene, calls } = setup();
    d._destroyed = kind === 'destroyed';
    if (kind === 'empty') scene.shots = [];
    if (kind === 'stale') {
      d._running = true;
      d._waitForRunIdle = async () => {
        d._running = false;
        d._sceneSeekGeneration++;
      };
    }
    if (kind === 'absent state') d._sceneSeekState = () => null;
    assert.equal(
      await d.seekScene(kind === 'scene' ? 'absent' : 's', 0.5),
      false,
    );
    assert.equal(entries(calls, 'view').length, 0);
    if (kind === 'destroyed')
      assert.equal(entries(calls, 'scene-stop').length, 0);
  });
for (const kind of ['destroyed', 'stale', 'not started'])
  test(`[director-218] The scene seek checks ${kind} after the shot load`, async () => {
    const { d } = setup();
    d._loadShot = async () => {
      if (kind === 'destroyed') d._destroyed = true;
      if (kind === 'stale') d._sceneSeekGeneration++;
      return { started: kind !== 'not started' };
    };
    assert.equal(await d.seekScene('s', 0.5), false);
  });
for (const kind of ['destroyed', 'aborted', 'generation', 'live'])
  test(`[director-219] The load token checks ${kind}`, () => {
    const { d } = setup();
    const controller = new AbortController();
    const token = d._loadToken(0, controller.signal);
    assert.equal(token.cancelled, false);
    if (kind === 'destroyed') d._destroyed = true;
    if (kind === 'aborted') controller.abort();
    if (kind === 'generation') d._loadGeneration++;
    assert.equal(token.cancelled, kind !== 'live');
    assert.equal(token.signal, controller.signal);
  });
test('[director-219] The load token accepts an absent signal', () => {
  const { d } = setup();
  assert.equal(d._loadToken(0).cancelled, false);
});
for (const kind of ['absent', 'true', 'false', 'throw'])
  test(`[director-220] The camera claim handles ${kind}`, () => {
    const { d, calls } = setup();
    if (kind === 'absent') delete d.styleManager.runImmediateNavigation;
    if (kind === 'false') d.styleManager.runImmediateNavigation = () => false;
    if (kind === 'throw')
      d.styleManager.runImmediateNavigation = () => {
        throw Error('claim');
      };
    if (kind === 'throw')
      assert.throws(() => d._claimCameraOwnership(), /claim/);
    else assert.equal(d._claimCameraOwnership(), kind !== 'false');
    if (kind !== 'absent') assert.equal(d._claimingCamera, false);
    if (kind === 'true')
      assert.deepEqual(entries(calls, 'claim'), [['claim', 'scene', true]]);
  });
for (const kind of ['pose', 'zero', 'defaults', 'absent pose', 'absent method'])
  test(`[director-${kind.startsWith('absent') ? 230 : 221}] The camera placement handles ${kind}`, () => {
    const { d, a, calls } = setup();
    let pose = { ...a.camera };
    if (kind === 'zero') pose = { ...pose, heading: 0, pitch: 0, roll: 0 };
    if (kind === 'defaults') pose = { lon: 20, lat: 10, alt: 500000 };
    if (kind === 'absent method') delete d.viewer.camera.setView;
    assert.equal(
      d._setCameraView(kind === 'absent pose' ? null : pose),
      !kind.startsWith('absent'),
    );
    if (kind.startsWith('absent')) assert.deepEqual(calls, []);
    if (!kind.startsWith('absent')) {
      const view = entries(calls, 'view')[0][1];
      assert.ok(Math.abs(view.destination.x - 6365737.83189302) < 0.001);
      assert.ok(Math.abs(view.destination.y - 2316939.08995133) < 0.001);
      assert.ok(Math.abs(view.destination.z - 1187072.6365688266) < 0.001);
      assert.ok(
        Math.abs(
          view.orientation.heading -
            (kind === 'pose' ? 0.20943951023931956 : 0),
        ) < 1e-12,
      );
      assert.ok(
        Math.abs(
          view.orientation.pitch -
            (kind === 'pose'
              ? -0.6981317007977318
              : kind === 'zero'
                ? 0
                : -0.6108652381980153),
        ) < 1e-12,
      );
      assert.ok(
        Math.abs(
          view.orientation.roll - (kind === 'pose' ? 0.10471975511965978 : 0),
        ) < 1e-12,
      );
      assert.deepEqual(calls.slice(0, 2), [['search'], ['cancel']]);
    }
  });
test('[director-222] The scene list gives project order and shot totals', () => {
  const { d } = setup();
  d._project.scenes.push({ id: 'z', title: 'Last', shots: [] });
  assert.deepEqual(d.listScenes(), [
    { id: 's', title: 'Scene', shots: 2 },
    { id: 'z', title: 'Last', shots: 0 },
  ]);
});
for (const [query, want] of [
  ['s', 's'],
  [' SCENE ', 's'],
  ['cen', 's'],
  ['absent', null],
  ['', null],
  [null, null],
  [undefined, null],
])
  test(`[director-223] The scene query handles ${String(query) || 'blank'}`, () => {
    const { d } = setup();
    assert.equal(d.findSceneByQuery(query)?.id ?? null, want);
  });
test('[director-223] The scene ID takes precedence over both title matches', () => {
  const { d } = setup();
  d._project.scenes.unshift(
    { id: 'x', title: 's', shots: [] },
    { id: 'y', title: 's longer', shots: [] },
  );
  assert.deepEqual(d.findSceneByQuery('s'), {
    id: 's',
    title: 'Scene',
    shots: 2,
  });
});
test('[director-223] The exact title takes precedence over a substring', () => {
  const { d } = setup();
  d._project.scenes.unshift({ id: 'x', title: 'Scene extra', shots: [] });
  assert.equal(d.findSceneByQuery('scene').id, 's');
});
for (const active of [false, true])
  test(`[director-224] The playback status handles an ${active ? 'active' : 'idle'} scene`, () => {
    const { d } = setup();
    const now = Date.now;
    Date.now = () => Date.parse('2026-10-06T12:00:02Z');
    try {
      if (active)
        d._activeRun = {
          startedAt: '2026-10-06T12:00:00Z',
          estimatedDurationSec: 1.2345,
        };
      assert.deepEqual(d.getPlaybackStatus(), {
        running: false,
        selectedSceneId: 's',
        selectedShotId: 'a',
        elapsedMs: active ? 2000 : null,
        estimatedDurationMs: active ? 1235 : null,
        sceneCount: 1,
      });
    } finally {
      Date.now = now;
    }
  });
for (const direct of [false, true])
  test(`[director-225] The ${direct ? 'direct' : 'loaded'} seek resolves an absent camera`, async () => {
    const { d, scene, a, calls } = setup();
    const position = seek(a);
    delete position.camera;
    if (direct) {
      d._loadedSceneId = 's';
      assert.equal(d._seekLoadedShot(scene, position), true);
    } else
      assert.deepEqual(await d.loadShot('s', 'a', { sceneSeek: position }), {
        started: true,
        shotId: 'a',
      });
    assert.ok(
      Math.abs(
        entries(calls, 'view')[0][1].orientation.heading - 0.20943951023931956,
      ) < 1e-12,
    );
  });
for (const phase of ['layers', 'packs', 'flight', 'settle'])
  test(`[director-227] The load cancellation stops after ${phase}`, async () => {
    const { d, calls } = setup();
    if (phase === 'layers')
      d._applyLayerStates = async () => {
        d._loadGeneration++;
        return { refused: [] };
      };
    if (phase === 'packs')
      d._applyDataPacks = async () => {
        d._loadGeneration++;
        return true;
      };
    if (phase === 'flight') {
      d._flyShotCamera = async () => {
        d._loadGeneration++;
      };
      d._settleShotLayerStates = () => calls.push(['settled']);
    }
    if (phase === 'settle')
      d._settleShotLayerStates = () => {
        d._loadGeneration++;
      };
    assert.equal(await d.loadShot('s', 'a'), undefined);
    assert.equal(entries(calls, 'outcome').length, 0);
    assert.equal(
      entries(calls, 'phase').length,
      ['layers', 'packs'].includes(phase) ? 0 : 1,
    );
    if (phase === 'layers') {
      assert.equal(d._loadedSceneId, null);
      assert.equal(entries(calls, 'data').length, 0);
    }
    if (phase === 'flight') assert.equal(entries(calls, 'settled').length, 0);
  });
test('[director-221] The camera placement accepts optional facade methods', () => {
  const { d, a } = setup();
  d.styleManager = null;
  delete d.viewer.camera.cancelFlight;
  assert.equal(d._setCameraView(a.camera), true);
});
test('[director-205] The travel cancellation resolves a pack module', () => {
  const { d } = setup();
  d.dataManager.layers.set('one', { module: { name: 'one' } });
  let module;
  d._scenePacks.cancelMotion = (get) => {
    module = get('one');
  };
  assert.equal(d._cancelActiveSceneTravel(), false);
  assert.deepEqual(module, { name: 'one' });
});
for (const method of ['deleteShot', 'loadShot', 'replayShot', 'continueScene'])
  for (const field of ['scene', 'shot'])
    test(`[director-${{ deleteShot: 190, loadShot: 191, replayShot: 208, continueScene: 209 }[method]}] The ${method} checks only an absent ${field}`, async () => {
      const { d, scene, a, calls } = setup();
      d._getShot = () => ({
        scene: field === 'scene' ? null : scene,
        shot: field === 'shot' ? null : a,
      });
      const result = await d[method]('s', 'a');
      if (method === 'deleteShot')
        assert.equal(entries(calls, 'save').length, 0);
      else
        assert.deepEqual(result, { started: false, reason: 'shot-not-found' });
    });
for (const outcome of ['failure', 'error'])
  for (const mode of ['owned', 'unowned', 'stale', 'success'])
    test(`[director-226] The ${outcome} media cleanup checks ${mode}`, async () => {
      const { d } = setup();
      let calls = 0;
      d._setSceneMediaPlayback = () => calls++;
      d._loadShot = async () => {
        if (mode !== 'unowned') d._loadGeneration++;
        if (mode === 'stale') queueMicrotask(() => d._loadGeneration++);
        if (outcome === 'error') throw Error('load');
        return { started: mode === 'success' };
      };
      if (outcome === 'error')
        await assert.rejects(d.loadShot('s', 'a'), /load/);
      else await d.loadShot('s', 'a');
      assert.equal(
        calls,
        mode === 'owned' || (outcome === 'error' && mode === 'success') ? 1 : 0,
      );
    });
for (const kind of ['false', 'number'])
  test(`[director-193] The scene seek option handles ${kind}`, async () => {
    const { d, calls } = setup();
    await d.loadShot('s', 'a', { sceneSeek: kind === 'false' ? false : 1 });
    assert.equal(entries(calls, 'flight').length, 1);
  });
for (const enabled of [false, true])
  test(`[director-200] The load media option handles ${enabled}`, async () => {
    const { d, a } = setup();
    const grants = [];
    a.layers = { one: { enabled: true } };
    d.dataManager.layers.set('one', {
      module: { setSceneMediaPlayback: (value) => grants.push(value) },
    });
    await d.loadShot('s', 'a', { playMedia: enabled });
    assert.equal(grants.filter(Boolean).length, enabled ? 1 : 0);
  });
test('[director-200] The scene seek does not grant media ownership', async () => {
  const { d, a } = setup();
  const grants = [];
  a.layers = { one: { enabled: true } };
  d.dataManager.layers.set('one', {
    module: { setSceneMediaPlayback: (value) => grants.push(value) },
  });
  await d.loadShot('s', 'a', { playMedia: true, sceneSeek: seek(a) });
  assert.equal(grants.filter(Boolean).length, 0);
});
for (const id of ['one', 'two'])
  test(`[director-201] The old media owner stops module ${id}`, () => {
    const { d } = setup();
    let calls = 0;
    d._sceneMediaModules = new Set([
      { id, setSceneMediaPlayback: () => calls++ },
    ]);
    d._setSceneMediaPlayback();
    assert.equal(calls, 1);
  });
test('[director-223] The null query does not match the word null', () => {
  const { d } = setup();
  d._project.scenes.push({ id: 'null', title: 'null', shots: [] });
  assert.equal(d.findSceneByQuery(null), null);
});
test('[director-198] The flight starts before travel publication and layer settlement', async () => {
  const { d, calls } = setup();
  d._publishShotTravel = () => calls.push(['travel']);
  d._settleShotLayerStates = () => calls.push(['settled']);
  await d.loadShot('s', 'a', {
    fromCamera: { lon: 25, lat: 15, alt: 1000, pitch: 0 },
  });
  assert.deepEqual(
    calls
      .filter((c) =>
        ['view', 'flight', 'travel', 'settled', 'phase'].includes(c[0]),
      )
      .map((c) => c[0]),
    ['view', 'phase', 'flight', 'travel', 'settled', 'phase'],
  );
});
for (const progress of [0.5, 1])
  test(`[director-217] The scene seek uses camera progress ${progress}`, async () => {
    const { d, a, calls } = setup();
    const options = [];
    d._layerStatesForShot = (_s, _a, o) => {
      options.push(o);
      return {};
    };
    await d.loadShot('s', 'a', {
      sceneSeek: { ...seek(a), cameraProgress: progress },
    });
    assert.equal(options[0].cameraSettled, progress === 1);
    assert.equal(entries(calls, 'flight').length, 0);
  });
test('[director-202] The absent travel gives null layer travel state', () => {
  const { d, scene, a } = setup();
  let options;
  d._layerStatesForShot = (_s, _a, o) => {
    options = o;
    return {};
  };
  assert.equal(d._settleShotLayerStates(scene, a), true);
  assert.equal(options.cameraTravel, null);
  assert.equal(options.cameraSettled, true);
});
test('[director-218] The scene seek rejects destruction after its idle wait', async () => {
  const { d, calls } = setup();
  d._running = true;
  d._waitForRunIdle = async () => {
    d._running = false;
    d._destroyed = true;
  };
  assert.equal(await d.seekScene('s', 0.5), false);
  assert.equal(entries(calls, 'visual').length, 0);
});
for (const direct of [false, true])
  test(`[director-225] The ${direct ? 'direct' : 'loaded'} seek uses its own camera`, async () => {
    const { d, scene, a, calls } = setup();
    const position = {
      ...seek(a),
      camera: { lon: 25, lat: 15, alt: 1000, heading: 30, pitch: 0, roll: 0 },
    };
    if (direct) {
      d._loadedSceneId = 's';
      assert.equal(d._seekLoadedShot(scene, position), true);
    } else await d.loadShot('s', 'a', { sceneSeek: position });
    assert.ok(
      Math.abs(
        entries(calls, 'view')[0][1].orientation.heading - 0.5235987755982988,
      ) < 1e-12,
    );
  });
test('[director-194] The next scene stops layers from a shot still in flight', async () => {
  const { d, scene, a, calls } = setup();
  const gate = deferred();
  d._project.scenes.push({
    id: 'next',
    title: 'Next',
    shots: [shot('c')],
    releaseLayerIds: [],
  });
  d._flyShotCamera = async (s) => {
    if (s.id === 's') await gate.promise;
  };
  const first = d.loadShot('s', 'a');
  for (let i = 0; i < 12; i++) await Promise.resolve();
  assert.equal(d._loadedSceneId, 's');
  await d.loadShot('next', 'c');
  gate.resolve();
  assert.equal(await first, undefined);
  assert.equal(entries(calls, 'leave')[0][1].id, 's');
  assert.equal(d._loadedSceneId, 'next');
});
test('[director-224] The scene time does not become negative', () => {
  const { d } = setup();
  const now = Date.now;
  Date.now = () => Date.parse('2026-10-06T12:00:00Z');
  try {
    d._activeRun = {
      startedAt: '2026-10-06T12:00:02Z',
      estimatedDurationSec: 1,
    };
    assert.equal(d.getPlaybackStatus().elapsedMs, 0);
  } finally {
    Date.now = now;
  }
});
for (const duration of [0, 1])
  test(`[director-228] The supplied flight duration gives ${duration} seconds`, async () => {
    const { d, calls } = setup();
    await d.loadShot('s', 'a', { flyDuration: duration });
    assert.equal(entries(calls, 'flight')[0][3], duration === 0 ? 0 : 1);
  });
test('[director-229] The shot camera cancels arrival work before its policy', async (t) => {
  const { d, calls } = setup();
  let release;
  release = ownCameraArrival(d.viewer, () => {
    calls.push(['arrival']);
    release();
  });
  t.after(() => release());
  await d.loadShot('s', 'a');
  assert.deepEqual(calls.slice(0, 2), [['arrival'], ['claim', 'scene', true]]);
});
for (const kind of ['manager', 'layers', 'module'])
  test(`[director-205] The travel cancellation accepts an absent ${kind}`, () => {
    const { d, scene, a } = setup();
    let result = 'unset';
    d._beginShotTravel(scene, a, 4);
    d._scenePacks.cancelMotion = (get) => {
      result = get('one');
    };
    if (kind === 'manager') d.dataManager = null;
    if (kind === 'layers') d.dataManager.layers = undefined;
    assert.equal(d._cancelActiveSceneTravel(), true);
    assert.equal(result, undefined);
  });
for (const kind of ['manager', 'layers'])
  test(`[director-200] The media owner accepts an absent ${kind}`, () => {
    const { d, scene, a } = setup();
    a.layers = { one: { enabled: true } };
    if (kind === 'manager') d.dataManager = null;
    else d.dataManager.layers = undefined;
    d._setSceneMediaPlayback(scene, a, { cancelled: false });
    assert.equal(d._sceneMediaModules.size, 0);
  });
for (const kind of ['viewer', 'camera'])
  test(`[director-230] The camera placement rejects an absent ${kind}`, () => {
    const { d, a, calls } = setup();
    if (kind === 'viewer') d.viewer = null;
    else d.viewer.camera = null;
    assert.equal(d._setCameraView(a.camera), false);
    assert.deepEqual(calls, []);
  });
