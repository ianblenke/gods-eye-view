## 1. The spec

- [x] 1.1 Write the proposal, design and spec before tests.

## 2. Tests and mutations

- [x] 2.1 Tag or add tests for `perimeters-001`.
  - Mutation: Change the source route to `/api/bad-perimeters`. The test must fail.
- [x] 2.2 Tag or add tests for `perimeters-002`.
  - Mutation: Change the bad snapshot error text. The test must fail.
- [x] 2.3 Tag or add tests for `perimeters-003`.
  - Mutation: Set each acres value to null. The test must fail.
- [x] 2.4 Tag or add tests for `perimeters-004`.
  - Mutation: Accept a ring with three points. The test must fail.
- [x] 2.5 Tag or add tests for `perimeters-005`.
  - Mutation: Choose the smallest polygon for the anchor. The test must fail.
- [x] 2.6 Tag or add tests for `perimeters-006`.
  - Mutation: Make a full containment accent red. The test must fail.
- [x] 2.7 Tag or add tests for `perimeters-007`.
  - Mutation: Remove the word `blaze` instead of `fire` from names. The test must fail.
- [x] 2.8 Tag or add tests for `perimeters-008`.
  - Mutation: Reject a page with a change time equal to now. The test must fail.
- [x] 2.9 Tag or add tests for `perimeters-009`.
  - Mutation: Request a bad index route. The test must fail.
- [x] 2.10 Tag or add tests for `perimeters-010`.
  - Mutation: Use `bad-perimeter` as the entity id prefix. The test must fail.
- [x] 2.11 Tag or add tests for `perimeters-011`.
  - Mutation: Set each analyst latitude to zero. The test must fail.
- [x] 2.12 Tag or add tests for `perimeters-012`.
  - Mutation: Set the update interval to 300001 ms. The test must fail.
- [x] 2.13 Tag or add tests for `perimeters-013`.
  - Mutation: Ignore the busy pointer test. The test must fail.
- [x] 2.14 Tag or add tests for `perimeters-014`.
  - Mutation: Make the card action return false. The test must fail.
- [x] 2.15 Tag or add tests for `perimeters-015`.
  - Mutation: Do not abort the page check. The test must fail.
- [x] 2.16 Tag or add tests for `perimeters-016`.
  - Mutation: Discard the rows from the snapshot source. The test must fail.
- [x] 2.17 Add tests for `perimeters-017`.
  - Mutation: Stop the feed after four pages. The test must fail.
  - Mutation `perimeters-017-property`: Change the property condition in `server/providers/firePerimeters.js`. The test must fail.
- [x] 2.18 Add tests for `perimeters-018`.
  - Mutation: Reject each index response. The test must fail.
- [x] 2.19 Add tests for `perimeters-019`.
  - Mutation: Send status 200 for a bad method. The test must fail.
  - Mutation `perimeters-019-closed`: Remove the closed reply check in `server/providers/firePerimeters.js`. The test must fail.
- [x] 2.20 Tag the old feed page and size tests for `perimeters-020`.
  - Mutation: Stop the feed after four pages in `server/providers/firePerimeters.js`.
- [x] 2.21 Tag the old feed failure tests for `perimeters-021`.
  - Mutation: Do not mark stale feed rows in `server/providers/firePerimeters.js`.
- [x] 2.22 Tag the old shared request test for `perimeters-022`.
  - Mutation: Use a new request map for each call in `server/providers/firePerimeters.js`.
- [x] 2.23 Tag the old input test for `perimeters-023`.
  - Mutation: Skip the method check in `server/providers/firePerimeters.js`.
- [x] 2.24 Tag the old index tests for `perimeters-024`.
  - Mutation: Change the fixed POST body in `server/providers/firePerimeters.js`.
- [x] 2.25 Tag the old page tests for `perimeters-025`.
  - Mutation: Extend the page cache time by one millisecond in `server/providers/firePerimeters.js`.
- [x] 2.26 Tag the old client limit test for `perimeters-026`.
  - Mutation: Use one key for all clients in `server/providers/firePerimeters.js`.
- [x] 2.27 Tag the old redirect tests for `perimeters-027`.
  - Mutation: Keep HTTP for a page redirect in `server/providers/firePerimeters.js`.

## 3. Gates and review

- [x] 3.1 Run the ratchet command.
- [x] 3.2 Run the full gates.
- [x] 3.3 Run the two review agents.
- [x] 3.4 Write review.md with their results.
