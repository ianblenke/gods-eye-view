Verdict: FAIL
- [ ] S232 major proposal.md "The CI run gave 141 not-covered lines for `src/data/manager.js` and 91 not-covered lines for `src/layers/flights/enrichment.js`." The CI run gave 83 not-covered lines for `src/layers/flights/enrichment.js`, and the local runs gave 91.
- [ ] S233 major proposal.md "The count band of 5 covers the CI counts above these high counts." No CI count is above the high count 88. The count above 88 is the local count 91.
- [ ] S234 minor proposal.md The sentence above the table is not true for the two rows with a hand count.
- [ ] S235 minor proposal.md "in the environment with the higher counts" — a CI run gives the error for `src/data/manager.js`, and a local run for `src/layers/flights/enrichment.js`.
- [ ] S236 minor proposal.md "must run the stability command again for the file" — the command has no option for one file.
- [ ] S237 minor proposal.md "Each gate run after this change compares the ledger with itself as the base" — write "After this change, the base of each gate run has this ledger".
- [ ] S238 minor design.md "The author wrote a lower high count and corrected the history line by hand." The sentence is about two files.

Notes:
- **Table rows, history, widths and band:** all agree with `openspec/trace/gaps.json` and `openspec/trace/history.jsonl`. 141 − 134 = 7 and 91 − 83 = 8; the band gives 144 and 93.
- **Changed file:** `compareCoverageEntry` uses the low count of the range, so the `range-slack` text is correct.
