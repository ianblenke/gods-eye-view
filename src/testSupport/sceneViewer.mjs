/**
 * A viewer double for the scene layers (SkyWatch, Planet, SkyFi, UP42): a
 * canvas, a query port whose `pickEllipsoid` answers `pick` and records its
 * arguments, and a fake draw port. `set(suffix)` is the live set the layer
 * made with the id `<layer id>:<suffix>`, and `ids(suffix)` its item ids.
 */
import { bindFakeDraw } from './fakeDrawPort.mjs';

export function sceneViewer({ layerId, pick, canvas }) {
  const picks = [];
  const viewer = { scene: { canvas } };
  const { draw } = bindFakeDraw(viewer, {
    query: {
      pickEllipsoid: (x, y) => {
        picks.push([x, y]);
        return pick(x, y);
      },
    },
  });
  const set = (suffix) => draw.set(`${layerId}:${suffix}`);
  return {
    viewer,
    draw,
    picks,
    set,
    ids: (suffix) => [...set(suffix).items.keys()],
    item: (suffix, id) => set(suffix).items.get(`${layerId}:${id}`),
  };
}
