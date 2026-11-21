import test from 'node:test';
import assert from 'node:assert/strict';
import { createPanelActionObserver } from './actionObserver.js';
import { createVoiceInactivity } from './inactivity.js';

const QUIET = { known: true, connected: true, held: false, inputBusy: false, outputBusy: false, generationBusy: false };

function clock() {
  let now = 0;
  let next = 0;
  const tasks = new Map();
  return {
    now: () => now,
    setTimer(fn, ms) {
      next += 1;
      tasks.set(next, { fn, at: now + ms });
      return next;
    },
    clearTimer: (id) => tasks.delete(id),
    advance(ms) {
      now += ms;
      for (const [id, task] of [...tasks]) if (task.at <= now && tasks.delete(id)) task.fn();
    },
  };
}

test('[voice-panel-034] the timer takes five minutes for a limit that is not a whole number of minutes from 0 to 60', () => {
  for (const minutes of [-1, 61, 2.5, 'x']) {
    const timers = clock();
    const inactivity = createVoiceInactivity({ readActivity: () => QUIET, readPending: () => false, minutes, setTimer: timers.setTimer, clearTimer: timers.clearTimer, now: timers.now });
    assert.equal(inactivity.snapshot().minutes, 5);
    inactivity.destroy();
  }
});

test('[voice-panel-034] the timer stops at once for a signal that is already aborted', () => {
  const abort = new AbortController();
  abort.abort();
  const inactivity = createVoiceInactivity({ readActivity: () => QUIET, readPending: () => false, signal: abort.signal });
  assert.equal(inactivity.snapshot().disposed, true);
});

test('[voice-panel-034] the timer cancels when the activity stops being quiet, and refuses a bad new limit', () => {
  const timers = clock();
  let activity = QUIET;
  const inactivity = createVoiceInactivity({ readActivity: () => activity, readPending: () => false, setTimer: timers.setTimer, clearTimer: timers.clearTimer, now: timers.now });
  assert.equal(inactivity.snapshot().deadline, 300000);
  activity = { ...QUIET, held: true };
  inactivity.update();
  assert.equal(inactivity.snapshot().deadline, null);
  assert.equal(inactivity.setMinutes('x'), false);
  assert.equal(inactivity.setMinutes(61), false);
  assert.equal(inactivity.setMinutes(10), true);
  inactivity.destroy();
  assert.equal(inactivity.setMinutes(10), false);
});

test('[voice-panel-003] a promise that cannot take a callback leaves the action observer without a settle', () => {
  const observations = [];
  const promise = Promise.resolve('done');
  Object.defineProperty(promise, 'constructor', {
    get() {
      throw new Error('hostile constructor');
    },
  });
  const observer = createPanelActionObserver({ runAction: () => promise, onObservation: (item) => observations.push(item.type) });
  assert.equal(observer.runAction('say'), promise);
  assert.deepEqual(observations, ['attempt-started', 'ownership-retired']);
});
