Verdict: PASS
Tip b595fd00. I checked each new sentence of the diff against the order of the steps in `confirmLocked` (`beemaps-burst.js:219-339`) and against the test body. I ran nothing. There is no critical and no major finding. There are two minor findings.

- [ ] FINDING minor openspec/specs/beemaps-burst-control/spec.md:138 (b595fd00) Two weak wordings in scenario 013.
  - Line 138 starts with "it also gets", and the pronoun can refer to "a created burst" or "log_failed" from line 137. Write "the same quote with a new idempotency key also gets `quote_expired` after budget_unavailable and after a failed write of the "pending" record" (22 words).
  - Line 139 says "a hold can start". The hold always starts after a 401, 402, 403 or 429 and after an unknown outcome: `startHold` sets it and `ledger.find` gives `holdSeconds`. "can" makes the start look optional, and "that hold" in line 140 then points at a possible hold. Write "a hold starts after a refusal 401, 402, 403 or 429, and after an unknown outcome". The archived delta has the same lines at 138-140 (line 49 of the diff).
- [ ] FINDING minor openspec/specs/beemaps-burst-control/spec.md:261 (b595fd00) "works" in "a confirm with the key and the quoteId of the record works after the quote has expired" is a vague verb. Write "gets the answer of the record after the quote has expired". This is true: `ledger.find` comes before `quotes.take`. Scenario 028 line 277 says "that key and its quoteId", and "its" can read as the new plugin's. Write "that key and the quoteId of its record".

Closed from round 3, checked in the files:
- **Time bound of the hold line:** the lines at 139-140 name the start and the time bound.
- **"Then come hold, ...":** it is now "The next steps are hold, quote, budget, audit line, record of the attempt and upstream request."
- **Scenario 013, the list of outcomes:** it is true against the code.
  - A failed read of the ledger leaves the quote alive (`ledger.find` runs before `quotes.take`).
  - A failed write of the "pending" record (`ledger.begin`) comes after the quote is taken.
  - So the failed write is correctly in the list, and `ledger_unavailable` as a whole is correctly out of it.
  - The test case with the failing ledger write (`beemapsBurstProxy.test.mjs:2469`) agrees.
- **D8, Goals and D2:** D8 and the history line at `mutations.txt:35` are corrected. Goals says "each idempotency key" and D2 says "the API key".
- **Counts:** the history line at `mutations.txt:35` matches the test. The evidence counts are unchanged: 1201 faults, 15 equivalent, 2 hangs, 3 test files that stop.

Still open and not repeated, kept by name in your dispositions: the bare "key" in the code comment (`beemaps-burst.js:33-34`) and in the two test titles (`beemapsBurstProxy.test.mjs:793` and `:2469`). That is my round-3 minor 1.

Checked, no finding: there is no banned word in the diff, and the longest changed sentence has 22 words.

Not checked: any run, and the second fault run (only the first run's lines are in the file).
