import test from 'node:test';
import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { createPanelActionObserver } from './actionObserver.js';
import { createManualVoicePanel } from './manualPanel.js';
import {
  createVoicePreferences,
  bindPreferenceControls,
} from './preferences.js';
import { createVoiceInactivity } from './inactivity.js';
import { observeNativeActivity } from './nativeActivity.js';
import { createVoicePanelHost } from './host.js';
import { createVoiceControl } from '../control.js';
import { installPanelDom, controlledClock } from './testDom.mjs';

function panelFixture(t, overrides = {}) {
  const doc = installPanelDom(t);
  const ui = createVoiceControl({ reset: true, panel: true });
  let enabled = true;
  const card = {
    setPresented(value) {
      ui.card.hidden = !(value && enabled);
    },
  };
  const panel = createManualVoicePanel({
    ui,
    card,
    getPreviewEnabled: () => enabled,
    copy: { previewEmpty: 'Empty reply', previewDisabled: 'Disabled reply' },
    ...overrides,
  });
  t.after(() => panel.destroy());
  return {
    doc,
    ui,
    card,
    panel,
    disable: () => {
      enabled = false;
      panel.sync();
    },
  };
}
function nativeFixture(t, provider = 'openai', overrides = {}, options = {}) {
  const calls = [];
  const turns = {
    observeSpeech(...args) {
      calls.push(['speech', this, args]);
      return 13;
    },
  };
  const input = Object.fromEntries(
    ['setMicrophoneEnabled', 'releasePushToTalkKey', 'resetSession'].map(
      (key, index) => [
        key,
        function (...args) {
          calls.push([key, this, args]);
          return 21 + index;
        },
      ],
    ),
  );
  const callbacks = [];
  const controller = {
    status: 'idle',
    dc: null,
    _turns: turns,
    _input: input,
    input,
    sendTextCommand(...args) {
      calls.push(['text', this, args]);
      return args[0] === 'reject' ? false : 37;
    },
    createAudio(...args) {
      calls.push(['create', this, args]);
      callbacks.push(args[0]);
      return {
        pending: 0,
        play(...values) {
          calls.push(['play', this, values]);
          this.pending += values[0];
          return 31;
        },
        clearPlayback(...values) {
          calls.push(['clearPlayback', this, values]);
          this.pending = 0;
          return 32;
        },
        close(...values) {
          calls.push(['close', this, values]);
          this.pending = 0;
          return 33;
        },
      };
    },
    handleMessage(...args) {
      calls.push(['message', this, args]);
      return 43;
    },
    ...overrides,
  };
  const changes = [];
  const observer = observeNativeActivity({
    adapter: { controller },
    nativeProvider: provider,
    onChange: (state) => changes.push(state),
    ...options,
  });
  t.after(() => observer.destroy());
  return { observer, controller, turns, input, callbacks, changes, calls };
}
function hostFixture(t, options = {}) {
  const doc = installPanelDom(t);
  const ui = createVoiceControl({ reset: true, panel: true });
  const clock = controlledClock();
  const host = createVoicePanelHost({ storage: null, clock, ...options });
  const lifetime = new AbortController();
  const events = [],
    cards = [],
    retires = [];
  let active = true,
    stopped = 0,
    rearms = 0;
  const session = {
    signal: lifetime.signal,
    adapter: { controller: options.controller ?? {} },
    disposed: false,
    isActive: () => active,
    stop() {
      stopped++;
      active = false;
    },
  };
  const observer = {
    pendingCount: 0,
    retire(reason) {
      retires.push(reason);
    },
    dispose() {
      events.push('dispose');
    },
  };
  const card = {
    setEnabled(value) {
      events.push(['enabled', value]);
    },
    setPresented(value) {
      ui.card.hidden = !value;
      events.push(['presented', value]);
    },
    handle(event) {
      cards.push(event);
    },
    rearm() {
      rearms++;
    },
  };
  const binding = host.mount({
    ui,
    card,
    session,
    observer,
    nativeProvider: options.nativeProvider,
  });
  t.after(() => host.destroy());
  return {
    doc,
    ui,
    host,
    session,
    observer,
    card,
    binding,
    clock,
    lifetime,
    events,
    cards,
    retires,
    setActive: (value) => {
      active = value;
    },
    stopped: () => stopped,
    rearms: () => rearms,
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

test('[voice-panel-010] A hostile promise check cannot change the returned object', () => {
  const hostile = new Proxy(
    {},
    {
      getPrototypeOf() {
        throw Error('promise');
      },
    },
  );
  const events = [];
  const o = createPanelActionObserver({
    runAction: () => hostile,
    onObservation: (e) => events.push(e),
  });
  assert.equal(o.runAction('hostile') === hostile, true);
  assert.equal(o.pendingCount, 0);
  assert.equal(events.at(-1).reason, 'unobserved-return-kind');
});

for (const [index, value] of [
  null,
  undefined,
  false,
  0,
  'text',
  () => 1,
  {},
].entries()) {
  test(`[voice-panel-${index < 5 ? '002' : '067'}] The action return kind stays exact in case ${index}`, () => {
    const events = [];
    const o = createPanelActionObserver({
      runAction: () => value,
      onObservation: (e) => events.push(e),
    });
    assert.equal(o.runAction('kind') === value, true);
    assert.equal(o.pendingCount, 0);
    assert.equal(
      events.at(-1).type ===
        (index < 5 ? 'attempt-settled' : 'ownership-retired'),
      true,
    );
    assert.equal(
      events.at(-1).outcome === (index < 5 ? 'synchronous-return' : undefined),
      true,
    );
    assert.equal(
      events.at(-1).reason ===
        (index < 5 ? undefined : 'unobserved-return-kind'),
      true,
    );
  });
}

for (const [index, config] of [
  {},
  { ui: {} },
  { ui: { voicePanel: {} }, getPreviewEnabled: null },
  { ui: { voicePanel: {} }, getPreviewEnabled: () => true },
  {
    ui: { voicePanel: {} },
    getPreviewEnabled: () => true,
    copy: { previewEmpty: 'Empty', previewDisabled: 3 },
  },
].entries()) {
  test(`[voice-panel-019] The panel rejects invalid input in case ${index}`, () => {
    assert.throws(() => createManualVoicePanel(config), {
      name: 'TypeError',
      message:
        index < 3
          ? 'A voice panel and Preview preference reader are required.'
          : 'Localized Preview messages are required.',
    });
  });
}

test('[voice-panel-020] The panel accepts absent optional controls', (t) => {
  const doc = installPanelDom(t);
  const node = doc.createElement('aside');
  doc.body.append(node);
  const p = createManualVoicePanel({
    ui: { voicePanel: node },
    getPreviewEnabled: () => true,
    copy: { previewEmpty: 'Empty', previewDisabled: 'Off' },
  });
  assert.deepEqual(p.select('preview'), {
    ok: true,
    changed: true,
    view: 'preview',
    panelOpen: true,
    settingsOpen: false,
    previewEnabled: true,
    previewVisible: false,
  });
  assert.equal(p.close('wrong').reason, 'unknown-view');
  p.destroy();
  p.sync();
  assert.equal(p.snapshot().panelOpen, false);
});

for (const [index, condition] of [
  'hidden',
  'disconnected',
  'invisible',
  'absent',
].entries()) {
  test(`[voice-panel-020] The panel rejects a focus target in case ${index}`, (t) => {
    const f = panelFixture(t);
    const outside = f.doc.body;
    outside.focus();
    if (condition === 'hidden') f.ui.settingsTab.hidden = true;
    if (condition === 'disconnected') f.ui.settingsTab.remove();
    if (condition === 'invisible')
      f.ui.settingsTab.checkVisibility = () => false;
    if (condition === 'absent') {
      f.ui.voiceSettingsButton.hidden = true;
      f.ui.button.remove();
      f.panel.select('preview');
      f.ui.card.focus();
      f.panel.close();
      assert.equal(f.doc.activeElement === f.ui.card, true);
      return;
    }
    f.panel.select('settings', { focus: true });
    assert.equal(f.doc.activeElement === outside, true);
  });
}

test('[voice-panel-019] A listener error cancels the partial panel lifetime', (t) => {
  const doc = installPanelDom(t),
    node = doc.createElement('aside'),
    button = doc.createElement('button');
  const error = Error('listener');
  node.addEventListener = () => {
    throw error;
  };
  assert.throws(
    () =>
      createManualVoicePanel({
        ui: { voicePanel: node, voiceSettingsButton: button },
        getPreviewEnabled: () => true,
        copy: { previewEmpty: 'Empty', previewDisabled: 'Off' },
      }),
    (e) => e === error,
  );
  assert.equal(button.listeners.get('click').size, 0);
});

for (const [index, key, from, to] of [
  [0, 'Home', 'settings', 'preview'],
  [1, 'End', 'preview', 'settings'],
  [2, 'ArrowLeft', 'settings', 'preview'],
  [3, 'ArrowRight', 'preview', 'settings'],
  [4, 'x', 'preview', 'preview'],
]) {
  test(`[voice-panel-014] The tab key selects its target in case ${index}`, (t) => {
    const f = panelFixture(t);
    f.panel.select(from);
    const event = f.ui[from === 'preview' ? 'previewTab' : 'settingsTab'].fire(
      'keydown',
      { key },
    );
    assert.equal(f.panel.snapshot().view === to, true);
    assert.equal(Boolean(event.defaultPrevented) === index < 4, true);
    assert.equal(
      f.ui.previewTab.getAttribute('aria-selected') ===
        (to === 'preview' ? 'true' : 'false'),
      true,
    );
    assert.equal(
      f.ui.settingsTab.getAttribute('aria-selected') ===
        (to === 'settings' ? 'true' : 'false'),
      true,
    );
    assert.equal(
      f.ui.previewTab.tabIndex === (to === 'preview' ? 0 : -1),
      true,
    );
    assert.equal(
      f.ui.settingsTab.tabIndex === (to === 'settings' ? 0 : -1),
      true,
    );
  });
}

test('[voice-panel-017] The close control ends the current presentation', (t) => {
  const f = panelFixture(t);
  f.panel.select('preview');
  assert.equal(f.panel.snapshot().panelOpen, true);
  f.ui.voiceSettingsClose.fire('click');
  assert.equal(f.panel.snapshot().panelOpen, false);
});

function memoryStore(entries = {}) {
  const data = new Map(Object.entries(entries)),
    writes = [];
  return {
    writes,
    getItem: (key) => data.get(key) ?? null,
    setItem(key, value) {
      writes.push([key, value]);
      data.set(key, value);
    },
  };
}
const controlCopy = {
  previewNote: 'Preview note',
  timeoutNote: 'Timeout note',
  notSaved: 'Save failed',
};

for (const [index, value] of [
  null,
  {},
  { setItem() {} },
  { getItem: () => null },
].entries()) {
  test(`[voice-panel-024] The incomplete storage keeps live values in case ${index}`, () => {
    const p = createVoicePreferences({ storage: value });
    assert.equal(p.snapshot().minutes, 5);
    assert.equal(p.setMinutes(18).persisted, false);
    assert.equal(p.snapshot().minutes, 18);
    assert.equal(p.setPreviewEnabled(false).persisted, false);
    assert.equal(p.snapshot().previewEnabled, false);
  });
}

test('[voice-panel-021 voice-panel-022] The model uses browser storage when the storage option is absent', (t) => {
  const store = memoryStore({
    'godsEyeView.voice.previewEnabled': 'false',
    'godsEyeView.voice.inactivityMinutes': '24',
  });
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: store,
  });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else delete globalThis.localStorage;
  });
  const p = createVoicePreferences();
  assert.deepEqual(p.snapshot(), {
    previewEnabled: false,
    minutes: 24,
    previewPersisted: null,
    timeoutPersisted: null,
  });
  assert.deepEqual(store.writes, []);
  assert.equal(p.setMinutes(26).persisted, true);
  assert.equal(p.setPreviewEnabled(true).persisted, true);
  assert.deepEqual(store.writes, [
    ['godsEyeView.voice.inactivityMinutes', '26'],
    ['godsEyeView.voice.previewEnabled', 'true'],
  ]);
});

for (const [index, value] of [
  null,
  false,
  {},
  '',
  ' 4',
  '4 ',
  '1.2',
  '1e1',
  -1,
  61,
  1.2,
  NaN,
  Infinity,
].entries()) {
  test(`[voice-panel-023] The preference rejects an invalid value in case ${index}`, () => {
    const store = memoryStore({ 'godsEyeView.voice.inactivityMinutes': '18' });
    const p = createVoicePreferences({ storage: store });
    let notices = 0;
    p.subscribe(() => notices++);
    assert.deepEqual(p.setMinutes(value), {
      ok: false,
      applied: false,
      changed: false,
      persisted: null,
      reason: 'invalid-value',
      previewEnabled: true,
      minutes: 18,
      previewPersisted: null,
      timeoutPersisted: null,
    });
    assert.equal(notices, 0);
    assert.deepEqual(store.writes, []);
  });
}

for (const [index, minutes, serialized] of [
  [0, 0, 'none'],
  [1, 1, '1'],
  [2, 60, '60'],
  [3, '16', '16'],
]) {
  test(`[voice-panel-022] The preference saves valid minutes in case ${index}`, () => {
    const store = memoryStore(),
      p = createVoicePreferences({ storage: store });
    assert.equal(p.snapshot().minutes, 5);
    const result = p.setMinutes(minutes);
    assert.equal(result.minutes === [0, 1, 60, 16][index], true);
    assert.deepEqual(
      {
        ok: result.ok,
        applied: result.applied,
        changed: result.changed,
        persisted: result.persisted,
      },
      { ok: true, applied: true, changed: true, persisted: true },
    );
    assert.deepEqual(store.writes, [
      ['godsEyeView.voice.inactivityMinutes', serialized],
    ]);
  });
}

test('[voice-panel-028] The model rejects an invalid listener', () => {
  const p = createVoicePreferences({ storage: null });
  assert.throws(() => p.subscribe(3), {
    name: 'TypeError',
    message: 'Preference listener required',
  });
});

for (const [index, displayed] of ['', '0', '8'].entries()) {
  test(`[voice-panel-029] The partial controls use a valid custom value in case ${index}`, (t) => {
    const doc = installPanelDom(t),
      input = doc.createElement('input');
    input.value = displayed;
    const p = createVoicePreferences({ storage: null });
    const binding = bindPreferenceControls({
      ui: { voiceTimeoutInput: input },
      preferences: p,
      copy: controlCopy,
    });
    assert.equal(input.value === (index === 2 ? '8' : '5'), true);
    input.value = '21';
    input.fire('change');
    assert.equal(p.snapshot().minutes, 21);
    assert.equal(input.hidden, false);
    const old = [...input.listeners.get('change')][0];
    binding.dispose();
    old();
    assert.equal(p.snapshot().minutes, 21);
    assert.equal(input.listeners.get('change').size, 0);
  });
}

test('[voice-panel-029] The select works without a custom editor', (t) => {
  const doc = installPanelDom(t),
    select = doc.createElement('select');
  const p = createVoicePreferences({ storage: null });
  const binding = bindPreferenceControls({
    ui: { voiceTimeoutSelect: select },
    preferences: p,
    copy: controlCopy,
  });
  assert.equal(select.value, '5');
  select.value = 'custom';
  select.fire('change');
  assert.equal(select.value, '5');
  assert.equal(p.snapshot().minutes, 5);
  const old = [...select.listeners.get('change')][0];
  binding.dispose();
  select.value = '15';
  old();
  assert.equal(p.snapshot().minutes, 5);
});

test('[voice-panel-029] The preview control restores a rejected value and ignores a retired callback', (t) => {
  const doc = installPanelDom(t),
    input = doc.createElement('input');
  const p = createVoicePreferences({ storage: null });
  const binding = bindPreferenceControls({
    ui: { voicePreviewInput: input },
    preferences: p,
    copy: controlCopy,
  });
  input.checked = 'invalid';
  input.fire('change');
  assert.equal(input.checked, true);
  assert.equal(p.snapshot().previewEnabled, true);
  const old = [...input.listeners.get('change')][0];
  binding.dispose();
  input.checked = false;
  old();
  assert.equal(p.snapshot().previewEnabled, true);
});

function idleFixture(t, overrides = {}) {
  const activity = {
    known: true,
    connected: true,
    held: false,
    inputBusy: false,
    outputBusy: false,
    generationBusy: false,
  };
  const timers = new Map(),
    removed = [];
  let serial = 0,
    pending = 0,
    expired = 0;
  const idle = createVoiceInactivity({
    readActivity: () => activity,
    readPending: () => pending,
    setTimer(fn, delay) {
      const id = ++serial;
      timers.set(id, {
        fn: () => {
          timers.delete(id);
          fn();
        },
        delay,
      });
      return id;
    },
    clearTimer(id) {
      removed.push(id);
      timers.delete(id);
    },
    now: () => 1700,
    onExpire: () => expired++,
    ...overrides,
  });
  t.after(() => idle.destroy());
  return {
    idle,
    activity,
    timers,
    removed,
    expired: () => expired,
    pending: (v) => {
      pending = v;
    },
  };
}
for (const [index, field, value] of [
  [0, 'known', false],
  [1, 'connected', false],
  [2, 'held', true],
  [3, 'inputBusy', true],
  [4, 'outputBusy', true],
  [5, 'generationBusy', true],
  [6, 'pending', 1],
]) {
  test(`[voice-panel-030 voice-panel-033] The idle timer checks one blocker in case ${index}`, (t) => {
    const f = idleFixture(t);
    assert.deepEqual(f.idle.snapshot(), {
      minutes: 5,
      deadline: 301700,
      eligible: true,
      disposed: false,
    });
    assert.equal(f.timers.get(1).delay, 300000);
    const callback = f.timers.get(1).fn;
    if (field === 'pending') f.pending(value);
    else f.activity[field] = value;
    callback();
    assert.equal(f.expired(), 0);
    assert.equal(f.idle.snapshot().eligible, false);
    f.idle.update();
    assert.equal(f.timers.size, 0);
    if (field === 'pending') f.pending(0);
    else f.activity[field] = !value;
    f.idle.update();
    assert.equal(f.timers.size, 1);
    [...f.timers.values()][0].fn();
    assert.equal(f.expired(), 1);
  });
}
for (const [index, value] of [-1, 61, 1.5, '3'].entries()) {
  test(`[voice-panel-032] The timer rejects invalid initial minutes in case ${index}`, (t) => {
    const f = idleFixture(t, { minutes: value });
    assert.equal(f.idle.snapshot().minutes, 5);
    assert.equal(f.idle.setMinutes(value), false);
    assert.equal(f.idle.snapshot().minutes, 5);
  });
}

test('[voice-panel-034] The timer cancels its task and ignores all retired calls', (t) => {
  const signal = new AbortController(),
    f = idleFixture(t, { signal: signal.signal });
  const old = f.timers.get(1).fn;
  signal.abort();
  f.idle.destroy();
  f.idle.update({ activity: true });
  old();
  assert.deepEqual(f.removed, [1]);
  assert.equal(f.expired(), 0);
  assert.equal(f.idle.setMinutes(9), false);
  assert.deepEqual(f.idle.snapshot(), {
    minutes: 5,
    deadline: null,
    eligible: true,
    disposed: true,
  });
  assert.equal(getEventListeners(signal.signal, 'abort').length, 0);
  const aborted = new AbortController();
  aborted.abort();
  const b = idleFixture(t, { signal: aborted.signal });
  assert.equal(b.timers.size, 0);
  assert.equal(b.idle.snapshot().disposed, true);
});

test('[voice-panel-033] A quiet timer can expire without a callback', (t) => {
  const f = idleFixture(t, { onExpire: undefined });
  assert.equal(f.idle.snapshot().eligible, true);
  f.timers.get(1).fn();
  assert.equal(f.idle.snapshot().deadline, null);
});

for (const [index, provider, key] of [
  [0, 'openai', 'responseActive'],
  [1, 'openai', 'responseCreatePending'],
  [2, 'openai', 'userTurnPending'],
  [3, 'gemini', 'responseActive'],
  [4, 'gemini', 'responseCreatePending'],
  [5, 'gemini', 'replyPending'],
  [6, 'gemini', 'retiredReplyPending'],
  [7, 'gemini', 'deferredInput'],
  [8, 'gemini', 'automaticTurnOpen'],
  [9, 'gemini', 'pendingTools'],
  [10, 'gemini', 'controlQueue'],
]) {
  test(`[voice-panel-043] The native work field decides activity in case ${index}`, (t) => {
    const f = nativeFixture(t, provider),
      owner = provider === 'openai' ? f.turns : f.controller;
    assert.equal(f.observer.snapshot().generationBusy, false);
    owner[key] = key === 'controlQueue' ? [9] : true;
    assert.equal(f.observer.snapshot().generationBusy, true);
    owner[key] = key === 'controlQueue' ? [] : false;
    assert.equal(f.observer.snapshot().generationBusy, false);
  });
}

for (const [index, key] of [
  'assistantAudioPlaying',
  'responseActive',
  'responseCreatePending',
  'userTurnPending',
  'activeResponseId',
  'progressResponse',
].entries()) {
  test(`[voice-panel-042] The initial output rejects a busy field in case ${index}`, (t) => {
    const f = nativeFixture(t);
    assert.equal(f.observer.snapshot().known, true);
    f.observer.destroy();
    f.turns[key] = true;
    const o = observeNativeActivity({
      adapter: { controller: f.controller },
      nativeProvider: 'openai',
    });
    t.after(() => o.destroy());
    assert.equal(o.snapshot().known, false);
  });
}

for (const [index, key] of [
  'setMicrophoneEnabled',
  'releasePushToTalkKey',
  'resetSession',
].entries()) {
  test(`[voice-panel-040 voice-panel-047] The input method keeps its call in case ${index}`, (t) => {
    const f = nativeFixture(t, 'gemini'),
      receiver = {},
      args = [31 + index, 47 - index];
    assert.equal(f.input[key].apply(receiver, args) === 21 + index, true);
    assert.deepEqual(f.calls, [[key, receiver, args]]);
    assert.equal(f.changes.length, 1);
    const old = f.input[key];
    f.observer.destroy();
    assert.notEqual(f.input[key], old);
    const n = f.changes.length;
    old.call(receiver, 'late');
    assert.equal(f.changes.length === n, true);
  });
}

for (const [index, key] of [
  'onAudioStart',
  'onAudioEnd',
  'onAudioDiscard',
  'onDrain',
].entries()) {
  test(`[voice-panel-039] The audio callback keeps its own values in case ${index}`, (t) => {
    const f = nativeFixture(t, 'gemini');
    let receiver, args;
    const options = {
      [key](...values) {
        receiver = this;
        args = values;
        return 51 + index;
      },
    };
    f.controller.audio = f.controller.createAudio(options, 'tail');
    assert.equal(f.calls[0][1] === f.controller, true);
    assert.equal(f.calls[0][2][1], 'tail');
    assert.equal(
      f.callbacks[0][key](61 + index, 71 - index) === 51 + index,
      true,
    );
    assert.equal(receiver === options, true);
    assert.deepEqual(args, [61 + index, 71 - index]);
    const explicit = {};
    f.callbacks[0][key].call(explicit, 'custom');
    assert.equal(receiver === explicit, true);
    assert.deepEqual(args, ['custom']);
    assert.equal(f.changes.length, 2);
  });
}

for (const [index, key] of ['play', 'clearPlayback', 'close'].entries()) {
  test(`[voice-panel-037 voice-panel-040 voice-panel-047] The audio method updates output in case ${index}`, (t) => {
    const f = nativeFixture(t, 'gemini');
    f.controller.audio = f.controller.createAudio({});
    assert.equal(f.observer.snapshot().outputBusy, false);
    assert.equal(f.controller.audio.play(2), 31);
    assert.equal(f.observer.snapshot().outputBusy, true);
    const before = f.changes.length;
    assert.equal(
      f.controller.audio[key](1, `tail-${index}`) === 31 + index,
      true,
    );
    const last = f.calls.at(-1);
    assert.equal(last[0] === key, true);
    assert.equal(last[1] === f.controller.audio, true);
    assert.deepEqual(last[2], [1, `tail-${index}`]);
    assert.equal(f.changes.length === before + 1, true);
    assert.equal(f.observer.snapshot().outputBusy === (index === 0), true);
  });
}

for (const [index, pushToTalk, admitted, expected] of [
  [0, true, true, true],
  [1, false, true, false],
  [2, true, false, false],
]) {
  test(`[voice-panel-036] The audio start checks admission in case ${index}`, (t) => {
    const f = nativeFixture(t, 'gemini', { captureOwner: { admitted } });
    f.controller.audio = f.controller.createAudio({ pushToTalk });
    assert.equal(f.observer.snapshot().inputBusy, false);
    f.callbacks[0].onAudioStart();
    assert.equal(f.observer.snapshot().inputBusy === expected, true);
    f.callbacks[0].onAudioEnd();
    assert.equal(f.observer.snapshot().inputBusy, false);
  });
}

test('[voice-panel-036] The Gemini activity field reports local input', (t) => {
  const f = nativeFixture(t, 'gemini');
  assert.equal(f.observer.snapshot().inputBusy, false);
  f.controller.userActivityOpen = true;
  assert.equal(f.observer.snapshot().inputBusy, true);
  f.controller.userActivityOpen = false;
  assert.equal(f.observer.snapshot().inputBusy, false);
});

for (const [index, value, expected] of [
  [0, '', 0],
  [1, null, 0],
  [2, '  ', 0],
  [3, 'reject', 0],
  [4, 'typed', 1],
]) {
  test(`[voice-panel-044] The text wrapper checks its input in case ${index}`, (t) => {
    let inputs = 0;
    const f = nativeFixture(t, 'gemini', {}, { onInput: () => inputs++ });
    const receiver = {};
    assert.equal(
      f.controller.sendTextCommand.call(receiver, value) ===
        (index === 3 ? false : 37),
      true,
    );
    assert.deepEqual(f.calls, [['text', receiver, [value]]]);
    assert.equal(inputs === expected, true);
  });
}

for (const [index, output, known] of [
  [
    0,
    [
      { type: 'function_call', name: 'one' },
      {
        type: 'message',
        content: [
          { type: 'text' },
          { type: 'output_text' },
          { type: 'refusal' },
        ],
      },
    ],
    true,
  ],
  [1, [{ type: 'other' }], false],
  [2, [{ type: 'message', content: null }], false],
  [
    3,
    [{ type: 'message', content: [{ type: 'text' }, { type: 'audio' }] }],
    false,
  ],
  [4, [{ type: 'message', content: [null] }], false],
  [5, [null], false],
  [6, [{ type: 'function_call' }, { type: 'other' }], false],
  [
    7,
    [
      { type: 'message', content: [] },
      { type: 'message', content: [{ type: 'audio' }] },
    ],
    false,
  ],
]) {
  test(`[voice-panel-045] The response checks every output part in case ${index}`, (t) => {
    const f = nativeFixture(t);
    assert.equal(f.observer.snapshot().known, true);
    f.turns.observeSpeech({
      type: 'response.created',
      response: { id: 'silent' },
    });
    assert.equal(f.observer.snapshot().known, false);
    f.turns.observeSpeech({
      type: 'response.done',
      response: { id: 'silent', status: 'completed', output },
    });
    assert.equal(f.observer.snapshot().known === known, true);
  });
}

for (const [index, marker] of [
  { type: 'response.output_audio.delta' },
  { type: 'response.audio.delta' },
  { type: 'response.part.added', part: { type: 'audio' } },
  { type: 'response.part.added', part: { type: 'output_audio' } },
].entries()) {
  test(`[voice-panel-041] The audio evidence blocks a silent result in case ${index}`, (t) => {
    const f = nativeFixture(t);
    f.turns.observeSpeech({ type: 'response.created', response_id: 'audio' });
    f.turns.observeSpeech({ ...marker, response_id: 'audio' });
    f.turns.observeSpeech({
      type: 'response.done',
      response_id: 'audio',
      response: { status: 'completed', output: [] },
    });
    assert.equal(f.observer.snapshot().known, false);
    f.turns.observeSpeech({
      type: 'output_audio_buffer.cleared',
      response_id: 'audio',
    });
    assert.equal(f.observer.snapshot().known, true);
  });
}

for (const [index, status] of [
  'completed',
  'cancelled',
  'failed',
  'incomplete',
  'unknown',
].entries()) {
  test(`[voice-panel-045] The silent response checks its status in case ${index}`, (t) => {
    const f = nativeFixture(t);
    f.turns.observeSpeech({ type: 'response.created', response_id: 'one' });
    f.turns.observeSpeech({
      type: 'response.done',
      response_id: 'one',
      response: { status, output: [] },
    });
    assert.equal(f.observer.snapshot().known === index < 4, true);
  });
}

test('[voice-panel-046] The response limit keeps unknown output until playback clears it', (t) => {
  const f = nativeFixture(t);
  for (let i = 0; i < 65; i++)
    f.turns.observeSpeech({ type: 'response.created', response_id: `r${i}` });
  for (let i = 0; i < 65; i++)
    f.turns.observeSpeech({
      type: 'response.done',
      response_id: `r${i}`,
      response: { status: 'completed', output: [] },
    });
  assert.equal(f.observer.snapshot().known, false);
  f.turns.observeSpeech({ type: 'output_audio_buffer.cleared' });
  assert.equal(f.observer.snapshot().known, true);
});

test('[voice-panel-036] The OpenAI speech edges change the input state', (t) => {
  const f = nativeFixture(t);
  assert.equal(f.observer.snapshot().inputBusy, false);
  assert.equal(
    f.turns.observeSpeech({ type: 'input_audio_buffer.speech_started' }),
    13,
  );
  assert.equal(f.observer.snapshot().inputBusy, true);
  f.turns.observeSpeech({ type: 'input_audio_buffer.speech_stopped' });
  assert.equal(f.observer.snapshot().inputBusy, false);
});

test('[voice-panel-047] An aborted observer restores native methods at construction', (t) => {
  const lifetime = new AbortController();
  lifetime.abort();
  const f = nativeFixture(t, 'gemini', {}, { signal: lifetime.signal });
  const before = f.changes.length;
  f.controller.handleMessage('late');
  f.observer.handle(null);
  f.observer.destroy();
  assert.equal(f.changes.length === before, true);
  assert.equal(f.observer.snapshot().known, false);
  assert.equal(getEventListeners(lifetime.signal, 'abort').length, 0);
});

test('[voice-panel-047] The observer keeps a newer audio factory', (t) => {
  const f = nativeFixture(t, 'gemini'),
    replacement = () => 73;
  f.controller.createAudio = replacement;
  f.observer.destroy();
  assert.equal(f.controller.createAudio === replacement, true);
});

test('[voice-panel-038] A detached audio wrapper cannot notify the current mount', (t) => {
  const f = nativeFixture(t, 'gemini');
  f.controller.audio = f.controller.createAudio({});
  const a = f.controller.audio,
    oldPlay = a.play;
  f.controller.audio = f.controller.createAudio({});
  const before = f.changes.length;
  assert.equal(oldPlay.call(a, 4), 31);
  assert.equal(f.changes.length === before, true);
  assert.equal(f.observer.snapshot().outputBusy, false);
});

for (const [index, active, view] of [
  [0, false, 'preview'],
  [1, true, 'settings'],
]) {
  test(`[voice-panel-050] The stop ticket checks the current state in case ${index}`, (t) => {
    const f = hostFixture(t);
    f.binding.panel.select('settings');
    const ticket = f.binding.stopTicket();
    f.setActive(active);
    if (index === 0) f.binding.panel.select('preview');
    f.binding.closeAfterStop(ticket);
    assert.equal(f.binding.panel.snapshot().view === view, true);
    assert.equal(f.binding.panel.snapshot().panelOpen, true);
    f.setActive(false);
    f.binding.closeAfterStop(f.binding.stopTicket());
    assert.equal(f.binding.panel.snapshot().panelOpen, false);
  });
}

for (const [index, fault] of [
  'panel',
  'enabled',
  'presented',
  'card',
  'disposed',
].entries()) {
  test(`[voice-panel-052] The host rejects an incomplete mount in case ${index}`, (t) => {
    const f = hostFixture(t);
    const ui = { ...f.ui },
      card = { ...f.card };
    if (fault === 'panel') delete ui.voicePanel;
    if (fault === 'enabled') delete card.setEnabled;
    if (fault === 'presented') delete card.setPresented;
    if (fault === 'disposed') f.host.destroy();
    assert.equal(
      f.host.mount({
        ui,
        card: fault === 'card' ? null : card,
        session: f.session,
        observer: f.observer,
      }),
      null,
    );
  });
}

for (const [index, value] of ['7', 7.5, -1, 61].entries()) {
  test(`[voice-panel-053] The operation rejects invalid minutes in case ${index}`, (t) => {
    const f = hostFixture(t, {
        storage: memoryStore({ 'godsEyeView.voice.inactivityMinutes': '18' }),
      }),
      op = f.binding.captureOperation();
    assert.equal(op.isCurrent(), true);
    assert.deepEqual(op.setMinutes(value), {
      ok: false,
      applied: false,
      changed: false,
      persisted: null,
      reason: 'invalid-value',
      minutes: 18,
    });
    assert.equal(op.isCurrent(), true);
    assert.equal(f.host.snapshot().minutes, 18);
  });
}

test('[voice-panel-053] The operation keeps its epoch after its own preference write', (t) => {
  const f = hostFixture(t),
    op = f.binding.captureOperation();
  assert.deepEqual(op.setMinutes(14), {
    ok: true,
    applied: true,
    changed: true,
    persisted: false,
    minutes: 14,
  });
  assert.equal(op.isCurrent(), true);
  const selected = op.show('settings');
  assert.equal(selected.applied, true);
  assert.equal(selected.settingsOpen, true);
  assert.equal(op.isCurrent(), false);
  assert.deepEqual(op.show('preview'), {
    ok: false,
    applied: false,
    cancelled: true,
  });
  assert.deepEqual(op.setMinutes(3), {
    ok: false,
    applied: false,
    cancelled: true,
  });
  assert.equal(f.host.snapshot().minutes, 14);
  const close = f.binding.captureOperation().show('settings', false);
  assert.equal(close.applied, true);
  assert.equal(close.panelOpen, false);
  const invalid = f.binding.captureOperation().show('wrong');
  assert.equal(invalid.applied, false);
  assert.equal(invalid.reason, 'unknown-view');
});

for (const [index, boundary] of [
  { type: 'interruption', reason: 'other' },
  { type: 'state', state: 'connecting' },
  { type: 'state', state: 'idle' },
  { type: 'state', state: 'error' },
].entries()) {
  test(`[voice-panel-053] The session boundary cancels an operation in case ${index}`, (t) => {
    const f = hostFixture(t),
      op = f.binding.captureOperation();
    f.binding.handle(boundary);
    assert.equal(op.isCurrent(), false);
    assert.deepEqual(f.retires, ['session-boundary']);
    assert.deepEqual(op.setMinutes(3), {
      ok: false,
      applied: false,
      cancelled: true,
    });
  });
}

for (const [index, reason] of [
  'user-speech',
  'user-text',
  'push-to-talk',
  'other',
].entries()) {
  test(`[voice-panel-054] The input reason controls automatic preview in case ${index}`, (t) => {
    const f = hostFixture(t);
    f.binding.panel.close();
    f.binding.handle({
      type: 'transcript',
      role: 'assistant',
      text: 'Before',
      final: true,
    });
    assert.equal(f.binding.panel.snapshot().panelOpen, false);
    f.binding.handle({ type: 'interruption', reason });
    f.binding.handle({
      type: 'transcript',
      role: 'assistant',
      text: 'After',
      final: true,
    });
    assert.equal(f.binding.panel.snapshot().panelOpen === index < 3, true);
    assert.equal(f.rearms() === (index < 3 ? 1 : 0), true);
  });
}

for (const [index, inactive] of [false, true].entries()) {
  test(`[voice-panel-054] The host checks session activity in case ${index}`, (t) => {
    const f = hostFixture(t);
    f.setActive(!inactive);
    f.binding.handle({
      type: 'transcript',
      role: 'assistant',
      text: 'Answer',
      final: true,
    });
    assert.equal(f.binding.panel.snapshot().panelOpen === !inactive, true);
    assert.equal(f.cards.length === (inactive ? 0 : 1), true);
  });
}

for (const [index, field] of ['responseId', 'itemId', 'absent'].entries()) {
  test(`[voice-panel-055] The host compares reply identifiers in case ${index}`, (t) => {
    const f = hostFixture(t),
      id = field === 'absent' ? {} : { [field]: 'one' };
    const reply = {
      type: 'transcript',
      role: 'assistant',
      text: 'Final',
      final: true,
      ...id,
    };
    f.binding.handle(reply);
    assert.equal(f.cards.length, 1);
    f.binding.handle({ ...reply });
    assert.equal(f.cards.length, 1);
    if (index < 2) {
      f.binding.handle({ ...reply, text: 'Part', final: false });
      assert.equal(f.cards.length, 1);
      f.binding.handle({ ...reply, [field]: 'two', text: 'Next' });
      assert.equal(f.cards.length, 2);
    } else {
      f.binding.handle({ ...reply, text: 'Part', final: false });
      assert.equal(f.cards.length, 2);
    }
  });
}

test('[voice-panel-057] The advisory interruption keeps the card and manual choice', (t) => {
  const f = hostFixture(t);
  f.binding.panel.close();
  f.binding.handle({
    type: 'interruption',
    reason: 'user-speech',
    preserveAdvisoryCaption: true,
  });
  assert.deepEqual(f.cards, []);
  assert.equal(f.rearms(), 0);
  f.binding.handle({
    type: 'transcript',
    role: 'assistant',
    text: 'Answer',
    final: true,
  });
  assert.equal(f.binding.panel.snapshot().panelOpen, false);
});

test('[voice-panel-056] The default Cockpit reader suppresses automatic preview', (t) => {
  const f = hostFixture(t);
  f.doc.body.classList.add('cockpit-mode');
  f.binding.handle({
    type: 'transcript',
    role: 'assistant',
    text: 'Cockpit',
    final: true,
  });
  assert.equal(f.binding.panel.snapshot().panelOpen, false);
  f.doc.body.classList.remove('cockpit-mode');
  f.binding.handle({
    type: 'transcript',
    role: 'assistant',
    text: 'Globe',
    final: true,
  });
  assert.equal(f.binding.panel.snapshot().panelOpen, true);
});

for (const [index, event] of [
  { type: 'transcript', role: 'user', text: 'User' },
  { type: 'transcript', role: 'assistant', text: '' },
  { type: 'other', role: 'assistant', text: 'Other' },
].entries()) {
  test(`[voice-panel-054] The host rejects automatic preview input in case ${index}`, (t) => {
    const f = hostFixture(t);
    f.binding.handle(event);
    assert.equal(f.binding.panel.snapshot().panelOpen, false);
    assert.deepEqual(f.cards, [event]);
  });
}

test('[voice-panel-058] A retired mount cannot change the current panel', async (t) => {
  const f = hostFixture(t),
    op = f.binding.captureOperation();
  f.binding.handle({ type: 'state', state: 'listening' });
  f.binding.destroy();
  const before = f.events.length;
  f.binding.workChanged();
  f.binding.handle({ type: 'transcript', role: 'assistant', text: 'Late' });
  window.dispatchEvent(new Event('gev:cockpit-mode-changed'));
  await Promise.resolve();
  assert.equal(f.events.length === before, true);
  assert.equal(op.isCurrent(), false);
  assert.equal(f.binding.panel.snapshot().panelOpen, false);
});

test('[voice-panel-058] A disposed session cannot rearm or edit presentation', (t) => {
  const f = hostFixture(t),
    op = f.binding.captureOperation();
  f.session.disposed = true;
  f.binding.handle({ type: 'interruption', reason: 'user-text' });
  f.binding.workChanged();
  assert.equal(op.isCurrent(), false);
  assert.equal(f.rearms(), 0);
  assert.deepEqual(f.cards, []);
});

test('[voice-panel-059] The DOM fixture models attributes and child order', (t) => {
  const doc = installPanelDom(t);
  assert.equal(installPanelDom(t) === doc, true);
  const parent = doc.createElement('section'),
    a = doc.createElement('span'),
    b = doc.createElement('button');
  assert.equal(a.id, '');
  a.id = 'alpha';
  b.id = 'beta';
  assert.equal(a.textContent, '');
  a.textContent = 17;
  assert.equal(a.textContent, '17');
  a.textContent = 'Reply';
  assert.equal(a.textContent, 'Reply');
  assert.equal(a.parentElement === undefined, true);
  assert.equal(a.isConnected, false);
  parent.className = 'alpha  beta';
  assert.equal(parent.className, 'alpha beta');
  parent.setAttribute('hidden', '');
  assert.equal(parent.hidden, true);
  parent.hidden = false;
  parent.setAttribute('value', '17');
  assert.equal(parent.value, '17');
  parent.setAttribute('data-test-value', 'distinct');
  assert.equal(parent.dataset.testValue, 'distinct');
  assert.equal(parent.getAttribute('absent'), null);
  doc.body.append(parent);
  parent.append(a);
  parent.insertBefore(b, a);
  assert.deepEqual(
    parent.children.map((n) => n.id),
    ['beta', 'alpha'],
  );
  assert.equal(b.parentElement === parent, true);
  parent.insertBefore(a, null);
  assert.deepEqual(
    parent.children.map((n) => n.id),
    ['beta', 'alpha'],
  );
  assert.equal(parent.contains(b), true);
  assert.equal(parent.contains(doc.body), false);
  assert.equal(b.checkVisibility(), true);
  parent.hidden = true;
  assert.equal(b.checkVisibility(), false);
  parent.hidden = false;
  b.hidden = true;
  assert.equal(b.checkVisibility(), false);
  b.hidden = false;
  b.remove();
  assert.equal(b.checkVisibility(), false);
  parent.innerHTML =
    '</section><input value="7" disabled><div class="chosen"><span id="nested"></span></div>';
  assert.equal(parent.children[0].value, '7');
  assert.equal(parent.children[0].getAttribute('disabled'), '');
  assert.equal(parent.querySelector('.chosen').tagName, 'DIV');
  assert.equal(parent.querySelector('span').id, 'nested');
  assert.equal(
    doc.querySelector('#nested') === parent.querySelector('span'),
    true,
  );
  assert.equal(parent.querySelector('#absent'), null);
  parent.style.setProperty('color', 'red');
  parent.style.removeProperty('color');
  assert.equal(parent.style.setProperty('x', 'y') === undefined, true);
  parent.replaceChildren(a, b);
  assert.deepEqual(
    parent.children.map((n) => n.id),
    ['alpha', 'beta'],
  );
});

test('[voice-panel-059] The DOM fixture models listener lifetime and event data', (t) => {
  const doc = installPanelDom(t),
    node = doc.createElement('button'),
    calls = [];
  const lifetime = new AbortController();
  function listener(event) {
    calls.push([
      this === node,
      event.type,
      event.target === node,
      event.detail,
    ]);
    event.preventDefault();
  }
  node.addEventListener('click', listener, { signal: lifetime.signal });
  assert.equal(node.fire('click', { detail: 19 }).defaultPrevented, true);
  assert.deepEqual(calls, [[true, 'click', true, 19]]);
  lifetime.abort();
  node.fire('click');
  assert.equal(calls.length, 1);
  node.addEventListener('click', listener, { signal: lifetime.signal });
  node.fire('click');
  assert.equal(calls.length, 1);
  assert.equal(node.fire('unknown').type, 'unknown');
  node.removeEventListener('absent', listener);
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

test('[voice-panel-014] Escape closes an open panel and keeps a closed panel unchanged', (t) => {
  const f = panelFixture(t);
  assert.equal(f.panel.snapshot().panelOpen, false);
  assert.equal(
    f.ui.voicePanel.fire('keydown', { key: 'Escape' }).defaultPrevented ===
      undefined,
    true,
  );
  f.panel.select('settings');
  f.ui.settingsTab.focus();
  assert.equal(
    f.ui.voicePanel.fire('keydown', { key: 'x' }).defaultPrevented ===
      undefined,
    true,
  );
  assert.equal(f.panel.snapshot().settingsOpen, true);
  assert.equal(
    f.ui.voicePanel.fire('keydown', { key: 'Escape' }).defaultPrevented,
    true,
  );
  assert.equal(f.panel.snapshot().panelOpen, false);
  assert.equal(f.doc.activeElement === f.ui.voiceSettingsButton, true);
  f.ui.previewTab.fire('click');
  assert.equal(f.panel.snapshot().view, 'preview');
});

for (const [index, mode] of [
  'throw',
  'noop',
  'mismatch',
  'readthrow',
  'missing',
].entries()) {
  test(`[voice-panel-024] The storage failure keeps live values across controls in case ${index}`, (t) => {
    const doc = installPanelDom(t),
      data = new Map();
    const store =
      mode === 'missing'
        ? null
        : {
            getItem(key) {
              if (mode === 'readthrow') throw Error('read');
              return data.get(key) ?? null;
            },
            setItem(key, value) {
              if (mode === 'throw') throw Error('write');
              if (mode !== 'noop')
                data.set(key, mode === 'mismatch' ? `${value}!` : value);
            },
          };
    const p = createVoicePreferences({ storage: store });
    const controls = () =>
      Object.fromEntries(
        [
          'voicePreviewInput',
          'voicePreviewNote',
          'voiceTimeoutInput',
          'voiceTimeoutSelect',
          'voiceTimeoutNote',
        ].map((key) => [key, doc.createElement('input')]),
      );
    const a = controls(),
      first = bindPreferenceControls({
        ui: a,
        preferences: p,
        copy: controlCopy,
      });
    assert.equal(a.voicePreviewNote.textContent, 'Preview note');
    assert.equal(a.voiceTimeoutNote.textContent, 'Timeout note');
    p.setMinutes(23);
    p.setPreviewEnabled(false);
    assert.equal(a.voicePreviewNote.textContent, 'Preview note Save failed');
    assert.equal(a.voiceTimeoutNote.textContent, 'Timeout note Save failed');
    first.dispose();
    const b = controls(),
      second = bindPreferenceControls({
        ui: b,
        preferences: p,
        copy: controlCopy,
      });
    assert.equal(b.voicePreviewInput.checked, false);
    assert.equal(b.voiceTimeoutInput.value, '23');
    assert.equal(b.voicePreviewNote.textContent, 'Preview note Save failed');
    assert.equal(b.voiceTimeoutNote.textContent, 'Timeout note Save failed');
    second.dispose();
  });
}

test('[voice-panel-029] A custom preference source can call its listener after disposal', (t) => {
  const doc = installPanelDom(t),
    input = doc.createElement('input');
  let listener;
  const fake = {
    snapshot: () => ({ minutes: 18, previewEnabled: false }),
    subscribe(fn) {
      listener = fn;
      return () => {};
    },
  };
  const b = bindPreferenceControls({
    ui: { voiceTimeoutInput: input },
    preferences: fake,
    copy: controlCopy,
  });
  assert.equal(input.value, '18');
  b.dispose();
  listener({ minutes: 27, previewEnabled: true });
  assert.equal(input.value, '18');
});

test('[voice-panel-044] The text wrapper isolates a failed input observer', (t) => {
  const f = nativeFixture(
    t,
    'gemini',
    {},
    {
      onInput() {
        throw Error('input observer');
      },
    },
  );
  assert.equal(f.controller.sendTextCommand('accepted'), 37);
});

test('[voice-panel-049] The host retires a previous mount before its replacement', (t) => {
  const f = hostFixture(t);
  f.binding.panel.select('settings');
  const next = f.host.mount({
    ui: f.ui,
    card: f.card,
    session: f.session,
    observer: f.observer,
  });
  assert.notEqual(next, f.binding);
  assert.equal(f.binding.panel.snapshot().panelOpen, false);
  assert.equal(next.panel.snapshot().settingsOpen, true);
  assert.equal(f.events.filter((e) => e === 'dispose').length, 1);
});

test('[voice-panel-058] The host destroys a mount with an aborted session signal', (t) => {
  const f = hostFixture(t);
  f.binding.destroy();
  f.lifetime.abort();
  const b = f.host.mount({
    ui: f.ui,
    card: f.card,
    session: f.session,
    observer: f.observer,
  });
  assert.equal(b.panel.snapshot().panelOpen, false);
  assert.equal(b.captureOperation().isCurrent(), false);
});

test('[voice-panel-058] The host ignores a preference notice after ownership ends', (t) => {
  let session;
  const f = hostFixture(t, {
    storage: {
      getItem: () => null,
      setItem() {
        session.disposed = true;
      },
    },
  });
  session = f.session;
  const before = f.events.length;
  const result = f.binding.captureOperation().setMinutes(13);
  assert.equal(result.minutes, 13);
  assert.equal(result.applied, true);
  assert.equal(f.events.length === before, true);
});

test('[voice-panel-058] The inactivity callback cannot stop a disposed session', (t) => {
  const f = hostFixture(t, {
    nativeProvider: 'gemini',
    controller: { input: {} },
  });
  f.binding.handle({ type: 'state', state: 'listening' });
  assert.equal(f.binding.snapshot().inactivity.eligible, true);
  f.session.disposed = true;
  f.clock.advance(300000);
  assert.equal(f.stopped(), 0);
});

test('[voice-panel-054] The native input edge rearms automatic preview once', (t) => {
  const controller = { input: {}, userActivityOpen: false, handleMessage() {} };
  const f = hostFixture(t, { nativeProvider: 'gemini', controller });
  f.binding.panel.close();
  controller.handleMessage();
  assert.equal(f.rearms(), 0);
  controller.userActivityOpen = true;
  controller.handleMessage();
  assert.equal(f.rearms(), 1);
  controller.handleMessage();
  assert.equal(f.rearms(), 1);
  f.binding.handle({
    type: 'transcript',
    role: 'assistant',
    text: 'Fresh',
    final: true,
  });
  assert.equal(f.binding.panel.snapshot().panelOpen, true);
  f.setActive(false);
  controller.userActivityOpen = false;
  controller.handleMessage();
  controller.userActivityOpen = true;
  controller.handleMessage();
  assert.equal(f.rearms(), 1);
});

test('[voice-panel-008] The owner supplies a string retirement reason for each action', async () => {
  let resolve;
  const p = new Promise((yes) => {
      resolve = yes;
    }),
    events = [];
  const o = createPanelActionObserver({
    runAction: () => p,
    onObservation: (e) => events.push(e),
  });
  const a = o.runAction('a');
  o.retire('manual-retired');
  assert.equal(events.at(-1).reason, 'manual-retired');
  assert.equal(events.at(-1).pendingCount, 0);
  resolve(15);
  assert.equal(await a, 15);
});

for (const [index, kind] of [
  'absent',
  'enumerable',
  'hidden',
  'null-prototype',
].entries()) {
  test(`[voice-panel-005 voice-panel-011] The progress descriptor uses its own flag in case ${index}`, () => {
    const options = kind === 'null-prototype' ? Object.create(null) : {};
    if (kind === 'enumerable' || kind === 'hidden')
      Object.defineProperty(options, 'progress', {
        enumerable: kind === 'enumerable',
        value: () => 17,
      });
    const events = [];
    let received;
    const o = createPanelActionObserver({
      onObservation: (e) => events.push(e),
      runAction(name, args, opts) {
        received = opts;
        assert.equal(Object.hasOwn(opts, 'progress'), true);
        assert.equal(
          Object.getOwnPropertyDescriptor(opts, 'progress').enumerable ===
            (kind !== 'hidden'),
          true,
        );
        opts.progress({ step: 'descriptor', label: 'Data' });
        return 11;
      },
    });
    assert.equal(o.runAction('copy', {}, options), 11);
    assert.notEqual(received, options);
    assert.equal(
      Object.getPrototypeOf(received) ===
        (kind === 'null-prototype' ? null : Object.prototype),
      true,
    );
    assert.deepEqual(
      events.filter((e) => e.type === 'progress').map((e) => [e.step, e.label]),
      [['descriptor', 'Data']],
    );
  });
}

for (const [index, output, known] of [
  [0, [], true],
  [1, [{ type: 'message', content: [{ type: 'audio' }] }], false],
  [2, undefined, false],
]) {
  test(`[voice-panel-048] The live transport keeps response evidence through recovery in case ${index}`, (t) => {
    const f = nativeFixture(t);
    f.controller.dc = { readyState: 'open' };
    f.controller.status = 'listening';
    f.observer.handle({ type: 'state', state: 'listening' });
    f.turns.observeSpeech({ type: 'response.created', response_id: 'failed' });
    f.turns.observeSpeech({
      type: 'response.done',
      response_id: 'failed',
      response: { status: 'failed', output },
    });
    assert.equal(f.observer.snapshot().known === known, true);
    f.observer.handle({ type: 'state', state: 'error' });
    assert.equal(f.observer.snapshot().known === known, true);
    assert.equal(f.observer.snapshot().connected, false);
    f.observer.handle({ type: 'state', state: 'listening' });
    assert.equal(f.observer.snapshot().known === known, true);
    assert.equal(f.observer.snapshot().connected, true);
    f.observer.handle({ type: 'state', state: 'error' });
    f.controller.dc = null;
    f.controller.status = 'connecting';
    f.observer.handle({ type: 'state', state: 'connecting' });
    assert.equal(f.observer.snapshot().known, true);
    assert.equal(f.observer.snapshot().connected, false);
  });
}

for (const [index, part] of ['text', 'output_text', 'refusal'].entries()) {
  test(`[voice-panel-045] The silent output accepts one part type in case ${index}`, (t) => {
    const f = nativeFixture(t);
    f.turns.observeSpeech({ type: 'response.created', response_id: 'one' });
    f.turns.observeSpeech({
      type: 'response.done',
      response_id: 'one',
      response: {
        status: 'completed',
        output: [{ type: 'message', content: [{ type: part }] }],
      },
    });
    assert.equal(f.observer.snapshot().known, true);
  });
}

for (const [index, state] of [
  'idle',
  'connecting',
  'error',
  'listening',
].entries()) {
  test(`[voice-panel-042] The initial native status controls output knowledge in case ${index}`, (t) => {
    const f = nativeFixture(t, 'openai', { status: state });
    assert.equal(f.observer.snapshot().known === index < 3, true);
  });
}

test('[voice-panel-043] The Gemini user turn flag does not report generation work', (t) => {
  const f = nativeFixture(t, 'gemini');
  f.controller.userTurnPending = true;
  assert.equal(f.observer.snapshot().generationBusy, false);
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

test('[voice-panel-028] Each listener receives a separate complete snapshot', () => {
  const p = createVoicePreferences({ storage: null }),
    first = [],
    second = [];
  p.subscribe((s) => {
    first.push({ ...s });
    s.minutes = 99;
  });
  const stop = p.subscribe((s) => second.push(s));
  p.setMinutes(17);
  p.setPreviewEnabled(false);
  stop();
  p.setMinutes(29);
  assert.deepEqual(first, [
    {
      minutes: 17,
      previewEnabled: true,
      timeoutPersisted: false,
      previewPersisted: null,
    },
    {
      minutes: 17,
      previewEnabled: false,
      timeoutPersisted: false,
      previewPersisted: false,
    },
    {
      minutes: 29,
      previewEnabled: false,
      timeoutPersisted: false,
      previewPersisted: false,
    },
  ]);
  assert.deepEqual(second, [
    {
      minutes: 17,
      previewEnabled: true,
      timeoutPersisted: false,
      previewPersisted: null,
    },
    {
      minutes: 17,
      previewEnabled: false,
      timeoutPersisted: false,
      previewPersisted: false,
    },
  ]);
});

test('[voice-panel-059] The DOM fixture updates every class, child and listener', (t) => {
  const doc = installPanelDom(t),
    p = doc.createElement('div'),
    a = doc.createElement('span'),
    b = doc.createElement('button');
  p.classList.add('first', 'second');
  assert.equal(p.classList.contains('first'), true);
  assert.equal(p.classList.contains('second'), true);
  p.classList.remove('first', 'second');
  assert.equal(p.className, '');
  p.append(a, b);
  p.replaceChildren();
  assert.equal(a.parentElement, null);
  assert.equal(b.parentElement, null);
  const seen = [];
  p.addEventListener('event', () => seen.push('one'));
  p.addEventListener('event', () => seen.push('two'));
  p.fire('event');
  assert.deepEqual(seen, ['one', 'two']);
  const detached = doc.createElement('aside');
  detached.parentNode = { isConnected: true, checkVisibility: () => false };
  assert.equal(detached.checkVisibility(), false);
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

test('[voice-panel-009] An action without options keeps its argument length', () => {
  const calls = [],
    o = createPanelActionObserver({
      runAction(...args) {
        calls.push(args);
        return 21;
      },
    });
  assert.equal(o.runAction('short', 'body'), 21);
  assert.equal(o.runAction('long', 'other', undefined), 21);
  assert.deepEqual(calls, [
    ['short', 'body'],
    ['long', 'other', undefined],
  ]);
});

for (const [index, value] of [0, 'false', null].entries()) {
  test(`[voice-panel-023] The model rejects a nonboolean preview value in case ${index}`, () => {
    const store = memoryStore(),
      p = createVoicePreferences({ storage: store });
    let notices = 0;
    p.subscribe(() => notices++);
    assert.deepEqual(p.setPreviewEnabled(value), {
      ok: false,
      applied: false,
      changed: false,
      persisted: null,
      reason: 'invalid-value',
      minutes: 5,
      previewEnabled: true,
      previewPersisted: null,
      timeoutPersisted: null,
    });
    assert.deepEqual(store.writes, []);
    assert.equal(notices, 0);
  });
}

test('[voice-panel-025] A recovered store saves unchanged values and removes both warnings', (t) => {
  const doc = installPanelDom(t),
    store = memoryStore(),
    save = store.setItem;
  store.setItem = () => {
    throw Error('storage');
  };
  const p = createVoicePreferences({ storage: store }),
    ui = {
      voicePreviewNote: doc.createElement('p'),
      voiceTimeoutNote: doc.createElement('p'),
    };
  const b = bindPreferenceControls({ ui, preferences: p, copy: controlCopy });
  p.setPreviewEnabled(false);
  p.setMinutes(18);
  assert.equal(ui.voicePreviewNote.textContent, 'Preview note Save failed');
  assert.equal(ui.voiceTimeoutNote.textContent, 'Timeout note Save failed');
  store.setItem = save;
  const preview = p.setPreviewEnabled(false),
    timeout = p.setMinutes(18);
  assert.equal(preview.changed, false);
  assert.equal(timeout.changed, false);
  assert.equal(preview.persisted, true);
  assert.equal(timeout.persisted, true);
  assert.deepEqual(store.writes, [
    ['godsEyeView.voice.previewEnabled', 'false'],
    ['godsEyeView.voice.inactivityMinutes', '18'],
  ]);
  assert.equal(ui.voicePreviewNote.textContent, 'Preview note');
  assert.equal(ui.voiceTimeoutNote.textContent, 'Timeout note');
  b.dispose();
});

test('[voice-panel-032 voice-panel-065] The timer accepts both minute bounds', (t) => {
  const f = idleFixture(t);
  assert.equal(f.idle.setMinutes(0), true);
  assert.equal(f.idle.snapshot().deadline, null);
  assert.equal(f.timers.size, 0);
  assert.equal(f.idle.setMinutes(60), true);
  assert.equal(f.idle.snapshot().deadline, 3601700);
  assert.equal([...f.timers.values()][0].delay, 3600000);
});

test('[voice-panel-042] A data channel prevents clean initial output knowledge', (t) => {
  const f = nativeFixture(t, 'openai', { dc: {} });
  assert.equal(f.observer.snapshot().known, false);
});

test('[voice-panel-046] The response table accepts exactly 64 silent replies', (t) => {
  const f = nativeFixture(t);
  for (let i = 0; i < 64; i++)
    f.turns.observeSpeech({ type: 'response.created', response_id: `r${i}` });
  for (let i = 0; i < 64; i++) {
    f.turns.observeSpeech({
      type: 'response.done',
      response_id: `r${i}`,
      response: { status: 'completed', output: [] },
    });
    assert.equal(f.observer.snapshot().known === (i === 63), true);
  }
});

test('[voice-panel-054 voice-panel-058] A disposed session cannot rearm through native text', (t) => {
  const f = hostFixture(t, {
    nativeProvider: 'gemini',
    controller: { input: {}, sendTextCommand: () => 17 },
  });
  f.binding.panel.close();
  f.session.disposed = true;
  assert.equal(f.session.adapter.controller.sendTextCommand('late'), 17);
  assert.equal(f.rearms(), 0);
});

test('[voice-panel-058] A teardown callback cannot use the retired operation', (t) => {
  const f = hostFixture(t),
    op = f.binding.captureOperation(),
    original = f.card.setPresented;
  const current = [];
  f.card.setPresented = (value) => {
    current.push(op.isCurrent());
    original(value);
  };
  f.binding.destroy();
  assert.deepEqual(current, [false]);
});

test('[voice-panel-058] A reentrant mount cannot own a disposed host', (t) => {
  const f = hostFixture(t),
    original = f.card.setPresented;
  let replacement;
  f.card.setPresented = (value) => {
    original(value);
    f.card.setPresented = original;
    replacement = f.host.mount({
      ui: f.ui,
      card: f.card,
      session: f.session,
      observer: f.observer,
    });
  };
  f.host.destroy();
  assert.equal(replacement.captureOperation().isCurrent(), false);
  replacement.destroy();
});

test('[voice-panel-050] A stop ticket cannot close a disposed session panel', (t) => {
  const f = hostFixture(t);
  f.binding.panel.select('settings');
  f.setActive(false);
  f.session.disposed = true;
  f.binding.closeAfterStop(f.binding.stopTicket());
  assert.equal(f.binding.panel.snapshot().settingsOpen, true);
});

test('[voice-panel-054] An inactive state event reaches the card', (t) => {
  const f = hostFixture(t);
  f.setActive(false);
  const event = { type: 'state', state: 'idle' };
  f.binding.handle(event);
  assert.deepEqual(f.cards, [event]);
  assert.deepEqual(f.retires, ['session-boundary']);
});

test('[voice-panel-054] A state field on another event cannot disable automatic preview', (t) => {
  const f = hostFixture(t),
    op = f.binding.captureOperation();
  f.binding.handle({ type: 'other', state: 'idle' });
  assert.equal(op.isCurrent(), true);
  assert.deepEqual(f.retires, []);
  f.binding.handle({
    type: 'transcript',
    role: 'assistant',
    text: 'Fresh',
    final: true,
  });
  assert.equal(f.binding.panel.snapshot().panelOpen, true);
});

test('[voice-panel-054] A normal state event keeps automatic preview enabled', (t) => {
  const f = hostFixture(t),
    op = f.binding.captureOperation();
  f.binding.handle({ type: 'state', state: 'listening' });
  assert.equal(op.isCurrent(), true);
  assert.deepEqual(f.retires, []);
  f.binding.handle({
    type: 'transcript',
    role: 'assistant',
    text: 'Fresh',
    final: true,
  });
  assert.equal(f.binding.panel.snapshot().panelOpen, true);
});

test('[voice-panel-055] The host selects the response id before the item id', (t) => {
  const f = hostFixture(t);
  f.binding.handle({
    type: 'transcript',
    role: 'assistant',
    text: 'Final',
    final: true,
    responseId: 'response',
    itemId: 'first-item',
  });
  f.binding.handle({
    type: 'transcript',
    role: 'assistant',
    text: 'Partial',
    final: false,
    responseId: 'response',
    itemId: 'next-item',
  });
  assert.equal(f.cards.length, 1);
  assert.equal(f.cards[0].text, 'Final');
});

test('[voice-panel-055] A new final text or a different id reaches the card', (t) => {
  const f = hostFixture(t),
    reply = (text, final, responseId) =>
      f.binding.handle({
        type: 'transcript',
        role: 'assistant',
        text,
        final,
        responseId,
      });
  reply('First', true, 'one');
  reply('Changed', true, 'one');
  reply('No id', true);
  reply('Known again', true, 'two');
  reply('No id part', false);
  assert.deepEqual(
    f.cards.map((e) => e.text),
    ['First', 'Changed', 'No id', 'Known again', 'No id part'],
  );
});

for (const [index, raw] of [1, 'true', null, undefined].entries()) {
  test(`[voice-panel-016] The preview reader accepts only true in case ${index}`, (t) => {
    const f = panelFixture(t, { getPreviewEnabled: () => raw });
    f.panel.select('preview');
    assert.equal(f.panel.snapshot().previewEnabled, false);
    assert.equal(f.panel.snapshot().previewVisible, false);
    assert.equal(f.ui.previewEmpty.textContent, 'Disabled reply');
  });
}

test('[voice-panel-006] The accessor options keep their own getter and object identity', () => {
  let reads = 0;
  const options = {
    get extra() {
      reads++;
      return 41;
    },
  };
  const o = createPanelActionObserver({
    runAction(name, args, opts) {
      assert.equal(opts === options, true);
      assert.equal(opts.extra, 41);
      return 31;
    },
  });
  assert.equal(o.runAction('getter', {}, options), 31);
  assert.equal(reads, 1);
});

for (const [index, provider] of ['openai', 'gemini', null].entries()) {
  test(`[voice-panel-068] The host reports inactivity support in case ${index}`, (t) => {
    const f = hostFixture(t, {
      nativeProvider: provider,
      controller: {
        _turns: {},
        _input: {},
        input: {},
        status: 'idle',
        dc: null,
      },
    });
    assert.equal(
      f.ui.voiceTimeoutStatus.textContent ===
        (index < 2
          ? ''
          : 'Automatic stop is unavailable for this voice connection.'),
      true,
    );
  });
}

test('[voice-panel-054] A reason on another event cannot rearm automatic preview', (t) => {
  const f = hostFixture(t);
  f.binding.panel.close();
  f.binding.handle({ type: 'other', reason: 'user-text' });
  assert.equal(f.rearms(), 0);
  f.binding.handle({
    type: 'transcript',
    role: 'assistant',
    text: 'Answer',
    final: true,
  });
  assert.equal(f.binding.panel.snapshot().panelOpen, false);
});

test('[voice-panel-055] The same text with a new id reaches the card', (t) => {
  const f = hostFixture(t),
    reply = (responseId, final = true) =>
      f.binding.handle({
        type: 'transcript',
        role: 'assistant',
        text: 'Same',
        responseId,
        final,
      });
  reply('first');
  reply('second');
  reply(undefined);
  reply(undefined, false);
  assert.deepEqual(
    f.cards.map((e) => [e.responseId, e.final]),
    [
      ['first', true],
      ['second', true],
      [undefined, true],
      [undefined, false],
    ],
  );
});

test('[voice-panel-056] A disabled preference alone prevents automatic preview', (t) => {
  const f = hostFixture(t);
  f.ui.voicePreviewInput.checked = false;
  f.ui.voicePreviewInput.fire('change');
  f.binding.handle({
    type: 'transcript',
    role: 'assistant',
    text: 'Answer',
    final: true,
  });
  assert.equal(f.binding.panel.snapshot().panelOpen, false);
  assert.equal(f.host.snapshot().previewEnabled, false);
});

test('[voice-panel-069] The advisory flag on another event does not hide it from the card', (t) => {
  const f = hostFixture(t),
    event = { type: 'other', preserveAdvisoryCaption: true };
  f.binding.handle(event);
  assert.deepEqual(f.cards, [event]);
  const ordinary = {
    type: 'interruption',
    reason: 'other',
    preserveAdvisoryCaption: false,
  };
  f.binding.handle(ordinary);
  assert.deepEqual(f.cards, [event, ordinary]);
});

test('[voice-panel-034] An activity reader can destroy the timer before it arms again', (t) => {
  let f,
    retire = false;
  f = idleFixture(t, {
    readActivity() {
      if (retire) f.idle.destroy();
      return { known: true, connected: true };
    },
  });
  retire = true;
  f.idle.update({ activity: true });
  assert.equal(f.idle.snapshot().disposed, true);
  assert.equal(f.idle.snapshot().deadline, null);
  assert.equal(f.timers.size, 0);
});

for (const [index, mode] of [
  'closed',
  'settings',
  'cockpit',
  'disabled',
  'hidden',
  'detached',
  'invisible',
  'visible',
].entries()) {
  test(`[voice-panel-020] The preview snapshot checks each visibility condition in case ${index}`, (t) => {
    let cockpit = mode === 'cockpit';
    const presented = [];
    const f = panelFixture(t, {
      card: { setPresented: (value) => presented.push(value) },
      getCockpitActive: () => cockpit,
      getPreviewEnabled: () => mode !== 'disabled',
    });
    f.doc.body.append(f.ui.card);
    if (mode === 'closed') assert.equal(f.panel.snapshot().view, 'preview');
    if (mode !== 'closed')
      f.panel.select(mode === 'settings' ? 'settings' : 'preview');
    assert.equal(
      presented.at(-1) === !['closed', 'settings', 'cockpit'].includes(mode),
      true,
    );
    f.ui.card.hidden = mode === 'hidden';
    if (mode === 'detached') f.ui.card.remove();
    if (mode === 'invisible') f.ui.card.checkVisibility = () => false;
    assert.equal(
      f.panel.snapshot().previewVisible === (mode === 'visible'),
      true,
    );
    assert.equal(f.panel.snapshot().panelOpen === (mode !== 'closed'), true);
    assert.equal(
      f.panel.snapshot().settingsOpen === (mode === 'settings'),
      true,
    );
    assert.equal(
      f.panel.snapshot().previewEnabled === (mode !== 'disabled'),
      true,
    );
    assert.equal(
      f.ui.voicePanel.hidden === (mode === 'closed' || mode === 'cockpit'),
      true,
    );
    assert.equal(
      f.ui.previewPanel.hidden ===
        ['closed', 'settings', 'cockpit'].includes(mode),
      true,
    );
    assert.equal(
      f.ui.voiceSettingsPanel.hidden === (mode !== 'settings'),
      true,
    );
    assert.equal(
      f.ui.voiceSettingsButton.getAttribute('aria-expanded'),
      mode === 'settings' ? 'true' : 'false',
    );
    if (mode === 'cockpit') {
      assert.equal(f.ui.voicePanel.hidden, true);
      f.panel.select('settings');
      assert.equal(f.ui.voicePanel.hidden, false);
      assert.equal(f.ui.voiceSettingsPanel.hidden, false);
      assert.equal(f.ui.previewPanel.hidden, true);
      cockpit = false;
      f.panel.select('preview');
      assert.equal(f.ui.voicePanel.hidden, false);
    }
  });
}

test('[voice-panel-020] A missing visibility method does not prevent focus', (t) => {
  const f = panelFixture(t);
  Object.defineProperty(f.ui.settingsTab, 'isConnected', { value: undefined });
  f.ui.settingsTab.checkVisibility = undefined;
  f.panel.select('settings', { focus: true });
  assert.equal(f.doc.activeElement === f.ui.settingsTab, true);
});

test('[voice-panel-020] A panel without tabs accepts a focus request', (t) => {
  const doc = installPanelDom(t),
    node = doc.createElement('section');
  doc.body.append(node);
  const p = createManualVoicePanel({
    ui: { voicePanel: node },
    getPreviewEnabled: () => true,
    copy: { previewEmpty: 'Empty', previewDisabled: 'Off' },
  });
  assert.equal(p.select('preview', { focus: true }).panelOpen, true);
  assert.equal(doc.activeElement === doc.body, true);
  p.destroy();
});

for (const [index, key] of [
  'voicePreviewInput',
  'voiceTimeoutSelect',
  'voiceTimeoutInput',
].entries()) {
  test(`[voice-panel-029] The binder removes its control listener in case ${index}`, (t) => {
    const doc = installPanelDom(t),
      element = doc.createElement('input'),
      p = createVoicePreferences({ storage: null });
    const b = bindPreferenceControls({
      ui: { [key]: element },
      preferences: p,
      copy: controlCopy,
    });
    assert.equal(element.listeners.get('change').size, 1);
    b.dispose();
    assert.equal(element.listeners.get('change').size, 0);
  });
}

test('[voice-panel-034] An old timer cannot expire after a quiet successor starts', (t) => {
  const f = idleFixture(t),
    old = f.timers.get(1).fn;
  f.pending(1);
  f.idle.update();
  assert.equal(f.timers.size, 0);
  f.pending(0);
  f.idle.update();
  assert.equal(f.timers.size, 1);
  old();
  assert.equal(f.expired(), 0);
  assert.equal(f.timers.size, 1);
  assert.equal(f.idle.snapshot().deadline, 301700);
});

for (const [index, view] of ['preview', 'settings'].entries()) {
  test(`[voice-panel-017] A reentrant card cannot reopen a disposed snapshot in case ${index}`, (t) => {
    const f = panelFixture(t),
      original = f.card.setPresented;
    let reenter = true;
    f.card.setPresented = (value) => {
      original(value);
      if (!value && reenter) {
        reenter = false;
        f.panel.select(view);
      }
    };
    f.panel.destroy();
    assert.equal(f.panel.snapshot().panelOpen, false);
    assert.equal(f.panel.snapshot().settingsOpen, false);
    assert.equal(f.panel.snapshot().previewVisible, false);
  });
}

test('[voice-panel-053] The operation cannot coerce a custom numeric object', (t) => {
  const f = hostFixture(t);
  let calls = 0;
  const value = {
    [Symbol.toPrimitive]() {
      calls++;
      return 17;
    },
  };
  assert.deepEqual(f.binding.captureOperation().setMinutes(value), {
    ok: false,
    applied: false,
    changed: false,
    persisted: null,
    reason: 'invalid-value',
    minutes: 5,
  });
  assert.equal(calls, 0);
});

test('[voice-panel-015] A visible sync and a close keep unrelated focus unchanged', (t) => {
  const f = panelFixture(t);
  f.panel.select('preview');
  f.ui.card.focus();
  f.panel.sync();
  assert.equal(f.doc.activeElement === f.ui.card, true);
  f.doc.body.focus();
  f.panel.close();
  assert.equal(f.doc.activeElement === f.doc.body, true);
});

for (const [index, view] of ['preview', 'settings'].entries()) {
  test(`[voice-panel-015] A view change transfers focus from the old pane in case ${index}`, (t) => {
    const f = panelFixture(t);
    f.panel.select(view);
    const pane =
      view === 'preview' ? f.ui.previewPanel : f.ui.voiceSettingsPanel;
    pane.focus();
    f.panel.select(view);
    assert.equal(f.doc.activeElement === pane, true);
    f.panel.select(view === 'preview' ? 'settings' : 'preview');
    assert.equal(
      f.doc.activeElement ===
        (view === 'preview' ? f.ui.settingsTab : f.ui.previewTab),
      true,
    );
  });
  test(`[voice-panel-013] A closed view hides both panes in case ${index}`, (t) => {
    const f = panelFixture(t);
    f.panel.select(view);
    f.panel.close();
    assert.equal(f.panel.snapshot().settingsOpen, false);
    assert.equal(f.ui.voicePanel.hidden, true);
    assert.equal(f.ui.previewPanel.hidden, true);
    assert.equal(f.ui.voiceSettingsPanel.hidden, true);
    assert.equal(
      f.ui.voiceSettingsButton.getAttribute('aria-expanded'),
      'false',
    );
  });
}

test('[voice-panel-020] A hidden panel cannot focus an independently visible tab', (t) => {
  const f = panelFixture(t, { getCockpitActive: () => true });
  f.ui.previewTab.checkVisibility = () => true;
  f.doc.body.focus();
  f.panel.select('preview', { focus: true });
  assert.equal(f.doc.activeElement === f.doc.body, true);
});

test('[voice-panel-020] An absent card keeps the empty preview visible', (t) => {
  const doc = installPanelDom(t),
    node = doc.createElement('section'),
    empty = doc.createElement('p');
  doc.body.append(node);
  node.append(empty);
  const p = createManualVoicePanel({
    ui: { voicePanel: node, previewEmpty: empty },
    getPreviewEnabled: () => true,
    copy: { previewEmpty: 'Empty', previewDisabled: 'Off' },
  });
  assert.equal(p.select('preview').previewVisible, false);
  assert.equal(empty.hidden, false);
  assert.equal(empty.textContent, 'Empty');
  p.destroy();
});

test('[voice-panel-013] The settings button toggles a closed settings view and replaces Preview', (t) => {
  const f = panelFixture(t);
  for (let i = 0; i < 3; i++) {
    f.ui.voiceSettingsButton.fire('click');
    assert.equal(f.panel.snapshot().settingsOpen, true);
    f.ui.voiceSettingsButton.fire('click');
    assert.equal(f.panel.snapshot().panelOpen, false);
  }
  f.panel.select('preview');
  f.ui.voiceSettingsButton.fire('click');
  assert.equal(f.panel.snapshot().settingsOpen, true);
});

for (const [index, provider] of ['openai', 'gemini'].entries()) {
  test(`[voice-panel-036] The native input owner uses a distinct held flag in case ${index}`, (t) => {
    const mine = { pushToTalkKeyHeld: false },
      other = { pushToTalkKeyHeld: true };
    const f = nativeFixture(t, provider, {
      _input: provider === 'openai' ? mine : other,
      input: provider === 'gemini' ? mine : other,
    });
    assert.equal(f.observer.snapshot().held, false);
    mine.pushToTalkKeyHeld = true;
    other.pushToTalkKeyHeld = false;
    assert.equal(f.observer.snapshot().held, true);
    mine.pushToTalkKeyHeld = false;
    other.pushToTalkKeyHeld = true;
    assert.equal(f.observer.snapshot().held, false);
  });
}

for (const [index, output] of [
  undefined,
  {},
  {
    every() {
      throw Error('not an array');
    },
  },
  [{ type: 'other', content: [] }],
  [
    {
      type: 'message',
      content: {
        every() {
          throw Error('not an array');
        },
      },
    },
  ],
].entries()) {
  test(`[voice-panel-045 voice-panel-070] The output guard still sends an activity notice in case ${index}`, (t) => {
    const f = nativeFixture(t);
    f.turns.observeSpeech({ type: 'response.created', response_id: 'one' });
    const before = f.changes.length;
    f.turns.observeSpeech({
      type: 'response.done',
      response_id: 'one',
      response: { status: 'completed', output },
    });
    assert.equal(f.changes.length, before + 1);
    assert.equal(f.observer.snapshot().known, false);
  });
}

for (const [index, event] of [
  { type: 'response.output_audio.delta', response_id: 'unknown' },
  {
    type: 'response.done',
    response_id: 'unknown',
    response: { status: 'completed', output: [] },
  },
  { type: 'response.done', response_id: 'unknown' },
].entries()) {
  test(`[voice-panel-070] An untracked event still sends an activity notice in case ${index}`, (t) => {
    const f = nativeFixture(t),
      before = f.changes.length;
    f.turns.observeSpeech(event);
    assert.equal(f.changes.length, before + 1);
    assert.deepEqual(Object.keys(f.changes.at(-1)), [
      'known',
      'connected',
      'held',
      'inputBusy',
      'outputBusy',
      'generationBusy',
    ]);
  });
}

test('[voice-panel-046] An event without completion cannot settle an unresolved response', (t) => {
  const f = nativeFixture(t);
  f.turns.observeSpeech({ type: 'response.created', response_id: 'one' });
  f.turns.observeSpeech({
    type: 'other',
    response_id: 'one',
    response: { status: 'completed', output: [] },
  });
  assert.equal(f.observer.snapshot().known, false);
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

test('[voice-panel-047] A retired observer does not inspect native state events', (t) => {
  const f = nativeFixture(t);
  f.observer.handle({ type: 'state', state: 'listening' });
  assert.equal(f.observer.snapshot().connected, true);
  f.observer.destroy();
  assert.equal(f.observer.snapshot().connected, false);
  Object.defineProperty(f.controller, '_turns', {
    get() {
      throw Error('retired');
    },
  });
  assert.doesNotThrow(() =>
    f.observer.handle({ type: 'state', state: 'idle' }),
  );
});

test('[voice-panel-043] The OpenAI input state ignores the Gemini input field', (t) => {
  const f = nativeFixture(t, 'openai', { userActivityOpen: true });
  assert.equal(f.observer.snapshot().inputBusy, false);
});

for (const [index, field] of [
  'replyPending',
  'retiredReplyPending',
  'deferredInput',
  'automaticTurnOpen',
  'pendingTools',
  'controlQueue',
].entries()) {
  test(`[voice-panel-043] The OpenAI work state ignores a Gemini field in case ${index}`, (t) => {
    const f = nativeFixture(t);
    f.turns[field] = field === 'controlQueue' ? [13] : true;
    assert.equal(f.observer.snapshot().generationBusy, false);
  });
}

test('[voice-panel-037] The output state checks ownership of the audio object', (t) => {
  const f = nativeFixture(t, 'gemini');
  f.controller.audio = f.controller.createAudio({});
  f.controller.audio.play(2);
  assert.equal(f.observer.snapshot().outputBusy, true);
  const current = f.controller.audio;
  f.controller.audio = { pending: 7 };
  assert.equal(f.observer.snapshot().outputBusy, false);
  f.controller.audio = current;
  assert.equal(f.observer.snapshot().outputBusy, true);
});

test('[voice-panel-037] A null audio owner reports no output', (t) => {
  const f = nativeFixture(t, 'gemini', { audio: null });
  assert.equal(f.observer.snapshot().outputBusy, false);
});

test('[voice-panel-070] A state boundary retires the method callback', (t) => {
  let observer;
  const f = nativeFixture(t, 'gemini', {
    input: {
      setMicrophoneEnabled(value) {
        assert.equal(value, 17);
        observer.handle({ type: 'state', state: 'idle' });
        return 39;
      },
    },
  });
  observer = f.observer;
  assert.equal(f.controller.input.setMicrophoneEnabled(17), 39);
  assert.equal(f.changes.length, 1);
});

for (const [index, state] of ['error', 'connecting'].entries()) {
  test(`[voice-panel-047] A session boundary retires current audio in case ${index}`, (t) => {
    const f = nativeFixture(t, 'gemini', {
      dc: { readyState: 'open' },
      captureOwner: { admitted: true },
    });
    f.controller.audio = f.controller.createAudio({ pushToTalk: true });
    f.observer.handle({ type: 'state', state: 'listening' });
    const audio = f.controller.audio,
      wrapped = audio.play;
    f.callbacks[0].onAudioStart();
    audio.play(2);
    assert.equal(f.observer.snapshot().inputBusy, true);
    assert.equal(f.observer.snapshot().outputBusy, true);
    f.observer.handle({ type: 'state', state });
    assert.equal(f.observer.snapshot().inputBusy, false);
    assert.equal(f.observer.snapshot().outputBusy, false);
    assert.notEqual(audio.play, wrapped);
  });
}

test('[voice-panel-046] Repeated start phases cannot erase an unresolved response', (t) => {
  const f = nativeFixture(t, 'openai', {
    dc: { readyState: 'open' },
    status: 'connecting',
  });
  f.observer.handle({ type: 'state', state: 'connecting' });
  f.turns.observeSpeech({
    type: 'response.created',
    response_id: 'unresolved',
  });
  f.controller.dc = null;
  f.observer.handle({ type: 'state', state: 'connecting' });
  assert.equal(f.observer.snapshot().known, false);
});

test('[voice-panel-046] A response without an id cannot establish silent output', (t) => {
  const f = nativeFixture(t);
  f.turns.observeSpeech({ type: 'response.created' });
  f.turns.observeSpeech({
    type: 'response.done',
    response: { status: 'completed', output: [] },
  });
  assert.equal(f.observer.snapshot().known, false);
});

test('[voice-panel-038] An audio callback cannot act through a different controller owner', (t) => {
  const f = nativeFixture(t, 'gemini', { captureOwner: { admitted: true } });
  f.controller.audio = f.controller.createAudio({ pushToTalk: true });
  f.controller.audio = { pending: 7 };
  const before = f.changes.length;
  f.callbacks[0].onAudioStart();
  assert.equal(f.observer.snapshot().inputBusy, false);
  assert.equal(f.changes.length, before);
});

test('[voice-panel-038] A closed audio callback cannot restore input activity', (t) => {
  const f = nativeFixture(t, 'gemini', { captureOwner: { admitted: true } });
  f.controller.audio = f.controller.createAudio({ pushToTalk: true });
  f.controller.audio.close();
  const before = f.changes.length;
  f.callbacks[0].onAudioStart();
  assert.equal(f.observer.snapshot().inputBusy, false);
  assert.equal(f.changes.length, before);
});

test('[voice-panel-038] An old callback stays retired when the factory reuses its audio object', (t) => {
  const audio = { pending: 0, play() {}, close() {}, clearPlayback() {} },
    callbacks = [];
  const f = nativeFixture(t, 'gemini', {
    captureOwner: { admitted: true },
    createAudio(opts) {
      callbacks.push(opts);
      return audio;
    },
  });
  f.controller.audio = f.controller.createAudio({ pushToTalk: true });
  f.observer.handle({ type: 'state', state: 'listening' });
  f.observer.handle({ type: 'state', state: 'connecting' });
  f.controller.audio = f.controller.createAudio({ pushToTalk: true });
  callbacks[1].onAudioStart();
  assert.equal(f.observer.snapshot().inputBusy, true);
  callbacks[0].onAudioEnd();
  assert.equal(f.observer.snapshot().inputBusy, true);
});

test('[voice-panel-038] A retired factory callback cannot act through a null audio result', (t) => {
  let callback;
  const f = nativeFixture(t, 'gemini', {
    audio: null,
    captureOwner: { admitted: true },
    createAudio(opts) {
      callback = opts;
      return null;
    },
  });
  const factory = f.controller.createAudio;
  f.observer.destroy();
  assert.equal(factory.call(f.controller, { pushToTalk: true }), null);
  callback.onAudioStart();
  assert.equal(f.observer.snapshot().inputBusy, false);
});

test('[voice-panel-047] A retired factory does not wrap its new audio result', (t) => {
  const play = () => 29,
    audio = { pending: 7, play };
  const f = nativeFixture(t, 'gemini', {
    createAudio() {
      return audio;
    },
  });
  const factory = f.controller.createAudio;
  f.observer.destroy();
  assert.equal(factory.call(f.controller, {}) === audio, true);
  assert.equal(audio.play === play, true);
});

test('[voice-panel-047] A boundary inside the factory prevents a stale audio wrapper', (t) => {
  let observer;
  const play = () => 37,
    audio = { pending: 2, play };
  const f = nativeFixture(t, 'gemini', {
    createAudio() {
      observer.handle({ type: 'state', state: 'idle' });
      return audio;
    },
  });
  observer = f.observer;
  assert.equal(f.controller.createAudio({}) === audio, true);
  assert.equal(audio.play === play, true);
});

test('[voice-panel-037] A drain event cannot admit input capture', (t) => {
  const f = nativeFixture(t, 'gemini', { captureOwner: { admitted: true } });
  f.controller.audio = f.controller.createAudio({ pushToTalk: true });
  f.controller.audio.play(2);
  f.controller.audio.pending = 0;
  f.callbacks[0].onDrain();
  assert.equal(f.observer.snapshot().inputBusy, false);
  assert.equal(f.observer.snapshot().outputBusy, false);
});

test('[voice-panel-024] An incomplete store cannot receive a write or a new read', () => {
  let reads = 0,
    writes = [];
  const noSetter = {
    get getItem() {
      reads++;
      return () => null;
    },
  };
  const a = createVoicePreferences({ storage: noSetter });
  reads = 0;
  assert.equal(a.setMinutes(19).persisted, false);
  assert.equal(reads, 0);
  const noGetter = {
    setItem(key, value) {
      writes.push([key, value]);
    },
  };
  const b = createVoicePreferences({ storage: noGetter });
  assert.equal(b.setMinutes(23).persisted, false);
  assert.deepEqual(writes, []);
});

test('[voice-panel-029] The custom value precedes a synchronous source notice', (t) => {
  const doc = installPanelDom(t),
    input = doc.createElement('input'),
    seen = [];
  input.value = '9';
  const source = {
    snapshot: () => ({ minutes: 17, previewEnabled: true }),
    subscribe(fn) {
      fn({ minutes: 5, previewEnabled: true });
      return () => {};
    },
  };
  const b = bindPreferenceControls({
    ui: { voiceTimeoutInput: input },
    preferences: source,
    copy: controlCopy,
    onChange: () => seen.push(input.value),
  });
  assert.deepEqual(seen, ['17']);
  assert.equal(input.value, '17');
  b.dispose();
});

test('[voice-panel-026] The initial None value keeps a positive custom editor value', (t) => {
  const doc = installPanelDom(t),
    input = doc.createElement('input'),
    select = doc.createElement('select');
  input.value = '9';
  const p = createVoicePreferences({
    storage: memoryStore({ 'godsEyeView.voice.inactivityMinutes': 'none' }),
  });
  const b = bindPreferenceControls({
    ui: { voiceTimeoutInput: input, voiceTimeoutSelect: select },
    preferences: p,
    copy: controlCopy,
  });
  assert.equal(select.value, '0');
  assert.equal(input.value, '9');
  assert.equal(input.hidden, true);
  select.value = 'custom';
  select.fire('change');
  assert.equal(p.snapshot().minutes, 9);
  assert.equal(input.hidden, false);
  b.dispose();
});

test('[voice-panel-029] The zero branch uses the current minute value from a custom source', (t) => {
  const doc = installPanelDom(t),
    select = doc.createElement('select');
  let listener;
  const source = {
    snapshot: () => ({ minutes: 5, previewEnabled: true }),
    subscribe(fn) {
      listener = fn;
      return () => {};
    },
  };
  const b = bindPreferenceControls({
    ui: { voiceTimeoutSelect: select },
    preferences: source,
    copy: controlCopy,
  });
  let reads = 0;
  listener({
    previewEnabled: true,
    get minutes() {
      return [18, 0, 0][reads++];
    },
  });
  assert.equal(select.value, '0');
  assert.equal(reads, 3);
  b.dispose();
});

test('[voice-panel-029] The preview checkbox applies both boolean values through its listener', (t) => {
  const doc = installPanelDom(t),
    preview = doc.createElement('input'),
    p = createVoicePreferences({ storage: null }),
    seen = [];
  const b = bindPreferenceControls({
    ui: { voicePreviewInput: preview },
    preferences: p,
    copy: controlCopy,
    onChange: (s) => seen.push(s.previewEnabled),
  });
  assert.equal(preview.checked, true);
  preview.checked = false;
  preview.fire('change');
  assert.equal(p.snapshot().previewEnabled, false);
  preview.checked = true;
  preview.fire('change');
  assert.equal(p.snapshot().previewEnabled, true);
  assert.deepEqual(seen, [false, true]);
  b.dispose();
});

test('[voice-panel-027] A custom select rejects zero without a preference write', (t) => {
  const doc = installPanelDom(t),
    input = doc.createElement('input'),
    select = doc.createElement('select');
  const store = memoryStore({ 'godsEyeView.voice.inactivityMinutes': '18' }),
    p = createVoicePreferences({ storage: store });
  const b = bindPreferenceControls({
    ui: { voiceTimeoutInput: input, voiceTimeoutSelect: select },
    preferences: p,
    copy: controlCopy,
  });
  input.value = '0';
  select.value = 'custom';
  select.fire('change');
  assert.equal(p.snapshot().minutes, 18);
  assert.equal(input.value, '18');
  assert.deepEqual(store.writes, []);
  b.dispose();
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

test('[voice-panel-006] An inherited signal cannot retire an action key', async () => {
  const caller = new AbortController(),
    options = Object.create({ signal: caller.signal });
  let resolve;
  const pending = new Promise((yes) => {
    resolve = yes;
  });
  const o = createPanelActionObserver({
    runAction(name, body, opts) {
      assert.equal(opts === options, true);
      return pending;
    },
  });
  const returned = o.runAction('inherited', {}, options);
  caller.abort();
  assert.equal(o.pendingCount, 1);
  resolve(43);
  assert.equal(await returned, 43);
  assert.equal(o.pendingCount, 0);
});

for (const [index, ui] of [undefined, {}].entries()) {
  test(`[voice-panel-019] A valid reader cannot replace an absent panel in case ${index}`, () => {
    assert.throws(
      () =>
        createManualVoicePanel({
          ui,
          getPreviewEnabled: () => true,
          copy: { previewEmpty: 'Empty', previewDisabled: 'Off' },
        }),
      {
        name: 'TypeError',
        message: 'A voice panel and Preview preference reader are required.',
      },
    );
  });
}

test('[voice-panel-019] A valid disabled message cannot replace an invalid empty message', (t) => {
  const doc = installPanelDom(t),
    node = doc.createElement('section');
  assert.throws(
    () =>
      createManualVoicePanel({
        ui: { voicePanel: node },
        getPreviewEnabled: () => true,
        copy: { previewEmpty: 17, previewDisabled: 'Off' },
      }),
    {
      name: 'TypeError',
      message: 'Localized Preview messages are required.',
    },
  );
});

for (const [index, kind] of ['hidden', 'disconnected'].entries()) {
  test(`[voice-panel-020] A visibility method cannot replace a target guard in case ${index}`, (t) => {
    const f = panelFixture(t);
    f.ui.settingsTab.checkVisibility = () => true;
    if (kind === 'hidden') f.ui.settingsTab.hidden = true;
    else f.ui.settingsTab.remove();
    f.doc.body.focus();
    f.panel.select('settings', { focus: true });
    assert.equal(f.doc.activeElement === f.doc.body, true);
  });
}

test('[voice-panel-046] A closed transport error retires unresolved output evidence', (t) => {
  const f = nativeFixture(t);
  f.turns.observeSpeech({ type: 'response.created', response_id: 'one' });
  assert.equal(f.observer.snapshot().known, false);
  f.controller.status = 'error';
  f.observer.handle({ type: 'state', state: 'error' });
  assert.equal(f.observer.snapshot().known, true);
});

for (const [index, value, expected] of [
  [0, '3', 3],
  [1, '5', 5],
  [2, '10', 10],
  [3, '15', 15],
]) {
  test(`[voice-panel-022] The preset control applies its own value in case ${index}`, (t) => {
    const doc = installPanelDom(t),
      input = doc.createElement('input'),
      select = doc.createElement('select');
    const store = memoryStore({ 'godsEyeView.voice.inactivityMinutes': '18' }),
      p = createVoicePreferences({ storage: store });
    const b = bindPreferenceControls({
      ui: { voiceTimeoutInput: input, voiceTimeoutSelect: select },
      preferences: p,
      copy: controlCopy,
    });
    assert.equal(p.snapshot().minutes, 18);
    assert.equal(select.value, 'custom');
    assert.equal(input.value, '18');
    assert.equal(input.hidden, false);
    assert.deepEqual(store.writes, []);
    select.value = value;
    select.fire('change');
    assert.equal(p.snapshot().minutes === expected, true);
    assert.equal(p.snapshot().timeoutPersisted, true);
    assert.equal(select.value === value, true);
    assert.equal(input.value, '18');
    assert.equal(input.hidden, true);
    assert.deepEqual(store.writes, [
      ['godsEyeView.voice.inactivityMinutes', value],
    ]);
    b.dispose();
  });
}

for (const [index, state] of ['connecting', 'idle', 'error'].entries()) {
  test(`[voice-panel-055] The session state resets the final reply in case ${index}`, (t) => {
    const f = hostFixture(t),
      reply = {
        type: 'transcript',
        role: 'assistant',
        responseId: 'one',
        text: 'Final',
        final: true,
      };
    f.binding.handle(reply);
    assert.equal(f.cards.length, 1);
    f.binding.handle({ type: 'state', state });
    assert.equal(f.cards.length, 2);
    f.binding.handle(reply);
    assert.equal(f.cards.length, 3);
    assert.deepEqual(
      f.cards.map((e) => e.type),
      ['transcript', 'state', 'transcript'],
    );
  });
}

test('[voice-panel-058] A replaced destroy method cannot keep the old mount current', (t) => {
  const f = hostFixture(t),
    original = f.binding.destroy,
    op = f.binding.captureOperation();
  let calls = 0;
  f.binding.destroy = () => {
    calls++;
  };
  t.after(() => {
    f.binding.destroy = original;
    original();
  });
  const next = f.host.mount({
    ui: f.ui,
    card: f.card,
    session: f.session,
    observer: f.observer,
  });
  assert.equal(calls, 1);
  assert.equal(next.captureOperation().isCurrent(), true);
  assert.equal(op.isCurrent(), false);
  assert.deepEqual(op.show('preview'), {
    ok: false,
    applied: false,
    cancelled: true,
  });
  f.binding.handle({ type: 'transcript', role: 'assistant', text: 'Old' });
  assert.deepEqual(f.cards, []);
});

for (const [index, minutes, deadline, delay] of [
  [0, 0, null, null],
  [1, 1, 61700, 60000],
  [2, 60, 3601700, 3600000],
]) {
  test(`[voice-panel-032] The initial timer uses the supplied minutes in case ${index}`, (t) => {
    const f = idleFixture(t, { minutes });
    assert.equal(f.idle.snapshot().minutes === minutes, true);
    assert.equal(f.idle.snapshot().deadline === deadline, true);
    assert.equal(f.timers.size, index === 0 ? 0 : 1);
    if (index > 0)
      assert.equal([...f.timers.values()][0].delay === delay, true);
  });
}
