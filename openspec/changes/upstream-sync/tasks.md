## 1. The specs

- [x] 1.1 Write the delta specs of `osh` and `credential-boundary`.
- [x] 1.2 Write proposal.md with the counts of the merge and the known limits.
- [x] 1.3 Write design.md with the merge rule, the OSH structure and the two upstream tests.

## 2. The tests

For each test below, run the named mutation. Report the test that fails in `review.md`.

- [x] 2.1 Change the test for `osh-033` to the token `3` and the 29 entries of the registry.
  - Mutation: give the OSH layer the token `4` in `src/data/layerState.js`. The test must fail.
- [x] 2.2 Change the test for `osh-094` to read the page with its expanded templates and the style sheets with their imports.
  - Mutation 1: rename the element `osh-panel` in `src/ui/templates/context.html`. The test must fail.
  - Mutation 2: remove the attribute `hidden` from that element. The test must fail.
  - Mutation 3: rename the element `osh-panel-video` in that template. The test must fail.
  - Mutation 4: rename the rule `.osh-panel[hidden]` in `src/ui/styles/osh-panel.css`. The test must fail.
- [x] 2.3 Write the test for `osh-095` in `src/app/layers/osh.test.mjs`.
  - Mutation 1: remove `createApplicationOsh()` from `src/app/constructCatalog.js`. The test must fail.
  - Mutation 2: move `createApplicationOsh()` before `createApplicationRecentImagery()`. The test must fail.
  - Mutation 3: build the layer two times. The test must fail.
- [x] 2.4 Write the test for `osh-096` in `src/app/layers/osh.test.mjs`.
  - Mutation 1: remove the hosts from the call of `createOshLayer` in `src/app/layers/osh.js`. The test must fail.
  - Mutation 2: give the layer a source that reads another route. The test must fail.
- [x] 2.5 Change the tests for `credential-boundary-014` to the provider `createHttpGeospatialProvider`, in `src/search/reverseGeocodeRoute.test.mjs`.
  - Mutation 1: add a key to the request URL. The test must fail.
  - Mutation 2: do not remember the answer `configured:false`. The test must fail.
  - Mutation 3: remember an answer with an HTTP error status. The test must fail.
  - Mutation 4: do not remember an answer that has a Google status and gives no place. The test must fail.
- [x] 2.6 Add `src/layers/osh/hosts.js` and `src/app/layers/osh.js` to the address scan of `[osh-034]`, and `src/sources/httpBody.js` to the scan of `[osh-005]`.
  - Mutation 1: put a real-looking address into `src/layers/osh/hosts.js`. The test of `osh-034` must fail.
  - Mutation 2: put the text of a request method that is not GET into `src/sources/httpBody.js`. The test of `osh-005` must fail.
- [x] 2.7 Keep the tests for `osh-028`, `osh-029`, `osh-030`, `osh-031`, `osh-032`, `osh-046`.
- [x] 2.8 Keep the tests for `osh-049`, `osh-057`, `osh-086`, `osh-087`, `osh-088`.
- [x] 2.9 Keep the tests for `osh-089`, `osh-093`, `credential-boundary-013`, `credential-boundary-015`.

## 3. The code

- [x] 3.1 Merge the upstream branch.
- [x] 3.2 Resolve the conflicts of the 32 files that both sides changed.
- [x] 3.3 Move the OSH panel to the template, and give the OSH layer the token `3`.
- [x] 3.4 Write `src/app/layers/osh.js`, and place the layer in the catalog until the tests of `osh-095` and `osh-096` pass.
- [x] 3.5 Write the server route calls in `src/search/http.js` and `src/search/defaults.js` until the tests of `credential-boundary-014` pass.
- [x] 3.6 Format the OSH files with the Prettier format of the upstream project.
- [x] 3.7 List the OSH modules in `scripts/package-boundaries.json`.
- [x] 3.8 Move `createOshPanelHosts` to `src/layers/osh/hosts.js`.
- [x] 3.9 Clear the timer in the helper `within` of `src/sdr/controller.test.mjs`.
- [x] 3.10 Raise the ceiling of the ingestion test in `server/providers/transitHistory.test.mjs` to ten seconds.
- [x] 3.11 Restore the upstream test of the ALPR layer in `src/voice/gevActions.test.mjs`.
- [x] 3.12 Correct the text of `docs/CURRENT-STATE.md` about the search and the reverse lookup.

## 4. Gates and review

- [x] 4.1 Run `make adopt CHANGE=upstream-sync FROM=b210ab0fe4d71c7faa0268134e0aa5f3c53fc7fe`.
- [x] 4.2 Run the command `waive` for each file that the command `adopt` did not adopt, if there is one.
- [x] 4.3 Run `make ratchet CHANGE=upstream-sync`.
- [x] 4.4 Run `make lint`.
- [x] 4.5 Correct each STE error.
- [ ] 4.6 Run `make gates CHANGE=upstream-sync`. The only errors must be review errors.
- [ ] 4.7 Run the review with `/opsx:review upstream-sync`.
- [ ] 4.8 Write `review.md`.
