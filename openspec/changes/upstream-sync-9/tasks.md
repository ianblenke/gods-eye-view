## 1. Plan, merge and fork edits

- [x] 1.1 Write the change plan.
- [x] 1.2 Merge the upstream commit.
- [x] 1.3 Resolve the conflicts by the decisions of `design.md`.
- [x] 1.4 Commit the merge.
- [x] 1.5 Give the layer `s2-ghostmaps` the token `03` in the registry and in the ledger.
- [x] 1.6 Update the token tests and the catalog tests for 40 layers and 41 catalog layers.
- [x] 1.7 Write the 20 Chinese texts and remove the stale text in `zh-CN.json`.
- [x] 1.8 Add the block for `GITHUB_TOKEN` to `.env.example`.
- [x] 1.9 Remove the compose test from `src/dockerTrustedPeers.test.mjs`.
- [x] 1.10 Change the CSS selector in `overlays.css` and add the plugin to `standalonePlugins()`.
- [x] 1.11 Update the cyclone tests, the wind test and the Recent Imagery test.
- [x] 1.12 Put `s2-ghostmaps` before `gdacs` in the panel group Events.
- [x] 1.13 Change the test of `osh-033`.
- [x] 1.14 Keep the tests for `osh-028`, `osh-029`, `osh-030`, `osh-031`, `osh-032`, `osh-046`, `osh-049` and `osh-057`.
- [x] 1.15 Change the test of `qa-scripts-023` to 106 QA scripts.
- [x] 1.16 Add `zh-CN.json` to the two packages of `scripts/package-boundaries.json` that list `ru.json`.
- [x] 1.17 Cancel the live timers of `globeResetConfirmation.test.mjs` and wait for one immediate in two more test files.
- [x] 1.18 Make the three timing tests measure CPU time.

## 2. Host evidence

- [x] 2.1 Run each test file on the host, except `src/tooling/spec/gates.test.mjs`.
- [x] 2.2 Run `src/tooling/spec/gates.test.mjs` on the host.
- [x] 2.3 Run the four checks of `make precheck` on the host.
- [x] 2.4 Run the lint on the host.
- [x] 2.5 Run `openspec validate --specs` on the host.
- [x] 2.6 Write `evidence/added-code.txt` and `evidence/adapted-files.txt`.
- [x] 2.7 Write `evidence/faults.txt` with the result of each fault.

## 3. Lead work before and in the image

- [x] 3.1 Check the second parent of the merge commit against the upstream remote.
- [x] 3.2 Run `make adopt CHANGE=upstream-sync-9 FROM=15de9d738c4a85be1a96726c6114181caef87eeb`.
- [ ] 3.3 Run `make ratchet CHANGE=upstream-sync-9`.
- [ ] 3.4 Run the two review agents.
- [ ] 3.5 Write review.md.
- [ ] 3.6 Run `make gates CHANGE=upstream-sync-9` on the final tree.
