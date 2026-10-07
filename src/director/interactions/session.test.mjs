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

test('[director-066] The session activates every unique action', () => {
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
});

test('[director-067] The inactive session refuses execution', async () => {
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

test('[director-068] The busy session refuses a second execution', async () => {
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

test('[director-070] The successful action reports selected idle state', async () => {
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

test('[director-071] The false adapter result refuses the action', async () => {
  const s = createInteractionSession({ execute: () => false });
  s.activate([{ id: 'a' }]);
  assert.equal(await s.dispatch('a'), false);
  assert.equal(s.getState().busy, false);
});

test('[director-072] The adapter exception allows another action', async () => {
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

test('[director-072] The adapter rejection allows another action', async () => {
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

test('[director-073] The session cancels work before execution', async () => {
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

test('[director-073] The session settles uncooperative work', async () => {
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
  assert.deepEqual(s.getState(), {
    active: true,
    busy: false,
    selected: 'new',
    count: 1,
  });
});

test('[director-067] The inactive map refuses custom list work', async () => {
  let calls = 0;
  const s = createInteractionSession({
    execute: () => {
      calls++;
      return true;
    },
  });
  const descriptor = Object.getOwnPropertyDescriptor(Map.prototype, 'size');
  const fake = {
    map: (callback) => {
      Object.defineProperty(Map.prototype, 'size', {
        get: () => 0,
        configurable: true,
      });
      return [{ id: 'a' }].map(callback);
    },
  };
  try {
    s.activate(fake);
  } finally {
    Object.defineProperty(Map.prototype, 'size', descriptor);
  }
  assert.equal(s.getState().count, 1);
  assert.equal(await s.dispatch('a'), false);
  assert.equal(calls, 0);
});

test('[director-073] The settled race checks the abort signal', async () => {
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

test('[director-070] The action detaches its abort listener', async () => {
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
