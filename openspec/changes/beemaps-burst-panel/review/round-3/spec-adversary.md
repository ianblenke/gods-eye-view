Verdict: FAIL

Tip read: f6775e30, in the clone `gev-work/beemaps-burst-panel`. I ran no code and no git. I could not check the claim "git diff 3e9d7a12 HEAD prints nothing" in `host-checks.txt`, `mutations.txt` or `browser-run.txt`.

Money path:
- **Confirm path:** `pressConfirm` has one caller, the Confirm chip closure (`src/layers/beemapsBursts/index.js:406`). I found no path to a second confirm for one quote. I found none to an unseen quote, a confirm after the end, or a false "created".
- **Classification:** the 16 refused codes in `source.js` match the codes `server/providers/beemaps-burst.js` sends. `internal_error` and `outcome_unknown` classify as unknown.
- **Equivalent faults:** I checked all 16 reasons against the real edits in `gev-tools/beemaps-burst-panel/faults.py`. They are true.
- **Deltas:** both deltas differ from main in one line each.

- [ ] FINDING major openspec/changes/archive/2026-10-16-beemaps-burst-panel/evidence/browser-run.txt:15 @f6775e30 The line says "Run 1 ran it, and run 2 skipped it" about the stored-list check. The transcript says the reverse. Run 1 (line 114) is 79 seconds old and skips the check. Run 2 (lines 220-221) is 54 seconds old and passes it. `gev-tools/beemaps-burst-panel/browser/transcript-run1.txt:85` and `transcript-run2.txt:85` agree with the transcript. Write "Run 1 skipped it, and run 2 ran it."

- [ ] FINDING major openspec/changes/archive/2026-10-16-beemaps-burst-panel/proposal.md:58 (Known limit `lost-answer`) and design.md:94 (D17) @f6775e30 "The server holds new confirm requests only after an unknown or pending record of its own" is false. `startHold` (`server/providers/beemaps-burst.js:154-166`) and `confirmLocked` (:229-243) also hold all new confirm requests after the refusals `key_rejected` (300 s), `no_credit` (600 s) and `upstream_rate_limit` (`retryAfter`). Both lines changed this round. Remove "only". For example: "The server holds new confirm requests for 600 seconds after an unknown or pending record of its own. A record "created" gives no hold." The 600 s is `HOLD_MS` in `ledger.js`. The following sentence ("the server holds nothing") stays true.

- [ ] FINDING minor openspec/specs/beemaps-bursts/spec.md:234 and src/layers/beemapsBursts/layer.test.mjs:2414 @f6775e30 Scenario 020 says "a refusal or an unknown answer ... calls `requestRender` once". Only the refusal has a count (test 2414). Test 1025 pins the removal of the quote box for unknown answers through `entityIds`, but no 020 test counts renders for unknown. Add an unknown row to test 2414.

- [ ] FINDING minor CHANGELOG.md:3 and DATA_SOURCES.md:105 @f6775e30 "A confirm sends one create request" repeats the claim that round 2 fixed in the proposal. A held, refused or expired confirm sends none. Write "sends at most one create request".

- [ ] FINDING minor openspec/specs/beemaps-bursts/spec.md:156 @f6775e30 "no burst with a text `id`" has a boundary no test pins. `index.js:282` accepts `id: ''`. The `text` helper (`records.js:7`) and spec line 282 mean non-empty. No layer test has an `id: ''` row. The source tests (`records.test.mjs:195`, `source.test.mjs:458`) have one. A fault that rejects `''` at the layer passes every test. Write "a string `id`" and add the row, or reject `''` in `index.js` and add the fault.

- [ ] FINDING minor openspec/changes/archive/2026-10-16-beemaps-burst-panel/evidence/mutations.txt:853 @f6775e30 The fault "Give a created answer when the body is not readable" is not what `faults.py:847` does. The edit calls `classifyConfirm(status, {})` in the catch path. The reason is true, because the result is the same unknown answer. The name says "created". Rename it, for example "Classify an empty body when the body is not readable".

Accepted by name and not repeated: the lock shown as a lower bound only, and the -ing labels.
