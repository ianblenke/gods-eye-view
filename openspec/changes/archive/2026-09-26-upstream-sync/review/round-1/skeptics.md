# How the lead handled the findings of round 1

Round 1 gave FAIL from both agents. The spec adversary gave F1 to F4 (major) and F5 to F12 (minor). The STE adversary gave S1 to S4 (major) and S5 to S30 (minor). The lead read each finding against the tree, ran the checks with Git and ran the mutations.

## Spec adversary

- F1 major: the test that checked the own cache of the fork in `src/voice/gevActions.js` does not apply to the cache of the upstream project. Named as the known limit `sync-dropped-reverse-cache-test`, and D3 of the design says "13 tests moved" and names the 14th test.
- F2 major: correct. The hand resolution dropped the upstream test of the ALPR layer. The lead compared all test names of the upstream branch with the tree and found only this one test. It is restored, and the ledger gets the adopt run again. The known limit `sync-hand-merged-files` names `src/voice/gevActions.js`.
- F3 major: correct. The new scenario `osh-096` and its test give a fake page and a fake fetch to `createApplicationOsh()`, click a system, and assert the panel and the detail. Mutations O1 (remove the hosts) and O2 (another source) fail it.
- F4 major: correct. `src/layers/osh/hosts.js` and `src/app/layers/osh.js` are in the address scan, and `src/sources/httpBody.js` is in the scan for methods that are not GET. Mutations Y1 (a real-looking address in `hosts.js`) and Y2 (the text `POST` in `httpBody.js`) fail the scans.
- F5 minor: named as the known limit `sync-test-names`.
- F6 minor: named as the known limit `sync-ceiling-not-measured`, and the design says "catches a gross regression only".
- F7 minor: corrected in `docs/CURRENT-STATE.md` and in the comment of `src/ui/templates/context.html`.
- F8 minor: corrected. The Impact has the closed gaps, and the known limit `sync-hand-merged-files` has the exact list.
- F9 minor: named as the known limit `sync-share-token`.
- F10 minor: named as the known limit `sync-third-geocoder-call`.
- F11 minor: corrected. See F4.
- F12 minor: the lead checked the file. It has the content of the base commit, and its not-covered lines fell from 83 to 21. The tests of the upstream project load it now, and V8 counts 29 branches and no more 2. Named as the known limit `sync-more-branches-in-unchanged-files`.

## STE adversary

- S1 to S4 major: corrected in the proposal and in the design (one name for the person, the three conditions of `adopt`, the rule of the remembered answer with a Google status). Two tests of `credential-boundary-014` said "gives no place" for a call that rejects. The lead renamed these two tests. This is a rename of a test that exists on `origin/main`, and the owner decides if it stays. The scenario has a new line for the answer with a Google status and no place, and mutation R6 fails the test.
- S5 to S30 minor: corrected in the four documents and in the specs. S26 is the known limit `sync-test-names`. S9 and S10 changed the scenario text (`the life of the provider`, the fields of the place). The names of the tests with the old words stay.
