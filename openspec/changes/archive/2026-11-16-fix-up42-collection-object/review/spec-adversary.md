Round 2, scope: diff e0b392db, tree f9ca15e9.

- [ ] FINDING minor: `specs/up42-quotes/spec.md:15` and `src/data/up42Quotes.test.mjs:806-815`. Scenario 014 does not say that control characters are removed. The new test asserts it. This is a test that asserts more than its scenario states, not a hidden gap. Add "AND control characters are removed" to the scenario, or accept this as a known limit.

Round 1 findings F1 (major), F2 (minor) and F3 (minor) are fixed. No fault was added by the other corrections.

Verdict: PASS
