## Why

The ratchet command measures tests but stops before the file gates.
The review process repeats measurements after document changes.
The owner approved both parts on October sixth.

## What Changes

- Use one measurement for the ratchet command and all gate comparisons.
- Add a document mode that refuses changed measurement inputs.
- Add Coordinated Universal Time (UTC) and phase times to gate logs.
- Add fast CI checks before review.
- Update the review process and the gate flow guidance.

## Capabilities

### Modified Capabilities

- `coverage-gate`: Add the document mode and command times.
- `gap-ledger`: Add the ratchet comparison verdict.
- `ci-gates`: Add fast checks and the document target.
- `change-review`: Add the review measurement sequence.

## Impact

The change edits `scripts/spec/gates.mjs`, gate library files, tests under `src/tooling/spec/` and `Makefile`.
The change also edits `AGENTS.md`, the review command and the gate flow text under `docs/`.
The ratchet writes `ids.json` and `links.json` and, when the ledger changes, `gaps.json` and `history.jsonl`.
The ratchet also records the snapshot hash in history and writes a snapshot under `.gev-cache/spec/`.
Host checks cannot establish the final image coverage gaps.
The lead must use the pinned image for that result.

## Known limits and later changes

- Host coverage cannot replace the pinned image measurement.
- Document gates allow changes only under `openspec/changes/`, `openspec/specs/` and `openspec/trace/`.
- A QA header change in `scripts/qa-*.mjs` at archive time needs another ratchet command or full gates on the final tree.
- Any change outside the three paths needs another ratchet command or full gates on the final tree.
- Dirty ratchet history prevents trust even after the files return to HEAD.
- An absent snapshot needs another ratchet command.
- The snapshot hash depends on history integrity, as the ledger already does.
- An interrupted command has no finished line or verdict.
- The final full gates and CI remain necessary.
- The first line names the command or trust state; the UTC start line follows it.

The command `check` without `--no-measure` replaces the cache and removes the ratchet snapshot.
Later document gates need another ratchet command.
