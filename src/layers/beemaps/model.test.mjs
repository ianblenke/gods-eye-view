import test from 'node:test';
import assert from 'node:assert/strict';
import { HINT, pointStyle, readoutText } from './model.js';

const NOW = Date.UTC(2026, 9, 15, 12, 0, 0);
const WEEK = 604800000;
const MONTH = 2592000000;

test('[beemaps-frames-017] gives the first style to a frame that is under 7 days old', () => {
  const first = { color: '#f59e0b', alpha: 1, size: 8 };
  assert.deepEqual(pointStyle(NOW, NOW), first);
  assert.deepEqual(pointStyle(NOW - (WEEK - 1), NOW), first);
});

test('[beemaps-frames-017] gives the second style from 7 days up to 30 days', () => {
  const second = { color: '#f59e0b', alpha: 0.7, size: 7 };
  assert.deepEqual(pointStyle(NOW - WEEK, NOW), second);
  assert.deepEqual(pointStyle(NOW - (MONTH - 1), NOW), second);
});

test('[beemaps-frames-017] gives the third style from 30 days on', () => {
  const third = { color: '#f59e0b', alpha: 0.4, size: 6 };
  assert.deepEqual(pointStyle(NOW - MONTH, NOW), third);
  assert.deepEqual(pointStyle(NOW - 10 * MONTH, NOW), third);
});

test('[beemaps-frames-017] gives the first style to a time after the current time', () => {
  const first = { color: '#f59e0b', alpha: 1, size: 8 };
  assert.deepEqual(pointStyle(NOW + 1, NOW), first);
  assert.deepEqual(pointStyle(NOW + 10 * MONTH, NOW), first);
});

const frame = (timestamp) => ({ timestamp, time: Date.parse(timestamp) });
const answer = (frames, extra = {}) => ({
  frames,
  used: null,
  limit: null,
  remaining: null,
  ...extra,
});

test('[beemaps-frames-018] shows the hint when there is no answer and no message', () => {
  assert.equal(
    HINT,
    'A press asks for the newest frames in a box of 300 m by 300 m at the view centre. It can cost money.',
  );
  assert.equal(readoutText({ message: null, answer: null }), HINT);
  assert.equal(readoutText({ message: '', answer: null }), HINT);
});

test('[beemaps-frames-018] writes the count, the newest day, the requests and the credits of an answer', () => {
  const frames = [
    frame('2026-10-12T20:00:00.000Z'),
    frame('2026-10-14T08:03:00.000Z'),
    frame('2026-10-13T23:59:59.999Z'),
  ];
  assert.equal(
    readoutText({
      message: null,
      answer: answer(frames, { used: 3, limit: 20, remaining: 998 }),
    }),
    '3 frames · newest 2026-10-14 · requests today 3 of 20 · credits left 998',
  );
});

test('[beemaps-frames-018] writes the newest day as the date in UTC in any time zone', () => {
  const zone = process.env.TZ;
  try {
    for (const [tz, time, day] of [
      ['Pacific/Honolulu', '2026-10-14T08:03:00.000Z', '2026-10-14'],
      ['Asia/Tokyo', '2026-10-14T23:30:00.000Z', '2026-10-14'],
    ]) {
      process.env.TZ = tz;
      assert.equal(
        readoutText({ message: null, answer: answer([frame(time)]) }),
        `1 frame · newest ${day}`,
        tz,
      );
    }
  } finally {
    if (zone === undefined) delete process.env.TZ;
    else process.env.TZ = zone;
  }
});

test('[beemaps-frames-018] writes frame in the singular for one frame and leaves out the newest day for none', () => {
  assert.equal(
    readoutText({
      message: null,
      answer: answer([frame('2026-10-14T08:03:00.000Z')]),
    }),
    '1 frame · newest 2026-10-14',
  );
  assert.equal(
    readoutText({ message: null, answer: answer([], { used: 1, limit: 20 }) }),
    '0 frames · requests today 1 of 20',
  );
});

test('[beemaps-frames-018] leaves out the part of a number that is null', () => {
  const frames = [frame('2026-10-14T08:03:00.000Z')];
  const text = (extra) =>
    readoutText({ message: null, answer: answer(frames, extra) });
  assert.equal(
    text({ used: 3, limit: 20 }),
    '1 frame · newest 2026-10-14 · requests today 3 of 20',
  );
  assert.equal(text({ used: null, limit: 20 }), '1 frame · newest 2026-10-14');
  assert.equal(text({ used: 3, limit: null }), '1 frame · newest 2026-10-14');
  assert.equal(
    text({ remaining: 5 }),
    '1 frame · newest 2026-10-14 · credits left 5',
  );
  assert.equal(
    text({ used: 0, limit: 0, remaining: 0 }),
    '1 frame · newest 2026-10-14 · requests today 0 of 0 · credits left 0',
  );
});

test('[beemaps-frames-018] puts the message first and shows it alone when there is no answer', () => {
  const frames = [frame('2026-10-14T08:03:00.000Z')];
  assert.equal(
    readoutText({
      message: 'The server did not answer.',
      answer: answer(frames),
    }),
    'The server did not answer. · 1 frame · newest 2026-10-14',
  );
  assert.equal(
    readoutText({ message: 'The server did not answer.', answer: null }),
    'The server did not answer.',
  );
});
