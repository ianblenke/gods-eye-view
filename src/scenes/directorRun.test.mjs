import assert from 'node:assert/strict';
import test from 'node:test';
import { SceneDirector } from './director.js';

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
function setup(t) {
  const calls = [];
  const scene = {
    id: 's',
    title: 'Scene',
    shots: [shot(), shot('b')],
    releaseLayerIds: [],
  };
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
    _pendingWork: new Set(),
    _runIdleResolvers: new Set(),
    _presentation: {},
    _interactionTransitions: 0,
    _layerStatesForShot: (scene, s) => s.layers,
    _effectiveShotHoldSec: (scene, s) => s.holdSec,
    _visualStateForShot: (s) => s.visual,
    _sceneTimingForShot: (scene, s) => ({
      startProgress: s.id === 'b' ? 0.5 : 0,
    }),
    _publish: (change) => calls.push(['publish', change]),
    _saveProject: () => calls.push(['save']),
    _renderSceneSelect: () => calls.push(['scenes']),
    _renderShotList: () => calls.push(['shots']),
    _setSceneMediaPlayback: (...args) => calls.push(['media', ...args]),
    _cancelActiveSceneTravel: () => calls.push(['travel-stop']),
    _beginShotTravel: () => null,
    _publishShotTravel() {},
    _settleShotLayerStates() {},
    _clock: {
      stopShot: () => calls.push(['clock-shot-stop']),
      stop: () => calls.push(['clock-stop']),
      finish: () => calls.push(['clock-finish']),
      stopSceneTimer() {},
      snapshot: null,
      startScene: (...args) => {
        calls.push(['clock-scene', ...args]);
        return { endElapsedSec: 7 };
      },
      wait: (...args) => {
        calls.push(['wait', ...args]);
        return 17;
      },
      startRunProgress: (...args) => {
        calls.push(['clock-progress', ...args]);
        return 18;
      },
      startShotProgress: (...args) => {
        calls.push(['clock-phase', ...args]);
        return 19;
      },
      publish: (...args) => calls.push(['clock-publish', ...args]),
    },
    _interactions: {
      clear: () => calls.push(['actions-clear']),
      activate: (...args) => calls.push(['activate', ...args]),
      getState: () => ({ active: true, count: 2 }),
    },
    _dataPacks: {
      clear: () => calls.push(['packs-clear']),
      apply: async (...args) => {
        calls.push(['packs', ...args]);
        return true;
      },
      getTargets: () => ['target'],
      getState: () => ({ status: 'ready', count: 2 }),
    },
    _sharing: {
      close: () => calls.push(['share-close']),
      getState: () => ({ open: true }),
    },
    _bundleAssets: {
      replace: (assets) => calls.push(['assets', [...assets]]),
      getState: () => ({ count: 1, bytes: 12 }),
    },
    viewer: {
      camera: {
        cancelFlight: () => calls.push(['cancel']),
        setView: (v) => calls.push(['view', v]),
        flyTo: (v) => {
          calls.push(['flight', v]);
          v.complete();
        },
      },
    },
    styleManager: {
      clearSearchedLocation: () => calls.push(['search']),
      runImmediateNavigation: (name, fn) => {
        calls.push(['claim', name]);
        return fn();
      },
      applyVisualState: async (state, options) => {
        calls.push(['visual', state, options]);
        return true;
      },
      setRecordingMode: (...args) => calls.push(['record', ...args]),
      getContextModeState: () => ({ mode: 'off' }),
      setContextMode: async (mode) => {
        calls.push(['context', mode]);
        return { ok: true };
      },
    },
    dataManager: {
      layers: new Map(),
      getAll: () => [{ id: 'one' }, { id: 'two' }],
      setEnabled: async (...args) => {
        calls.push(['enabled', ...args]);
        return true;
      },
      setLayerParams: (...args) => calls.push(['params', ...args]),
    },
    _cameraMotion: {
      play: async (...args) => {
        calls.push(['motion', ...args]);
        return true;
      },
    },
  });
  const warn = console.warn;
  console.warn = (...args) => calls.push(['warn', ...args]);
  t.after(() => {
    console.warn = warn;
  });
  return { d, scene, a: scene.shots[0], b: scene.shots[1], calls };
}
function label(value) {
  return (
    {
      pending: 'a busy state',
      entering: 'a mode entry',
      nonisolating: 'another mode',
      'no-style': 'an absent style manager',
      'no-method': 'an absent method',
      'no-initial': 'an absent initial state',
      'no-manager': 'an absent manager',
      'no-layers': 'an absent layer map',
      'no-module': 'an absent module',
      'no-signal': 'an absent signal',
      'no-token': 'an absent token',
      'no-metadata': 'absent metadata',
      'no-abort': 'an absent abort owner',
      'no-shots': 'absent shots',
      'max-zero': 'a zero bound',
      'max-negative': 'a negative bound',
      'max-large': 'a large bound',
    }[value] || value
  );
}
function entries(calls, name) {
  return calls.filter((c) => c[0] === name);
}
function deferred() {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
function quick(d, calls) {
  d._flyShotCamera = async (scene, s) => {
    assert.equal(d.running, true);
    calls.push(['visit', scene.id, s.id]);
  };
  d._holdShot = async () => {};
}
function browser(t, calls) {
  const original = {
    document: globalThis.document,
    create: URL.createObjectURL,
    revoke: URL.revokeObjectURL,
  };
  globalThis.document = {
    body: { appendChild: (v) => calls.push(['append', v]) },
    createElement: (name) => {
      const link = {
        click: () => calls.push(['click']),
        remove: () => calls.push(['remove']),
      };
      calls.push(['element', name, link]);
      return link;
    },
  };
  URL.createObjectURL = (blob) => {
    calls.push(['blob', blob]);
    return 'blob:test';
  };
  URL.revokeObjectURL = (url) => calls.push(['revoke', url]);
  t.after(() => {
    globalThis.document = original.document;
    URL.createObjectURL = original.create;
    URL.revokeObjectURL = original.revoke;
  });
}

test('[director-231] The destroyed director rejects a scene', async (t) => {
  const { d, calls } = setup(t);
  d._destroyed = true;
  assert.deepEqual(await d.startScene('s'), {
    started: false,
    reason: 'destroyed',
  });
  assert.equal(d._sceneSeekGeneration, 0);
  assert.equal(calls.length, 0);
});
test('[director-231] The active director rejects another scene', async (t) => {
  const { d, calls } = setup(t);
  d._running = true;
  assert.equal(d.running, true);
  assert.deepEqual(await d.startScene('s'), {
    started: false,
    reason: 'already-running',
  });
  assert.equal(entries(calls, 'claim').length, 0);
});
for (const mode of ['empty', 'unknown', 'last'])
  test(`[director-232] The queue rejects ${mode}`, async (t) => {
    const { d, scene, calls } = setup(t);
    if (mode === 'empty') scene.shots = [];
    const result = await d.startScene(
      's',
      mode === 'empty' ? {} : { afterShotId: mode === 'last' ? 'b' : 'bad' },
    );
    assert.deepEqual(result, {
      started: false,
      reason: {
        empty: 'no-shots',
        unknown: 'shot-not-found',
        last: 'scene-complete',
      }[mode],
    });
    assert.equal(entries(calls, 'claim').length, 0);
    if (mode === 'empty')
      assert.equal(d._presentation.status, 'No shots to run');
  });
test('[director-233] The camera policy rejects a scene', async (t) => {
  const { d, calls } = setup(t);
  d.styleManager.runImmediateNavigation = () => false;
  assert.deepEqual(await d.startScene('s'), {
    started: false,
    reason: 'camera-unavailable',
  });
  assert.equal(d.running, false);
  assert.equal(entries(calls, 'record').length, 0);
});
for (const mode of ['named', 'selected', 'first'])
  test(`[director-234] The scene starts from ${mode}`, async (t) => {
    const { d, scene, calls } = setup(t);
    quick(d, calls);
    d._project.scenes.push({ ...scene, id: 'other', shots: [shot('c')] });
    d._selectedSceneId = mode === 'first' ? null : 'other';
    const build = d._buildPlaybackQueue.bind(d);
    d._buildPlaybackQueue = (id, options) => {
      calls.push(['queue-id', id]);
      return build(id, options);
    };
    await d.startScene(mode === 'named' ? 's' : undefined);
    assert.deepEqual(
      entries(calls, 'visit')[0].slice(1),
      mode === 'selected' ? ['other', 'c'] : ['s', 'a'],
    );
    assert.equal(
      entries(calls, 'queue-id')[0][1],
      mode === 'selected' ? 'other' : 's',
    );
  });
test('[director-235] The scene visits shots in project order', async (t) => {
  const { d, scene, calls } = setup(t);
  quick(d, calls);
  d._project.scenes.push({ ...scene, id: 'other', shots: [shot('c')] });
  await d.startScene('s');
  assert.deepEqual(
    entries(calls, 'visit').map((c) => c.slice(1)),
    [
      ['s', 'a'],
      ['s', 'b'],
      ['other', 'c'],
    ],
  );
  assert.equal(
    d._lastRun.events.filter((e) => e.type === 'shot_end').length,
    3,
  );
  assert.equal(d._presentation.progress, 1);
  assert.equal(d.running, false);
});
for (const mode of ['single', 'after', 'preview', 'panel'])
  test(`[director-236] The scene option uses ${label(mode)}`, async (t) => {
    const { d, scene, calls } = setup(t);
    quick(d, calls);
    scene.releaseLayerIds = ['one'];
    d._project.scenes.push({ ...scene, id: 'other', shots: [shot('c')] });
    const options = { single: true, preview: mode !== 'panel' };
    if (mode === 'after') options.afterShotId = 'a';
    await d.startScene('s', options);
    assert.deepEqual(
      entries(calls, 'visit').map((c) => c[2]),
      mode === 'after' ? ['b'] : ['a', 'b'],
    );
    assert.equal(entries(calls, 'record').length, mode === 'panel' ? 0 : 2);
    if (mode === 'panel')
      assert.equal(d._presentation.playbackActive, undefined);
    assert.equal(entries(calls, 'enabled').length, mode === 'panel' ? 0 : 1);
    if (mode !== 'panel') {
      assert.deepEqual(entries(calls, 'record')[0].slice(1), [
        true,
        { hidePanels: true, hudMode: 'full', safeFrame: '16:9' },
      ]);
      assert.deepEqual(entries(calls, 'record')[1].slice(1), [false]);
      assert.equal(d._presentation.playbackActive, false);
    }
  });
test('[director-237] The scene cancels a load owner that waits', async (t) => {
  const { d, calls } = setup(t);
  quick(d, calls);
  const load = new AbortController();
  d._loadAbort = load;
  await d.startScene('s');
  assert.equal(load.signal.aborted, true);
  assert.equal(d._loadAbort, null);
  assert.equal(d._loadGeneration, 1);
  assert.equal(d._sceneSeekGeneration, 1);
  assert.equal(entries(calls, 'actions-clear').length > 0, true);
  assert.equal(entries(calls, 'packs-clear').length > 0, true);
});
for (const mode of ['duration', 'zero', 'move'])
  test(`[director-238] The metadata records ${mode}`, async (t) => {
    const { d, scene, a, calls } = setup(t);
    quick(d, calls);
    if (mode === 'zero') {
      scene.shots = [a];
      a.durationSec = 0;
      a.holdSec = 0;
    }
    if (mode === 'move') a.move = {};
    await d.startScene('s');
    assert.match(d._lastRun.startedAt, /^\d{4}-\d{2}-\d{2}T/);
    assert.equal(d._lastRun.recipeId, 'project-6');
    assert.equal(d._lastRun.title, 'Editable Scene Run');
    assert.equal(d._lastRun.scenesRun, mode === 'zero' ? 1 : 2);
    assert.equal(d._lastRun.estimatedDurationSec, mode === 'zero' ? 0 : 14);
    assert.equal(
      entries(calls, 'clock-progress')[0][1],
      mode === 'zero' ? 1 : 14,
    );
    assert.equal(d._usesAuthoredCamera, mode === 'move');
    assert.equal(d._lastRun.events[0].type, 'scene_run_start');
    assert.deepEqual(d._lastRun.events[0].payload, {
      count: mode === 'zero' ? 1 : 2,
    });
  });
for (const message of ['bad phase', ''])
  test(`[director-239] The scene error uses ${message ? 'its message' : 'default text'}`, async (t) => {
    const { d, calls } = setup(t);
    quick(d, calls);
    d.styleManager.applyVisualState = async () => {
      throw new Error(message);
    };
    await d.startScene('s');
    assert.equal(
      d._presentation.status,
      message ? 'Error: bad phase' : 'Error: run failed',
    );
    assert.deepEqual(
      d._lastRun.events.find((e) => e.type === 'scene_run_error').payload,
      { message: message || 'unknown error' },
    );
    assert.equal(d.running, false);
    assert.equal(d._runAbort, null);
    assert.equal(d._runToken, null);
  });
for (const mode of ['next', 'wrap', 'unknown', 'absent', 'first'])
  test(`[director-240] The next shot handles ${label(mode)}`, async (t) => {
    const { d, calls } = setup(t);
    d._selectedShotId = {
      next: 'a',
      wrap: 'b',
      unknown: 'bad',
      absent: null,
      first: null,
    }[mode];
    if (mode === 'first') d._selectedSceneId = null;
    const build = d._buildPlaybackQueue;
    d._buildPlaybackQueue = (...args) => {
      calls.push(['queue-argument', ...args]);
      return build.apply(d, args);
    };
    d.loadShot = async (...args) => calls.push(['load', ...args]);
    await d.runNextScene();
    assert.equal(entries(calls, 'queue-argument')[0][1], 's');
    assert.deepEqual(entries(calls, 'load'), [
      ['load', 's', mode === 'next' ? 'b' : 'a'],
    ]);
  });
for (const mode of ['destroyed', 'active', 'empty'])
  test(`[director-241] The next shot stops for ${mode}`, async (t) => {
    const { d, scene, calls } = setup(t);
    if (mode === 'destroyed') d._destroyed = true;
    if (mode === 'active') d._running = true;
    if (mode === 'empty') scene.shots = [];
    d.loadShot = async () => calls.push(['load']);
    await d.runNextScene();
    assert.equal(entries(calls, 'load').length, 0);
  });
for (const mode of ['active', 'idle', 'token', 'default'])
  test(`[director-242] The scene stop handles ${label(mode)}`, (t) => {
    const { d, calls } = setup(t);
    d._activeRun = { events: [] };
    d._running = mode !== 'idle';
    d._runToken = mode === 'token' ? null : { cancelled: false };
    const load = new AbortController(),
      owner = new AbortController();
    d._loadAbort = load;
    d._runAbort = owner;
    d.stopScene(mode === 'default' ? undefined : 'Operator stop');
    assert.equal(load.signal.aborted, true);
    assert.equal(d._loadAbort, null);
    assert.equal(d._loadGeneration, 1);
    assert.equal(d._sceneSeekGeneration, 1);
    assert.equal(entries(calls, 'cancel').length, 1);
    assert.equal(entries(calls, 'clock-stop').length, 1);
    assert.equal(entries(calls, 'clock-shot-stop').length, 1);
    assert.equal(entries(calls, 'media').length, 1);
    assert.equal(entries(calls, 'actions-clear').length, 1);
    assert.equal(entries(calls, 'packs-clear').length, 1);
    assert.equal(owner.signal.aborted, mode === 'active' || mode === 'default');
    if (mode === 'active' || mode === 'default') {
      assert.equal(d._runToken.cancelled, true);
      assert.equal(
        d._presentation.status,
        mode === 'default' ? 'Stopped' : 'Operator stop',
      );
      assert.deepEqual(d._activeRun.events[0].payload, {
        reason: mode === 'default' ? 'Stopped' : 'Operator stop',
      });
    } else assert.equal(d._activeRun.events.length, 0);
  });
for (const mode of ['true', 'false', 'null', 'absent', 'error', 'canceled'])
  test(`[director-243] The pack method handles ${label(mode)}`, async (t) => {
    const { d, scene, a, calls } = setup(t);
    const token = { cancelled: mode === 'canceled' };
    if (mode === 'absent') d._dataPacks = null;
    else
      d._dataPacks.apply = async (...args) => {
        calls.push(['packs', ...args]);
        if (mode === 'error' || mode === 'canceled')
          throw new Error('Pack fault');
        return { true: true, false: false, null: null }[mode];
      };
    assert.equal(
      await d._applyDataPacks(scene, a, token),
      !['false', 'error', 'canceled'].includes(mode),
    );
    if (mode !== 'absent') {
      assert.equal(entries(calls, 'packs')[0][1].id, 's');
      assert.equal(entries(calls, 'packs')[0][2].id, 'a');
      assert.equal(
        entries(calls, 'packs')[0][3].cancelled,
        mode === 'canceled',
      );
    }
    assert.equal(
      d._presentation.status,
      mode === 'error' ? 'Pack fault' : undefined,
    );
  });
for (const mode of ['owners', 'absent', 'null'])
  test(`[director-244] The state queries handle ${mode}`, (t) => {
    const { d } = setup(t);
    if (mode === 'absent')
      d._dataPacks = d._interactions = d._sharing = d._bundleAssets = null;
    if (mode === 'null')
      for (const key of [
        '_dataPacks',
        '_interactions',
        '_sharing',
        '_bundleAssets',
      ])
        d[key].getState = () => null;
    assert.deepEqual(
      d.getDataPackState(),
      mode === 'owners'
        ? { status: 'ready', count: 2 }
        : { status: 'idle', count: 0 },
    );
    assert.deepEqual(
      d.getInteractionState(),
      mode === 'owners'
        ? { active: true, count: 2 }
        : { active: false, busy: false, selected: null, count: 0 },
    );
    assert.deepEqual(
      d.getSharingState(),
      mode === 'owners'
        ? { open: true, assets: { count: 1, bytes: 12 } }
        : { assets: { count: 0, bytes: 0 } },
    );
  });
for (const mode of ['targets', 'error', 'absent'])
  test(`[director-245] The action activation handles ${label(mode)}`, (t) => {
    const { d, scene, a, calls } = setup(t);
    if (mode === 'error')
      d._interactions.activate = () => {
        throw new Error('Action fault');
      };
    if (mode === 'absent') d._interactions = null;
    d._activateInteractions(scene, a);
    if (mode === 'targets')
      assert.deepEqual(entries(calls, 'activate')[0].slice(1), [a, ['target']]);
    else
      assert.equal(
        d._presentation.status,
        mode === 'error' ? 'Action fault' : undefined,
      );
  });
for (const mode of ['signal', 'active', 'destroyed', 'scene', 'shot', 'type'])
  test(`[director-246] The action guard checks ${mode}`, async (t) => {
    const { d, calls } = setup(t);
    const signal = { aborted: mode === 'signal' };
    if (mode === 'active') d._running = true;
    if (mode === 'destroyed') d._destroyed = true;
    if (mode === 'scene') d._selectedSceneId = 'bad';
    if (mode === 'shot') d._selectedShotId = 'bad';
    assert.equal(
      await d._executeInteraction(
        { type: mode === 'type' ? 'unknown' : 'focus' },
        signal,
      ),
      false,
    );
    assert.equal(entries(calls, 'view').length, 0);
    assert.equal(entries(calls, 'clock-shot-stop').length, 0);
    assert.equal(entries(calls, 'travel-stop').length, 0);
  });
for (const mode of ['accepted', 'refused'])
  test(`[director-247] The focus action handles ${label(mode)}`, async (t) => {
    const { d, scene, calls } = setup(t);
    scene.anchors = [
      { id: 'view', lat: 1, lon: 2, alt: 3000, altitudeReference: 'ellipsoid' },
    ];
    if (mode === 'refused') d.styleManager.runImmediateNavigation = () => false;
    assert.equal(
      await d._executeInteraction(
        { type: 'focus', anchorId: 'view' },
        { aborted: false },
      ),
      mode === 'accepted',
    );
    if (mode === 'accepted') {
      const v = entries(calls, 'view')[0][1];
      assert.equal(v.orientation.pitch, -Math.PI / 2);
      assert.equal(entries(calls, 'travel-stop').length, 1);
      assert.equal(entries(calls, 'clock-shot-stop').length, 1);
    } else assert.equal(entries(calls, 'travel-stop').length, 0);
  });
for (const mode of ['enabled', 'disabled', 'unknown'])
  test(`[director-248] The layer action handles ${label(mode)}`, async (t) => {
    const { d, calls } = setup(t);
    const signal = new AbortController().signal;
    assert.equal(
      await d._executeInteraction(
        {
          type: 'layer',
          layerId: mode === 'unknown' ? 'bad' : 'one',
          enabled: mode === 'enabled',
        },
        signal,
      ),
      mode !== 'unknown',
    );
    if (mode !== 'unknown')
      assert.deepEqual(entries(calls, 'enabled')[0].slice(1), [
        'one',
        mode === 'enabled',
        { signal, origin: 'scene' },
      ]);
    else assert.equal(entries(calls, 'enabled').length, 0);
  });
for (const total of [0, 63, 64])
  test(`[director-249] The shot action checks total ${total}`, async (t) => {
    const { d, calls } = setup(t);
    d._interactionTransitions = total;
    d.seekScene = async (...args) => {
      calls.push(['seek', ...args]);
      return true;
    };
    assert.equal(
      await d._executeInteraction(
        { type: 'shot', shotId: 'b' },
        { aborted: false },
      ),
      total < 64,
    );
    assert.equal(d._interactionTransitions, total < 64 ? total + 1 : 64);
    if (total < 64)
      assert.deepEqual(entries(calls, 'seek'), [['seek', 's', 0.5]]);
    else {
      assert.equal(entries(calls, 'seek').length, 0);
      assert.equal(
        d._presentation.status,
        'Scene transition limit reached — load a shot to reset',
      );
    }
  });

test('[director-250] The project export downloads and publishes its document', async (t) => {
  const { d, calls } = setup(t);
  browser(t, calls);
  d.exportProject();
  const link = entries(calls, 'element')[0];
  assert.equal(link[1], 'a');
  assert.equal(link[2].href, 'blob:test');
  assert.match(
    link[2].download,
    /^scene-presets-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/,
  );
  assert.equal(entries(calls, 'blob')[0][1].type, 'application/json');
  const p = JSON.parse(await entries(calls, 'blob')[0][1].text());
  assert.equal(p.version, 6);
  assert.equal(p.scenes[0].id, 's');
  assert.deepEqual(
    calls
      .filter((c) => ['append', 'click', 'remove', 'revoke'].includes(c[0]))
      .map((c) => c[0]),
    ['append', 'click', 'remove', 'revoke'],
  );
  assert.deepEqual(entries(calls, 'revoke'), [['revoke', 'blob:test']]);
  assert.equal(d._presentation.status, 'Project exported');
  assert.equal(entries(calls, 'publish')[0][1].type, 'project-exported');
  assert.equal(entries(calls, 'publish')[0][1].project.scenes[0].id, 's');
});
test('[director-251] The export error stops before a download', (t) => {
  const { d, calls } = setup(t);
  browser(t, calls);
  d._project.version = 999;
  d.exportProject();
  assert.equal(
    d._presentation.status,
    'Export failed: $.version: unsupported scene project version',
  );
  assert.equal(entries(calls, 'blob').length, 0);
  assert.equal(entries(calls, 'publish')[0][1].type, 'status-changed');
});
function imported() {
  return {
    version: 6,
    scenes: [{ id: 'new', title: 'New', shots: [shot('x')] }],
  };
}
test('[director-252] The file import waits for old work before replacement', async (t) => {
  const { d, calls } = setup(t);
  const wait = deferred();
  d._pendingWork.add(wait.promise);
  const task = d.importProjectFile({
    name: 'scene.json',
    text: async () => JSON.stringify(imported()),
  });
  for (let i = 0; i < 10; i++) await Promise.resolve();
  assert.equal(d._project.scenes[0].id, 's');
  assert.equal(entries(calls, 'clock-stop').length, 1);
  wait.resolve();
  assert.equal(await task, true);
  assert.equal(d._project.scenes[0].id, 'new');
  assert.equal(d._selectedSceneId, 'new');
  assert.equal(d._selectedShotId, 'x');
  assert.equal(d._loadedSceneId, null);
  assert.equal(d._storageReadError, null);
  assert.equal(entries(calls, 'save').length, 1);
  assert.equal(entries(calls, 'share-close').length, 1);
  assert.equal(d._presentation.status, 'Imported scene.json');
  assert.equal(
    entries(calls, 'publish').some((c) => c[1].type === 'project-imported'),
    true,
  );
});
for (const mode of [
  'signal',
  'destroyed',
  'generation',
  'expected',
  'late-signal',
  'late-destroyed',
  'late-generation',
  'late-expected',
])
  test(`[director-253] The import guard checks ${mode}`, async (t) => {
    const { d, calls } = setup(t);
    const wait = deferred(),
      owner = new AbortController();
    const options = { signal: owner.signal, prepared: { project: imported() } };
    if (mode === 'signal') owner.abort();
    if (mode === 'destroyed') d._destroyed = true;
    if (mode === 'expected') options.expectedProject = 'bad';
    if (mode.startsWith('late-')) d._pendingWork.add(wait.promise);
    if (mode === 'late-expected')
      options.expectedProject = JSON.stringify(d._project, null, 2);
    const task = d.importProjectFile({ name: 'new.json' }, options);
    if (mode === 'generation') {
      // The file promise gives a separate generation check before old work stops.
      wait.resolve();
    }
    if (mode.startsWith('late-')) {
      if (mode === 'late-signal') owner.abort();
      if (mode === 'late-destroyed') d._destroyed = true;
      if (mode === 'late-generation') d._importGeneration++;
      if (mode === 'late-expected') d._project.scenes[0].title = 'Changed';
      wait.resolve();
    }
    if (mode === 'generation') d._importGeneration++;
    await task;
    if (['signal', 'destroyed', 'expected'].includes(mode))
      assert.equal(entries(calls, 'clock-stop').length, 0);
    assert.equal(d._project.scenes[0].id, 's');
    assert.equal(entries(calls, 'save').length, 0);
    assert.equal(
      entries(calls, 'publish').some((c) => c[1].type === 'project-imported'),
      false,
    );
  });
for (const mode of [
  'selection',
  'default',
  'empty',
  'assets',
  'absent-assets',
  'absent-packs',
  'no-shots',
])
  test(`[director-254] The import uses ${label(mode)}`, async (t) => {
    const { d, calls } = setup(t);
    const project = imported();
    const options = { prepared: { project } };
    if (mode === 'selection')
      options.selection = { sceneId: 'chosen', shotId: 'chosen-shot' };
    if (mode === 'empty') project.scenes = [];
    if (mode === 'no-shots') project.scenes[0].shots = [];
    if (mode === 'assets') {
      project.scenes[0].dataPacks = [
        {
          id: 'pack',
          version: 1,
          format: 'geojson',
          source: { adapter: 'scene-bundle', path: 'keep.json' },
          attribution: { text: 'Test', license: 'CC0' },
          placement: { altitudeReference: 'ellipsoid' },
        },
        {
          id: 'other',
          version: 1,
          format: 'geojson',
          source: { adapter: 'assets', path: 'external.json' },
          attribution: { text: 'Test', license: 'CC0' },
          placement: { altitudeReference: 'ellipsoid' },
        },
      ];
      options.prepared.assets = new Map([
        ['keep.json', 'keep'],
        ['drop.json', 'drop'],
        ['external.json', 'external'],
      ]);
    }
    assert.equal(
      await d.importProjectFile({ name: 'new.json' }, options),
      true,
    );
    assert.equal(
      d._selectedSceneId,
      mode === 'selection' ? 'chosen' : mode === 'empty' ? null : 'new',
    );
    assert.equal(
      d._selectedShotId,
      mode === 'selection'
        ? 'chosen-shot'
        : mode === 'empty' || mode === 'no-shots'
          ? null
          : 'x',
    );
    assert.deepEqual(
      entries(calls, 'assets')[0][1],
      mode === 'assets' ? [['keep.json', 'keep']] : [],
    );
    assert.equal(entries(calls, 'share-close').length, 0);
  });
for (const mode of ['document', 'read', 'signal', 'destroyed', 'generation'])
  test(`[director-255] The import error handles ${label(mode)}`, async (t) => {
    const { d, calls } = setup(t);
    const owner = new AbortController();
    const file = {
      name: 'bad.json',
      text: async () => {
        if (mode === 'signal') owner.abort();
        if (mode === 'destroyed') d._destroyed = true;
        if (mode === 'generation') d._importGeneration++;
        if (mode === 'document')
          return JSON.stringify({ version: 999, scenes: [] });
        throw new Error('Cannot read');
      },
    };
    await d.importProjectFile(file, { signal: owner.signal });
    assert.equal(d._project.scenes[0].id, 's');
    assert.equal(entries(calls, 'save').length, 0);
    if (mode === 'document')
      assert.equal(
        d._presentation.status,
        'Import failed: $.version: unsupported scene project version',
      );
    else
      assert.equal(
        d._presentation.status,
        mode === 'read'
          ? 'Import failed (could not read JSON file)'
          : undefined,
      );
  });
for (const present of [false, true])
  test(`[director-256] The metadata download checks ${present ? 'a record' : 'an absent record'}`, async (t) => {
    const { d, calls } = setup(t);
    browser(t, calls);
    if (present) d._lastRunJson = '{"events":[]}';
    d.downloadLastRunMetadata();
    assert.equal(entries(calls, 'blob').length, present ? 1 : 0);
    if (present) {
      assert.equal(await entries(calls, 'blob')[0][1].text(), '{"events":[]}');
      assert.equal(entries(calls, 'blob')[0][1].type, 'application/json');
      const link = entries(calls, 'element')[0][2];
      assert.equal(link.href, 'blob:test');
      assert.match(
        link.download,
        /^scene-run-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/,
      );
      assert.deepEqual(
        calls
          .filter((c) => ['append', 'click', 'remove', 'revoke'].includes(c[0]))
          .map((c) => c[0]),
        ['append', 'click', 'remove', 'revoke'],
      );
      assert.deepEqual(entries(calls, 'revoke'), [['revoke', 'blob:test']]);
    }
  });
for (const id of ['one', 'two'])
  for (const mode of ['simple', 'params', 'restore', 'no-signal'])
    test(`[director-257] The layer ${id} uses ${label(mode)}`, async (t) => {
      const { d, calls } = setup(t);
      const signal = new AbortController().signal;
      const state = { enabled: true };
      if (mode === 'params' || mode === 'restore') state.params = { value: 7 };
      if (mode === 'restore')
        d.dataManager.restoreLayerState = async (...args) => {
          calls.push(['restore', ...args]);
          return { succeeded: true };
        };
      const result = await d._applyLayerStates(
        { [id]: state, unknown: { enabled: true } },
        mode === 'no-signal' ? null : { signal },
      );
      assert.deepEqual(result, {
        applied: [id === 'one' ? 'one' : 'two'],
        refused: [],
        cancelled: false,
      });
      const options =
        mode === 'no-signal'
          ? { origin: 'scene' }
          : { signal, origin: 'scene' };
      if (mode === 'restore') {
        assert.deepEqual(entries(calls, 'restore')[0].slice(1), [
          id === 'one' ? 'one' : 'two',
          { enabled: true, params: { value: 7 } },
          options,
        ]);
        assert.equal(entries(calls, 'enabled').length, 0);
        assert.equal(entries(calls, 'params').length, 0);
      } else {
        assert.deepEqual(entries(calls, 'enabled')[0].slice(1), [
          id === 'one' ? 'one' : 'two',
          true,
          options,
        ]);
        assert.deepEqual(
          entries(calls, 'params').map((c) => c.slice(1)),
          mode === 'params'
            ? [
                [
                  id === 'one' ? 'one' : 'two',
                  { value: 7 },
                  { origin: 'scene' },
                ],
              ]
            : [],
        );
      }
    });
for (const mode of ['on', 'off', 'restore', 'null'])
  test(`[director-258] The layer refusal handles ${label(mode)}`, async (t) => {
    const { d, calls } = setup(t);
    d._activeRun = { events: [] };
    d.dataManager.setEnabled = async () => false;
    const state = { enabled: mode !== 'off' };
    if (mode === 'restore' || mode === 'null') {
      state.params = { value: 7 };
      d.dataManager.restoreLayerState = async () =>
        mode === 'null' ? null : { succeeded: false };
    }
    const result = await d._applyLayerStates({ one: state });
    assert.deepEqual(result, {
      applied: [],
      refused: ['one'],
      cancelled: false,
    });
    assert.equal(d._presentation.status, 'Layers refused: one');
    assert.deepEqual(d._activeRun.events[0].payload, { layerIds: ['one'] });
    assert.equal(d._activeRun.events[0].type, 'shot_layers_refused');
    assert.equal(
      entries(calls, 'warn')[0][1],
      `[Scenes] Layer refused: one → ${mode === 'off' ? 'off' : 'on'}`,
    );
    assert.equal(entries(calls, 'params').length, 0);
  });
for (const mode of ['before', 'context', 'layer'])
  test(`[director-259] The layer cancellation ${{ before: 'stops before context mode', context: 'stops after context mode', layer: 'stops after a layer' }[mode]}`, async (t) => {
    const { d, calls } = setup(t);
    const token = { cancelled: mode === 'before' };
    d._exitIsolatingContextMode = async () => {
      calls.push(['context']);
      if (mode === 'context') token.cancelled = true;
    };
    d.dataManager.setEnabled = async (...args) => {
      calls.push(['enabled', ...args]);
      token.cancelled = true;
      return false;
    };
    assert.deepEqual(
      await d._applyLayerStates(
        { one: { enabled: true }, two: { enabled: true } },
        token,
      ),
      { applied: [], refused: [], cancelled: true },
    );
    assert.equal(entries(calls, 'context').length, mode === 'before' ? 0 : 1);
    assert.equal(entries(calls, 'enabled').length, mode === 'layer' ? 1 : 0);
    assert.equal(entries(calls, 'warn').length, 0);
  });
for (const id of ['one', 'two'])
  for (const mode of ['success', 'refused', 'error', 'empty-error'])
    test(`[director-260] The scene layer ${id} handles ${label(mode)}`, async (t) => {
      const { d, scene, calls } = setup(t);
      scene.releaseLayerIds = [id];
      d._activeRun = { events: [] };
      const signal = new AbortController().signal;
      d.dataManager.setEnabled = async (...args) => {
        calls.push(['enabled', ...args]);
        if (mode === 'error') throw new Error('Layer fault');
        if (mode === 'empty-error') throw null;
        return mode !== 'refused';
      };
      assert.equal(
        await d._releaseSceneLayers(scene, { signal }),
        mode === 'success',
      );
      assert.deepEqual(entries(calls, 'enabled')[0].slice(1), [
        id === 'one' ? 'one' : 'two',
        false,
        { origin: 'scene', signal },
      ]);
      assert.equal(entries(calls, 'actions-clear').length, 1);
      assert.equal(entries(calls, 'packs-clear').length, 1);
      if (mode !== 'success') {
        const event = d._activeRun.events[0];
        assert.equal(
          event.type,
          mode === 'refused'
            ? 'scene_layer_release_refused'
            : 'scene_layer_release_error',
        );
        assert.equal(event.payload.layerId, id === 'one' ? 'one' : 'two');
        assert.equal(event.payload.sceneId, 's');
        if (mode !== 'refused')
          assert.equal(
            event.payload.message,
            mode === 'error' ? 'Layer fault' : 'unknown error',
          );
      }
    });
for (const mode of ['absent', 'not-list', 'empty', 'before', 'after'])
  test(`[director-260] The scene layer cleanup handles ${label(mode)}`, async (t) => {
    const { d, scene, calls } = setup(t);
    scene.releaseLayerIds =
      mode === 'not-list' ? 'one' : mode === 'empty' ? [] : ['one', 'two'];
    const token = { cancelled: mode === 'before' };
    if (mode === 'after')
      d.dataManager.setEnabled = async (...args) => {
        calls.push(['enabled', ...args]);
        token.cancelled = true;
        return true;
      };
    assert.equal(
      await d._releaseSceneLayers(mode === 'absent' ? null : scene, token),
      mode !== 'before' && mode !== 'after',
    );
    assert.equal(entries(calls, 'enabled').length, mode === 'after' ? 1 : 0);
  });
for (const mode of [
  'mode',
  'entering',
  'nonisolating',
  'absent-state',
  'absent-get',
  'absent-set',
  'refused',
  'refused-empty',
  'absent-result',
  'no-style',
])
  test(`[director-261] The context method handles ${label(mode)}`, async (t) => {
    const { d, calls } = setup(t);
    d._activeRun = { events: [] };
    d.styleManager.getContextModeState = () =>
      mode === 'absent-state'
        ? null
        : {
            mode:
              mode === 'nonisolating'
                ? 'off'
                : mode === 'entering'
                  ? 'off'
                  : 'space-missions',
            entering: mode === 'entering' ? 'space-missions' : null,
          };
    if (mode === 'absent-get') delete d.styleManager.getContextModeState;
    if (mode === 'absent-set') delete d.styleManager.setContextMode;
    if (mode === 'no-style') d.styleManager = null;
    const refused = mode.startsWith('refused');
    if (refused || mode === 'absent-result')
      d.styleManager.setContextMode = async () => {
        calls.push(['context', 'off']);
        return mode === 'absent-result'
          ? null
          : { ok: false, error: mode === 'refused' ? 'Context fault' : '' };
      };
    const succeeds = ['mode', 'entering', 'absent-result'].includes(mode);
    assert.equal(await d._exitIsolatingContextMode(), succeeds);
    assert.equal(entries(calls, 'context').length, succeeds || refused ? 1 : 0);
    if (succeeds)
      assert.deepEqual(d._activeRun.events[0].payload, {
        mode: 'space-missions',
      });
    if (refused) {
      assert.equal(
        d._presentation.status,
        'Could not exit space-missions — scene layers may be refused',
      );
      assert.deepEqual(d._activeRun.events[0].payload, {
        mode: 'space-missions',
        error: mode === 'refused' ? 'Context fault' : null,
      });
      assert.equal(
        entries(calls, 'warn')[0][2],
        mode === 'refused' ? 'Context fault' : 'unknown reason',
      );
    }
  });

for (const mode of [
  'complete',
  'interrupted',
  'canceled',
  'destroyed',
  'ordinary',
])
  test(`[director-262] The authored camera handles ${label(mode)}`, async (t) => {
    const { d, scene, a, calls } = setup(t);
    const token = { cancelled: mode === 'canceled' };
    if (mode !== 'ordinary')
      a.move = { from: { lat: 1, lon: 2, alt: 3000 }, easing: 'linear' };
    d._destroyed = mode === 'destroyed';
    d._cameraMotion.play = async (...args) => {
      calls.push(['motion', ...args]);
      return mode === 'complete';
    };
    d.stopScene = (reason) => calls.push(['stop-scene', reason]);
    await d._flyShotCamera(scene, a, 7, token);
    if (mode === 'ordinary') {
      assert.equal(entries(calls, 'flight')[0][1].duration, 7);
      assert.equal(entries(calls, 'motion').length, 0);
    } else {
      assert.deepEqual(entries(calls, 'motion')[0][1], {
        from: { lat: 1, lon: 2, alt: 3000, heading: 0, pitch: -35, roll: 0 },
        to: { lat: 10, lon: 20, alt: 500000, heading: 12, pitch: -40, roll: 6 },
        easing: 'linear',
        durationSec: 7,
      });
      assert.equal(
        entries(calls, 'motion')[0][2].cancelled,
        mode === 'canceled',
      );
      assert.deepEqual(
        entries(calls, 'stop-scene'),
        mode === 'interrupted'
          ? [['stop-scene', 'Camera move interrupted']]
          : [],
      );
    }
  });
for (const mode of [
  'pose',
  'defaults',
  'zero',
  'negative',
  'bad',
  'absent',
  'canceled',
  'no-style',
])
  test(`[director-263] The camera flight handles ${label(mode)}`, async (t) => {
    const { d, a, calls } = setup(t);
    const camera = { ...a.camera };
    if (mode === 'defaults')
      (delete camera.heading, delete camera.pitch, delete camera.roll);
    if (mode === 'zero') camera.pitch = 0;
    if (mode === 'no-style') d.styleManager = null;
    const duration = mode === 'negative' ? -2 : mode === 'bad' ? 'bad' : 7;
    await d._flyCamera(mode === 'absent' ? null : camera, duration, {
      cancelled: mode === 'canceled',
    });
    if (mode === 'absent' || mode === 'canceled') {
      assert.equal(entries(calls, 'flight').length, 0);
      assert.equal(entries(calls, 'search').length, 0);
      return;
    }
    const flight = entries(calls, 'flight')[0][1];
    assert.equal(
      flight.duration,
      mode === 'negative' ? 0.2 : mode === 'bad' ? 4 : 7,
    );
    assert.equal(
      flight.orientation.heading,
      mode === 'defaults' ? 0 : 12 * (Math.PI / 180),
    );
    assert.equal(
      flight.orientation.pitch,
      (mode === 'defaults' ? -35 : mode === 'zero' ? 0 : -40) * (Math.PI / 180),
    );
    assert.equal(
      flight.orientation.roll,
      mode === 'defaults' ? 0 : 6 * (Math.PI / 180),
    );
    assert.equal(Math.round(flight.destination.x), 6365738);
    assert.equal(Math.round(flight.destination.y), 2316939);
    assert.equal(Math.round(flight.destination.z), 1187073);
    assert.equal(typeof flight.easingFunction, 'function');
    assert.equal(flight.easingFunction(0.25), 0.0625);
    assert.equal(flight.easingFunction(0.75), 0.9375);
    assert.equal(entries(calls, 'search').length, mode === 'no-style' ? 0 : 1);
  });
for (const mode of ['complete', 'cancel', 'timeout', 'double'])
  test(`[director-264] The camera promise settles through ${mode}`, async (t) => {
    const { d, a, calls } = setup(t);
    const originalSet = globalThis.setTimeout,
      originalClear = globalThis.clearTimeout;
    let timer,
      clears = 0;
    globalThis.setTimeout = (fn, ms) => {
      timer = fn;
      calls.push(['timer', ms]);
      return 23;
    };
    globalThis.clearTimeout = () => {
      clears++;
    };
    t.after(() => {
      globalThis.setTimeout = originalSet;
      globalThis.clearTimeout = originalClear;
    });
    let options;
    d.viewer.camera.flyTo = (v) => {
      options = v;
    };
    const work = d._flyCamera(a.camera, 2, { cancelled: false });
    let settled = false;
    work.then(() => {
      settled = true;
    });
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(settled, false);
    assert.deepEqual(entries(calls, 'timer'), [['timer', 2600]]);
    if (mode === 'timeout') timer();
    else if (mode === 'cancel') options.cancel();
    else options.complete();
    if (mode === 'double') {
      options.cancel();
      timer();
    }
    await work;
    assert.equal(clears, 1);
    assert.equal(settled, true);
  });
for (const id of ['one', 'two'])
  for (const mode of [
    'complete',
    'pending',
    'timeout',
    'canceled',
    'aborted',
    'disabled',
    'no-method',
    'no-initial',
    'no-manager',
    'no-layers',
    'no-module',
    'max-zero',
    'max-negative',
    'max-large',
  ])
    test(`[director-265] The hold owner ${id} handles ${label(mode)}`, async (t) => {
      const { d, scene, a, calls } = setup(t);
      a.layers = {
        [id]: { enabled: mode !== 'disabled', params: { beatId: 'beat' } },
      };
      const token = {
        cancelled: mode === 'canceled',
        signal: { aborted: mode === 'aborted' },
      };
      let reads = 0;
      const maxWaitMs =
        mode === 'max-zero'
          ? 'bad'
          : mode === 'max-negative'
            ? -1
            : mode === 'max-large'
              ? 30000
              : 140;
      d.dataManager.layers.set(id, {
        module: {
          getSceneShotMediaHold: (beat) => {
            calls.push(['hold-read', beat]);
            reads++;
            if (mode === 'no-initial') return null;
            return {
              pending:
                ['timeout', 'max-zero', 'max-negative', 'max-large'].includes(
                  mode,
                ) ||
                (mode === 'pending' && reads < 4),
              maxWaitMs,
            };
          },
        },
      });
      if (mode === 'no-method') d.dataManager.layers.get(id).module = {};
      if (mode === 'no-module') d.dataManager.layers.set(id, {});
      if (mode === 'no-manager') d.dataManager = null;
      if (mode === 'no-layers') d.dataManager.layers = null;
      let now = 0;
      const originalNow = Date.now;
      Date.now = () => now;
      t.after(() => {
        Date.now = originalNow;
      });
      d._sleep = async (...args) => {
        calls.push(['sleep', ...args]);
        now += mode === 'max-large' ? 20000 : 70;
        if (entries(calls, 'sleep').length > 6)
          throw new Error('Test clock limit');
      };
      d.stopScene = (reason) => calls.push(['stop-scene', reason]);
      if (['timeout', 'max-zero', 'max-negative', 'max-large'].includes(mode)) {
        await assert.rejects(d._holdShot(scene, a, token), {
          message:
            'Scene media did not finish within its bounded playback window',
        });
        assert.deepEqual(entries(calls, 'stop-scene'), [
          ['stop-scene', 'Scene media timed out'],
        ]);
        assert.equal(
          now,
          mode === 'max-large' ? 20000 : mode === 'timeout' ? 140 : 0,
        );
      } else {
        await d._holdShot(scene, a, token);
        const fallback = [
          'disabled',
          'no-method',
          'no-initial',
          'no-manager',
          'no-layers',
          'no-module',
        ].includes(mode);
        assert.deepEqual(
          entries(calls, 'sleep').map((c) => c[1]),
          fallback ? [3000] : mode === 'pending' ? [70, 70] : [],
        );
        for (const call of entries(calls, 'sleep'))
          assert.equal(call[2], token);
      }
      if (mode === 'canceled' || mode === 'aborted') assert.equal(reads, 1);
      if (entries(calls, 'hold-read').length)
        assert.equal(entries(calls, 'hold-read')[0][1], 'beat');
    });
for (const method of [
  '_sleep',
  '_startProgressTicker',
  '_startShotProgress',
  '_startSceneClockTicker',
])
  test(`[director-266] The clock method ${method} passes its arguments`, async (t) => {
    const { d, scene, a, calls } = setup(t);
    const token = { cancelled: false };
    const args = {
      _sleep: [70, token],
      _startProgressTicker: [14],
      _startShotProgress: [token, 7, 0.2, 0.9, { phase: 'hold' }],
      _startSceneClockTicker: [scene, a, token],
    }[method];
    const result = await d[method](...args);
    const name = {
      _sleep: 'wait',
      _startProgressTicker: 'clock-progress',
      _startShotProgress: 'clock-phase',
      _startSceneClockTicker: 'clock-scene',
    }[method];
    const forwarded = entries(calls, name)[0].slice(1);
    if (method === '_sleep') {
      assert.equal(forwarded[0], 70);
      assert.equal(forwarded[1], token);
    } else if (method === '_startProgressTicker') {
      assert.deepEqual(forwarded, [14]);
    } else if (method === '_startShotProgress') {
      assert.equal(forwarded[0], token);
      assert.deepEqual(forwarded.slice(1), [7, 0.2, 0.9, { phase: 'hold' }]);
    } else {
      assert.equal(forwarded[0], scene);
      assert.equal(forwarded[1], a);
      assert.equal(forwarded[2], token);
    }
    if (method === '_startSceneClockTicker')
      assert.deepEqual(result, { endElapsedSec: 7 });
    else
      assert.equal(
        result,
        { _sleep: 17, _startProgressTicker: 18, _startShotProgress: 19 }[
          method
        ],
      );
  });
for (const mode of [
  'preview',
  'panel',
  'canceled',
  'no-token',
  'no-metadata',
  'no-abort',
])
  test(`[director-267] The scene finish handles ${label(mode)}`, (t) => {
    const { d, calls } = setup(t);
    d._running = true;
    d._previewRun = mode === 'preview';
    const owner = new AbortController();
    d._runAbort = mode === 'no-abort' ? null : owner;
    d._runToken =
      mode === 'no-token' ? null : { cancelled: mode === 'canceled' };
    if (mode !== 'no-metadata') d._activeRun = { events: [], title: 'Test' };
    d._finishRun();
    assert.equal(d.running, false);
    assert.equal(d._previewRun, false);
    assert.equal(d._runToken, null);
    assert.equal(d._runAbort, null);
    assert.equal(d._presentation.keyboardEnabled, false);
    assert.equal(d._presentation.runtime, '');
    assert.equal(owner.signal.aborted, mode !== 'no-abort');
    assert.equal(entries(calls, 'media').length, 1);
    assert.equal(entries(calls, 'clock-finish').length, 1);
    assert.equal(entries(calls, 'travel-stop').length, 1);
    assert.equal(entries(calls, 'record').length, mode === 'preview' ? 1 : 0);
    if (mode === 'preview') assert.equal(d._presentation.playbackActive, false);
    assert.equal(entries(calls, 'publish').at(-1)[1].running, false);
    if (mode !== 'no-metadata') {
      assert.equal(d._lastRun.wasCancelled, mode === 'canceled');
      assert.match(d._lastRun.endedAt, /^\d{4}-\d{2}-\d{2}T/);
      assert.equal(JSON.parse(d._lastRunJson).title, 'Test');
      assert.equal(d._activeRun, null);
    } else assert.equal(d._lastRunJson, undefined);
  });
for (const mode of ['valid', 'scene', 'shot', 'no-shots', 'absent'])
  test(`[director-268] The final clock handles ${label(mode)}`, (t) => {
    const { d, scene, calls } = setup(t);
    d._clock.snapshot =
      mode === 'absent'
        ? null
        : {
            sceneId: mode === 'scene' ? 'bad' : 's',
            shotId: mode === 'shot' ? 'bad' : 'a',
            sceneElapsedSec: 9,
            seeking: true,
          };
    if (mode === 'no-shots') delete scene.shots;
    let first = 0,
      second = 0;
    d._runIdleResolvers.add(() => {
      first++;
    });
    d._runIdleResolvers.add(() => {
      second++;
    });
    d._finishRun();
    assert.equal(first, 1);
    assert.equal(second, 1);
    assert.equal(d._runIdleResolvers.size, 0);
    assert.equal(
      entries(calls, 'clock-publish').length,
      mode === 'valid' ? 1 : 0,
    );
    if (mode === 'valid') {
      const clock = entries(calls, 'clock-publish')[0];
      assert.equal(clock[1].id, 's');
      assert.equal(clock[2].id, 'a');
      assert.equal(clock[3], 9);
      assert.deepEqual(clock[4], { running: false, seeking: true });
    }
  });
for (const [method, value, field, event] of [
  ['_setButtons', true, null, 'buttons-changed'],
  ['_setPlaybackActive', true, 'playbackActive', 'playback-presentation'],
  ['_setPlaybackKeyboardEnabled', true, 'keyboardEnabled', 'playback-keyboard'],
  ['_setProgress', 0.4, 'progress', 'progress-changed'],
  ['_updateStatus', 'Ready', 'status', 'status-changed'],
  ['_updateRuntime', 'Scene / A', 'runtime', 'runtime-changed'],
])
  test(`[director-269] ${method === '_setButtons' ? 'The button helper publishes the supplied value' : `The presentation method ${method} updates its state`}`, (t) => {
    const { d, calls } = setup(t);
    d[method](value);
    assert.equal(entries(calls, 'publish')[0][1].type, event);
    if (field) {
      assert.equal(Object.hasOwn(d._presentation, field), true);
      assert.equal(
        d._presentation[field],
        {
          playbackActive: true,
          keyboardEnabled: true,
          progress: 0.4,
          status: 'Ready',
          runtime: 'Scene / A',
        }[field],
      );
    } else
      assert.deepEqual(entries(calls, 'publish')[0][1], {
        type: 'buttons-changed',
        running: true,
      });
  });
for (const mode of ['payload', 'absent', 'idle'])
  test(`[director-270] The event log handles ${label(mode)}`, (t) => {
    const { d, calls } = setup(t);
    if (mode !== 'idle') d._activeRun = { events: [] };
    d._logEvent('test_event', mode === 'payload' ? { value: 7 } : undefined);
    if (mode === 'idle') assert.equal(entries(calls, 'publish').length, 0);
    else {
      const event = d._activeRun.events[0];
      assert.equal(event.type, 'test_event');
      assert.deepEqual(event.payload, mode === 'payload' ? { value: 7 } : null);
      assert.match(event.t, /^\d{4}-\d{2}-\d{2}T/);
      assert.deepEqual(entries(calls, 'publish')[0][1], {
        type: 'run-event',
        event: 'test_event',
        detail: mode === 'payload' ? { value: 7 } : null,
      });
    }
  });

for (const mode of ['scene', 'shot'])
  test(`[director-246] The action checks only an absent ${mode}`, async (t) => {
    const { d } = setup(t);
    d._getShot = () => ({
      scene: mode === 'scene' ? null : { id: 's' },
      shot: mode === 'shot' ? null : { id: 'a' },
    });
    assert.equal(
      await d._executeInteraction(
        { type: 'layer', layerId: 'one', enabled: true },
        { aborted: false },
      ),
      false,
    );
  });
test('[director-253] The import loses its generation before playback stops', async (t) => {
  const { d, calls } = setup(t);
  const wait = deferred();
  const task = d.importProjectFile({
    name: 'new.json',
    text: () => wait.promise,
  });
  d._importGeneration++;
  wait.resolve(JSON.stringify(imported()));
  assert.equal(await task, false);
  assert.equal(d._project.scenes[0].id, 's');
  assert.equal(entries(calls, 'clock-stop').length, 0);
});
test('[director-253] The unchanged expected project accepts the import', async (t) => {
  const { d, calls } = setup(t);
  assert.equal(
    await d.importProjectFile(
      { name: 'new.json' },
      {
        prepared: { project: imported() },
        expectedProject: JSON.stringify(d._project, null, 2),
      },
    ),
    true,
  );
  assert.equal(d._project.scenes[0].id, 'new');
  assert.equal(entries(calls, 'save').length, 1);
});
test('[director-252] The import accepts an absent work set', async (t) => {
  const { d } = setup(t);
  delete d._pendingWork;
  assert.equal(
    await d.importProjectFile(
      { name: 'new.json' },
      { prepared: { project: imported() } },
    ),
    true,
  );
  assert.equal(d._project.scenes[0].id, 'new');
});
test('[director-254] The import accepts an absent asset owner', async (t) => {
  const { d } = setup(t);
  delete d._bundleAssets;
  assert.equal(
    await d.importProjectFile(
      { name: 'new.json' },
      { prepared: { project: imported() } },
    ),
    true,
  );
  assert.equal(d._selectedSceneId, 'new');
});
for (const mode of ['disabled', 'no-signal'])
  test(`[director-257] The restore path handles ${label(mode)}`, async (t) => {
    const { d, calls } = setup(t);
    d.dataManager.restoreLayerState = async (...args) => {
      calls.push(['restore', ...args]);
      return { succeeded: true };
    };
    const state = { enabled: mode !== 'disabled' };
    if (mode === 'no-signal') state.params = { value: 7 };
    assert.deepEqual(await d._applyLayerStates({ one: state }), {
      applied: ['one'],
      refused: [],
      cancelled: false,
    });
    if (mode === 'disabled') {
      assert.equal(entries(calls, 'restore').length, 0);
      assert.deepEqual(entries(calls, 'enabled')[0].slice(1), [
        'one',
        false,
        { origin: 'scene' },
      ]);
    } else
      assert.deepEqual(entries(calls, 'restore')[0].slice(1), [
        'one',
        { enabled: true, params: { value: 7 } },
        { origin: 'scene' },
      ]);
    assert.equal(entries(calls, 'params').length, 0);
  });
for (const mode of ['empty', 'last-canceled'])
  test(`[director-260] The last scene layer checks ${mode}`, async (t) => {
    const { d, scene, calls } = setup(t);
    const token = { cancelled: false };
    scene.releaseLayerIds = mode === 'empty' ? [] : ['one'];
    if (mode === 'last-canceled')
      d.dataManager.setEnabled = async () => {
        token.cancelled = true;
        return true;
      };
    assert.equal(await d._releaseSceneLayers(scene, token), mode === 'empty');
    assert.equal(entries(calls, 'warn').length, 0);
  });
for (const mode of ['heading', 'roll'])
  test(`[director-263] The camera flight keeps zero ${mode}`, async (t) => {
    const { d, a, calls } = setup(t);
    a.camera[mode] = 0;
    await d._flyCamera(a.camera, 2, { cancelled: false });
    assert.equal(entries(calls, 'flight')[0][1].orientation[mode], 0);
  });
test('[director-265] The hold owner accepts an absent beat and signal', async (t) => {
  const { d, scene, a, calls } = setup(t);
  a.layers = { one: { enabled: true } };
  d.dataManager.layers.set('one', {
    module: {
      getSceneShotMediaHold: (beat) => {
        calls.push(['beat', beat]);
        return { pending: false, maxWaitMs: 70 };
      },
    },
  });
  await d._holdShot(scene, a, { cancelled: false });
  assert.deepEqual(entries(calls, 'beat'), [
    ['beat', undefined],
    ['beat', undefined],
  ]);
});

test('[director-232] The after-shot guard checks the scene ID', async (t) => {
  const { d, scene, calls } = setup(t);
  quick(d, calls);
  d._project.scenes.push({ ...scene, id: 'other', shots: [shot('foreign')] });
  assert.deepEqual(await d.startScene('s', { afterShotId: 'foreign' }), {
    started: false,
    reason: 'shot-not-found',
  });
  assert.equal(entries(calls, 'visit').length, 0);
});
test('[director-240] The next shot starts from the selected scene', async (t) => {
  const { d, scene, calls } = setup(t);
  d._project.scenes.push({ ...scene, id: 'other', shots: [shot('c')] });
  d._selectedSceneId = 'other';
  d._selectedShotId = null;
  d.loadShot = async (...args) => calls.push(['load', ...args]);
  await d.runNextScene();
  assert.deepEqual(entries(calls, 'load'), [['load', 'other', 'c']]);
});
test('[director-252] The first import sets generation one', async (t) => {
  const { d } = setup(t);
  assert.equal(
    await d.importProjectFile(
      { name: 'new.json' },
      { prepared: { project: imported() } },
    ),
    true,
  );
  assert.equal(d._importGeneration, 1);
});

test('[director-243] The pack error accepts an absent token', async (t) => {
  const { d, scene, a } = setup(t);
  d._dataPacks.apply = async () => {
    throw new Error('Pack fault');
  };
  assert.equal(await d._applyDataPacks(scene, a, null), false);
  assert.equal(d._presentation.status, 'Pack fault');
});
test('[director-265] The hold ends when its owner returns an absent state', async (t) => {
  const { d, scene, a, calls } = setup(t);
  a.layers = { one: { enabled: true } };
  let reads = 0;
  d.dataManager.layers.set('one', {
    module: {
      getSceneShotMediaHold: () => (++reads === 1 ? { maxWaitMs: 70 } : null),
    },
  });
  await d._holdShot(scene, a, { cancelled: false });
  assert.equal(reads, 2);
  assert.equal(entries(calls, 'wait').length, 0);
});
test('[director-268] The final clock rejects a false scene with inherited shots', (t) => {
  const { d, a, calls } = setup(t);
  d._clock.snapshot = { sceneId: 'bad', shotId: 'a', sceneElapsedSec: 7 };
  const descriptor = Object.getOwnPropertyDescriptor(
    Boolean.prototype,
    'shots',
  );
  Object.defineProperty(Boolean.prototype, 'shots', {
    configurable: true,
    get: () => [a],
  });
  t.after(() => {
    if (descriptor)
      Object.defineProperty(Boolean.prototype, 'shots', descriptor);
    else delete Boolean.prototype.shots;
  });
  d._project.scenes.find = () => false;
  d._finishRun();
  assert.equal(entries(calls, 'clock-publish').length, 0);
});

test('[director-232] The empty project rejects a scene request', async (t) => {
  const { d } = setup(t);
  d._project.scenes = [];
  d._selectedSceneId = null;
  assert.deepEqual(await d.startScene(), {
    started: false,
    reason: 'no-shots',
  });
});
test('[director-241] The empty project cannot advance a shot', async (t) => {
  const { d, calls } = setup(t);
  d._project.scenes = [];
  d._selectedSceneId = null;
  d.loadShot = async () => calls.push(['load']);
  await d.runNextScene();
  assert.equal(entries(calls, 'load').length, 0);
});
test('[director-252] The second import sets generation two', async (t) => {
  const { d } = setup(t);
  assert.equal(
    await d.importProjectFile(
      { name: 'first.json' },
      { prepared: { project: imported() } },
    ),
    true,
  );
  assert.equal(
    await d.importProjectFile(
      { name: 'second.json' },
      { prepared: { project: imported() } },
    ),
    true,
  );
  assert.equal(d._importGeneration, 2);
});

test('[director-242] The scene stop accepts an absent abort owner', (t) => {
  const { d } = setup(t);
  d._running = true;
  d._runToken = { cancelled: false };
  d.stopScene('Operator stop');
  assert.equal(d._runToken.cancelled, true);
  assert.equal(d._sceneSeekGeneration, 1);
  assert.equal(d._presentation.status, 'Operator stop');
});
test('[director-263] The camera flight accepts an absent location method', async (t) => {
  const { d, a, calls } = setup(t);
  delete d.styleManager.clearSearchedLocation;
  await d._flyCamera(a.camera, 2, { cancelled: false });
  assert.equal(entries(calls, 'flight')[0][1].duration, 2);
  assert.equal(entries(calls, 'search').length, 0);
});

test('[director-265] The media time bound does not become negative after a clock change', async (t) => {
  const { d, scene, a, calls } = setup(t);
  a.layers = { one: { enabled: true } };
  d.dataManager.layers.set('one', {
    module: { getSceneShotMediaHold: () => ({ pending: true, maxWaitMs: -1 }) },
  });
  let reads = 0;
  const originalNow = Date.now;
  Date.now = () => (++reads === 1 ? 0 : reads === 2 ? -0.5 : 70);
  t.after(() => {
    Date.now = originalNow;
  });
  d.stopScene = (reason) => calls.push(['stop-scene', reason]);
  await assert.rejects(d._holdShot(scene, a, { cancelled: false }), {
    message: 'Scene media did not finish within its bounded playback window',
  });
  assert.deepEqual(
    entries(calls, 'wait').map((c) => c[1]),
    [70],
  );
});

test('[director-235] The scene passes its live signal to the layer manager', async (t) => {
  const { d, a, calls } = setup(t);
  quick(d, calls);
  a.layers = { one: { enabled: true } };
  let signal;
  d.dataManager.setEnabled = async (id, enabled, options) => {
    signal = options.signal;
    assert.equal(signal instanceof AbortSignal, true);
    assert.equal(signal.aborted, false);
    return true;
  };
  await d.startScene('s');
  assert.equal(signal.aborted, true);
});

test('[director-235] The scene accepts absent pack and action owners', async (t) => {
  const { d, calls } = setup(t);
  quick(d, calls);
  d._interactions = d._dataPacks = null;
  await d.startScene('s');
  assert.deepEqual(
    entries(calls, 'visit').map((c) => c[2]),
    ['a', 'b'],
  );
  assert.equal(d.running, false);
});
test('[director-242] The scene stop accepts absent pack and action owners', (t) => {
  const { d, calls } = setup(t);
  d._interactions = d._dataPacks = null;
  d.stopScene();
  assert.equal(entries(calls, 'cancel').length, 1);
  assert.equal(d._loadGeneration, 1);
  assert.equal(d._sceneSeekGeneration, 1);
});
test('[director-260] The scene layer method accepts absent pack and action owners', async (t) => {
  const { d, scene } = setup(t);
  d._interactions = d._dataPacks = null;
  assert.equal(await d._releaseSceneLayers(scene), true);
});

test('[director-269] The status helper publishes its state to a subscriber', (t) => {
  const { d } = setup(t);
  const events = [];
  let listener;
  delete d._publish;
  d._state = {
    subscribe: (callback) => {
      listener = callback;
    },
    publish: (change) => listener(change),
  };
  d.subscribe((change) =>
    events.push({ ...change, status: d._presentation.status }),
  );
  d._updateStatus('Ready');
  assert.deepEqual(events, [{ type: 'status-changed', status: 'Ready' }]);
});
