Verdict: PASS
Commit read: e41a311f239d2c3d658fa5ae7a11f34159dab016 (clone upstream-sync-5, scope diff 0fb0248b, plus the two round 1 majors). I ran no code. No critical and no major finding. Paths are under openspec/changes/archive/2026-10-10-upstream-sync-5/.

Round 1 majors, both fixed and true:
- design.md:36 "as sync 2 had none": the archive of sync 2 has no specs/ folder.
- evidence.md:27-29 now matches workflow-result.txt: one finding rated blocker (rendering.test.mjs:412, thumbnails.test.mjs:678). The skeptic verdict is "partly": fact true, severity overstated. The other three areas have no blocker and no major. The adopt records show untraced 1 for both files.

Other corrections checked and true:
- 28 = 5923 - 5895 (ratchet outputs); total tests 9632 - 9604 = 28.
- 18 = 1+7+3+2+5 (adopt lines; host-run.txt tests 1, 7, 3, 2, 5).
- The five PRs in upstream-check.txt; 591f299d is #986, the head.
- The old-sync5-merge branch exists (.git/refs/heads).
- Tasks 1.4 and 2.3 are true (merge 1ac580d5 comes before the pin c394af4a; two files are under server/).
- No banned word. The evidence.md and workflow.md paragraphs have 6 or fewer sentences.

- [ ] FINDING minor proposal.md:33 ", The two files have fork tests..." is a comma splice that hides a 7th sentence from the lint (the lint ends a sentence only at a token with a final period). Write ". The two files have fork tests with scenario IDs." and put a blank line before "The change opens no new coverage gap for owned code." Checked: the first paragraph then has 5 sentences and the second has 2.
- [ ] FINDING minor proposal.md Known limit `share-options`: it omits that CURRENT-STATE.md:3142-3144 still says to add a provider's boolean option to the `street-level` group in `src/data/layerState.js`. Add: "The section on adding a provider (lines 3142-3144) still says to add a boolean option to the `street-level` group in `src/data/layerState.js`." (21 words)
- [ ] FINDING minor proposal.md Known limits: add `link-size`: "Provider registration caps the switch field at 256 characters (registry.js:130-142). The link decoder rejects a whole `lo` field over 512 characters (layerState.js:990), so a link with many custom providers can fail to decode." The fork has no custom provider now.
- [ ] FINDING minor proposal.md `catalog-count`: constructCatalog.test.mjs:43 also holds 31 (an older fork edit that is not in the pin commit), so three lines hold the pin. Write: "...in these lines and in `src/app/constructCatalog.test.mjs` line 43."
- [ ] FINDING minor evidence/workflow.md:26-27: 18 + 2 = 20 of the 28. Name the other 8: new tests in files that already had untraced tests (the analyst says about 9). Give the command that counts them.
- [ ] FINDING minor evidence/workflow-result.txt:242 calls 0b51002b "the MERGED commit", which is wrong: it is the merge commit of the old branch, and the merged commit is 591f299d. Line 183 also gives 9326 tests in 591 files, against 9585 - 241 = 9344 in host-run.txt. Add a header line that the file is a verbatim record of tree 5bfdffed and name both points.
- [ ] FINDING minor review.md (later): the analyst (workflow-result.txt:219) says Resolved files should list 8 files, because the pin commit edited constructCatalog.test.mjs and sourceComposition.test.mjs by hand. Write under `Resolved files:` the 6 conflicts and state the 2 edited tests.

Could not check: running code; the empty output of `git diff --stat 5bfdffed c394af4a` (no git); the 8 other untraced tests; the analyst runs.
