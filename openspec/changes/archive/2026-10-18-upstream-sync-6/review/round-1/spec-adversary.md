Verdict: FAIL

I reviewed tree d35a3015 in the clone /home/ianblenke/docker/gev-work/upstream-sync-6. Change documents are named relative to openspec/changes/archive/2026-10-18-upstream-sync-6/. I could not run git, so I could not read the upstream src/search/google.js. Finding 1 relies on D2's statement that the merge does not change that file.

- [ ] FINDING major docs/CURRENT-STATE.md:4800 @d35a3015 This text is false in the merged tree. It says a keyless route answer "reads as an unanswered provider", so the search does not cache the Photon or Nominatim miss. Two upstream files make the same promise: server/providers/places/google-key.js:17-21 and src/search/defaults.js:49-52. The kept fork line src/search/google.js:50 returns answered:true, so src/search/placeSearch.js:55-58 caches the miss for 30 s. credential-boundary-020 locks in the fork value. Neither D2 nor the Known limits mention this. The owner must choose: remove the fork line and write 020 again, or add a Known limit and correct this text.
- [ ] FINDING major SECURITY.md:86 @d35a3015 The resolution kept the old CSP bullet after the new one at line 83. Line 86 says "no other script origin", but lines 83 and 85 put maps.googleapis.com in script-src. Remove line 86.
- [ ] FINDING major design.md:112 @d35a3015 The counts are false for the base commit named at line 3. At 1d6b70fc, constructCatalog.test.mjs:43 asserts 34 catalog layers, not 30. The token ledger has 33 rows, not the 29 that line 113 gives. Name the shared ancestor 591f299d, or count from 1d6b70fc.
- [ ] FINDING major tasks.md:12 @d35a3015 Task 1.10 has two instructions ("Mark ... and add ..."). Split it into two tasks.
- [ ] FINDING major openspec/specs/cyclones/spec.md:270 @d35a3015 The line "the issue time reads `MM-DD HH:mm UTC`" now has two meanings. The edited test at src/layers/cyclones/index.test.mjs:1247 asserts a word joiner (U+2060) after the hyphen and a no-break space (U+00A0) before HH and before UTC. Rule 25 says to write the scenario again or retire it, but proposal.md:54 keeps the text.
- [ ] FINDING major src/data/layerStateTokenLedger.test.mjs:47 @d35a3015 This comment is false after the merge. The merge removed rowsNoReticulum, and every call now passes all ledger rows, so no test builds a fixture without the layers that hold digits 4 and 5. The `omittable` block at lines 108-121 is now dead code. Delete the comment and the block.
- [ ] FINDING minor openspec/specs/credential-boundary/spec.md:60 @d35a3015 No scenario covers the reverse half of the MUST (`/api/google/reverse-geocode` with no key). A key added at src/search/http.js:97 makes no fork test fail.
- [ ] FINDING minor design.md:5 @d35a3015 The only recorded ls-remote, at evidence/upstream-check.txt:2, returned 93ea088f, not 73aec2e6. Record the run that returned 73aec2e6, or state the ancestor check instead.
- [ ] FINDING minor tasks.md:39 @d35a3015 Tasks 3.4 and 3.5 are done but not checked: ratchet-3 ran at 09257a66, and retired-ids.json has the 11 IDs.
- [ ] FINDING minor proposal.md:54 @d35a3015 "17 other scenarios" leaves out osh-control-031. The change edits its test for D10 and keeps its text. evidence/scenario-tests.txt ran at 879b28cb, before the D10 commit 1bb128d8.
- [ ] FINDING minor src/app/controls.js:5 @d35a3015 The resolution leaves an unused import of `t`.

These checks found nothing:
- **Tokens:** 9, 00 and 01 are the true next free tokens.
- **D10:** the gap is the one in the base ledger (1 branch since 2026-10-03). The extended test at src/data/oshLayer.test.mjs:4084-4089 fails under the fault, and the scenario covers the case with no change.
- **Deltas:** they match the base spec. 019 has the text of 015. retired-ids.json has the 11 IDs. qa-scripts-023 changes only the count.
- **020 tests:** they are the old 013 tests with a browser key added.
