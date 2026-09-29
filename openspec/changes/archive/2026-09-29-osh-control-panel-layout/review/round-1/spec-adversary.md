# spec-adversary round 1 — osh-control-panel-layout

Scope: full
Verdict: FAIL

Note: this session's context was compacted after round 1 ran, so the agent's
own verbatim report text was not preserved. This file records the findings
as a summary, reconstructed from the session record of what was reported and
what was corrected in round 2. The finding descriptions below match what the
round-2 correction commit (66c4a57) actually fixed.

## Findings

- [x] critical `src/layers/oshControl/view.test.mjs`, test `[osh-control-037] Group each command under its own name` — the test checked that a `fieldset`, a `legend` and a send button existed, and that the button's own text equalled the command name, but never proved the button was a DOM child of the fieldset. A mutation that appended the button outside the fieldset (`content.push(button)` instead of `row.append(button)`) passed the test undetected. Corrected in round 2: the test now finds the button by `byButtonText(fieldset, ...)` (scoped to the fieldset's own subtree) and asserts `fieldset.children.includes(button) === true`. Verified by the stated mutation, which now fails the test as expected.
- [x] critical `src/layers/oshControl/view.test.mjs`, test `[osh-control-038] Put one field on its own line` — the test found each field's `label` by searching the whole `host`, not the command's own `fieldset`, so it did not prove the labels were inside the group. A mutation that appended a label outside its fieldset (`content.push(label)` instead of `row.append(label)`) passed the test undetected. Corrected in round 2: the test now scopes its search to `nodes(fieldset)` instead of `nodes(host)`.
