Verdict: PASS

Commit a885562ca9ba1bfbfda5b15ad8aaf504f34320a7. I found no critical or major finding, and six minor ones.

- [ ] FINDING minor design.md:31 The private raw folder is not private from tests. A test can write `coverage-x.json` into its own `process.env.NODE_V8_COVERAGE`, and Node copies every file into the raw folder. It can also list `os.tmpdir()` for `gev-spec-v8-*`, or read `/proc/<ppid>/environ`, which still holds the path. `mergeRawCoverage` merges any such file. Node's old merge had the same hole, so only the `GEV_SPEC_OUT` path is closed. Name this in Known limits (proposal.md:28).
- [ ] FINDING minor gates.test.mjs:1501 Scenario 066 says "random", but no test asserts it. A fixed `mkdirSync(path.join(tmpdir(), 'gev-spec-v8-x'))` passes, and muts.json has no such mutation. Assert that the five `raw` values differ and each has a non-empty suffix.
- [ ] FINDING minor proposal.md:26 "On every path" is false for SIGKILL, Ctrl-C and a time limit (AGENTS rule 12), because `finally` does not run. Up to about 1 GB then stays in the temp folder. The old folder in `.gev-cache/spec` was wiped on the next run. Name this limit.
- [ ] FINDING minor gates.test.mjs:1501 Mode `no-lcov` writes a raw file, so "absent lcov text causes no such error" is shown only with raw present. Add a mode with neither lcov nor raw, which is the allocation-only case. Moving the `!rawFiles` check out of `if (lcovText !== null)` has no mutation row.
- [ ] FINDING minor design.md:145 The text says the `src/cameraGroundGuard.js` branch total "falls from 54 to 53". The final gaps.json holds 54, and history line 2009 (2026-10-06) records 53 to 54. Correct the sentence and name the 53/54 flip under `image-test-timing`.
- [ ] FINDING minor ledger.mjs:775 `invalid()` rejects the whole history, but spec 122 says "rejects the line". The new rule also fails the whole history when image timing flips a single-branch file without a base entry to 0 uncovered. The tolerance (up to 8) would have allowed that flip. The files at risk are test-guard.mjs 1/151, osh/index.js 1/287 and aircraftClass.js 1/36. The risk ends at merge. Reword spec 122 and name the limit.

What I checked and found sound:
- **A1:** `runs.json` holds only `{NODE_V8_COVERAGE}` for the main run and nothing for allocation runs. `results.json`, the guard files and the other uploaded files hold no environment values.
- **A2:** `finally` runs after every error inside `try`, including an error in `mergeRawCoverage`. The `mkdtempSync` call sits directly before `try`.
- **A3:** `COVERAGE-RAW-MISSING` reaches `init`, `rebaseline`, `adopt`, `ratchet`, `check` and `ci` through `measured.errors`. With no main run or no test files there is no lcov, so there is no false error.
- **A4:** The five mutation rows for the new rule, and the tests for scenario 122, cover each operand.
- **A5:** `>` becomes `>=` at v8-merge.mjs:143 and the new tie test fails on it.
- **Spec and documents:** the applied base specs match the delta specs, and the Known limits list is complete. The tasks put tests before code.

Not read or run: no Bash was available, so I ran no code and no git command, and I could not compare against the base gaps.json. I did not read the STE output, the 207-row audit outside its new rows, or the full gates.test.mjs outside the diff.
