Verdict: PASS

Commit 54b11de85044635cf3cd5275bf7b9dbf1a40eaeb, clone `/home/ianblenke/docker/gev-work/gates-coverage-race`, scope `diff a885562`. I found no critical and no major finding, and five minors. Paths are relative to the clone root. D = `openspec/changes/archive/2026-10-06-gates-coverage-race`.

- [ ] FINDING minor D/design.md:155 The camera rebaseline line (`history.jsonl`:1892) records total 54 to 53. Line 2009 records 53 to 54, so the net change against main is none. The text says only "increases from 53 to 54", then says "these total changes explain" the set. That is false for the camera. State both steps.
- [ ] FINDING minor D/proposal.md:51 and D/design.md:201 "About one GB" after a kill disagrees with the 2112810378-byte peak in the same documents. Node copies at the end of the run, so a kill during the copy leaves the `node-coverage-*` folder and the raw folder. Write "up to about two GB" and name both folders.
- [ ] FINDING minor src/tooling/spec/gates.test.mjs:1501 Spec 066, `proposal.md`:25 and `design.md`:88 claim removal after "every error inside the measurement". Only the merge error (`{` JSON) is tested. A `try` that starts after `executeRuns` still passes. Add a mode where the fake spawn throws, or limit the text to merge errors.
- [ ] FINDING minor src/tooling/spec/gates.test.mjs:1510 Spec 066 says "random". The test proves only "different, non-empty". A counter or pid name passes, and row 066-random-name only fixes the name. Write "unique" in the scenario, or accept the limit.
- [ ] FINDING minor src/tooling/spec/ledger.test.mjs:1467 Spec 122 says "the history of the change", but the test history has one line. The new `baseLedger.coverage` equals `{}` check cannot fail, because the ledger starts empty and `invalid()` returns before any write. No mutation row depends on it. Add a second valid line, assert it gets no allowance, and add a row that makes `invalid()` return `next`. The effect today is nil, because the error stops the build.

Checked and sound:
- **Round-2 minors:**
  - Raw folder reachable: named in proposal and design.
  - Random name: the test asserts 6 distinct names, and row 066-random-name is KILLED (`lead5-mut.out`:208).
  - After kill: named.
  - No lcov, no raw: the new mode exists, and row 067-no-lcov-no-raw is KILLED (209).
  - Camera: the sentence is fixed (see the first minor).
  - Spec 122: reworded, and `invalid()` (`ledger.mjs`:756) does reject the whole history.
- **rebaseline-flip-risk:** the three files are exactly the base-less files where `toleranceOf` allows a flip from 1 to 0 (151 gives 6, 287 gives 8, 36 gives 1). Each of the other six base-less files has a metric above its tolerance. `gaps.json` agrees with 151/287/36 and one uncovered branch.
- **Numbers:** `history.jsonl` has 153 rebaseline lines (43 lines, 110 branches). Nine files lack a base entry. The line rises sum to 552. `muts.json` has 209 rows, and the run output has 209 KILLED and no survivor, under the renamed tests. `links.json` holds all five renamed test names. The applied specs match the delta specs.

Not read or run: I had no Bash or git, so I ran no code and no mutation. I did not read the STE warnings, `ids.json` hashes, the post-archive gates output or `gates.test.mjs` outside the diff. I did not check the 109-file count, only that 111 files minus camera and keylessGeocoder gives 109.
