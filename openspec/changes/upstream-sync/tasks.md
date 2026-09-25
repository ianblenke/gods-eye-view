## 1. The specs

- [ ] 1.1 Write the delta specs of `osh` and `credential-boundary`.
- [ ] 1.2 Write proposal.md with the counts of the merge and the known limits.
- [ ] 1.3 Write design.md with the merge rule, the OSH structure and the two upstream tests.

## 2. The tests

For each test below, run the named mutation, and report the test that fails in `review.md`.

- [ ] 2.1 Change the test for `osh-033` to the token `3` and the 29 entries of the registry.
  - Mutation: give the OSH layer the token `o` in `src/data/layerState.js`. The test must fail.
- [ ] 2.2 Change the test for `osh-094` to read the page with its expanded templates and the style sheets with their imports.
  - Mutation 1: remove the element `osh-panel` from `src/ui/templates/context.html`. The test must fail.
  - Mutation 2: remove the attribute `hidden` from that element. The test must fail.
  - Mutation 3: remove the rule `.osh-panel[hidden]` from `src/ui/styles/osh-panel.css`. The test must fail.
- [ ] 2.3 Write the test for `osh-095` in `src/app/layers/osh.test.mjs`.
  - Mutation 1: remove `createApplicationOsh()` from `src/app/constructCatalog.js`. The test must fail.
  - Mutation 2: move `createApplicationOsh()` before `createApplicationRecentImagery()`. The test must fail.
  - Mutation 3: build the layer two times. The test must fail.
- [ ] 2.4 Change the tests for `credential-boundary-014` to the provider `createHttpGeospatialProvider` in `src/search/reverseGeocodeRoute.test.mjs`.
  - Mutation 1: add a key to the request URL. The test must fail.
  - Mutation 2: do not remember the answer `configured:false`. The test must fail.
  - Mutation 3: remember an answer with an HTTP error status. The test must fail.
- [ ] 2.5 Keep the tests for `osh-028`, `osh-029`, `osh-030`, `osh-031`, `osh-032`, `osh-046`.
- [ ] 2.6 Keep the tests for `osh-049`, `osh-057`, `osh-059`, `osh-086`, `osh-087`, `osh-088`.
- [ ] 2.7 Keep the tests for `osh-089`, `osh-093`, `credential-boundary-013`, `credential-boundary-015`.

## 3. The code

- [ ] 3.1 Merge the upstream branch and resolve the conflicts.
- [ ] 3.2 Move the OSH panel to the template, and give the OSH layer the token `3`.
- [ ] 3.3 Write `src/app/layers/osh.js` and place the layer in the catalog until 2.3 passes.
- [ ] 3.4 Write the server route calls in `src/search/http.js` and `src/search/defaults.js` until 2.4 passes.
- [ ] 3.5 Clear the timer in the helper `within` of `src/sdr/controller.test.mjs`.
- [ ] 3.6 Raise the ceiling of the ingestion test in `server/providers/transitHistory.test.mjs` to ten seconds.

## 4. Gates and review

- [ ] 4.1 Run `make adopt CHANGE=upstream-sync FROM=b210ab0fe4d71c7faa0268134e0aa5f3c53fc7fe`.
- [ ] 4.2 Run the command `waive` for each file that the command `adopt` did not adopt, if there is one.
- [ ] 4.3 Run `make ratchet CHANGE=upstream-sync`.
- [ ] 4.4 Run `make lint`, and correct each STE error.
- [ ] 4.5 Run `make gates CHANGE=upstream-sync`. The only errors must be review errors.
- [ ] 4.6 Run the review with `/opsx:review upstream-sync` and write `review.md`.
