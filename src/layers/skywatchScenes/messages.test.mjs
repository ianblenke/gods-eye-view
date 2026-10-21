import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOADING_THUMBNAIL,
  NO_THUMBNAIL,
  STATUS_FAILED,
  describeFailure,
  describeReason,
  describeThumbnailFailure,
} from './messages.js';

const CROSS_ORIGIN =
  'The server refused the request. The proxy must remove the X-Forwarded headers.';

test('[skywatch-scenes-layer-018] names each failure of a search with the text of its row', () => {
  const rows = [
    [{ status: 403, error: 'cross_origin' }, CROSS_ORIGIN],
    [
      { status: 403, error: 'key_rejected' },
      'SkyWatch refused the key. Check SKYWATCH_API_KEY in .env.',
    ],
    [
      { status: 503, error: 'no_key' },
      'No SkyWatch key. Set SKYWATCH_API_KEY in .env and restart the app.',
    ],
    [
      { status: 429, error: 'rate_limited' },
      'Too many searches. Wait 60 seconds.',
    ],
    [
      { status: 504, error: 'search_timeout' },
      'SkyWatch did not complete the search in time. Press again later.',
    ],
    [
      { status: 502, error: 'upstream_failed' },
      'SkyWatch did not answer correctly.',
    ],
    [
      { status: 502, error: 'bad_upstream' },
      'SkyWatch did not answer correctly.',
    ],
    [
      { status: 400, error: 'bad_dates' },
      'The server refused the dates. Check the clock of this computer.',
    ],
    [{ status: 400, error: 'bad_body' }, 'The server refused the request.'],
    [{ status: 400, error: 'bad_bbox' }, 'The server refused the request.'],
    [
      { status: 400, error: 'area_too_large' },
      'The server refused the request.',
    ],
    [{ status: 0, error: 'unreachable' }, 'The server did not answer.'],
    [
      { status: 200, error: 'bad_answer' },
      'The server sent an answer that the layer cannot read.',
    ],
    [
      { status: 418, error: 'teapot' },
      'The server answered with an unknown error (418).',
    ],
    [
      { status: 418, error: 'toString' },
      'The server answered with an unknown error (418).',
    ],
    [
      { status: 418, error: '__proto__' },
      'The server answered with an unknown error (418).',
    ],
  ];
  for (const [failure, text] of rows)
    assert.equal(describeFailure(failure), text, failure.error);
});

test('[skywatch-scenes-layer-018] names the daily limit with its count, in the singular for 1', () => {
  const budget = (limit) =>
    describeFailure({ status: 429, error: 'budget', limit });
  assert.equal(budget(20), 'The daily limit of 20 searches is used.');
  assert.equal(budget(1), 'The daily limit of 1 search is used.');
  assert.equal(budget(0), 'The daily limit of 0 searches is used.');
  assert.equal(budget(2), 'The daily limit of 2 searches is used.');
  for (const limit of [undefined, null, -1, 2.5, '20'])
    assert.equal(budget(limit), 'The daily limit is used.', String(limit));
});

test('[skywatch-scenes-layer-018] names the wait of SkyWatch with its seconds, in the singular for 1', () => {
  const wait = (retryAfter) =>
    describeFailure({ status: 429, error: 'upstream_rate_limit', retryAfter });
  assert.equal(wait(30), 'SkyWatch asks you to wait 30 seconds.');
  assert.equal(wait(1), 'SkyWatch asks you to wait 1 second.');
  assert.equal(wait(0), 'SkyWatch asks you to wait 0 seconds.');
  assert.equal(wait(2), 'SkyWatch asks you to wait 2 seconds.');
  for (const retryAfter of [undefined, null, -1, 2.5, '30'])
    assert.equal(
      wait(retryAfter),
      'SkyWatch asks you to wait.',
      String(retryAfter),
    );
});

test('[skywatch-scenes-layer-019] names each failure of a thumbnail with the text of its row', () => {
  const rows = [
    [
      { status: 404, error: 'thumbnails_off' },
      'Thumbnails are off. Set SKYWATCH_THUMBNAILS=true in .env and restart the app.',
    ],
    [
      { status: 404, error: 'unknown_scene' },
      'The server does not keep this scene now. Search again.',
    ],
    [
      { status: 429, error: 'rate_limited' },
      'Too many thumbnail requests. Wait 60 seconds.',
    ],
    [
      { status: 502, error: 'upstream_failed' },
      'SkyWatch did not give the thumbnail.',
    ],
    [
      { status: 502, error: 'bad_upstream' },
      'SkyWatch did not give the thumbnail.',
    ],
    [{ status: 403, error: 'cross_origin' }, CROSS_ORIGIN],
    [{ status: 0, error: 'unreachable' }, 'The server did not answer.'],
    [
      { status: 200, error: 'bad_answer' },
      'The server sent an answer that the layer cannot read.',
    ],
    [{ status: 0, error: 'bad_image' }, 'The layer cannot show the thumbnail.'],
    [
      { status: 405, error: 'Method not allowed' },
      'The server answered with an unknown error (405).',
    ],
    [
      { status: 405, error: 'toString' },
      'The server answered with an unknown error (405).',
    ],
    [
      { status: 405, error: 'no_key' },
      'The server answered with an unknown error (405).',
    ],
  ];
  for (const [failure, text] of rows)
    assert.equal(describeThumbnailFailure(failure), text, failure.error);
});

test('[skywatch-scenes-layer-009] names each reason of a view that has no box', () => {
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

test('[skywatch-scenes-layer-007 skywatch-scenes-layer-030] gives the fixed texts of the status and the thumbnail', () => {
  assert.equal(STATUS_FAILED, 'The server did not give the status of the key.');
  assert.equal(LOADING_THUMBNAIL, 'Loading the thumbnail…');
  assert.equal(NO_THUMBNAIL, 'SkyWatch has no thumbnail for this scene.');
});
