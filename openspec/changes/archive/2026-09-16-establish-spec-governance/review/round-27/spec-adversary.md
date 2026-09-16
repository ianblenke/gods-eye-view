Verdict: PASS
- [ ] F1 minor openspec/changes/archive/2026-09-15-establish-spec-governance/proposal.md:56 The limit `sample-identity` does not name the four files. The files are `src/annotations/annotationResolver.js`, `src/voice/gevActions.js`, `src/keylessGeocoder.js` and `src/search/placeSearch.js`. The ledger has no range for these files now. In the kept samples of the old base, runs 38, 55 and 58 of 57 runs (23 to 79) gave different counts for three of these files:
  - `annotationResolver.js`: 567 lines and 137 branches not covered, but the entry has 562 and 138.
  - `keylessGeocoder.js`: total branches 117, but the entry has 118.
  - `placeSearch.js`: total branches 22, but the entry has 23.

  The code of these three files and the test files that load them are the same in `d5b09ef` and `3ca81fb`. Only 10 runs on the new base had no difference, and at the old rate that result is probable. Thus about one run in 20 on a later pull request can stop with `LEDGER-LARGER-GAP`, `LEDGER-LOST-COVERAGE` or `LEDGER-STALE`, and the author of that pull request cannot correct it. Name the four files and the stop codes in the limit. As an alternative, keep the old-base ranges for the three files that have the same code and the same test files.
- [ ] F2 minor openspec/changes/archive/2026-09-15-establish-spec-governance/design.md:78 The text says that the Vite SSR loader runs "transformed copies of 10 files". On the base `3ca81fb`, `src/data/trafficTiming.test.mjs` loads `src/data/traffic.js`, and its import graph now has 25 files. The ledger has `untrue: true` for these 25 files, and the table at design.md:14-22 also gives 25. Change "10 files" to "25 files".
- [ ] F3 minor openspec/changes/archive/2026-09-15-establish-spec-governance/proposal.md:53 The limit `browser-coverage` gives `src/ui.js` as an example of code that needs a browser. On the base `3ca81fb`, `src/ui.js` has only 2 lines: a comment and a re-export from `./standalone/ui.js`. The browser code is now in `src/standalone/ui.js`, which has 153 lines that no test loads. Change the example to `src/standalone/ui.js`.
- [ ] F4 minor openspec/changes/archive/2026-09-15-establish-spec-governance/design.md:146 The text says that the commit in a history line "is the parent of the commit that contains the line". Both lines in `openspec/trace/history.jsonl` name `0685c58`, which is HEAD now. If the author amends `0685c58` to add the working-tree changes, the parent becomes `27e251e`. The lines then name a commit that is not in the branch. The gate does not check this field. Commit the changes as a child of `0685c58`, or change the text to "the HEAD commit when the command ran".
- [ ] F5 minor openspec/changes/archive/2026-09-15-establish-spec-governance/design.md:126 The instruction "before the stability command runs on a new base, remove the kept samples" is only in this archived design. It is not in `AGENTS.md`, in the `make stability` row, or in the stability command. The base of each later change is a new base. The rebuild in this round showed the result when a person forgets this step: stale samples gave the range 0 to 340 lines for `src/styles/thermal.js`. Later changes have the base width limit, so the risk is only the limit `sample-identity`. Add the step to `AGENTS.md`, or make the command ignore samples from an earlier base.

Notes:
- **Ledger against the base:**
  - `gaps.json` has 459 coverage entries and 231 test files with untraced names. The name counts add up to 3,244.
  - Each entry has `origin: pre-spec` and `since: 2026-09-15`.
  - Each file is in `3ca81fb`. Each hash is the SHA-256 of the file in `3ca81fb` and in the working tree.
  - The inventory has 580 files: 564 base files and 16 files in `scripts/spec/`. The 564 base files are 459 entries plus 105 files at 100%.
  - The branch changes no base code file. It changes only `package.json`, `package-lock.json` and `.github/workflows/ci.yml`.
- **Ranges:** `.gev-cache/spec-samples.jsonl` has 5 runs on the new base, which is 2,900 lines for 580 files. Only two files have different counts:
  - `ais-store.js`: 40 or 44 lines not covered, with total branches 64 or 62.
  - `labelArbiter.js`: 50 or 52 branches not covered, with total branches 405 or 407.

  The two ledger ranges and the two history lines agree with these samples. Each other entry agrees with all 5 samples. The widths are 4 and 2, so they are in the limit.
- **Gate on the first ledger:** `compareWithBase` returns no errors when the base has no ledger. Thus the gate does not check the width limit or the origin on the first ledger. I did these checks manually.
- **Hidden gaps:** The new tests import only `scripts/spec/`. `gates.mjs` imports `scripts/run-unit-tests.mjs`, but `src/unitTestRunner.test.mjs` in the base already loads that file. I found no new test that gives coverage to base code.
- **Trace:** `ids.json` and `links.json` are the same as before the rebase. They have 233 IDs, which agree with the 233 scenario IDs in `openspec/specs/`. The links name 283 tests. Each linked name is in its test file and contains its ID. `retired-ids.json` does not exist.
- **Effects of the rebase:**
  - `package-lock.json` is the same in `d5b09ef` and `3ca81fb`, so the old image has the correct `node_modules`.
  - `ALLOCATION_TEST_FILES`, `.github/` and `.gitignore` did not change upstream.
  - All 248 test files are in `src/`.
  - `check:boundaries` and `format:check` pass on a read-only mount.
  - `gates.mjs lint` gives 0 errors and 0 warnings.
- **Proposal and design:** The numbers 3,527, 121 of 580, 107, 25 and 283 agree with the gate output. The base commits `27e251e` and `3ca81fb` are correct. The table of unstable files agrees with the ledger. Apart from F2 and F3, I found no other stale text. Compared with the archived version in HEAD, only `proposal.md` and `design.md` changed.
- **Gate output:** `ERROR REVIEW-TREE` is expected, because `review.md` is written after this round. `MaxListenersExceededWarning` is a Node warning, not a gate warning.

I did not change a file in the repository, I did not run a git command that changes state, and I did not read `.env`. My experiment files are in `/tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/review-spec-r27/`.
