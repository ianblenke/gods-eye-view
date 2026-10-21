/** The texts that the layer shows for a failure of a route or of the view. */

const CROSS_ORIGIN =
  'The server refused the request, because the request did not come from the same site.';
const UNREACHABLE = 'The server did not answer.';
const BAD_ANSWER = 'The server sent an answer that the layer cannot read.';
const REFUSED = 'The server refused the request.';

const SEARCH = Object.freeze({
  cross_origin: CROSS_ORIGIN,
  key_rejected: 'SkyWatch refused the key. Check SKYWATCH_API_KEY in .env.',
  no_key: 'No SkyWatch key. Set SKYWATCH_API_KEY in .env and restart the app.',
  rate_limited: 'Too many searches. Wait 60 seconds.',
  search_timeout:
    'SkyWatch did not complete the search in time. Press again later.',
  upstream_failed: 'SkyWatch did not answer correctly.',
  bad_upstream: 'SkyWatch did not answer correctly.',
  bad_dates: 'The server refused the dates. Check the clock of this computer.',
  bad_body: REFUSED,
  bad_bbox: REFUSED,
  area_too_large: REFUSED,
  unreachable: UNREACHABLE,
  bad_answer: BAD_ANSWER,
});
const THUMBNAIL = Object.freeze({
  thumbnails_off:
    'Thumbnails are off. Set SKYWATCH_THUMBNAILS=true in .env and restart the app.',
  unknown_scene: 'The server does not keep this scene now. Search again.',
  rate_limited: 'Too many thumbnail requests. Wait 60 seconds.',
  upstream_failed: 'SkyWatch did not give the thumbnail.',
  bad_upstream: 'SkyWatch did not give the thumbnail.',
  cross_origin: CROSS_ORIGIN,
  unreachable: UNREACHABLE,
  bad_answer: BAD_ANSWER,
  bad_image: 'The layer cannot show the thumbnail.',
});
const REASONS = Object.freeze({
  sky: 'Point the view at the ground and press again.',
  latitude:
    'Move the view to a latitude from -80 to 80 degrees and press again.',
  meridian: 'Move the view away from the 180th meridian and press again.',
});

/** The text for a status that the server did not give. */
export const STATUS_FAILED = 'The server did not give the status of the key.';
/** The text while a thumbnail request runs. */
export const LOADING_THUMBNAIL = 'Loading the thumbnail…';
/** The text for a scene that has no thumbnail. */
export const NO_THUMBNAIL = 'SkyWatch has no thumbnail for this scene.';

const whole = (value) => Number.isInteger(value) && value >= 0;
const unknown = (status) =>
  `The server answered with an unknown error (${status}).`;

/** The text for a failed search: `{status, error, limit?, retryAfter?}`. */
export function describeFailure({ status, error, limit, retryAfter }) {
  if (error === 'budget') {
    return whole(limit)
      ? `The daily limit of ${limit} ${limit === 1 ? 'search' : 'searches'} is used.`
      : 'The daily limit is used.';
  }
  if (error === 'upstream_rate_limit') {
    return whole(retryAfter)
      ? `SkyWatch asks you to wait ${retryAfter} ${retryAfter === 1 ? 'second' : 'seconds'}.`
      : 'SkyWatch asks you to wait.';
  }
  return Object.hasOwn(SEARCH, error) ? SEARCH[error] : unknown(status);
}

/** The text for a failed thumbnail: `{status, error}`. */
export function describeThumbnailFailure({ status, error }) {
  return Object.hasOwn(THUMBNAIL, error) ? THUMBNAIL[error] : unknown(status);
}

/** The text for a view that cannot give a box. */
export function describeReason(reason) {
  return REASONS[reason];
}
