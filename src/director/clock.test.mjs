import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlaybackClock } from './clock.js';

const scene = { id: 'scene', shots: [{ id: 'shot' }] };
const shot = scene.shots[0];
const timing = {
  shotIndex: 0,
  totalSec: 4,
  durationSec: 4,
  startElapsedSec: 0,
};
function fixture() {
  const timers = new Map();
  let id = 0,
    now = 0,
    running = true;
  const progress = [];
  const clock = createPlaybackClock({
    isRunning: () => running,
    timingForShot: () => timing,
    onProgress: (value) => progress.push(value),
    now: () => now,
    schedule: (callback) => {
      timers.set(++id, callback);
      return id;
    },
    cancel: (handle) => timers.delete(handle),
  });
  return {
    clock,
    timers,
    progress,
    time: (value) => {
      now = value;
    },
    running: (value) => {
      running = value;
    },
  };
}

test('[director-024] Stop releases every clock timer and queued callbacks cannot publish later', () => {
  const f = fixture();
  const observed = [];
  f.clock.subscribe((snapshot) => observed.push(snapshot));
  f.clock.startRunProgress(4);
  f.clock.startScene(scene, shot, { cancelled: false });
  f.time(2000);
  for (const tick of f.timers.values()) tick();
  assert.equal(f.clock.snapshot.sceneElapsedSec, 2);
  const stale = [...f.timers.values()];
  f.clock.stop();
  assert.equal(f.clock.activeTimers, 0);
  assert.equal(f.timers.size, 0);
  assert.equal(f.clock.snapshot.stopped, true);
  const count = observed.length,
    progressCount = f.progress.length;
  f.time(3000);
  for (const tick of stale) tick();
  assert.equal(observed.length, count);
  assert.equal(f.progress.length, progressCount);
});

test('[director-030] replacing a shot clock rejects the old callback without clearing the replacement', () => {
  const f = fixture();
  f.clock.startScene(scene, shot, {});
  const stale = [...f.timers.values()][0];
  f.time(1000);
  f.clock.startScene(scene, shot, {});
  f.time(2000);
  stale();
  assert.equal(f.clock.snapshot.sceneElapsedSec, 0);
  assert.equal(f.clock.activeTimers, 1);
  [...f.timers.values()][0]();
  assert.equal(f.clock.snapshot.sceneElapsedSec, 1);
  f.clock.destroy();
});

test('[director-028] direct-load progress finishes once and snapshots cannot mutate the clock', () => {
  const f = fixture();
  f.running(false);
  f.clock.startShotProgress({}, 2, 0.25, 0.75, {
    scene,
    shot,
    sceneElapsedFrom: 1,
    sceneElapsedTo: 3,
  });
  const tick = [...f.timers.values()][0];
  f.time(1000);
  tick();
  assert.equal(f.progress.at(-1), 0.5);
  assert.equal(f.clock.snapshot.sceneElapsedSec, 2);
  const copy = f.clock.snapshot;
  copy.sceneElapsedSec = 99;
  assert.equal(f.clock.snapshot.sceneElapsedSec, 2);
  f.time(2000);
  tick();
  assert.equal(f.progress.at(-1), 0.75);
  assert.equal(f.clock.activeTimers, 0);
  const count = f.progress.length;
  tick();
  assert.equal(f.progress.length, count);
});

test('[director-030] aborted starts and destruction during initial notification leave no timers or listeners', () => {
  const f = fixture();
  const controller = new AbortController();
  controller.abort();
  f.clock.startScene(scene, shot, { signal: controller.signal });
  assert.equal(f.timers.size, 0);
  assert.equal(f.clock.snapshot, null);
  let calls = 0;
  f.clock.subscribe(() => {
    calls++;
    f.clock.destroy();
  });
  f.clock.startScene(scene, shot, {});
  assert.equal(calls, 1);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.startRunProgress(4);
  f.clock.publish(scene, shot, 1);
  f.clock.subscribe(() => calls++);
  assert.equal(calls, 1);
  assert.equal(f.timers.size, 0);
});

test('[director-025] Stop, abort and destroy settle long holds immediately and release their deadlines', async () => {
  for (const action of ['stop', 'abort', 'destroy']) {
    const clock = createPlaybackClock({
      isRunning: () => true,
      timingForShot: () => timing,
      onProgress() {},
    });
    const abort = new AbortController();
    const wait = clock.wait(60000, { signal: abort.signal });
    assert.equal(clock.activeTimers, 1);
    if (action === 'abort') abort.abort();
    else clock[action]();
    await wait;
    assert.equal(clock.activeTimers, 0);
    clock.destroy();
  }
});

test('[director-030] a subscriber can Stop or replace the initial clock without the old start acquiring a timer', () => {
  for (const action of ['stop', 'replace']) {
    const f = fixture();
    let first = true;
    f.clock.subscribe(() => {
      if (!first) return;
      first = false;
      if (action === 'stop') f.clock.stop();
      else f.clock.startScene(scene, { id: 'replacement' }, {});
    });
    f.clock.startScene(scene, shot, {});
    assert.equal(f.timers.size, action === 'stop' ? 0 : 1);
    assert.equal(
      f.clock.snapshot.shotId,
      action === 'stop' ? 'shot' : 'replacement',
    );
    f.clock.destroy();
  }
  const f = fixture();
  f.running(false);
  f.clock.subscribe(() => f.clock.stop());
  f.clock.startShotProgress({}, 10, 0, 1, {
    scene,
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  assert.equal(f.timers.size, 0);
});

test('[director-023] The clock bounds and copies its snapshot', () => {
  const f = fixture();
  assert.equal(f.clock.snapshot, null);
  const values = [];
  f.clock.subscribe((v) => {
    values.push({ ...v });
    v.shotId = 'bad';
  });
  f.clock.publish(scene, shot, 99);
  assert.deepEqual(f.clock.snapshot, {
    sceneId: 'scene',
    shotId: 'shot',
    shotIndex: 0,
    shotCount: 1,
    sceneElapsedSec: 4,
    sceneDurationSec: 4,
    sceneProgress: 1,
    running: true,
    seeking: false,
  });
  f.clock.publish(scene, shot, 'bad', { running: 0, seeking: 1 });
  assert.equal(f.clock.snapshot.sceneElapsedSec, 0);
  assert.equal(f.clock.snapshot.running, false);
  assert.equal(f.clock.snapshot.seeking, true);
  assert.equal(values.length, 2);
});

test('[director-023] The clock uses zero progress for zero total', () => {
  const c = createPlaybackClock({
    isRunning: () => true,
    timingForShot: () => ({ totalSec: 0, shotIndex: 0 }),
    onProgress() {},
  });
  c.publish(scene, shot, 1);
  assert.equal(c.snapshot.sceneProgress, 0);
  c.destroy();
});

test('[director-023] The clock rejects an absent scene', () => {
  const f = fixture();
  f.clock.publish(null, shot, 1);
  assert.equal(f.clock.snapshot, null);
});

test('[director-023] The clock rejects an absent shot', () => {
  const f = fixture();
  f.clock.publish(scene, null, 1);
  assert.equal(f.clock.snapshot, null);
});

test('[director-023] The clock warns when a subscriber fails', () => {
  const f = fixture();
  let calls = 0;
  const warn = console.warn;
  console.warn = () => calls++;
  try {
    f.clock.subscribe(() => {
      throw new Error('observer');
    });
    f.clock.publish(scene, shot, 1);
    assert.equal(calls, 1);
    assert.equal(f.clock.snapshot.sceneElapsedSec, 1);
  } finally {
    console.warn = warn;
    f.clock.destroy();
  }
});

test('[director-026] The subscription gives current copied state', () => {
  const f = fixture();
  f.clock.publish(scene, shot, 1);
  let calls = 0;
  const off = f.clock.subscribe((v) => {
    calls++;
    v.sceneElapsedSec = 9;
  });
  assert.equal(calls, 1);
  assert.equal(f.clock.snapshot.sceneElapsedSec, 1);
  off();
  f.clock.publish(scene, shot, 2);
  assert.equal(calls, 1);
  const invalid = f.clock.subscribe(null);
  assert.equal(typeof invalid, 'function');
  invalid();
  f.clock.destroy();
  const dead = f.clock.subscribe(() => calls++);
  dead();
  assert.equal(calls, 1);
});

test('[director-026] The subscription rejects a nonfunction', () => {
  const f = fixture();
  const off = f.clock.subscribe(null);
  assert.equal(f.clock._sceneClockListeners.size, 0);
  assert.doesNotThrow(() => off());
});

test('[director-024] The stop tolerates subscriber errors', () => {
  const f = fixture();
  let calls = 0;
  f.clock.publish(scene, shot, 1);
  f.clock.subscribe((v) => {
    if (v.stopped) {
      calls++;
      throw new Error('observer');
    }
  });
  assert.doesNotThrow(() => f.clock.stop());
  assert.equal(calls, 1);
  assert.equal(f.clock.snapshot.running, false);
  f.clock.stop();
  assert.equal(calls, 1);
});

test('[director-024] The stop works before the first snapshot', () => {
  const f = fixture();
  assert.doesNotThrow(() => f.clock.stop());
  assert.equal(f.clock.snapshot, null);
  assert.equal(f.clock.activeTimers, 0);
});

test('[director-027] The playback progress uses a one second minimum', () => {
  const f = fixture();
  f.clock.startRunProgress(0);
  f.time(500);
  [...f.timers.values()][0]();
  assert.deepEqual(f.progress, [0.5]);
  f.clock.destroy();
});

test('[director-027] The playback tick rejects stopped state', () => {
  const f = fixture();
  f.clock.startRunProgress(4);
  const tick = [...f.timers.values()][0];
  f.running(false);
  f.time(1000);
  tick();
  assert.deepEqual(f.progress, []);
  f.clock.destroy();
});

test('[director-027] The playback tick rejects replaced state', () => {
  const f = fixture();
  f.clock.startRunProgress(4);
  const tick = [...f.timers.values()][0];
  f.clock.startRunProgress(4);
  f.time(1000);
  tick();
  assert.deepEqual(f.progress, []);
  f.clock.destroy();
});

test('[director-027] The playback tick rejects destroyed state', () => {
  const f = fixture();
  f.clock.startRunProgress(4);
  const tick = [...f.timers.values()][0];
  f.clock._destroyed = true;
  f.time(1000);
  tick();
  assert.deepEqual(f.progress, []);
  f.clock.destroy();
});

test('[director-029] The shot guard 1 rejects destroyed', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock._destroyed = true;
  f.clock.startShotProgress(token, 2, 0, 1);
  assert.deepEqual(f.progress, []);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 1 rejects flag', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  token.cancelled = true;
  f.clock.startShotProgress(token, 2, 0, 1);
  assert.deepEqual(f.progress, []);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 1 rejects signal', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  token.signal = { aborted: true };
  f.clock.startShotProgress(token, 2, 0, 1);
  assert.deepEqual(f.progress, []);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 1 rejects playback', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.running(true);
  f.clock.startShotProgress(token, 2, 0, 1);
  assert.deepEqual(f.progress, []);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 2 rejects generation', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock.subscribe(() => {
    f.clock._shotGeneration++;
  });
  f.clock.startShotProgress(token, 2, 0, 1, {
    scene,
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  assert.deepEqual(f.progress, [0]);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 2 rejects destroyed', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock.subscribe(() => {
    f.clock._destroyed = true;
  });
  f.clock.startShotProgress(token, 2, 0, 1, {
    scene,
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  assert.deepEqual(f.progress, [0]);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 2 rejects flag', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock.subscribe(() => {
    token.cancelled = true;
  });
  f.clock.startShotProgress(token, 2, 0, 1, {
    scene,
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  assert.deepEqual(f.progress, [0]);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 2 rejects signal', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock.subscribe(() => {
    token.signal = { aborted: true };
  });
  f.clock.startShotProgress(token, 2, 0, 1, {
    scene,
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  assert.deepEqual(f.progress, [0]);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 2 rejects playback', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock.subscribe(() => {
    f.running(true);
  });
  f.clock.startShotProgress(token, 2, 0, 1, {
    scene,
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  assert.deepEqual(f.progress, [0]);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 3 rejects generation', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock.startShotProgress(token, 2, 0, 1);
  const tick = [...f.timers.values()][0];
  f.clock._shotGeneration++;
  f.time(1000);
  tick();
  assert.deepEqual(f.progress, [0]);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 3 rejects destroyed', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock.startShotProgress(token, 2, 0, 1);
  const tick = [...f.timers.values()][0];
  f.clock._destroyed = true;
  f.time(1000);
  tick();
  assert.deepEqual(f.progress, [0]);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 3 rejects flag', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock.startShotProgress(token, 2, 0, 1);
  const tick = [...f.timers.values()][0];
  token.cancelled = true;
  f.time(1000);
  tick();
  assert.deepEqual(f.progress, [0]);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 3 rejects signal', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock.startShotProgress(token, 2, 0, 1);
  const tick = [...f.timers.values()][0];
  token.signal = { aborted: true };
  f.time(1000);
  tick();
  assert.deepEqual(f.progress, [0]);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot guard 3 rejects playback', () => {
  const f = fixture();
  f.running(false);
  const token = {};
  f.clock.startShotProgress(token, 2, 0, 1);
  const tick = [...f.timers.values()][0];
  f.running(true);
  f.time(1000);
  tick();
  assert.deepEqual(f.progress, [0]);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot progress guard 1 rejects generation', () => {
  let c,
    calls = 0,
    now = 0,
    tick;
  c = createPlaybackClock({
    isRunning: () => false,
    timingForShot: () => timing,
    onProgress() {
      calls++;
      if (calls === 1) {
        c._shotGeneration++;
      }
    },
    now: () => now,
    schedule: (fn) => {
      tick = fn;
      return 1;
    },
    cancel() {},
  });
  c.startShotProgress({}, 2, 0, 1, {
    scene,
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  assert.equal(c.snapshot, null);
  assert.equal(c.activeTimers, 0);
  c.destroy();
});

test('[director-029] The shot progress guard 1 rejects destroyed', () => {
  let c,
    calls = 0,
    now = 0,
    tick,
    reads = 0;
  c = createPlaybackClock({
    isRunning: () => false,
    timingForShot: () => timing,
    onProgress() {
      calls++;
      if (calls === 1) {
        c._destroyed = true;
      }
    },
    now: () => now,
    schedule: (fn) => {
      tick = fn;
      return 1;
    },
    cancel() {},
  });
  c.startShotProgress({}, 2, 0, 1, {
    get scene() {
      reads++;
      return scene;
    },
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  assert.equal(c.snapshot, null);
  assert.equal(c.activeTimers, 0);
  c.destroy();
  assert.equal(reads, 0);
});

test('[director-029] The shot progress guard 2 rejects generation', () => {
  let c,
    calls = 0,
    now = 0,
    tick;
  c = createPlaybackClock({
    isRunning: () => false,
    timingForShot: () => timing,
    onProgress() {
      calls++;
      if (calls === 2) {
        c._shotGeneration++;
      }
    },
    now: () => now,
    schedule: (fn) => {
      tick = fn;
      return 1;
    },
    cancel() {},
  });
  c.startShotProgress({}, 0, 0, 1, {
    scene,
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  assert.equal(c.snapshot.sceneElapsedSec, 0);
  assert.equal(c.activeTimers, 0);
  c.destroy();
});

test('[director-029] The shot progress guard 2 rejects destroyed', () => {
  let c,
    calls = 0,
    now = 0,
    tick,
    reads = 0;
  c = createPlaybackClock({
    isRunning: () => false,
    timingForShot: () => timing,
    onProgress() {
      calls++;
      if (calls === 2) {
        c._destroyed = true;
      }
    },
    now: () => now,
    schedule: (fn) => {
      tick = fn;
      return 1;
    },
    cancel() {},
  });
  c.startShotProgress({}, 0, 0, 1, {
    get scene() {
      reads++;
      return scene;
    },
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  assert.equal(c.snapshot.sceneElapsedSec, 0);
  assert.equal(c.activeTimers, 0);
  c.destroy();
  assert.equal(reads, 1);
});

test('[director-029] The shot progress guard 3 rejects generation', () => {
  let c,
    calls = 0,
    now = 0,
    tick;
  c = createPlaybackClock({
    isRunning: () => false,
    timingForShot: () => timing,
    onProgress() {
      calls++;
      if (calls === 2) {
        c._shotGeneration++;
      }
    },
    now: () => now,
    schedule: (fn) => {
      tick = fn;
      return 1;
    },
    cancel() {},
  });
  c.startShotProgress({}, 2, 0, 1, {
    scene,
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  now = 1000;
  tick();
  assert.equal(c.snapshot.sceneElapsedSec, 0);
  c.destroy();
});

test('[director-029] The shot progress guard 3 rejects destroyed', () => {
  let c,
    calls = 0,
    now = 0,
    tick,
    reads = 0;
  c = createPlaybackClock({
    isRunning: () => false,
    timingForShot: () => timing,
    onProgress() {
      calls++;
      if (calls === 2) {
        c._destroyed = true;
      }
    },
    now: () => now,
    schedule: (fn) => {
      tick = fn;
      return 1;
    },
    cancel() {},
  });
  c.startShotProgress({}, 2, 0, 1, {
    get scene() {
      reads++;
      return scene;
    },
    shot,
    sceneElapsedFrom: 0,
    sceneElapsedTo: 4,
  });
  now = 1000;
  tick();
  assert.equal(c.snapshot.sceneElapsedSec, 0);
  c.destroy();
  assert.equal(reads, 1);
});

test('[director-028] The instant shot reports both endpoints', () => {
  const f = fixture();
  f.running(false);
  f.clock.startShotProgress({}, 0, 0.2, 0.8, {
    scene,
    shot,
    sceneElapsedFrom: 1,
    sceneElapsedTo: 3,
  });
  assert.deepEqual(f.progress, [0.2, 0.8]);
  assert.equal(f.clock.snapshot.sceneElapsedSec, 3);
  assert.equal(f.clock.activeTimers, 0);
});

test('[director-028] The shot progress works without scene state', () => {
  const f = fixture();
  f.running(false);
  f.clock.startShotProgress({}, 0, 0, 1);
  assert.deepEqual(f.progress, [0, 1]);
  assert.equal(f.clock.snapshot, null);
  f.clock.startShotProgress({}, 2, 0, 1);
  f.time(1000);
  [...f.timers.values()][0]();
  assert.equal(f.progress.at(-1), 0.5);
  assert.equal(f.clock.snapshot, null);
  f.clock.destroy();
});

test('[director-029] The old shot timer leaves its replacement intact', () => {
  const f = fixture();
  f.running(false);
  f.clock.startShotProgress({}, 2, 0, 1);
  const old = [...f.timers.values()][0];
  f.clock.startShotProgress({}, 2, 0.5, 1);
  let cancels = 0;
  const cancel = f.clock.cancel;
  f.clock.cancel = (h) => {
    cancels++;
    cancel(h);
  };
  old();
  assert.equal(cancels, 0);
  assert.deepEqual(f.progress, [0, 0.5]);
  assert.equal(f.clock.activeTimers, 1);
  f.clock.destroy();
});

test('[director-030] The scene guard 1 rejects destroyed', () => {
  const f = fixture();
  let reads = 0;
  f.clock.now = () => {
    reads++;
    return 0;
  };
  const token = {};
  f.clock._destroyed = true;
  f.clock.startScene(scene, shot, token);
  assert.equal(f.clock.snapshot, null);
  assert.equal(f.clock.activeTimers, 0);
  assert.equal(reads, 0);
  f.clock.destroy();
});

test('[director-030] The scene guard 1 rejects flag', () => {
  const f = fixture();
  const token = {};
  token.cancelled = true;
  f.clock.startScene(scene, shot, token);
  assert.equal(f.clock.snapshot, null);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-030] The scene guard 1 rejects signal', () => {
  const f = fixture();
  const token = {};
  token.signal = { aborted: true };
  f.clock.startScene(scene, shot, token);
  assert.equal(f.clock.snapshot, null);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-030] The scene guard 2 rejects generation', () => {
  const f = fixture();
  const token = {};
  f.clock.subscribe(() => {
    f.clock._sceneGeneration++;
  });
  f.clock.startScene(scene, shot, token);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-030] The scene guard 2 rejects destroyed', () => {
  const f = fixture();
  const token = {};
  f.clock.subscribe(() => {
    f.clock._destroyed = true;
  });
  f.clock.startScene(scene, shot, token);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-030] The scene guard 2 rejects flag', () => {
  const f = fixture();
  const token = {};
  f.clock.subscribe(() => {
    token.cancelled = true;
  });
  f.clock.startScene(scene, shot, token);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-030] The scene guard 2 rejects signal', () => {
  const f = fixture();
  const token = {};
  f.clock.subscribe(() => {
    token.signal = { aborted: true };
  });
  f.clock.startScene(scene, shot, token);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-030] The scene guard 3 rejects destroyed', () => {
  const f = fixture();
  const token = {};
  f.clock.startScene(scene, shot, token);
  const tick = [...f.timers.values()][0];
  f.clock._destroyed = true;
  f.time(1000);
  tick();
  assert.equal(f.clock.snapshot.sceneElapsedSec, 0);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-030] The scene guard 3 rejects flag', () => {
  const f = fixture();
  const token = {};
  f.clock.startScene(scene, shot, token);
  const tick = [...f.timers.values()][0];
  token.cancelled = true;
  f.time(1000);
  tick();
  assert.equal(f.clock.snapshot.sceneElapsedSec, 0);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-030] The scene guard 3 rejects signal', () => {
  const f = fixture();
  const token = {};
  f.clock.startScene(scene, shot, token);
  const tick = [...f.timers.values()][0];
  token.signal = { aborted: true };
  f.time(1000);
  tick();
  assert.equal(f.clock.snapshot.sceneElapsedSec, 0);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-030] The scene guard 3 rejects playback', () => {
  const f = fixture();
  const token = {};
  f.clock.startScene(scene, shot, token);
  const tick = [...f.timers.values()][0];
  f.running(false);
  f.time(1000);
  tick();
  assert.equal(f.clock.snapshot.sceneElapsedSec, 0);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-030] The scene clock bounds shot elapsed time', () => {
  const f = fixture();
  f.clock.timingForShot = () => ({
    shotIndex: 0,
    totalSec: 20,
    durationSec: 4,
    startElapsedSec: 3,
  });
  f.clock.startScene(scene, shot, {});
  f.time(9000);
  [...f.timers.values()][0]();
  assert.equal(f.clock.snapshot.sceneElapsedSec, 7);
  f.clock.destroy();
});

test('[director-025] The hold ends at its deadline', async () => {
  let time = 0;
  const c = createPlaybackClock({
    isRunning: () => true,
    timingForShot: () => timing,
    onProgress() {},
    now: () => time,
  });
  const work = c.wait(1, {});
  assert.equal(c.activeTimers, 1);
  time = 2;
  await work;
  assert.equal(c.activeTimers, 0);
  c.destroy();
});

test('[director-025] The hold rejects flag state', async () => {
  let calls = 0;
  const c = createPlaybackClock({
    isRunning: () => true,
    timingForShot: () => timing,
    onProgress() {},
    now: () => (calls++ === 0 ? 0 : 2),
  });
  await c.wait(1, { cancelled: true });
  assert.equal(calls, 1);
  c.destroy();
});

test('[director-025] The hold rejects signal state', async () => {
  let calls = 0;
  const c = createPlaybackClock({
    isRunning: () => true,
    timingForShot: () => timing,
    onProgress() {},
    now: () => (calls++ === 0 ? 0 : 2),
  });
  await c.wait(1, { signal: { aborted: true } });
  assert.equal(calls, 1);
  c.destroy();
});

test('[director-025] The hold rejects destroyed state', async () => {
  let calls = 0;
  const c = createPlaybackClock({
    isRunning: () => true,
    timingForShot: () => timing,
    onProgress() {},
    now: () => (calls++ === 0 ? 0 : 2),
  });
  c._destroyed = true;
  await c.wait(1, {});
  assert.equal(calls, 1);
  c.destroy();
});

test('[director-025] The hold generation stops a pending wait', async () => {
  let calls = 0;
  const c = createPlaybackClock({
    isRunning: () => true,
    timingForShot: () => timing,
    onProgress() {},
    now: () => (++calls <= 2 ? 0 : 60001),
  });
  const work = c.wait(60000, {});
  c.cancelWaits();
  await work;
  assert.equal(calls, 2);
  assert.equal(c.activeTimers, 0);
  c.destroy();
});

test('[director-027] The default timer callbacks report progress', async () => {
  let value;
  const c = createPlaybackClock({
    isRunning: () => true,
    timingForShot: () => timing,
    onProgress: (v) => (value = v),
  });
  c.startRunProgress(1);
  await new Promise((r) => setTimeout(r, 130));
  assert.equal(typeof value, 'number');
  assert.equal(c.activeTimers, 1);
  c.destroy();
  assert.equal(c.activeTimers, 0);
});

test('[director-024] The stop rejects a destroyed clock state', () => {
  const f = fixture();
  f.clock.publish(scene, shot, 1);
  let calls = 0;
  f.clock.subscribe(() => calls++);
  f.clock._destroyed = true;
  f.clock.stop();
  assert.equal(calls, 1);
  assert.equal(f.clock.snapshot.stopped, undefined);
  f.clock.destroy();
});

test('[director-026] The destroyed subscription does not add a listener', () => {
  const f = fixture();
  f.clock.destroy();
  const off = f.clock.subscribe(() => {});
  assert.equal(f.clock._sceneClockListeners.size, 0);
  off();
});

test('[director-023] The destroyed publication does not make a snapshot', () => {
  const f = fixture();
  f.clock.destroy();
  f.clock.publish(scene, shot, 1);
  assert.equal(f.clock.snapshot, null);
});

test('[director-023] The snapshot access returns a copy', () => {
  const f = fixture();
  f.clock.publish(scene, shot, 1);
  const copy = f.clock.snapshot;
  copy.shotId = 'bad';
  assert.equal(f.clock.snapshot.shotId, 'shot');
});

test('[director-024] The stop notifies every subscriber', () => {
  const f = fixture();
  f.clock.publish(scene, shot, 1);
  const calls = [];
  f.clock.subscribe((v) => {
    if (v.stopped) calls.push('a');
  });
  f.clock.subscribe((v) => {
    if (v.stopped) calls.push('b');
  });
  f.clock.stop();
  assert.deepEqual(calls, ['a', 'b']);
});

test('[director-023] The publication notifies every subscriber', () => {
  const f = fixture();
  const calls = [];
  f.clock.subscribe(() => calls.push('a'));
  f.clock.subscribe(() => calls.push('b'));
  f.clock.publish(scene, shot, 1);
  assert.deepEqual(calls, ['a', 'b']);
});

test('[director-025] The clock cancels every pending wait', async () => {
  const f = fixture();
  let a = false,
    b = false;
  const wa = f.clock.wait(60000, {}).then(() => {
    a = true;
  });
  const wb = f.clock.wait(60000, {}).then(() => {
    b = true;
  });
  assert.equal(f.clock.activeTimers, 2);
  f.clock.cancelWaits();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(a, true);
  assert.equal(b, true);
  await Promise.all([wa, wb]);
  assert.equal(f.clock.activeTimers, 0);
});

test('[director-030] The scene start rejects a timing callback replacement', () => {
  const f = fixture();
  f.clock.timingForShot = () => {
    f.clock.stopSceneTimer();
    return timing;
  };
  f.clock.startScene(scene, shot, {});
  assert.equal(f.clock.snapshot, null);
  assert.equal(f.clock.activeTimers, 0);
  f.clock.destroy();
});

test('[director-029] The shot start rejects a changed counter read', () => {
  const f = fixture();
  f.running(false);
  let generation = 0;
  Object.defineProperty(f.clock, '_shotGeneration', {
    get: () => ++generation,
    set() {},
    configurable: true,
  });
  f.clock.startShotProgress({}, 2, 0, 1);
  assert.deepEqual(f.progress, []);
  f.clock.destroy();
});

test('[director-025] The hold condition checks its current state first', async () => {
  let calls = 0;
  const c = createPlaybackClock({
    isRunning: () => true,
    timingForShot: () => timing,
    onProgress() {},
    now: () => (++calls === 1 ? 0 : 2),
  });
  await c.wait(1, { cancelled: true });
  assert.equal(calls, 1);
  c.destroy();
});

test('[director-028] The startShotProgress detaches its timer handle', () => {
  let calls = 0;
  const c = createPlaybackClock({
    isRunning: () => false,
    timingForShot: () => timing,
    onProgress() {},
    schedule: (fn, ms) => {
      assert.equal(ms, 100);
      return {
        unref() {
          calls++;
        },
      };
    },
    cancel() {},
  });
  c.startShotProgress({}, 2, 0, 1);
  assert.equal(calls, 1);
  c.destroy();
});

test('[director-030] The startScene detaches its timer handle', () => {
  let calls = 0;
  const c = createPlaybackClock({
    isRunning: () => false,
    timingForShot: () => timing,
    onProgress() {},
    schedule: (fn, ms) => {
      assert.equal(ms, 50);
      return {
        unref() {
          calls++;
        },
      };
    },
    cancel() {},
  });
  c.startScene(scene, shot, {});
  assert.equal(calls, 1);
  c.destroy();
});
