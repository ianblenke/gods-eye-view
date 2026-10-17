Verdict: FAIL
Tree: /home/ianblenke/docker/gev-work/beemaps-frames-limits, branch beemaps-frames-limits, commit eefb43af. I read files only and ran no code or git. I took base files from /home/ianblenke/docker/gods-eye-view (main).

- [ ] FINDING major openspec/changes/archive/2026-10-17-beemaps-frames-limits/design.md:78 (eefb43af) The design contradicts itself after the owner's correction. design.md:25 says `creditsRemaining` is not the dashboard balance. Line 78 then says the log shows `notEnoughCredits=true` and a negative `creditsRemaining` "because they are the facts of the owner's balance". The Risks row at line 130 is "[The log shows the balance of the owner]". proposal.md:45 plans a warning "when the balance is at or below zero, from the flag `notEnoughCredits`", which also treats the flag as a balance. proposal.md:51 says the balance "did not change", while design.md:25 says "did not visibly change". No pre-call balance is in the change. Say instead that the answer reports these fields and their meaning is unknown, and use the weaker wording at proposal.md:51. I did not run my replacement words through the STE lint.
- [ ] FINDING minor openspec/changes/archive/2026-10-17-beemaps-frames-limits/specs/beemaps-source/spec.md:79 and :99 (eefb43af) Two AND lines have no test.
  - No 033 test makes "a timeout" or "a body that is too large" (src/data/beemapsCredits.test.mjs:228 has status, thrown error, not JSON, null, [] and wrong shape).
  - No 034 test sends a bad body, a wrong method or a missing key at count 500. The faults at evidence/mutations.txt:486-491 are killed only by the memory assertion at beemapsCredits.test.mjs:546.
  - Add the rows or cut the words. Known limit `credits-count-gaps` names the 033 behavior, so this is not major.
- [ ] FINDING minor server/providers/beemaps/credits.js:92 (eefb43af) Two limits are not in "Known limits".
  - The file is written in place, with no temp file and rename. A kill during the write leaves a partial file. Then every request that memory does not answer gets 503 until a person repairs the file. `crash-before-write` names only the lost credits.
  - Spec 035 (delta line 107) gives count 0 for a later date, so a clock set back resets the count.
  - Name both.
- [ ] FINDING minor openspec/changes/archive/2026-10-17-beemaps-frames-limits/proposal.md:9 (eefb43af) "the screen does not show them" is false for `credits.remaining`. The readout shows "credits left N" (src/layers/beemaps/model.js:31, scenario 018). Say "the credits used".
- [ ] FINDING minor openspec/changes/archive/2026-10-17-beemaps-frames-limits/tasks.md:3 (eefb43af) The new test `[beemaps-bursts-006] builds the box of 4 km²…` in src/layers/beemaps/box.test.mjs:152 has no task. So 006 gets two edits, not "one test … by a title or by one assertion" (proposal.md:36). The delta also splits the "Quote" box sentence in two and changes "of it" to "of the box", but proposal.md:29 says "one sentence". Add the task and correct both sentences.
- [ ] FINDING minor src/data/beemapsProxy.test.mjs:985 (eefb43af) The comment "so only the write of the budget file fails" is false. The cache folder is a file, so `readFile` gives ENOTDIR, budget.js:35-36 throws, and the READ fails. I did not check whether another test shows the write failure.

Note for review.md: your brief says 39 gaps. evidence/mutations.txt:29 says 36 (3+14+9+10). Use 36.

Checked, no finding:
- All 28 equivalent-fault reasons, and the automut survivor groups. The swap at beemaps.js:121 still answers the hold before the refusal.
- The D1 numbers.
- The carried scenarios (frames-017, bursts-006 to 011) match the base word for word.
- The box rows, including 79.5004, 60.165 and 47.59 at 180. This is hand arithmetic, so the last decimal is not proved.
- Every upstream request goes through `fetchFresh` and the credit check.
- The log lines carry no key, URL or frame.
- credits.js: date roll, shared first read, serial writes.
- Manifests and ledger.
