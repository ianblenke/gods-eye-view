/**
 * Display rules of the Bee Maps Bursts layer: the labels and titles of the
 * chips, the style of a box and the text of the readout. It does not import
 * Cesium, so the tests run on the host.
 */

export const HINT =
  'A quote shows the price of a burst in 4 km² at the view centre. A quote costs nothing. A confirm request takes credits and cannot be undone.';

export const LABELS = Object.freeze({
  quote: 'Quote burst here',
  quoting: 'Quoting…',
  sending: 'Sending…',
  cancel: 'Cancel quote',
  list: 'Check my bursts',
  listing: 'Checking…',
});
export const TITLES = Object.freeze({
  quote: 'Ask for the price of a burst. A quote costs nothing.',
  confirm: 'Create the burst. This takes credits and cannot be undone.',
  cancel: 'Cancel the quote. Nothing is sent.',
  list: 'Ask Bee Maps for your bursts. This can cost money.',
});

export const QUOTE_STYLE = Object.freeze({ color: '#f59e0b', alpha: 0.3 });

/** The color (CSS text) and the alpha of the box of a burst. */
export function burstStyle({ status, isHit }) {
  if (isHit) return { color: '#22c55e', alpha: 0.35 };
  if (status === 'active') return { color: '#38bdf8', alpha: 0.25 };
  return { color: '#9ca3af', alpha: 0.2 };
}

/** The label of the Confirm chip of a quote. */
export function confirmLabel({ credits, areaKm2 }) {
  return `Confirm: ${credits} credits, ${areaKm2} km²`;
}

/** The text of a quote. */
export function quoteText({ credits, areaKm2, expiresInSeconds, budget }) {
  const seconds = expiresInSeconds === 1 ? 'second' : 'seconds';
  return `Quote: ${credits} credits for ${areaKm2} km² · credits used today ${budget.used} of ${budget.limit} · valid for ${expiresInSeconds} ${seconds}`;
}

/** The text of the bursts that the layer knows: `{bursts, total, cached}`. */
export function burstsText({ bursts, total, cached }) {
  const count = bursts.length;
  const hits = bursts.filter((burst) => burst.isHit).length;
  const parts = [`${count} ${count === 1 ? 'burst' : 'bursts'}`];
  if (total !== null && total > count) parts[0] += ` (${total} in all)`;
  parts.push(`${hits} ${hits === 1 ? 'hit' : 'hits'}`);
  if (cached) parts.push('stored answer');
  return parts.join(' · ');
}

/**
 * The one line of the row: the message, the quote and the bursts, or the hint.
 * @param {{message:string|null, quote:object|null, list:{bursts:object[], total:number|null, cached:boolean}|null}} state
 */
export function readoutText({ message, quote, list }) {
  const parts = [];
  if (message) parts.push(message);
  if (quote) parts.push(quoteText(quote));
  if (list) parts.push(burstsText(list));
  return parts.length > 0 ? parts.join(' · ') : HINT;
}
