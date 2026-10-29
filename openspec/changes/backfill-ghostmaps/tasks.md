## 1. Specs and tests

- [x] 1.1 Write the delta spec before the tests.

- [x] 1.2 Add tests for `ghostmaps-001`.

  Mutation: Apply `S001` to `src/layers/ghostMaps/catalog.js`. The test must fail.

  ```json
  {"old": "dateMs = at", "new": "dateMs = null"}
  ```

- [x] 1.3 Add tests for `ghostmaps-002`.

  Mutation: Apply `S002` to `src/layers/ghostMaps/catalog.js`. The test must fail.

  ```json
  {"old": "if (ad !== bd) return ad > bd;", "new": "if (ad !== bd) return ad < bd;"}
  ```

- [x] 1.4 Add tests for `ghostmaps-003`.

  Mutation: Apply `S003` to `src/layers/ghostMaps/catalog.js`. The test must fail.

  ```json
  {"old": "newer(candidate, drop)", "new": "!drop"}
  ```

- [x] 1.5 Add tests for `ghostmaps-004`.

  Mutation: Apply `A030-right` to `src/layers/ghostMaps/catalog.js`. The test must fail.

  ```json
  {"old": "!Number.isFinite(size) || size <= 0 || size > GHOSTMAPS_MAX_FILE_BYTES", "new": "(!Number.isFinite(size) || size <= 0)"}
  ```

- [x] 1.6 Add tests for `ghostmaps-005`.

  Mutation: Apply `S005` to `src/layers/ghostMaps/catalog.js`. The test must fail.

  ```json
  {"old": "path.split('/').map(encodeURIComponent).join('/')", "new": "path.split('/').join('/')"}
  ```

- [x] 1.7 Add tests for `ghostmaps-006`.

  Mutation: Apply `A039-right` to `src/layers/ghostMaps/catalog.js`. The test must fail.

  ```json
  {"old": "match && match[2] === ref", "new": "(match)"}
  ```

- [x] 1.8 Add tests for `ghostmaps-007`.

  Mutation: Apply `FIELD-shape` to `src/layers/ghostMaps/records.js`. The test must fail.

  ```json
  {"old": "new Set(['shape', 'objectid', 'fid', 'globalid'])", "new": "new Set(['not-skipped', 'objectid', 'fid', 'globalid'])"}
  ```

- [x] 1.9 Add tests for `ghostmaps-008`.

  Mutation: Apply `S008` to `src/layers/ghostMaps/records.js`. The test must fail.

  ```json
  {"old": ".replace(/<(script|style|head)\\b[\\s\\S]*?<\\/\\1\\s*>/gi, ' ')", "new": ".replace(/never-match/g, ' ')"}
  ```

- [x] 1.10 Add tests for `ghostmaps-009`.

  Mutation: Apply `S009` to `src/layers/ghostMaps/records.js`. The test must fail.

  ```json
  {"old": "const MAX_FIELDS = 24;", "new": "const MAX_FIELDS = 23;"}
  ```

- [x] 1.11 Add tests for `ghostmaps-010`.

  Mutation: Apply `ENTITY-amp` to `src/layers/ghostMaps/records.js`. The test must fail.

  ```json
  {"old": "  amp: '&',\n", "new": ""}
  ```

- [x] 1.12 Add tests for `ghostmaps-011`.

  Mutation: Apply `S011` to `src/layers/ghostMaps/records.js`. The test must fail.

  ```json
  {"old": "return [byte(6), byte(4), byte(2), byte(0)];", "new": "return [byte(6), byte(4), 0, byte(0)];"}
  ```

- [x] 1.13 Add tests for `ghostmaps-012`.

  Mutation: Apply `A167-right` to `src/layers/ghostMaps/records.js`. The test must fail.

  ```json
  {"old": "line && lines.length < maxLines", "new": "(line)"}
  ```

- [x] 1.14 Add tests for `ghostmaps-013`.

  Mutation: Apply `S013` to `src/layers/ghostMaps/records.js`. The test must fail.

  ```json
  {"old": ".replace(/([a-z])([A-Z0-9])/g, '$1 $2')", "new": ".replace(/never-match/g, '$1 $2')"}
  ```

- [x] 1.15 Add tests for `ghostmaps-014`.

  Mutation: Apply `S014` to `server/providers/ghostMaps.js`. The test must fail.

  ```json
  {"old": "commit: head,", "new": "commit: null,"}
  ```

- [x] 1.16 Add tests for `ghostmaps-015`.

  Mutation: Apply `A013-loop` to `server/providers/ghostMaps.js`. The test must fail.

  ```json
  {"old": "await fsp.readdir(dir).catch(() => [])", "new": "[]"}
  ```

- [x] 1.17 Add tests for `ghostmaps-016`.

  Mutation: Apply `A006-left` to `server/providers/ghostMaps.js`. The test must fail.

  ```json
  {"old": "/^[0-9a-f]{40}$/.test(saved?.commit) && Array.isArray(saved.products)", "new": "(Array.isArray(saved.products))"}
  ```

- [x] 1.18 Add tests for `ghostmaps-017`.

  Mutation: Apply `S017` to `server/providers/ghostMaps.js`. The test must fail.

  ```json
  {"old": "state.error = null;", "new": "state.error = \"outage\";"}
  ```

- [x] 1.19 Add tests for `ghostmaps-018`.

  Mutation: Apply `A001-left` to `server/providers/ghostMaps.js`. The test must fail.

  ```json
  {"old": "!raw || !Number.isFinite(seconds)", "new": "(!Number.isFinite(seconds))"}
  ```

- [x] 1.20 Add tests for `ghostmaps-019`.

  Mutation: Apply `A017-left` to `server/providers/ghostMaps.js`. The test must fail.

  ```json
  {"old": "!['/catalog', '/events'].includes(url.pathname) && !match", "new": "(!match)"}
  ```

- [x] 1.21 Add tests for `ghostmaps-020`.

  Mutation: Apply `A011-true` to `server/providers/ghostMaps.js`. The test must fail.

  ```json
  {"old": "failures\n      ? FAILURE_BACKOFF_MS[Math.min(failures, FAILURE_BACKOFF_MS.length) - 1]\n      : pollMs", "new": "(pollMs)"}
  ```

- [x] 1.22 Add tests for `ghostmaps-021`.

  Mutation: Apply `S021` to `server/providers/ghostMaps.js`. The test must fail.

  ```json
  {"old": "      unsubscribe();", "new": "      /* removed */"}
  ```

- [x] 1.23 Add tests for `ghostmaps-022`.

  Mutation: Apply `S022` to `src/layers/ghostMaps/source.js`. The test must fail.

  ```json
  {"old": "      return catalog;", "new": "      return null;"}
  ```

- [x] 1.24 Add tests for `ghostmaps-023`.

  Mutation: Apply `S023` to `src/layers/ghostMaps/source.js`. The test must fail.

  ```json
  {"old": "encodeURIComponent(id)", "new": "id"}
  ```

- [x] 1.25 Add tests for `ghostmaps-024`.

  Mutation: Apply `A170-right` to `src/layers/ghostMaps/source.js`. The test must fail.

  ```json
  {"old": "states[events.readyState] ?? 'connecting'", "new": "(states[events.readyState])"}
  ```

- [x] 1.26 Add tests for `ghostmaps-025`.

  Mutation: Apply `A131-right` to `src/layers/ghostMaps/kml.js`. The test must fail.

  ```json
  {"old": "Number.isFinite(lon) &&\n      Number.isFinite(lat) &&\n      Math.abs(lat) <= 90 &&\n      Math.abs(lon) <= 180", "new": "(Number.isFinite(lon) &&\n      Number.isFinite(lat) &&\n      Math.abs(lat) <= 90)"}
  ```

- [x] 1.27 Add tests for `ghostmaps-026`.

  Mutation: Apply `A142-case-3` to `src/layers/ghostMaps/kml.js`. The test must fail.

  ```json
  {"old": "'Polygon'", "new": "'disabled-geometry'"}
  ```

- [x] 1.28 Add tests for `ghostmaps-027`.

  Mutation: Apply `S027` to `src/layers/ghostMaps/kml.js`. The test must fail.

  ```json
  {"old": "...styleFor(text(firstChild(placemark, 'styleUrl'))),", "new": "...{},"}
  ```

- [x] 1.29 Add tests for `ghostmaps-028`.

  Mutation: Apply `S028` to `src/layers/ghostMaps/kml.js`. The test must fail.

  ```json
  {"old": "MAX_GHOSTMAPS_FEATURES = 20_000", "new": "MAX_GHOSTMAPS_FEATURES = 20_001"}
  ```

- [x] 1.30 Add tests for `ghostmaps-029`.

  Mutation: Apply `S029` to `src/layers/ghostMaps/index.js`. The test must fail.

  ```json
  {"old": "      urls.forEach((url) => URL.revokeObjectURL(url));\n      throw error;", "new": "      throw error;"}
  ```

- [x] 1.31 Add tests for `ghostmaps-030`.

  Mutation: Apply `S030` to `src/layers/ghostMaps/index.js`. The test must fail.

  ```json
  {"old": "heightReference: Cesium.HeightReference.CLAMP_TO_GROUND", "new": "heightReference: Cesium.HeightReference.NONE"}
  ```

- [x] 1.32 Add tests for `ghostmaps-031`.

  Mutation: Apply `S031` to `src/layers/ghostMaps/index.js`. The test must fail.

  ```json
  {"old": "const STORAGE_KEY = 'gev.ghostmaps.products';", "new": "const STORAGE_KEY = 'other';"}
  ```

- [x] 1.33 Add tests for `ghostmaps-032`.

  Mutation: Apply `S032` to `src/layers/ghostMaps/index.js`. The test must fail.

  ```json
  {"old": "if (!product || !wanted(product)) unload(id);", "new": "if (!product || !wanted(product)) {}"}
  ```

- [x] 1.34 Add tests for `ghostmaps-033`.

  Mutation: Apply `S033` to `src/layers/ghostMaps/index.js`. The test must fail.

  ```json
  {"old": "links[0] || null", "new": "links[links.length - 1] || null"}
  ```

- [x] 1.35 Add tests for `ghostmaps-034`.

  Mutation: Apply `S034` to `src/layers/ghostMaps/index.js`. The test must fail.

  ```json
  {"old": "count: featureCount(),", "new": "count: 0,"}
  ```

- [x] 1.36 Add tests for `ghostmaps-035`.

  Mutation: Apply `S035` to `src/app/layers/ghostMaps.js`. The test must fail.

  ```json
  {"old": "window.open(url, '_blank', 'noopener,noreferrer')", "new": "window.open(url, '_self', 'noopener,noreferrer')"}
  ```

## 2. Gates and review

- [ ] 2.1 Ask the lead to run `make ratchet CHANGE=backfill-ghostmaps`.
- [ ] 2.2 Ask the lead to run `make gates CHANGE=backfill-ghostmaps`.
- [ ] 2.3 Get the two formal agent reviews.
- [ ] 2.4 Record the formal verdicts in `review.md`.
