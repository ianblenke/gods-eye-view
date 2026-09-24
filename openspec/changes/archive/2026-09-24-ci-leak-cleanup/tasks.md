## 1. Diagnose before you fix

- [x] 1.1 Read the CI logs of the failed runs with `gh run view`.
- [x] 1.2 Run the CI workflow on a temporary branch that holds a timer tracer.
- [x] 1.3 Delete the temporary branch after the run.
- [x] 1.4 Name each live timer that the tracer finds, and the code that creates it.
  - The tracer named no timer for `src/data/trafficTiming.test.mjs`. This file leaks on some runs only.

## 2. `src/tooling/previewServing.test.mjs`

- [x] 2.1 Format the file with `npm run format`.
- [x] 2.2 Add the options that stop the dependency optimizer and the file watcher to the two Vite configs.
- [x] 2.3 Run the file with the tracer in the Docker image.
- [x] 2.4 Confirm that the list of active resources has no `Timeout`.
- [x] 2.5 Confirm that every test keeps its name and its assertions.

## 3. `src/data/trafficTiming.test.mjs`

- [x] 3.1 Add the same options to the Vite server of the file.
- [x] 3.2 Correct the comment about the wait of 750 ms.
- [x] 3.3 Run the file with the tracer in the Docker image.
- [x] 3.4 Confirm that the list of active resources has no `Timeout`.
- [x] 3.5 Confirm that every test keeps its name and its assertions.

## 4. `src/data/trackedModelRegime.test.mjs`

- [x] 4.1 Enable a mock `setTimeout` at the start of the fleet-loader test body.
- [x] 4.2 Run the file with the tracer in the Docker image.
- [x] 4.3 Confirm that the list of active resources has no `Timeout`.
- [x] 4.4 Confirm that every test keeps its name and its assertions.

## 5. The proof on the GitHub runner

- [x] 5.1 Run the gates on the runner with the fixes, without the tracer.
- [x] 5.2 Confirm that the run lists no `GATES-TEST-LEAK`.
- [x] 5.3 Run the tracer on the runner with the fixes.
- [x] 5.4 Confirm that the tracer lists no pending timer for the three files.

## 6. Gates and review

- [x] 6.1 Run `make lint` until no STE error remains.
- [x] 6.2 Run `make gates CHANGE=ci-leak-cleanup`.
- [x] 6.3 Read the command output for the verdict.
- [x] 6.4 Run `npm run format:check`.
- [x] 6.5 Run `npm run check:boundaries`.
- [x] 6.6 Run `/opsx:review ci-leak-cleanup`.
- [x] 6.7 Correct the findings.
- [x] 6.8 Record the result in `review.md`.
