## Terms

The universal serial bus (USB) connects the receiver.
The Domain Name System (DNS) supplies network addresses.

## Preparation

- [x] 1. Read the project rules and memory files.
- [x] 2. Create the change directory.
- [x] 3. Complete the baseline measurements under the measurement load.
- [x] 4. Record the short timer audit.

## Test files

- [x] 5. Check the tests in `src/sdr/controller.test.mjs`.

Mutation: Make production change the device deadlines, the stale state and the device ownership.
- [x] 6. Check the tests in `src/devCctv.test.mjs`.

Mutation: Make production change the host, the credential names and the catalog check.
- [x] 7. Check the tests in `src/toolProjectRoot.test.mjs`.

Mutation: Make production ignore the selected project directory.
- [x] 8. Check the tests in `src/data/oshGet.test.mjs`.

Mutation: Make production report the wrong timeout error.
- [x] 9. Check the tests in `src/layers/traffic/navigation.test.mjs`.

Mutation: Make production remove the camera change subscription.
- [x] 10. Check the tests in `src/app/layers/osh.test.mjs`.

Mutation: Make production remove the command view or write the wrong detail.
- [x] 11. Check the tests in `src/cameraGroundGuard.test.mjs`.

Mutation: Make production remove the camera lift or ignore the next owner.
- [x] 12. Check the tests in `src/data/cctvHlsStream.test.mjs`.

Mutation: Make production ignore the sequence changes or delay the lease expiry.
- [x] 13. Check the tests in `src/data/cctvMediaRange.test.mjs`.

Mutation: Make production omit the client response closure or ignore the client backpressure.
- [x] 14. Check the tests in `src/data/cctvProxy.test.mjs`.

Mutation: Make production delay the header deadline.
- [x] 15. Check the tests in `src/data/gbfsProxy.test.mjs`.

Mutation: Make production delay the request deadline.
- [x] 16. Check the tests in `src/data/localReceiversProxy.test.mjs`.

Mutation: Make production delay the DNS deadline.
- [x] 17. Check the tests in `src/services/requests.test.mjs`.

Mutation: Make production delay the deadline or the next probe.
- [x] 18. Check the tests in `src/data/directions.test.mjs`.

Mutation: Make production keep the old pointer timer or omit the pointer teardown.
- [x] 19. Check the tests in `src/ui/localSdrControls.test.mjs`.

Mutation: Make production omit the render callback.
- [x] 20. Check the tests in `src/tooling/nominatimSearchRoute.test.mjs`.

Mutation: Make production use separate active search requests.
- [x] 21. Check the tests in `src/tooling/localServices.test.mjs`.

Mutation: Make production use separate active weather requests.

## Files without a timer change

- [x] Record the synchronous surface identity check in the design.
- [x] Record the synchronous repository hygiene checks in the design.

## Local evidence

- [x] Compare covered production lines before and after each test change.
- [x] Record each production mutation result in the /home/ianblenke/docker/gev-tools/harden-timing/.
- [x] Complete the measurements after each test change under the measurement load.
- [x] Check each changed test file without added load.
- [x] Run the change lint.
- [x] Run `predispatch.py` on the change directory.
- [x] Run `scripts/format.mjs` with `--write` and `--check`.

The lead checked all 17 files on the host with `node --test`.
The log `/tmp/claude-1000/gcr/ht-chain.log` reports zero failures.
Local socket checks still need the host.
The completed tasks refer to the lead log before the round 2 edits.

## Gates and review

- [ ] Ask the lead to run `make ratchet CHANGE=harden-timing-tests`.
- [ ] Ask the lead to run `make gates CHANGE=harden-timing-tests`.
- [ ] Ask the lead to get both review verdicts.
- [ ] Ask the lead to write `review.md`.
