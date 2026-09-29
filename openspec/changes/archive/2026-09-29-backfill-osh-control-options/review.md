# Review: backfill-osh-control-options

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-29
Gates: make gates CHANGE=backfill-osh-control-options passed
Rounds: 3
Scope: diff 02720ff
Reviewed-Tree: b942a8f1e359264bd34f3b1eb117cea5e882439370fe2c8ed095bb238f841989

## Findings

- [x] F1 major (round 1, spec-adversary): the ratchet run perturbed the `src/data/labelArbiter.js` coverage ledger, a file this change does not touch, with no disclosure in the proposal. Corrected in round 2 by reverting `openspec/trace/gaps.json`/`history.jsonl` to match `origin/main`. Reoccurred in round 2 (a second, later ratchet run re-triggered the same known V8 branch-count flake, and the fix was committed without re-checking) — spec-adversary caught the recurrence in its round-2 pass. Corrected again in round 3, this time verified with a direct `git diff origin/main` immediately after the fix, with no intervening `make ratchet` before that verification. Confirmed clean by spec-adversary's round-3 re-read of the current tree.
- [x] F2 minor (round 1, spec-adversary): the change name `backfill-osh-control-options` does not match the literal `backfill-<capability>` form. Corrected by adding a sentence to the proposal's Why section stating the reason for the `-options` qualifier, rather than renaming the change.
- [x] F3 minor (round 1, spec-adversary): the new requirement and scenario called the code "the confirmation panel," but the field-building code runs on every `render()` call, not only while a confirmation is pending. Corrected to "the command view," the capability's established term for this code, matching `osh-control-031`/`032`/`024`'s neighboring requirements.
- [x] S1 major (round 1, ste-adversary): the scenario title's verb "Render" disagreed with its own WHEN clause's "builds" and the capability's established "build/built" verb. Corrected the title to "Build...". Introduced a new disagreement in round 2 (see S1(r2)), corrected there.
- [x] S2 major (round 1, ste-adversary): four different phrasings for "a command field of type `boolean`" appeared across the change. Standardized on the command table's own established `field: type` pattern. Only partly applied in round 1 (three spots missed); fully applied in round 2 after a complete sweep, and one further spot (design.md's Context paragraph) found and fixed in round 3.
- [x] S1(r2) major (round 2, ste-adversary): the round-1 fix for S1 introduced singular "a ... option," which disagreed with the THEN clause's own two options. Corrected to plural "the ... options," in both the scenario title and the test name.
- [x] S2(r2) major (round 2, ste-adversary): three spots (proposal.md, tasks.md, the scenario/test title) still used the pre-standardization phrasing after the round-1 fix. Corrected all three, plus one more spot in design.md found only by a full grep sweep, not by either round's findings alone.
- [x] S3-S12 minor (round 1, ste-adversary): "dropdown"/"selectable"/"draw" replaced with "select"; "expedited hotfix" replaced with "a fast fix"; "unusable" replaced with "not usable"; "checkable" reworded; the "could" modal replaced; one passive-voice sentence made active; two tasks each split from one bundled "and" instruction into two.
- [x] S13-S16 minor (round 2, ste-adversary): a second "could" modal removed from new prose; figurative "narrow" replaced with "small"; a contrastive "when" split into two sentences; an elliptical passive given a named actor ("a person already merged a fix").

All findings closed by round 3. No open minor findings remain to record as accepted.
