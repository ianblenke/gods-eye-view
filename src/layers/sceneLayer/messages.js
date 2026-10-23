import { serviceOf } from './services.js';

/** The texts that a scene layer shows for a failure of a route or of the view. */

const CROSS_ORIGIN =
  'The server refused the request, because the request did not come from the same site.';
const UNREACHABLE = 'The server did not answer.';
const BAD_ANSWER = 'The server sent an answer that the layer cannot read.';
const REFUSED = 'The server refused the request.';
const REASONS = Object.freeze({
  sky: 'Point the view at the ground and press again.',
  latitude:
    'Move the view to a latitude from -80 to 80 degrees and press again.',
  meridian: 'Move the view away from the 180th meridian and press again.',
});
const whole = (value) => Number.isInteger(value) && value >= 0;
const unknown = (status) =>
  `The server answered with an unknown error (${status}).`;

/**
 * The texts of one service.
 * @param {'planet'|'skyfi'} serviceName
 */
export function messagesFor(serviceName) {
  const { label, key, thumbs } = serviceOf(serviceName);
  const SEARCH = Object.freeze({
    cross_origin: CROSS_ORIGIN,
    key_rejected: `${label} refused the key. Check ${key} in .env.`,
    no_key: `No ${label} key. Set ${key} in .env and restart the app.`,
    rate_limited: 'Too many searches. Wait 60 seconds.',
    search_timeout: `${label} did not complete the search in time. Press again later.`,
    upstream_failed: `${label} did not answer correctly.`,
    bad_upstream: `${label} did not answer correctly.`,
    bad_dates:
      'The server refused the dates. Check the clock of this computer.',
    bad_body: REFUSED,
    bad_bbox: REFUSED,
    area_too_large: REFUSED,
    unreachable: UNREACHABLE,
    bad_answer: BAD_ANSWER,
  });
  const THUMBNAIL = Object.freeze({
    thumbnails_off: `Thumbnails are off. Remove ${thumbs}=false from .env and restart the app.`,
    unknown_scene: 'The server does not keep this scene now. Search again.',
    rate_limited: 'Too many thumbnail requests. Wait 60 seconds.',
    upstream_failed: `${label} did not give the thumbnail.`,
    bad_upstream: `${label} did not give the thumbnail.`,
    cross_origin: CROSS_ORIGIN,
    unreachable: UNREACHABLE,
    bad_answer: BAD_ANSWER,
    bad_image: 'The layer cannot show the thumbnail.',
  });
  return {
    /** The text for a status that the server did not give. */
    STATUS_FAILED: 'The server did not give the status of the key.',
    /** The text while a thumbnail request runs. */
    LOADING_THUMBNAIL: 'Loading the thumbnail…',
    /** The text for a scene that has no thumbnail. */
    NO_THUMBNAIL: `${label} has no thumbnail for this scene.`,

    /** The text for a failed search: `{status, error, limit?, retryAfter?}`. */
    describeFailure({ status, error, limit, retryAfter }) {
      if (error === 'budget') {
        return whole(limit)
          ? `The daily limit of ${limit} ${limit === 1 ? 'search' : 'searches'} is used.`
          : 'The daily limit is used.';
      }
      if (error === 'upstream_rate_limit') {
        return whole(retryAfter)
          ? `${label} asks you to wait ${retryAfter} ${retryAfter === 1 ? 'second' : 'seconds'}.`
          : `${label} asks you to wait.`;
      }
      return Object.hasOwn(SEARCH, error) ? SEARCH[error] : unknown(status);
    },

    /** The text for a failed thumbnail: `{status, error}`. */
    describeThumbnailFailure({ status, error }) {
      return Object.hasOwn(THUMBNAIL, error)
        ? THUMBNAIL[error]
        : unknown(status);
    },

    /** The text for a view that cannot give a box. */
    describeReason(reason) {
      return REASONS[reason];
    },
  };
}
