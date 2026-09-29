# spec-adversary round 2 — osh-control-panel-layout

Scope: diff 040e599 (commit 9e1bf92)
Verdict: FAIL

Round-1 fixes confirmed genuine: both round-1 critical findings are properly
resolved. `osh-control-037`'s test proves the button is a direct child of
the fieldset via `fieldset.children.includes(button)`, and `osh-control-038`'s
test now traverses `nodes(fieldset)` (not `nodes(host)`) to prove labels are
fieldset descendants. Terminology ("command view" vs "confirmation panel")
is consistent. The archived and merged `spec.md` are identical. Trace files
(`ids.json`, `links.json`, `retired-ids.json`) are consistent, and no
ledger/history entries were expected or found (coverage stayed at 100%
throughout, so no gap ever opened).

## Findings

- [x] critical `src/layers/oshControl/view.test.mjs:172-185` — the `[osh-control-037]` test still only partially asserts its own THEN line. Scenario osh-control-037's THEN reads "it wraps that command's fields **and its send button** in one `fieldset` element." The round-2 fix added a real containment check for the **button** (`fieldset.children.includes(button)`) but added nothing for the **field**. The test's own fixture command (`mavRTLControl`) has one field (`rtl`), yet the test never looks for its `label` at all. A mutation that appends field labels outside the fieldset (e.g. change `row.append(label)` to `content.push(label)` in view.js) makes this tagged test pass unchanged — it would only be caught by the differently-tagged osh-control-038 test, which doesn't satisfy osh-control-037's own tag requirement. Fix: after the existing button check, also find the field's `label` node and assert `fieldset.children.includes(label) === true`. Corrected in round 3, verified by the stated mutation.
- [x] minor `openspec/changes/archive/2026-09-29-osh-control-panel-layout/tasks.md:3-6` — Task 1.1's bullets never call for checking that the command's *fields* are also inside the fieldset, even though the scenario's THEN line names fields explicitly. This under-specification is the likely root cause of the critical finding above. Corrected in round 3.
- [ ] minor `src/layers/oshControl/view.test.mjs:194-196` — osh-control-038's THEN line ("each field's label and input are the only content of their own line") is checked only via the `osh-command-field` class name — a CSS proxy, since the fake DOM here has no layout/CSS engine and can't literally prove "own line." This is a structural limitation of the fake-DOM harness (matches the pre-existing design intent in design.md D2, which explicitly delegates the visual line-break to CSS), not something round 2's edit could practically fix, and not new to this round. Accepted by Ian Blenke.
