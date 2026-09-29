## 1. Group each command under a fieldset and a legend

- [x] 1.1 Write the `[osh-control-037]` test in `view.test.mjs`. Show a target with one command.
  - Assert the command's row is a `fieldset` whose first child is a `legend` with the command's own name.
  - Assert the button's own text is still the command's own name.
  - Mutation: Keep `row` as a plain `div`, with no `legend`. The test must fail.
- [x] 1.2 Change `view.js`'s `render()`: make `row` a `fieldset`.
  - Append a `legend` as its first child, with the class `osh-command-legend`.
- [x] 1.3 Add a `byButtonText` helper to `view.test.mjs`.
  - The legend and the send button now share one text, so plain `byText` can no longer tell them apart.
  - Update every carried test that clicks a command button by its own name to use `byButtonText`, for `[osh-control-016 osh-control-017]`. Their own assertions stay the same.

## 2. Put one field on its own line

- [x] 2.1 Write the `[osh-control-038]` test in `view.test.mjs`. Show a target with a command of more than one field.
  - Assert each field's `label` has the class `osh-command-field`.
  - Mutation: Drop the class from the label. The test must fail.
- [x] 2.2 Add the class `osh-command-field` to each field's `label` in `view.js`.
- [x] 2.3 Add CSS to `osh-panel.css` for the new group.
  - `#osh-panel-control fieldset` is a flex column, with a border, a margin and a padding.
  - `.osh-command-field` is `display: block`.
  - `.osh-command-legend` has a smaller font weight than the send button.

## 3. Confirm the carried scenarios still pass

- [x] 3.1 Run `view.test.mjs` in full. Confirm `[osh-control-016]` and `[osh-control-017]`'s own tests pass with no change to their own assertions.
- [x] 3.2 Confirm `src/layers/oshControl/view.js` keeps 100% line, branch and function coverage.

## 4. Gates and review

- [x] 4.1 Run `make ratchet CHANGE=osh-control-panel-layout` and inspect the command verdict.
- [x] 4.2 Run `make gates CHANGE=osh-control-panel-layout` and inspect the command verdict and QA lines.
- [ ] 4.3 Run `/opsx:review osh-control-panel-layout` with both review agents.
- [ ] 4.4 Write `review.md` with the passed reviews and tree hash.
