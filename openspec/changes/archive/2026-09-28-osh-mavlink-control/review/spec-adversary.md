Final state from spec-adversary: round 2 PASS stands, no further findings. See `review/round-2/spec-adversary.md` for the full round-2 review (verdict PASS, F1-F4 resolved, F5 new) and its follow-up exchange (F1 confirmed by executing the named mutation, F5 confirmed by committing the missing archive step).

spec-adversary's closing message: "Confirmed and acknowledged with team-lead. Summary of this review's conclusion:

**Round 2 verdict: PASS**, now confirmed by actual execution rather than just my inference:
- **F1** — the predicted mutation was run for real: `node --test` reported a clean per-test failure (`✖ [osh-control-032] builds the layer with no command view...`, `TypeError: Cannot read properties of null (reading 'replaceChildren')` at `src/layers/oshControl/view.js:24`), with the paired "with host" test still passing independently. This validates my earlier trace-through analysis without needing execution access myself.
- **F5** — root cause was an uncommitted `openspec archive` step; now committed as `2e8a4d2`, with `git show 2e8a4d2:openspec/specs/osh-control/spec.md` matching the working tree.

No further findings from my side. The osh-mavlink-control change is clear for `review.md` from the spec-adversary perspective, at commit `2e8a4d2` in `/home/ianblenke/docker/gev-work/mavlink`."
