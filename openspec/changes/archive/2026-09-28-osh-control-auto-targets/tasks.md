## 1. Route conditions

- [x] 1.1 Update the `[osh-control-001]` test for the new targets shape. Change `targets:[]` to `commands:{}` in `src/control/route.test.mjs`.
  - Mutation: Keep the old `targets:[]` key in the route's answer. The test must fail.
- [x] 1.2 Update the `[osh-control-003]` test to drop the empty-target-list case and the `no_targets` reason.
  - Mutation: Keep the `no_targets` reason reachable. The test must fail.
- [x] 1.3 Update `routeConfig` in `targets.js` for `[osh-control-001 osh-control-003]`: answer `commands:{}`, stop at `no_key` or `no_account`.
- [x] 1.4 Confirm `[osh-control-002]` is carried with no change: its own test and its route behavior stay as they are.

## 2. Drop the target list

- [x] 2.1 Remove the `[osh-control-004]` and `[osh-control-005]` tests. They test `parseTargets`, which this change removes.
- [x] 2.2 Remove `parseTargets` from `targets.js` and the `systems` field from `routeConfig`'s answer.
- [x] 2.3 Remove `OSH_CONTROL_TARGETS` from `.env.example`.

## 3. The wrong-shape id check

- [x] 3.1 Write the `[osh-control-033]` test for a `system` value that fails `OSH_ID_PATTERN`, on both routes, in `src/control/route.test.mjs`.
  - Mutation: Skip the shape check before the live read. The test must fail.
- [x] 3.2 Write the `[osh-control-033]` unit test for the same check in `validateCommand`, in `src/control/table.test.mjs`.
  - Mutation: Accept a `system` value of the wrong shape. The test must fail.
- [x] 3.3 Add the `OSH_ID_PATTERN` check for `system` to `validateCommand` in `commands.js`, and to the targets route in `osh-control.js`, for `[osh-control-033]`.

## 4. Drop the not_a_target check

- [x] 4.1 Remove the `not_a_target` assertion from the combined `[osh-control-007 osh-control-008 osh-control-009]` test in `src/control/route.test.mjs`. Keep the `osh-control-007` and `osh-control-009` checks.
- [x] 4.2 Remove the `[osh-control-008]` unit test in `src/control/table.test.mjs`, and the `targets` parameter it exercises.
- [x] 4.3 Remove the `targets` parameter and the `not_a_target` check from `validateCommand` in `commands.js`, for `[osh-control-007 osh-control-009]`.
- [x] 4.4 Keep `[osh-control-010 osh-control-011 osh-control-013]` and `[osh-control-014 osh-control-015]` as they are: same tests, same route behavior.

## 5. Resolve every command of one system

- [x] 5.1 Write the `[osh-control-034]` test: control streams that match give exactly those commands, in `src/control/route.test.mjs`.
  - Mutation: Return one entry for every table command, matched or not. The test must fail.
- [x] 5.2 Write the `[osh-control-034]` test: a system with no control stream that matches gets an empty `commands` object, not an error.
  - Mutation: Answer an error for a system with no match. The test must fail.
- [x] 5.3 Write the `[osh-control-035]` test: a failed control-stream read gives `upstream_failed`, not a crash or an empty answer with no reason.
  - Mutation: Swallow the read failure and answer as if the system had no match. The test must fail.
- [x] 5.4 Add `resolveTargets(system)` to `targets.js`. It builds and caches the same map `resolveCommand` reads, for `[osh-control-006 osh-control-034 osh-control-035]`.
- [x] 5.5 Change the targets route in `osh-control.js`: read `system` from the query string, call `resolveTargets`, for `[osh-control-034 osh-control-035]`.

## 6. Remove the static targets test

- [x] 6.1 Remove the `[osh-control-030]` test in `src/control/route.test.mjs`. It tests the static answer this change removes.

## 7. The browser client and view

- [x] 7.1 Update `client.js`'s `targets()` test in `src/layers/oshControl/client.test.mjs`: it takes a system id and builds the query string.
  - Mutation: Drop the system id from the query string. The test must fail.
- [x] 7.2 Update `client.js`'s `targets(systemId)` in `src/layers/oshControl/client.test.mjs` and `client.js` itself, for `[osh-control-034]`.
- [x] 7.3 Update the `view.test.mjs` tests that build a `target` fixture: read `commands` directly, with no list search.
  - Mutation: Search a list for the system id instead of reading `commands` directly. The test must fail.
- [x] 7.4 Update `view.js`'s `show()` to call `client.targets(systemId)` and read `result.commands` directly, for `[osh-control-016 osh-control-017 osh-control-031]`.

## 8. Gates and review

- [x] 8.1 Run `make ratchet CHANGE=osh-control-auto-targets` and inspect the command verdict.
- [x] 8.2 Run `make gates CHANGE=osh-control-auto-targets` and inspect the command verdict and QA lines.
- [ ] 8.3 Run `/opsx:review osh-control-auto-targets` with both review agents.
- [ ] 8.4 Write `review.md` with the passed reviews and tree hash.
