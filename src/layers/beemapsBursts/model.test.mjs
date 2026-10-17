import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HINT,
  LABELS,
  QUOTE_STYLE,
  TITLES,
  burstStyle,
  burstsText,
  confirmLabel,
  quoteText,
  readoutText,
} from './model.js';

const QUOTE = {
  credits: 125,
  areaKm2: 4,
  expiresInSeconds: 120,
  budget: { used: 0, limit: 625, remaining: 625 },
};
const burst = (isHit, status = 'active') => ({ isHit, status });

test('[beemaps-bursts-026] gives the hint of three sentences when nothing else is known', () => {
  assert.equal(
    HINT,
    'A quote shows the price of a burst in 4 km² at the view centre. A quote costs nothing. A confirm request takes credits and cannot be undone.',
  );
  assert.equal(readoutText({ message: null, quote: null, list: null }), HINT);
  assert.equal(readoutText({ message: '', quote: null, list: null }), HINT);
});

test('[beemaps-bursts-026] gives the labels and the titles of the chips', () => {
  assert.deepEqual(LABELS, {
    quote: 'Quote burst here',
    quoting: 'Quoting…',
    sending: 'Sending…',
    cancel: 'Cancel quote',
    list: 'Check my bursts',
    listing: 'Checking…',
  });
  assert.deepEqual(TITLES, {
    quote: 'Ask for the price of a burst. A quote costs nothing.',
    quoteBlocked:
      'It is possible that Bee Maps made a burst. Press Check my bursts first.',
    confirm: 'Create the burst. This takes credits and cannot be undone.',
    cancel: 'Cancel the quote. Nothing is sent.',
    list: 'Ask Bee Maps for your bursts. This can cost money.',
  });
});

test('[beemaps-bursts-026] joins the message, the quote and the bursts with a dot and leaves out an absent part', () => {
  const list = { bursts: [burst(false)], total: 1 };
  const quote =
    'Quote: 125 credits for 4 km² · credits used today 0 of 625 · valid for 120 seconds';
  assert.equal(
    readoutText({ message: 'Hello.', quote: null, list: null }),
    'Hello.',
  );
  assert.equal(readoutText({ message: null, quote: QUOTE, list: null }), quote);
  assert.equal(
    readoutText({ message: null, quote: null, list }),
    '1 burst · 0 hits',
  );
  assert.equal(
    readoutText({ message: 'Hello.', quote: QUOTE, list }),
    `Hello. · ${quote} · 1 burst · 0 hits`,
  );
  assert.equal(
    readoutText({ message: null, quote: QUOTE, list }),
    `${quote} · 1 burst · 0 hits`,
  );
  assert.equal(
    readoutText({ message: 'Hello.', quote: null, list }),
    'Hello. · 1 burst · 0 hits',
  );
});

test('[beemaps-bursts-007] names the credits and the area of 4 km² on the Confirm chip', () => {
  assert.equal(
    confirmLabel({ credits: 125, areaKm2: 4 }),
    'Confirm: 125 credits, 4 km²',
  );
  assert.equal(
    confirmLabel({ credits: 125, areaKm2: 3.998 }),
    'Confirm: 125 credits, 3.998 km²',
  );
});

test('[beemaps-bursts-007] names the credits, the area, the budget and the seconds of a quote', () => {
  assert.equal(
    quoteText(QUOTE),
    'Quote: 125 credits for 4 km² · credits used today 0 of 625 · valid for 120 seconds',
  );
  assert.equal(
    quoteText({
      credits: 125,
      areaKm2: 3.998,
      expiresInSeconds: 1,
      budget: { used: 500, limit: 625, remaining: 125 },
    }),
    'Quote: 125 credits for 3.998 km² · credits used today 500 of 625 · valid for 1 second',
  );
  for (const [seconds, word] of [
    [0, 'seconds'],
    [2, 'seconds'],
    [600, 'seconds'],
  ]) {
    assert.match(
      quoteText({ ...QUOTE, expiresInSeconds: seconds }),
      new RegExp(`valid for ${seconds} ${word}$`),
    );
  }
});

test('[beemaps-bursts-018] counts the bursts and the hits, and says how many exist in all', () => {
  assert.equal(
    burstsText({ bursts: [burst(false), burst(true), burst(false)], total: 3 }),
    '3 bursts · 1 hit',
  );
  assert.equal(
    burstsText({ bursts: [burst(false)], total: 1 }),
    '1 burst · 0 hits',
  );
  assert.equal(burstsText({ bursts: [], total: 0 }), '0 bursts · 0 hits');
  assert.equal(
    burstsText({ bursts: [burst(true), burst(true)], total: 2 }),
    '2 bursts · 2 hits',
  );
  const hundred = Array.from({ length: 100 }, () => burst(false));
  assert.equal(
    burstsText({ bursts: hundred, total: 130 }),
    '100 bursts (130 in all) · 0 hits',
  );
  assert.equal(
    burstsText({ bursts: hundred, total: 100 }),
    '100 bursts · 0 hits',
  );
  assert.equal(
    burstsText({ bursts: [burst(false)], total: null }),
    '1 burst · 0 hits',
  );
  assert.equal(
    burstsText({ bursts: [burst(true)], total: 0 }),
    '1 burst · 1 hit',
  );
});

test('[beemaps-bursts-020] gives green for a hit, blue for an active burst and grey for the rest', () => {
  assert.deepEqual(burstStyle({ status: 'active', isHit: true }), {
    color: '#22c55e',
    alpha: 0.35,
  });
  assert.deepEqual(burstStyle({ status: 'ended', isHit: true }), {
    color: '#22c55e',
    alpha: 0.35,
  });
  assert.deepEqual(burstStyle({ status: 'active', isHit: false }), {
    color: '#38bdf8',
    alpha: 0.25,
  });
  assert.deepEqual(burstStyle({ status: 'ended', isHit: false }), {
    color: '#9ca3af',
    alpha: 0.2,
  });
  assert.deepEqual(burstStyle({ status: 'Active', isHit: false }), {
    color: '#9ca3af',
    alpha: 0.2,
  });
  assert.deepEqual(QUOTE_STYLE, { color: '#f59e0b', alpha: 0.3 });
});

test('[beemaps-bursts-018] adds stored answer to the text of a list that came from memory', () => {
  assert.equal(
    burstsText({ bursts: [burst(true)], total: 1, cached: true }),
    '1 burst · 1 hit · stored answer',
  );
  assert.equal(
    burstsText({ bursts: [burst(true)], total: 1, cached: false }),
    '1 burst · 1 hit',
  );
  assert.equal(
    burstsText({ bursts: [burst(true)], total: 3, cached: true }),
    '1 burst (3 in all) · 1 hit · stored answer',
  );
  assert.equal(
    readoutText({
      message: null,
      quote: null,
      list: { bursts: [burst(false)], total: null, cached: true },
    }),
    '1 burst · 0 hits · stored answer',
  );
});
