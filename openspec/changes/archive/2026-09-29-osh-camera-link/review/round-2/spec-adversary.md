# spec-adversary round 2 — osh-camera-link

Scope: diff cd33ea5 (commit 397b492)
Verdict: PASS

Findings: none.

All four round-1 findings (F1-F4) verified fixed by hand-tracing the code paths, not just re-reading the diff text.

One out-of-scope FYI, not a formal finding since `src/layers/osh/index.js` was not touched in this round's diff: none of the five `[osh-097]` tests appears to exercise the `result.keyRequired === true` branch of the fallback's guard condition at `index.js:321`, `if (generation !== _pollGeneration || !result || result.keyRequired) return;`. Worth a real coverage-tool check before merge.

**Team-lead follow-up:** treated as a real gap, not a scope technicality. Independently verified by direct mutation — removed `|| result.keyRequired` from the guard, ran the full suite (175 tests at the time), all passed, confirming the branch was genuinely unexercised despite the coverage tool reporting `index.js` at 100% branch coverage. Fixed with a new test (took two attempts before a genuinely load-bearing fixture was found) and the missing AND line in `osh-097`. See round-3 review for verification of the fix.
