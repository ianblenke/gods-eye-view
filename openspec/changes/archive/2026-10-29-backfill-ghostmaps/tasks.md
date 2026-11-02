## 1. Specs and tests

- [x] 1.1 Write the delta spec before the tests.

- [x] 1.2 Add tests for `ghostmaps-001`.

  The mutation of `src/layers/ghostMaps/catalog.js` below makes the test fail.

  Case: `A019-left`.

  ```json
  {"old": "port function parseGhostMapsEdition(fileName) {\n  const stem = String(fileName || '').replace(/\\.km[lz]$/i, '');\n  const match = DATE_IN_NAME.exec(stem);\n", "new": "port function parseGhostMapsEdition(fileName) {\n  const stem = String(('')).replace(/\\.km[lz]$/i, '');\n  const match = DATE_IN_NAME.exec(stem);\n"}
  ```

- [x] 1.3 Add tests for `ghostmaps-002`.

  The mutation of `src/layers/ghostMaps/catalog.js` below makes the test fail.

  Case: `A023-left`.

  ```json
  {"old": "a.dateMs ?? -Infinity", "new": "(-Infinity)"}
  ```

- [x] 1.4 Add tests for `ghostmaps-003`.

  The mutation of `src/layers/ghostMaps/catalog.js` below makes the test fail.

  Case: `A032-right`.

  ```json
  {"old": "entry.path.startsWith(INCIDENTS) &&\n      !LATEST_DROP_EXCLUDED.test(`/${entry.path}`) &&\n      candidate.dateMs != null &&\n      newer(candidate, drop)", "new": "(entry.path.startsWith(INCIDENTS) &&\n      !LATEST_DROP_EXCLUDED.test(`/${entry.path}`) &&\n      candidate.dateMs != null)"}
  ```

- [x] 1.5 Add tests for `ghostmaps-004`.

  The mutation of `src/layers/ghostMaps/catalog.js` below makes the test fail.

  Case: `A028-left`.

  ```json
  {"old": "entry?.type !== 'blob' || typeof entry.path !== 'string'", "new": "(typeof entry.path !== 'string')"}
  ```

- [x] 1.6 Add tests for `ghostmaps-005`.

  The mutation of `src/layers/ghostMaps/catalog.js` below makes the test fail.

  Case: `S005`.

  ```json
  {"old": "path.split('/').map(encodeURIComponent).join('/')", "new": "path.split('/').join('/')"}
  ```

- [x] 1.7 Add tests for `ghostmaps-006`.

  The mutation of `src/layers/ghostMaps/catalog.js` below makes the test fail.

  Case: `A037-loop`.

  ```json
  {"old": "String(text || '').split('\\n')", "new": "[]"}
  ```

- [x] 1.8 Add tests for `ghostmaps-007`.

  The mutation of `src/layers/ghostMaps/records.js` below makes the test fail.

  Case: `A149-left`.

  ```json
  {"old": "h emit. */\nexport function decodeHtmlEntities(text) {\n  return String(text ?? '').replace(\n    /&(#x[0-9a-f]{1,6}|#\\d{1,7}|[a-z]{2,8});/gi,\n    (whole", "new": "h emit. */\nexport function decodeHtmlEntities(text) {\n  return String(('')).replace(\n    /&(#x[0-9a-f]{1,6}|#\\d{1,7}|[a-z]{2,8});/gi,\n    (whole"}
  ```

- [x] 1.9 Add tests for `ghostmaps-008`.

  The mutation of `src/layers/ghostMaps/records.js` below makes the test fail.

  Case: `A157-right`.

  ```json
  {"old": "t function htmlToText(html) {\n  return decodeHtmlEntities(\n    String(html ?? '')\n      .replace(/<(script|style|head)\\b[\\s\\S]*?<\\/\\1\\s*>/gi, ' ')\n   ", "new": "t function htmlToText(html) {\n  return decodeHtmlEntities(\n    String((html))\n      .replace(/<(script|style|head)\\b[\\s\\S]*?<\\/\\1\\s*>/gi, ' ')\n   "}
  ```

- [x] 1.10 Add tests for `ghostmaps-009`.

  The mutation of `src/layers/ghostMaps/records.js` below makes the test fail.

  Case: `R1F07-values`.

  ```json
  {"old": "value: value.slice(0, MAX_VALUE)", "new": "value: fields.length === 0 ? value.slice(0, MAX_VALUE) : value"}
  ```

- [x] 1.11 Add tests for `ghostmaps-010`.

  The mutation of `src/layers/ghostMaps/records.js` below makes the test fail.

  Case: `A149-right`.

  ```json
  {"old": "h emit. */\nexport function decodeHtmlEntities(text) {\n  return String(text ?? '').replace(\n    /&(#x[0-9a-f]{1,6}|#\\d{1,7}|[a-z]{2,8});/gi,\n    (whole", "new": "h emit. */\nexport function decodeHtmlEntities(text) {\n  return String((text)).replace(\n    /&(#x[0-9a-f]{1,6}|#\\d{1,7}|[a-z]{2,8});/gi,\n    (whole"}
  ```

- [x] 1.12 Add tests for `ghostmaps-011`.

  The mutation of `src/layers/ghostMaps/records.js` below makes the test fail.

  Case: `A164-left`.

  ```json
  {"old": "{?number[]}\n */\nexport function kmlColor(text) {\n  const hex = String(text ?? '')\n    .trim()\n    .replace(/^#/, '');\n  if (!/^[0-9a-f]{8}$/i.test(hex", "new": "{?number[]}\n */\nexport function kmlColor(text) {\n  const hex = String((''))\n    .trim()\n    .replace(/^#/, '');\n  if (!/^[0-9a-f]{8}$/i.test(hex"}
  ```

- [x] 1.13 Add tests for `ghostmaps-012`.

  The mutation of `src/layers/ghostMaps/records.js` below makes the test fail.

  Case: `A165-loop`.

  ```json
  {"old": "String(text ?? '')\n    .split(/\\s+/)\n    .filter(Boolean)", "new": "[]"}
  ```

- [x] 1.14 Add tests for `ghostmaps-013`.

  The mutation of `src/layers/ghostMaps/records.js` below makes the test fail.

  Case: `A169-left`.

  ```json
  {"old": "label ?? ''", "new": "('')"}
  ```

- [x] 1.15 Add tests for `ghostmaps-014`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R1F10-commit`.

  ```json
  {"old": "const event = publicCatalog();", "new": "const event = { ...publicCatalog(), commit: null };"}
  ```

- [x] 1.16 Add tests for `ghostmaps-015`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2-prune-later`.

  ```json
  {"old": "for (const name of await fsp.readdir(dir).catch(() => []))", "new": "for (const name of (await fsp.readdir(dir).catch(() => [])).slice(0, 1))"}
  ```

- [x] 1.17 Add tests for `ghostmaps-016`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R1F09-disk`.

  ```json
  {"old": "JSON.stringify({ commit, committedAt, message, products, changedAt })", "new": "JSON.stringify({ commit, committedAt, message, products: products.map(() => ({})), changedAt })"}
  ```

- [x] 1.18 Add tests for `ghostmaps-017`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `S017`.

  ```json
  {"old": "state.error = null;", "new": "state.error = \"outage\";"}
  ```

- [x] 1.19 Add tests for `ghostmaps-018`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `A001-left`.

  ```json
  {"old": "!raw || !Number.isFinite(seconds)", "new": "(!Number.isFinite(seconds))"}
  ```

- [x] 1.20 Add tests for `ghostmaps-019`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2-unsupported-start`.

  ```json
  {"old": "return json(res, 405, { error: 'method_not_allowed' });", "new": "{ watcher.start(); return json(res, 405, { error: 'method_not_allowed' }); }"}
  ```

- [x] 1.21 Add tests for `ghostmaps-020`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R1F03-stop`.

  ```json
  {"old": "running = false;\n    clearTimeout(timer);", "new": "running = false;"}
  ```

- [x] 1.22 Add tests for `ghostmaps-021`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2-event-route-products`.

  ```json
  {"old": "JSON.stringify(catalog)", "new": "JSON.stringify({ ...catalog, products: [] })"}
  ```

- [x] 1.23 Add tests for `ghostmaps-022`.

  The mutation of `src/layers/ghostMaps/source.js` below makes the test fail.

  Case: `R1F04-read`.

  ```json
  {"old": "return catalog;", "new": "return { ...catalog, products: [] };"}
  ```

- [x] 1.24 Add tests for `ghostmaps-023`.

  The mutation of `src/layers/ghostMaps/source.js` below makes the test fail.

  Case: `R2-default-products`.

  ```json
  {"old": "return catalog;", "new": "return { ...catalog, products: [] };"}
  ```

- [x] 1.25 Add tests for `ghostmaps-024`.

  The mutation of `src/layers/ghostMaps/source.js` below makes the test fail.

  Case: `R1F04-event`.

  ```json
  {"old": "onCatalog(catalog);", "new": "onCatalog({ ...catalog, products: [] });"}
  ```

- [x] 1.26 Add tests for `ghostmaps-025`.

  The mutation of `src/layers/ghostMaps/kml.js` below makes the test fail.

  Case: `A129-loop`.

  ```json
  {"old": "String(value ?? '')\n    .trim()\n    .split(/\\s+/)", "new": "[]"}
  ```

- [x] 1.27 Add tests for `ghostmaps-026`.

  The mutation of `src/layers/ghostMaps/kml.js` below makes the test fail.

  Case: `A122-left`.

  ```json
  {"old": "MAPS_POSITIONS = 250_000;\n\nconst childrenNamed = (el, name) =>\n  [...(el?.children || [])].filter((child) => child.localName === name);\nconst firstChild = (el", "new": "MAPS_POSITIONS = 250_000;\n\nconst childrenNamed = (el, name) =>\n  [...(([]))].filter((child) => child.localName === name);\nconst firstChild = (el"}
  ```

- [x] 1.28 Add tests for `ghostmaps-027`.

  The mutation of `src/layers/ghostMaps/kml.js` below makes the test fail.

  Case: `SW3-pair-first`.

  ```json
  {"old": "text(firstChild(pair, 'key')) === 'normal'", "new": "true"}
  ```

- [x] 1.29 Add tests for `ghostmaps-028`.

  The mutation of `src/layers/ghostMaps/kml.js` below makes the test fail.

  Case: `A147-left`.

  ```json
  {"old": "features.length >= MAX_GHOSTMAPS_FEATURES ||\n      budget.positions > MAX_GHOSTMAPS_POSITIONS", "new": "(budget.positions > MAX_GHOSTMAPS_POSITIONS)"}
  ```

- [x] 1.30 Add tests for `ghostmaps-029`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `R1F06-cleanup`.

  ```json
  {"old": "urls.forEach((url) => URL.revokeObjectURL(url));\n      throw error;", "new": "urls.slice(0, 1).forEach((url) => URL.revokeObjectURL(url));\n      throw error;"}
  ```

- [x] 1.31 Add tests for `ghostmaps-030`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `R1F02-hole`.

  ```json
  {"old": "ring(hole)", "new": "ring([[0, 0], [1, 0], [1, 1]])"}
  ```

- [x] 1.32 Add tests for `ghostmaps-031`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `A051-true`.

  ```json
  {"old": "_selection ? _selection.has(product.id) : product.defaultOn", "new": "(product.defaultOn)"}
  ```

- [x] 1.33 Add tests for `ghostmaps-032`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `R1F01-id`.

  ```json
  {"old": "source.getFile(product.id, product.version, { signal })", "new": "source.getFile('wrong', product.version, { signal })"}
  ```

- [x] 1.34 Add tests for `ghostmaps-033`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `SW3-card-values`.

  ```json
  {"old": "const line = label ? `${fieldLabel(label)}: ${value}` : value;", "new": "const line = label ? `${fieldLabel(label)}: ${fields[1].value}` : value;"}
  ```

- [x] 1.35 Add tests for `ghostmaps-034`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `A055-left`.

  ```json
  {"old": "PRODUCT_COLORS[product.id] || ACCENT", "new": "(ACCENT)"}
  ```

- [x] 1.36 Add tests for `ghostmaps-035`.

  The mutation of `src/app/layers/ghostMaps.js` below makes the test fail.

  Case: `S035`.

  ```json
  {"old": "window.open(url, '_blank', 'noopener,noreferrer')", "new": "window.open(url, '_self', 'noopener,noreferrer')"}
  ```

- [x] 1.37 Add tests for `ghostmaps-036`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2F06-id`.

  ```json
  {"old": "watcher.file(match[1])", "new": "watcher.file('cip')"}
  ```

- [x] 1.38 Add tests for `ghostmaps-037`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R1F11-file`.

  ```json
  {"old": "await watcher.file(match[1])", "new": "await watcher.file('wrong')"}
  ```

- [x] 1.39 Add tests for `ghostmaps-038`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2-file-error`.

  ```json
  {"old": "return json(res, 502, { error: 'ghostmaps_unavailable' });", "new": "return json(res, 200, { error: 'wrong' });"}
  ```

- [x] 1.40 Add tests for `ghostmaps-039`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2-destroyed`.

  ```json
  {"old": "if (res.destroyed) return;", "new": "if (false) return;"}
  ```

- [x] 1.41 Add tests for `ghostmaps-040`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2-install-preview`.

  ```json
  {"old": "configurePreviewServer({ middlewares }) {\n      middlewares.use('/api/ghostmaps', handler);", "new": "configurePreviewServer({ middlewares }) {\n      watcher.start();\n      middlewares.use('/api/ghostmaps', handler);"}
  ```

- [x] 1.42 Add tests for `ghostmaps-041`.

  The mutation of `src/layers/ghostMaps/source.js` below makes the test fail.

  Case: `R2-invalid-catalog`.

  ```json
  {"old": "if (!Array.isArray(catalog?.products))\n        throw", "new": "if (false)\n        throw"}
  ```

- [x] 1.43 Add tests for `ghostmaps-042`.

  The mutation of `src/layers/ghostMaps/source.js` below makes the test fail.

  Case: `R2-failed-file`.

  ```json
  {"old": "if (!response.ok)\n        throw new Error(`GhostMaps file unavailable (HTTP ${response.status})`);", "new": "if (false) throw new Error();"}
  ```

- [x] 1.44 Add tests for `ghostmaps-043`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `R2-catalog-method`.

  ```json
  {"old": "if (typeof source?.getCatalog !== 'function')", "new": "if (false)"}
  ```

- [x] 1.45 Add tests for `ghostmaps-044`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `A052-right`.

  ```json
  {"old": ".id) : product.defaultOn;\n  }\n\n  function selectedIds() {\n    return (_catalog?.products || []).filter(wanted).map(({ id }) => id);\n  }\n\n  function unload(id) {\n   ", "new": ".id) : product.defaultOn;\n  }\n\n  function selectedIds() {\n    return ((_catalog?.products)).filter(wanted).map(({ id }) => id);\n  }\n\n  function unload(id) {\n   "}
  ```

- [x] 1.46 Add tests for `ghostmaps-045`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `R2F05-storage`.

  ```json
  {"old": "value.map(String)", "new": "value.map(() => 'cip')"}
  ```

- [x] 1.47 Add tests for `ghostmaps-046`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `A049-left`.

  ```json
  {"old": "overlayHost && screenSpaceEventHandlerFactory && picking", "new": "(picking)"}
  ```

- [x] 1.48 Add tests for `ghostmaps-047`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `R2F03-activate`.

  ```json
  {"old": "if (card.interactive) {", "new": "if (card.interactive || !openExternal) {"}
  ```

- [x] 1.49 Add tests for `ghostmaps-048`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `A009-right`.

  ```json
  {"old": "changed.join(', ') || 'none'", "new": "(changed.join(', '))"}
  ```

- [x] 1.50 Add tests for `ghostmaps-049`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `A004-left`.

  ```json
  {"old": "Date.parse(commit?.commit?.committer?.date) || null", "new": "(null)"}
  ```

- [x] 1.51 Add tests for `ghostmaps-050`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `R2-horizon-restore`.

  ```json
  {"old": "set show(value) {\n                entity.show = value;", "new": "set show(value) {\n                entity.show = value && entity.show;"}
  ```

- [x] 1.52 Add tests for `ghostmaps-051`.

  The mutation of `src/layers/ghostMaps/kml.js` below makes the test fail.

  Case: `R2-invalid-document`.

  ```json
  {"old": "[...(el?.getElementsByTagName?.('*') || [])]", "new": "[...el.getElementsByTagName('*')]"}
  ```

- [x] 1.53 Add tests for `ghostmaps-052`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2F07-commit`.

  ```json
  {"old": "get(`${api}/commits/${sha}`, apiHeaders())", "new": "get(`${api}/commits/${sha}`)"}
  ```

- [x] 1.54 Add tests for `ghostmaps-053`.

  The mutation of `src/layers/ghostMaps/source.js` below makes the test fail.

  Case: `R2-absent-events`.

  ```json
  {"old": "onState('closed');", "new": "onState('open');"}
  ```

- [x] 1.55 Add tests for `ghostmaps-054`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `A087-left`.

  ```json
  {"old": "typeof pickId !== 'string' || !pickId.startsWith(PICK_PREFIX)", "new": "(!pickId.startsWith(PICK_PREFIX))"}
  ```

- [x] 1.56 Add tests for `ghostmaps-055`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `R2F02-chip`.

  ```json
  {"old": "writeStoredSelection(storage, _selection);", "new": "clearSelection();\n    writeStoredSelection(storage, _selection);"}
  ```

- [x] 1.57 Add tests for `ghostmaps-056`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `A077-left`.

  ```json
  {"old": "links[0] || null", "new": "(null)"}
  ```

- [x] 1.58 Add tests for `ghostmaps-057`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `A006-left`.

  ```json
  {"old": "/^[0-9a-f]{40}$/.test(saved?.commit) && Array.isArray(saved.products)", "new": "(Array.isArray(saved.products))"}
  ```

- [x] 1.59 Add tests for `ghostmaps-058`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2F04-tree`.

  ```json
  {"old": "buildGhostMapsCatalog(tree.tree)", "new": "buildGhostMapsCatalog(tree.truncated ? [] : tree.tree)"}
  ```

- [x] 1.60 Add tests for `ghostmaps-059`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `A071-right`.

  ```json
  {"old": "error?.template ||\n              error?.message ||\n              msg('GhostMaps file could not be read')", "new": "(error?.template ||\n              error?.message)"}
  ```

- [x] 1.61 Add tests for `ghostmaps-060`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `R2-cleanup-unload`.

  ```json
  {"old": "item.urls.forEach((url) => URL.revokeObjectURL(url));", "new": "item.urls.slice(0, 1).forEach((url) => URL.revokeObjectURL(url));"}
  ```

- [x] 1.62 Add tests for `ghostmaps-061`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `R2-no-kml`.

  ```json
  {"old": "throw new Error(msg('That KMZ holds no KML document.'));", "new": "throw new Error(msg('wrong error'));"}
  ```

- [x] 1.63 Add tests for `ghostmaps-062`.

  The mutation of `src/layers/ghostMaps/catalog.js` below makes the test fail.

  Case: `A021-false`.

  ```json
  {"old": "match ? stem.slice(match.index + match[0].length) : stem", "new": "(stem.slice(match.index + match[0].length))"}
  ```

- [x] 1.64 Add tests for `ghostmaps-063`.

  The mutation of `src/layers/ghostMaps/records.js` below makes the test fail.

  Case: `R2-link-limit`.

  ```json
  {"old": "links: links.slice(0, MAX_LINKS)", "new": "links"}
  ```

- [x] 1.65 Add tests for `ghostmaps-064`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2-subscriber-limit`.

  ```json
  {"old": "if (watcher.subscribers() >= MAX_SUBSCRIBERS)", "new": "if (false)"}
  ```

- [x] 1.66 Add tests for `ghostmaps-065`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `A090-right`.

  ```json
  {"old": "!canSelect() || _clickHandler", "new": "(!canSelect())"}
  ```

- [x] 1.67 Add tests for `ghostmaps-066`.

  The mutation of `src/layers/ghostMaps/catalog.js` below makes the test fail.

  Case: `A039-left`.

  ```json
  {"old": "match && match[2] === ref", "new": "(match[2] === ref)"}
  ```

- [x] 1.68 Add tests for `ghostmaps-067`.

  The mutation of `server/providers/ghostMaps.js` below makes the test fail.

  Case: `R2F01-events`.

  ```json
  {"old": "if (url.pathname === '/events') return events(req, res);", "new": "if (url.pathname === '/events') { await first; return events(req, res); }"}
  ```

- [x] 1.69 Add tests for `ghostmaps-068`.

  The mutation of `src/layers/ghostMaps/index.js` below makes the test fail.

  Case: `SW3-catalog-own-signal`.

  ```json
  {"old": "source.getCatalog({ signal })", "new": "source.getCatalog(Object.create({ signal }))"}
  ```

## 2. Gates and review

- [ ] 2.1 Ask the lead to run `make ratchet CHANGE=backfill-ghostmaps`.
- [ ] 2.2 Ask the lead to run `make gates CHANGE=backfill-ghostmaps`.
- [ ] 2.3 Get the two formal agent reviews.
- [ ] 2.4 Record the formal verdicts in `review.md`.

## Host measurements

The host suite passes 285 tests, with 284 tagged tests.
The delta contains 68 scenarios.
The mutation spec contains 527 cases: 507 killed cases and 20 documented equivalents.
The audit contains 170 rows, with 0 open rows.

The systematic sweep checks 284 tests across 7 files.
The commands below supply these values.

```bash
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/measure-round3.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/audit-round3.py
cd /home/ianblenke/docker/gev-work/ghostmaps && python3 /home/ianblenke/docker/gev-tools/ghostmaps/sweep-round3.py
```
