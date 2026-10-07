# Evidence for review corrections

The tree starts at commit `c87e7eb88b263791c21277a604ec23c745aafd0e`.
The command `git rev-parse HEAD` gives that commit.
The change is active at `openspec/changes/gates-one-measurement/`.
The results below apply to changes on that commit.
Earlier review reports name commit `2f94a73b04514344d98ba95e8eb5ca21d28f20ff`.

## Host command limits

All Node and Python commands use cores 12 to 15 and priority 19.
Test counts use one process per file without a forced exit option.
The host version command gave `v26.8.2`.
Host results do not replace the pinned container gates or CI.
The lead completes the final container gates and review tasks.

## Checks before code changes

The cache test failed because the marker list included `.gev-cache/private/app.js`.
The same test passes after the cache exclusion and after the command copies only the cache spec folder.
The command used the pattern `coverage-gate-094` with node:test.
The code and test path cases failed before the file class tests.
The commit ref case failed before the hash test.
The log `BD-before.log` has those results in the scratch folder.

## Runs that stopped early

The plain host test process stopped without test details.
A full host suite with the fixture helper stopped before it gave a result.
Those processes give no suite verdict.
The first old test with the fixture helper failed because the OpenSpec child process gave EPERM.
The host helper captures child output through files for later host checks.

## Decisions

Keep markers for ignored input files so the ratchet can record its dirty list.
Exclude `.gev-cache/` from the marker list.
Copy only `.gev-cache/spec/` back to keep other cache files safe.
Refuse changed code and test files under each of the three allowed paths.

Use forty hexadecimal digits for the ratchet commit.
The mode does not test commit ancestry. Its content comparison still checks a commit from another branch.
Only document mode reads the snapshot hash. Full gates and CI measure again.
Git can hide files with `assume-unchanged` or `skip-worktree`.




## Results

The final tree has changes on commit `c87e7eb88b263791c21277a604ec23c745aafd0e`.
The command `git rev-parse HEAD` gives that commit.
The change stays active. The review reports stay unchanged.

### C1: Unit files

The host command below starts one Node process for each test file.
Each Node command has no forced exit option.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/gates-onem/round1-tests.py
```

| File | Tests | Pass | Fail | Skip |
|---|---:|---:|---:|---:|
| ci.test.mjs | 6 | 6 | 0 | 0 |
| ciFiles.test.mjs | 4 | 4 | 0 | 0 |
| coverage.test.mjs | 15 | 15 | 0 | 0 |
| gates.test.mjs | 189 | 189 | 0 | 0 |
| git.test.mjs | 4 | 4 | 0 | 0 |
| importReach.test.mjs | 12 | 12 | 0 | 0 |
| inventory.test.mjs | 8 | 8 | 0 | 0 |
| ledger.test.mjs | 90 | 90 | 0 | 0 |
| openspec.test.mjs | 4 | 4 | 0 | 0 |
| qaRegister.test.mjs | 31 | 31 | 0 | 0 |
| registry.test.mjs | 15 | 15 | 0 | 0 |
| review.test.mjs | 33 | 33 | 0 | 0 |
| runParallel.test.mjs | 3 | 3 | 0 | 0 |
| specLint.test.mjs | 17 | 17 | 0 | 0 |
| specs.test.mjs | 20 | 20 | 0 | 0 |
| ste.test.mjs | 45 | 45 | 0 | 0 |
| testGuard.test.mjs | 31 | 31 | 0 | 0 |
| trace.test.mjs | 25 | 25 | 0 | 0 |
| traceReporter.test.mjs | 10 | 10 | 0 | 0 |
| v8Merge.test.mjs | 11 | 11 | 0 | 0 |

C1 gives 573 tests across 20 files.

C1 uses these exact Node commands:

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/ci.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/ciFiles.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/coverage.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none --experimental-test-coverage --test-coverage-include=scripts/spec/gates.mjs --test-coverage-include=scripts/spec/lib/measurement.mjs --test-reporter=spec --test-reporter-destination=stdout --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/gates-onem/round1-coverage.lcov src/tooling/spec/gates.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/git.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/importReach.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/inventory.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/ledger.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/openspec.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/qaRegister.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/registry.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/review.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/runParallel.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/specLint.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/specs.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/ste.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/testGuard.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/trace.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/traceReporter.test.mjs
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none src/tooling/spec/v8Merge.test.mjs
```

The gate test command ran again after the final code log changes.
The review test command ran again after the guidance changes.
The marker test command ran again after the final title changes:

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none --test-name-pattern='coverage-gate-094|coverage-gate-097' src/tooling/spec/gates.test.mjs
```

```text
✔ [coverage-gate-094] keep cache source contents after the container ends (413.279482ms)
✔ [coverage-gate-094] copy cache contents without a marker list (306.830594ms)
✔ [coverage-gate-097] stop before the container copies files after a marker error (291.399523ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1479.539008
```

### C2: Host coverage

The final gate test command supplies the current coverage file.
The baseline command below uses the scratch tree from the named base commit.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/gates-onem/harden-host.mjs --test --test-isolation=none --experimental-test-coverage --test-coverage-include=/home/ianblenke/docker/gev-tools/gates-onem/round1-base-c87e7eb/scripts/spec/gates.mjs --test-coverage-include=/home/ianblenke/docker/gev-tools/gates-onem/round1-base-c87e7eb/scripts/spec/lib/measurement.mjs --test-reporter=spec --test-reporter-destination=stdout --test-reporter=lcov --test-reporter-destination=/home/ianblenke/docker/gev-tools/gates-onem/round1-baseline.lcov /home/ianblenke/docker/gev-tools/gates-onem/round1-base-c87e7eb/src/tooling/spec/gates.test.mjs
```

| Tree | File | Lines | Branches | Functions |
|---|---|---:|---:|---:|
| Before | gates.mjs | 737/737 (100%) | 317/317 (100%) | 87/87 (100%) |
| Before | measurement.mjs | 65/65 (100%) | 53/53 (100%) | 8/8 (100%) |
| After | gates.mjs | 737/737 (100%) | 317/317 (100%) | 87/87 (100%) |
| After | measurement.mjs | 65/65 (100%) | 57/57 (100%) | 8/8 (100%) |

### C3: Mutations

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem NODE_OPTIONS=--test-isolation=none taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/gates-onem /home/ianblenke/docker/gev-tools/gates-onem/muts.json
```

C3 made a repository test fail for all 151 rows.
No row had a timeout. No row had absent or repeated old code.
No mutation remains without a test that fails.

The mutation table and exact code are below.

| ID | Repository test that failed |
|---|---|
| 068-tests | [coverage-gate-068] trust a changed document |
| 123-twice | [gap-ledger-123] compare one ratchet measurement |
| 124-review | [gap-ledger-124] fail for an absent review |
| 125-status | [gap-ledger-125] pass after all comparisons |
| 126-ledger | [gap-ledger-126] compare repaired ledger values |
| 069-path | [coverage-gate-069 coverage-gate-078] classify a protected ignored code file |
| 070-path | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs |
| 071-path | [coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs |
| 072-path | [coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json |
| 073-path | [coverage-gate-073 coverage-gate-078] classify the ignored Node version |
| 074-path | [coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile |
| 075-path | [coverage-gate-075 coverage-gate-078] refuse an ignored file at Dockerfile |
| 076-path | [coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml |
| 077-path | [coverage-gate-077 coverage-gate-078] refuse an ignored file at scripts/spec/ignored.txt |
| 078-untracked | [coverage-gate-078] refuse an untracked code file |
| 079-history | [coverage-gate-079] refuse history from another change or command |
| 079-change | [coverage-gate-079] refuse history from another change or command |
| 080-commit | [coverage-gate-080] refuse a commit that Git cannot find |
| 081-words | [coverage-gate-081] refuse a changed word list |
| 082-hash | [coverage-gate-082] refuse an absent snapshot |
| 082-absent | [coverage-gate-082] refuse an absent snapshot |
| 083-start | [coverage-gate-083] show command times |
| 083-finish | [coverage-gate-083] show command times |
| 084-cutoff | [coverage-gate-084] show slow phase times |
| 084-phase | [coverage-gate-084] show slow phase times |
| 085-links | [coverage-gate-085] keep every file check |
| 085-registry | [coverage-gate-085] check the base registry without tests |
| 085-specs | [coverage-gate-085] keep every file check |
| 085-lint | [coverage-gate-085] keep every file check |
| 011-precheck | [ci-gates-011] add fast checks before review |
| 012-docs | [ci-gates-012] add a document gate target |
| 033-final | [change-review-033] keep the final measurement |
| 068-own-option | [coverage-gate-068] set the document option on the options object |
| 068-dependencies | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 086-package | [coverage-gate-086 coverage-gate-078] refuse an ignored file at package.json |
| 087-diff | [coverage-gate-087] refuse a failed Git comparison |
| 087-others | [coverage-gate-087] refuse a failed Git comparison |
| 085-openspec | [coverage-gate-085] check OpenSpec without tests |
| 085-archive | [coverage-gate-085] check archived specs without tests |
| 085-filters | [coverage-gate-085] check coverage filters without tests |
| 126-totals | [gap-ledger-126] repair absent totals and stale test names |
| 126-stale | [gap-ledger-126] compare repaired ledger values |
| 126-version | [gap-ledger-126] compare repaired ledger values |
| 012-copy | [ci-gates-012] add a document gate target |
| 068-command-option | [coverage-gate-068] set the document option on the options object |
| 124-status | [gap-ledger-124] fail for an absent review |
| 083-check-time | [coverage-gate-083] name the full check command |
| 083-ratchet-time | [coverage-gate-083] show command times |
| 084-elapsed | [coverage-gate-084] show slow phase times |
| 127-history | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 127-stamp | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 128-same | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 129-hash | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 129-commit | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 129-change | [gap-ledger-129] record a different change without a changed gap |
| 011-format | [ci-gates-011] add fast checks before review |
| 011-boundaries | [ci-gates-011] add fast checks before review |
| 011-tokens | [ci-gates-011] add fast checks before review |
| 069-tracked | [coverage-gate-069] refuse a new tracked inventory file |
| 069-base | [coverage-gate-069 coverage-gate-092] refuse a moved code file |
| 078-inventory | [coverage-gate-078] refuse an untracked code file |
| 085-base | [coverage-gate-085] compare the ledger with the base without tests |
| 085-ledger | [coverage-gate-085] compare the ledger with the base without tests |
| 085-base-registry | [coverage-gate-085] check the base registry without tests |
| 085-archive-reviews | [coverage-gate-085] check all review files without tests |
| 085-names | [coverage-gate-085] check all review files without tests |
| 085-agents | [coverage-gate-085] check all review files without tests |
| 085-command | [coverage-gate-085] check all review files without tests |
| 033-precheck | [change-review-033] keep the final measurement |
| 033-step1 | [change-review-033] keep the final measurement |
| 033-step3 | [change-review-033] keep the final measurement |
| 033-step10 | [change-review-033] keep the final measurement |
| 033-step11 | [change-review-033] keep the final measurement |
| 033-step15 | [change-review-033] keep the final measurement |
| 033-ci | [change-review-033] keep the final measurement |
| 005-ci-phase | [ci-gates-005 coverage-gate-083] keep the CI verdict without command times |
| 127-summary | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| 068-trace-write | [coverage-gate-068] trust a changed document |
| 033-review-inputs | [change-review-033] keep the final measurement |
| 033-agent-inputs | [change-review-033] keep the final measurement |
| 012-docs-back | [ci-gates-012] add a document gate target |
| 012-docs-copy | [ci-gates-012] add a document gate target |
| 012-docs-env | [ci-gates-012] add a document gate target |
| 012-change | [ci-gates-012] add a document gate target |
| 012-base | [ci-gates-012] add a document gate target |
| 012-markers | [ci-gates-012] add a document gate target |
| 088-names | [coverage-gate-088] refuse an omitted input file |
| 088-file | [coverage-gate-088] refuse an omitted input file |
| 088-content | [coverage-gate-088] refuse an omitted input file |
| 088-exists | [coverage-gate-088] refuse an omitted input file |
| 089-changes | [coverage-gate-089] trust a changed file at openspec/changes/archive/x/notes.md |
| 089-specs | [coverage-gate-089] trust a changed file at openspec/specs/x.md |
| 089-trace | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 091-slash | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/changes-old/x.md |
| 092-second-name | [coverage-gate-069 coverage-gate-092] refuse a moved code file |
| 090-all-paths | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/agents/x.md |
| 078-ignored | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs |
| 078-cache | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 087-ignored-status | [coverage-gate-087] refuse a failed Git comparison |
| 093-dirty | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their content returns to HEAD |
| 130-dirty-field | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their content returns to HEAD |
| 131-empty-field | [gap-ledger-131 gap-ledger-133] accept clean history without a dirty field |
| 132-dirty-equality | [gap-ledger-130 gap-ledger-132] sort dirty names and compare repeated history |
| 130-dirty-paths | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their content returns to HEAD |
| 130-git-failure | [gap-ledger-130] refuse a failed ratchet file comparison |
| 133-reader | [gap-ledger-133] accept dirty history in each reader |
| 134-image-markers | [gap-ledger-134] add ignored name markers before the ratchet command |
| 078-root-deps | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 078-nested-deps | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 078-deps-slash | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs |
| 134-definition-order | [gap-ledger-134] add ignored name markers before the ratchet command |
| 134-command | [gap-ledger-134] add ignored name markers before the ratchet command |
| 130-sort | [gap-ledger-130 gap-ledger-132] sort dirty names and compare repeated history |
| 078-inventory-source | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| 094-cache-marker | [coverage-gate-094] keep cache source contents after the container ends |
| 094-cache-back | [coverage-gate-094] keep cache source contents after the container ends |
| 091-trace-slash | [coverage-gate-091] refuse the input file at openspec/tracex/f.md |
| 078-cache-slash | [coverage-gate-078] refuse the input file at .gev-cachex/ignored.test.mjs |
| 080-commit-name | [coverage-gate-080] refuse a commit that Git cannot find |
| 095-test-class | [coverage-gate-095] refuse a new test file at openspec/changes/code.test.mjs |
| 095-code-class | [coverage-gate-095] refuse a new code file at openspec/changes/code.js |
| 096-commit-hash | [coverage-gate-096] refuse a commit ref in history |
| 083-check-command | [coverage-gate-083] name the full check command |
| 011-precheck-status | [ci-gates-011] add fast checks before review |
| 126-history-after | [gap-ledger-126] read the new totals history line for the base ledger |
| 075-root | [coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod |
| 075-nested | [coverage-gate-075 coverage-gate-078] refuse the input file at containers/Dockerfile.gates |
| 075-suffix | [coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod |
| 076-root | [coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml |
| 076-prefix | [coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml |
| 076-suffix | [coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml |
| 076-yaml | [coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml |
| 076-yml | [coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml |
| 075-boundary | [coverage-gate-075] exclude the ignored name MyDockerfile |
| 075-end | [coverage-gate-075] exclude the ignored name Dockerfile.dir/notes.txt |
| 075-no-slash | [coverage-gate-075] exclude the ignored name Dockerfile.dir/notes.txt |
| 076-prefix-characters | [coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml |
| 076-suffix-no-slash | [coverage-gate-076] exclude the ignored name compose/other.yaml |
| 076-dot | [coverage-gate-076] exclude the ignored name composeyml |
| 076-end | [coverage-gate-076] exclude the ignored name compose.yaml.extra |
| 096-start | [coverage-gate-096] refuse the commit hash with prefix |
| 096-end | [coverage-gate-096] refuse the commit hash with suffix |
| 096-length | [coverage-gate-096] refuse the commit hash with short |
| 096-hex | [coverage-gate-096] refuse the commit hash with letters |
| 033-input-correction | [change-review-033] keep the final measurement |
| 094-marker-cleanup | [coverage-gate-094] keep cache source contents after the container ends |
| 094-marker-list | [coverage-gate-094] keep cache source contents after the container ends |
| 094-marker-no-list | [coverage-gate-094] copy cache contents without a marker list |
| 097-copy-status | [coverage-gate-097] stop before the container copies files after a marker error |
| 011-precheck-import-status | [ci-gates-011] add fast checks before review |
| 011-precheck-boundary-status | [ci-gates-011] add fast checks before review |

The next block gives the exact old code, new code and failed test for each row.

```json
[
  {
    "id": "068-tests",
    "file": "scripts/spec/gates.mjs",
    "old": "? documentMeasurement({ root, change, openSpec, snapshot, phase })",
    "new": "? phase('measure', () => measure({ root, spawn, env, allocationFiles, change, openSpec, phase }))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-068",
    "failed_test": "[coverage-gate-068] trust a changed document"
  },
  {
    "id": "123-twice",
    "file": "scripts/spec/gates.mjs",
    "old": "  const { counts } = measured.trace.report;",
    "new": "  if (command === 'ratchet') measure({ root, spawn, env, allocationFiles, change, openSpec, phase });\n  const { counts } = measured.trace.report;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-123",
    "failed_test": "[gap-ledger-123] compare one ratchet measurement"
  },
  {
    "id": "124-review",
    "file": "scripts/spec/gates.mjs",
    "old": "...(folder ? checkChangeReview(root, change, { treeHash: computeTreeHash({ root, changeDir: folder, diffFiles }) }) : []),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-124",
    "failed_test": "[gap-ledger-124] fail for an absent review"
  },
  {
    "id": "125-status",
    "file": "scripts/spec/gates.mjs",
    "old": "return command === 'ratchet' && status !== 0 ? 2 : status;",
    "new": "return command === 'ratchet' ? 2 : status;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-125",
    "failed_test": "[gap-ledger-125] pass after all comparisons"
  },
  {
    "id": "126-ledger",
    "file": "scripts/spec/gates.mjs",
    "old": "    ledger = readLedger(root);",
    "new": "    ledger = ledger;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-126",
    "failed_test": "[gap-ledger-126] compare repaired ledger values"
  },
  {
    "id": "069-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  return inventory.has(file);",
    "new": "  return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-069",
    "failed_test": "[coverage-gate-069 coverage-gate-078] classify a protected ignored code file"
  },
  {
    "id": "070-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (isTestFile(file)) return true;",
    "new": "  if (isTestFile(file)) return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-070",
    "failed_test": "[coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs"
  },
  {
    "id": "071-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (/^scripts\\/qa-.*\\.mjs$/.test(file)) return true;",
    "new": "  if (/^scripts\\/qa-.*\\.mjs$/.test(file)) return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-071",
    "failed_test": "[coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs"
  },
  {
    "id": "072-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (file === 'package-lock.json') return true;",
    "new": "  if (file === 'package-lock.json') return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-072",
    "failed_test": "[coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json"
  },
  {
    "id": "073-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (file === '.node-version') return true;",
    "new": "  if (file === '.node-version') return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-073",
    "failed_test": "[coverage-gate-073 coverage-gate-078] classify the ignored Node version"
  },
  {
    "id": "074-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (file === 'Makefile') return true;",
    "new": "  if (file === 'Makefile') return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-074",
    "failed_test": "[coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile"
  },
  {
    "id": "075-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (/(^|\\/)Dockerfile[^/]*$/.test(file)) return true;",
    "new": "  if (/(^|\\/)Dockerfile[^/]*$/.test(file)) return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-075",
    "failed_test": "[coverage-gate-075 coverage-gate-078] refuse an ignored file at Dockerfile"
  },
  {
    "id": "076-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/.test(file)) return true;",
    "new": "  if (/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/.test(file)) return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-076",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml"
  },
  {
    "id": "077-path",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (file.startsWith('scripts/spec/')) return true;",
    "new": "  if (file.startsWith('scripts/spec/')) return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-077",
    "failed_test": "[coverage-gate-077 coverage-gate-078] refuse an ignored file at scripts/spec/ignored.txt"
  },
  {
    "id": "078-untracked",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "const others = spawn('git', ['ls-files', '--others', '--exclude-standard', '-z'], options);",
    "new": "const others = { status: 0, stdout: '' };",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-078",
    "failed_test": "[coverage-gate-078] refuse an untracked code file"
  },
  {
    "id": "079-history",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "['coverage', 'untraced', 'measurement'].includes(item.kind)",
    "new": "true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-079",
    "failed_test": "[coverage-gate-079] refuse history from another change or command"
  },
  {
    "id": "079-change",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "item.change === change &&",
    "new": "true &&",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-079",
    "failed_test": "[coverage-gate-079] refuse history from another change or command"
  },
  {
    "id": "080-commit",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "resolveCommit(root, line.commit) : null",
    "new": "resolveCommit(root, 'HEAD') : null",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-080",
    "failed_test": "[coverage-gate-080] refuse a commit that Git cannot find"
  },
  {
    "id": "081-words",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "new": "file && file !== 'openspec/ste/words.json' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-081",
    "failed_test": "[coverage-gate-081] refuse a changed word list"
  },
  {
    "id": "082-hash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "if (contentHash(text) !== line.measurement)",
    "new": "if (false)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-082",
    "failed_test": "[coverage-gate-082] refuse an absent snapshot"
  },
  {
    "id": "082-absent",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "if (!existsSync(absolute)) return",
    "new": "if (false) return",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-082",
    "failed_test": "[coverage-gate-082] refuse an absent snapshot"
  },
  {
    "id": "083-start",
    "file": "scripts/spec/gates.mjs",
    "old": "  log(`Started: ${started.toISOString()}`);",
    "new": "  log('Started: wrong');",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-083",
    "failed_test": "[coverage-gate-083] show command times"
  },
  {
    "id": "083-finish",
    "file": "scripts/spec/gates.mjs",
    "old": "log(`Finished: ${finished.toISOString()} (${(finished.getTime() - started.getTime()) / 1000} s)`);",
    "new": "log('Finished: wrong');",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-083",
    "failed_test": "[coverage-gate-083] show command times"
  },
  {
    "id": "084-cutoff",
    "file": "scripts/spec/gates.mjs",
    "old": "if (seconds > 1) log",
    "new": "if (seconds >= 1) log",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-084",
    "failed_test": "[coverage-gate-084] show slow phase times"
  },
  {
    "id": "084-phase",
    "file": "scripts/spec/gates.mjs",
    "old": "log(`Phase ${name}: ${seconds} s`)",
    "new": "log(`Phase wrong: ${seconds} s`)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-084",
    "failed_test": "[coverage-gate-084] show slow phase times"
  },
  {
    "id": "085-links",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkLinks({ links: readLinks(root), current: measured.links }),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] keep every file check"
  },
  {
    "id": "085-registry",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkRegistry({ registry, scenarios: measured.specs.scenarios, retired: measured.specs.retired }),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check the base registry without tests"
  },
  {
    "id": "085-specs",
    "file": "scripts/spec/gates.mjs",
    "old": "errors.push(...lintSpecs({ requirements: specs.requirements, orphans: specs.orphans, changeIds: specs.changeIds, readTasks: tasksReader(root) }));",
    "new": "errors.push();",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] keep every file check"
  },
  {
    "id": "085-lint",
    "file": "scripts/spec/gates.mjs",
    "old": "const lint = phase('lint', () => lintFindings(root, measured.records));",
    "new": "const lint = { errors: [], warnings: [], failed: false };",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] keep every file check"
  },
  {
    "id": "011-precheck",
    "file": "Makefile",
    "old": "node scripts/check-import-directions.mjs &&",
    "new": "true &&",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "012-docs",
    "file": "Makefile",
    "old": "check --no-measure $(CHANGE_ARG) $(BASE_ARG)",
    "new": "check $(CHANGE_ARG) $(BASE_ARG)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "033-final",
    "file": ".claude/commands/opsx/review.md",
    "old": "Then run `make gates CHANGE=<name>` on the final tree.",
    "new": "Then continue on the final tree.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "068-own-option",
    "file": "scripts/spec/gates.mjs",
    "old": "options.noMeasure = true;",
    "new": "options.noMeasure = undefined;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-068",
    "failed_test": "[coverage-gate-068] set the document option on the options object"
  },
  {
    "id": "068-dependencies",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "!/(^|\\/)node_modules\\//.test(file) && ",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "trust other ignored files",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "086-package",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "  if (file === 'package.json') return true;",
    "new": "  if (file === 'package.json') return false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-086",
    "failed_test": "[coverage-gate-086 coverage-gate-078] refuse an ignored file at package.json"
  },
  {
    "id": "087-diff",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "diff.status !== 0 || others.status !== 0",
    "new": "false || others.status !== 0",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-087",
    "failed_test": "[coverage-gate-087] refuse a failed Git comparison"
  },
  {
    "id": "087-others",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "diff.status !== 0 || others.status !== 0",
    "new": "diff.status !== 0 || false",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-087",
    "failed_test": "[coverage-gate-087] refuse a failed Git comparison"
  },
  {
    "id": "085-openspec",
    "file": "scripts/spec/gates.mjs",
    "old": "errors.push(...checkOpenSpec({ root, specs, run: (args) => openSpec(root, args) }));",
    "new": "errors.push();",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check OpenSpec without tests"
  },
  {
    "id": "085-archive",
    "file": "scripts/spec/gates.mjs",
    "old": "errors.push(...archived.errors, ...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));",
    "new": "errors.push(...lintSpecs({ requirements: archived.requirements, orphans: archived.orphans, changeIds, readTasks: tasksReader(root) }));",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check archived specs without tests"
  },
  {
    "id": "085-filters",
    "file": "scripts/spec/gates.mjs",
    "old": "errors.push(...findCoverageFlags({ tracked, readFile }));",
    "new": "errors.push();",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check coverage filters without tests"
  },
  {
    "id": "126-totals",
    "file": "scripts/spec/lib/ledger.mjs",
    "old": "'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'",
    "new": "'LEDGER-STALE', 'LEDGER-VERSION'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-126",
    "failed_test": "[gap-ledger-126] repair absent totals and stale test names"
  },
  {
    "id": "126-stale",
    "file": "scripts/spec/lib/ledger.mjs",
    "old": "'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'",
    "new": "'LEDGER-NO-TOTALS', 'LEDGER-VERSION'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-126",
    "failed_test": "[gap-ledger-126] compare repaired ledger values"
  },
  {
    "id": "126-version",
    "file": "scripts/spec/lib/ledger.mjs",
    "old": "'LEDGER-STALE', 'LEDGER-NO-TOTALS', 'LEDGER-VERSION'",
    "new": "'LEDGER-STALE', 'LEDGER-NO-TOTALS'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-126",
    "failed_test": "[gap-ledger-126] compare repaired ledger values"
  },
  {
    "id": "012-copy",
    "file": "Makefile",
    "old": "cp /src/.gev-cache/spec/measurement.json /tmp/work/.gev-cache/spec/measurement.json",
    "new": "true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "068-command-option",
    "file": "scripts/spec/gates.mjs",
    "old": "key === '--no-measure' && command === 'check'",
    "new": "key === '--no-measure' && true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-068",
    "failed_test": "[coverage-gate-068] set the document option on the options object"
  },
  {
    "id": "124-status",
    "file": "scripts/spec/gates.mjs",
    "old": "return command === 'ratchet' && status !== 0 ? 2 : status;",
    "new": "return status;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-124",
    "failed_test": "[gap-ledger-124] fail for an absent review"
  },
  {
    "id": "083-check-time",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'ratchet';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-083",
    "failed_test": "[coverage-gate-083] name the full check command"
  },
  {
    "id": "083-ratchet-time",
    "file": "scripts/spec/gates.mjs",
    "old": "const timed = parsed.command === 'check' || parsed.command === 'ratchet';",
    "new": "const timed = parsed.command === 'check';",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-083",
    "failed_test": "[coverage-gate-083] show command times"
  },
  {
    "id": "084-elapsed",
    "file": "scripts/spec/gates.mjs",
    "old": "(finished.getTime() - started.getTime()) / 1000",
    "new": "(finished.getTime() - started.getTime()) / 1",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-084",
    "failed_test": "[coverage-gate-084] show slow phase times"
  },
  {
    "id": "127-history",
    "file": "scripts/spec/gates.mjs",
    "old": "unchanged ? [] : [{ date, change, commit: headCommit(root), kind: 'measurement' }]",
    "new": "[]",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-127",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "127-stamp",
    "file": "scripts/spec/gates.mjs",
    "old": "history.map(line => ({ ...line, measurement, ...(dirty.length > 0 ? { dirty } : {}) }))",
    "new": "history.map(line => ({ ...line, ...(dirty.length > 0 ? { dirty } : {}) }))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-127",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "128-same",
    "file": "scripts/spec/gates.mjs",
    "old": "const unchanged = previous?.measurement === measurement && previous.commit === headCommit(root) && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty);",
    "new": "const unchanged = false;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-128",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "129-hash",
    "file": "scripts/spec/gates.mjs",
    "old": "previous?.measurement === measurement && previous.commit === headCommit(root)",
    "new": "true && previous.commit === headCommit(root)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-129",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "129-commit",
    "file": "scripts/spec/gates.mjs",
    "old": "previous?.measurement === measurement && previous.commit === headCommit(root)",
    "new": "previous?.measurement === measurement && true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-129",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "129-change",
    "file": "scripts/spec/gates.mjs",
    "old": "findLast(line => line.change === change)",
    "new": "findLast(line => true)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-129",
    "failed_test": "[gap-ledger-129] record a different change without a changed gap"
  },
  {
    "id": "011-format",
    "file": "Makefile",
    "old": "node scripts/format.mjs --check &&",
    "new": "true &&",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "011-boundaries",
    "file": "Makefile",
    "old": "node scripts/check-package-boundaries.mjs &&",
    "new": "true &&",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "011-tokens",
    "file": "Makefile",
    "old": "node scripts/check-layer-state-tokens.mjs --base-ref origin/main",
    "new": "true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "069-tracked",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "new": "file && file !== 'src/new.js' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-069",
    "failed_test": "[coverage-gate-069] refuse a new tracked inventory file"
  },
  {
    "id": "069-base",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "new": "file && file !== 'src/math.js' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-069",
    "failed_test": "[coverage-gate-069 coverage-gate-092] refuse a moved code file"
  },
  {
    "id": "078-inventory",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "new": "file && file !== 'src/new.js' && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix)))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-078",
    "failed_test": "[coverage-gate-078] refuse an untracked code file"
  },
  {
    "id": "085-base",
    "file": "scripts/spec/gates.mjs",
    "old": "const baseErrors = compareWithBase({",
    "new": "const baseErrors = (() => [])({",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] compare the ledger with the base without tests"
  },
  {
    "id": "085-ledger",
    "file": "scripts/spec/gates.mjs",
    "old": "const comparison = compareLedger({ ledger, current: measured.current, sameAsBase, waivers });",
    "new": "const comparison = { errors: [], stale: [] };",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] compare the ledger with the base without tests"
  },
  {
    "id": "085-base-registry",
    "file": "scripts/spec/gates.mjs",
    "old": "...compareRegistryWithBase({ registry, baseRegistry: JSON.parse(readFileAt(root, base, 'openspec/trace/ids.json') ?? 'null'), retired: measured.specs.retired, changedTestIds: changedTestIds(measured.records) }),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check the base registry without tests"
  },
  {
    "id": "085-archive-reviews",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkArchivedReviews(root, { except: folder }),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check all review files without tests"
  },
  {
    "id": "085-names",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkChangeNames(root),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check all review files without tests"
  },
  {
    "id": "085-agents",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkAgents(root),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check all review files without tests"
  },
  {
    "id": "085-command",
    "file": "scripts/spec/gates.mjs",
    "old": "...checkReviewCommand(root),",
    "new": "...[],",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-085",
    "failed_test": "[coverage-gate-085] check all review files without tests"
  },
  {
    "id": "033-precheck",
    "file": ".claude/commands/opsx/review.md",
    "old": "1. Run `make precheck`.",
    "new": "1. Continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-step1",
    "file": ".claude/commands/opsx/review.md",
    "old": "Then run `make gates-docs CHANGE=<name>`.",
    "new": "Then continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-step3",
    "file": ".claude/commands/opsx/review.md",
    "old": "3. Run `make gates-docs CHANGE=<name>` again.",
    "new": "3. Continue again.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-step10",
    "file": ".claude/commands/opsx/review.md",
    "old": "Use `make gates-docs CHANGE=<name>` and start again at step 3.",
    "new": "Start again at step 3.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-step11",
    "file": ".claude/commands/opsx/review.md",
    "old": "Then run `make gates-docs CHANGE=<name>`, which must give only review errors.",
    "new": "Then continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-step15",
    "file": ".claude/commands/opsx/review.md",
    "old": "15. Run `make gates-docs CHANGE=<name>`.",
    "new": "15. Continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-ci",
    "file": ".claude/commands/opsx/review.md",
    "old": "CI must also pass before you merge.",
    "new": "Continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "005-ci-phase",
    "file": "scripts/spec/gates.mjs",
    "old": "phase: (_name, fn) => fn ? fn() : () => {}",
    "new": "phase: (_name, fn) => fn()",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "keep the CI verdict",
    "failed_test": "[ci-gates-005 coverage-gate-083] keep the CI verdict without command times"
  },
  {
    "id": "127-summary",
    "file": "scripts/spec/gates.mjs",
    "old": "log(`Ratchet: ${history.length} history lines for ${change}.`);",
    "new": "log(`Ratchet: ${result.history.length} history lines for ${change}.`);",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-127",
    "failed_test": "[gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes"
  },
  {
    "id": "068-trace-write",
    "file": "scripts/spec/gates.mjs",
    "old": "  return { ...snapshot, specs, trace, qaScripts:",
    "new": "  writeLinks(root, buildLinks(trace.report));\n  return { ...snapshot, specs, trace, qaScripts:",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-068",
    "failed_test": "[coverage-gate-068] trust a changed document"
  },
  {
    "id": "033-review-inputs",
    "file": ".claude/commands/opsx/review.md",
    "old": "Make sure that the ratchet commit has all input files.",
    "new": "Continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "033-agent-inputs",
    "file": "AGENTS.md",
    "old": "Commit each file outside openspec/changes/, openspec/specs/ and openspec/trace/.",
    "new": "Continue with input files.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "012-docs-back",
    "file": "Makefile",
    "old": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "new": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"; $(GATES_BACK) || exit 2' gates",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "012-docs-copy",
    "file": "Makefile",
    "old": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "new": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c 'true || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "012-docs-env",
    "file": "Makefile",
    "old": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "new": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; node scripts/spec/gates.mjs \"$$@\"' gates",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "012-change",
    "file": "Makefile",
    "old": "$(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)",
    "new": "$(GATES_DOCS) check --no-measure $(BASE_ARG)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "012-base",
    "file": "Makefile",
    "old": "$(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)",
    "new": "$(GATES_DOCS) check --no-measure $(CHANGE_ARG)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "012-markers",
    "file": "Makefile",
    "old": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "new": "GATES_DOCS := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"' gates",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-012",
    "failed_test": "[ci-gates-012] add a document gate target"
  },
  {
    "id": "088-names",
    "file": "Makefile",
    "old": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "new": "cd /src && : > /tmp/doc-markers && git ls-files --others --exclude-standard -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-088",
    "failed_test": "[coverage-gate-088] refuse an omitted input file"
  },
  {
    "id": "088-file",
    "file": "Makefile",
    "old": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "new": "cd /tmp/work",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-088",
    "failed_test": "[coverage-gate-088] refuse an omitted input file"
  },
  {
    "id": "088-content",
    "file": "Makefile",
    "old": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "new": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"source\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-088",
    "failed_test": "[coverage-gate-088] refuse an omitted input file"
  },
  {
    "id": "088-exists",
    "file": "Makefile",
    "old": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "new": "cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-088",
    "failed_test": "[coverage-gate-088] refuse an omitted input file"
  },
  {
    "id": "089-changes",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'openspec/changes/'",
    "new": "'no/changes/'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-089",
    "failed_test": "[coverage-gate-089] trust a changed file at openspec/changes/archive/x/notes.md"
  },
  {
    "id": "089-specs",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'openspec/specs/'",
    "new": "'no/specs/'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-089",
    "failed_test": "[coverage-gate-089] trust a changed file at openspec/specs/x.md"
  },
  {
    "id": "089-trace",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'openspec/trace/'",
    "new": "'no/trace/'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-089",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "091-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "file.startsWith(prefix)",
    "new": "file.startsWith(prefix.slice(0, -1))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-091",
    "failed_test": "[coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/changes-old/x.md"
  },
  {
    "id": "092-second-name",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'--no-renames'",
    "new": "'--find-renames'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-092",
    "failed_test": "[coverage-gate-069 coverage-gate-092] refuse a moved code file"
  },
  {
    "id": "090-all-paths",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "const changed = [...diff.stdout.split('\\0'), ...others.stdout.split('\\0')]",
    "new": "const changed = []",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-090",
    "failed_test": "[coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/agents/x.md"
  },
  {
    "id": "078-ignored",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "const ignored = spawn('git', ['ls-files', '--others', '--ignored', '--exclude-standard', '-z'], options);",
    "new": "const ignored = { status: 0, stdout: '' };",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file",
    "failed_test": "[coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs"
  },
  {
    "id": "078-cache",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "!file.startsWith('.gev-cache/') && ",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "trust other ignored files",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "087-ignored-status",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": " || ignored.status !== 0",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-087",
    "failed_test": "[coverage-gate-087] refuse a failed Git comparison"
  },
  {
    "id": "093-dirty",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "if (line.dirty?.length > 0)",
    "new": "if (false)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-093",
    "failed_test": "[coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their content returns to HEAD"
  },
  {
    "id": "130-dirty-field",
    "file": "scripts/spec/gates.mjs",
    "old": "...(dirty.length > 0 ? { dirty } : {})",
    "new": "...{}",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-130",
    "failed_test": "[coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their content returns to HEAD"
  },
  {
    "id": "131-empty-field",
    "file": "scripts/spec/gates.mjs",
    "old": "...(dirty.length > 0 ? { dirty } : {})",
    "new": "...{ dirty }",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-131",
    "failed_test": "[gap-ledger-131 gap-ledger-133] accept clean history without a dirty field"
  },
  {
    "id": "132-dirty-equality",
    "file": "scripts/spec/gates.mjs",
    "old": " && JSON.stringify(previous.dirty ?? []) === JSON.stringify(dirty)",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-132",
    "failed_test": "[gap-ledger-130 gap-ledger-132] sort dirty names and compare repeated history"
  },
  {
    "id": "130-dirty-paths",
    "file": "scripts/spec/gates.mjs",
    "old": "const dirty = difference.files;",
    "new": "const dirty = [];",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-130",
    "failed_test": "[coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their content returns to HEAD"
  },
  {
    "id": "130-git-failure",
    "file": "scripts/spec/gates.mjs",
    "old": "if (difference.reason) return report(log, [{ code: 'GATES-RATCHET', file: HISTORY_FILE, message: difference.reason }]);",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "failed ratchet file comparison",
    "failed_test": "[gap-ledger-130] refuse a failed ratchet file comparison"
  },
  {
    "id": "133-reader",
    "file": "scripts/spec/lib/ledger.mjs",
    "old": ".map((line) => JSON.parse(line));",
    "new": ".map((line) => JSON.parse(line)).filter(line => !line.dirty);",
    "test": [
      "src/tooling/spec/ledger.test.mjs"
    ],
    "pattern": "gap-ledger-133",
    "failed_test": "[gap-ledger-133] accept dirty history in each reader"
  },
  {
    "id": "134-image-markers",
    "file": "Makefile",
    "old": "if [ \"$$1\" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi;",
    "new": ":",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-134",
    "failed_test": "[gap-ledger-134] add ignored name markers before the ratchet command"
  },
  {
    "id": "078-root-deps",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "(^|\\/)node_modules",
    "new": "(\\/)node_modules",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "trust other ignored files",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "078-nested-deps",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "(^|\\/)node_modules",
    "new": "(^)node_modules",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "trust other ignored files",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "078-deps-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "node_modules\\//.test(file)",
    "new": "node_modules/.test(file)",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file",
    "failed_test": "[coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs"
  },
  {
    "id": "134-definition-order",
    "file": "Makefile",
    "old": "GATES_DOCS_MARKERS := cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work\nGATES := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ \"$$1\" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates",
    "new": "GATES := docker run --rm -v \"$(CURDIR)\":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ \"$$1\" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs \"$$@\"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates\nGATES_DOCS_MARKERS := cd /src && : > /tmp/doc-markers && git ls-files --others -z -- \"scripts/spec\" \"package.json\" \"package-lock.json\" \".node-version\" \"Makefile\" \":(glob)scripts/qa-*.mjs\" \":(glob)**/*.test.mjs\" \":(glob)**/Dockerfile*\" \":(glob)**/*compose*.yaml\" \":(glob)**/*compose*.yml\" \":(glob)**/*.js\" \":(glob)**/*.mjs\" \":(glob)**/*.cjs\" \":(glob)**/*.ts\" \":(glob)**/*.mts\" \":(glob)**/*.cts\" \":(glob)**/*.jsx\" \":(glob)**/*.tsx\" \":(glob)**/*.html\" \":(glob)**/*.sh\" \":(exclude,glob)**/node_modules/**\" \":(exclude,glob).gev-cache/**\" > /tmp/doc-inputs && xargs -0 -r sh -c \"for marker_file do marker_path=/tmp/work/\\$$marker_file; if [ ! -e \\\"\\$$marker_path\\\" ]; then mkdir -p \\\"\\$$(dirname \\\"\\$$marker_path\\\")\\\" && printf \\\"{}\\\" > \\\"\\$$marker_path\\\" && printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers || exit 2; fi; done\" markers < /tmp/doc-inputs && cd /tmp/work",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-134",
    "failed_test": "[gap-ledger-134] add ignored name markers before the ratchet command"
  },
  {
    "id": "134-command",
    "file": "Makefile",
    "old": "if [ \"$$1\" != ratchet ]",
    "new": "if [ \"$$1\" = ratchet ]",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "gap-ledger-134",
    "failed_test": "[gap-ledger-134] add ignored name markers before the ratchet command"
  },
  {
    "id": "130-sort",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "[...new Set([...changed, ...protectedIgnored])].sort()",
    "new": "[...new Set([...changed, ...protectedIgnored])]",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "sort dirty names",
    "failed_test": "[gap-ledger-130 gap-ledger-132] sort dirty names and compare repeated history"
  },
  {
    "id": "078-inventory-source",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "codeInventory(listFilesAt(root, commit))",
    "new": "codeInventory(ignored.stdout.split('\\0'))",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "trust other ignored files",
    "failed_test": "[coverage-gate-078 coverage-gate-089] trust other ignored files"
  },
  {
    "id": "094-cache-marker",
    "file": "Makefile",
    "old": " \":(exclude,glob).gev-cache/**\"",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-094",
    "failed_test": "[coverage-gate-094] keep cache source contents after the container ends"
  },
  {
    "id": "094-cache-back",
    "file": "Makefile",
    "old": "cp -a /tmp/work/.gev-cache/spec/. /src/.gev-cache/spec/",
    "new": "cp -a /tmp/work/.gev-cache/. /src/.gev-cache/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-094",
    "failed_test": "[coverage-gate-094] keep cache source contents after the container ends"
  },
  {
    "id": "091-trace-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'openspec/trace/'",
    "new": "'openspec/trace'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-091",
    "failed_test": "[coverage-gate-091] refuse the input file at openspec/tracex/f.md"
  },
  {
    "id": "078-cache-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "'.gev-cache/'",
    "new": "'.gev-cache'",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "refuse the input file",
    "failed_test": "[coverage-gate-078] refuse the input file at .gev-cachex/ignored.test.mjs"
  },
  {
    "id": "080-commit-name",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "files: [], commit: line.commit };\n  const difference",
    "new": "files: [], commit: 'none' };\n  const difference",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-080",
    "failed_test": "[coverage-gate-080] refuse a commit that Git cannot find"
  },
  {
    "id": "095-test-class",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "isTestFile(file) || isCodeFile(file) ||",
    "new": "isCodeFile(file) ||",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-095",
    "failed_test": "[coverage-gate-095] refuse a new test file at openspec/changes/code.test.mjs"
  },
  {
    "id": "095-code-class",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "isTestFile(file) || isCodeFile(file) ||",
    "new": "isTestFile(file) ||",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-095",
    "failed_test": "[coverage-gate-095] refuse a new code file at openspec/changes/code.js"
  },
  {
    "id": "096-commit-hash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/^[a-fA-F0-9]{40}$/.test(line.commit)",
    "new": "true",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "commit ref in history",
    "failed_test": "[coverage-gate-096] refuse a commit ref in history"
  },
  {
    "id": "083-check-command",
    "file": "scripts/spec/gates.mjs",
    "old": "log(`Command: ${parsed.command}`);",
    "new": "log('Command: ratchet');",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "name the full check command",
    "failed_test": "[coverage-gate-083] name the full check command"
  },
  {
    "id": "011-precheck-status",
    "file": "Makefile",
    "old": "node scripts/format.mjs --check &&",
    "new": "node scripts/format.mjs --check ;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "126-history-after",
    "file": "scripts/spec/gates.mjs",
    "old": "historyText = readOptional(root, HISTORY_FILE);\n    baseline",
    "new": "historyText = historyText;\n    baseline",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "read the new totals history",
    "failed_test": "[gap-ledger-126] read the new totals history line for the base ledger"
  },
  {
    "id": "075-root",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/^Dockerfile$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at Dockerfileprod",
    "failed_test": "[coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod"
  },
  {
    "id": "075-nested",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/^Dockerfile[^/]*$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at containers/Dockerfile.gates",
    "failed_test": "[coverage-gate-075 coverage-gate-078] refuse the input file at containers/Dockerfile.gates"
  },
  {
    "id": "075-suffix",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/(^|\\/)Dockerfile$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at Dockerfileprod",
    "failed_test": "[coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod"
  },
  {
    "id": "076-root",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/",
    "new": "/^[^/]*compose[^/]*\\.ya?ml$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at containers/compose.gates.yaml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml"
  },
  {
    "id": "076-prefix",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/",
    "new": "/(^|\\/)compose[^/]*\\.ya?ml$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at docker-compose.yml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml"
  },
  {
    "id": "076-suffix",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/",
    "new": "/(^|\\/)[^/]*compose\\.ya?ml$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at containers/compose.gates.yaml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml"
  },
  {
    "id": "076-yaml",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "\\.ya?ml$",
    "new": "\\.yml$",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored file at compose.yaml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml"
  },
  {
    "id": "076-yml",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "\\.ya?ml$",
    "new": "\\.yaml$",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at docker-compose.yml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml"
  },
  {
    "id": "075-boundary",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/Dockerfile[^/]*$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored name MyDockerfile",
    "failed_test": "[coverage-gate-075] exclude the ignored name MyDockerfile"
  },
  {
    "id": "075-end",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/(^|\\/)Dockerfile[^/]*/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored name Dockerfile.dir/notes.txt",
    "failed_test": "[coverage-gate-075] exclude the ignored name Dockerfile.dir/notes.txt"
  },
  {
    "id": "075-no-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)Dockerfile[^/]*$/",
    "new": "/(^|\\/)Dockerfile.*$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored name Dockerfile.dir/notes.txt",
    "failed_test": "[coverage-gate-075] exclude the ignored name Dockerfile.dir/notes.txt"
  },
  {
    "id": "076-prefix-characters",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/",
    "new": "/(^|\\/)[^/-]*compose[^/]*\\.ya?ml$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "input file at docker-compose.yml",
    "failed_test": "[coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml"
  },
  {
    "id": "076-suffix-no-slash",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/(^|\\/)[^/]*compose[^/]*\\.ya?ml$/",
    "new": "/(^|\\/)[^/]*compose.*\\.ya?ml$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored name compose/other.yaml",
    "failed_test": "[coverage-gate-076] exclude the ignored name compose/other.yaml"
  },
  {
    "id": "076-dot",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "\\.ya?ml$",
    "new": "ya?ml$",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored name composeyml",
    "failed_test": "[coverage-gate-076] exclude the ignored name composeyml"
  },
  {
    "id": "076-end",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "\\.ya?ml$/",
    "new": "\\.ya?ml/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ignored name compose.yaml.extra",
    "failed_test": "[coverage-gate-076] exclude the ignored name compose.yaml.extra"
  },
  {
    "id": "096-start",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/^[a-fA-F0-9]{40}$/",
    "new": "/[a-fA-F0-9]{40}$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "commit hash with prefix",
    "failed_test": "[coverage-gate-096] refuse the commit hash with prefix"
  },
  {
    "id": "096-end",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/^[a-fA-F0-9]{40}$/",
    "new": "/^[a-fA-F0-9]{40}/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "commit hash with suffix",
    "failed_test": "[coverage-gate-096] refuse the commit hash with suffix"
  },
  {
    "id": "096-length",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/^[a-fA-F0-9]{40}$/",
    "new": "/^[a-fA-F0-9]+$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "commit hash with short",
    "failed_test": "[coverage-gate-096] refuse the commit hash with short"
  },
  {
    "id": "096-hex",
    "file": "scripts/spec/lib/measurement.mjs",
    "old": "/^[a-fA-F0-9]{40}$/",
    "new": "/^[a-zA-Z0-9]{40}$/",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "commit hash with letters",
    "failed_test": "[coverage-gate-096] refuse the commit hash with letters"
  },
  {
    "id": "033-input-correction",
    "file": ".claude/commands/opsx/review.md",
    "old": "If not, commit them and run the ratchet command again.",
    "new": "Continue.",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "change-review-033",
    "failed_test": "[change-review-033] keep the final measurement"
  },
  {
    "id": "094-marker-cleanup",
    "file": "Makefile",
    "old": "cd /tmp/work && xargs -0 -r rm -f -- < /tmp/doc-markers",
    "new": ":",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "keep cache source contents",
    "failed_test": "[coverage-gate-094] keep cache source contents after the container ends"
  },
  {
    "id": "094-marker-list",
    "file": "Makefile",
    "old": "&& printf \\\"%s\\\\0\\\" \\\"\\$$marker_file\\\" >> /tmp/doc-markers",
    "new": "",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "keep cache source contents",
    "failed_test": "[coverage-gate-094] keep cache source contents after the container ends"
  },
  {
    "id": "094-marker-no-list",
    "file": "Makefile",
    "old": "if [ ! -f /tmp/doc-markers ]",
    "new": "if [ -f /tmp/doc-markers ]",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "copy cache contents without a marker list",
    "failed_test": "[coverage-gate-094] copy cache contents without a marker list"
  },
  {
    "id": "097-copy-status",
    "file": "Makefile",
    "old": "; fi && rm -rf /src/.gev-cache/spec",
    "new": "; fi; rm -rf /src/.gev-cache/spec",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "coverage-gate-097",
    "failed_test": "[coverage-gate-097] stop before the container copies files after a marker error"
  },
  {
    "id": "011-precheck-import-status",
    "file": "Makefile",
    "old": "node scripts/check-import-directions.mjs &&",
    "new": "node scripts/check-import-directions.mjs ;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  },
  {
    "id": "011-precheck-boundary-status",
    "file": "Makefile",
    "old": "node scripts/check-package-boundaries.mjs &&",
    "new": "node scripts/check-package-boundaries.mjs ;",
    "test": [
      "src/tooling/spec/gates.test.mjs"
    ],
    "pattern": "ci-gates-011",
    "failed_test": "[ci-gates-011] add fast checks before review"
  }
]
```

New rows:

```text
094-cache-marker
094-cache-back
091-trace-slash
078-cache-slash
080-commit-name
095-test-class
095-code-class
096-commit-hash
083-check-command
011-precheck-status
126-history-after
075-root
075-nested
075-suffix
076-root
076-prefix
076-suffix
076-yaml
076-yml
075-boundary
075-end
075-no-slash
076-prefix-characters
076-suffix-no-slash
076-dot
076-end
096-start
096-end
096-length
096-hex
033-input-correction
094-marker-cleanup
094-marker-list
094-marker-no-list
097-copy-status
011-precheck-import-status
011-precheck-boundary-status
```

Rows with new code or test patterns:

```text
080-commit
081-words
069-tracked
069-base
078-inventory
033-step1
033-review-inputs
033-agent-inputs
088-names
088-file
088-content
088-exists
134-definition-order
```

The code terms, marker command, input file predicate and review sentences changed those rows.
The first complete pass had one compose-prefix row that made no test fail.
The replacement row changes the prefix character class and makes the Docker compose test fail.
The final complete file contains that replacement.

### C4: Trust probe

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && TMPDIR=/home/ianblenke/docker/gev-tools/gates-onem taskset -c 12-15 nice -n 19 node /home/ianblenke/docker/gev-tools/gates-onem/round1-probe-trust2.mjs
```

All 31 cases match their EXPECT label.
The extra case for another change also causes refusal.
The scratch probe uses this clone instead of the old copy.
The new cases cover code and test files under each allowed path.
A probe does not prove that a repository test fails.

```text
REFUSED  EXPECT REFUSED: new code openspec/changes/new.js — Input files, code files or test files differ from the ratchet commit ["openspec/changes/new.js"]
REFUSED  EXPECT REFUSED: new test openspec/changes/new.test.mjs — Input files, code files or test files differ from the ratchet commit ["openspec/changes/new.test.mjs"]
REFUSED  EXPECT REFUSED: new code openspec/specs/new.js — Input files, code files or test files differ from the ratchet commit ["openspec/specs/new.js"]
REFUSED  EXPECT REFUSED: new test openspec/specs/new.test.mjs — Input files, code files or test files differ from the ratchet commit ["openspec/specs/new.test.mjs"]
REFUSED  EXPECT REFUSED: new code openspec/trace/new.js — Input files, code files or test files differ from the ratchet commit ["openspec/trace/new.js"]
REFUSED  EXPECT REFUSED: new test openspec/trace/new.test.mjs — Input files, code files or test files differ from the ratchet commit ["openspec/trace/new.test.mjs"]
TRUSTED  EXPECT TRUSTED: clean tree
TRUSTED  EXPECT TRUSTED: edit archived change doc
TRUSTED  EXPECT TRUSTED: new untracked change doc
TRUSTED  EXPECT TRUSTED: edit spec
TRUSTED  EXPECT TRUSTED: edit trace json
TRUSTED  EXPECT TRUSTED: node_modules file
REFUSED  EXPECT REFUSED: docs/readme.md edit — Input files, code files or test files differ from the ratchet commit ["docs/readme.md"]
REFUSED  EXPECT REFUSED: AGENTS.md edit — Input files, code files or test files differ from the ratchet commit ["AGENTS.md"]
REFUSED  EXPECT REFUSED: .claude agent edit — Input files, code files or test files differ from the ratchet commit [".claude/agents/a.md"]
REFUSED  EXPECT REFUSED: openspec/config.yaml edit — Input files, code files or test files differ from the ratchet commit ["openspec/config.yaml"]
REFUSED  EXPECT REFUSED: openspec/changes-old/x.md (prefix needs slash) — Input files, code files or test files differ from the ratchet commit ["openspec/changes-old/x.md"]
REFUSED  EXPECT REFUSED: openspec/specs.md — Input files, code files or test files differ from the ratchet commit ["openspec/specs.md"]
REFUSED  EXPECT REFUSED: openspec/tracex/f.md — Input files, code files or test files differ from the ratchet commit ["openspec/tracex/f.md"]
REFUSED  EXPECT REFUSED: edit test file — Input files, code files or test files differ from the ratchet commit ["src/a.test.mjs"]
REFUSED  EXPECT REFUSED: edit code file — Input files, code files or test files differ from the ratchet commit ["src/a.js"]
REFUSED  EXPECT REFUSED: edit Makefile — Input files, code files or test files differ from the ratchet commit ["Makefile"]
REFUSED  EXPECT REFUSED: untracked json fixture — Input files, code files or test files differ from the ratchet commit ["src/fixtures/data.json"]
REFUSED  EXPECT REFUSED: untracked yaml workflow — Input files, code files or test files differ from the ratchet commit [".github/workflows/ci.yml"]
REFUSED  EXPECT REFUSED: new IGNORED test — Input files, code files or test files differ from the ratchet commit ["ignored.test.mjs"]
REFUSED  EXPECT REFUSED: rename allowed -> refused — Input files, code files or test files differ from the ratchet commit ["docs/s.md"]
REFUSED  EXPECT REFUSED: rename refused -> allowed — Input files, code files or test files differ from the ratchet commit ["docs/readme.md"]
REFUSED  EXPECT REFUSED: delete test — Input files, code files or test files differ from the ratchet commit ["src/a.test.mjs"]
REFUSED  EXPECT REFUSED: staged code edit — Input files, code files or test files differ from the ratchet commit ["src/a.js"]
REFUSED  EXPECT REFUSED: edit snapshot — The snapshot hash differs from history
REFUSED  EXPECT REFUSED: remove snapshot — The ratchet snapshot is absent
REFUSED  other change — The change has no ratchet history line
```

### C5: Format and prose

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
```

The plain format command gave EPERM. The host commands passed.

```text
Formatted 1158 source files.
Checked 1158 source files.
```

The final lint and predispatch commands are below.

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change gates-one-measurement 2>&1 | grep -E "^(ERROR|STE)"
cd /home/ianblenke/docker/gev-work/gates-onem && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/gates-one-measurement
```

The lint command gives zero errors.
Predispatch gives only abbreviation flags for technical names and literal code or log text.
The final lint output and predispatch output stay in the scratch folder.
Predispatch can flag Git names, shell variables, requirement words and literal log text as abbreviations.

## Scenario map

| Scenario | Repository tests |
|---|---|
| change-review-033 | [change-review-033] keep the final measurement |
| ci-gates-011 | [ci-gates-011] add fast checks before review |
| ci-gates-012 | [ci-gates-012] add a document gate target |
| coverage-gate-068 | [coverage-gate-068] trust a changed document |
| coverage-gate-068 | [coverage-gate-068] set the document option on the options object |
| coverage-gate-069 | [coverage-gate-069] refuse a changed inventory file |
| coverage-gate-069 | [coverage-gate-069] refuse a deleted input file |
| coverage-gate-069 | [coverage-gate-069] refuse a new tracked inventory file |
| coverage-gate-069 | [coverage-gate-069 coverage-gate-078] refuse an ignored file from the code inventory |
| coverage-gate-069 | [coverage-gate-069] refuse a deleted test file |
| coverage-gate-069 | [coverage-gate-069 coverage-gate-092] refuse a moved code file |
| coverage-gate-069 | [coverage-gate-069 coverage-gate-078] classify a protected ignored code file |
| coverage-gate-070 | [coverage-gate-070] refuse a changed test file |
| coverage-gate-070 | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs |
| coverage-gate-071 | [coverage-gate-071] refuse a changed QA script |
| coverage-gate-071 | [coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs |
| coverage-gate-072 | [coverage-gate-072] refuse a changed package lock |
| coverage-gate-072 | [coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json |
| coverage-gate-073 | [coverage-gate-073] refuse a changed Node version |
| coverage-gate-073 | [coverage-gate-073 coverage-gate-078] classify the ignored Node version |
| coverage-gate-074 | [coverage-gate-074] refuse a changed Makefile |
| coverage-gate-074 | [coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile |
| coverage-gate-075 | [coverage-gate-075] refuse a changed Dockerfile |
| coverage-gate-075 | [coverage-gate-075] refuse a changed Dockerfile at `containers/Dockerfile.gates` |
| coverage-gate-075 | [coverage-gate-075] refuse a changed Dockerfile at `Dockerfileprod` |
| coverage-gate-075 | [coverage-gate-075 coverage-gate-078] refuse an ignored file at Dockerfile |
| coverage-gate-075 | [coverage-gate-075 coverage-gate-078] refuse the input file at containers/Dockerfile.gates |
| coverage-gate-075 | [coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod |
| coverage-gate-075 | [coverage-gate-075] exclude the ignored name MyDockerfile |
| coverage-gate-075 | [coverage-gate-075] exclude the ignored name nested/MyDockerfile |
| coverage-gate-075 | [coverage-gate-075] exclude the ignored name Dockerfile.dir/notes.txt |
| coverage-gate-076 | [coverage-gate-076] refuse a changed compose file |
| coverage-gate-076 | [coverage-gate-076] refuse a changed compose file at `docker-compose.yml` |
| coverage-gate-076 | [coverage-gate-076] refuse a changed compose file at `containers/compose.gates.yaml` |
| coverage-gate-076 | [coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml |
| coverage-gate-076 | [coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml |
| coverage-gate-076 | [coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml |
| coverage-gate-076 | [coverage-gate-076] exclude the ignored name compose-dir/file.yaml |
| coverage-gate-076 | [coverage-gate-076] exclude the ignored name compose/other.yaml |
| coverage-gate-076 | [coverage-gate-076] exclude the ignored name composeyml |
| coverage-gate-076 | [coverage-gate-076] exclude the ignored name compose.yaml.extra |
| coverage-gate-077 | [coverage-gate-077] refuse a changed gate input file |
| coverage-gate-077 | [coverage-gate-077 coverage-gate-078] refuse an ignored file at scripts/spec/ignored.txt |
| coverage-gate-078 | [coverage-gate-078] refuse an untracked input file |
| coverage-gate-078 | [coverage-gate-078] refuse a protected ignored file |
| coverage-gate-078 | [coverage-gate-078] refuse an untracked code file |
| coverage-gate-078 | [coverage-gate-069 coverage-gate-078] refuse an ignored file from the code inventory |
| coverage-gate-078 | [coverage-gate-070 coverage-gate-078] refuse an ignored file at node_modules-old/ignored.test.mjs |
| coverage-gate-078 | [coverage-gate-071 coverage-gate-078] refuse an ignored file at scripts/qa-ignored.mjs |
| coverage-gate-078 | [coverage-gate-072 coverage-gate-078] refuse an ignored file at package-lock.json |
| coverage-gate-078 | [coverage-gate-074 coverage-gate-078] refuse an ignored file at Makefile |
| coverage-gate-078 | [coverage-gate-075 coverage-gate-078] refuse an ignored file at Dockerfile |
| coverage-gate-078 | [coverage-gate-076 coverage-gate-078] refuse an ignored file at compose.yaml |
| coverage-gate-078 | [coverage-gate-077 coverage-gate-078] refuse an ignored file at scripts/spec/ignored.txt |
| coverage-gate-078 | [coverage-gate-086 coverage-gate-078] refuse an ignored file at package.json |
| coverage-gate-078 | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| coverage-gate-078 | [coverage-gate-073 coverage-gate-078] classify the ignored Node version |
| coverage-gate-078 | [coverage-gate-078] refuse the input file at .gev-cachex/ignored.test.mjs |
| coverage-gate-078 | [coverage-gate-075 coverage-gate-078] refuse the input file at containers/Dockerfile.gates |
| coverage-gate-078 | [coverage-gate-075 coverage-gate-078] refuse the input file at Dockerfileprod |
| coverage-gate-078 | [coverage-gate-076 coverage-gate-078] refuse the input file at docker-compose.yml |
| coverage-gate-078 | [coverage-gate-076 coverage-gate-078] refuse the input file at containers/compose.gates.yaml |
| coverage-gate-078 | [coverage-gate-069 coverage-gate-078] classify a protected ignored code file |
| coverage-gate-079 | [coverage-gate-079] refuse without ratchet history |
| coverage-gate-079 | [coverage-gate-079] refuse history from another change or command |
| coverage-gate-079 | [coverage-gate-079] refuse without a change name |
| coverage-gate-080 | [coverage-gate-080] refuse a commit that Git cannot find |
| coverage-gate-081 | [coverage-gate-081] refuse a changed word list |
| coverage-gate-082 | [coverage-gate-082] refuse an absent snapshot |
| coverage-gate-083 | [coverage-gate-083] show command times |
| coverage-gate-083 | [ci-gates-005 coverage-gate-083] keep the CI verdict without command times |
| coverage-gate-083 | [coverage-gate-083] name the full check command |
| coverage-gate-084 | [coverage-gate-084] show slow phase times |
| coverage-gate-085 | [coverage-gate-085] keep every file check |
| coverage-gate-085 | [coverage-gate-085] check OpenSpec without tests |
| coverage-gate-085 | [coverage-gate-085] check coverage filters without tests |
| coverage-gate-085 | [coverage-gate-085] check archived specs without tests |
| coverage-gate-085 | [coverage-gate-085] report a change folder that is absent |
| coverage-gate-085 | [coverage-gate-085] compare the ledger with the base without tests |
| coverage-gate-085 | [coverage-gate-085] check the base registry without tests |
| coverage-gate-085 | [coverage-gate-085] check all review files without tests |
| coverage-gate-086 | [coverage-gate-086] refuse changed package metadata |
| coverage-gate-086 | [coverage-gate-086 coverage-gate-078] refuse an ignored file at package.json |
| coverage-gate-087 | [coverage-gate-087] refuse a failed Git comparison |
| coverage-gate-088 | [coverage-gate-088] refuse an omitted input file |
| coverage-gate-089 | [coverage-gate-089] trust a changed file at openspec/changes/archive/x/notes.md |
| coverage-gate-089 | [coverage-gate-089] trust a changed file at openspec/specs/x.md |
| coverage-gate-089 | [coverage-gate-089] trust a changed file at openspec/trace/gaps.json |
| coverage-gate-089 | [coverage-gate-078 coverage-gate-089] trust other ignored files |
| coverage-gate-090 | [coverage-gate-090 coverage-gate-091] refuse a changed file at AGENTS.md |
| coverage-gate-090 | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/commands/opsx/review.md |
| coverage-gate-090 | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/agents/x.md |
| coverage-gate-090 | [coverage-gate-090 coverage-gate-091] refuse a changed file at docs/x.md |
| coverage-gate-090 | [coverage-gate-090 coverage-gate-091] refuse a changed file at .github/workflows/x.yaml |
| coverage-gate-090 | [coverage-gate-090 coverage-gate-091] refuse a changed file at fixtures/x.json |
| coverage-gate-090 | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/config.yaml |
| coverage-gate-090 | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/other.yaml |
| coverage-gate-090 | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/changes-old/x.md |
| coverage-gate-090 | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/specs.md |
| coverage-gate-090 | [coverage-gate-090] refuse a staged file edit |
| coverage-gate-090 | [coverage-gate-090] refuse an untracked input file |
| coverage-gate-091 | [coverage-gate-090 coverage-gate-091] refuse a changed file at AGENTS.md |
| coverage-gate-091 | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/commands/opsx/review.md |
| coverage-gate-091 | [coverage-gate-090 coverage-gate-091] refuse a changed file at .claude/agents/x.md |
| coverage-gate-091 | [coverage-gate-090 coverage-gate-091] refuse a changed file at docs/x.md |
| coverage-gate-091 | [coverage-gate-090 coverage-gate-091] refuse a changed file at .github/workflows/x.yaml |
| coverage-gate-091 | [coverage-gate-090 coverage-gate-091] refuse a changed file at fixtures/x.json |
| coverage-gate-091 | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/config.yaml |
| coverage-gate-091 | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/other.yaml |
| coverage-gate-091 | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/changes-old/x.md |
| coverage-gate-091 | [coverage-gate-090 coverage-gate-091] refuse a changed file at openspec/specs.md |
| coverage-gate-091 | [coverage-gate-091] refuse the input file at openspec/tracex/f.md |
| coverage-gate-092 | [coverage-gate-092] refuse a moved file from openspec/changes/add-demo/design.md |
| coverage-gate-092 | [coverage-gate-092] refuse a moved file from docs/base.md |
| coverage-gate-092 | [coverage-gate-069 coverage-gate-092] refuse a moved code file |
| coverage-gate-093 | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their content returns to HEAD |
| coverage-gate-094 | [coverage-gate-094] keep cache source contents after the container ends |
| coverage-gate-094 | [coverage-gate-094] copy cache contents without a marker list |
| coverage-gate-097 | [coverage-gate-097] stop before the container copies files after a marker error |
| coverage-gate-095 | [coverage-gate-095] refuse a new code file at openspec/changes/code.js |
| coverage-gate-095 | [coverage-gate-095] refuse a tracked code file at openspec/changes/code.js |
| coverage-gate-095 | [coverage-gate-095] refuse a new test file at openspec/changes/code.test.mjs |
| coverage-gate-095 | [coverage-gate-095] refuse a tracked test file at openspec/changes/code.test.mjs |
| coverage-gate-095 | [coverage-gate-095] refuse a new code file at openspec/specs/code.js |
| coverage-gate-095 | [coverage-gate-095] refuse a tracked code file at openspec/specs/code.js |
| coverage-gate-095 | [coverage-gate-095] refuse a new test file at openspec/specs/code.test.mjs |
| coverage-gate-095 | [coverage-gate-095] refuse a tracked test file at openspec/specs/code.test.mjs |
| coverage-gate-095 | [coverage-gate-095] refuse a new code file at openspec/trace/code.js |
| coverage-gate-095 | [coverage-gate-095] refuse a tracked code file at openspec/trace/code.js |
| coverage-gate-095 | [coverage-gate-095] refuse a new test file at openspec/trace/code.test.mjs |
| coverage-gate-095 | [coverage-gate-095] refuse a tracked test file at openspec/trace/code.test.mjs |
| coverage-gate-096 | [coverage-gate-096] refuse a commit ref in history |
| coverage-gate-096 | [coverage-gate-096] refuse the commit hash with short |
| coverage-gate-096 | [coverage-gate-096] refuse the commit hash with suffix |
| coverage-gate-096 | [coverage-gate-096] refuse the commit hash with prefix |
| coverage-gate-096 | [coverage-gate-096] refuse the commit hash with letters |
| gap-ledger-123 | [gap-ledger-123] compare one ratchet measurement |
| gap-ledger-124 | [gap-ledger-124] fail for an absent review |
| gap-ledger-125 | [gap-ledger-125] pass after all comparisons |
| gap-ledger-126 | [gap-ledger-126] compare repaired ledger values |
| gap-ledger-126 | [gap-ledger-126] repair absent totals and stale test names |
| gap-ledger-126 | [gap-ledger-126] read the new totals history line for the base ledger |
| gap-ledger-127 | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| gap-ledger-128 | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| gap-ledger-129 | [gap-ledger-127 gap-ledger-128 gap-ledger-129] record a snapshot when no gap changes |
| gap-ledger-129 | [gap-ledger-129] record a different hash without a changed gap |
| gap-ledger-129 | [gap-ledger-129] record a different change without a changed gap |
| gap-ledger-130 | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their content returns to HEAD |
| gap-ledger-130 | [gap-ledger-130] refuse a failed ratchet file comparison |
| gap-ledger-130 | [gap-ledger-130 gap-ledger-132] sort dirty names and compare repeated history |
| gap-ledger-131 | [gap-ledger-131 gap-ledger-133] accept clean history without a dirty field |
| gap-ledger-132 | [coverage-gate-093 gap-ledger-130 gap-ledger-132] refuse dirty ratchet inputs after their content returns to HEAD |
| gap-ledger-132 | [gap-ledger-130 gap-ledger-132] sort dirty names and compare repeated history |
| gap-ledger-133 | [gap-ledger-131 gap-ledger-133] accept clean history without a dirty field |
| gap-ledger-133 | [gap-ledger-133] accept dirty history in each reader |
| gap-ledger-134 | [gap-ledger-134] add ignored name markers before the ratchet command |

## Review correction map

All rows apply to the commit in the last column.
The changes include every STE correction.

| Report | First words | Correction | Commit |
|---|---|---|---|
| Spec | Makefile:10 GATES_DOCS_MARKERS | Exclude cache files. Remove created markers before the container copies files back. Test cache and trace contents. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | gates.test.mjs:2216 Operand mutations | Test every prefix boundary and ignored Docker and compose operand. Add negative name cases. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | gates.test.mjs:1825 Scenario 080 | Assert the ratchet commit line with forty literal zero digits. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | measurement.mjs:62 The prefix test | Refuse code and tests under each allowed path before the prefix test. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | measurement.mjs:40 resolveCommit | Use forty hexadecimal digits. State the ancestry decision and who reads the snapshot hash. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | gates.mjs:700 Command: check | Assert the full check header. State other command times and the exception limit. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | Makefile:44 In precheck | Assert the exact command text with all conjunctions. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | coverage-gate/spec.md:12 class list | Define protected ignored files once. Use input files for files outside the allowed paths. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | measurement.mjs:57 git diff | State the Git index flag limit in the proposal. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| Spec | gates.mjs:643 history | Test the new totals history line against a base ledger. Add the snapshot copy result to the scenario. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | gap-ledger/spec.md:34,43 same snapshot | Add the dirty list to both descriptions of unchanged history. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | gates.mjs:698 output | Use NO TEST RUN and snapshot in the log and tests. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | gates.mjs:718 commit line | Use Ratchet commit in refusals and their tests. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | AGENTS.md:62 document steps | Name the three allowed paths. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | AGENTS.md:60 input files | Use the requested commit instruction and input file term. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | review.md:14,16 ratchet sequence | Start after the ratchet. Test the new sentences and the second ratchet instruction. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | gap-ledger/spec.md:7 status | State status 1 for errors before the ratchet writes files. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | design.md:17 conditional tense | Use simple present tense and verb clauses for file actions. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | coverage-gate/spec.md:137-144 container names | Use container for the Docker process. Use file checks and steps. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | AGENTS.md:45,46,22,76-78 | Remove now and the semicolon. Add a heading after the backfill steps. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | gap-ledger/spec.md:55 design.md:31 decision | Use the requested decision, clock, error line, empty list and trace copy terms. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | evidence.md:4,574,580-582 tree | Name the current commit and active path. Correct the Makefile comment. | c87e7eb88b263791c21277a604ec23c745aafd0e |
| STE | evidence.md:115,117,124 test corrections | Use direct test-failure terms. Correct the source comments. | c87e7eb88b263791c21277a604ec23c745aafd0e |

## Final tree

```sh
cd /home/ianblenke/docker/gev-work/gates-onem && git status --short
```

```text
M .claude/commands/opsx/review.md
 M AGENTS.md
 M Makefile
 M docs/roadmap/mcp-agent-backends.md
 M openspec/changes/gates-one-measurement/design.md
 M openspec/changes/gates-one-measurement/evidence.md
 M openspec/changes/gates-one-measurement/mutations.json
 M openspec/changes/gates-one-measurement/proposal.md
 M openspec/changes/gates-one-measurement/specs/change-review/spec.md
 M openspec/changes/gates-one-measurement/specs/ci-gates/spec.md
 M openspec/changes/gates-one-measurement/specs/coverage-gate/spec.md
 M openspec/changes/gates-one-measurement/specs/gap-ledger/spec.md
 M openspec/changes/gates-one-measurement/tasks.md
 M scripts/spec/gates.mjs
 M scripts/spec/lib/measurement.mjs
 M src/tooling/spec/ciFiles.test.mjs
 M src/tooling/spec/gates.test.mjs
```

The pinned container gates, CI, archive and two-agent review are not host checks.
The lead completes those tasks. The final task boxes stay unchecked.
