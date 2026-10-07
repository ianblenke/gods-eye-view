Verdict: FAIL
- [ ] FINDING major Makefile:10 GATES_DOCS_MARKERS has no `.gev-cache` exclusion. The ratchet run (line 11) makes `{}` markers for ignored `.gev-cache/**` code names, and GATES_BACK (line 9) copies them over `/src/.gev-cache/`. Proof: `.gev-cache/hardening-copy/scripts/format.mjs` and `index.html` hold `{}` now. Add `":(exclude,glob).gev-cache/**"` and a test that runs the marker command and the copy back.
- [ ] FINDING major src/tooling/spec/gates.test.mjs:2216 Operand mutations survive. (a) scripts/spec/lib/measurement.mjs:10 `'openspec/trace/'` to `'openspec/trace'` (the 091 tests use only changes-old and specs.md). (b) measurement.mjs:63 `'.gev-cache/'` to `'.gev-cache'`. (c) measurement.mjs:20-21 Dockerfile and compose regexes: the 075/076 tests for `containers/Dockerfile.gates`, `Dockerfileprod`, `docker-compose.yml` and `containers/compose.gates.yaml` edit tracked files, so the path rule refuses them and `protectedInput` is never called. The ignored tests use only root `Dockerfile` and `compose.yaml`, so `/^Dockerfile$/` and `\.yaml$` survive. Add ignored cases and one row each.
- [ ] FINDING major src/tooling/spec/gates.test.mjs:1825 Scenario 080 THEN "names that commit" is not asserted. `commit: line.commit` to `commit: 'none'` (measurement.mjs:41) survives. Assert `Trusted commit:` plus 40 zeros.
- [ ] FINDING minor scripts/spec/lib/measurement.mjs:62 The prefix test comes before the file class. A tracked or new code or test file under `openspec/` is trusted, but the full run measures it. An ignored one is refused (the `old.js` test), so the rule is not uniform, and no Known limit names it. Refuse code and test names everywhere, or name it.
- [ ] FINDING minor scripts/spec/lib/measurement.mjs:40 `resolveCommit` accepts any ref: a history line with `"commit":"HEAD"` gives an empty diff with a real snapshot. Require 40 hex digits. The Known limit "as the ledger already does" is false: CI re-measures the ledger and never reads `measurement` or `dirty`.
- [ ] FINDING minor scripts/spec/gates.mjs:700 `Command: check` is asserted nowhere (test line 1638 asserts ratchet only), but AGENTS rule 9 needs it. `finally` (line 722) prints `Finished:` after an exception with no verdict. Commands without times (ci, adopt) have no scenario.
- [ ] FINDING minor Makefile:44 In `precheck`, `&&` to `;` survives (test line 1880 uses `includes`); a failed first check is lost from the status.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-gates-one-measurement/specs/coverage-gate/spec.md:12 "protected" has two meanings: a class list for ignored files, and any file outside the three paths (078, 090, `dirty`). AGENTS.md step 2 and review.md step 1 do not define "protected inputs".
- [ ] FINDING minor scripts/spec/lib/measurement.mjs:57 `git diff` hides `assume-unchanged` and `skip-worktree` files in the ratchet and in document mode. Name it in Known limits.
- [ ] FINDING minor scripts/spec/gates.mjs:643 No test needs the history re-read after the writes. `historyText = historyText` should survive (needs a base ledger and a ratchet-written `totals` line). The snapshot-copy sentence of "Fast local checks" has no scenario THEN.

Answers to your questions:
- Q1: Forging the snapshot needs an edit of history.jsonl (findings 4 and 5).
- Q2: Against the base `check` path I found no comparison skipped or reordered. Ledger, history and baseline are re-read after the writes. The status is 1 before the writes and 2 after.
- Q3: No rule is weakened.

Not done: I read files only and ran no test, mutation or make. I did not read evidence.md past line 325. All "survives" claims come from reading the tests and mutations.json, not from running them.

Tree: gates-onem clone, commit 2f94a73b04514344d98ba95e8eb5ca21d28f20ff. I read the base gates.mjs and Makefile from /home/ianblenke/docker/gods-eye-view.
