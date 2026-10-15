Verdict: PASS
Tip 12691c10 (diff since 3c9496d4). I read the files by hand and ran nothing. There are no critical and no major findings. My round-1 major (the word "own" in scenario 013) is closed. The five minors below are all in the evidence files and the Known limit.

- [ ] FINDING minor openspec/changes/archive/2026-10-15-beemaps-frames/evidence/browser-run.txt:8 (12691c10) My round-1 split added a fault (rule 20). The line now has 8 sentences (limit 6). Write "This is the run that passed. Earlier runs of the same driver stopped at a check or at a wait. No earlier run stopped because of the layer. Each cause was in the driver:" and then four list lines: "- The share link needs lat and lon in the hash.", "- The data panel starts closed.", "- A click used a position that had moved.", "- A check ran before the page had loaded again."
- [ ] FINDING minor openspec/changes/archive/2026-10-15-beemaps-frames/evidence/mutations.txt:372,373 (12691c10) The new fault lines carry the scenario 002, and 002 is not among their failing tests. This is the fault class of my round-1 minor. Line 372 fails [003], so write 003. Line 373 fails only [007], [020] and [021], and no scenario sentence says that `getStats` sends no request. Relabel it 007, or add that sentence and a test to 002.
- [ ] FINDING minor openspec/changes/archive/2026-10-15-beemaps-frames/evidence/mutations.txt:17 (12691c10) "was an equivalent fault then. No row of that time could show a difference" contradicts line 34. Round 1 found a row, so the fault was never equivalent. Write "The team marked the fault with the radius as equivalent then. No row of that time showed a difference at 6 decimals."
- [ ] FINDING minor openspec/changes/archive/2026-10-15-beemaps-frames/proposal.md:40 (12691c10) "The message goes when someone disables and enables the layer" uses "goes" in a vague way. This is my own round-1 wording. Write "The layer removes the message when someone disables and enables it." This matches `reset()` (index.js:81-93).
- [ ] FINDING minor openspec/changes/archive/2026-10-15-beemaps-frames/evidence/browser-run.txt:4 (12691c10) "it throws no other address" has two readings. This line is outside the diff but inside the header focus. Write "it throws an error for any other address". I could not check this against the driver script.

Closed, checked in the files:
- **Spec 012 and 013 (both spec files):** "a signal that the source makes" and "a call rejects with the abort error when the signal of the call is aborted" now agree with source.js:52-63 and with the test titles at source.test.mjs:308 and 375. Spec 011 keeps "the signal of the call", which getStatus passes through.
- **Scenario 006 and the Known limit:** both match `_pressMessage ?? _statusMessage` (index.js:201).
- **Round-1 STE minors:**
  - The fault name with the banned form is renamed (mutations.txt diff line 152).
  - "The first run follows" is in the text (mutations.txt:47).
  - Evidence sentences are 25 words or fewer, except the one at browser-run.txt:8 above. The Run A sentence is exactly 25 words.

Checked, no finding:
- **New row (39.975, 0.0):** it is right by my hand calculation. The half width is 0.011735498, which rounds to 0.011735. With the radius 6371000 it is 0.0117355143, which rounds to 0.011736. The south value is 39.966007 and the north value is 39.983993.
- **Evidence counts:** 347 fault lines, 14 untagged lines, 2 TIMEOUT lines and no NONE line, as stated in mutations.txt:10. There are 5 added faults and 3 relabelled faults.
- **Test files and banned words:** the `signal` variable in source.test.mjs:101 exists. There is no banned word in the changed prose.
- **Accepted -ing words:** "Fetching…" and "after the rounding" are accepted by name.

Not checked: the commands `git diff --stat 6c6fb1bd 6dd67760` and `git diff --stat 6dd67760 HEAD` (I cannot run git), the raw fault logs, the 818 lint warnings after the document changes, and the pull requests 1002 and 1069.
