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

An application programming interface (API) defines calls between software parts.
JavaScript Object Notation (JSON) is a data format.
An identifier (ID) names one item.

## Tree and scope

Base commit 290b5d2; later merges of main do not change the 17 test files.
The change edits tests and the change directory only.
No requirement, scenario text or production file changes.

The ratchet command changes one ledger total, which the proposal names.
The prompt-1.md paths name eight files; the file paths define the scope.
The `grep -rnE` search supplies the other audit files.
The audit.md gives each source line, margin and decision.

## Process limit decision

The test command uses `--test-isolation=none` to avoid a second Node process.
Launcher tests start Node children.
Their measurements use shell load instead of Node load to keep the Node process limit.
All children inherit the CPU set and nice priority 19.
The measurement load uses three Node load loops for files without Node children.
The launcher measurement load uses three shell load loops.

The process limit has priority when the measurement load conflicts with launcher children.
The test command runs one file at a time.
The measurement script stops its load loops after each file.
All Node commands use the CPU set 12-15 and nice priority 19.

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
The argument is that load cannot end the time slice on a fixed clock.
No measurement showed a failure from this cause.

## Event decisions

Shared request tests hold the response with a promise until the requests start.
No fixed response delay defines which request shares the first request.
The local SDR card test advances its render timer after the feed callback.
Pointer tests advance the pending timer after the next owner takes the pointer.
The OSH selection tests await a setter of the host element of the page after selection.
Each promise belongs to its test, as the assertion-context lesson needs.

The HLS tests await the download promise before the clock advances.
The lease test advances Date with its timers.
The argument is that load cannot advance lease time on a mock clock.
No measurement showed a failure from this cause.

## Real clock decisions

Shell work needs real process time.
The launcher deadline uses the original deadline multiplied by the factor 20.
The same constant supplies each launcher process deadline.
A comment states why the tests need a real deadline.

The absence checks keep a short real delay after controlled callbacks finish.
The HLS absence check first proves that the session has stopped.
A real delay then checks for later downloads.
The source inspections and `rg` searches give the timer values in the audit.

## Audit decisions without a timer change

The traffic surface identity test is synchronous.
No callback can interrupt its array-method counters during its loop.
The repository hygiene tests read source text synchronously.
No timer change can correct a source-text assertion.
Both files still get the baseline measurements.

## Measurements

The before.md and after.md reports replace the earlier placeholder files.
The measurement command uses Node test mode, the force-exit flag and the TAP reporter.
The coverage command adds the experimental coverage flag and a report stream.
The mutation command adds a test-name pattern for the named test.
Each command log states the source commit.
The final tables come from the command output, not a gate cache.

## Known limits: later changes

The Vite server tests keep their teardown waits.
Their waits need an owner-specific teardown signal in a later change.
The preview waits exceed the short race threshold of 50 ms.
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
A clean local measurement does not prove the cause of a failure in the container logs.

## Baseline series decision

Two early lint commands overlapped the first USB measurement series.
The original USB tests get another series in the unchanged copy.
The final before table uses that later series.
No local check overlaps the later measurement series.

## Real absence margins

The command `rg` on each changed test file supplies these delay values.
The tests use the real timer captured before the mock clock starts.

| File | Real delay | Controlled signal before the delay |
|---|---|---|
| `src/sdr/controller.test.mjs` | 5 ms | The old operation settles or its clock steps finish. |
| `src/cameraGroundGuard.test.mjs` | 5 ms | The probe callback finishes on the test clock. |
| `src/data/cctvHlsStream.test.mjs` | 5 ms | The session total is zero. |
| `src/data/cctvMediaRange.test.mjs` | 5 ms | The feed clock steps finish. |
| `src/data/localReceiversProxy.test.mjs` | 5 ms | The late DNS callback finishes. |
| `src/data/directions.test.mjs` | 5 ms | The pointer timer fires on the test clock. |
| `src/data/cctvProxy.test.mjs` | 5 ms | The mock deadline advances. |

## Network limit decision

The sandbox rejects loopback servers with `listen EPERM`.
prompt-1.md prohibits network use.
Local commands exclude unchanged socket cases with test-name filters.
The filters do not change a test or assertion.
The changed deadline and shared-request tests still run.

The complete file checks remain incomplete for the media-range, local-receiver and local-service test files.
The lead must check those files in the image.
The command `rg` for server creation and listen calls gives the excluded cases.
The network-filters.json gives the exact test-name patterns.

The first test-name filter did not exclude the socket cases.
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
When a deadline does not run, an assertion fails.
The test cannot stay open.
The first header mutation stopped at its time limit without a test verdict.
The repeated mutation uses the signal assertion.

The DNS test guard uses the captured real timer.
A mock guard cannot stop a test that awaits a mock deadline that does not run.
The guard uses the original delay multiplied by the factor 20.
The test clears the guard timer when its promise settles.

The first DNS mutation also stopped at its time limit without a test verdict.
The repeated DNS mutation failed the original guard assertion.

The successful-header absence test has a short margin against the header timer.
The test awaits the headers, advances the mock deadline and keeps a short real absence delay.
The signal assertion must fail when production does not clear the header timer.

The changed playlist tests also process unchanged data on the next scheduled callback.
The original real delays allowed that callback to start.
The controlled callback keeps that path in the test without a real delay.

The fixture in `src/data/radio.test.mjs` has no audio object.
The production file is `src/layers/radio/volume.js`.
The source completes restoration without a frame callback when that object is absent.
The fixed delay of the fixture does not define an assertion and needs no timer change.
The command `rg` for Audio and the source inspection supply this decision.

## Measurement tables

Command: `python3 measure.py`, followed by `python3 tables.py`.
The complete per-test tables are in the before.md and after.md reports.
Each table row below gives the sum of those test results.
The measurement load is the same before and after.
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

No baseline test in the local run failed.
The measurements do not reproduce the failures in the container logs.

## Final local evidence

The command `python3 report-mutations.py` gives the completed mutation total.
The round 1 run had 45 production mutations that caused named tests to fail.
The first header and DNS attempts stopped before the end and have no verdict.
The repeated attempts failed the named assertions.

The commands `python3 compare-coverage.py` and `python3 compare-counts.py` compare the coverage reports.
The 995 production comparisons have no lost lines and no smaller covered branch or function totals.
The no-load checks use the same coverage command for each changed test file.
The socket exclusions stated above apply to those checks.

## Round 2 decisions

Base commit 290b5d2. The work started at commit 3b72650. The checks include the changes in commit b95b44f. The command `git diff` between commits b95b44f and d923d4d, limited to the folder `src`, prints nothing.

The cap test awaits rejection before it checks that production did not read the body.
Mock clocks control the OSH and CCTV frame deadlines.
Exact elapsed values replace the elapsed-time inequalities in the cctvProxy, gbfsProxy and requests tests.

The controller stop test keeps its assertion that the elapsed time is below 250 ms.
The mock Date clock gives an elapsed value of 60 ms, the sum of two close deadlines of 30 ms from the fixture value `closeTimeoutMs`.
Host load cannot change that value.
The assertion fails if production sets each of the two close deadlines to 125 ms or more.
The lead ran both deadlines multiplied by 5 on a copy, and the assertion failed with `300 ms`.
The assertion that `stop()` returns true proves the result; as a time limit it fails when `stop()` needs 500 ms or more.

The nominatim stalled-body test keeps its assertion that the elapsed time is below 5000 ms because its 300 ms deadline uses the real clock.
Each upstream start promise has a real guard of 2000 ms.
Each test clears its guard in a finally block.

Production mutations use a separate copy.
The review reports stay unchanged.

## Base comparison

Command: `git diff` with revisions 290b5d2 and 22465a2, and `--stat` with the 17 test paths from `round2-files.json`.
Result: no output.
The file `round2-base-diff.log` records the result.

## Full real timer list

Command: `rg -n` with the timer pattern and all 17 paths in `round2-waits.py`.
The file `round2-waits.log` gives each match for real and mock timers.
The table lists real delays and guards from those matches.
The other controller guards use the mock clock through clockWithin().
The pause(5) calls are at lines 666, 698, 739, 933, 962, 1012 and 1095.
The absence delay table lists all seven files with real absence delays.

| File | Real value | Reason |
|---|---|---|
| `src/devCctv.test.mjs` | 600000 ms | The process deadline uses the factor 20. |
| `src/toolProjectRoot.test.mjs` | 600000 ms | The process deadline uses the factor 20. |
| `src/app/layers/osh.test.mjs` | 10000 ms | The test clears the guard after the host element of the page changes. |
| `src/sdr/controller.test.mjs` | 1000 ms | The two within() calls test init failure; within() clears each real guard in .finally(). |
| `src/sdr/controller.test.mjs` | 2 ms | The fixture completes a device read. |
| `src/sdr/controller.test.mjs` | 5 ms | Seven pause(5) calls are real absence delays. |
| `src/data/directions.test.mjs` | 0 ms | The callback allows event work to finish. |
| `src/data/cctvMediaRange.test.mjs` | 10, 150, 250 and 400 ms | Socket cases need later host measurements. |
| `src/data/localReceiversProxy.test.mjs` | 5, 20 and 300 ms | Socket cases need later host measurements. |
| `src/data/localReceiversProxy.test.mjs` | 1200 ms | The test clears the DNS guard in a finally block. |
| `src/tooling/localServices.test.mjs` | 2000 ms | The test clears the upstream start guard in a finally block. |
| `src/tooling/nominatimSearchRoute.test.mjs` | 2000 and 300 ms | The test clears the start guard; the rejection test awaits its deadline. |
| `src/data/cctvProxy.test.mjs` | 100 and 1000 ms | Immediate fixture responses clear the body guards. |
| `src/data/cctvProxy.test.mjs` | 20 ms | The stalled body test awaits expiry without a second time threshold. |
| `src/data/gbfsProxy.test.mjs` | 20 ms | The stalled body test awaits expiry without a second time threshold. |
| `src/services/requests.test.mjs` | 10, 1000 and 60000 ms | Native signal deadlines do not keep the process alive; the fixture awaits cancellation or an immediate response. |

Round 2 does not claim a gates verdict.
The lead owns the gates run and both review verdicts.

## Timer source checks

The USB source has no poll timer.
The test checks that production clears the expired device deadline from `withDeadline`.
The HLS test checks that production clears the poll timer and checks zero later downloads.
Both checks record the timer that production clears.

## Frame result decision

The CCTV frame API catches the upstream rejection and returns null.
The frame test checks the TimeoutError signal reason before it awaits null.
The OSH API rejects, so its test awaits the TimeoutError rejection.

## Cap mutation source

The first cap mutation changed a helper that OSH does not call.
The OSH read path uses `src/sources/httpBody.js` through the common HTTP module.
The corrected mutation removes the declared body check in that source.
The final complete run has 54 failed selected tests and no stopped process.

## Round 2 results

The file `corrections.md` gives the corrections of the round-1 review findings and each final command result; `review.md` records the corrections of rounds 2 to 4.
All 85 test processes under load have zero failures, with 1105 test results.
The lead log `lead3-tests.log` records complete checks after the round 2 changes.
The 995 production comparisons show no coverage decrease.
