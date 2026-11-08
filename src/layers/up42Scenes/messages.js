/** The texts that the layer shows for a failure of a route or of the view. */

const CROSS_ORIGIN =
  'The server refused the request, because the request did not come from the same site.';
const UNREACHABLE = 'The server did not answer.';
const BAD_ANSWER = 'The server sent an answer that the layer cannot read.';
const REFUSED = 'The server refused the request.';

const SEARCH = Object.freeze({
  cross_origin: CROSS_ORIGIN,
  credentials_rejected:
    'UP42 refused the credentials. Check UP42_USERNAME and UP42_PASSWORD in .env.',
  no_credentials:
    'No UP42 credentials. Set UP42_USERNAME and UP42_PASSWORD in .env and restart the app.',
  rate_limited: 'Too many searches. Wait 60 seconds.',
  search_timeout:
    'UP42 did not complete the search in time. Press again later.',
  upstream_failed: 'UP42 did not answer correctly.',
  bad_upstream: 'UP42 did not answer correctly.',
  bad_dates: 'The server refused the dates. Check the clock of this computer.',
  bad_body: REFUSED,
  bad_bbox: REFUSED,
  area_too_large: REFUSED,
  unreachable: UNREACHABLE,
  bad_answer: BAD_ANSWER,
});
const THUMBNAIL = Object.freeze({
  no_credentials: SEARCH.no_credentials,
  credentials_rejected: SEARCH.credentials_rejected,
  search_timeout:
    'UP42 did not give the thumbnail in time. Select the scene again later.',
  thumbnails_off:
    'Thumbnails are off. Set UP42_THUMBNAILS=true in .env and restart the app.',
  unknown_scene: 'The server does not keep this scene now. Search again.',
  rate_limited: 'Too many thumbnail requests. Wait 60 seconds.',
  upstream_failed: 'UP42 did not give the thumbnail.',
  bad_upstream: 'UP42 did not give the thumbnail.',
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
export const STATUS_FAILED =
  'The server did not give the status of the credentials.';
/** The text while a thumbnail request runs. */
export const LOADING_THUMBNAIL = 'Loading the thumbnail…';
/** The text for a scene that has no thumbnail. */
export const NO_THUMBNAIL = 'UP42 has no thumbnail for this scene.';

const whole = (value) => Number.isInteger(value) && value >= 0;
const unknown = (status) =>
  `The server answered with an unknown error (${status}).`;

/** The text for a failed search: `{status, error, limit?, retryAfter?}`. */
export function describeFailure({ status, error, used, limit, retryAfter }) {
  if (error === 'budget') {
    return whole(used) && whole(limit)
      ? `No more searches today. Searches today ${used} of ${limit}.`
      : 'No more searches today.';
  }
  if (error === 'upstream_rate_limit') {
    return whole(retryAfter)
      ? `UP42 asks you to wait ${retryAfter} ${retryAfter === 1 ? 'second' : 'seconds'}.`
      : 'UP42 asks you to wait.';
  }
  return Object.hasOwn(SEARCH, error) ? SEARCH[error] : unknown(status);
}

/** The text for a failed thumbnail: `{status, error}`. */
export function describeThumbnailFailure({ status, error }) {
  if (status === 404 && error !== 'unknown_scene')
    return THUMBNAIL.thumbnails_off;
  return Object.hasOwn(THUMBNAIL, error) ? THUMBNAIL[error] : unknown(status);
}

/** The text for a view that cannot give a box. */
export function describeReason(reason) {
  return REASONS[reason];
}
