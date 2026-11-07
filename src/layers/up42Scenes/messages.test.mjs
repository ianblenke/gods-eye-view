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
  'The server refused the request, because the request did not come from the same site.';

test('[up42-scenes-layer-018] names each failure of a search with the text of its sample', () => {
  const rows = [
    [{ status: 403, error: 'cross_origin' }, CROSS_ORIGIN],
    [
      { status: 403, error: 'credentials_rejected' },
      'UP42 refused the credentials. Check UP42_USERNAME and UP42_PASSWORD in .env.',
    ],
    [
      { status: 503, error: 'no_credentials' },
      'No UP42 credentials. Set UP42_USERNAME and UP42_PASSWORD in .env and restart the app.',
    ],
    [
      { status: 429, error: 'rate_limited' },
      'Too many searches. Wait 60 seconds.',
    ],
    [
      { status: 504, error: 'search_timeout' },
      'UP42 did not complete the search in time. Press again later.',
    ],
    [
      { status: 502, error: 'upstream_failed' },
      'UP42 did not answer correctly.',
    ],
    [{ status: 502, error: 'bad_upstream' }, 'UP42 did not answer correctly.'],
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

test('[up42-scenes-layer-018] names both daily counts and refuses other counts', () => {
  assert.equal(
    describeFailure({ status: 429, error: 'budget', used: 23, limit: 27 }),
    'No more searches today. Searches today 23 of 27.',
  );
  assert.equal(
    describeFailure({ status: 429, error: 'budget', used: 0, limit: 1 }),
    'No more searches today. Searches today 0 of 1.',
  );
  for (const value of [undefined, null, -1, 2.5, '20']) {
    assert.equal(
      describeFailure({ status: 429, error: 'budget', used: value, limit: 20 }),
      'No more searches today.',
    );
    assert.equal(
      describeFailure({ status: 429, error: 'budget', used: 20, limit: value }),
      'No more searches today.',
    );
  }
});

test('[up42-scenes-layer-018] names the wait of UP42 with its seconds, in the singular for 1', () => {
  const wait = (retryAfter) =>
    describeFailure({ status: 429, error: 'upstream_rate_limit', retryAfter });
  assert.equal(wait(30), 'UP42 asks you to wait 30 seconds.');
  assert.equal(wait(1), 'UP42 asks you to wait 1 second.');
  assert.equal(wait(0), 'UP42 asks you to wait 0 seconds.');
  assert.equal(wait(2), 'UP42 asks you to wait 2 seconds.');
  for (const retryAfter of [undefined, null, -1, 2.5, '30'])
    assert.equal(
      wait(retryAfter),
      'UP42 asks you to wait.',
      String(retryAfter),
    );
});

test('[up42-scenes-layer-019] names each failure of a thumbnail with the text of its sample', () => {
  const rows = [
    [
      { status: 404, error: 'thumbnails_off' },
      'Thumbnails are off. Set UP42_THUMBNAILS=true in .env and restart the app.',
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
      'UP42 did not give the thumbnail.',
    ],
    [
      { status: 502, error: 'bad_upstream' },
      'UP42 did not give the thumbnail.',
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
      { status: 405, error: 'unlisted' },
      'The server answered with an unknown error (405).',
    ],
  ];
  for (const [failure, text] of rows)
    assert.equal(describeThumbnailFailure(failure), text, failure.error);
});

test('[up42-scenes-layer-019] names credential and time failures of a thumbnail', () => {
  assert.equal(
    describeThumbnailFailure({ status: 403, error: 'credentials_rejected' }),
    'UP42 refused the credentials. Check UP42_USERNAME and UP42_PASSWORD in .env.',
  );
  assert.equal(
    describeThumbnailFailure({ status: 503, error: 'no_credentials' }),
    'No UP42 credentials. Set UP42_USERNAME and UP42_PASSWORD in .env and restart the app.',
  );
  assert.equal(
    describeThumbnailFailure({ status: 504, error: 'search_timeout' }),
    'UP42 did not give the thumbnail in time. Select the scene again later.',
  );
});

test('[up42-scenes-layer-009] names each reason of a view that has no box', () => {
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

test('[up42-scenes-layer-007 up42-scenes-layer-030] gives the fixed texts of the status and the thumbnail', () => {
  assert.equal(
    STATUS_FAILED,
    'The server did not give the status of the credentials.',
  );
  assert.equal(LOADING_THUMBNAIL, 'Loading the thumbnail…');
  assert.equal(NO_THUMBNAIL, 'UP42 has no thumbnail for this scene.');
});

test('[up42-scenes-layer-040] gives local messages for unknown errors and a missing thumbnail route', () => {
  assert.equal(
    describeFailure({ status: 502, error: 'SECRET_UPSTREAM' }),
    'The server answered with an unknown error (502).',
  );
  assert.equal(
    describeThumbnailFailure({ status: 404, error: 'unknown' }),
    'Thumbnails are off. Set UP42_THUMBNAILS=true in .env and restart the app.',
  );
  assert.equal(
    describeThumbnailFailure({ status: 404, error: 'bad_answer' }),
    'Thumbnails are off. Set UP42_THUMBNAILS=true in .env and restart the app.',
  );
});
