Verdict: PASS
Tip 98094929. I read the diff since 03caafb4 and the files it touches against the code and the git log. I ran nothing. There is no critical and no major finding. Both round-2 majors are closed, and the three round-2 minors are closed too, except for the leftover bare "key" in minor 1 below. There are three minor findings.

- [ ] FINDING minor openspec/changes/archive/2026-10-15-beemaps-burst-control/design.md:29 (98094929) "key" is still bare in a few places where it has two meanings. D2 says "an idempotency key" and then "the flag, the key, the hold" (the API key), and D3 now says "API key". D8 ends with "the same quote with a new key" (line 53). Goals says "a record for each key" (line 13), and the step list in the code comment (`beemaps-burst.js:33-34`) says "flag, key, body". Two test titles (`beemapsBurstProxy.test.mjs:793` and `:2469`) say "with a new key". Write "the flag, the API key, the hold" and "a new idempotency key". The first title becomes 24 words and the second 21, both within the limit. Each sentence is true under both meanings, so this stays minor.
- [ ] FINDING minor openspec/specs/beemaps-burst-control/spec.md:138 (98094929) "after a refusal 401, 402, 403 or 429, or an unknown outcome, that confirm gets the hold of scenario 029 or 040" has no time bound. After the hold ends the same confirm gets `quote_expired` (test 793 at 601 seconds). Write "that confirm gets the hold of scenario 029 or 040 while the hold lasts, and `quote_expired` after it". This follows the code order (`beemaps-burst.js:228-257`, then the quote step). The archived delta has the same line at 211.
- [ ] FINDING minor openspec/changes/archive/2026-10-15-beemaps-burst-control/design.md:33 (98094929) The new sentence "Then come hold, quote, budget, audit line, record of the attempt and upstream request" puts the verb before the subject, which STE avoids. Write "The next steps are hold, quote, budget, audit line, record of the attempt and upstream request."

Closed from round 2, checked in the files:
- **Scenario 013:** it now says "when no hold answers first" and lists the outcomes that give `quote_expired`. The list matches the code (hold before quote). Created, 400, `budget_used`, `log_failed`, `ledger_unavailable` and `budget_unavailable` start no hold.
- **D14:** it now says the record keeps the state it has when the error comes. This agrees with the 001 bullet, the Known limit and the test.
- **Holds requirement:** it now says "a new idempotency key" and "the API key". Scenario 031 says "a repeat of a key with the quoteId of its record gets no line", and `key_reused` gets a line, as in the code.
- **Scenario 001:** it now says "an error that nobody expects".
- **Ledger test title:** it now says "a file that does not exist" (25 words).

Checked, no finding:
- **Evidence counts:** the mutation file has 1201 fault lines, 15 equivalent faults, 2 hangs and 3 test files that stop; 1186 + 15 = 1201.
- **Evidence statements and commits:**
  - The statement "after the runs, 1 test title changed" matches commit 49c0b5d5, the last commit that changed `src`.
  - The 029 title now has 21 words.
  - The round-2 prose in `mutations.txt` matches the diff.
- **Docs and Known limits:** DATA_SOURCES.md says "idempotency key". The `hold-ends` Known limit says "idempotency key".
- **Banned words:** none in the diff.

Not checked: any run, and the second fault run (only the first run's lines are in the file).
