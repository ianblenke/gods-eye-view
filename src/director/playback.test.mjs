import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPlaybackQueue, playSceneQueue } from './playback.js';

const scenes = [
  { id: 'a', title: 'A', shots: [{ id: 'a1' }, { id: 'a2' }] },
  { id: 'empty', shots: [] },
  { id: 'b', title: 'B', shots: [{ id: 'b1' }] },
];
const phases = [
  'selectShot',
  'applyVisual',
  'applyLayers',
  'travel',
  'settle',
  'hold',
  'completeShot',
];

function fixture(overrides = {}) {
  const events = [];
  const abort = new AbortController();
  const token = { cancelled: false, signal: abort.signal };
  const adapter = {
    ...Object.fromEntries(
      phases.map((phase) => [
        phase,
        ({ shot, token: received }) => {
          assert.equal(received, token);
          events.push(`${shot.id}:${phase}`);
        },
      ]),
    ),
    releaseScene(scene, received) {
      events.push(`release:${scene.id}:${received ? 'handoff' : 'cleanup'}`);
      return true;
    },
    complete() {
      events.push('complete');
    },
    ...overrides,
  };
  return { events, abort, token, adapter };
}

test('queues rotate scenes, skip empty scenes, preserve shot identity and support a single scene', () => {
  const queue = buildPlaybackQueue(scenes, 'b');
  assert.deepEqual(
    queue.map(({ shot }) => shot.id),
    ['b1', 'a1', 'a2'],
  );
  assert.equal(queue[0].shot, scenes[2].shots[0]);
  assert.deepEqual(buildPlaybackQueue(scenes, 'empty', { single: true }), []);
  assert.deepEqual(buildPlaybackQueue([], 'missing'), []);
  assert.deepEqual(
    buildPlaybackQueue(scenes, 'missing').map(({ shot }) => shot.id),
    ['a1', 'a2', 'b1'],
  );
});

test('[director-037] playback sequences phases, releases only at scene changes, then releases the final scene', async () => {
  const f = fixture();
  const result = await playSceneQueue(buildPlaybackQueue(scenes, 'a'), f);
  assert.deepEqual(result, { status: 'completed', completedShots: 3 });
  assert.deepEqual(f.events, [
    ...phases.map((phase) => `a1:${phase}`),
    ...phases.map((phase) => `a2:${phase}`),
    'release:a:cleanup',
    ...phases.map((phase) => `b1:${phase}`),
    'complete',
    'release:b:cleanup',
  ]);
});

for (const phase of phases) {
  for (const cancellation of ['flag', 'signal']) {
    test(`${cancellation} cancellation while awaiting ${phase} stops subsequent work and releases resources`, async () => {
      let entered;
      let resume;
      const started = new Promise((resolve) => {
        entered = resolve;
      });
      const pending = new Promise((resolve) => {
        resume = resolve;
      });
      const f = fixture({
        [phase]: async () => {
          entered();
          await pending;
        },
      });
      const run = playSceneQueue(buildPlaybackQueue(scenes, 'a'), f);
      await started;
      if (cancellation === 'flag') f.token.cancelled = true;
      else f.abort.abort();
      resume();
      assert.deepEqual(await run, { status: 'cancelled', completedShots: 0 });
      assert.deepEqual(f.events, [
        ...phases.slice(0, phases.indexOf(phase)).map((name) => `a1:${name}`),
        'release:a:cleanup',
      ]);
    });
  }
  test(`[director-040] failure in ${phase} propagates after release, without later shots`, async () => {
    const failure = new Error('adapter failed');
    const f = fixture({
      [phase]: () => {
        throw failure;
      },
    });
    await assert.rejects(
      playSceneQueue(buildPlaybackQueue(scenes, 'a'), f),
      (error) => error === failure,
    );
    assert.equal(f.events.at(-1), 'release:a:cleanup');
    assert.ok(
      !f.events.some(
        (event) => event.startsWith('a2:') || event === 'complete',
      ),
    );
  });
}

test('[director-038] empty and pre-aborted runs never acquire or release adapter resources', async () => {
  const f = fixture();
  assert.deepEqual(await playSceneQueue([], f), {
    status: 'completed',
    completedShots: 0,
  });
  f.abort.abort();
  assert.deepEqual(
    await playSceneQueue(buildPlaybackQueue(scenes, 'a'), {
      ...f,
      previousScene: scenes[2],
    }),
    { status: 'cancelled', completedShots: 0 },
  );
  assert.deepEqual(f.events, []);
});

test('a prior scene must release before playback; a refused handoff starts no shot', async () => {
  const f = fixture();
  await playSceneQueue(buildPlaybackQueue(scenes, 'a', { single: true }), {
    ...f,
    previousScene: scenes[2],
  });
  assert.equal(f.events[0], 'release:b:handoff');
  const refused = fixture({ releaseScene: () => false });
  await assert.rejects(
    playSceneQueue(buildPlaybackQueue(scenes, 'a'), {
      ...refused,
      previousScene: scenes[2],
    }),
    /Could not leave scene: B/,
  );
  assert.deepEqual(refused.events, []);
});

test('[director-038] cancellation during an inter-scene release never acquires the next scene', async () => {
  const f = fixture();
  const release = f.adapter.releaseScene;
  f.adapter.releaseScene = (...args) => {
    f.abort.abort();
    return release(...args);
  };
  const result = await playSceneQueue(buildPlaybackQueue(scenes, 'a'), f);
  assert.deepEqual(result, { status: 'cancelled', completedShots: 2 });
  assert.equal(f.events.at(-1), 'release:a:cleanup');
  assert.equal(
    f.events.filter((event) => event.startsWith('release')).length,
    1,
  );
});

test('non-preview playback retains the final scene but still releases preceding scenes', async () => {
  const f = fixture();
  await playSceneQueue(buildPlaybackQueue(scenes, 'a'), {
    ...f,
    releaseOnFinish: false,
  });
  assert.deepEqual(
    f.events.filter((event) => event.startsWith('release')),
    ['release:a:cleanup'],
  );
});

test('[director-040] a cleanup failure rejects for the caller to restore its own controls', async () => {
  const failure = new Error('cleanup failed');
  const f = fixture({
    releaseScene: () => {
      throw failure;
    },
  });
  await assert.rejects(
    playSceneQueue(buildPlaybackQueue(scenes, 'a', { single: true }), f),
    (error) => error === failure,
  );
});

test('[director-037] The playback calls the selectShot phase', async () => {
  let calls = 0;
  const f = fixture({
    selectShot: (ctx) => {
      calls++;
      assert.equal(ctx.index, 0);
      assert.equal(ctx.total, 1);
      assert.equal(ctx.scene.id, 'b');
      assert.equal(ctx.shot.id, 'b1');
      assert.equal(ctx.token, f.token);
    },
  });
  const result = await playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  assert.equal(calls, 1);
  assert.deepEqual(result, { status: 'completed', completedShots: 1 });
});

test('[director-037] The playback calls the applyVisual phase', async () => {
  let calls = 0;
  const f = fixture({
    applyVisual: (ctx) => {
      calls++;
      assert.equal(ctx.index, 0);
      assert.equal(ctx.total, 1);
      assert.equal(ctx.scene.id, 'b');
      assert.equal(ctx.shot.id, 'b1');
      assert.equal(ctx.token, f.token);
    },
  });
  const result = await playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  assert.equal(calls, 1);
  assert.deepEqual(result, { status: 'completed', completedShots: 1 });
});

test('[director-037] The playback calls the applyLayers phase', async () => {
  let calls = 0;
  const f = fixture({
    applyLayers: (ctx) => {
      calls++;
      assert.equal(ctx.index, 0);
      assert.equal(ctx.total, 1);
      assert.equal(ctx.scene.id, 'b');
      assert.equal(ctx.shot.id, 'b1');
      assert.equal(ctx.token, f.token);
    },
  });
  const result = await playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  assert.equal(calls, 1);
  assert.deepEqual(result, { status: 'completed', completedShots: 1 });
});

test('[director-037] The playback calls the travel phase', async () => {
  let calls = 0;
  const f = fixture({
    travel: (ctx) => {
      calls++;
      assert.equal(ctx.index, 0);
      assert.equal(ctx.total, 1);
      assert.equal(ctx.scene.id, 'b');
      assert.equal(ctx.shot.id, 'b1');
      assert.equal(ctx.token, f.token);
    },
  });
  const result = await playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  assert.equal(calls, 1);
  assert.deepEqual(result, { status: 'completed', completedShots: 1 });
});

test('[director-037] The playback calls the settle phase', async () => {
  let calls = 0;
  const f = fixture({
    settle: (ctx) => {
      calls++;
      assert.equal(ctx.index, 0);
      assert.equal(ctx.total, 1);
      assert.equal(ctx.scene.id, 'b');
      assert.equal(ctx.shot.id, 'b1');
      assert.equal(ctx.token, f.token);
    },
  });
  const result = await playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  assert.equal(calls, 1);
  assert.deepEqual(result, { status: 'completed', completedShots: 1 });
});

test('[director-037] The playback calls the hold phase', async () => {
  let calls = 0;
  const f = fixture({
    hold: (ctx) => {
      calls++;
      assert.equal(ctx.index, 0);
      assert.equal(ctx.total, 1);
      assert.equal(ctx.scene.id, 'b');
      assert.equal(ctx.shot.id, 'b1');
      assert.equal(ctx.token, f.token);
    },
  });
  const result = await playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  assert.equal(calls, 1);
  assert.deepEqual(result, { status: 'completed', completedShots: 1 });
});

test('[director-037] The playback calls the completeShot phase', async () => {
  let calls = 0;
  const f = fixture({
    completeShot: (ctx) => {
      calls++;
      assert.equal(ctx.index, 0);
      assert.equal(ctx.total, 1);
      assert.equal(ctx.scene.id, 'b');
      assert.equal(ctx.shot.id, 'b1');
      assert.equal(ctx.token, f.token);
    },
  });
  const result = await playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  assert.equal(calls, 1);
  assert.deepEqual(result, { status: 'completed', completedShots: 1 });
});

test('[director-038] The playback rejects the flag token', async () => {
  const f = fixture();
  f.token.cancelled = true;
  assert.deepEqual(await playSceneQueue(buildPlaybackQueue(scenes, 'a'), f), {
    status: 'cancelled',
    completedShots: 0,
  });
  assert.deepEqual(f.events, []);
});

test('[director-038] The playback rejects the signal token', async () => {
  const f = fixture();
  f.abort.abort();
  assert.deepEqual(await playSceneQueue(buildPlaybackQueue(scenes, 'a'), f), {
    status: 'cancelled',
    completedShots: 0,
  });
  assert.deepEqual(f.events, []);
});

test('[director-039] The playback keeps the same initial scene', async () => {
  const f = fixture();
  await playSceneQueue(buildPlaybackQueue(scenes, 'b', { single: true }), {
    ...f,
    previousScene: scenes[2],
  });
  assert.equal(f.events[0], 'b1:selectShot');
});

test('[director-037] The playback accepts an absent complete callback', async () => {
  const f = fixture();
  delete f.adapter.complete;
  assert.deepEqual(
    await playSceneQueue(buildPlaybackQueue(scenes, 'b', { single: true }), f),
    { status: 'completed', completedShots: 1 },
  );
});

test('[director-036] The single scene queue excludes other scenes', () => {
  assert.deepEqual(
    buildPlaybackQueue(scenes, 'b', { single: true }).map(
      ({ shot }) => shot.id,
    ),
    ['b1'],
  );
});

test('[director-039] The final scene stays when cleanup is off', async () => {
  const f = fixture();
  await playSceneQueue(buildPlaybackQueue(scenes, 'b', { single: true }), {
    ...f,
    releaseOnFinish: false,
  });
  assert.equal(f.events.includes('release:b:cleanup'), false);
});

test('[director-038] The empty queue leaves all resources untouched', async () => {
  const f = fixture();
  assert.deepEqual(await playSceneQueue([], f), {
    status: 'completed',
    completedShots: 0,
  });
  assert.deepEqual(f.events, []);
});

test('[director-037] The adapter receives the exact phase order', async () => {
  const f = fixture();
  await playSceneQueue(buildPlaybackQueue(scenes, 'b', { single: true }), f);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'b1:applyLayers',
    'b1:travel',
    'b1:settle',
    'b1:hold',
    'b1:completeShot',
    'complete',
    'release:b:cleanup',
  ]);
});

test('[director-038] The flag token stops work after selectShot', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    selectShot: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.token.cancelled = true;
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, ['release:b:cleanup']);
});

test('[director-038] The signal token stops work after selectShot', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    selectShot: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.abort.abort();
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, ['release:b:cleanup']);
});

test('[director-038] The flag token stops work after applyVisual', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    applyVisual: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.token.cancelled = true;
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, ['b1:selectShot', 'release:b:cleanup']);
});

test('[director-038] The signal token stops work after applyVisual', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    applyVisual: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.abort.abort();
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, ['b1:selectShot', 'release:b:cleanup']);
});

test('[director-038] The flag token stops work after applyLayers', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    applyLayers: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.token.cancelled = true;
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'release:b:cleanup',
  ]);
});

test('[director-038] The signal token stops work after applyLayers', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    applyLayers: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.abort.abort();
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'release:b:cleanup',
  ]);
});

test('[director-038] The flag token stops work after travel', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    travel: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.token.cancelled = true;
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'b1:applyLayers',
    'release:b:cleanup',
  ]);
});

test('[director-038] The signal token stops work after travel', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    travel: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.abort.abort();
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'b1:applyLayers',
    'release:b:cleanup',
  ]);
});

test('[director-038] The flag token stops work after settle', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    settle: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.token.cancelled = true;
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'b1:applyLayers',
    'b1:travel',
    'release:b:cleanup',
  ]);
});

test('[director-038] The signal token stops work after settle', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    settle: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.abort.abort();
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'b1:applyLayers',
    'b1:travel',
    'release:b:cleanup',
  ]);
});

test('[director-038] The flag token stops work after hold', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    hold: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.token.cancelled = true;
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'b1:applyLayers',
    'b1:travel',
    'b1:settle',
    'release:b:cleanup',
  ]);
});

test('[director-038] The signal token stops work after hold', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    hold: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.abort.abort();
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'b1:applyLayers',
    'b1:travel',
    'b1:settle',
    'release:b:cleanup',
  ]);
});

test('[director-038] The flag token stops work after completeShot', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    completeShot: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.token.cancelled = true;
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'b1:applyLayers',
    'b1:travel',
    'b1:settle',
    'b1:hold',
    'release:b:cleanup',
  ]);
});

test('[director-038] The signal token stops work after completeShot', async () => {
  let entered, resume;
  const started = new Promise((r) => {
    entered = r;
  });
  const pending = new Promise((r) => {
    resume = r;
  });
  const f = fixture({
    completeShot: async () => {
      entered();
      await pending;
    },
  });
  const work = playSceneQueue(
    buildPlaybackQueue(scenes, 'b', { single: true }),
    f,
  );
  await started;
  f.abort.abort();
  resume();
  assert.deepEqual(await work, { status: 'cancelled', completedShots: 0 });
  assert.equal(f.events.at(-1), 'release:b:cleanup');
  assert.equal(f.events.includes('complete'), false);
  assert.deepEqual(f.events, [
    'b1:selectShot',
    'b1:applyVisual',
    'b1:applyLayers',
    'b1:travel',
    'b1:settle',
    'b1:hold',
    'release:b:cleanup',
  ]);
});

test('[director-039] The handoff accepts a previous scene before work', async () => {
  const f = fixture();
  await playSceneQueue(buildPlaybackQueue(scenes, 'b', { single: true }), {
    ...f,
    previousScene: scenes[0],
  });
  assert.equal(f.events[0], 'release:a:handoff');
});

test('[director-039] The scene change releases the old scene', async () => {
  const f = fixture();
  await playSceneQueue(buildPlaybackQueue(scenes, 'a'), f);
  assert.equal(f.events[14], 'release:a:cleanup');
});

test('[director-039] The same scene keeps resources between shots', async () => {
  const f = fixture();
  await playSceneQueue(buildPlaybackQueue(scenes, 'a', { single: true }), f);
  assert.equal(f.events[7], 'a2:selectShot');
});

test('[director-038] The handoff cancellation prevents the first shot', async () => {
  let releases = 0;
  const f = fixture({
    releaseScene: () => {
      releases++;
      f.token.cancelled = true;
      return true;
    },
  });
  assert.deepEqual(
    await playSceneQueue(buildPlaybackQueue(scenes, 'b', { single: true }), {
      ...f,
      previousScene: scenes[0],
    }),
    { status: 'cancelled', completedShots: 0 },
  );
  assert.deepEqual(f.events, []);
  assert.equal(releases, 1);
});

test('[director-040] The phase failure keeps its error after cleanup', async () => {
  const f = fixture({
    travel() {
      throw new Error('flight');
    },
  });
  await assert.rejects(
    playSceneQueue(buildPlaybackQueue(scenes, 'b', { single: true }), f),
    /flight/,
  );
  assert.equal(f.events.at(-1), 'release:b:cleanup');
});

test('[director-039] The refused handoff stops the first shot', async () => {
  const f = fixture({ releaseScene: () => false });
  await assert.rejects(
    playSceneQueue(buildPlaybackQueue(scenes, 'b', { single: true }), {
      ...f,
      previousScene: scenes[0],
    }),
    /Could not leave scene: A/,
  );
  assert.deepEqual(f.events, []);
});

test('[director-036] The queue wraps from scene b and keeps each shot object', () => {
  const queue = buildPlaybackQueue(scenes, 'b');
  assert.deepEqual(queue.map(({ shot }) => shot.id), ['b1', 'a1', 'a2']);
  assert.equal(queue[0].shot, scenes[2].shots[0]);
  assert.equal(queue[1].shot, scenes[0].shots[0]);
  assert.equal(queue[2].shot, scenes[0].shots[1]);
  assert.equal(queue[0].scene, scenes[2]);
  assert.equal(queue[1].scene, scenes[0]);
  assert.equal(queue[2].scene, scenes[0]);
});

test('[director-036] The unknown start ID selects the first scene', () => {
  assert.deepEqual(buildPlaybackQueue(scenes, 'unknown').map(({ shot }) => shot.id), ['a1', 'a2', 'b1']);
});

test('[director-037] The phase context gives each index and the queue total', async () => {
  const records = [];
  const adapter = Object.fromEntries(phases.map((phase) => [phase, (context) => {
    assert.equal(Object.hasOwn(context, 'index'), true);
    assert.equal(Object.hasOwn(context, 'total'), true);
    records.push([phase, context.shot.id, context.index, context.total]);
  }]));
  adapter.releaseScene = () => true;
  const result = await playSceneQueue(buildPlaybackQueue(scenes, 'b'), { token: {}, adapter });
  assert.deepEqual(records, [
    ...phases.map((phase) => [phase, 'b1', 0, 3]),
    ...phases.map((phase) => [phase, 'a1', 1, 3]),
    ...phases.map((phase) => [phase, 'a2', 2, 3]),
  ]);
  assert.equal(result.completedShots, 3);
});

test('[director-036] The single scene queue starts at scene a and keeps source objects', () => {
  const queue = buildPlaybackQueue([scenes[0], scenes[2]], 'a', { single: true });
  assert.deepEqual(queue.map(({ shot }) => shot.id), ['a1', 'a2']);
  assert.equal(queue[0].scene, scenes[0]);
  assert.equal(queue[1].scene, scenes[0]);
  assert.equal(queue[0].shot, scenes[0].shots[0]);
  assert.equal(queue[1].shot, scenes[0].shots[1]);
});
