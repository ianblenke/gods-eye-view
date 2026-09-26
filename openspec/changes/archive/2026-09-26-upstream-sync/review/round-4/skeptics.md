# How the lead handled the findings of round 4

Round 4 was a narrow confirmation round after the major findings of round 3. Both agents gave PASS. The spec adversary gave F1 to F4 (minor) and the STE adversary gave S1 to S14 (minor).

## Spec adversary

- F1 minor: correct. The history has `smaller` lines for 9 files, and three of them (`ais-store.js`, `labelArbiter.js`, `lifecycle.js`) are counts that change between runs. The Impact says 9 files and names the three. `sync-hand-written-adopt-lines` says that the author set the entry of `lifecycle.js` by hand before each ratchet run.
- F2 minor: correct. The reviewer named two mutations that survived: a key built from the latitude only, and a key with the latitude twice. The test of `credential-boundary-014` now calls the provider with the same latitude and another longitude, and asserts three fetches. Mutation R9 (a key from the latitude only) fails it. Task 2.5 has the new Mutation 7.
- F3 minor: corrected. The sentence says "tests cover the code of this change in these files".
- F4 minor: corrected. Task 4.6 names the four files with counts that change between runs, and says an error for any other file stops the build.
- Not a finding: the clause `!place &&` in `src/search/http.js` has no test of its own. The lead names this in `review.md`, and does not change the known limits.
- Not a finding: `design.md` said that the proposal names three roles. It names two. Corrected in `design.md`.

## STE adversary

- S1, S2, S4, S6, S7, S8, S9, S10, S11 and S14: corrected in the proposal, the design and the tasks. The wording of the fixes follows the suggestions, and "the tree of the merge commit" replaces "the clone".
- S3: corrected. Two roles remain: the owner and the author of this change. The owner accepts this change on `main`.
- S5: corrected. "Request" is the word for the network, and "call" is the word for a function.
- S12 minor: "decimals" in the line of `credential-boundary-014` about the rounding. It needs a change of the text of a scenario, so it needs a new ratchet and a new round. Kept. Accepted by Ian Blenke on 2026-09-25.
- S13 minor: the name of the new test says "the same four decimals". It needs a change of the test name and of `links.json`, so it needs a new ratchet and a new round. Kept. Accepted by Ian Blenke on 2026-09-25.
