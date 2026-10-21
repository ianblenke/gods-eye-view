## 1. Write the tests

- [ ] 1.1 Write the tests for `skywatch-source-003`, `skywatch-source-004`, `skywatch-source-018` and `skywatch-source-023` in `src/data/skywatchProxy.test.mjs`.
- [ ] 1.2 Keep the tests for `skywatch-source-014`, `skywatch-source-015`, `skywatch-source-016` and `skywatch-source-017`.
- [ ] 1.3 Add the field `thumbnailUrls` to the expected result in `src/data/skywatchScenes.test.mjs`.
- [ ] 1.4 Write the tests for `skywatch-thumbnails-001`, `skywatch-thumbnails-002`, `skywatch-thumbnails-003`, `skywatch-thumbnails-004` and `skywatch-thumbnails-005` in `src/data/skywatchThumbnails.test.mjs`.
- [ ] 1.5 Write the tests for `skywatch-thumbnails-006`, `skywatch-thumbnails-012`, `skywatch-thumbnails-013` and `skywatch-thumbnails-014` in the same file.
- [ ] 1.6 Write the tests for `skywatch-thumbnails-008`, `skywatch-thumbnails-010`, `skywatch-thumbnails-011` and `skywatch-thumbnails-015` in the same file.
- [ ] 1.7 Write the tests of `server/providers/skywatch/image.js` for `skywatch-thumbnails-007` and `skywatch-thumbnails-009` in `src/data/skywatchImage.test.mjs`.
- [ ] 1.8 Write the route tests for `skywatch-thumbnails-007` and `skywatch-thumbnails-009` in `src/data/skywatchThumbnails.test.mjs`.

## 2. Write the files

- [ ] 2.1 Write `server/providers/skywatch/same-site.js`.
- [ ] 2.2 Write `server/providers/skywatch/image.js`.
- [ ] 2.3 Write `server/providers/skywatch/thumbnails.js`.
- [ ] 2.4 Add the map of the thumbnail URLs to `server/providers/skywatch/normalize.js`.
- [ ] 2.5 Replace the local step of `server/providers/skywatch.js` with the same-site step.
- [ ] 2.6 Add `thumbnailUrlOf` and `skywatchPlugins()` to `server/providers/skywatch.js`.
- [ ] 2.7 Use `skywatchPlugins()` in `server/providers/local.js`.
- [ ] 2.8 Add the new test files to `openspec/ownership.json`.
- [ ] 2.9 Format the changed code files with Prettier.
- [ ] 2.10 Write the entry in `CHANGELOG.md`.
- [ ] 2.11 Change the paragraph in `DATA_SOURCES.md`.
- [ ] 2.12 Add `SKYWATCH_THUMBNAILS` to the block in `.env.example`.

## 3. Check on the host

- [ ] 3.1 Run the tests of the two plugins on the host.
- [ ] 3.2 Run the named faults of the two plugins.
- [ ] 3.3 Write `evidence/faults.txt` with the result of each fault.
- [ ] 3.4 Run each test file on the host.
- [ ] 3.5 Run the four checks of `make precheck` on the host.
- [ ] 3.6 Run the STE lint on the host.
- [ ] 3.7 Run `openspec validate skywatch-thumbnails` on the host.

## 4. Lead work in the Docker image

- [ ] 4.1 Run `make ratchet CHANGE=skywatch-thumbnails`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=skywatch-thumbnails` on the final tree.
