# Review: fix-covered-count

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-17
Gates: make gates CHANGE=fix-covered-count passed
Rounds: 5
Scope: diff 7659531
Reviewed-Tree: 47ec74c069c28380fe08868c0f3b7b4b1beaba2abf71fc6c84b71150b71d6754

The output of each round is in `review/round-<n>/`. The output in `review/` is the spec adversary of round 4, which gave PASS, and the STE adversary of round 5, which gave PASS with no finding. The STE adversary of round 5 read every correction that the spec adversary asked for in round 4, so the later round confirms the earlier one.

The `Scope` line gives the commit `7659531`, the merge of the change `osh-fusion`, which is the one commit this branch has for its base. Each round read the diff since that commit.

The number of findings by round: 18 in round 1, 17 in round 2, 12 in round 3, 4 in round 4 and none in round 5.

## What the review found

The change replaces one comparison in the gap-ledger gate. The code was correct after round 2. Round 3, round 4 and round 5 found only prose that did not agree with that code, and each of those rounds found some.

Three of the findings were faults in the rule itself, and each came from a different round:

- **The sign.** `Math.min` is signed, so a not-covered count that falls made the loss negative and removed the check from that metric at any tolerance. A real loss of a covered function passed every metric. Round 1 found it.
- **The loosening.** `min(rise, fall)` passes whenever the rise is inside the tolerance, whatever the fall. A tolerant file can lose 40 covered branches in silence, where the rule before this change stopped. Round 2 found it. The change records it as a known limit rather than fixes it, because the stricter rule is a later change.
- **The proof was stronger than the spec.** The word "loss" was in three scenarios and defined in none, and `gap-ledger-054` excluded the shape the fix exists for. An author could have reverted the fix and still satisfied every scenario. Round 3 found it.

## The measurement that drove the change

```
run that failed   src/search/placeSearch.js  BRF 22  BRH 19   -> 3 not covered
run that passed   src/search/placeSearch.js  BRF 23  BRH 20   -> 3 not covered
ledger entry                                 total 23, not covered 3
```

The not-covered count was 3 in both runs. Only the branch total moved. Each ratchet run of this change kept the entry at 23 and 3, which is the test that the rule is right: a rule that banked 22 would teach the ledger to believe the noise.

## Findings

### Round 1: spec-adversary

- [x] F1 major `Math.min` is signed, so a fall of the not-covered count removed the check from that metric. The agent gave the shape, an outer function with nested callbacks, and the fix. A test was written first and failed.
- [x] F2 major The known limit named the wrong case. The function count has nothing to do with it: with the not-covered count unchanged the loss is 0 at every file size.
- [x] F3 to F9 The `078` line that admitted the falling case, the "no other error" claim, the cross-metric reading of `054`, the test name that stated a removed behaviour, the Impact file list, the heading and a lost blank line.

### Round 1: ste-adversary

- [x] S1 major The test at `ledger.test.mjs:167` was named "stops for fewer covered branches", which is the behaviour this change removes. The scenario title had been corrected and the test name had not.
- [x] S2 major The `054` AND line could be read across metrics, which made its THEN untrue under that reading.
- [x] S3 major The proposal named one scenario for the loss rule where two carry it.
- [x] S4 to S10 One word for one meaning, three unapproved words, and a limit that did not name the tolerance conditions.

### Round 2: spec-adversary

- [x] F1 major The loosening described above.
- [x] F2 major "loss" was used in three scenarios and defined in none, and `054`'s WHEN excluded the falling shape, so a plain `Math.min` still satisfied every scenario.
- [x] F3 to F6 The Impact file list, a claim that every new assertion fails against the old code, "can fall", and the direction of the requirement bound.

The agent also proposed a second fix for the loosening: keep the old covered-count comparison for tolerant files. The author measured it and refused it, because `src/search/placeSearch.js` has the tolerance conditions and a tolerance of 0, so that check brings back the very stop this change removes. The agent accepted the correction and recorded why: it had read "no tolerance conditions" and "tolerance 0" as the same thing.

### Round 2: ste-adversary

- [x] S1 major The design said a file that no longer calls its own function reaches the loss rule. It cannot: that file gets a new content hash and takes the changed branch.
- [x] S2 major The Impact omitted two changed files.
- [x] S3 to S13 Wording, and two test comments.

### Round 3: spec-adversary (Verdict: PASS)

- [x] F1 minor The `054` rewrite dropped the positivity condition, so the scenario read as stopping every unchanged file without the tolerance conditions, which contradicts `078`.
- [x] F2 minor The limit said the case "still does not stop", which claims it predates the change. Both cases are new.
- [x] F3 minor `gaps.json` was in the Impact and is not changed. An earlier correction had outlived its evidence.
- [x] F4 minor The history sentence said two lines. There are four, in two pairs, because the counts of one file moved and then moved back.

### Round 3: ste-adversary

- [x] S1 major The design gave a false reason for the residual case: it named the line tolerance, and the reason holds only for the second of the two cases.
- [x] S2 major A sentence named no file for the counts it described.
- [x] S3 to S8 Wording, including three of the author's own judgements which the agent assessed: two upheld, one refined.

### Round 4: spec-adversary (Verdict: PASS)

- [x] F1 to F4 The four findings of round 3 confirmed as applied, and one new: the design claimed two new assertions fail only against the middle form of the rule, where one of them stops under every form. That sentence had then been wrong twice.

### Round 4: ste-adversary

- [x] S1 major The round-3 replacement this agent gave was itself untrue for a tolerant file, and the agent found that itself. The gate records a stale entry only when the file is not tolerant.
- [x] S2 minor A collapse of two findings put one qualifier in two files for opposite shapes, so it separated nothing.
- [x] S3 minor A correction of round 3 never reached the line it named. The author moved the corrected sentence to a neighbouring file and left the test comment as it was.

### Round 5: ste-adversary (Verdict: PASS)

- [x] No finding. The agent read each correction against `ledger.mjs`, tested the other route into the first case, counted the assertions that fail against the code before this change, and searched for a second copy of each corrected sentence.

## What this review shows

Four times a correction in one place left the same fault standing in another, and once a correction outlived the evidence that justified it. The record of each round names where that happened.

The author declined three times to edit a test that had nothing new to assert, and proved each time that the behaviour had not changed. `gap-ledger-071` keeps its test for that reason.
