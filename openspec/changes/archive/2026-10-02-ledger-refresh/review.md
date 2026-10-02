# Review: ledger-refresh

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-02
Gates: make gates CHANGE=ledger-refresh passed except LEDGER-LARGER-GAP on src/annotations/resolver.js (known limit refresh-may-flip)
Rounds: 2
Scope: diff 6682b32
Reviewed-Tree: bdc4ab0ce3e0d098a3f94025153042161d1191ebf1ce2034fc65991646223e34

## Findings

### Round 1 (scope: full) - FAIL

Full agent reports: `review/round-1/spec-adversary.md`, `review/round-1/ste-adversary.md`.

- [x] major (spec-adversary, 4 findings) The documents named two files while the ratchet command wrote 13. Rises of counts not covered for unchanged files had no name. Design D1 and task 1.2 disagreed. The closed entries of `retryableLoad.js` and `visuals.js` had no note. Corrected: the proposal lists all 13 files, and each document names the same set of lines.
- [x] minor (spec-adversary, 2 findings) The limit `refresh-may-flip` did not name the noise of the count 342 or the closed entries that can open again. The text did not say that the ratchet command wrote 342 and CI measured 314. Corrected in the proposal.
- [x] major (ste-adversary, 5 findings) The scope of the lines differed between the documents, a task gave two instructions, "two changed files", and the heading "How the gates measure this change". Corrected in the proposal, the design and the tasks.
- [x] minor (ste-adversary, 6 findings) Wording: verbs used as nouns, "has" for "records", "the changing counts" and the cause sentences. Corrected.

### Round 2 (scope: diff 6682b32) - PASS

Full agent reports: `review/spec-adversary.md`, `review/ste-adversary.md`.

- [x] minor (spec-adversary, 4 findings) A repeated sentence, the ambiguous short name `alprCameras.js`, no closing line for the function and branch gaps of two entries, and no statement that CI can stay red for `resolver.js`. Corrected in the proposal.
- [x] minor (ste-adversary, 7 findings) "count" and "total", "run" as a noun, "the exception" with no referent, and "smaller counts". Corrected in the proposal and the design.

## Accepted noise

- [x] The change run of the gates ends with `LEDGER-LARGER-GAP` on `src/annotations/resolver.js`: 359 lines not covered against 342 in the ledger. The count of this file changes between runs, as the limit `refresh-may-flip` says. The owner chose to run the ratchet command first and to fix the cause in a later change. Accepted by Ian Blenke on 2026-10-02.
- [x] CI on `main` can stay red for the same file after the merge. The later gates change must fix the cause.
