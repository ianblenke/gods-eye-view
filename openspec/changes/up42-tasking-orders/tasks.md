## 1. Server client

- [ ] 1.1 Write the tests for `get` and `patch` of the client in the existing auth test file.
- [ ] 1.2 Add `get` and `patch` to `server/providers/up42/auth.js`.

## 2. Server routes

- [ ] Write the test for `up42-orders-001`.
- [ ] Write the test for `up42-orders-002`.
- [ ] Write the test for `up42-orders-003`.
- [ ] Write the test for `up42-orders-004`.
- [ ] Write the test for `up42-orders-005`.
- [ ] Write the test for `up42-orders-006`.
- [ ] Write the test for `up42-orders-007`.
- [ ] Write the test for `up42-orders-008`.
- [ ] Write the test for `up42-orders-009`.
- [ ] Write the test for `up42-orders-010`.
- [ ] Write the test for `up42-orders-011`.
- [ ] Write the test for `up42-orders-012`.
- [ ] Write the test for `up42-orders-013`.
- [ ] Write the test for `up42-orders-014`.
- [ ] Write the test for `up42-orders-015`.
- [ ] Write the test for `up42-orders-016`.
- [ ] Write the test for `up42-orders-017`.
- [ ] Write the test for `up42-orders-018`.
- [ ] Write the test for `up42-orders-019`.
- [ ] Write the test for `up42-orders-020`.
- [ ] Write the test for `up42-orders-021`.
- [ ] Write the test for `up42-orders-022`.
- [ ] Write the test for `up42-orders-023`.
- [ ] Write the test for `up42-orders-024`.
- [ ] Write the test for `up42-orders-025`.
- [ ] Write the test for `up42-orders-026`.
- [ ] Write the test for `up42-orders-027`.
- [ ] Write the test for `up42-orders-028`.
- [ ] Write `server/providers/up42-orders/` with the validation, the ledger, the upstream calls and the routes.
- [ ] Add the plugin to the local list.
- [ ] Add the volume to `compose.yaml`, the folder to the `Dockerfile` and the ignore rules of the dev server.

## 3. Page

- [ ] Write the test for `up42-order-panel-001`.
- [ ] Write the test for `up42-order-panel-002`.
- [ ] Write the test for `up42-order-panel-003`.
- [ ] Write the test for `up42-order-panel-004`.
- [ ] Write the test for `up42-order-panel-005`.
- [ ] Write the test for `up42-order-panel-006`.
- [ ] Write the test for `up42-order-panel-007`.
- [ ] Write the test for `up42-order-panel-008`.
- [ ] Write the test for `up42-order-panel-009`.
- [ ] Write the test for `up42-order-panel-010`.
- [ ] Write the test for `up42-order-panel-011`.
- [ ] Write the test for `up42-order-panel-012`.
- [ ] Write the test for `up42-order-panel-013`.
- [ ] Write the test for `up42-order-panel-014`.
- [ ] Write `src/layers/up42Scenes/orders.js` and the four source methods.
- [ ] Add the order steps to `src/layers/up42Scenes/index.js`.
- [ ] Add the new files to `scripts/package-boundaries.json`, `scripts/format-scope.json` and `openspec/ownership.json`.
- [ ] Add the new variables to `.env.example` and a fragment to `changelog.d`.

## 4. Gates and review

- [ ] Run the new tests on the host and correct each error.
- [ ] Commit the code files and the test files.
- [ ] Run `make ratchet CHANGE=up42-tasking-orders`.
- [ ] Read the verdict.
- [ ] Run `/opsx:review up42-tasking-orders`.
- [ ] Write `review.md` with the findings of the two review agents.
- [ ] Run `make gates CHANGE=up42-tasking-orders` on the final tree.
- [ ] Ask the owner to set the variables, rebuild and place the first order by hand.
