Verdict: FAIL

Tip 03caafb4 (gev-work/beemaps-burst-control), diff since fb23c4c1. Closed: round-1 findings 2, 3, 5, 7, 8, 9, 11 and the Known limit of 10. Code changed only in comments. I read all 1197 labels: each target scenario is among its failing tests, except the 15 equivalents and lines 577 and 679. Still open or new:

- [ ] FINDING major archive spec.md:283 [03caafb4] The new sentence "A repeat of a key that has a record still gets the answer of its record" is false for a key with another quote: that gets 409 key_reused (027; beemaps-burst.js:224). "A repeat of a key" (line 231) has the same two meanings, and 031 (line 321) counts key_reused as a line. Write "A repeat of a key with the quoteId of its record still gets the answer of its record" (fits 024 to 027).
- [ ] FINDING major archive spec.md:131 [03caafb4] Lines 131 and 134 are false now that the hold comes before the quote step (283, 007): within 120 s a new-key confirm after 401, 402, 403, 429 or an unknown outcome gets the hold, not 410. The new test (Proxy 2469) says "not a hold". Write "when no hold answers first" at 131. At 134 replace "also after an unknown outcome" with "after created, 400, budget_used, log_failed, ledger_unavailable and budget_unavailable".
- [ ] FINDING major mutations.txt:1236 [03caafb4] Round-1 finding 4 is only partly closed: no fault reads the body before the local request check (006 "does not read the body", test Proxy 478). Disposition 4 does not name it. Add and run such a fault for quote, confirm and list.
- [ ] FINDING minor mutations.txt:7 [03caafb4] "The list further below names the exceptions" names 2 faults. The 15 equivalent faults also fail no test. Add them.
- [ ] FINDING minor Proxy test:1259 [03caafb4] Title "refuses every confirm for 300 seconds" lacks "with a new key". The 013 test at 793 ("after a refusal and after an unknown outcome") moves the clock 601 s, past the 120 s quote life, so it cannot show a used quote; retitle it.
- [ ] FINDING minor mutations.txt:1030 [03caafb4] Only the ledger hold has a Move fault before the replay. The refusal hold (pair key/hold, Proxy 597; the last sentence of Holds) has none.
- [ ] FINDING minor archive spec.md:15 [03caafb4] No fault in the guard can break the new sentence (the guard never touches the ledger). Only the finish-order faults (mutations.txt:1035, 1036, 1040, 1047) fail the test at Proxy 2578. Keep it as a pin of the order, or drop it.

Not checked: runs, git history, that no src or server file changed after d097f0b0.
