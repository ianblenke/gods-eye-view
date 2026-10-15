# Review: beemaps-source

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-15
Gates: make gates CHANGE=beemaps-source passed
Rounds: 1
Scope: full
Reviewed-Tree: 056d90a571ae4712703b16311238cd38e14d8fe760f7cce7137081940b522468

## Findings

The reports of round 1 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.

The first message of the STE adversary stopped in the middle of a line. The reviewer sent the rest as a second message. The file joins the two messages at the line "The comments of `validate.js` and `normalize.js` are plain".

The review agents of this session are the teammates `cp-spec-adversary` and `cp-ste-adversary`. They do the task of `spec-adversary` and `ste-adversary`. The brief of each review gave the severity rule of the owner, and the reports follow that rule.

Two reviews of the plan and three reviews of the whole change ran before the ratchet and before round 1. They are listed in the last section. Tasks 4.2 to 4.4 stay open in `tasks.md`, as in the earlier changes.

The ratchet gave one error only, REVIEW-MISSING. It wrote one history line for the shared file `src/sources/rateLimit.js`. The branch total of that file changed from 17 to 18 because the provider uses it, and its gap did not change.

Verdicts (spec adversary / STE adversary): round 1 PASS / PASS.

### Round 1 (scope full) - PASS / PASS

- [x] FINDING minor (spec-adversary) No Known limit named the Docker bridge network. Corrected: the Known limit `container-network` in `proposal.md`, and two lines in `.env.example`.
- [x] FINDING minor (spec-adversary) The test of the scan names the five provider files, and scenario 015 does not say so. Recorded as the Known limit `file-list-pin`. The pin stays on purpose, because a new provider file must pass the scan of the URLs and of the word "burst".
- [x] FINDING minor (spec-adversary) Five parts of the code had no named fault. Corrected: five faults in `evidence/mutations-round2.txt`, run twice with identical lines. No fault survived.
- [x] FINDING minor (ste-adversary) The normative text of the spec has passive voice in about 16 lines. Accepted by the lead: a change of a scenario costs another ratchet, and the lint gives warnings and no error. Each of these sentences has one meaning.
- [x] FINDING minor (ste-adversary) `design.md` and `proposal.md` have one verb used as a noun and several passive sentences. Corrected with the text of the reviewer.
- [x] FINDING minor (ste-adversary) The Known limit `no-failure-hold` named two failures only. Corrected: the text now names each failure that starts no hold. I checked it against `startHold` in `beemaps.js`.
- [x] FINDING minor (ste-adversary) Three test titles use the passive voice, and two use `toISOString`. Accepted by the lead: a title is a traced test name, and a new name needs another ratchet.

### Plan reviews and pre-reviews, before the ratchet

- [x] FINDING major (both, plan review 1) Twelve majors in the first plan, 26 scenarios. The credits and the terms were stated wrongly. The list of the checks left out the hold. The field `truncated` and the text of the `id` hash had two meanings. The area, the global rate limit, the spend control and the form of the time and position fields were not exact. Corrected in plan v2 with 28 scenarios. I read the public API description once, without a key, and wrote its hash and date in `evidence/api-description.txt`.
- [x] FINDING major (both, plan review 2) The text of the area formula had two meanings, and design D3 contradicted scenario 017 about a file that is not there. Corrected in plan v3. The reviewer's text for the answer during a hold was not taken: it would add `retryAfter` to answers whose tests pin them without it.
- [x] FINDING minor (both, plan review 2) Several minor findings. Corrected or recorded as Known limits: the sources of the statuses 402 and 429, the form of the time text, the date in the budget file, the day change, and the 502 answers that start no hold.
- [x] FINDING major (lead, own checks) A stream error while the route reads the body would stop the dev server. The OSH control route has the same loop and is not changed here. Corrected: the provider answers `bad_body`, with a test in two files.
- [x] FINDING major (lead, own checks) The first run of the faults had 16 survivors out of 306. Two are equivalent faults. Corrected for the other 14: tests with millisecond boundaries, tests whose bad item has its own position, a test of the stored answer that can fail, and literal cases. One check of the calendar test had no use and was removed.
- [x] FINDING major (ste-adversary, pre-review 3) Rule 13: the tests 013, 015, 023 and 001 had no named fault. Corrected: 18 faults for the leak of the key, the second URL, the word "burst" and the registration in `local.js`.
- [x] FINDING major (ste-adversary, pre-review 4) The word "optional" in scenario 025 had two meanings. Corrected with the text of the reviewer, which matches the pattern in `normalize.js`.
- [x] FINDING major (spec-adversary, pre-review 4) The sentence "No source names the answer 401" was false: the description names it for the path `/mcp`. Corrected after I read the copy of the description. The text is not the one that the reviewer suggested.
- [x] FINDING minor (both, pre-reviews 3 to 5) Many minor findings. Corrected: 16 more faults for the order of the checks, the time form, the key read at each request, bytes and not characters, and the refunds. Two tests run for six kinds of failure. The Known limit `local-programs` was added.
- [x] FINDING minor (spec-adversary, pre-review 5) Five minor findings. Corrected: a test that a refused call adds nothing, a repeat before the hold ends, two more faults, no check of the text BEEMAPS in `define`, and the wording of `no-failure-hold`.
- [x] FINDING minor (ste-adversary, pre-review 5) The Known limit `no-failure-hold` used an -ing word. Corrected.
