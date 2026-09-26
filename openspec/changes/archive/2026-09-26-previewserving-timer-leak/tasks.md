## 1. Test repair

- [x] 1.1 Count timer records with the gate preload in plain and CPU load runs.
- [x] 1.2 Find the timer owner with a temporary `async_hooks` hook.
- [x] 1.3 Add a 60 ms wait after each Vite server close.
  - Mutation: Remove the wait from the scratch exit test. Its timer check must fail.
- [x] 1.4 Run 100 loaded tests before and after the change.
- [x] 1.5 Run the test file and the format check.
- [x] 1.6 Run STE lint and read its output.

## 2. Gates and review

- [x] 2.1 Run the full gates on Node 24.
- [x] 2.2 Run two review agents and read each verdict.
- [x] 2.3 Write the result in `review.md`.
