Verdict: PASS
- [ ] F1 minor proposal.md The limit `ci-samples` says that the author must run the stability command again. With the two hand-written high counts, that instruction stops the build: `stabilityLedger` writes back 134 to 141 and 83 to 91, and `compareWithBase` then gives `LEDGER-UNSTABLE-TOO-WIDE`. Name this in `ci-samples` or in `deterministic-tests`.
- [ ] F2 minor proposal.md "The samples are two local runs and the CI run of the pull request" — the cache holds one CI run and more local runs, and each gate run adds a sample.

Notes:
- **Check 1 passes.** All seven range entries agree with their `unstable` history lines, and `gaps.json` is byte-identical to the output of `writeLedger`.
- **Check 2 passes.** `compareWithBase` with this ledger as its own base gives 0 errors. `compareLedger` gives 0 errors and 0 stale entries for the CI samples and for each local run.
- **Check 3 passes.** Of 460 coverage entries, only the high line counts 139 and 88 are values that no run measured. Both are below the measured maxima, so each use of the high count becomes stricter. The low counts are the measured minima, so a changed file gets no extra slack.
- **Check 4 passes** on the text on disk after the corrections.
