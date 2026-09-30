# ste-adversary — backfill-recent-imagery — Round 2 (scope: diff fef8c46)

Verdict: FAIL

Counts checked with Grep:
- 432 declarations (309 layer + 123 UI), so 433 with the path loop.
- 52 scenarios.
- 29 "Known limit" bullets: 27 audit bullets, `recent-imagery-ledger-history` and `recent-imagery-untagged-old-test`.
- 8 unreachable-path bullets (proposal:51-58).
- 29 old names (2+17+1+1+3+5), and the 23+3+2+1 split adds up.

Not checkable by Grep: 93, 828+48 (the source sentence is present).

Paths: SPEC = openspec/specs/recent-imagery/spec.md, P = archived proposal.md, L = src/layers/recentImagery, UI = src/ui/recentImagery.test.mjs.

- [ ] FINDING major SPEC:297,337 "dESTROY does not allow" -> "DESTROY does not allow". The case error is in two places.
- [ ] FINDING major SPEC:280 vs L/index.test.mjs:3152,3187 "a mode value with a noninteger second numeric result" vs "a mode with different numeric results" / "different source lists". The two texts disagree, and "different" has no clear referent. Write spec: "a mode value that is not an integer does not change the mode". Write titles: "a mode value that is not an integer does not change the mode" and "the hidden count stays zero when empty days show, for any source list".
- [ ] FINDING major SPEC:373 "a share mode whose second value is null" -> "a share mode with a null second value does not change the current mode". Same fix in L/index.test.mjs:3201. The meaning of "second value" is not stated anywhere.
- [ ] FINDING major L/index.test.mjs:3260,3267 "does not change the host after a renderer callback" -> "does not change the host, even if a renderer callback calls ENABLE". The titles lost the condition that SPEC:337,354,424 state.
- [ ] FINDING major SPEC:364,367,370 "preserves" (also "preserve") -> "keeps". This is a repeated word-class fault, and the spec already uses "keeps" for the same meaning.
- [ ] FINDING minor L/testDoubles.test.mjs:4 "give stock input" -> "give standard input" (design.md:55 already says "standard").
- [ ] FINDING minor SPEC:252,353 and L/index.test.mjs:2729,2748,2993 "nonfunction" -> "a value that is not a function".
- [ ] FINDING minor SPEC:267 "enable does not repeat" -> "ENABLE does not repeat".
- [ ] FINDING minor L/index.test.mjs:1741 and P:86 "cancelled" -> "canceled".
- [ ] FINDING minor UI:2220 "a source off pin loses" -> "a pin whose source is off loses". (Round-1 finding, still open.)
- [ ] FINDING minor UI:1499 "URL functions own" -> "URL helpers own". The word "functions" can be a verb or a noun.
- [ ] FINDING minor L/index.test.mjs:1702,1711 "the hls source" / "the viirs source" -> "the HLS source" / "the VIIRS source".
- [ ] FINDING minor L/index.test.mjs:2380,2394 "its pass note" -> "its overview note" (SPEC:262 says "overview note").
- [ ] FINDING minor L/catalog.test.mjs:298 "use different defaults" -> "use a default for each field". L/model.test.mjs:592 "an invalid pin positive-size alone" -> "an invalid pin size that is not positive alone".
- [ ] FINDING minor P:88 "An unsolicited AbortError leaves an entry." -> "An AbortError that the loader did not start leaves the day entry in the cache." (Round-1 item, still open.)
- [ ] FINDING minor P:90 "Panel render restores scroll after DETAILS tries to reveal the card." -> "The panel restores the scroll position after the DETAILS card tries to show the card." (Round-1 item, still open.)
- [ ] FINDING minor P:282 "The two tests for possible defects 4 and 1 must change" -> "The tests for the nonfinite latitude and for the AbortError entry must change".
- [ ] FINDING minor P:44 "set the entry ... back to" -> "put the entry for that file back at the values in `main`".
- [ ] FINDING minor tasks.md:585 "Record the equivalent size guard mutation." (four nouns) -> "Record the mutation of the size guard. It gives the same result."
- [ ] FINDING minor tasks.md:614 "Retag" -> "Change the tag of the test doubles to `recent-imagery-052`."
- [ ] FINDING minor SPEC:174 "renderer destruction sends `recent-imagery-destroy` if either slot has an image" -> "the renderer sends `recent-imagery-destroy` when it stops, if either slot has an image"
- [ ] FINDING minor SPEC:362,395,398 and L/index.test.mjs:2871 "publication" (noun from a verb) -> "when the layer publishes".

QUESTION L/thumbnails.test.mjs:268 "an aborted fetch ... once the abort settles" uses "abort" as a noun. Is this title old with a tag added? If it is new, write "a request queued behind a stopped fetch still starts when the stop settles".
QUESTION SPEC:57-58,173,226,252,267,301-305 have a blank line before an AND line. This was open in round 1. Does OpenSpec keep those lines in the same scenario? I cannot run the tool.

Lead's answers: the thumbnails title is an OLD title (it exists at base 3a919b7 without a tag), so it stays. No blank line before an AND line remains in the landed spec (checked by script).
