/**
 * Display rules of a scene layer: the style of a footprint, the text of
 * the readout, the list of the scenes, and the size and the position of the
 * thumbnail card. It does not import Cesium, so the tests run on the host.
 */
import { t } from '../../i18n/index.js';
import { serviceOf } from './services.js';

const CARD_SIDE = 192;
const STYLE = Object.freeze({
  false: Object.freeze({
    color: '#38bdf8',
    outlineAlpha: 0.9,
    width: 2,
    fillAlpha: 0,
  }),
  true: Object.freeze({
    color: '#facc15',
    outlineAlpha: 1,
    width: 3,
    fillAlpha: 0.25,
  }),
});

/** The UTC date of a time, with the form YYYY-MM-DD. */
export const dateOf = (time) => new Date(time).toISOString().slice(0, 10);

/** The color (CSS text), the alphas and the width of a footprint. */
export function footprintStyle(selected) {
  return { ...STYLE[selected === true] };
}

function answerText({ scenes, truncated, used, limit }, label) {
  const parts = [
    `${scenes.length} ${scenes.length === 1 ? 'scene' : 'scenes'}`,
  ];
  if (scenes.length > 0) {
    const newest = Math.max(...scenes.map((scene) => scene.time));
    parts[0] += ` · newest ${dateOf(newest)}`;
  }
  if (truncated) parts.push(`${label} has more scenes`);
  if (used !== null && limit !== null) {
    parts.push(`searches today ${used} of ${limit}`);
  }
  return parts.join(' · ');
}

const hint = (label) =>
  `A press searches 92 days of the ${label} archive in a 48 km box at the view centre.`;

/**
 * The one line of the row: the message, the text of the answer and the
 * message of the thumbnail, or the message or the hint with no answer.
 */
function readoutText({ message, answer, thumbMessage = null }, label) {
  if (answer === null) return message || hint(label);
  return [message, answerText(answer, label), thumbMessage]
    .filter(Boolean)
    .join(' · ');
}

function sceneText(scene, label) {
  const parts = [];
  if (scene.provider !== null) parts.push(scene.provider);
  if (scene.resolutionM !== null) {
    parts.push(`${Number(scene.resolutionM.toFixed(2))} m`);
  }
  if (scene.cloudPercent !== null) {
    parts.push(`cloud ${Math.round(scene.cloudPercent)}%`);
  }
  if (!scene.thumbnail) parts.push('no thumbnail');
  return parts.length > 0 ? parts.join(' · ') : `${label} scene`;
}

/** The ordered list of the row: one item for each scene of the answer, or null. */
function sceneList({ answer, selectedId }, label, list) {
  if (!answer?.scenes.length) return null;
  return {
    ariaLabel: t(list),
    items: answer.scenes.map((scene) => {
      const active = scene.id === selectedId;
      return {
        id: `scene:${scene.id}`,
        lead: dateOf(scene.time),
        text: sceneText(scene, label),
        active,
        params: { scene: active ? null : scene.id },
      };
    }),
  };
}

/** The size of the card in pixels: the image fits a square of 192 pixels. */
export function thumbnailSize(width, height) {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }
  const scale = CARD_SIDE / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** The mean longitude and latitude of each position of a ring, except the last. */
export function footprintCentre(ring) {
  const positions = ring.slice(0, -1);
  const mean = (index) =>
    positions.reduce((sum, position) => sum + position[index], 0) /
    positions.length;
  return { lon: mean(0), lat: mean(1) };
}

/**
 * The display rules of one service.
 * @param {'planet'|'skyfi'} serviceName
 */
export function modelFor(serviceName) {
  const { label, list } = serviceOf(serviceName);
  return {
    HINT: hint(label),
    dateOf,
    footprintStyle,
    footprintCentre,
    thumbnailSize,
    readoutText: (state) => readoutText(state, label),
    sceneList: (state) => sceneList(state, label, list),
  };
}
