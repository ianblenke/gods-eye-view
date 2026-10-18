Verdict: PASS

STE adversary, round 3 of 3 (scope: diff 3deef1e9), upstream-sync-6. Clone: /home/ianblenke/docker/gev-work/upstream-sync-6 at commit 9b635bd2. Short paths start in openspec/changes/archive/2026-10-18-upstream-sync-6/.

**Round-2 findings:** all 5 are closed.
- The text "in one point" is gone from spec.md:10 and proposal.md:55. Each difference that they now name agrees with credential-boundary-013 in the 2026-09-26 archive and with src/search/placeSearch.js:41,55.
- proposal.md:41 now says "outside `openspec/`".
- The test name at cards.test.mjs:23 now uses the words of perimeters-005.
- The test name at placeSearch.test.mjs:65 now says "Google route".
- spec.md:8 now says "the reverse lookup".

**Checks with no finding:**
- Each sentence in proposal.md:57 agrees with placeSearch.test.mjs, which has six tests with the ID.
- The new comments at placeSearch.test.mjs:77-80 and :100-101 agree with server/providers/places/google.js:398-462 and src/search/google.js:45-59.
- Lines 33-34 of credential-boundary-020 are the same in the delta and in the main spec. They are true under each meaning of "the miss".
- The two new test names have no banned word.

- [ ] FINDING minor design.md:96, evidence/silent-files.txt:1,3 (9b635bd2) "four files are of that kind" claims more than the command shows. The coverage-gate spec (line 7) says that a code file can also have the extension .html, .sh, .cjs or .ts. The command reads only .js and .mjs files under src/, server/ and scripts/. Also, "grep -v test" removes code files: the nine src/layers/*/testing.js files and scripts/run-unit-tests.mjs. I could not run git, so I could not look for a fifth file. Write in design.md:96: "Outside the QA scripts, four `.js` and `.mjs` files under `src/`, `server/` and `scripts/` are of that kind." In silent-files.txt:1, "are left out" is passive and a phrasal verb. Write: "the list does not include the QA scripts and the files with test in their path".
- [ ] FINDING minor src/search/placeSearch.test.mjs:77 (9b635bd2) In "when the upstream fetch fails", "upstream" means Google. Line 8 and the change documents use "upstream" for the upstream project ("the upstream route"). This is one word with two meanings (check 2). Write: "when the request to Google fails". The route also gives 502 when it cannot read the body from Google (google.js:434-444). "fails" covers both cases.
- [ ] FINDING minor proposal.md:57, src/search/placeSearch.test.mjs:79, tasks.md:36-37, evidence/fault-020.txt:88,91,92, evidence/scenario-tests.txt:37 (9b635bd2) One test has three names (check 2): "the status test", "The test of the HTTP status" and "the test of the status". Write "the status test" in proposal.md:57 and placeSearch.test.mjs:79.
- [ ] FINDING minor evidence/scenario-tests.txt:37 (9b635bd2) "The tests use the error bodies of the upstream route." can mean each test of credential-boundary-020. Only the test of the Photon place uses these bodies: placeSearch.test.mjs:117 uses the default body, and the status test gives its own body at :104. proposal.md:57 states this correctly. Write: "The test of the Photon place uses the error bodies of the upstream route."
- [ ] FINDING minor evidence/fault-020.txt:88 (9b635bd2) In "two faults run the body fault against each status alone", a fault is the subject of "run". A fault cannot run (check 1). Write: "two more faults add the body fault and cut the status test to one status."

I did not report "the same three plugins" at design.md:96, because this report has a limit of five minor findings. "same" there has no earlier referent. I checked the content of that sentence against server/standalone/vite.config.js:13-28, and it is true.
