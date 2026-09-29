# Review: osh-control-auto-targets

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-28
Gates: make gates CHANGE=osh-control-auto-targets passed
Rounds: 2
Scope: diff b80142c
Reviewed-Tree: 446e1121fe350f25c2c2eb0435a243fadce2fa7cc020915f65926bdc41596ca8

## Findings

- [x] F1 critical (round 1, spec-adversary): `src/layers/oshControl/client.test.mjs`'s test for `client.targets(systemId)`'s query-string building was tagged `[osh-control-016]` (the confirmation-panel scenario) instead of `[osh-control-034]` (the live per-system targets scenario it actually exercises), so `openspec/trace/links.json` falsely credited scenario 016. Corrected: retagged `[osh-control-034]`. Verified in round 2 against the real trace links.
- [x] F2 minor (round 1, spec-adversary): `validateCommand`'s new `typeof body.system !== 'string'` guard was never exercised with a non-string value, so a single-element array could slip past `OSH_ID_PATTERN.test()`'s auto-coercion undetected if the guard were ever weakened. Corrected: added `42`, `true` and `['sys-fixture-one']` cases to the `osh-control-033` unit test. Verified by hand-mutating out the guard and confirming the array case fails.
- [x] F3 minor (round 1, spec-adversary): `proposal.md`'s Impact section said the change "Changes the THEN clause of `osh-control-030`", but the scenario is fully retired and replaced by `osh-control-034`/`osh-control-035`, not edited in place. Corrected the wording in `proposal.md` and, incidentally, the same sentence in `design.md`.
- [x] F4 minor (round 1, spec-adversary): `proposal.md` was missing the "Known limits and later changes" section every other archived proposal has; the real limits were only in `design.md`'s Risks section. Corrected: added the section to `proposal.md`, carrying the two real risks over.
- [x] F5 minor (round 1, spec-adversary): ledger noise on `src/data/labelArbiter.js` and `src/keylessGeocoder.js` (unrelated to this change, a branch count drop then restore within the same commit) — known, pre-existing coverage-merge-order flakiness, within the gap-ledger count tolerance. Confirmed net zero across two further ratchet runs; no fix needed.
- [x] S1 major (round 1, ste-adversary): the "Target allowlist" requirement heading contradicted its own body and `design.md`'s explicit "This is a shape check, not an allowlist." Corrected: renamed to "Target resolution", using a REMOVED (old name, bare) + ADDED (new name, same four scenario IDs) pair, since the `openspec` CLI rejects the same requirement name appearing in both `REMOVED` and `MODIFIED`/`ADDED` in one delta (confirmed by testing both combinations).
- [x] S2 major (round 1, ste-adversary): the Purpose line's "the table and a live schema check do not both name exactly" read as an ambiguous "respectively" construction. Corrected: split into two unambiguous sentences.
- [x] S3 major (round 1, ste-adversary): "malformed" (not an approved STE word) duplicated the term `design.md` already used for the same condition, "wrong shape". Corrected: replaced every occurrence in `spec.md`, `tasks.md`, and both new test names (both new to this change, so renaming was permitted).
- [x] S4 minor (round 1, ste-adversary): passive voice in `design.md`'s Trace paragraph, inconsistent with this change's own active-voice convention elsewhere. Corrected to active voice.
- [x] S5 minor (round 1, ste-adversary): passive voice in `design.md` D3 with the actor named two sentences earlier. Corrected to name `resolveTargets` as the actor.
- [x] S6 minor (round 1, ste-adversary): an incomplete sentence in `design.md`'s risk 1 ("the only gate on which system"). Corrected with a full relative clause.
- [x] S7 minor (round 1, ste-adversary): "matching" used as an -ing adjective in new prose (`spec.md`, `design.md`, `tasks.md`, one test name), not caught by the lint. Corrected to "that matches"/"that match" throughout.
- [x] S8 minor (round 1, ste-adversary): a test name said "command object" (singular) for the `commands` field (plural). Corrected the test name.
- [x] S9 minor (round 1, ste-adversary): a rhetorical question in `proposal.md`, inconsistent with this project's declarative convention. Corrected to a declarative sentence.
- [x] S10 minor (round 2, ste-adversary): "owner-curated" in the archived delta's REMOVED-requirement Reason text didn't match the term ("owner-typed list") this same change already established in `design.md` and `proposal.md`. Corrected to "owner-typed".
- [x] S11 minor (round 2, ste-adversary): a "stops X from Ying" gerund construction in `proposal.md`'s new Known-limits section, where `design.md` already stated the same fact with a relative clause. Corrected to match, and trimmed to fit the 25-word sentence limit.
