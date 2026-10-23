import test from 'node:test';
import assert from 'node:assert/strict';
import { messagesFor } from './messages.js';

const SERVICES = [
  {
    service: 'planet',
    layer: 'planet-scenes',
    name: 'Planet Scenes',
    list: 'Planet scenes',
    label: 'Planet',
    icon: '🪐',
    key: 'PLANET_API_KEY',
    thumbs: 'PLANET_THUMBNAILS',
    route: '/api/planet',
  },
  {
    service: 'skyfi',
    layer: 'skyfi-scenes',
    name: 'SkyFi Scenes',
    list: 'SkyFi scenes',
    label: 'SkyFi',
    icon: '🛰',
    key: 'SKYFI_API_KEY',
    thumbs: 'SKYFI_THUMBNAILS',
    route: '/api/skyfi',
  },
];

for (const S of SERVICES) {
  const {
    LOADING_THUMBNAIL,
    NO_THUMBNAIL,
    STATUS_FAILED,
    describeFailure,
    describeReason,
    describeThumbnailFailure,
  } = messagesFor(S.service);

  const CROSS_ORIGIN =
    'The server refused the request, because the request did not come from the same site.';

  test(`[scene-layers-016] ${S.label}: names each failure of a search with the text of its sample`, () => {
    const rows = [
      [{ status: 403, error: 'cross_origin' }, CROSS_ORIGIN],
      [
        { status: 403, error: 'key_rejected' },
        `${S.label} refused the key. Check ${S.key} in .env.`,
      ],
      [
        { status: 503, error: 'no_key' },
        `No ${S.label} key. Set ${S.key} in .env and restart the app.`,
      ],
      [
        { status: 429, error: 'rate_limited' },
        'Too many searches. Wait 60 seconds.',
      ],
      [
        { status: 504, error: 'search_timeout' },
        `${S.label} did not complete the search in time. Press again later.`,
      ],
      [
        { status: 502, error: 'upstream_failed' },
        `${S.label} did not answer correctly.`,
      ],
      [
        { status: 502, error: 'bad_upstream' },
        `${S.label} did not answer correctly.`,
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

  test(`[scene-layers-016] ${S.label}: names the daily limit with its count, in the singular for 1`, () => {
    const budget = (limit) =>
      describeFailure({ status: 429, error: 'budget', limit });
    assert.equal(budget(20), 'The daily limit of 20 searches is used.');
    assert.equal(budget(1), 'The daily limit of 1 search is used.');
    assert.equal(budget(0), 'The daily limit of 0 searches is used.');
    assert.equal(budget(2), 'The daily limit of 2 searches is used.');
    for (const limit of [undefined, null, -1, 2.5, '20'])
      assert.equal(budget(limit), 'The daily limit is used.', String(limit));
  });

  test(`[scene-layers-016] ${S.label}: names the wait of ${S.label} with its seconds, in the singular for 1`, () => {
    const wait = (retryAfter) =>
      describeFailure({
        status: 429,
        error: 'upstream_rate_limit',
        retryAfter,
      });
    assert.equal(wait(30), `${S.label} asks you to wait 30 seconds.`);
    assert.equal(wait(1), `${S.label} asks you to wait 1 second.`);
    assert.equal(wait(0), `${S.label} asks you to wait 0 seconds.`);
    assert.equal(wait(2), `${S.label} asks you to wait 2 seconds.`);
    for (const retryAfter of [undefined, null, -1, 2.5, '30'])
      assert.equal(
        wait(retryAfter),
        `${S.label} asks you to wait.`,
        String(retryAfter),
      );
  });

  test(`[scene-layers-017] ${S.label}: names each failure of a thumbnail with the text of its sample`, () => {
    const rows = [
      [
        { status: 404, error: 'thumbnails_off' },
        `Thumbnails are off. Remove ${S.thumbs}=false from .env and restart the app.`,
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
        `${S.label} did not give the thumbnail.`,
      ],
      [
        { status: 502, error: 'bad_upstream' },
        `${S.label} did not give the thumbnail.`,
      ],
      [{ status: 403, error: 'cross_origin' }, CROSS_ORIGIN],
      [{ status: 0, error: 'unreachable' }, 'The server did not answer.'],
      [
        { status: 200, error: 'bad_answer' },
        'The server sent an answer that the layer cannot read.',
      ],
      [
        { status: 0, error: 'bad_image' },
        'The layer cannot show the thumbnail.',
      ],
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

  test(`[scene-layers-009] ${S.label}: names each reason of a view that has no box`, () => {
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

  test(`[scene-layers-007 scene-layers-028] ${S.label}: gives the fixed texts of the status and the thumbnail`, () => {
    assert.equal(
      STATUS_FAILED,
      'The server did not give the status of the key.',
    );
    assert.equal(LOADING_THUMBNAIL, 'Loading the thumbnail…');
    assert.equal(NO_THUMBNAIL, `${S.label} has no thumbnail for this scene.`);
  });
}
