## Tree

Base commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.

Code commit: `3fd163cfecba3e681e3f7923dd022a4c23d5b933`.

The mutation results refer to the base commit plus the code of this change.

The host Node version command was taskset -c 0-3 nice -n 19 node --version: `v26.8.2`.

No image command ran. No ledger or archive file changed.

## Public documentation

The commands use `curl -sS -A gods-eye-view-research`.

The sandbox DNS calls failed before a request. The host calls read these pages in order:

1. `https://511on.ca/robots.txt`
2. `https://511on.ca/developers/doc`
3. `https://511on.ca/help/endpoint/cameras`

The robots file excludes account paths and some map data paths.

The developer page names the query parameter `key` and ten calls per 60 seconds.

An account holder can request a key after login at the developer page.

The page links to `/my511/register` for new accounts. It gives no price or further eligibility rule.

The owner expects a free key. The public page does not confirm that price.

The endpoint example gives image IDs 815 and 816.

curl -sS -I -A gods-eye-view-research https://511on.ca/map/Cctv/815 returned HTTP 200 and `image/jpeg` without a key.

This HEAD request downloaded no image. Image content access: unverified.

The task used three GET requests and one HEAD request. No account or credential form opened.

## Fixture tests

Each test command uses taskset -c 0-3 nice -n 19 node --test --test-isolation=none with one file.

The command list and output are in `evidence/before.log` and `evidence/after.log`.

Before: 22 files, 248 tests, 245 passes, three failures.

After the first code group: 23 files, 254 tests, 251 passes, three failures.

All three failures come from sandbox EPERM on loopback listen calls in `cctvMediaRange.test.mjs`.

The host command for that file passed all 21 tests; `evidence/media-host.log` has the output.

The final Ontario file has eight tests, all pass. Thus the final CCTV total is 256 tests.

The host socket result accounts for all three sandbox failures.

The same command for `src/tooling/bundleCredentials.test.mjs` passed six tests.

The same command for `src/keySetupCore.test.mjs` passed 25 tests.

The bundle fixture reads the new name from `.env.example` and gives it a secret sentinel.

The inventory test includes the new server credential name.

The first Ontario test command failed all eight tests because the helper file did not exist.

The red output is in `evidence/red.log`.

## Coverage

Use the fixture command with `--experimental-test-coverage --test-coverage-include=<file>` for each code file separately.

`evidence/new-coverage-final.log` reports `ontarioRequest.js`: 100% lines, branches and functions.

`evidence/sources-coverage-final.log` reports `sources.js`: 29.07% lines, 43.28% branches and 29.03% functions.

That command tests the Ontario path only. Other pack paths remain outside this fixture.

The requested whole-file 100% result for `sources.js` is not complete.

The lead must assess its existing gaps in the image. This task does not change other pack code to close those gaps.

The same coverage command for `src/data/cctvCalgary.test.mjs` gives these whole-file results:

| Tree | Lines | Branches | Functions |
|---|---:|---:|---:|
| Base commit | 51.91% | 47.59% | 69.23% |
| Base plus this change | 51.87% | 47.88% | 69.23% |

The logs are `evidence/sources-before.log` and `evidence/sources-after.log`.

## Named mutations

The command for each row is the Ontario fixture command above after the named source edit.

Each command returned status 1. The JSON files record the failed test names.

| Mutation | Failed test |
|---|---|
| Drop the key parameter | [live-sources-002] send the key parameter |
| Send a request without a key | [live-sources-003] stop without a key |
| Log the key | [live-sources-004] reject the invalid key once |
| Fetch before the absent-key return | [live-sources-003] stop without a key |
| Warn on each absent-key call | [live-sources-003] stop without a key |
| Warn on each error | [live-sources-004] reject the invalid key once and both error tests for 005 |
| Drop the helper call | [live-sources-002] map the Ontario rows |
| Log the camera data error | [live-sources-005] keep the camera data error secret |

The source files returned to their correct content after each mutation.

rg -n 'ONTARIO_511_API_KEY|Ontario 511 camera data error|readOntarioCameraRows' .env.example server/providers/cctv/{sources,ontarioRequest}.js confirms the key name, helper call and fixed text.

## Automatic mutations

The tool commands use taskset -c 0-3 nice -n 19 node /home/ianblenke/docker/gev-tools/automut/automut.mjs.

The generation command names both changed code files and produced 8006 candidates.

A filter selects the 117 helper candidates and 12 candidates on changed source lines 466, 536, 537 and 538.

The final campaign has 129 candidates. Each worker runs one test file per process.

The sandbox campaign stopped at its baseline with no test output. It gave no mutation verdict.

The first host campaign used an earlier test count. The final campaign uses a fresh baseline and the final tests.

The final phase-one command uses run with phase 1 and one job with `final-mutants.json` and the Ontario test file.

The full-test command uses run with phase 2, one job and resume with the same files.

The result files show 120 phase-one kills and nine survivors, then one more kill and eight survivors.

Both phases report zero crashes and zero timeouts. No candidate remains pending.

The phase-two command serves as the probe for each EQUIVALENT claim below.

Each probe passes all eight fixture tests, with the same rows, request parameters, fixed error text and warning counts.

| IDs | Claim | Probe result and reason |
|---|---|---|
| a0030, a0031 | EQUIVALENT | The private absent-key flag changes from true to a truthy value. Only its truth value has a caller. |
| a0090, a0091 | EQUIVALENT | The private error flag changes from true to a truthy value. Only its truth value has a caller. |
| a0078 | EQUIVALENT | A ReferenceError takes the place of the private Error. The catch block ignores both and returns the same result. |
| a9012, a9013 | EQUIVALENT | The private Error message changes. The catch block reads no message and writes fixed text. |
| a9016 | EQUIVALENT | The log callback starts a nested async fetch. Its catch runs after the flag assignment, with the same one-warning result. |

The absent-key order mutation a9003 fails the callback probe because that path has no async fetch before its flag test.

The source restoration search confirms all code corrections after the probes.

The final Prettier command names only the helper and Ontario test file.

## Prose and OpenSpec

taskset -c 0-3 nice -n 19 node scripts/spec/gates.mjs lint --change fix-ontario-511-key reports zero errors.

taskset -c 0-3 nice -n 19 openspec show fix-ontario-511-key --json prints JSON with one ADDED requirement.

taskset -c 0-3 nice -n 19 openspec validate fix-ontario-511-key reports that the change is valid.

The proposal headings match the five required headings in the nearby defect change.

The design, tasks and evidence use the same `## ` heading level as that change.

## Lead checks

The lead must run the ratchet and final gates in the Node image, then both reviews.

The host task does not archive the change or write `review.md`.

The final lint command reports zero errors and 540 warnings.
