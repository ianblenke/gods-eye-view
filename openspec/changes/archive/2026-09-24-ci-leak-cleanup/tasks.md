## 1. Diagnose before you fix

- [x] 1.1 Read the CI logs of the failed runs with `gh run view`.
- [x] 1.2 Run a temporary branch with a timer tracer on the GitHub runner.
  - Delete the branch after the run. It holds only the tracer and a temporary workflow.
- [x] 1.3 Name each live timer and the code that creates it.

## 2. `src/tooling/previewServing.test.mjs`

- [x] 2.1 Format the file with `npm run format`.
- [x] 2.2 Add `optimizeDeps` and `watch: null` to the two Vite configs of the file.
- [x] 2.3 Run the file with the tracer in the gate image.
  - Confirm that the active-resource list has no `Timeout`.
- [x] 2.4 Confirm that every test keeps its name and its assertions.

## 3. `src/data/trafficTiming.test.mjs`

- [x] 3.1 Add `optimizeDeps` and `watch: null` to the Vite server of the file.
- [x] 3.2 Run the file with the tracer in the gate image.
- [x] 3.3 Confirm that every test keeps its name and its assertions.

## 4. `src/data/trackedModelRegime.test.mjs`

- [x] 4.1 Enable a mock `setTimeout` at the start of the two fleet-loader tests.
- [x] 4.2 Run the file with the tracer in the gate image.
  - Confirm that the active-resource list has no `Timeout`.
- [x] 4.3 Confirm that every test keeps its name and its assertions.

## 5. Gates and review

- [ ] 5.1 Run `make lint` until no STE error remains.
- [ ] 5.2 Run `make ratchet CHANGE=ci-leak-cleanup`.
  - Confirm that the ratchet records no new untraced test name.
- [ ] 5.3 Run `make gates CHANGE=ci-leak-cleanup`. Read the command output for the verdict.
- [ ] 5.4 Run `npm run format:check` and `npm run check:boundaries`.
- [ ] 5.5 Run `/opsx:review ci-leak-cleanup`.
- [ ] 5.6 Correct the findings.
- [ ] 5.7 Record the result in `review.md`.
