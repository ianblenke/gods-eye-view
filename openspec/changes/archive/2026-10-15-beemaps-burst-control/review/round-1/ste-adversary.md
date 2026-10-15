Verdict: PASS
Tip fb23c4c1. I read the archived change, the capability spec, the seven code files, the test titles, the three evidence files, `CHANGELOG.md` and `DATA_SOURCES.md` by hand against the code and the saved description. I ran nothing. There is no critical and no major finding. The five minor findings are below.

- [ ] FINDING minor server/providers/beemaps-burst.js:32-34 (fb23c4c1) The sentence "The steps of a confirm, in order: method, ... upstream request." has 28 words (limit 25). Write "The steps of a confirm run in this order. They are: method, local request, rate limit, flag, key, body, busy, idempotency key, hold, quote, budget, audit line, record of the attempt, upstream request." The second sentence has 24 words, the same list as design.md D3.
- [ ] FINDING minor DATA_SOURCES.md:101 (fb23c4c1) The paragraph has 7 sentences (limit 6). Start a new paragraph at "An answer that does not clearly say". "holds every confirm" uses the verb "hold" as "block", and the spec and design now say "refuses". Write "refuses every confirm for 600 seconds". The test titles at beemapsBurstProxy.test.mjs:1257 and :1323 ("holds every confirm") have the same fault. The same word also means "contains" (beemapsBurstScan.test.mjs:50,69,77; beemaps-burst.js:118; audit.js:51). Write "contains" there.
- [ ] FINDING minor CHANGELOG.md:3 (fb23c4c1) The entry has 8 sentences (limit 6). Merge the sentences "A quote checks a box and spends nothing" and "A confirm of that quote sends one create request and never retries" with "and". Merge the sentences about the daily file and the audit line the same way (25 words). "The credits count in a daily file" can be read as "the credits matter". Write "The plugin counts the credits in a daily file before the send".
- [ ] FINDING minor openspec/specs/beemaps-burst-control/spec.md:255 (fb23c4c1) "key" has two meanings. "The check of the key comes before the check of the quote" can read as the API key step, which is also before the quote step (line 64). Scenarios 025 and 027 (lines 244 and 252) use "key" for the idempotency key. Write "the check of the idempotency key". The archived delta has the same text at the same offset.
- [ ] FINDING minor proposal.md:3 (fb23c4c1) There are -ing words and verbs used as nouns: "mapping" (proposal.md:3), "missing" (proposal.md:47; spec.md:277 "a missing file"), "closing line" (beemapsBurstProxy.test.mjs:2189,2202; the spec says "second line"), "neighbouring" (:539,:1687), and "reserves" as a noun (beemapsBurstCredits.test.mjs:107,128,216). Write "A request to map an area again costs money", "a file that does not exist", "second line", "neighbours" and "calls of reserve".

Checked, no finding:
- **Banned words:** there is none in the prose, the spec, the tasks or the test titles.
- **Sentence limits:** every other sentence, paragraph and task is within the limits.
- **Spec against the code:**
  - Every error name, status, limit and the 15 audit reasons match the files.
  - The hold, replay and Retry-After rules match `beemaps-burst.js`, `ledger.js` and `upstream.js`.
  - I recomputed six area literals by hand and they are right (0.0997, 0.0994, 5.0003, 5.000506, 0.0995001 and 0.0989).
- **Evidence counts against the logs:**
  - There are 1167 fault lines, 15 equivalent faults, 2 hangs and 3 test files that stop with no scenario tag.
  - There are 208 test titles, matching `tests 208` in `host-checks.txt`.
  - The `local-run.txt` raw output is consistent: 7 audit lines, 3 upstream requests, 250 credits, and a Retry-After of 539 after 61 seconds of the 600-second hold.
- **Equivalent faults:** the reasons of the 15 equivalent faults are true. I checked the rate-limiter fault with the invariant "never more than max entries", and the Retry-After and header faults with inputs.
- **Known limits:** the Known limits match the saved description and the scout record (`llms-full.txt` gives 400, 402, 403 and 429; version 1.0.0 gives 402 and 429).
- **Commits and tasks:**
  - The code commit 74fe7431 is the last commit that changed `src` or `server`; the later commits are docs, evidence and trace commits.
  - Task 2.9 and the manifests match the files.
  - All 40 IDs are named in full in the tasks.

Not checked: any run, the script `limiter-check.mjs` (it is outside the repository), the real `llms-full.txt`, and the claim that the second fault run differs from the first in one line (only the first run's lines are in the file).
