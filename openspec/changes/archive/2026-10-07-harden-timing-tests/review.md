# Review: harden-timing-tests

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-07
Gates: make gates CHANGE=harden-timing-tests passed
Rounds: 4
Scope: diff 7255865
Reviewed-Tree: 9f1363e42e20072762dc9e09abde1ea2bd531218515cb4e09d4fa41efce55c60

## Findings

Full agent reports: `review/round-1/`, `review/round-2/`, `review/round-3/`, `review/spec-adversary.md`, `review/ste-adversary.md`.
Round 4 was an extra round: round 3 gave one major finding. The reviewers did not read the corrections after round 4 again. The lead ran the lint, the predispatch check and the format check after them.

### Round 1 (scope: full) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

- [x] FINDING critical (spec-adversary) The `[osh-015]` cap test in `src/data/oshGet.test.mjs` never awaited `assert.rejects`, so its assertion could not fail. Corrected in round 2: the awaited assertion is back, the unused mock clock is gone, and mutation row 46 makes the test fail.
- [x] FINDING major (ste-adversary) The same unawaited assertion. Corrected as above.
- [x] FINDING major (spec-adversary) Task 8 was checked, but the oshGet timeout test kept a real 20 ms deadline. Corrected in round 2: the test uses mock timers, a tick of 20 ms and a signal assertion; mutation row 40 fails the converted test.
- [x] FINDING major (ste-adversary) The design table of real waits omitted the seventh real delay, the cctvProxy 5 ms delay. Corrected in round 2: the table equals the `rg` output on the 17 files.
- [x] FINDING minor (spec-adversary, 5 findings) Missing real waits in the design, elapsed checks that became constants, `await requestStarted` without a guard, converted clock steps without a mutation row, open tasks and a stale tree hash. Corrected in round 2: cleared guards, exact elapsed values, mutation rows 47 to 54, the evidence for tasks 13, 16 and 21, and the commit names.
- [x] FINDING minor (ste-adversary, 14 findings) Wording faults in the documents and in five test comments. Corrected in round 2.

### Round 2 (scope: diff f3af2ca) - FAIL (spec-adversary PASS, ste-adversary FAIL)

- [x] FINDING major (ste-adversary, 3 findings) The design said that exact elapsed values replace the clock inequalities while two inequalities remain, "load processes" had two meanings, and the design said that final ownership checks clear their guards in finally blocks. Corrected in round 3: the design names the remaining inequalities, uses "load loops" and "test processes under load", and states what `within()` does.
- [x] FINDING minor (spec-adversary, 6 findings) `pollTimer` is not asserted defined, rows with two meanings for the 5 ms delay, a tree hash in place of a commit, tasks that cite an old log, evidence outside the repository, and exact-elapsed assertions that equal the tick. Corrected in round 3. The Known limits `poll-timer-unasserted` and `exact-elapsed-constants` stay open. Accepted by Ian Blenke.
- [x] FINDING minor (ste-adversary, 9 findings) Wording faults. Corrected in round 3.

### Round 3 (scope: diff 0404c26) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

- [x] FINDING major (spec-adversary and ste-adversary) The statement that the inequality of the controller stop test cannot fail disagreed with the code: the elapsed value is the sum of two production close deadlines. Corrected in round 4: the documents say that the value is 60 ms and that the assertion fails if each close deadline is 125 ms or more. The lead ran both deadlines multiplied by 5 on a copy and the assertion failed with `300 ms`.
- [x] FINDING major (ste-adversary) Two first-words cells of `corrections.md` quoted the corrected words instead of the round-1 words. Corrected in round 4.
- [x] FINDING minor (spec-adversary, 4 findings; ste-adversary, 7 findings) Wording, commit names, the list of evidence files and the warning count. Corrected in round 4.

### Round 4 (scope: diff 7255865) - PASS

- [x] FINDING minor (spec-adversary, 6 findings) An unbounded "only" for the 500 ms limit, the 125 ms bound without a run, three first-words cells that were not substrings of the round-1 text, scripts missing from the list of evidence files, two numberings of "round", and the commit claim without the source diff. Corrected after round 4: the text says "fails when `stop()` needs 500 ms or more", the lead's run with the multiplied deadlines is named, the three cells quote the full words, the Known limit `evidence-scripts` lists the scripts, the text says "the round-1 review findings", and the empty source diff between commits b95b44f and d923d4d is recorded.
- [x] FINDING minor (ste-adversary, 5 findings) The 125 ms wording, two figurative verbs, "inequality" against "assertion" in two files, the round numbering and the commit sentence. Corrected after round 4.
