# Review: osh-control-panel-layout

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-29
Gates: make gates CHANGE=osh-control-panel-layout passed
Rounds: 3
Scope: diff 9e1bf92
Reviewed-Tree: ef0027a69fd414c807115b489e7161be39a198d33efd5e0e8fc7cc501133c209

## Findings

### Round 1 (scope: full) — FAIL

Note: this session's context was compacted after round 1 ran, so the
agents' own verbatim report text was not preserved. The two entries below
are reconstructed from the session record of what was reported and what
round 2 actually corrected; see `review/round-1/`.

- [x] critical (spec-adversary) `[osh-control-037]`'s test proved a `fieldset`, a `legend` and a button existed, but never proved the button was a DOM child of the fieldset. Corrected in round 2: `fieldset.children.includes(button)`.
- [x] critical (spec-adversary) `[osh-control-038]`'s test searched the whole `host` for field labels, not the command's own `fieldset`, so it did not prove containment. Corrected in round 2: search scoped to `nodes(fieldset)`.
- [x] major (ste-adversary) "the confirmation panel" used instead of the established term "the command view" (the same conflation as a finding in the sibling change `backfill-osh-control-options`). Corrected in round 2.
- [x] major (ste-adversary) non-approved use of READ in "the button ... reads as ..." (READ is approved only for "look at and understand written text"). Corrected in round 2 at the one spot found; a second, separate occurrence was found in round 3 and corrected then.
- [x] minor (ste-adversary) phrasal verb "tell apart" is not approved STE. Corrected in round 2; a recurrence of the same underlying TELL-meaning-"distinguish" defect, in different wording, was found in round 3 and corrected then.
- [x] minor (ste-adversary) "wraps"/"pushes" ambiguous against the CSS-wrap vs. `fieldset`-wrap decision named earlier in the same document. Corrected in round 2.

### Round 2 (scope: diff 040e599, commit 9e1bf92) — FAIL

Full agent reports: `review/round-2/spec-adversary.md`, `review/round-2/ste-adversary.md`.

- [x] critical (spec-adversary F1) `[osh-control-037]`'s test still only partially asserted its own THEN line: it proved the button's containment but never checked the field's own `label` for containment, even though the scenario names both. A mutation moving the field label outside the fieldset passed undetected. Corrected in round 3: added `fieldset.children.includes(label)` assertion; verified by the stated mutation (`content.push(label)` instead of `row.append(label)`), which now fails the test as expected.
- [x] minor (spec-adversary F2) `tasks.md` task 1.1 never called for checking field containment, the likely root cause of F1. Corrected in round 3.
- [x] minor (spec-adversary F3) `[osh-control-038]`'s "own line" claim is provable only via a CSS-class proxy (`osh-command-field`), since the fake DOM has no layout engine. A structural, non-fixable limitation of the test harness, not a round-2 defect. Accepted by Ian Blenke; recorded in the archived `proposal.md`'s "Known limits and later changes" section.
- [x] major (ste-adversary S1) `design.md:33` "reads as" — the round-1 "read as" defect recurred verbatim at a second location the round-2 fix hadn't reached. Corrected in round 3.
- [x] major (ste-adversary S2) `proposal.md:3` "tell one command's field from another's" — the round-1 TELL/"distinguish" defect resurfaced in different wording. Corrected in round 3.
- [x] minor (ste-adversary S3-S9, 7 findings) un- prefix negation, missing noun antecedents ("Nothing marks"), non-approved RUN ("a run of labels"), a non-standard verb+preposition pairing, an ambiguous "this," two reduced participial clauses ("holding"), and a passive construction hiding the actor ("gets a ... font weight"). All corrected in round 3. The S6 correction itself introduced a new STE-SENTENCE error (27 words, limit 25), caught by `make lint` and fixed by splitting into two sentences.

### Round 3 (scope: diff 9e1bf92, commit 16ba434) — PASS

Full agent reports: `review/spec-adversary.md`, `review/ste-adversary.md`.

- [x] (spec-adversary) No findings. Confirmed F1's fix proves containment for both failure modes (label removed entirely, label nested one level deeper). Confirmed every clause of `osh-control-037`'s WHEN/THEN/AND is now covered. No new gap from this round's edits (`view.js` untouched).
- [x] minor (ste-adversary R3-1) `design.md:25` "has that same text too" — TOO is ambiguous between "also" and "excessively." Accepted by Ian Blenke.
- [x] minor (ste-adversary R3-2) `design.md:25` "if this becomes unclear" — the un- prefix, inconsistent with this same change's own S3 fix elsewhere. Accepted by Ian Blenke.
- [x] minor (ste-adversary R3-3) `design.md:29` "whatever its own text length" — WHATEVER has no established precedent as approved STE in this project. Accepted by Ian Blenke.
- [x] minor (ste-adversary R3-4) `proposal.md:3` "another's" — elliptical possessive. Accepted by Ian Blenke.
- [x] minor (ste-adversary R3-5) `tasks.md:12` "share one text" — SHARE has no established precedent as approved STE in this project. Accepted by Ian Blenke.

Round 3 is the third and final scheduled round with only minor findings
open. Per AGENTS.md's review-round rule, all 6 open minor findings above
(spec-adversary F3, ste-adversary R3-1 through R3-5) were presented to the
user; the user chose to accept all 6 as-is rather than spend a fourth
correction round on cosmetic wording, on 2026-09-29. Accepted by Ian
Blenke.
