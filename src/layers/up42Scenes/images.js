/** Own the image queue and object URLs of one answer. */
export function createSceneImages({ source, images, changed, decodeImage }) {
  let batch = null;

  function release() {
    if (batch === null) return;
    batch.controller.abort();
    images().clear();
    for (const url of batch.urls.values()) {
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
      items: new Map(),
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
          const bitmap = await decodeImage(result.blob);
          if (bitmap !== null) bitmap.close();
          if (signal.aborted) return;
          if (bitmap === null) throw new Error('Thumbnail decode failed');
          url = URL.createObjectURL(result.blob);
          // shortcut: the image draws opaque, not at alpha 0.85, and the
          // outlines are not forced above it; upgrade when the draw port has
          // image alpha and a draw order for draped sets.
          const id = `up42-scenes:image:${scene.id}`;
          const item = {
            id,
            geometry: {
              kind: 'polygon',
              rings: [scene.ring.map(([lon, lat]) => ({ lon, lat }))],
            },
            fill: { image: url },
            height: 'clampGround',
            clampTo: 'both',
          };
          // The newest scene (rank 0) draws last, so it is on top.
          const next = new Map(own.items).set(rank, item);
          images().set(
            [...next.keys()].sort((a, b) => b - a).map((key) => next.get(key)),
          );
          own.items = next;
          own.urls.set(id, url);
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
