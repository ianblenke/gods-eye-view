# Review: backfill-ghostmaps

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-02
Gates: make gates CHANGE=backfill-ghostmaps passed
Rounds: 3
Scope: diff f280ffa7
Reviewed-Tree: 86cb218d6903b0d927caa2938bb00387e096abf7129c50cf73fc9668df3dbb53

Resolved files: none

## Findings

Rounds 1 to 3 gave FAIL from the spec adversary. Round 1 had the scope full, at the commit 03be515c. Rounds 2 and 3 had the scope diff, at the commits 9714441e and f280ffa7. A narrow confirmation at the commit f72758de gave PASS from both reviewers. The lead reproduced each critical finding as a surviving mutation before the correction. The reports of each round are in `review/round-<n>/`. The files in `review/` are the reports of the confirmation, where both agents gave the verdict PASS. After the confirmation, the lead fixed the one minor wording finding (one word in `evidence.md`). This edit changes prose only.

One ratchet run came after round 3. It gave only `REVIEW-MISSING`. The final `make gates` result is in the line `Gates` above.

### Round 1 (commit 03be515c)

- [x] FINDING critical (spec adversary) Eleven tests accepted code that ignored a product id, a coordinate, a timer cancel, a products array, a ready state, a second image URL, a later field value, a shared style, a saved product, a commit field or an unsupported request. Fixed: each test now fails under its mutation.
- [x] FINDING major (spec adversary) No scenario stated the phone-width and horizon behavior of `scripts/qa-ghostmaps.mjs`. Fixed.
- [x] FINDING major (STE adversary) The evidence text about the changed files disagreed with the gate log. Fixed.
- [x] FINDING major (STE adversary) Tasks 1.2 to 1.36 gave two instructions each. Fixed.
- [x] FINDING minor (spec adversary) The supplied gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING minor (STE adversary) Generated test titles omitted articles. Fixed.

### Round 2 (commit 9714441e)

- [x] FINDING critical (spec adversary) Seven tests had the same weak shapes in new places (`/events` route, inactive chip, `card.activate` absence, empty truncated tree, default product only, ignored file id, credentials on one of two requests). Fixed with a sweep of all tests.
- [x] FINDING major (STE adversary) The text "trace files keep their bytes" disagreed with the tree. Fixed.
- [x] FINDING major (STE adversary) One sentence let both outcomes apply to a removal. Fixed.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.

### Round 3 (commit f280ffa7)

- [x] FINDING critical (spec adversary) The `ghostmaps-050` tests placed all pins on one side, so reuse of the first pin position was not detected. Fixed: a new test with pins on opposite sides fails under the mutation `R3F01-position`.
- [x] FINDING major (STE adversary) Tasks 1.2 to 1.69 gave two instructions each. Fixed.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING minor (STE adversary) The phrase "catalog request options object" has four nouns. Kept: the lead accepts this minor finding under the owner rule, because the sentence is clear.

### Confirmation (commit f72758de)

- [x] FINDING minor (STE adversary) "puts back the production file" uses a phrasal verb. Fixed: "restores".

## Known limits

- `ghostmaps-ratchet-noise`: the branch total of `src/layers/streetLevel/view.js` flutters from 97 to 98.
- The branches at lines 404 and 405 of `server/providers/ghostMaps.js` cannot run, so the branch coverage of that file is 99.30%.
- One old catalog test keeps no tag, because its title contains the word "malformed".
