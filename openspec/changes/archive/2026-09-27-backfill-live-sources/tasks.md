## 1. Documents

- [x] 1.1 Write the proposal, design, and spec for the transport abort path.

## 2. Test and proof

- [x] 2.1 Write the `live-sources-001` test before any code change.
  - Mutation: Replace the abort check with `if (false) throw error;`.
- [x] 2.2 Run the mutation and record the test failure.
- [x] 2.3 Run STE lint.
- [x] 2.4 Run the format check.

## 3. Gates and review

- [x] 3.1 Run the ratchet command for this change.
- [x] 3.2 Run the gates for this change.
- [ ] 3.3 Run the two review agents.
- [ ] 3.4 Write `review.md`.
