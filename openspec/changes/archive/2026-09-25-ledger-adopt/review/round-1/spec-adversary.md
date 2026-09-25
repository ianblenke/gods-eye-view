Verdict: FAIL

I read the whole change at 1adadad9 (branch `ledger-adopt`) with Read, Grep and Glob only. I ran no code.

- [ ] F1 (major) /home/ianblenke/docker/gev-adopt/src/tooling/spec/gates.test.mjs:1078-1130 and :1132-1155. Two AND results of the new scenarios have no assertion.
  - `gap-ledger-089`: "the command does not change the registry or the links". Nothing in the adopt tests reads `openspec/trace/ids.json` or `openspec/trace/links.json` before or after `adopt`. The other reads of those files, at lines 169-170 and 258-294, belong to older tests. A mutation that calls `writeRegistry` or `writeLinks` inside the `command === 'adopt'` branch of `/home/ianblenke/docker/gev-adopt/scripts/spec/gates.mjs:473` passes all tests. The later `ratchet` and `check` write the same values.
  - `gap-ledger-090`: "the command does not change `openspec/trace/gaps.json`". The test deletes the ledger at line 1150 and rewrites it at line 1152. No line compares the file after the six earlier faults. Only the history file is compared. A mutation that writes the ledger in a fault path survives.
  - Fix: in the 089 test, compare `ids.json` and `links.json` (text, or absence) before and after the passing `adopt`. In the 090 test, compare `gaps.json` with `ledgerText` after the six faults, and assert the file is still missing after the last fault. Name both mutations in `review.md`.

- [ ] F2 (minor) /home/ianblenke/docker/gev-adopt/openspec/changes/archive/2026-09-25-ledger-adopt/proposal.md:42. This is the way to hide the project's own gap with an adopt line. It is not in the Known limits, and `design.md` points to a text that does not say it.
  - `design.md:40` says the limit `adopt-by-hand` names that "a person can make a merge commit of their own and adopt from it". The proposal text of `adopt-by-hand` names only a hand-written line and says "the gate checks the commit". A reader concludes that the commit check makes a hand-written line safe.
  - It is not safe. `git checkout -b tmp; <own code with gaps>; git checkout work; git merge --no-ff tmp` (or `-s ours`) followed by `make adopt FROM=tmp` gives valid lines for every file that `tmp` changed. `mergeParents` and `changedByCommit` in `/home/ianblenke/docker/gev-adopt/scripts/spec/lib/git.mjs:49-59` cannot tell an upstream merge from a local one.
  - The command also works in any change, not only `upstream-sync`, and `AGENTS.md` does not mention `adopt`.
  - Fix: name this limit in the proposal section. Add one rule to `AGENTS.md`: an agent uses `adopt` only for merged upstream code, never for code of this project. Say that the reviewer of `upstream-sync` must check the merged commit against the upstream remote.

- [ ] F3 (minor) /home/ianblenke/docker/gev-adopt/openspec/changes/archive/2026-09-25-ledger-adopt/proposal.md:46 and design.md:46,52-54. Two statements about the ceiling are wrong or too weak.
  - `adopt-later-edit` says that after a lower entry "the adopted count has no more effect". The ceiling comes from the adopt lines in `adoptedFor` (`/home/ianblenke/docker/gev-adopt/scripts/spec/lib/ledger.mjs:491`), not from the entry, so it stays. The sequence is: lower the entry with `ratchet`, add own uncovered code up to the old count, then raise the entry by hand. `compareLedger` accepts it because the entry equals the current gap, and `compareWithBase` accepts it up to the ceiling.
  - For untraced tests the adopt line holds the file total (`ledger.mjs:682`), but `compareWithBase` compares the rise above the base (`ledger.mjs:551-552`). The slack equals the number of untraced tests that the base entry already has. `adopt-count-not-per-name` does not name it. In the unit test at `ledger.test.mjs:989`, `old.test.mjs` has a total of 3 and a rise of 2.
  - Fix: correct the `adopt-later-edit` text and name the slack. Alternatively, record the rise in the line.

- [ ] F4 (minor) delta spec `/home/ianblenke/docker/gev-adopt/openspec/changes/archive/2026-09-25-ledger-adopt/specs/gap-ledger/spec.md:119-126` and `:160-164`. Scenarios `gap-ledger-092` and `gap-ledger-098` disagree with the code and with the tests.
  - 092 says the gate does not stop for a new entry when the counts are within the adopted count. It has no condition for untrue coverage. The code (`adoptedCovers`, `ledger.mjs:337`) and the 098 test at `ledger.test.mjs:1151` stop for a new untrue entry without the mark.
  - 098 says a valid line with the mark allows untrue coverage. The 098 test asserts that `sameAsBase: () => true` still stops it (`adoptedFor` returns nothing for a base-content file). Neither the 098 text nor the requirement text ("the largest count in its valid adopt lines, and 0 with no such line") says this.
  - Fix: add the missing conditions to 092 and 098 (untrue coverage, and "content not equal to the base"). Delta scenarios of a new requirement can change.

- [ ] F5 (minor) /home/ianblenke/docker/gev-adopt/scripts/spec/lib/ledger.mjs:681. One mutation survives. Replace `names: Object.fromEntries(names)` with `{ ...entry.names, ...Object.fromEntries(names) }`.
  - It keeps the closed names of an eligible test file, so the entry is larger than the measurement. No test has a name in the old entry that the measurement lacks.
  - The unit test at `ledger.test.mjs:989` and the gates test at `gates.test.mjs:1112` both add names only.
  - Scenario 089 says "with the measured counts". Fix: add a closed name to `src/old.test.mjs` in the unit test and assert that the entry drops it.

- [ ] F6 (minor) /home/ianblenke/docker/gev-adopt/src/tooling/spec/ledger.test.mjs:1130-1134. The test tagged `gap-ledger-093` asserts the order of the `sameAsBase` calls (`['src/plain.js', 'src/orbit.js', 'src/orbit.js']`). No scenario states that the gate reads a file only when the file has an adopt line. The check is tied to the code order in `adoptedFor` and the `ceiling` line. Fix: either add a scenario for it or remove the check.

- [ ] F7 (minor) `ledger.mjs:495`, `ledger.test.mjs:368-370` and `:581-586`. Scenarios 022 and 040 say the message shows the waived count and the adopted count.
  - `adoptedNote` shows the adopted count only when it is above 0, and the waived count only when it is above 0. No test has both above 0 in one message. The format `... A waiver allows N more. The adopted count is M.` is untested.
  - Fix: add a test with both counts, or say "when the count is above 0" in the THEN line.

- [ ] F8 (minor) `openspec/trace/history.jsonl` lines 623-624 and `gaps.json:2659`. `src/data/labelArbiter.js` goes from 52 to 50 branches, labelled `smaller` under `ledger-adopt`.
  - This change does not change that file or any file that it uses.
  - The history shows the same 50/52 flip in about 20 earlier changes, and the second history line records it as `unstable`. The gate allows it (`gap-ledger-088`).
  - The proposal Impact says the change closes no gap. Fix: name the flip in the Known limits or the Impact, or accept it by name.

**Checked and found correct**

- **Claims 1 to 3 hold in code:**
  - `adoptLedger`, the `eligible` rule (`merged.has(file) && !sameAsBase(file)`) and the eligibility rule.
  - `checkAdopts` and `mergeParents`: a non-first parent of a merge commit in `base..HEAD`.
  - `changedByCommit`: the diff from the merge base of the base and the commit.
- **Not exploitable:** a hand-written line with a wrong commit or a wrong file. Both give the errors `LEDGER-ADOPT-FROM` or `LEDGER-ADOPT-FILE` and no adopted count.
- **The CI merge ref is safe.** `actions/checkout` on a `pull_request` makes the PR tip a merged commit. A line that names it would need its own hash, so it cannot be written.
- **Claim 5, no existing gate weakened:**
  - `waiversOf` after the `historyLinesOf` refactor gives the same result.
  - The untraced loop gives the same result for a file that has no adopted count, except an entry with a name at count 0 and no base entry. That entry can no longer produce an error, and it cannot hide a gap.
  - `compareLedger` and the ratchet are unchanged.
  - The ceiling never applies to a base-content file.
- **Carried scenarios:** `gap-ledger-048, 041, 056, 023, 024, 025, 026, 046, 030, 088` and the requirement first line are word for word the same as the text of the latest earlier modifier, `2026-09-23-ledger-waiver`. The diffstat of the live spec fits exactly: +91 and -2 lines, which are the four modified scenarios plus the new requirement.
- **Tests for the modified scenarios:**
  - `021, 022, 032, 040` each got a real changed test that asserts the adopted rule.
  - The registry hashes of these four changed, and there are no `TRACE-*` errors.
- **Tests for the new scenarios `089` to `099`:** each has a test that makes the WHEN and asserts the THEN and AND lines, except the two gaps in F1. I did mutation checks on paper for `adoptsOf`, `checkAdopts`, `adoptedCounts`, `adoptedCovers`, the ceiling rules, `mergeParents`, `resolveCommit` and `changedByCommit`. Only F5 survived.
- **Gate output and trace:**
  - `adopt-gates-1.out` has one error, `REVIEW-MISSING`. It has 301 STE warnings, all in older files.
  - The `Ledger: 0 entries do not match` line means `ledger.mjs` and `git.mjs` are complete.
  - `links.json` fits exactly: 41 new lines.
- **Ledger:** the four new history lines name `ledger-adopt`. The `gates.mjs` entry keeps 0/1/0.
- **Task order:** test tasks come before code tasks for every scenario.
- **Renamed tests:** none.

**Could not check**

- **Code run:** I could not run code. That covers the 100% coverage of `ledger.mjs` and `git.mjs` (only the gates-1 line supports it), the author's 79 mutations, and whether the one uncovered branch in `gates.mjs` is still the old phantom branch.
- **`adopt-gates-2.out`:** it holds only the command line so far, so I could not read the run after the archive.
- **`origin/main`:** I could not read it. I compared the carried scenarios with the `ledger-waiver` delta and with the diffstat.
