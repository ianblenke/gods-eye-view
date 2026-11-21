import test from 'node:test';
import assert from 'node:assert/strict';
import { observeNativeActivity } from './nativeActivity.js';

// Small native-shaped fixtures, as in nativeActivity.test.mjs.
function geminiController() {
  const callbacks = [];
  const controller = {
    input: { pushToTalkKeyHeld: false, setMicrophoneEnabled() {} },
    captureOwner: { admitted: false },
    createAudio(options) {
      callbacks.push(options);
      return { pending: 0, play() {}, clearPlayback() {}, close() {} };
    },
    handleMessage() {},
  };
  return { controller, callbacks };
}

test('[voice-panel-040] a failing text callback leaves the native method result exact', () => {
  const { controller } = geminiController();
  controller.sendTextCommand = () => 'sent';
  const observer = observeNativeActivity({
    adapter: { controller },
    nativeProvider: 'gemini',
    onInput() {
      throw new Error('the host callback fails');
    },
  });
  assert.equal(controller.sendTextCommand('hello'), 'sent');
  observer.destroy();
});

test('[voice-panel-040] a signal that is already aborted destroys the observer at once', () => {
  const { controller } = geminiController();
  const original = controller.input.setMicrophoneEnabled;
  const abort = new AbortController();
  abort.abort();
  const observer = observeNativeActivity({
    adapter: { controller },
    nativeProvider: 'gemini',
    signal: abort.signal,
  });
  assert.equal(controller.input.setMicrophoneEnabled, original);
  observer.destroy();
});

test('[voice-panel-045] a native speech observer reads an event with no type, and the start and the stop of speech', () => {
  const turns = { observeSpeech() {} };
  const controller = { _turns: turns, _input: { pushToTalkKeyHeld: false } };
  const observer = observeNativeActivity({ adapter: { controller }, nativeProvider: 'openai' });
  observer.handle({ type: 'state', state: 'listening' });
  turns.observeSpeech(undefined);
  turns.observeSpeech({});
  assert.equal(observer.snapshot().inputBusy, false);
  turns.observeSpeech({ type: 'input_audio_buffer.speech_started' });
  assert.equal(observer.snapshot().inputBusy, true);
  turns.observeSpeech({ type: 'input_audio_buffer.speech_stopped' });
  assert.equal(observer.snapshot().inputBusy, false);
  observer.destroy();
});

test('[voice-panel-038] a retired audio method that a caller kept changes no state', () => {
  const { controller } = geminiController();
  const changes = [];
  const observer = observeNativeActivity({
    adapter: { controller },
    nativeProvider: 'gemini',
    onChange: () => changes.push(1),
  });
  observer.handle({ type: 'state', state: 'connecting' });
  const first = controller.createAudio({});
  const keptPlay = first.play;
  observer.handle({ type: 'state', state: 'connecting' });
  controller.createAudio({});
  const before = changes.length;
  keptPlay.call(first);
  assert.equal(changes.length, before);
  observer.destroy();
});
