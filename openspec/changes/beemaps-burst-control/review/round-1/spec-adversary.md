Verdict: FAIL

Tip fb23c4c1 (gev-work/beemaps-burst-control). Money path beemaps-burst.js:219-339 has no send without quote, flag, key, budget, audit line and pending record, and no retry. The majors are test, fault and text gaps.

- [ ] FINDING major mutations.txt:7 [fb23c4c1] The first-column claim is false for lines 567 (018) and 669 (035): only an untagged file failed. Name both lines, or add a tagged failing test (rule 13).
- [ ] FINDING major beemapsBurstProxy.test.mjs:1499 [fb23c4c1] 031 needs a blocked line for each refusal after the rate limit. Asserted only for burst_off, no_key, bad_body, quote_expired, budget_used, refusal hold, log_failed. Not for busy (beemaps-burst.js:367), key_reused (224), outcome hold (244), budget_unavailable (270), ledger_unavailable (222, 278); site faults only at mutations.txt:864, 868, 880.
- [ ] FINDING major beemapsBurstProxy.test.mjs:775 [fb23c4c1] 013 "uses it up ... every outcome" is not asserted for the plugin: lines 784-788 and 797-801 reuse the quote after 239999 and 601000 ms (life 120 s), so an unspent quote gives the same 410. Add same-quote, new-key confirms inside 120 s after created, 400, budget_used and log_failed, and a fault that returns the quote.
- [ ] FINDING major mutations.txt:803 [fb23c4c1] 032 has no fault on its leak paths: none copies the key, a Bee Maps body or header, or a fetch error text into an answer, record or console line (only 803-804, 990-991). 006 "does not read the body" has none. Add and run them.
- [ ] FINDING major beemapsBurstProxy.test.mjs:604 [fb23c4c1] 007 pair hold/quote uses only the refusal hold. Nothing pins the outcome hold (beemaps-burst.js:243) before the quote step: send a never-given quoteId during it (expect 409 held). No Move fault for method/local or quote/budget.
- [ ] FINDING major archive spec.md:281 [fb23c4c1] "MUST refuse each confirm until a hold ends" (also :287, proposal.md:14, design.md:53, DATA_SOURCES.md:101) has two meanings: a replay of a created or refused key is answered during a hold (beemaps-burst.js:223-227). Write "each confirm with a new idempotency key", as 040 does.
- [ ] FINDING major proposal.md:44 [fb23c4c1] refusal-sources is false: the 1.3.0 description lists 401 for /mcp (openapi-2026-10-15.json:932). Bound the 1.3.0 and 401 sentences to the create call.
- [ ] FINDING major proposal.md:32 [fb23c4c1] "one upstream request for each confirm" is false for local-run.txt steps 5, 6, 7, 12 (no request). Write "each confirm that passes every step".
- [ ] FINDING minor proposal.md:34 [fb23c4c1] No Known limit for two plugin instances or processes on one cache folder: each keeps its own lock, budget and ledger copy (credits.js:81-86, ledger.js:115-126).
- [ ] FINDING minor design.md:77 [fb23c4c1] internal_error after the send ("can have spent") is in no scenario, test or Known limit; Proxy tests 2090 and 2121 fail before the send.
- [ ] FINDING minor archive spec.md:268 [fb23c4c1] "a repeat gets 026, a new key 040" has no scope: say "in that new plugin" (test 1922 restarts; the same plugin replays 200, ledger.js:179-183).

Checked: spec, 7 code files, 8 tests, all 1167 fault lines (15 equivalents hold), local-run, host-checks, trace, ownership, gate log. Not checked: runs, git history after 74fe7431, llms-full.txt, v1.0.0 text.
