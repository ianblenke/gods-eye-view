# spec-adversary round 3 — osh-control-panel-layout

Scope: diff 9e1bf92 (commit 16ba434)
Verdict: PASS

Findings: none.

## Answers to the round-3 review questions

1. F1 (round 2, critical) is genuinely fixed. `src/layers/oshControl/view.test.mjs:185-187`
   now does:
   ```
   const label = nodes(fieldset).find((node) => node.tagName === 'label');
   assert.ok(label, 'the field label is inside the fieldset');
   assert.equal(fieldset.children.includes(label), true);
   ```
   `nodes(fieldset)` is a deep search rooted at the fieldset, so under the
   round-2 mutation (`content.push(label)` instead of `row.append(label)` in
   view.js:57), the label is pushed to `content` at the top level and never
   appears under `fieldset` at all — `nodes(fieldset).find(...)` returns
   `undefined`, and `assert.ok(label, ...)` fails first, matching what the
   team lead confirmed by running the mutation directly. If a mutation
   instead nested the label one level deeper inside the fieldset rather than
   removing it, `assert.ok` would still pass but
   `fieldset.children.includes(label)` would correctly catch that, since it
   checks direct-child membership. Both failure modes are covered.

2. Re-reading `osh-control-037`'s WHEN/THEN/AND lines against the test: all
   clauses are now covered — the fieldset wrap (field label + button), the
   legend as first child with the command's own name, and the button
   keeping the command's own name as its own text.

3. No new gap from this round's edits. `view.js` was not touched this round
   (only `view.test.mjs`, `tasks.md`, `design.md`, `proposal.md` changed),
   so there is no coverage impact. `tasks.md` task 1.1 now lists both
   mutations (no-legend, label-outside-fieldset), matching what the test
   actually asserts, closing round 2's F2.

Round 2's F3 (osh-control-038's "own line" claim, provable only via the
`osh-command-field` CSS-class proxy since the fake DOM has no layout engine)
is untouched by this round's diff and was already dispositioned as a known,
non-fixable limit in round 2. Not re-flagged as a new finding; carried to
review.md as an accepted minor known limit.
