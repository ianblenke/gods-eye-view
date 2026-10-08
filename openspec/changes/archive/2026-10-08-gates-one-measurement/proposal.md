## Why

The ratchet command measures tests but stops before the file checks.
The review process repeats measurements after document changes.
The owner approved both parts on October sixth.

## What Changes

- Use one measurement for the ratchet command and all gate comparisons.
- Add a document mode that refuses changed input files.
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
Host checks cannot establish the final container coverage gaps.
The lead must use the pinned container for that result.

## Known limits and later changes

- Host coverage cannot replace the pinned container measurement.
- Document gates allow changes only under `openspec/changes/`, `openspec/specs/` and `openspec/trace/`.
- A QA header change in `scripts/qa-*.mjs` at archive time needs another ratchet command or all gates on the final tree.
- Any change outside the three allowed paths needs another ratchet command or all gates on the final tree.
- Dirty ratchet history prevents trust even after the files return to HEAD.
- An absent snapshot needs another ratchet command.
- Only the document mode compares the snapshot file with the snapshot hash.
The ratchet reads the hash from history to skip a history line.
- The document mode is a local convenience. All gates on the final tree and CI measure again.
- An exception can cause a finish line without a verdict. A process that stops early can have neither line.
- All gates on the final tree and CI remain necessary.
- The first line names the command or trust state; the UTC start line follows it.

The command `check` without `--no-measure` replaces the cache and removes the ratchet snapshot.
Later document gates need another ratchet command.

Git content comparisons can miss files with `assume-unchanged` or `skip-worktree`.
The commit hash must have forty hexadecimal digits.
The mode does not check commit ancestry. A hash of another branch still has to pass the content comparison.
Changed code files and test files cause refusal even under the three allowed paths.

The image shell was proven by the image runs of the ratchet and of the document mode.
CI on Ubuntu supplies the first comparison of host and image marker results.
