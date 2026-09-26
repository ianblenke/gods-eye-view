# How the lead handled the findings of round 2

Round 2 gave FAIL from both agents. The spec adversary gave F1 (major) and F2 to F7 (minor). The STE adversary gave S1 and S2 (major) and S3 to S25 (minor). The lead read each finding against the tree, the ledger and the code.

## Spec adversary

- F1 major: correct. The three files have adopt lines and gaps. The lead read the uncovered items in the coverage report: they are upstream code (the default `fetchImpl`, the check of an empty endpoint, the filter of the places, the route call, the branches for presets, and error paths of the catalog). The code of this change in these files is covered. The known limit `sync-files-edited-after-the-merge` says this, and D5 of the design names the three files for the diff.
- F2 minor: correct. The gates run of round 2 measured 184 lines for `src/data/lifecycle.js` and stopped with `LEDGER-LARGER-GAP`, because the ratchet had written 177. The known limits `sync-counts-change-between-runs` and `sync-hand-written-adopt-lines` say what the gates compare exactly and that the push to `main` uses the tolerance.
- F3 minor: corrected. The Impact says 7 files.
- F4 minor: corrected in `sync-third-geocoder-call`.
- F5 minor: corrected. The test of `osh-096` builds the layer through `createApplicationCatalog` and takes `osh-systems` from the catalog. Mutation C4 (the catalog builds the layer with no hosts) fails it.
- F6 minor: corrected. `sync-dropped-reverse-cache-test` names the catch, and `sync-test-names` says that the author renamed two tests. The lead names the rename in `review.md`.
- F7 minor: named as the known limit `sync-osh-005-file-list`.

## STE adversary

- S1 major: corrected with F1.
- S2 major: corrected in the scenario `credential-boundary-014` and in D3 of the design. The memory is for an answer that has no HTTP error status, has a Google status and gives no place, and the coordinate is rounded to four decimals.
- S3 to S25: corrected in the proposal, the design, the tasks and the specs. The changes include one name for the person, the terms "merge commit" and "merged commit", the split of the tasks, the mutation 5 of task 2.2 (mutation P5 fails the test), and the new test name of `osh-096`. S25: the proposal now says what 1002 counts (the files that the upstream branch changed since the shared commit).
