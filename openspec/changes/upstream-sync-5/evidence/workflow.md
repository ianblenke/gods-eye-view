# Read-only checks of the merged tree

The lead ran a workflow with four analysts. Each analyst read the merged tree (the files of commit `5bfdffed`, which equal the files of the tested tree). Each analyst changed no file in the clone.
A skeptic agent checked the one finding with the severity blocker or major.
The numbers below come from the reports of the analysts. The lead checked the facts of the Known limits against the code.

## The OSH layer and the new source composition

- The OSH layer has the id `osh-systems`. It has no entry in the catalog source contracts. The availability lookup gives no answer for it, and the lifecycle blocks a layer only when the answer is `false`. So the OSH layer enables with empty sources, with the standalone defaults and with every contract entry omitted.
- The new Street Level option `r` does not change the share-link code of the OSH token `3`. A run of 2000 states (811 with the OSH layer on) found 0 differences. It compared the codec of the merged tree with the codec of fork main.
- The layer panel and the lifecycle show the OSH row as before. Nothing in `src/standalone/` needs a `sources` key.
- Two test batteries (27 files and 34 files) gave exit status 0 and 0 failed tests. One probe stopped at its time limit, and its last step did not run.

## Security of the upstream part

- The upstream range adds no route, no middleware, no dependency and no outbound request target. It changes no file under `server/`.
- The Street Level switch codec limits the field `r` to 256 characters and the whole `lo` field to 512 characters. The codec checks the length before it parses. The analyst found no prototype pollution.
- A vessel source reaches the healthy empty state only with zero rows and a complete snapshot. It also needs the freshness `current`, a live or open status and a positive last-message time. The stock adapter does not reach it.
- Two points are minor. The size limits of the switch field are in two places. The credit of a Recent Imagery source goes to Cesium as HTML text (the Known limit `credit`).
- The analyst could not check a browser run, the live vessel feed, the Cesium credit display, the Docker image, the coverage counts or the gates.

## Fork specs, tests and documents

- No test with a scenario ID fails. So rule 25 needs no retired scenario and no new scenario.
- The registry has 30 entries and the catalog has 31 layers. The two changed numbers are the only count pins that the merge breaks.
- The upstream part adds untagged tests: 29 by the count of the analyst. Eight are in new files with no ledger entry. Two of them are in test files with fork tests that all carry IDs. The adopt command records them.
- No fork document has a sentence that the upstream part makes false. The Known limits `share-options` and `osh-source` come from this check.
- `src/tooling/spec/gates.test.mjs` stopped at 280 s in the run of the analyst, and it also stops on fork main. The lead ran it alone with a longer limit (241 of 241 tests pass).

## Configuration and the cheap gates

- Seven commands gave exit status 0. They are the import direction check, the package boundary check, the layer token check, the format check, the lint, `openspec validate --specs` and the gates report.
- The gates report of the merged tree equals the report of fork main. The ledger does not know the merge yet. The adopt step records it.
- The four new modules are in suitable package boundary groups. `package.json` has 162 exports, and the boundary file lists 162.
- `openspec/ownership.json` is the same as on fork main. No new upstream file needs an entry. The OSH token `3` is still reserved and unique.
- The number of QA scripts stays 90. One QA script changed, `scripts/qa-street-level.mjs`, and its header is intact.
- Upstream did not change `.github`.
