Verdict: PASS

I read files only. I ran no test and no mutation, and I did not read the trace files. The diff's `src/ui` change is a retitle, and the test bodies I checked were in `index.test.mjs`.

1. **The 065-right test:** it kills the mutant.
   - `previewSlot()` at `index.js:227-231` is `'a'` when slot A is empty in `ab` mode.
   - The test pins B (`L16`) and runs a search, so `S18` previews in slot A with `_auto` set. `setMode('ab')` does not clear `_auto`. The empty probe for `S18` then calls `pruneEmpty` (`index.js:313-318`) and `autoPreview` (`index.js:287-296`).
   - Only `L16` is left, and `activeSlotOf(L16)` is `'b'`, so the real code returns at line 292. Without that operand the code sets `_auto` and `_previewKey` to `L16`.
   - The test asserts `auto === null`, `preview.key === null` and `preview.pending === null`. Each assertion fails on the mutant.
   - I did not check that `CANDIDATES[1]` and `[2]` map to `S18` and `L16`. The `S18` assertion in the test shows the first part, and the `L16` part fits the ranking.
   - The test carries tag `recent-imagery-039`. Scenario 039 has the matching new AND line.

2. **Retitled tests:** each keeps its tag, and the titles match the new spec AND lines.
   - Titles 030 ("reads as an integer and then as a fraction") and 036 ("reads as AB and then as null") match their `valueOf` and getter fixtures.
   - Title 042 ("day filter gives different results on each call") matches the alternating `days.filter` stub.
   - The DESTROY and ENABLE titles match the spec text.
   - The spec 036 THEN now says "does not send them back". The existing tests carry that claim.

3. **Known limits:**
   - I checked the 065-left claim against every `autoPreview` caller (`index.js:318`, `328`, `629`). Each caller runs after `_auto` is null and no slot A pin exists (line 629), or only when the old `_auto` key matches. In both cases slot A has no pin, so `!previewSlot()` cannot be true. The rewritten reason is correct.
   - The `default-323-dom-children` reword ("only a fake document whose elements have no `children` property") matches the round-2 analysis.
   - The `index.js` row in the ledger table changed from 1 to 0 uncovered branches. The 292 bullet left the unreachable list, and 065-left stays as a mutation-equivalent claim.
   - The counts are consistent across the design, the proposal and `tasks.md`: 434 tests, 433 declarations, 49 in `muts3.json` and 877 checks. The proposal states no total of equivalent claims, so the removal of 065-right does not leave a stale number.

4. **Old tests:** all retitled entries carry a tag added in this change. I found no rename of an untagged base test. Do not flag the old titles that remain.

- [ ] FINDING minor openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:76 The `expression-065-left` claim ("no input makes this operand true") rests on the `_auto` invariant. No test pins that invariant. Accept it as a known limit by name.
- [ ] FINDING minor src/layers/recentImagery/index.test.mjs:2257 The new 065-right test does not show that the search ranks `S18` above `L16`. The first assertion (`auto.key === S18`) gives that. No action is needed except a name for the record.
