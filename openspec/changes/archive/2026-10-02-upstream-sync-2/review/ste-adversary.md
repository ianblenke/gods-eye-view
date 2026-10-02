Verdict: PASS

I read the round-3 diff, the archived `proposal.md`, `design.md` and `tasks.md`, and the three scripts. I did not run anything. I did not read the round-1 reports or the other ten QA scripts.

Checked and found correct:
- **QA purposes.**
  - `qa-admin-outlines.mjs:3` ("do not redraw while the camera does not move") fits `stableWhileStill` and the "no redraw when still" assertion.
  - `qa-alpr-journey.mjs:3` ("do not change while the camera does not move") fits the marker-stability and flicker checks with a still camera.
  - `qa-military-names.mjs:3` ("when the camera is close") fits the file's own comment "continent performance, close identities".
  - Each purpose is one sentence of 22 words or fewer.
- **Numbers.** 13 headers split as 12 `pending:` and 1 `unmapped:`, 83 scripts, 29 rows, 159 = 152 + 7, six mutations and four flaky files agree. The proposal lists four flaky files as sub-items, and the design lists six mutations.
- **Changed sentences.**
  - Each is 25 words or fewer and has no passive verb.
  - Each has at most 4 words of inline code, and no new -ing word or verb used as a noun.
  - The new merge-commit paragraph has 3 sentences and is clear.
  - The `sync2-count-flips` text, the mutation 2.6 sentence and task 3.2 keep their meaning. Task 3.2 agrees with `sync2-no-final-ratchet`.
  - `design.md:58` now agrees with `sync2-count-flips`.
  - The tasks.md line 11 instruction is correct for all six mutations.

Minor findings that do not block, if you want them corrected:
- [ ] FINDING minor proposal.md:49 "the ledger has 342" -> "the ledger holds 342". The same sentence group uses "holds" for the same thing in its next sentence.
- [ ] FINDING minor proposal.md:48 "The first sync had the same limit." -> "The first sync had the limit `sync2-count-flips`." "The same limit" needs the reader to find the earlier name.
