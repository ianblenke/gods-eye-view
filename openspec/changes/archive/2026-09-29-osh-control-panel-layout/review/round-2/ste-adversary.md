# ste-adversary round 2 — osh-control-panel-layout

Scope: diff 040e599 (commit 9e1bf92)
Verdict: FAIL

Confirmed FIXED from round 1: "confirmation panel" is no longer present
anywhere in the change (all four files consistently say "command view" and
"confirmation step"). tasks.md's "tell apart" phrasal verb is gone. Test
names for `[osh-control-037]` and `[osh-control-038]` are unchanged and
still verbatim-match their spec.md scenario headings.

## Findings

- [x] major `openspec/changes/archive/2026-09-29-osh-control-panel-layout/design.md:33` — "The button still reads as the one action a click sends." READ is approved only for "look at and understand written text," not "appears to be/is understood as." Using "reads" with two different meanings in one document (the approved use appears two sentences earlier at design.md:23) is exactly the "read as" defect round 1 raised; it is still present verbatim. Fix: "The button text still names the one action a click sends." Corrected in round 3.
- [x] major `openspec/changes/archive/2026-09-29-osh-control-panel-layout/proposal.md:3` — "The owner could not tell one command's field from another's." TELL is approved only for "give information to a person in speech/writing," not "distinguish." This is the same underlying defect as the "tell apart" phrasal verb tasks.md fixed — it resurfaced here with "tell ... from ..." instead of being removed. Fix: "The owner could not see the difference between one command's field and another's." Corrected in round 3.
- [x] minor `proposal.md:3` "the field labels are unclear" — STE negates with "not," not the un- prefix. Fix: "the field labels are not clear." Corrected in round 3.
- [x] minor `proposal.md:3` "Nothing marks where one command's fields end and the next begins." — "Nothing" has no noun antecedent, inconsistent with the parallel phrasing in design.md:3 ("No element marks..."). Fix: "No element marks where one command's fields end and the next begins." Corrected in round 3.
- [x] minor `proposal.md:8` "instead of a run of labels with no line break" — RUN is approved as "to operate" or "a period of operation," not "a series of items." Fix: "instead of a list of labels with no line break." Corrected in round 3.
- [x] minor `tasks.md:10` "so plain `byText` can no longer identify one from the other" — "identify ... from ..." is not a standard STE verb+preposition pairing. Fix: split into two sentences. Corrected in round 3 (and further split again after `make lint` caught a resulting 27-word sentence).
- [x] minor `design.md:25` "A future test can then identify each one separately if this becomes unclear." — "this" has no single clear noun antecedent. Fix: "if the shared text becomes unclear." Corrected in round 3.
- [x] minor `design.md:3` and `:29` "each holding its own input" / "keeps holding its own input" — reduced participial clauses, not simple verb forms. Corrected in round 3.
- [x] minor `design.md:33` "The legend gets a smaller font weight than the button." — hides the actor; the rest of the paragraph uses "`osh-panel.css` gives X a Y" for the same relationship. Fix: "`osh-panel.css` gives the legend a smaller font weight than the button." Corrected in round 3.

S1 and S2 are why the verdict is FAIL rather than PASS-with-minors: both are
recurrences of round-1's own named defect classes ("read as" and the
tell/distinguish confusion), so they read as the round-2 correction not
actually landing at these two spots rather than as a stylistic nitpick.
