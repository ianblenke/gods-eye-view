Verdict: PASS
- [ ] S245 minor proposal.md "The next bullet gives more counts of the runs." Approved words. "bullet" is not an approved STE word for an item of a list. Write: "The next item gives more counts of the runs."
- [ ] S246 minor proposal.md "the gate compares the counts with the low count of the range" Articles and nouns. Write: "the gate compares each not-covered count with the low count of its range".
- [ ] S247 minor design.md "found this for six files ... found it for seven files" One word, one meaning. Write: "found different counts for seven files".
- [ ] S248 minor design.md "Runs on the current tree, with samples from the local runs and from one CI run" One word, one meaning. Write: "The five runs on the current tree, four local runs and one CI run, found ...".
- [ ] S249 minor proposal.md "The author must then make the tests of that file give the same counts in each run." The sentence gives a necessary action, not a sufficient one. Write: "... give the same counts, at most the low count, in each run."

Notes:
- **Samples:** 2900 records, 580 files with 5 runs each, and each hash matches the working tree. One CI run gives 141 and 83; the four local runs give 134 and 91.
- **Seven files** have counts that differ between the runs, and they are the seven files of the table. For `manager.js` and `enrichment.js`, only the high count of the not-covered lines is hand-written.
- **Widths:** 7 and 8 are above the limit of 5, and the written ranges are exactly 5 wide.
- **`compareLedger`:** for an unchanged file the band accepts 141 and 91 with no error and no stale entry. For a changed file the low counts 134 and 83 give `LEDGER-LARGER-GAP`.
- All four corrections (S239 to S244) hold against the data and the code.
