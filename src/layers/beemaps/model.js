/**
 * Display rules of the Bee Maps layer: the style of a point and the text of
 * the readout. It does not import Cesium, so the tests run on the host.
 */

export const POINT_COLOR = '#f59e0b';
const WEEK_MS = 604_800_000;
const MONTH_MS = 2_592_000_000;
export const HINT =
  'A press asks for the newest frames in a box of 300 m by 300 m at the view centre. It can cost money.';

/** The color (CSS text), the alpha and the size in pixels of the point of a frame. */
export function pointStyle(time, now) {
  const age = now - time;
  if (age < WEEK_MS) return { color: POINT_COLOR, alpha: 1, size: 8 };
  if (age < MONTH_MS) return { color: POINT_COLOR, alpha: 0.7, size: 7 };
  return { color: POINT_COLOR, alpha: 0.4, size: 6 };
}

function answerText({ frames, used, limit, remaining }) {
  const parts = [
    `${frames.length} ${frames.length === 1 ? 'frame' : 'frames'}`,
  ];
  if (frames.length > 0) {
    const newest = Math.max(...frames.map((frame) => frame.time));
    parts[0] += ` · newest ${new Date(newest).toISOString().slice(0, 10)}`;
  }
  if (used !== null && limit !== null) {
    parts.push(`requests today ${used} of ${limit}`);
  }
  if (remaining !== null) parts.push(`credits left ${remaining}`);
  return parts.join(' · ');
}

/** The one line of the row: the message, then the text of the answer, or the hint. */
export function readoutText({ message, answer }) {
  if (answer === null) return message || HINT;
  return message ? `${message} · ${answerText(answer)}` : answerText(answer);
}
