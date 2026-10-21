Verdict: FAIL

Commit read: tip 201b1a14, clone `/home/ianblenke/docker/gev-work/skywatch-thumbnails`. I did not run any code, git command or container, so I checked each fault by reading the code.

- [ ] FINDING major server/providers/local.js:66 (201b1a14) Rule 15 is not met. No test checks how the app builds the thumbnail plugin. The test at `src/data/skywatchThumbnails.test.mjs:244` checks only the plugin names. Two faults pass every test: (1) change local.js:66 `...skywatchPlugins()` to `skywatchProxy(), skywatchThumbnailProxy()`; (2) change thumbnails.js:91 `env = process.env` to `env = {}`. With either fault, the app answers `unknown_scene` or `thumbnails_off` for each id. Neither fault is in faults.txt. Add an AND line to 001: the thumbnail plugin of that list finds a scene of a kept answer of the skywatch-proxy plugin of the same list. Add a test that goes through `localProviderPlugins()`, with `t.mock.method(globalThis,'fetch')` and `process.env` values set. Then run both faults. I could not run that test.

- [ ] FINDING major openspec/specs/skywatch-thumbnails/spec.md:109 (201b1a14) Two meanings in a scenario (also the delta spec.md:106). "has the header `x-api-key` ... only when ..." gives only the necessary condition. No line says that a request to `api.skywatch.co` has the key, but `skywatchThumbnails.test.mjs:621-622` asserts it. Code that never sends the key meets the scenario. Write: "has the header `x-api-key` with the trimmed key when the host name is `api.skywatch.co` and the trimmed key is not empty, and no header `x-api-key` in each other case".

- [ ] FINDING major DATA_SOURCES.md:162 (201b1a14) False statement: "also through a reverse proxy that removes the forwarding headers". A TLS reverse proxy that removes those headers but keeps the browser's https `Origin` gets 403. The last AND line of skywatch-source-023 says so, and `skywatchProxy.test.mjs:307-312` tests it. The owner's Caddy passes only because it also rewrites the `Origin` (design.md:5). Add that condition, for example: "...that removes the forwarding headers and sends the origin of its own request to this server in `Origin`". I could not run the STE lint on this text.

- [ ] FINDING major src/data/skywatchThumbnails.test.mjs:587 (201b1a14) Rule 13 is not met for three tests:
  - No named fault makes "[skywatch-thumbnails-007] accepts the port 443" fail. The faults "port accepted" and "route without the URL check" both leave it passing.
  - The media-type faults ran only on the thumbnails test file. So `skywatchImage.test.mjs:74` has no fault result.
  - The edited test `skywatchProxy.test.mjs:591` ("[skywatch-source-018] answers with the first step that fails") is in no failed list. faults.py lists only the tests of the fault's own ID.

  Add a fault for each test, for example a port check on the raw text (image.js:30) and the same-site step before the method step (skywatch.js:200). Run each fault on the correct test file and record the test that failed.

- [ ] FINDING minor src/data/skywatchThumbnails.test.mjs:886 (201b1a14) Rule 14: skywatch-thumbnails-012 names `https://cdn.example.test:443/t.png` and `https://cdn.example.test/t.png`, but the test uses `/same.png`. Use the literal URLs of the scenario.

- [ ] FINDING minor openspec/changes/archive/2026-10-21-skywatch-thumbnails/design.md:38 (201b1a14) "that test gets the new field" is not accurate. `skywatchScenes.test.mjs:298-300` sets `thumbnailUrls: undefined` on both sides, so the 021 test does not check the field (tasks.md:5 has the same problem). Say that the 021 test leaves out the field and that the tests of 006 check the map.

- [ ] FINDING minor DATA_SOURCES.md:170 (201b1a14) "a scene that a search of the last 10 minutes gave" is false for an answer that the 32-answer store removed (skywatch-source-015, skywatch-thumbnails-006). `.env.example:226-227` has the same problem. Add "and that the store still keeps".

Other checks found no problem:
- The URL check, the key host check, the image check before the bytes reach the browser, the answer headers and the fields given to `admitSameSiteRequest()` match the spec.
- The carried scenarios 014-017 are the same word for word.
- `ids.json` has 16 new IDs, and `retired-ids.json` has no SkyWatch ID.
- The only gate error is REVIEW-MISSING.
