Verdict: PASS

I could not run code or git. The adopt count of 159, the gate output and the commit hashes come from your message, not from my own check. I read `proposal.md`, `design.md`, `tasks.md`, `round3.diff` and the headers and asserts of the three reworded QA scripts.

(a) The three reworded purposes are true to their scripts.
- `scripts/qa-admin-outlines.mjs`: the script asserts `stableWhileStill` (lines 354-376). It also says the mark must not rebuild or grow while the camera is still (lines 22-23).
- `scripts/qa-alpr-journey.mjs`: the script checks marker stability and flicker while still (lines 24, 342, 573). It also checks time to appear.
- `scripts/qa-military-names.mjs`: the script asserts a frame rate of at least 55 at continent scale (line 216). It also asserts that names show in view (lines 187-192).

(b) The three documents agree on these numbers.
- 12 of 13 headers
- 159 = 152 + 7
- 83 scripts
- 29 rows
- 6 mutations
- four flaky files
- mutations 2.1 to 2.6

No text says "gates passed". Task 3.2 now records the later ratchet stops.

(c) The known limits are true. Two details are not complete (F1 and F2).

(d) The rule-21 chain is consistent. The proposal names merge commit `b8ff1c4`, parents `253a07d` and `e7707d9`, and `ls-remote` returning `e7707d9`. `design.md` D1 names the same parents.

- [ ] FINDING minor proposal.md:43 `sync2-count-flips` does not say that this tree still ends with `LEDGER-STALE` on 3 entries (first `src/cameraGroundGuard.js`) in `make gates`. The owner must accept these entries by name in `review.md`. Add one sentence, or say that task 3.5 records the acceptance.
- [ ] FINDING minor proposal.md:48 "The gates of the push to `main` use the tolerance" is a prediction that this change did not test. It is also unclear that the tolerance covers `src/app/layers/alprCameras.js` (3 or 0 lines) and `src/annotations/resolver.js` (342 or 359 lines). Say that CI on `main` must confirm it after the merge.
- [ ] FINDING minor design.md:13 D1 does not name the merge commit `b8ff1c4` or the `ls-remote` result. Only the proposal has them. Task 3.5 must copy both into `review.md`.
