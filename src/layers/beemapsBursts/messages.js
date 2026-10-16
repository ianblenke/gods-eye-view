/** The texts that the layer shows for a failure of a route, of the view or of a confirm. */

const FIXED = Object.freeze({
  cross_origin:
    'Only the machine that runs the server can use bursts. Start the app with make up-codex.',
  burst_off:
    'Bursts are off on this server. Set BEEMAPS_BURST_ENABLED=true in .env and restart the app.',
  no_key:
    'No Bee Maps key for bursts. Set BEEMAPS_BURST_API_KEY in .env and restart the app.',
  rate_limited: 'Too many presses. Wait 60 seconds.',
  key_rejected:
    'Bee Maps refused the key. Check BEEMAPS_BURST_API_KEY in .env.',
  no_credit: 'The Bee Maps account has no credit.',
  budget_unavailable: 'The server cannot use its budget file.',
  ledger_unavailable:
    'The server cannot use its record of bursts. Nothing was sent.',
  log_failed: 'The server cannot write its log. Nothing was sent.',
  quote_expired: 'The quote ended. Press Quote burst here again.',
  busy: 'The server is busy with another confirm. Wait, then press Check my bursts.',
  key_reused: 'The server refused this confirm.',
  bad_request: 'Bee Maps refused the request.',
  upstream_failed: 'Bee Maps did not answer correctly.',
  bad_body: 'The server refused the request.',
  bad_area: 'The server refused the request.',
  area_too_large: 'The server refused the request.',
  bad_credits: 'The server refused the request.',
  unreachable: 'The server did not answer.',
  bad_answer: 'The server sent an answer that the layer cannot read.',
});
const REASONS = Object.freeze({
  sky: 'Point the view at the ground and press again.',
  latitude:
    'Move the view to a latitude from -80 to 80 degrees and press again.',
  meridian: 'Move the view away from the 180th meridian and press again.',
});
const UNKNOWN_OUTCOME =
  'Bee Maps can have made a burst and taken credits. Do not press Confirm again. Press Check my bursts.';

/** The text for a status that the server did not give. */
export const STATUS_FAILED =
  'The server did not give the status of the bursts.';
/** The text for a quote that ended. */
export const QUOTE_ENDED = FIXED.quote_expired;

const positive = (value) => Number.isInteger(value) && value >= 1;
const seconds = (value) => `${value} ${value === 1 ? 'second' : 'seconds'}`;

/** The text for a failed request: `{status, error, limit?, retryAfter?}`. */
export function describeFailure({ status, error, limit, retryAfter }) {
  if (error === 'budget_used') {
    return positive(limit)
      ? `The daily limit of ${limit} ${limit === 1 ? 'credit' : 'credits'} is used.`
      : 'The daily limit is used.';
  }
  if (error === 'upstream_rate_limit') {
    return positive(retryAfter)
      ? `Bee Maps asks you to wait ${seconds(retryAfter)}.`
      : 'Bee Maps asks you to wait.';
  }
  if (Object.hasOwn(FIXED, error)) return FIXED[error];
  return `The server answered with an unknown error (${status}).`;
}

/** The text for a view that cannot give a box. */
export function describeReason(reason) {
  return REASONS[reason];
}

/** The text for a confirm that may have taken credits: `{retryAfter?}`. */
export function describeUnknown({ retryAfter } = {}) {
  return positive(retryAfter)
    ? `${UNKNOWN_OUTCOME} The server refuses new confirms for ${seconds(retryAfter)}.`
    : UNKNOWN_OUTCOME;
}

/** The text for a created burst: `{burst:{credits}, creditsRemaining}`. */
export function describeCreated({ burst, creditsRemaining }) {
  const taken = `Burst created: ${burst.credits} credits taken`;
  return creditsRemaining === null
    ? `${taken}.`
    : `${taken}, ${creditsRemaining} left at Bee Maps.`;
}
