## Context

Upstream main is `fca2c81d8`. The shared ancestor with the fork is `7f2dc81cf`, the last commit of the eleventh sync.

## Decisions

### D1: One merge, plan first

The plan commit comes before the merge commit. The merge uses `git rerere`, so a second merge replays the resolutions.

### D2: One edit of an upstream test

The test `blenderCameraPartialWrite.test.mjs` runs a child process with a file size limit of 32 KiB. The child inherits the coverage folder, and the limit cuts its coverage file. Then the coverage merge of the gate stops with a JSON error. The change gives that child an empty `NODE_V8_COVERAGE`, so it writes no coverage file. The retry of the same test still measures the tool.

### D3: Two backfill tests keep the coverage

Upstream removed the tests of the phone Context tab and the test of a resumed flight. The files `contextActions.js`, `director.js` and `cameraMotion.js` did not change, so they lost coverage. The ledger does not accept a larger gap. The change keeps the fork edit of the resumed flight test as `director-111`. It adds `context-contacts-entry-001` for the Contacts request.

### D4: The resolutions of the conflicts

- `.env.example` keeps the fork list of the Google routes and adds the upstream lines on the Street View fallback.
- `DATA_SOURCES.md` keeps the fork row for GDACS and adds the upstream row for JTWC. The Ontario 511 row keeps the fork text and adds the upstream words on Kitchener.
- `format-scope.json`, `package-boundaries.json` and `same-as-english.json` keep the entries of the two sides. The change removes one entry that occurred two times.
- The conflicted test files keep the fork tests with their IDs and the new upstream tests. Where a conflict is only the test name, the test keeps the fork name.
- The merge first removed the resumed flight test from `director.test.mjs`, as upstream did. D3 gives the later change.

## Risks

The merge changes the shapes of the perimeter, cyclone and recent imagery records. A fork test that read the old shape failed, and the change corrected the test.
