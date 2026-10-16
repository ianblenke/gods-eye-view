import test from 'node:test';
import assert from 'node:assert/strict';
import {
  QUOTE_ENDED,
  STATUS_FAILED,
  describeCreated,
  describeFailure,
  describeReason,
  describeUnknown,
} from './messages.js';

const text = (error, extra = {}) =>
  describeFailure({ status: 500, error, ...extra });

test('[beemaps-bursts-027] gives the fixed text of each known error code', () => {
  assert.equal(
    text('cross_origin'),
    'Only the machine that runs the server can use bursts. Start the app with make up-codex.',
  );
  assert.equal(
    text('burst_off'),
    'Bursts are off on this server. Set BEEMAPS_BURST_ENABLED=true in .env and restart the app.',
  );
  assert.equal(
    text('no_key'),
    'No Bee Maps key for bursts. Set BEEMAPS_BURST_API_KEY in .env and restart the app.',
  );
  assert.equal(text('rate_limited'), 'Too many presses. Wait 60 seconds.');
  assert.equal(
    text('key_rejected'),
    'Bee Maps refused the key. Check BEEMAPS_BURST_API_KEY in .env.',
  );
  assert.equal(text('no_credit'), 'The Bee Maps account has no credit.');
  assert.equal(
    text('budget_unavailable'),
    'The server cannot use its budget file.',
  );
  assert.equal(
    text('ledger_unavailable'),
    'The server cannot use its record of bursts. Nothing was sent.',
  );
  assert.equal(
    text('log_failed'),
    'The server cannot write its log. Nothing was sent.',
  );
  assert.equal(
    text('quote_expired'),
    'The quote ended. Press Quote burst here again.',
  );
  assert.equal(
    text('busy'),
    'The server is busy with another confirm request. Wait, then press Check my bursts.',
  );
  assert.equal(text('key_reused'), 'The server refused this confirm request.');
  assert.equal(text('bad_request'), 'Bee Maps refused the request.');
  assert.equal(text('upstream_failed'), 'Bee Maps did not answer correctly.');
  assert.equal(text('unreachable'), 'The server did not answer.');
  assert.equal(
    text('bad_answer'),
    'The server sent an answer that the layer cannot read.',
  );
});

test('[beemaps-bursts-027] gives one text for the four codes of a refused request', () => {
  for (const error of [
    'bad_body',
    'bad_area',
    'area_too_large',
    'bad_credits',
  ]) {
    assert.equal(text(error), 'The server refused the request.');
  }
});

test('[beemaps-bursts-027] names the wait of Bee Maps in seconds, and leaves it out without a number', () => {
  assert.equal(
    text('upstream_rate_limit', { retryAfter: 30 }),
    'Bee Maps asks you to wait 30 seconds.',
  );
  assert.equal(
    text('upstream_rate_limit', { retryAfter: 1 }),
    'Bee Maps asks you to wait 1 second.',
  );
  assert.equal(
    text('upstream_rate_limit', { retryAfter: 2 }),
    'Bee Maps asks you to wait 2 seconds.',
  );
  for (const retryAfter of [undefined, 0, -3, 1.5, '30', NaN]) {
    assert.equal(
      text('upstream_rate_limit', { retryAfter }),
      'Bee Maps asks you to wait.',
    );
  }
});

test('[beemaps-bursts-027] names the daily limit in credits, and leaves it out without a number', () => {
  assert.equal(
    text('budget_used', { limit: 625 }),
    'The daily limit of 625 credits is used.',
  );
  assert.equal(
    text('budget_used', { limit: 1 }),
    'The daily limit of 1 credit is used.',
  );
  assert.equal(
    text('budget_used', { limit: 2 }),
    'The daily limit of 2 credits is used.',
  );
  for (const limit of [undefined, 0, -1, 2.5, '625']) {
    assert.equal(text('budget_used', { limit }), 'The daily limit is used.');
  }
});

test('[beemaps-bursts-027] names the status in the text of an unknown code', () => {
  assert.equal(
    describeFailure({ status: 500, error: 'something' }),
    'The server answered with an unknown error (500).',
  );
  assert.equal(
    describeFailure({ status: 418, error: undefined }),
    'The server answered with an unknown error (418).',
  );
  assert.equal(
    describeFailure({ status: 418, error: 'toString' }),
    'The server answered with an unknown error (418).',
  );
});

test('[beemaps-bursts-008] gives the text of each reason that the view gives no box', () => {
  assert.equal(
    describeReason('sky'),
    'Point the view at the ground and press again.',
  );
  assert.equal(
    describeReason('latitude'),
    'Move the view to a latitude from -79.99 to 79.99 degrees and press again.',
  );
  assert.equal(
    describeReason('meridian'),
    'Move the view away from the 180th meridian and press again.',
  );
  assert.equal(describeReason('other'), undefined);
  assert.equal(describeReason(undefined), undefined);
});

test('[beemaps-bursts-016] warns that a burst can exist, and adds the refusal time when it is known', () => {
  const base =
    'It is possible that Bee Maps made a burst and took credits. Do not press Confirm again. Press Check my bursts.';
  assert.equal(describeUnknown({}), base);
  assert.equal(describeUnknown(), base);
  for (const retryAfter of [undefined, 0, -1, 1.5, '539', NaN]) {
    assert.equal(describeUnknown({ retryAfter }), base);
  }
  assert.equal(
    describeUnknown({ retryAfter: 539 }),
    `${base} The server refuses new confirms for 539 seconds.`,
  );
  assert.equal(
    describeUnknown({ retryAfter: 1 }),
    `${base} The server refuses new confirms for 1 second.`,
  );
  assert.equal(
    describeUnknown({ retryAfter: 2 }),
    `${base} The server refuses new confirms for 2 seconds.`,
  );
});

test('[beemaps-bursts-014] names the credits taken and the credits left', () => {
  assert.equal(
    describeCreated({ credits: 125, creditsRemaining: 875 }),
    'Burst created: 125 credits taken, 875 left at Bee Maps.',
  );
  assert.equal(
    describeCreated({ credits: 125, creditsRemaining: 0 }),
    'Burst created: 125 credits taken, 0 left at Bee Maps.',
  );
  assert.equal(
    describeCreated({ credits: 250, creditsRemaining: null }),
    'Burst created: 250 credits taken.',
  );
});

test('[beemaps-bursts-005] gives the text for a status that failed, and the text for a quote that ended', () => {
  assert.equal(
    STATUS_FAILED,
    'The server did not give the status of the bursts.',
  );
  assert.equal(QUOTE_ENDED, 'The quote ended. Press Quote burst here again.');
});
