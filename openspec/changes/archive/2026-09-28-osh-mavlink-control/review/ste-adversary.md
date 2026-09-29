Round 3 verified against `.review-round3-diff.txt` (74 lines), tree now at commit `0c5be37`.

Verdict: PASS

- S19 (major) FIXED: `openspec/specs/osh-control/spec.md:124` and the archived copy at `:121` are both reverted to "a layer with no command view selects and destroys the same as before" — exactly the original, unambiguous wording. Confirmed no new issue from this revert.
- S20 (minor) FIXED: `tasks.md:61` now reads "Test the app builds the view only with a host." Dropping "that" here does not create real ambiguity — the reader hits "builds" with no subject left if they try to read "the app" as the object of "Test", so the intended reading ("Test that the app builds...") is the only one that parses; this is a common, self-correcting ellipsis, not a two-meaning problem. It also fixes the original S20 concern (no more "Confirm"), consistent with every other task's "Test..." wording. No objection to the trim.
- S21 (minor) FIXED: `design.md:270` now reads "The discovery session answers step 13: ...". "The discovery session" is a concrete antecedent already established two sentences earlier ("The lead did these steps in one session..."), so the vague-"this" problem is gone.
- S8 remaining (minor) FIXED: `design.md`'s Risks list now reads "D9's own check found no such case." — consistent with every other "read"-as-noun correction from round 2.

I checked the full 74-line diff, including the `openspec/trace/ids.json` hunk (a mechanical hash update from the S19 text revert, not new scenario content, correctly out of scope for prose review) and the mirrored edit in `openspec/specs/osh-control/spec.md`. I found nothing new to report in this round, and I did not re-open anything already passed in round 1 or round 2.

Remaining record for `review.md`: S13 (the two-sentence "Test X. Write Y." task style) stays as an accepted minor per your round-2 note, not something I'm reopening.

My review of `osh-mavlink-control` is complete: PASS.
