# How the lead handled the findings of round 1

Round 1 read the whole change. Both agents ran as read-only `codex` runs with the model `gpt-6-sol`. The spec adversary gave FAIL with F1 to F3 (critical), F4 (major) and F5 and F6 (minor). The STE adversary gave PASS with F1 to F4 (minor). The lead checked each finding against the tree at commit `c5549fb`.

## Spec adversary

- F1 critical: correct. The test `[perimeters-017] a property can mark a page limit` gave an empty page, so it passed even if the proxy ignored the transfer-limit property. Corrected: the test now gives one feature and asserts one page when the property is `false` and five pages when it is `true` (the real direction: `true` continues paging, confirmed by reading `server/providers/firePerimeters.js:82`). Scenario `perimeters-017` is narrowed to state only what its own tests prove; the caching claims moved out belong to scenarios `perimeters-020` and `perimeters-021`, which already state and test them.
- F2 critical: correct. Scenario `perimeters-018` claimed a numeric page, its cache and an unsafe redirect, but its own tests check only the index route. Narrowed to the index case; the other claims are already covered by `perimeters-024`, `perimeters-025` and `perimeters-027`.
- F3 critical: correct. The test `[perimeters-019] a reply on a closed client has no body` set `reply.destroyed = true` as input and asserted the same field, proving nothing. Corrected: the fake reply now tracks `writeHead`/`end` calls with flags, and the test asserts both flags stay `false`.
- F4 major: REJECTED. The finding says that prepending a scenario tag to an old test's existing name is a forbidden rename. `AGENTS.md` rule 3 and `openspec/config.yaml` require every traced test's name to start with its scenario tag, and this is the same tagging mechanism the merged changes `backfill-cyclones` and `backfill-live-sources` already used and both reviewers of those changes accepted. The lead compared every old test name in the six affected files, before and after the tag, and found zero wording changes beyond the tag: `src/data/firePerimetersProxy.test.mjs` (16), `cards.test.mjs` (9), `inciweb.test.mjs` (9), `ownership.test.mjs` (15), `records.test.mjs` (7), `source.test.mjs` (5). No test name changed beyond its required tag.
- F5 minor: not a defect. The error `REVIEW-MISSING` is the reason for the review.
- F6 minor: the STE warnings on old test names are the same class as F4: the tag is required, and the old wording under it does not change. No correction needed beyond the STE adversary's own minor findings, which are corrected below.

## STE adversary

- F1 and F2 minor: corrected in `specs/perimeters/spec.md` ("the page age check", "after the layer stops or ends").
- F3 and F4 minor: corrected. Both are new tests in this change, so renaming them is allowed: "too many distinct page requests give a busy status" and "a POST request gets a method error".
