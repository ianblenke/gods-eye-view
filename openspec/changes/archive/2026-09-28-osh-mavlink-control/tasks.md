## 1. Change documents

- [x] 1.1 Write the proposal before the delta spec.
- [x] 1.2 Write the design before the delta spec.

## 2. Flag and route conditions

- [x] 2.1 Test absent and nonexact flags. Write the [osh-control-001] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Change the flag check to accept `TRUE`; the `control_off` test must fail.
- [x] 2.2 Test equal user names after normalization. Write the [osh-control-002] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Remove the case fold from the account comparison; the `same_account` test must fail.
- [x] 2.3 Test invalid URL, absent account fields, and empty targets. Write the [osh-control-003] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Skip the missing password check; the `no_account` test must fail.
- [x] 2.4 Implement the request-time route conditions in `targets.js` and `osh-control.js` for `[osh-control-001 osh-control-002 osh-control-003]`.

## 3. Target allowlist

- [x] 3.1 Test one bad id and the position-only warning. Write the [osh-control-004] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Accept one invalid target entry; the `bad_targets` test must fail.
- [x] 3.2 Test a repeated system id. Write the [osh-control-005] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Keep a repeated id in the list; the duplicate test must fail.
- [x] 3.3 Test schema-name lookup and an absent command stream. Write the [osh-control-006] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Match a command to a stream by position instead of `parametersSchema.name`; the lookup test must fail.
- [x] 3.4 Test the static command table of an enabled target. Write the [osh-control-030] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Read a control stream before the targets route answers; the no-upstream-call test must fail.
- [x] 3.5 Implement target parsing, the targets response, and the schema lookup for each system in `targets.js`, `url.js`, and `osh-control.js` for `[osh-control-004 osh-control-005 osh-control-006 osh-control-030]`.

## 4. Command table and validator

- [x] 4.1 Test the JSON object, byte limit, and exact body keys. Write the [osh-control-007] test in `src/control/table.test.mjs` with a `node:assert` method.
  - Mutation: Raise the body limit above 4096 bytes; the `bad_body` test must fail.
- [x] 4.2 Test a system outside the valid target list. Write the [osh-control-008] test in `src/control/table.test.mjs` with a `node:assert` method.
  - Mutation: Skip the target membership check; the `not_a_target` test must fail.
- [x] 4.3 Test a command that is not an own table key. Write the [osh-control-009] test in `src/control/table.test.mjs` with a `node:assert` method.
  - Mutation: Accept an inherited command key; the `unknown_command` test must fail.
- [x] 4.4 Test extra, absent, wrong-type, and non-object parameters. Write the [osh-control-010] test in `src/control/table.test.mjs` with a `node:assert` method.
  - Mutation: Ignore an extra parameter key; the `bad_parameter` test must fail.
- [x] 4.5 Test non-finite numbers, bounds, and numeric text. Write the [osh-control-011] test in `src/control/table.test.mjs` with a `node:assert` method.
  - Mutation: Remove the finite-number check; the `bad_parameter` test must fail.
- [x] 4.6 This change retires `osh-control-012`; the first table has no `token` field, so write no task for it.
- [x] 4.7 Test boolean fields with non-boolean values. Write the [osh-control-013] test in `src/control/table.test.mjs` with a `node:assert` method.
  - Mutation: Accept `1` as a boolean; the `bad_parameter` test must fail.
- [x] 4.8 Test a table field absent from the resolved schema. Write the [osh-control-014] test in `src/control/table.test.mjs` with a `node:assert` method.
  - Mutation: Skip the same-name schema field check; the `schema_mismatch` test must fail.
- [x] 4.9 Test exact command definitions and exclusions. Write the [osh-control-015] test in `src/control/table.test.mjs` with a `node:assert` method.
  - Mutation: Add `mavShellControl` to the table; the exact-table test must fail.
- [x] 4.10 Implement the table and ordered validator in `commands.js` for [osh-control-007] through [osh-control-015].

## 5. Confirmation step

- [x] 5.1 Test the first click, confirmation content, focus, and second click. Write the [osh-control-016] test in `src/layers/oshControl/view.test.mjs` with a `node:assert` method.
  - Mutation: Call the POST on the first command-button click; the confirmation test must fail.
- [x] 5.2 Test the browser POST for [osh-control-016] in `src/layers/oshControl/client.test.mjs` with a `node:assert` method.
  - Mutation: Change the client method from `POST` to `GET`; the browser test must fail.
- [x] 5.3 Test Cancel, selection change, clear, and the 30 second limit. Write the [osh-control-017] test in `src/layers/oshControl/view.test.mjs` with a `node:assert` method.
  - Mutation: Keep the confirmation open after Cancel; the close test must fail.
- [x] 5.4 Implement the view and browser client in `view.js` and `client.js` for `[osh-control-016 osh-control-017]`.
- [x] 5.5 Test the layer's calls to `show` and `clear`. Write the [osh-control-031] test in `src/data/oshLayer.test.mjs` with a `node:assert` method.
  - Mutation: Remove the `commandView?.show` call at selection; the select test must fail.
- [x] 5.6 Wire the optional `commandView` input into `src/layers/osh/index.js` for `[osh-control-031]`.
- [x] 5.7 Confirm the app builds the view only with a host. Write the [osh-control-032] test in `src/app/layers/osh.test.mjs` with a `node:assert` method.
  - Mutation: Build the command view even with no host element; the no-host test must fail.
- [x] 5.8 Build the command view in `createApplicationOsh()` of `src/app/layers/osh.js` for `[osh-control-032]`.

## 6. Rate limit

- [x] 6.1 Test the minute limits. Write the [osh-control-018] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Set `globalMax` to nine; the total-limit test must fail.
- [x] 6.2 Test a second request during an open call. Write the [osh-control-019] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Remove the in-flight system check; the `busy` test must fail.
- [x] 6.3 Implement the system-keyed limiter and in-flight check in `osh-control.js` for `[osh-control-018 osh-control-019]`.

## 7. Command log

- [x] 7.1 Test refused, accepted, sent, and failed lines with safe fields. Write the [osh-control-020] test in `src/control/log.test.mjs` with a `node:assert` method.
  - Mutation: Add the raw request body to a log line; the sensitive-value test must fail.
- [x] 7.2 Test an accepted-line write failure before POST. Write the [osh-control-021] test in `src/control/log.test.mjs` with a `node:assert` method.
  - Mutation: Send the POST after an accepted-line write failure; the `log_failed` test must fail.
- [x] 7.3 Implement the command log and route guard in `log.js` and `osh-control.js` for `[osh-control-020 osh-control-021]`.

## 8. Source scans

- [x] 8.1 Scan new call sites and methods. Write the [osh-control-022] test in `src/control/scan.test.mjs` with a `node:assert` method.
  - Mutation: Change `'POST'` to `'PUT'` in `post.js`; the method scan must fail.
- [x] 8.2 Scan the old import boundary. Write the [osh-control-023] test in `src/control/scan.test.mjs` with a `node:assert` method.
  - Mutation: Add an import of `post.js` to `server/providers/osh.js`; the boundary scan must fail.
- [x] 8.3 Keep the POST in `post.js` and the imports outside the old scan set for `[osh-control-022 osh-control-023]`.

## 9. Upstream command call

- [x] 9.1 Test the literal commands path with no query. Write the [osh-control-024] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Append a query to `oshCommandUrl`; the URL test must fail.
- [x] 9.2 Test each rejected URL component. Write the [osh-control-025] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Allow a fragment in `assertCommandUrl`; the unsafe-URL test must fail.
- [x] 9.3 Test exact browser result keys and no upstream body. Write the [osh-control-026] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Copy the upstream body into the browser result; the result-shape test must fail.
- [x] 9.4 Test redirect failure and timeout with no retry. Write the [osh-control-027] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Treat status 302 as success; the redirect test must fail.
- [x] 9.5 Implement the checked URL, the POST, and the response handling in `url.js`, `post.js`, and `osh-control.js` for `[osh-control-024 osh-control-025 osh-control-026 osh-control-027]`.

## 10. Origin check

- [x] 10.1 Test each bad host and origin condition. Write the [osh-control-028] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Accept an absent `Origin` header; the `cross_origin` test must fail.
- [x] 10.2 Test a content type other than `application/json`. Write the [osh-control-029] test in `src/control/route.test.mjs` with a `node:assert` method.
  - Mutation: Accept `text/plain` as the content type; the `cross_origin` test must fail.
- [x] 10.3 Implement the origin check in `osh-control.js` for `[osh-control-028 osh-control-029]`.

## 11. Gates and review

- [ ] 11.1 Run `make ratchet CHANGE=osh-mavlink-control` and inspect the command verdict.
- [ ] 11.2 Run `make gates CHANGE=osh-mavlink-control` and inspect the command verdict and QA lines.
- [ ] 11.3 Run `/opsx:review osh-mavlink-control` with both review agents.
- [ ] 11.4 Write `review.md` with the passed reviews and tree hash.
