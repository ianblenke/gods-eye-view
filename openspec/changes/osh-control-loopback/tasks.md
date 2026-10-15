## 1. Write the tests

- [x] 1.1 Change the tests for `osh-control-028` in `src/control/route.test.mjs`.
- [x] 1.2 Write the test for `osh-control-039` in the same file.
- [x] 1.3 Write the test for `osh-control-040` in the same file.
- [x] 1.4 Carry `osh-control-029` unchanged in the delta of `osh-control`.

## 2. Write the files

- [x] 2.1 Write `server/providers/common/loopback-command.js`.
- [x] 2.2 Make `isSameOriginCommand` call the new function.
- [x] 2.3 Add the new file to `openspec/ownership.json` and `scripts/format-scope.json`.
- [x] 2.4 Add the new file and `src/localRequestGate.mjs` to the package `osh-control-provider`.
- [x] 2.5 Write the entry in `CHANGELOG.md`, the note in `.env.example` and the line in the roadmap document.

## 3. Check on the host

- [x] 3.1 Measure the client address of a container behind a bridge port.
- [x] 3.2 Run the tests of the route on the host.
- [x] 3.3 Run the named faults of the gate.
- [x] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [x] 3.5 Run the four checks of `make precheck` on the host.
- [x] 3.6 Read the exit status of each check.
- [x] 3.7 Run the STE lint on the host.
- [x] 3.8 Run `openspec validate osh-control-loopback` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=osh-control-loopback`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=osh-control-loopback` on the final tree.
