import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createVoicePreferences,
  bindPreferenceControls,
} from './preferences.js';

function storage(entries = {}, mode = 'normal') {
  const values = new Map(Object.entries(entries));
  const writes = [];
  return {
    writes,
    values,
    getItem(key) {
      if (mode === 'readthrow') throw Error('blocked');
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      writes.push([key, value]);
      if (mode === 'throw') throw Error('blocked');
      if (mode !== 'noop' && mode !== 'readthrow')
        values.set(key, mode === 'mismatch' ? `${value}!` : value);
    },
  };
}
class Element {
  value = '';
  checked = false;
  textContent = '';
  hidden = false;
  listeners = new Set();
  addEventListener(type, listener) {
    assert.equal(type, 'change');
    this.listeners.add(listener);
  }
  removeEventListener(type, listener) {
    assert.equal(type, 'change');
    this.listeners.delete(listener);
  }
  change(value) {
    if (typeof value === 'boolean') this.checked = value;
    else this.value = value;
    for (const listener of [...this.listeners]) listener();
  }
}
function controls(custom = '7') {
  const ui = Object.fromEntries(
    [
      'voicePreviewInput',
      'voicePreviewNote',
      'voiceTimeoutSelect',
      'voiceTimeoutInput',
      'voiceTimeoutNote',
    ].map((key) => [key, new Element()]),
  );
  ui.voiceTimeoutInput.value = custom;
  return ui;
}
const copy = {
  previewNote: 'Preview local',
  timeoutNote: 'Provider limits still apply',
  notSaved: 'Not saved',
};
function bind(ui, preferences, onChange) {
  return bindPreferenceControls({ ui, preferences, copy, onChange });
}

test('[voice-panel-021] defaults and restore are passive; legacy None and stored custom restore', () => {
  for (const [entries, minutes, previewEnabled] of [
    [{}, 5, true],
    [
      {
        ['godsEyeView.voice.previewEnabled']: 'false',
        ['godsEyeView.voice.inactivityMinutes']: 'none',
      },
      0,
      false,
    ],
    [{ ['godsEyeView.voice.inactivityMinutes']: '17' }, 17, true],
    [{ ['godsEyeView.voice.inactivityMinutes']: 'broken' }, 5, true],
  ]) {
    const disk = storage(entries);
    const prefs = createVoicePreferences({ storage: disk });
    assert.deepEqual(prefs.snapshot(), {
      previewEnabled,
      minutes,
      previewPersisted: null,
      timeoutPersisted: null,
    });
    const ui = controls();
    bind(ui, prefs).dispose();
    assert.deepEqual(disk.writes, []);
  }
});

test('[voice-panel-022] exact valid values, presets, None and serialized readback', () => {
  const disk = storage();
  const prefs = createVoicePreferences({ storage: disk });
  for (const [value, expected, text] of [
    [3, 3, '3'],
    [5, 5, '5'],
    [10, 10, '10'],
    [15, 15, '15'],
    ['1', 1, '1'],
    ['60', 60, '60'],
    [0, 0, 'none'],
  ]) {
    const result = prefs.setMinutes(value);
    assert.equal(result.ok, true);
    assert.equal(result.applied, true);
    assert.equal(result.persisted, true);
    assert.equal(result.minutes, expected);
    assert.deepEqual(disk.writes.at(-1), [
      'godsEyeView.voice.inactivityMinutes',
      text,
    ]);
  }
  assert.equal(prefs.setPreviewEnabled(false).previewEnabled, false);
  assert.deepEqual(disk.writes.at(-1), [
    'godsEyeView.voice.previewEnabled',
    'false',
  ]);
});

test('fractional, malformed, coercible and out-of-range inputs never write or notify', () => {
  const disk = storage();
  const prefs = createVoicePreferences({ storage: disk });
  let notices = 0;
  prefs.subscribe(() => notices++);
  const before = prefs.snapshot();
  for (const value of [
    null,
    undefined,
    true,
    {},
    [],
    '',
    ' ',
    ' 3',
    '3 ',
    '3.0',
    '1e1',
    '0x10',
    'none',
    -1,
    61,
    3.2,
    NaN,
    Infinity,
  ]) {
    const result = prefs.setMinutes(value);
    assert.equal(result.ok, false, String(value));
    assert.equal(result.applied, false);
    assert.equal(result.changed, false);
    assert.deepEqual(prefs.snapshot(), before);
  }
  for (const value of [0, 'true', null])
    assert.equal(prefs.setPreviewEnabled(value).ok, false);
  assert.equal(notices, 0);
  assert.deepEqual(disk.writes, []);
});

for (const mode of ['throw', 'noop', 'mismatch', 'readthrow', 'missing']) {
  test(`storage ${mode} preserves live value and exposes unsaved state across A → B`, () => {
    const disk = mode === 'missing' ? null : storage({}, mode);
    const prefs = createVoicePreferences({ storage: disk });
    const a = controls();
    const bindingA = bind(a, prefs);
    a.voicePreviewInput.change(false);
    a.voiceTimeoutSelect.change('custom');
    a.voiceTimeoutInput.change('19');
    assert.deepEqual(prefs.snapshot(), {
      previewEnabled: false,
      minutes: 19,
      previewPersisted: false,
      timeoutPersisted: false,
    });
    bindingA.dispose();
    const writeCount = disk?.writes.length;
    const b = controls();
    const bindingB = bind(b, prefs);
    assert.equal(b.voicePreviewInput.checked, false);
    assert.equal(b.voiceTimeoutInput.value, '19');
    assert.match(b.voicePreviewNote.textContent, /Not saved/);
    assert.match(b.voiceTimeoutNote.textContent, /Not saved/);
    assert.equal(disk?.writes.length === writeCount, true);
    a.voicePreviewInput.change(true);
    a.voiceTimeoutSelect.change('3');
    assert.equal(prefs.snapshot().minutes, 19);
    assert.equal(prefs.snapshot().previewEnabled, false);
    bindingB.dispose();
  });
}

test('[voice-panel-025] same-value retry really writes and clears warnings after storage recovers', () => {
  const disk = storage();
  const original = disk.setItem;
  disk.setItem = () => {
    throw Error('blocked');
  };
  const prefs = createVoicePreferences({ storage: disk });
  const ui = controls();
  bind(ui, prefs);
  prefs.setPreviewEnabled(false);
  prefs.setMinutes(12);
  assert.match(ui.voiceTimeoutNote.textContent, /Not saved/);
  disk.setItem = original;
  const timeout = prefs.setMinutes(12);
  const preview = prefs.setPreviewEnabled(false);
  assert.equal(timeout.changed, false);
  assert.equal(preview.changed, false);
  assert.equal(timeout.persisted, true);
  assert.equal(preview.persisted, true);
  assert.deepEqual(disk.writes, [
    ['godsEyeView.voice.inactivityMinutes', '12'],
    ['godsEyeView.voice.previewEnabled', 'false'],
  ]);
  assert.equal(ui.voiceTimeoutNote.textContent, 'Provider limits still apply');
  assert.equal(ui.voicePreviewNote.textContent, 'Preview local');
});

test('[voice-panel-026] Custom commits displayed valid value immediately, even when equal to preset', () => {
  const disk = storage();
  const prefs = createVoicePreferences({ storage: disk });
  const ui = controls('10');
  bind(ui, prefs);
  assert.equal(disk.writes.length, 0);
  ui.voiceTimeoutSelect.change('custom');
  assert.equal(prefs.snapshot().minutes, 10);
  assert.equal(ui.voiceTimeoutSelect.value, 'custom');
  assert.equal(ui.voiceTimeoutInput.hidden, false);
  assert.deepEqual(disk.writes, [
    ['godsEyeView.voice.inactivityMinutes', '10'],
  ]);
  ui.voiceTimeoutInput.change('23');
  ui.voiceTimeoutSelect.change('5');
  assert.equal(ui.voiceTimeoutInput.value, '23');
  assert.equal(ui.voiceTimeoutInput.hidden, true);
  ui.voiceTimeoutSelect.change('custom');
  assert.equal(prefs.snapshot().minutes, 23);
  assert.equal(ui.voiceTimeoutInput.value, '23');
});

test('[voice-panel-027] invalid control edits restore valid state without writes; None remains distinct', () => {
  const disk = storage({ ['godsEyeView.voice.inactivityMinutes']: '17' });
  const prefs = createVoicePreferences({ storage: disk });
  const ui = controls();
  bind(ui, prefs);
  assert.equal(ui.voiceTimeoutInput.value, '17');
  for (const value of ['1.5', '', '61', '0']) {
    ui.voiceTimeoutInput.change(value);
    assert.equal(ui.voiceTimeoutInput.value, '17');
    assert.equal(prefs.snapshot().minutes, 17);
  }
  ui.voiceTimeoutSelect.change('malformed');
  assert.equal(ui.voiceTimeoutSelect.value, 'custom');
  assert.equal(disk.writes.length, 0);
  ui.voiceTimeoutSelect.change('0');
  assert.equal(prefs.snapshot().minutes, 0);
  assert.equal(ui.voiceTimeoutInput.hidden, true);
  ui.voiceTimeoutInput.value = 'bad';
  ui.voiceTimeoutSelect.change('custom');
  assert.equal(ui.voiceTimeoutSelect.value, '0');
  assert.equal(prefs.snapshot().minutes, 0);
  assert.deepEqual(disk.writes, [
    ['godsEyeView.voice.inactivityMinutes', 'none'],
  ]);
});

test('[voice-panel-028] model snapshots cannot mutate state; unsubscribe and binder disposal release ownership', () => {
  const prefs = createVoicePreferences({ storage: storage() });
  const ui = controls();
  let calls = 0;
  const binding = bind(ui, prefs, () => calls++);
  const snap = prefs.snapshot();
  snap.minutes = 41;
  assert.equal(prefs.snapshot().minutes, 5);
  const unsub = prefs.subscribe((state) => {
    state.minutes = 22;
  });
  prefs.setMinutes(11);
  assert.equal(calls, 1);
  assert.equal(prefs.snapshot().minutes, 11);
  unsub();
  binding.dispose();
  binding.dispose();
  prefs.setMinutes(12);
  assert.equal(calls, 1);
  assert.equal(ui.voiceTimeoutInput.value, '11');
  for (const element of Object.values(ui))
    assert.equal(element.listeners.size, 0);
});
