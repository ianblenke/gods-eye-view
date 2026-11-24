import test from 'node:test';
import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { createPanelActionObserver } from './actionObserver.js';
import { createVoiceInactivity } from './inactivity.js';
import { observeNativeActivity } from './nativeActivity.js';

function controlledClock() {
  let now = 0,
    next = 0;
  const tasks = new Map();
  return {
    now: () => now,
    setTimer(fn, ms) {
      const id = ++next;
      tasks.set(id, { fn, at: now + ms });
      return id;
    },
    clearTimer: (id) => tasks.delete(id),
    advance(ms) {
      now += ms;
      for (const [id, task] of [...tasks])
        if (task.at <= now && tasks.delete(id)) task.fn();
    },
  };
}

test('[voice-panel-001] The observer rejects an invalid action', () => {
  for (const runAction of [undefined, null, 1, {}])
    assert.throws(() => createPanelActionObserver({ runAction }), {
      name: 'TypeError',
      message: 'runAction is required',
    });
});

for (const [index, options] of [null, undefined].entries()) {
  test(`[voice-panel-009] The absent options keep their value in case ${index}`, () => {
    let received;
    const o = createPanelActionObserver({
      runAction(...args) {
        received = args;
        return 19;
      },
    });
    assert.equal(o.runAction(41, 'body', options, 'tail'), 19);
    assert.deepEqual(received, [41, 'body', options, 'tail']);
    assert.equal(o.pendingCount, 0);
  });
}

for (const [index, options] of [
  Object.create({ inherited: 9 }),
  { progress: 7 },
  new Proxy(
    {},
    {
      getPrototypeOf() {
        throw Error('prototype');
      },
    },
  ),
  new Proxy(
    {},
    {
      ownKeys() {
        throw Error('keys');
      },
    },
  ),
].entries()) {
  test(`[voice-panel-006] The custom options stay unchanged in case ${index}`, () => {
    let received;
    const o = createPanelActionObserver({
      runAction(name, body, value) {
        received = value;
        return 23;
      },
    });
    assert.equal(o.runAction('test', {}, options), 23);
    assert.equal(received === options, true);
  });
}

test('[voice-panel-005 voice-panel-011] The progress wrapper copies descriptors and filters metadata', () => {
  let getterCalls = 0,
    received,
    callbackReceiver;
  const calls = [],
    events = [];
  const options = {};
  Object.defineProperty(options, 'progress', {
    enumerable: false,
    value: function (...args) {
      callbackReceiver = this;
      calls.push(args);
      return 27;
    },
  });
  const o = createPanelActionObserver({
    onObservation: (event) => events.push(event),
    runAction(name, body, value) {
      received = value;
      assert.equal(
        Object.getOwnPropertyDescriptor(value, 'progress').enumerable,
        false,
      );
      assert.equal(Object.hasOwn(value, 'progress'), true);
      const metadata = { step: 'phase-one', label: 'First', secret: 91 };
      assert.equal(value.progress(metadata, 'second'), 27);
      assert.equal(callbackReceiver === options, true);
      assert.deepEqual(calls, [[metadata, 'second']]);
      value.progress({
        step: 'phase-two',
        get label() {
          getterCalls++;
          return 'hidden';
        },
      });
      value.progress({
        get step() {
          getterCalls++;
          return 'hidden';
        },
        label: 'Ignored',
      });
      value.progress();
      return 7;
    },
  });
  assert.equal(o.runAction('copy', {}, options), 7);
  assert.notEqual(received, options);
  assert.equal(getterCalls, 0);
  const progress = events.filter((e) => e.type === 'progress');
  assert.deepEqual(
    progress.map(({ type, name, pendingCount, step, label, ...rest }) => {
      assert.deepEqual(Object.keys(rest), ['key']);
      assert.equal(Object.isFrozen(rest.key), true);
      return { type, name, pendingCount, step, label };
    }),
    [
      {
        type: 'progress',
        name: 'copy',
        pendingCount: 1,
        step: 'phase-one',
        label: 'First',
      },
      {
        type: 'progress',
        name: 'copy',
        pendingCount: 1,
        step: 'phase-two',
        label: undefined,
      },
    ],
  );
  assert.equal(Object.hasOwn(progress[1], 'label'), false);
  assert.equal(Object.isFrozen(progress[0]), true);
});

for (const [index, update] of [
  null,
  {},
  { step: 4 },
  { step: 'next', label: 9 },
  { step: 'next', label: 'Label' },
].entries()) {
  test(`[voice-panel-011] The progress metadata uses data fields in case ${index}`, () => {
    const events = [];
    const o = createPanelActionObserver({
      onObservation: (e) => events.push(e),
      runAction(name, body, opts) {
        assert.equal(opts.progress(update) === undefined, true);
        return 3;
      },
    });
    assert.equal(o.runAction(17, {}, {}), 3);
    assert.equal(events[0].name === undefined, true);
    const progress = events.filter((e) => e.type === 'progress');
    assert.equal(progress.length === (index < 3 ? 0 : 1), true);
    if (index >= 3) {
      assert.equal(progress[0].step, 'next');
      assert.equal(Object.hasOwn(progress[0], 'label') === (index === 4), true);
      if (index === 4) assert.equal(progress[0].label, 'Label');
    }
  });
}

test('[voice-panel-007] The observer handles signal listener errors', async () => {
  const caller = new AbortController();
  caller.signal.addEventListener = () => {
    throw Error('add');
  };
  caller.signal.removeEventListener = () => {
    throw Error('remove');
  };
  const events = [];
  const o = createPanelActionObserver({
    runAction: () => Promise.resolve(41),
    onObservation: (e) => events.push(e),
  });
  assert.equal(await o.runAction('go', {}, { signal: caller.signal }), 41);
  assert.equal(o.pendingCount, 0);
  assert.deepEqual(
    events.map((e) => [e.type, e.reason]),
    [['ownership-retired', 'unobserved-signal']],
  );
});

test('[voice-panel-008] The observer retires each key with the default reason', async () => {
  const mount = new AbortController();
  mount.signal.removeEventListener = () => {
    throw Error('remove');
  };
  const events = [];
  let resolve;
  const pending = new Promise((yes) => {
    resolve = yes;
  });
  const o = createPanelActionObserver({
    runAction: () => pending,
    signal: mount.signal,
    onObservation: (e) => events.push(e),
  });
  const a = o.runAction('a'),
    b = o.runAction('b');
  assert.equal(o.pendingCount, 2);
  o.retire({ reason: 'object' });
  assert.equal(o.pendingCount, 0);
  assert.deepEqual(
    events.slice(2).map((e) => [e.type, e.reason, e.pendingCount]),
    [
      ['ownership-retired', 'owner-retired', 1],
      ['ownership-retired', 'owner-retired', 0],
    ],
  );
  o.dispose();
  o.dispose();
  assert.equal(o.runAction('late') === pending, true);
  resolve(39);
  assert.equal(await a, 39);
  assert.equal(await b, 39);
  assert.equal(events.length, 4);
  const aborted = new AbortController();
  aborted.abort();
  const late = createPanelActionObserver({
    runAction: () => 51,
    signal: aborted.signal,
  });
  assert.equal(late.runAction('value'), 51);
});

test('[voice-panel-060] The clock runs due tasks once and cancels named tasks', () => {
  const clock = controlledClock(),
    calls = [];
  assert.equal(clock.now(), 0);
  clock.setTimer(() => calls.push('first'), 7);
  const cancelled = clock.setTimer(() => calls.push('cancelled'), 9);
  clock.setTimer(() => calls.push('last'), 11);
  clock.clearTimer(cancelled);
  clock.advance(6);
  assert.deepEqual(calls, []);
  clock.advance(1);
  assert.deepEqual(calls, ['first']);
  assert.equal(clock.now(), 7);
  clock.advance(4);
  assert.deepEqual(calls, ['first', 'last']);
  clock.advance(10);
  assert.deepEqual(calls, ['first', 'last']);
});

test('[voice-panel-003] The native promise keeps identity and each final outcome', async () => {
  for (const rejected of [false, true]) {
    const events = [];
    const result = rejected
      ? Promise.reject('original-error')
      : Promise.resolve('original-value');
    const o = createPanelActionObserver({
      runAction: () => result,
      onObservation: (e) => events.push(e),
    });
    const returned = o.runAction('promise');
    assert.equal(returned === result, true);
    assert.equal(o.pendingCount, 1);
    if (rejected) await assert.rejects(returned, (e) => e === 'original-error');
    else assert.equal(await returned, 'original-value');
    assert.equal(o.pendingCount, 0);
    assert.equal(
      events.at(-1).outcome === (rejected ? 'rejected' : 'fulfilled'),
      true,
    );
    assert.equal(Object.hasOwn(events.at(-1), 'result'), false);
    assert.equal(Object.hasOwn(events.at(-1), 'error'), false);
  }
});

test('[voice-panel-005] The progress callback keeps its order and custom receiver', () => {
  const order = [],
    receiver = {},
    update = { step: 'active', label: 'Active' };
  const options = {
    progress(...args) {
      order.push('original');
      assert.equal(this === receiver, true);
      assert.deepEqual(args, [update, 'tail']);
      return 29;
    },
  };
  const o = createPanelActionObserver({
    onObservation(e) {
      if (e.type === 'progress') order.push('private');
    },
    runAction(name, body, opts) {
      order.push('public');
      assert.equal(opts.progress.call(receiver, update, 'tail'), 29);
      return 11;
    },
  });
  assert.equal(o.runAction('order', {}, options), 11);
  assert.deepEqual(order, ['public', 'original', 'private']);
});

test('[voice-panel-060] The clock checks all due tasks and a cancelled sibling', () => {
  const c = controlledClock(),
    seen = [];
  let sibling;
  c.setTimer(() => {
    seen.push('later-first');
    c.clearTimer(sibling);
  }, 9);
  c.setTimer(() => seen.push('early-second'), 3);
  sibling = c.setTimer(() => seen.push('cancelled'), 9);
  c.setTimer(() => seen.push('last'), 7);
  c.advance(9);
  assert.deepEqual(seen, ['later-first', 'early-second', 'last']);
  c.advance(50);
  assert.deepEqual(seen, ['later-first', 'early-second', 'last']);
});

test('[voice-panel-035] A custom observer ignores state changes and sends no notice', () => {
  let changes = 0;
  const o = observeNativeActivity({
    adapter: {
      get controller() {
        throw Error('opaque');
      },
    },
    nativeProvider: 'custom',
    onChange: () => changes++,
  });
  o.handle({ type: 'state', state: 'listening' });
  assert.deepEqual(o.snapshot(), {
    known: false,
    connected: false,
    held: false,
    inputBusy: false,
    outputBusy: false,
    generationBusy: false,
  });
  assert.equal(changes, 0);
  o.destroy();
});

test('[voice-panel-008] A disposed observer forwards the receiver and each argument unchanged', () => {
  const receiver = {},
    body = { value: 17 },
    options = { progress: null },
    events = [];
  const o = createPanelActionObserver({
    onObservation: (e) => events.push(e),
    runAction(name, args, opts, tail) {
      assert.equal(this === receiver, true);
      assert.equal(name, 'disposed');
      assert.equal(args === body, true);
      assert.equal(opts === options, true);
      assert.equal(tail, 'last');
      assert.equal(arguments.length, 4);
      return 73;
    },
  });
  o.dispose();
  assert.equal(
    o.runAction.call(receiver, 'disposed', body, options, 'last'),
    73,
  );
  assert.deepEqual(events, []);
});

