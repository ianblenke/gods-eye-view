# ste-adversary round 1 — osh-control-panel-layout

Scope: full
Verdict: FAIL

Note: this session's context was compacted after round 1 ran, so the agent's
own verbatim report text was not preserved. This file records the findings
as a summary, reconstructed from the session record of what was reported and
what was corrected in round 2. The finding descriptions below match what the
round-2 correction commit (66c4a57) actually fixed.

## Findings

- [x] major `openspec/changes/osh-control-panel-layout/proposal.md` and `design.md` — "the confirmation panel" used for the change's own subject instead of the established term, "the command view" (the same conflation recurred, independently, in the sibling change `backfill-osh-control-options`). Corrected in round 2.
- [x] major `openspec/changes/osh-control-panel-layout/design.md` — non-approved use of READ in "the button ... reads as ..." (STE approves READ only for "look at and understand written text"). Corrected in round 2 in the one spot found; a second, separate occurrence of the same defect was found in round 3 at a different line and corrected then.
- [x] minor `openspec/changes/osh-control-panel-layout/tasks.md` — the phrasal verb "tell apart" is not approved STE (phrasal verbs are not standard verb forms). Corrected in round 2; a related recurrence of the same underlying TELL-meaning-"distinguish" defect, in different wording, was found in round 3's review of proposal.md and corrected then.
- [x] minor `openspec/changes/osh-control-panel-layout/design.md`, Risks section — "wraps"/"pushes" reads as ambiguous between the CSS-wrap behaviour and the `fieldset`-wrap decision named earlier in the same document. Corrected in round 2.
