/** The texts that the layer shows for a failure of the route or of the view. */

const FIXED = Object.freeze({
  cross_origin:
    'Only the machine that runs the server can fetch frames. Start the app with make up-codex.',
  key_rejected: 'Bee Maps refused the key. Check BEEMAPS_API_KEY in .env.',
  no_key: 'No Bee Maps key. Set BEEMAPS_API_KEY in .env and restart the app.',
  rate_limited: 'Too many presses. Wait 60 seconds.',
  no_credit: 'The Bee Maps account has no credit.',
  upstream_failed: 'Bee Maps did not answer correctly.',
  bad_upstream: 'Bee Maps did not answer correctly.',
  budget_unavailable: 'The server cannot use its budget file.',
  bad_area: 'The server refused the area.',
  area_too_large: 'The server refused the area.',
  bad_body: 'The server refused the area.',
  bad_since: 'The server refused the area.',
  bad_limit: 'The server refused the area.',
  unreachable: 'The server did not answer.',
  bad_answer: 'The server sent an answer that the layer cannot read.',
});
const REASONS = Object.freeze({
  sky: 'Point the view at the ground and press again.',
  latitude: 'Move the view to a latitude below 80 degrees and press again.',
  meridian: 'Move the view away from the 180th meridian and press again.',
});

const whole = (value) => Number.isInteger(value) && value >= 0;

/** The text for a failed request: `{status, error, limit?, retryAfter?}`. */
export function describeFailure({ status, error, limit, retryAfter }) {
  if (error === 'budget') {
    return whole(limit)
      ? `The daily limit of ${limit} requests is used.`
      : 'The daily limit is used.';
  }
  if (error === 'upstream_rate_limit') {
    return whole(retryAfter)
      ? `Bee Maps asks you to wait ${retryAfter} seconds.`
      : 'Bee Maps asks you to wait.';
  }
  if (typeof error === 'string' && Object.hasOwn(FIXED, error)) {
    return FIXED[error];
  }
  return `The server answered with an unknown error (${status}).`;
}

/** The text for a view that cannot give a box. */
export function describeReason(reason) {
  return REASONS[reason];
}
