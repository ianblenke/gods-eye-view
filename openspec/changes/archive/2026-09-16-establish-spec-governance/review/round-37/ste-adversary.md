Verdict: FAIL
- [ ] S239 major design.md "Runs on the base `3ca81fb`, with samples from the local runs and from one CI run, found it for seven files." The runs were on the current tree, which has the base `3ca81fb`. Each sample has the content hash of the current file, and the samples contain the 16 files of `scripts/spec/`, which `3ca81fb` does not have.
- [ ] S240 major proposal.md "The author of that change must run the stability command again." `stabilityLedger` stops for a file that is not the base content, so that author cannot get a range from the command. Write: "The stability command stops for a file that is not the base content, so that author must make the tests of the file give the same counts in each run."
- [ ] S241 minor proposal.md "The kept samples are the CI run of the pull request and the local runs, all on the current tree." A sample is not a run, and the last part has no verb.
- [ ] S242 minor proposal.md "the table gives a high count that the author wrote by hand" — the row has more than one high count, and only the high count of the not-covered lines is the hand count.
- [ ] S243 minor proposal.md "The next bullet gives the counts of the runs." The next bullet gives three counts, and the table gives the other counts.
- [ ] S244 minor proposal.md "The count band of 5 covers the count 141 and the count 91" — the change uses "cover" for a test that covers code. The gate message uses "allows".

Notes:
- **Samples:** the cache has 5 samples for each of the 580 files: one CI run and four local runs. Every sample hash is the SHA-256 of the current file.
- **Bullet after the table:** each count agrees with the samples. The ranges are 7 and 8, `rangeLimit` gives 5 for both low counts, and the band gives 144 and 93.
- **`ci-samples`:** the CI job keeps its results for 7 days, and the samples file is outside that folder.
