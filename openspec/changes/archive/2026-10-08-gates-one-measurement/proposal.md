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
The ratchet also reads the hash from history.
It adds no measurement line when the hash, the commit and the dirty list equal those of the last line.
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

The image runs of the ratchet and of the document mode did not show the marker loop. That loop runs only for an ignored protected file.
One later image run had one ignored test file. The mode refused and named that file, so the marker loop works in the image shell.
CI on Ubuntu gives the first comparison of host and image marker results.

These findings of review round three stay open. Ian Blenke accepts each of them by name in `review.md`.

- `rule-8-unpinned`: No test pins rule 8 of `AGENTS.md`, which names the command output as the verdict source.
- `rule-9-bound`: Rule 9 of `AGENTS.md` holds for `check`, `ratchet` and the document mode. The commands `init`, `rebaseline`, `adopt` and `waive` print `Gates passed.` with no `Command:` line.
- `local-env-document-test`: No document mode test runs the local environment gate. A changed QA script is a code file, so the mode refuses it and the QA header gate cannot fire there.
- `flag-scan-wide`: The coverage flag gate reads all tracked code, `.json` and `.yaml` files. Only files under the three allowed paths can change in the mode. The sentence in the coverage-gate spec says less.
- `nested-node-modules`: The `node_modules` exclude of the marker command has a test only at the top level. A nested folder gets markers, which costs time and hides no gap. Two mutation rows of this exclude are equivalent, because the `**/*.mjs` pathspec covers both.
- `nested-gev-cache`: The trust check exempts a path with the prefix `.gev-cache/`. The mutant that uses `includes` survives, because no test refuses a protected ignored file in a nested `.gev-cache/` folder.
- `spec-wording-minors`: The wording minors in the delta specs, `AGENTS.md`, `review.md`, the roadmap text, the Makefile comment and the test titles need a new ratchet. The STE report lists them.
