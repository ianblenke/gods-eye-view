import * as Cesium from 'cesium';

/** Own the image queue and object URLs of one answer. */
export function createSceneImages({ source, entities, changed }) {
  let batch = null;

  function release() {
    if (batch === null) return;
    batch.controller.abort();
    for (const [id, url] of batch.urls) {
      entities().removeById(id);
      URL.revokeObjectURL(url);
    }
    batch = null;
  }

  function start(scenes) {
    release();
    const selected = scenes
      .filter((scene) => scene.thumbnail)
      .sort((a, b) => {
        if (a.time !== b.time) return b.time - a.time;
        return a.id < b.id ? -1 : 1;
      })
      .slice(0, 24);
    const own = {
      controller: new AbortController(),
      urls: new Map(),
      failed: 0,
    };
    batch = own;
    let next = 0;
    const { signal } = own.controller;

    async function worker() {
      while (!signal.aborted && next < selected.length) {
        const rank = next++;
        const scene = selected[rank];
        let url = null;
        try {
          const result = await source.getThumbnail({ id: scene.id, signal });
          if (signal.aborted) return;
          if (!result.ok) throw new Error('Thumbnail request failed');
          url = URL.createObjectURL(result.blob);
          const entity = entities().add(
            new Cesium.Entity({
              id: `up42-scenes:image:${scene.id}`,
              polygon: {
                hierarchy: new Cesium.PolygonHierarchy(
                  Cesium.Cartesian3.fromDegreesArray(scene.ring.flat()),
                ),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                perPositionHeight: false,
                zIndex: selected.length - rank,
                material: new Cesium.ImageMaterialProperty({
                  image: url,
                  transparent: true,
                  color: Cesium.Color.WHITE.withAlpha(0.85),
                }),
              },
            }),
          );
          own.urls.set(entity.id, url);
        } catch {
          if (url !== null) URL.revokeObjectURL(url);
          if (signal.aborted) return;
          own.failed += 1;
        }
        changed();
      }
    }

    for (let count = 0; count < Math.min(4, selected.length); count += 1)
      void worker();
  }

  return {
    start,
    release,
    text() {
      return `Images shown: ${batch.urls.size}; failed: ${batch.failed}.`;
    },
  };
}
