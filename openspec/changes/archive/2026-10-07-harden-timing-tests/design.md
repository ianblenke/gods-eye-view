## Terms

Closed-circuit television (CCTV) names the camera service.
OpenSensorHub (OSH) names the sensor service.
The central processing unit (CPU) supplies processor time.
The universal serial bus (USB) connects the receiver.
The Domain Name System (DNS) supplies network addresses.

Software-defined radio (SDR) names the receiver system.
The Hypertext Transfer Protocol (HTTP) carries web requests.
HTTP Live Streaming (HLS) names the media format.
The Test Anything Protocol (TAP) names the test report format.

## Tree and scope

Tree commit from `git rev-parse HEAD`: `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.
The change edits tests and the change directory only.
No requirement, scenario text or production file changes.
The ratchet command changes one ledger total, which the proposal names.
The supplied paths name eight files; the file paths define the scope.
The requested `grep -rnE` search supplies the other audit files.
The scratch audit gives each source line, margin and decision.

## Process limit decision

The test command uses `--test-isolation=none` to avoid a second Node process.
Launcher tests start Node children.
Their measurements use shell load instead of Node load to keep the Node process limit.
All children inherit the CPU set and priority.
The baseline uses three Node loops for files without Node children.
The launcher baseline uses three shell loops.

The process limit takes precedence when the requested load conflicts with launcher children.
The test command runs one file at a time.
The measurement script stops its load processes after each file.
All Node commands use the requested CPU set and priority.

## Clock decisions

Mock timers control USB deadlines, camera probes, media deadlines and request deadlines.
USB and stream callbacks finish between clock steps.
A clock step awaits an immediate callback before the next timer fires.
The tests keep their assertions and titles.
A mock Date clock controls elapsed-time assertions, request backoff and lease expiry.

Native abort timers do not use the mock timer clock.
The request test replaces the native timer method with an `AbortController` on the test clock.
The replacement uses the delay that production supplies.
The test keeps its error and elapsed-time assertions.

A fixed performance clock keeps fixture roads inside one time slice.
The settled-footprint test keeps its tile-total and coverage-key assertions.
Machine load cannot force a real time slice to end between its mock timer steps.

## Event decisions

Shared request tests hold the response with a promise until the requests start.
No fixed response delay defines which request shares the first request.
The local SDR card test advances its render timer after the feed callback.
Pointer tests advance the pending timer after the next owner takes the pointer.
The OSH selection tests await a host setter after selection.
Each promise belongs to its test, as the assertion-context lesson needs.

The HLS tests await the download promise before the clock advances.
The lease test advances Date with its timers.
A lease cannot expire because machine load delays its next update.

## Real clock decisions

Shell work needs real process time.
The launcher deadline uses the original deadline multiplied by the factor in the brief.
The same constant supplies each launcher process deadline.
A comment states why the tests need a real deadline.

The absence checks keep a short real wait after controlled callbacks finish.
The HLS absence check first proves that the session has stopped.
A real wait then checks for later downloads.
The source inspections and `rg` searches give the timer values in the audit.

## Audit decisions without a timer change

The traffic surface identity test is synchronous.
No callback can interrupt its array-method counters during its loop.
The repository hygiene tests read source text synchronously.
No timer change can correct a source-text assertion.
Both files still get the requested baseline measurements.

## Measurements

The scratch reports replace the earlier placeholder files.
The measurement command uses Node test mode, the force-exit flag and the TAP reporter.
The coverage command adds the experimental coverage flag and a report stream.
The mutation command adds a test-name pattern for the named test.
Each command log states the source commit.
The final tables come from the command output, not a gate cache.

## Known limits: later changes

The Vite server tests keep their teardown waits.
Their waits need an owner-specific teardown signal in a later change.
The preview waits exceed the short race threshold of this brief.
Socket tests with larger guards need separate load measurements.

The command `rg` for timer calls supplies this later-change list.

| File | Source wait | Later change |
|---|---|---|
| `src/tooling/previewServing.test.mjs` | 60 ms | Await the Vite teardown signal. |
| `src/tooling/placeProviders.test.mjs` | 120 ms | Await the cache state signal. |
| `src/tooling/liveProviders.test.mjs` | 100 steps of 10 ms | Await the socket state signal. |
| `src/data/cctvMediaRange.test.mjs` | 150, 250 and 400 ms | Measure the socket teardown cases. |

Source-text failures need assertion output before a correction can target their cause.
The traffic surface identity test has no real timer or asynchronous work.

The host runtime differs from the image runtime.
Local measurements do not give a verdict for the complete image gates.
The lead runs the ratchet, the gates and both reviews.
A clean local measurement does not prove the cause of a failure in the supplied logs.

## Baseline series decision

Two early lint commands overlapped the first USB measurement series.
The original USB tests get another series in the unchanged copy.
The final before table uses that later series.
No local check overlaps the later measurement series.

## Real absence margins

The command `rg` on each changed test file supplies these wait values.
The tests use the real timer captured before the mock clock starts.

| File | Real wait | Controlled signal before the wait |
|---|---|---|
| `src/sdr/controller.test.mjs` | 5 ms | The old operation settles or its clock steps finish. |
| `src/cameraGroundGuard.test.mjs` | 5 ms | The probe callback finishes on the test clock. |
| `src/data/cctvHlsStream.test.mjs` | 5 ms | The session total is zero. |
| `src/data/cctvMediaRange.test.mjs` | 5 ms | The feed clock steps finish. |
| `src/data/localReceiversProxy.test.mjs` | 5 ms | The late DNS callback finishes. |
| `src/data/directions.test.mjs` | 5 ms | The pointer timer fires on the test clock. |

## Network limit decision

The sandbox rejects loopback servers with `listen EPERM`.
The brief prohibits network use.
Local commands exclude unchanged socket cases with test-name filters.
The filters do not change a test or assertion.
The changed deadline and shared-request tests still run.

The complete file checks remain incomplete for the media-range, local-receiver and local-service test files.
The lead must check those files in the image.
The command `rg` for server creation and listen calls gives the excluded cases.
The scratch filter file gives the exact test-name patterns.

The first inclusion filter did not exclude the socket cases.
The local commands use `--test-skip-pattern` instead.

## Backpressure fixture decision

The slow-client fixture holds one byte in the full client buffer.
The upstream stream stays open after that byte.
The test then calls the scheduled deadline callback.
No producer interval is necessary to test the blocked client.
The test keeps each assertion about backpressure and the open response.
The coverage check must include the backpressure deadline branch.

The slow client test captures the global timer callback.
The test calls each scheduled deadline after the client buffer is full.
The deadline must schedule its next callback with the literal delay.
The Node mock clock lost this branch in the covered line comparison.

Request deadline tests check the aborted signal before they await rejection.
A missing deadline then fails an assertion instead of holding the test open.
The first header mutation stopped at its time limit without a test verdict.
The repeated mutation uses the signal assertion.

The DNS test guard uses the captured real timer.
A mock guard cannot stop a test that awaits a missing mock deadline.
The guard uses the original delay multiplied by the factor in the brief.
The test clears the guard timer when its promise settles.

The first DNS mutation also stopped at its time limit without a test verdict.
The repeated DNS mutation failed the original watchdog assertion.

The successful-header absence test has a short margin against the header timer.
The test awaits the headers, advances the mock deadline and keeps a short real absence wait.
The signal assertion must fail when production does not clear the header timer.

The changed playlist tests also process unchanged data on the next scheduled callback.
The original real waits allowed that callback to start.
The controlled callback keeps that path in the test without a real delay.

The radio volume fixture has no audio object.
The source completes restoration without a frame callback when that object is absent.
Its fixed delay is only a wait and needs no timer change.
The command `rg` for Audio and the source inspection supply this decision.

## Measurement tables

Command: `python3 measure.py`, followed by `python3 tables.py`.
The complete per-test tables are in the scratch before and after reports.
Each table row below gives the sum of those test results.
The process load is the same before and after.
The socket exclusions stated above apply to both tables.

| Test file | Test names | Before attempts | Before failures | After attempts | After failures |
|---|---:|---:|---:|---:|---:|
| `src/app/layers/osh.test.mjs` | 4 | 80 | 0 | 80 | 0 |
| `src/cameraGroundGuard.test.mjs` | 20 | 400 | 0 | 400 | 0 |
| `src/data/cctvHlsStream.test.mjs` | 10 | 200 | 0 | 200 | 0 |
| `src/data/cctvMediaRange.test.mjs` | 18 | 360 | 0 | 360 | 0 |
| `src/data/cctvProxy.test.mjs` | 14 | 280 | 0 | 280 | 0 |
| `src/data/directions.test.mjs` | 24 | 480 | 0 | 480 | 0 |
| `src/data/gbfsProxy.test.mjs` | 11 | 220 | 0 | 220 | 0 |
| `src/data/localReceiversProxy.test.mjs` | 10 | 200 | 0 | 200 | 0 |
| `src/data/oshGet.test.mjs` | 35 | 700 | 0 | 700 | 0 |
| `src/data/oshRepositoryHygiene.test.mjs` | 8 | 160 | 0 | 160 | 0 |
| `src/devCctv.test.mjs` | 4 | 80 | 0 | 80 | 0 |
| `src/layers/traffic/navigation.test.mjs` | 15 | 300 | 0 | 300 | 0 |
| `src/layers/traffic/surface.test.mjs` | 9 | 180 | 0 | 180 | 0 |
| `src/sdr/controller.test.mjs` | 24 | 480 | 0 | 480 | 0 |
| `src/services/requests.test.mjs` | 6 | 120 | 0 | 120 | 0 |
| `src/toolProjectRoot.test.mjs` | 3 | 60 | 0 | 60 | 0 |
| `src/tooling/localServices.test.mjs` | 9 | 180 | 0 | 180 | 0 |
| `src/tooling/nominatimSearchRoute.test.mjs` | 10 | 200 | 0 | 200 | 0 |
| `src/ui/localSdrControls.test.mjs` | 4 | 80 | 0 | 80 | 0 |

No baseline test in the local assessment failed.
The measurements do not reproduce the failures in the supplied logs.

## Final local evidence

The command `python3 report-mutations.py` gives the completed mutation total.
All 45 production mutations caused the named tests to fail.
The first header and DNS attempts stopped before the end and have no verdict.
The repeated attempts failed the named assertions.

The commands `python3 compare-coverage.py` and `python3 compare-counts.py` compare the coverage reports.
The 995 production comparisons have no lost lines and no smaller covered branch or function totals.
The no-load checks use the same coverage command for each changed test file.
The socket exclusions stated above apply to those checks.
