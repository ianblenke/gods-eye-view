Round 2 verified against `.review-round2-diff.txt` (473 lines), tree now at commit `3ead99c`.

Verdict: FAIL

S1–S7 status:
- S1 FIXED. The "this round"/"the later round" framing is gone from proposal.md ("How this change was written", the Impact list, D12's title) and design.md ("Files"). The rewritten text agrees with tasks.md and with what the archived change actually contains. No new problem here.
- S2 FIXED (agency corrected) but the new wording adds a small new problem — see S20 below.
- S3 FIXED as asked (heading is now "OSH layer command view", the requirement text says "selection, deselection, and destruction", `destroy()` is now backticked at deselection). But fixing this scenario's neighboring line introduced a new major — see S19 below.
- S4 FIXED: `table.test.mjs` "Refuse extra, absent, wrong-type, and non-object parameters".
- S5 FIXED: `log.test.mjs` "Record safe refused, accepted, sent, and failed lines".
- S6 FIXED: `log.test.mjs` "Record redirect, timeout, and network failure reasons".
- S7 FIXED: `view.test.mjs` "Close confirmation on Cancel, a selection change, a clear, and the time limit".

New problems introduced by these corrections:

- [ ] S19 major openspec/specs/osh-control/spec.md:124 (also openspec/changes/archive/2026-09-28-osh-mavlink-control/specs/osh-control/spec.md:121) "a layer with no command view keeps its own selection and `destroy()` behaviour" This line was not one I flagged, and the fix for S3/S11 rewrote it unnecessarily. It now reads as two competing parses: (a) the layer keeps "its own selection" and separately "`destroy()` behaviour" as two different things it keeps, or (b) the intended reading, an ellipsis for "its own selection behaviour and `destroy()` behaviour". STE writing rules disallow dropping a repeated noun for brevity, and this is a permanent requirement scenario. The original text here, "a layer with no command view selects and destroys the same as before", had no such problem — it was never broken and did not need this edit. Write: "a layer with no command view selects and destroys the same as before" (restore it), or if `destroy()` must stay backticked: "a layer with no command view keeps the same selection behaviour and the same `destroy()` behaviour as before".

- [ ] S20 minor openspec/changes/archive/2026-09-28-osh-mavlink-control/tasks.md:61 "Confirm the app builds the view only with a host." "Confirm" is not the word this file uses anywhere else for a test task (every other task in `tasks.md` starts with "Test"), and it is not an approved STE word (the STE substitute for this meaning is "check"). Write: "Test that the app builds the view only with a host."

- [ ] S21 minor openspec/changes/archive/2026-09-28-osh-mavlink-control/design.md:270 "This answers step 13: two accounts without the new rights still get `403`..." This is the S17 fix (was "Step 13 is answered"). Making it active voice removed the passive but left "This" with no single clear antecedent — it could be the whole 15-item list above, item 15 alone, or the discovery session as a whole. Write: "The discovery session answers step 13: ..."

S8 status: FIXED everywhere I cited except one location that was missed:
- [ ] S8 (remaining) minor openspec/changes/archive/2026-09-28-osh-mavlink-control/design.md:318 "D9's own read found no such case." Still uses "read" as a noun; every other instance I cited (design.md:17, 165, 197, 262, 263, 280 in the new line numbering, and the route.test.mjs/view.test.mjs test names) was corrected, this one in the Risks list was not touched. Write: "D9's own check found no such case."

S9, S10, S12, S14, S15, S16, S18: FIXED, verified against the diff, no new issues from any of them.

S13: correctly recorded as an accepted minor rather than silently dropped — agreed, no objection.

I did not find any other new -ing word, new passive, new banned word, contraction, or new more-than-three-noun group anywhere else in the diff's added prose lines. The new test bodies added to `route.test.mjs` and `osh.test.mjs` are code/assertion-message changes, out of my scope.

Net: 3 new findings (1 major, 2 minor) plus 1 previously-cited minor left unfixed. Round 3 should fix S19 (revert or repair that one line), and can fold S20/S21/the remaining S8 item into the same pass.
