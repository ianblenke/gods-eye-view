## 1. Specs and tests

- [x] 1.1 Write the delta spec before the tests.

- [x] 1.2 Add tests for `ghostmaps-001`.

  Mutation `A019-left` changes `src/layers/ghostMaps/catalog.js`, and the test fails.

  ```json
  {"old": "port function parseGhostMapsEdition(fileName) {\n  const stem = String(fileName || '').replace(/\\.km[lz]$/i, '');\n  const match = DATE_IN_NAME.exec(stem);\n", "new": "port function parseGhostMapsEdition(fileName) {\n  const stem = String(('')).replace(/\\.km[lz]$/i, '');\n  const match = DATE_IN_NAME.exec(stem);\n"}
  ```

- [x] 1.3 Add tests for `ghostmaps-002`.

  Mutation `A023-left` changes `src/layers/ghostMaps/catalog.js`, and the test fails.

  ```json
  {"old": "a.dateMs ?? -Infinity", "new": "(-Infinity)"}
  ```

- [x] 1.4 Add tests for `ghostmaps-003`.

  Mutation `A032-right` changes `src/layers/ghostMaps/catalog.js`, and the test fails.

  ```json
  {"old": "entry.path.startsWith(INCIDENTS) &&\n      !LATEST_DROP_EXCLUDED.test(`/${entry.path}`) &&\n      candidate.dateMs != null &&\n      newer(candidate, drop)", "new": "(entry.path.startsWith(INCIDENTS) &&\n      !LATEST_DROP_EXCLUDED.test(`/${entry.path}`) &&\n      candidate.dateMs != null)"}
  ```

- [x] 1.5 Add tests for `ghostmaps-004`.

  Mutation `A028-left` changes `src/layers/ghostMaps/catalog.js`, and the test fails.

  ```json
  {"old": "entry?.type !== 'blob' || typeof entry.path !== 'string'", "new": "(typeof entry.path !== 'string')"}
  ```

- [x] 1.6 Add tests for `ghostmaps-005`.

  Mutation `S005` changes `src/layers/ghostMaps/catalog.js`, and the test fails.

  ```json
  {"old": "path.split('/').map(encodeURIComponent).join('/')", "new": "path.split('/').join('/')"}
  ```

- [x] 1.7 Add tests for `ghostmaps-006`.

  Mutation `A037-loop` changes `src/layers/ghostMaps/catalog.js`, and the test fails.

  ```json
  {"old": "String(text || '').split('\\n')", "new": "[]"}
  ```

- [x] 1.8 Add tests for `ghostmaps-007`.

  Mutation `A149-left` changes `src/layers/ghostMaps/records.js`, and the test fails.

  ```json
  {"old": "h emit. */\nexport function decodeHtmlEntities(text) {\n  return String(text ?? '').replace(\n    /&(#x[0-9a-f]{1,6}|#\\d{1,7}|[a-z]{2,8});/gi,\n    (whole", "new": "h emit. */\nexport function decodeHtmlEntities(text) {\n  return String(('')).replace(\n    /&(#x[0-9a-f]{1,6}|#\\d{1,7}|[a-z]{2,8});/gi,\n    (whole"}
  ```

- [x] 1.9 Add tests for `ghostmaps-008`.

  Mutation `A157-right` changes `src/layers/ghostMaps/records.js`, and the test fails.

  ```json
  {"old": "t function htmlToText(html) {\n  return decodeHtmlEntities(\n    String(html ?? '')\n      .replace(/<(script|style|head)\\b[\\s\\S]*?<\\/\\1\\s*>/gi, ' ')\n   ", "new": "t function htmlToText(html) {\n  return decodeHtmlEntities(\n    String((html))\n      .replace(/<(script|style|head)\\b[\\s\\S]*?<\\/\\1\\s*>/gi, ' ')\n   "}
  ```

- [x] 1.10 Add tests for `ghostmaps-009`.

  Mutation `R1F07-values` changes `src/layers/ghostMaps/records.js`, and the test fails.

  ```json
  {"old": "value: value.slice(0, MAX_VALUE)", "new": "value: fields.length === 0 ? value.slice(0, MAX_VALUE) : value"}
  ```

- [x] 1.11 Add tests for `ghostmaps-010`.

  Mutation `A149-right` changes `src/layers/ghostMaps/records.js`, and the test fails.

  ```json
  {"old": "h emit. */\nexport function decodeHtmlEntities(text) {\n  return String(text ?? '').replace(\n    /&(#x[0-9a-f]{1,6}|#\\d{1,7}|[a-z]{2,8});/gi,\n    (whole", "new": "h emit. */\nexport function decodeHtmlEntities(text) {\n  return String((text)).replace(\n    /&(#x[0-9a-f]{1,6}|#\\d{1,7}|[a-z]{2,8});/gi,\n    (whole"}
  ```

- [x] 1.12 Add tests for `ghostmaps-011`.

  Mutation `A164-left` changes `src/layers/ghostMaps/records.js`, and the test fails.

  ```json
  {"old": "{?number[]}\n */\nexport function kmlColor(text) {\n  const hex = String(text ?? '')\n    .trim()\n    .replace(/^#/, '');\n  if (!/^[0-9a-f]{8}$/i.test(hex", "new": "{?number[]}\n */\nexport function kmlColor(text) {\n  const hex = String((''))\n    .trim()\n    .replace(/^#/, '');\n  if (!/^[0-9a-f]{8}$/i.test(hex"}
  ```

- [x] 1.13 Add tests for `ghostmaps-012`.

  Mutation `A165-loop` changes `src/layers/ghostMaps/records.js`, and the test fails.

  ```json
  {"old": "String(text ?? '')\n    .split(/\\s+/)\n    .filter(Boolean)", "new": "[]"}
  ```

- [x] 1.14 Add tests for `ghostmaps-013`.

  Mutation `A169-left` changes `src/layers/ghostMaps/records.js`, and the test fails.

  ```json
  {"old": "label ?? ''", "new": "('')"}
  ```

- [x] 1.15 Add tests for `ghostmaps-014`.

  Mutation `R1F10-commit` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "const event = publicCatalog();", "new": "const event = { ...publicCatalog(), commit: null };"}
  ```

- [x] 1.16 Add tests for `ghostmaps-015`.

  Mutation `R2-prune-later` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "for (const name of await fsp.readdir(dir).catch(() => []))", "new": "for (const name of (await fsp.readdir(dir).catch(() => [])).slice(0, 1))"}
  ```

- [x] 1.17 Add tests for `ghostmaps-016`.

  Mutation `R1F09-disk` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "JSON.stringify({ commit, committedAt, message, products, changedAt })", "new": "JSON.stringify({ commit, committedAt, message, products: products.map(() => ({})), changedAt })"}
  ```

- [x] 1.18 Add tests for `ghostmaps-017`.

  Mutation `S017` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "state.error = null;", "new": "state.error = \"outage\";"}
  ```

- [x] 1.19 Add tests for `ghostmaps-018`.

  Mutation `A001-left` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "!raw || !Number.isFinite(seconds)", "new": "(!Number.isFinite(seconds))"}
  ```

- [x] 1.20 Add tests for `ghostmaps-019`.

  Mutation `R2-unsupported-start` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "return json(res, 405, { error: 'method_not_allowed' });", "new": "{ watcher.start(); return json(res, 405, { error: 'method_not_allowed' }); }"}
  ```

- [x] 1.21 Add tests for `ghostmaps-020`.

  Mutation `R1F03-stop` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "running = false;\n    clearTimeout(timer);", "new": "running = false;"}
  ```

- [x] 1.22 Add tests for `ghostmaps-021`.

  Mutation `R2-event-route-products` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "JSON.stringify(catalog)", "new": "JSON.stringify({ ...catalog, products: [] })"}
  ```

- [x] 1.23 Add tests for `ghostmaps-022`.

  Mutation `R1F04-read` changes `src/layers/ghostMaps/source.js`, and the test fails.

  ```json
  {"old": "return catalog;", "new": "return { ...catalog, products: [] };"}
  ```

- [x] 1.24 Add tests for `ghostmaps-023`.

  Mutation `R2-default-products` changes `src/layers/ghostMaps/source.js`, and the test fails.

  ```json
  {"old": "return catalog;", "new": "return { ...catalog, products: [] };"}
  ```

- [x] 1.25 Add tests for `ghostmaps-024`.

  Mutation `R1F04-event` changes `src/layers/ghostMaps/source.js`, and the test fails.

  ```json
  {"old": "onCatalog(catalog);", "new": "onCatalog({ ...catalog, products: [] });"}
  ```

- [x] 1.26 Add tests for `ghostmaps-025`.

  Mutation `A129-loop` changes `src/layers/ghostMaps/kml.js`, and the test fails.

  ```json
  {"old": "String(value ?? '')\n    .trim()\n    .split(/\\s+/)", "new": "[]"}
  ```

- [x] 1.27 Add tests for `ghostmaps-026`.

  Mutation `A122-left` changes `src/layers/ghostMaps/kml.js`, and the test fails.

  ```json
  {"old": "MAPS_POSITIONS = 250_000;\n\nconst childrenNamed = (el, name) =>\n  [...(el?.children || [])].filter((child) => child.localName === name);\nconst firstChild = (el", "new": "MAPS_POSITIONS = 250_000;\n\nconst childrenNamed = (el, name) =>\n  [...(([]))].filter((child) => child.localName === name);\nconst firstChild = (el"}
  ```

- [x] 1.28 Add tests for `ghostmaps-027`.

  Mutation `R1F08-shared` changes `src/layers/ghostMaps/kml.js`, and the test fails.

  ```json
  {"old": "...styleFor(text(firstChild(placemark, 'styleUrl')))", "new": "...(inline ? {} : styleFor(text(firstChild(placemark, 'styleUrl'))))"}
  ```

- [x] 1.29 Add tests for `ghostmaps-028`.

  Mutation `A147-left` changes `src/layers/ghostMaps/kml.js`, and the test fails.

  ```json
  {"old": "features.length >= MAX_GHOSTMAPS_FEATURES ||\n      budget.positions > MAX_GHOSTMAPS_POSITIONS", "new": "(budget.positions > MAX_GHOSTMAPS_POSITIONS)"}
  ```

- [x] 1.30 Add tests for `ghostmaps-029`.

  Mutation `R1F06-cleanup` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "urls.forEach((url) => URL.revokeObjectURL(url));\n      throw error;", "new": "urls.slice(0, 1).forEach((url) => URL.revokeObjectURL(url));\n      throw error;"}
  ```

- [x] 1.31 Add tests for `ghostmaps-030`.

  Mutation `R1F02-hole` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "ring(hole)", "new": "ring([[0, 0], [1, 0], [1, 1]])"}
  ```

- [x] 1.32 Add tests for `ghostmaps-031`.

  Mutation `A051-true` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "_selection ? _selection.has(product.id) : product.defaultOn", "new": "(product.defaultOn)"}
  ```

- [x] 1.33 Add tests for `ghostmaps-032`.

  Mutation `R1F01-id` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "source.getFile(product.id, product.version, { signal })", "new": "source.getFile('wrong', product.version, { signal })"}
  ```

- [x] 1.34 Add tests for `ghostmaps-033`.

  Mutation `A055-left` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "PRODUCT_COLORS[product.id] || ACCENT", "new": "(ACCENT)"}
  ```

- [x] 1.35 Add tests for `ghostmaps-034`.

  Mutation `A055-left` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "PRODUCT_COLORS[product.id] || ACCENT", "new": "(ACCENT)"}
  ```

- [x] 1.36 Add tests for `ghostmaps-035`.

  Mutation `S035` changes `src/app/layers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "window.open(url, '_blank', 'noopener,noreferrer')", "new": "window.open(url, '_self', 'noopener,noreferrer')"}
  ```

- [x] 1.37 Add tests for `ghostmaps-036`.

  Mutation `A015-false` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "status === 405 ? { Allow: 'GET' } : {}", "new": "({ Allow: 'GET' })"}
  ```

- [x] 1.38 Add tests for `ghostmaps-037`.

  Mutation `R1F11-file` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "await watcher.file(match[1])", "new": "await watcher.file('wrong')"}
  ```

- [x] 1.39 Add tests for `ghostmaps-038`.

  Mutation `R2-file-error` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "return json(res, 502, { error: 'ghostmaps_unavailable' });", "new": "return json(res, 200, { error: 'wrong' });"}
  ```

- [x] 1.40 Add tests for `ghostmaps-039`.

  Mutation `R2-destroyed` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "if (res.destroyed) return;", "new": "if (false) return;"}
  ```

- [x] 1.41 Add tests for `ghostmaps-040`.

  Mutation `R2-install-preview` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "configurePreviewServer({ middlewares }) {\n      middlewares.use('/api/ghostmaps', handler);", "new": "configurePreviewServer({ middlewares }) {\n      watcher.start();\n      middlewares.use('/api/ghostmaps', handler);"}
  ```

- [x] 1.42 Add tests for `ghostmaps-041`.

  Mutation `R2-invalid-catalog` changes `src/layers/ghostMaps/source.js`, and the test fails.

  ```json
  {"old": "if (!Array.isArray(catalog?.products))\n        throw", "new": "if (false)\n        throw"}
  ```

- [x] 1.43 Add tests for `ghostmaps-042`.

  Mutation `R2-failed-file` changes `src/layers/ghostMaps/source.js`, and the test fails.

  ```json
  {"old": "if (!response.ok)\n        throw new Error(`GhostMaps file unavailable (HTTP ${response.status})`);", "new": "if (false) throw new Error();"}
  ```

- [x] 1.44 Add tests for `ghostmaps-043`.

  Mutation `R2-catalog-method` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "if (typeof source?.getCatalog !== 'function')", "new": "if (false)"}
  ```

- [x] 1.45 Add tests for `ghostmaps-044`.

  Mutation `A052-right` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": ".id) : product.defaultOn;\n  }\n\n  function selectedIds() {\n    return (_catalog?.products || []).filter(wanted).map(({ id }) => id);\n  }\n\n  function unload(id) {\n   ", "new": ".id) : product.defaultOn;\n  }\n\n  function selectedIds() {\n    return ((_catalog?.products)).filter(wanted).map(({ id }) => id);\n  }\n\n  function unload(id) {\n   "}
  ```

- [x] 1.46 Add tests for `ghostmaps-045`.

  Mutation `A040-left` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "globalThis.localStorage ?? null", "new": "(null)"}
  ```

- [x] 1.47 Add tests for `ghostmaps-046`.

  Mutation `A049-left` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "overlayHost && screenSpaceEventHandlerFactory && picking", "new": "(picking)"}
  ```

- [x] 1.48 Add tests for `ghostmaps-047`.

  Mutation `A082-right` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "Math.min(4, MAX_CARD_LINES - details.length)),\n      );\n    }\n    if (_selectedLink && openExternal)\n      details.push(\n        tn(\n          links.length,\n          '{", "new": "Math.min(4, MAX_CARD_LINES - details.length)),\n      );\n    }\n    if ((_selectedLink))\n      details.push(\n        tn(\n          links.length,\n          '{"}
  ```

- [x] 1.49 Add tests for `ghostmaps-048`.

  Mutation `A009-right` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "changed.join(', ') || 'none'", "new": "(changed.join(', '))"}
  ```

- [x] 1.50 Add tests for `ghostmaps-049`.

  Mutation `A004-left` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "Date.parse(commit?.commit?.committer?.date) || null", "new": "(null)"}
  ```

- [x] 1.51 Add tests for `ghostmaps-050`.

  Mutation `R2-horizon-restore` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "set show(value) {\n                entity.show = value;", "new": "set show(value) {\n                entity.show = value && entity.show;"}
  ```

- [x] 1.52 Add tests for `ghostmaps-051`.

  Mutation `R2-invalid-document` changes `src/layers/ghostMaps/kml.js`, and the test fails.

  ```json
  {"old": "[...(el?.getElementsByTagName?.('*') || [])]", "new": "[...el.getElementsByTagName('*')]"}
  ```

- [x] 1.53 Add tests for `ghostmaps-052`.

  Mutation `A002-left` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "process.env.GITHUB_TOKEN || ''", "new": "('')"}
  ```

- [x] 1.54 Add tests for `ghostmaps-053`.

  Mutation `R2-absent-events` changes `src/layers/ghostMaps/source.js`, and the test fails.

  ```json
  {"old": "onState('closed');", "new": "onState('open');"}
  ```

- [x] 1.55 Add tests for `ghostmaps-054`.

  Mutation `A087-left` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "typeof pickId !== 'string' || !pickId.startsWith(PICK_PREFIX)", "new": "(!pickId.startsWith(PICK_PREFIX))"}
  ```

- [x] 1.56 Add tests for `ghostmaps-055`.

  Mutation `A093-right` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "cardHit && cardHit.entryId === _selectedCardId", "new": "(cardHit)"}
  ```

- [x] 1.57 Add tests for `ghostmaps-056`.

  Mutation `A077-left` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "links[0] || null", "new": "(null)"}
  ```

- [x] 1.58 Add tests for `ghostmaps-057`.

  Mutation `A006-left` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "/^[0-9a-f]{40}$/.test(saved?.commit) && Array.isArray(saved.products)", "new": "(Array.isArray(saved.products))"}
  ```

- [x] 1.59 Add tests for `ghostmaps-058`.

  Mutation `R2-truncated-warning` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "if (tree.truncated) warn('[ghostmaps] repository tree listing truncated');", "new": "if (false) warn('[ghostmaps] repository tree listing truncated');"}
  ```

- [x] 1.60 Add tests for `ghostmaps-059`.

  Mutation `A071-right` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "error?.template ||\n              error?.message ||\n              msg('GhostMaps file could not be read')", "new": "(error?.template ||\n              error?.message)"}
  ```

- [x] 1.61 Add tests for `ghostmaps-060`.

  Mutation `R2-cleanup-unload` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "item.urls.forEach((url) => URL.revokeObjectURL(url));", "new": "item.urls.slice(0, 1).forEach((url) => URL.revokeObjectURL(url));"}
  ```

- [x] 1.62 Add tests for `ghostmaps-061`.

  Mutation `R2-no-kml` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "throw new Error(msg('That KMZ holds no KML document.'));", "new": "throw new Error(msg('wrong error'));"}
  ```

- [x] 1.63 Add tests for `ghostmaps-062`.

  Mutation `A021-false` changes `src/layers/ghostMaps/catalog.js`, and the test fails.

  ```json
  {"old": "match ? stem.slice(match.index + match[0].length) : stem", "new": "(stem.slice(match.index + match[0].length))"}
  ```

- [x] 1.64 Add tests for `ghostmaps-063`.

  Mutation `R2-link-limit` changes `src/layers/ghostMaps/records.js`, and the test fails.

  ```json
  {"old": "links: links.slice(0, MAX_LINKS)", "new": "links"}
  ```

- [x] 1.65 Add tests for `ghostmaps-064`.

  Mutation `R2-subscriber-limit` changes `server/providers/ghostMaps.js`, and the test fails.

  ```json
  {"old": "if (watcher.subscribers() >= MAX_SUBSCRIBERS)", "new": "if (false)"}
  ```

- [x] 1.66 Add tests for `ghostmaps-065`.

  Mutation `A090-right` changes `src/layers/ghostMaps/index.js`, and the test fails.

  ```json
  {"old": "!canSelect() || _clickHandler", "new": "(!canSelect())"}
  ```

- [x] 1.67 Add tests for `ghostmaps-066`.

  Mutation `A039-left` changes `src/layers/ghostMaps/catalog.js`, and the test fails.

  ```json
  {"old": "match && match[2] === ref", "new": "(match[2] === ref)"}
  ```

## 2. Gates and review

- [ ] 2.1 Ask the lead to run `make ratchet CHANGE=backfill-ghostmaps`.
- [ ] 2.2 Ask the lead to run `make gates CHANGE=backfill-ghostmaps`.
- [ ] 2.3 Get the two formal agent reviews.
- [ ] 2.4 Record the formal verdicts in `review.md`.

## Host measurements

The host suite passes 276 tests, with 275 tagged tests.
The delta contains 66 scenarios.
The mutation spec contains 430 cases: 410 killed cases and 20 documented equivalents.
The audit contains 170 rows, with 0 open rows.
The command below supplies these values.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/measure-round2.py
```

The audit command is in [evidence.md](evidence.md).
