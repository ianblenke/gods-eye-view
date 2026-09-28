# Review: osh-mavlink-control

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-28
Gates: make gates CHANGE=osh-mavlink-control passed
Rounds: 3
Scope: diff 2e8a4d2
Reviewed-Tree: 17567cca72a76c64f0f0f6807005ad2688751915e7a413195214b47552f70d8e

## Findings

### Round 1 (scope: full)

- [x] F1 blocker (critical) `src/app/layers/osh.test.mjs`: the `[osh-control-032]` "no host" test never selected a system, so it never reached the code path it claimed to test; its own named mutation would not have made it fail. Fixed: the test now clicks a system after `update()` and asserts both the selection still works and `/api/control/osh/targets` is never read. Verified by executing the named mutation (`node --test`, exit 1, a clean per-test `✖` with a `TypeError` from `view.js`'s `render()` on a null host, the paired test unaffected).
- [x] F2 blocker (major) `server/providers/osh-control.js`, `server/providers/osh-control/post.js`: no test asserted the real upstream request shape. Fixed: `[osh-control-026]`'s test now asserts the `Authorization` header, `Content-Type`, `redirect: 'manual'`, and the `{"parameters": {...}}` body. Verified by executing three separate mutations (dropped `redirect: 'manual'`, wrong `Authorization`, wrapped body): each failed the strengthened test.
- [x] F3 blocker (major) `server/providers/osh-control/targets.js`, `src/control/route.test.mjs`: `osh-control-003`'s "in that order" claim was untested, since every case broke only one input at a time. Fixed: added two simultaneous-failure cases. Verified by executing a swap of the `no_key`/`no_account` checks: the test failed.
- [x] F4 minor `proposal.md`, `design.md`: stale "this round"/"the later round" framing contradicted the archived change's own full implementation. Fixed: rewritten to describe the change as merged.
- [x] S1 major `proposal.md`, `design.md`: same defect as F4, found independently by the second reviewer. Fixed together with F4.
- [x] S2 major `tasks.md`: a reversed-actor task instruction ("the command view builds" implying self-construction). Fixed: "Test the app builds the view only with a host" (see also S20, round 2).
- [x] S3 major `specs/osh-control/spec.md`: the requirement heading "OSH layer wiring" is ambiguous in a document about a real aircraft. Fixed: renamed to "OSH layer command view"; "at destroy" became "at `destroy()`".
- [x] S4 major `src/control/table.test.mjs`: an unpunctuated adjective run admitted more than one reading of which cases the test covers. Fixed: "Refuse extra, absent, wrong-type, and non-object parameters".
- [x] S5 major `src/control/log.test.mjs`: same defect. Fixed: "Record safe refused, accepted, sent, and failed lines".
- [x] S6 major `src/control/log.test.mjs`: same defect. Fixed: "Record redirect, timeout, and network failure reasons".
- [x] S7 major `src/layers/oshControl/view.test.mjs`: same defect. Fixed: "Close confirmation on Cancel, a selection change, a clear, and the time limit".
- [x] S8 minor `design.md` (six locations), `src/control/route.test.mjs`, `src/layers/oshControl/view.test.mjs`: "read" and "clear" used as nouns, not STE-approved word classes. Fixed at every cited location except one (see S8-remaining, round 2).
- [x] S9 minor `design.md`: "support" used with a non-STE meaning ("is compatible with"). Fixed: "offer".
- [x] S10 minor `design.md`: "extends" used with a non-STE meaning ("adds a feature to"). Fixed: "adds to".
- [x] S11 minor `specs/osh-control/spec.md`, `src/data/oshLayer.test.mjs`: "destroy"/"select"/"deselect" used as bare-verb nouns. Fixed: nominalized ("destruction") or backticked (`` `destroy()` ``) depending on context.
- [x] S12 minor `src/data/oshLayer.test.mjs`: "unheld", a coined word not used elsewhere in the change. Fixed: "a system with no held record", matching the spec's own vocabulary.
- [x] S14 minor `tasks.md`: four nouns grouped in one task. Fixed: reduced to three ("the checked URL, the POST, and the response handling").
- [x] S15 minor `specs/osh-control/spec.md`, `tasks.md`, `design.md`, `src/control/route.test.mjs`: "per" is not an STE word; this change already uses "for each" everywhere else for the same idea. Fixed at every cited location.
- [x] S16 minor `proposal.md`: "make" used with a non-STE meaning ("establish"). Fixed: "give".
- [x] S17 minor `design.md` (four locations): passive voice with an available active subject. Fixed at three; the fourth's fix introduced S21 (round 2).
- [x] S18 minor `specs/osh-control/spec.md`, `proposal.md`, `tasks.md`: "is retired", passive. Fixed: "This change retires...".
- [x] S13 minor `tasks.md`: every test-writing task repeats a two-sentence, two-verb shape ("Test... Write..."). Kept, by lead decision during round 1's corrections, not corrected: this style is already used throughout this project's other merged changes (for example `2026-09-26-qa-script-register/tasks.md`), and rewriting roughly 40 task lines for a purely stylistic, systemic pattern was judged a poor cost/benefit trade for a minor finding. Both reviewers confirmed no objection to keeping it, in round 2 and round 3.

### Round 2 (scope: diff 3ead99c)

spec-adversary: PASS, with one new finding (F5) and confirmation of F1 by execution.

- [x] F5 minor `openspec/specs/osh-control/spec.md`: the round-2 re-archive had been staged but never committed, so the merged spec file's update would have silently reverted on a clean checkout. Fixed: committed as `2e8a4d2`.

ste-adversary: FAIL. My own round-1 corrections introduced two new problems and missed one previously-cited location.

- [x] S19 major `specs/osh-control/spec.md` (both copies): fixing S3 led to an unneeded edit of a neighbouring, already-correct scenario line, turning it into an ambiguous ellipsis. Fixed: reverted to the original wording, "a layer with no command view selects and destroys the same as before".
- [x] S20 minor `tasks.md`: the S2 fix used "Confirm", a word this file uses nowhere else and that is not the STE-approved word for this meaning. Fixed: "Test the app builds the view only with a host" (trimmed to stay inside the 20-word instruction limit).
- [x] S21 minor `design.md`: the S17 passive-voice fix left "This" with no single clear antecedent. Fixed: "The discovery session answers step 13".
- [x] S8-remaining minor `design.md` (Risks list): one "read"-as-noun instance was missed in round 1. Fixed: "check".

### Round 3 (scope: diff 2e8a4d2)

Both reviewers: PASS, no new findings. ste-adversary confirmed S19/S20/S21/S8-remaining fixed correctly and raised nothing new in the 74-line round-3 diff.

## Gate verification

`make gates CHANGE=osh-mavlink-control` was run after every round; each time it showed only `ERROR REVIEW-MISSING` (expected until this file existed) with no other error. The final run, at the reviewed tree, showed the same single expected error.
