STE adversary review of `backfill-osh-control-options`, round 2 of 3, scope: diff since commit 3029594. Tree read: repo `/home/ianblenke/docker/gev-work/backfill-osh-control-options`, branch `backfill-osh-control-options`, commit 02720ff.

Files checked (diff only): proposal.md, design.md, tasks.md, the "Command field controls" requirement in openspec/specs/osh-control/spec.md:205-212, and the test name in src/layers/oshControl/view.test.mjs:73.

Verdict: FAIL

Confirmed fully fixed: S3, S4, S6, S7, S8, S9, S10, S11, S12 from round 1. Good catch finding the extra "hotfix" instance in proposal.md's Impact section (S5) that I had not flagged.

- [ ] S1(r2) major openspec/specs/osh-control/spec.md:209,211 "Build a true and false option for a boolean field" vs "one option for `false` and one option for `true`" — the fix for round-1 S1 introduced a new disagreement. The scenario title now uses singular "a ... option" (one option), but the THEN clause two lines below states there are two options, one for each value. "Option" here is the exact noun used to count the two `<option>` elements, so the singular form contradicts the THEN clause of the very same scenario. This wording is copied into the test name (view.test.mjs:73). Write "Build a true option and a false option for a boolean field" or "Build the true and false options for a boolean field."

- [ ] S2(r2) major proposal.md:3, tasks.md:3, and spec.md:209 (+ the test name) "boolean command field" / "a boolean field" — round 1's S2 is only partly fixed. "a command field of type `boolean`" is now the form in the requirement statement and the WHEN clauses (spec.md:206,210; design.md:3,11; proposal.md:11,22), but three spots were missed and still use older, different phrasing: proposal.md:3 "for every boolean command field," tasks.md:3 "Show a target with a boolean field," and the scenario title / test name "for a boolean field." Convert these three to the canonical form too so the change uses one name for this concept throughout.

- [ ] S13 minor proposal.md:7 "could wrongly suggest" — this is a new sentence added since round 1, and it reintroduces the same modal question raised and fixed elsewhere in this file as S9 ("could" is not confirmed as an approved STE modal; this project already bans "may" and "should"). Recommend removing the modal: "A bare name `backfill-osh-control` gives a wrong idea: that this change backfills the whole capability."

- [ ] S14 minor proposal.md:7 "one narrow fact about one field type" — "narrow" in ASD-STE100 means physically not wide; this use is figurative ("limited in scope"), which is a meaning STE does not approve for this word. Write "one small fact" or "one specific fact."

- [ ] S15 minor proposal.md:7 "when it backfills one narrow fact about one field type" — "when" here means "whereas/although" (a contrast), not a point in time, which is the only STE-approved sense of "when" (and the only OpenSpec sense, per check 9). Split into two sentences instead, for example: "...could wrongly suggest this change backfills the whole capability. In fact, it backfills only one small fact about one field type."

- [ ] S16 minor proposal.md:5 "and a fix already merged as a fast fix" — this line was touched by the diff (the S5 fix). "A fix already merged" has no stated actor and no auxiliary verb ("was"), so it reads as an incomplete or elliptical passive. Name the actor: "and a person already merged a fix, as a fast fix, outside the spec-first process, because a drone was in flight."

Given S1(r2) and S2(r2) are major, the round fails. Both are narrow, mechanical fixes (the two spots the S1/S2 corrections did not fully cover). I'd expect round 3 to close these.
