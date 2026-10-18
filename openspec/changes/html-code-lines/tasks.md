## 1. Plan

- [x] 1.1 Write the change plan.
- [x] 1.2 Write the delta spec for `ownership-056`.
- [x] 1.3 Keep the test of `ownership-007`.

## 2. Tests and code

- [x] 2.1 Write the tests of `htmlCodeLines()` with the ID `ownership-056`.
- [x] 2.2 Write the test of `syncChangedLines()` for an HTML file with the ID `ownership-056`.
- [x] 2.3 Add `htmlCodeLines()` to `scripts/spec/lib/coverage.mjs`.
- [x] 2.4 Keep only the code lines of each HTML file in `syncChangedLines()`.
- [x] 2.5 Add the HTML sentence to the Purpose of the ownership spec.
- [x] 2.6 Add the HTML sentence to rule 5 of `AGENTS.md`.
- [x] 2.7 Add the HTML sentence to `openspec/config.yaml`.
- [x] 2.8 Run each fault of `design.md`.

## 3. Checks and review

- [ ] 3.1 Run the test files of `src/tooling/spec` on the host.
- [ ] 3.2 Run `make ratchet CHANGE=html-code-lines`.
- [ ] 3.3 Run the two review agents.
- [ ] 3.4 Write review.md.
- [ ] 3.5 Run `make gates CHANGE=html-code-lines` on the final tree.
