import test from 'node:test';
import assert from 'node:assert/strict';
import { STATUS_FAILED, describeFailure, describeReason } from './messages.js';

test('[beemaps-frames-016] names the failures that have a fixed text', () => {
  const rows = [
    [
      'cross_origin',
      'Only the machine that runs the server can fetch frames. Start the app with make up-codex.',
    ],
    [
      'key_rejected',
      'Bee Maps refused the key. Check BEEMAPS_API_KEY in .env.',
    ],
    [
      'no_key',
      'No Bee Maps key. Set BEEMAPS_API_KEY in .env and restart the app.',
    ],
    ['rate_limited', 'Too many presses. Wait 60 seconds.'],
    ['no_credit', 'The Bee Maps account has no credit.'],
    ['upstream_failed', 'Bee Maps did not answer correctly.'],
    ['bad_upstream', 'Bee Maps did not answer correctly.'],
    ['budget_unavailable', 'The server cannot use its budget file.'],
    ['bad_area', 'The server refused the request.'],
    ['area_too_large', 'The server refused the request.'],
    ['bad_body', 'The server refused the request.'],
    ['bad_since', 'The server refused the request.'],
    ['bad_limit', 'The server refused the request.'],
    ['unreachable', 'The server did not answer.'],
    ['bad_answer', 'The server sent an answer that the layer cannot read.'],
  ];
  for (const [error, text] of rows)
    assert.equal(describeFailure({ status: 400, error }), text, error);
});

test('[beemaps-frames-016] writes the daily limit and the wait of the upstream when they are whole numbers', () => {
  assert.equal(
    describeFailure({ status: 429, error: 'budget', limit: 20 }),
    'The daily limit of 20 requests is used.',
  );
  assert.equal(
    describeFailure({ status: 429, error: 'budget', limit: 0 }),
    'The daily limit of 0 requests is used.',
  );
  assert.equal(
    describeFailure({ status: 429, error: 'budget', limit: 5 }),
    'The daily limit of 5 requests is used.',
  );
  assert.equal(
    describeFailure({ status: 429, error: 'budget', limit: 1 }),
    'The daily limit of 1 request is used.',
  );
  assert.equal(
    describeFailure({
      status: 429,
      error: 'upstream_rate_limit',
      retryAfter: 30,
    }),
    'Bee Maps asks you to wait 30 seconds.',
  );
  assert.equal(
    describeFailure({
      status: 429,
      error: 'upstream_rate_limit',
      retryAfter: 600,
    }),
    'Bee Maps asks you to wait 600 seconds.',
  );
  assert.equal(
    describeFailure({
      status: 429,
      error: 'upstream_rate_limit',
      retryAfter: 1,
    }),
    'Bee Maps asks you to wait 1 second.',
  );
  for (const value of [undefined, null, '30', 1.5, -1, NaN]) {
    assert.equal(
      describeFailure({ status: 429, error: 'budget', limit: value }),
      'The daily limit is used.',
      String(value),
    );
    assert.equal(
      describeFailure({
        status: 429,
        error: 'upstream_rate_limit',
        retryAfter: value,
      }),
      'Bee Maps asks you to wait.',
      String(value),
    );
  }
});

test('[beemaps-frames-016] gives the unknown text with the status for any other error', () => {
  assert.equal(
    describeFailure({ status: 418, error: 'teapot' }),
    'The server answered with an unknown error (418).',
  );
  assert.equal(
    describeFailure({ status: 500, error: 'unknown' }),
    'The server answered with an unknown error (500).',
  );
  for (const error of [
    'constructor',
    'toString',
    '__proto__',
    'hasOwnProperty',
    '',
    undefined,
    null,
    5,
  ])
    assert.equal(
      describeFailure({ status: 400, error }),
      'The server answered with an unknown error (400).',
      String(error),
    );
});

test('[beemaps-frames-009] writes the text of each reason that a view cannot give a box', () => {
  assert.equal(
    describeReason('sky'),
    'Point the view at the ground and press again.',
  );
  assert.equal(
    describeReason('latitude'),
    'Move the view to a latitude from -80 to 80 degrees and press again.',
  );
  assert.equal(
    describeReason('meridian'),
    'Move the view away from the 180th meridian and press again.',
  );
});

test('[beemaps-frames-007] writes the text of a status that the server did not give', () => {
  assert.equal(STATUS_FAILED, 'The server did not give the status of the key.');
});
