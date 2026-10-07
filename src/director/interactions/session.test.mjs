import test from 'node:test';
import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { createInteractionSession } from './session.js';

test('[director-065] The new session reports empty state', () => {
  const s = createInteractionSession({ execute: () => true });
  assert.deepEqual(s.getState(), {
    active: false,
    busy: false,
    selected: null,
    count: 0,
  });
});

test('[director-066] The session activates every unique interaction', () => {
  const states = [];
  const s = createInteractionSession({
    execute: () => true,
    changed: (v) => states.push(v),
  });
  s.activate([{ id: 'a' }, { id: 'b' }]);
  assert.deepEqual(s.getState(), {
    active: true,
    busy: false,
    selected: null,
    count: 2,
  });
  assert.deepEqual(states, [
    { active: false, busy: false, selected: null, count: 0 },
    { active: true, busy: false, selected: null, count: 2 },
  ]);
  s.activate([]);
  assert.equal(s.getState().active, false);
  assert.deepEqual(states.slice(-2), [
    { active: false, busy: false, selected: null, count: 0 },
    { active: false, busy: false, selected: null, count: 0 },
  ]);
});

test('[director-067] The inactive session refuses adapter call', async () => {
  let calls = 0;
  const s = createInteractionSession({
    execute: () => {
      calls++;
      return true;
    },
  });
  assert.equal(await s.dispatch('a'), false);
  assert.equal(calls, 0);
});

test('[director-068] The busy session refuses a second adapter call', async () => {
  let calls = 0;
  let resolve;
  const s = createInteractionSession({
    execute: () => {
      calls++;
      return new Promise((r) => (resolve = r));
    },
  });
  s.activate([{ id: 'a' }]);
  const work = s.dispatch('a');
  await Promise.resolve();
  let timer;
  const unsettled = new Promise((r) => {
    timer = setImmediate(() => r('unsettled'));
  });
  assert.equal(await Promise.race([s.dispatch('a'), unsettled]), false);
  clearImmediate(timer);
  assert.equal(calls, 1);
  resolve(true);
  assert.equal(await work, true);
});

test('[director-069] The active session refuses an unknown ID', async () => {
  let calls = 0;
  const s = createInteractionSession({
    execute: () => {
      calls++;
      return true;
    },
  });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('other'), false);
  assert.equal(calls, 0);
});

test('[director-070] The successful interaction gives selected idle state', async () => {
  const states = [];
  const s = createInteractionSession({
    execute: (item, signal) => {
      assert.equal(item.id, 'a');
      assert.equal(signal.aborted, false);
      return undefined;
    },
    changed: (v) => states.push(v),
  });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('a'), true);
  assert.deepEqual(states.slice(2), [
    { active: true, busy: true, selected: 'a', count: 1 },
    { active: true, busy: false, selected: 'a', count: 1 },
  ]);
});

test('[director-071] The false adapter result refuses the interaction', async () => {
  const s = createInteractionSession({ execute: () => false });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('a'), false);
  assert.equal(s.getState().busy, false);
});

test('[director-072] The adapter exception allows another interaction', async () => {
  let calls = 0;
  const s = createInteractionSession({
    execute: () => {
      calls++;
      throw new Error('failed');
    },
  });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('a'), false);
  assert.equal(s.getState().busy, false);
  assert.equal(await s.dispatch('a'), false);
  assert.equal(calls, 2);
});

test('[director-072] The adapter rejection allows another interaction', async () => {
  let calls = 0;
  const s = createInteractionSession({
    execute: () => {
      calls++;
      return Promise.reject(new Error('failed'));
    },
  });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('a'), false);
  assert.equal(s.getState().busy, false);
  assert.equal(await s.dispatch('a'), false);
  assert.equal(calls, 2);
});

test('[director-073] The session cancels work before adapter call', async () => {
  let calls = 0;
  const s = createInteractionSession({
    execute: () => {
      calls++;
      return true;
    },
  });
  s.activate([{ id: 'a' }]);
  const work = s.dispatch('a');
  s.clear();
  assert.equal(await work, false);
  assert.equal(calls, 0);
});

test('[director-073] The session settles work with no adapter result', async () => {
  let signal;
  const s = createInteractionSession({
    execute: (_, v) => {
      signal = v;
      return new Promise(() => {});
    },
  });
  s.activate([{ id: 'a' }]);
  const work = s.dispatch('a');
  await Promise.resolve();
  s.clear();
  assert.equal(signal.aborted, true);
  let timer;
  const unsettled = new Promise((r) => {
    timer = setImmediate(() => r('unsettled'));
  });
  assert.equal(await Promise.race([work, unsettled]), false);
  clearImmediate(timer);
  assert.deepEqual(s.getState(), {
    active: false,
    busy: false,
    selected: null,
    count: 0,
  });
});

test('[director-074] The old work leaves new session state intact', async () => {
  let oldResult, newResult;
  const states = [];
  const s = createInteractionSession({
    execute: (item) =>
      new Promise((resolve) => {
        if (item.id === 'old') oldResult = resolve;
        else newResult = resolve;
      }),
    changed: (state) => states.push(state),
  });
  s.activate([{ id: 'old' }]);
  const oldWork = s.dispatch('old');
  await Promise.resolve();
  s.activate([{ id: 'new' }]);
  const newWork = s.dispatch('new');
  const before = states.length;
  assert.equal(await oldWork, false);
  oldResult(true);
  await Promise.resolve();
  assert.equal(states.length, before);
  assert.deepEqual(s.getState(), {
    active: true,
    busy: true,
    selected: 'new',
    count: 1,
  });
  newResult(true);
  assert.equal(await newWork, true);
  assert.deepEqual(states, [
    { active: false, busy: false, selected: null, count: 0 },
    { active: true, busy: false, selected: null, count: 1 },
    { active: true, busy: true, selected: 'old', count: 1 },
    { active: false, busy: false, selected: null, count: 0 },
    { active: true, busy: false, selected: null, count: 1 },
    { active: true, busy: true, selected: 'new', count: 1 },
    { active: true, busy: false, selected: 'new', count: 1 },
  ]);
  assert.deepEqual(s.getState(), {
    active: true,
    busy: false,
    selected: 'new',
    count: 1,
  });
});

test('[director-073] The session returns false when clear runs after the result', async () => {
  let s;
  s = createInteractionSession({
    execute: () => {
      queueMicrotask(() => queueMicrotask(() => s.clear()));
      return true;
    },
  });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('a'), false);
});

test('[director-070] The interaction removes its abort listener', async () => {
  let signal;
  const s = createInteractionSession({
    execute: (_, current) => {
      signal = current;
      assert.equal(getEventListeners(signal, 'abort').length, 1);
      return true;
    },
  });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('a'), true);
  assert.equal(getEventListeners(signal, 'abort').length, 0);
});

test('[director-070] The adapter result zero gives true', async () => {
  const s = createInteractionSession({ execute: () => 0 });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('a'), true);
});

test('[director-070] The adapter result empty text gives true', async () => {
  const s = createInteractionSession({ execute: () => '' });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('a'), true);
});

test('[director-065] The default state callback accepts a session change', () => {
  const s = createInteractionSession({ execute: () => true });
  assert.doesNotThrow(() => s.activate([]));
  assert.deepEqual(s.getState(), {
    active: false,
    busy: false,
    selected: null,
    count: 0,
  });
});

test('[director-073] The session does not abort the old controller when clear runs twice', async () => {
  let signal;
  let calls = 0;
  const s = createInteractionSession({
    execute: (_, v) => {
      signal = v;
      return new Promise(() => {});
    },
  });
  s.activate([{ id: 'a' }]);
  const work = s.dispatch('a');
  await Promise.resolve();
  signal.addEventListener('abort', () => {
    calls++;
  });
  s.clear();
  const native = AbortController.prototype.abort;
  AbortController.prototype.abort = function () {
    calls++;
    return native.call(this);
  };
  try {
    s.clear();
  } finally {
    AbortController.prototype.abort = native;
  }
  assert.equal(calls, 1);
  await work;
});

test('[director-070] The session does not abort a completed controller when clear runs', async () => {
  let signal;
  const s = createInteractionSession({
    execute: (_, v) => {
      signal = v;
      return true;
    },
  });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('a'), true);
  s.clear();
  assert.equal(signal.aborted, false);
});

test('[director-073] The state callback receives empty state after clear', () => {
  const states = [];
  const s = createInteractionSession({
    execute: () => true,
    changed: (v) => states.push(v),
  });
  s.activate([{ id: 'a' }]);
  s.clear();
  assert.deepEqual(states, [
    { active: false, busy: false, selected: null, count: 0 },
    { active: true, busy: false, selected: null, count: 1 },
    { active: false, busy: false, selected: null, count: 0 },
  ]);
});
