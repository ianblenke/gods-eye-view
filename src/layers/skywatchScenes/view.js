/**
 * What the scene layers (SkyWatch, Planet, SkyFi, UP42) share to draw: the
 * ground point under the middle of the screen, and the draped outline and
 * fill of footprints, made for the renderer's draw port.
 */
import { fromDegrees, toLonLatH } from '../../geo/ellipsoid.js';
import { cssColor } from '../../render/color.js';
import { canvasOf, queryOf } from '../../render/rendererOf.js';

/** The point under the middle of the screen, or null when it shows the sky. */
export function viewCentre(viewer) {
  const canvas = canvasOf(viewer);
  if (!canvas?.clientWidth || !canvas?.clientHeight) return null;
  let hit;
  try {
    hit = queryOf(viewer).pickEllipsoid(
      canvas.clientWidth / 2,
      canvas.clientHeight / 2,
    );
  } catch {
    return null;
  }
  const position = hit && toLonLatH(hit);
  return position ? { lat: position.lat, lon: position.lon } : null;
}

const withAlpha = (css, alpha) => {
  const [r, g, b] = cssColor(css);
  return [r, g, b, alpha];
};

/**
 * The draped outline of each ring, and the fill of each ring when the style
 * has one, as items of a line set and of a shape set. `idOf(index)` names
 * the item of a ring.
 */
export function footprintItems(idOf, rings, style) {
  const lines = rings.map((ring, index) => ({
    id: idOf(index),
    positions: ring.map(([lon, lat]) => fromDegrees(lon, lat)),
    widthPx: style.width,
    mode: 'draped',
    clampTo: 'both',
    style: { kind: 'solid', color: withAlpha(style.color, style.outlineAlpha) },
  }));
  const fills =
    style.fillAlpha > 0
      ? rings.map((ring, index) => ({
          id: idOf(index),
          geometry: {
            kind: 'polygon',
            rings: [ring.map(([lon, lat]) => ({ lon, lat }))],
          },
          fill: withAlpha(style.color, style.fillAlpha),
          height: 'clampGround',
          clampTo: 'both',
        }))
      : [];
  return { lines, fills };
}
