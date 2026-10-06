## Context

The tree starts at commit `290b5d2`, from the command `git rev-parse HEAD`.
The command `rg ste-lint- openspec/specs/ste-lint/spec.md` supplies the current scenario IDs.
The STE lint already gives warnings for passive voice and words that end in `-ing`.
Archived reviews repeatedly report word class faults and faults that corrections add.

## Goals and non-goals

Find likely noun uses of listed words without an error status.
Keep review severity tied to meaning and agreement with the project.
Do not supply a full dictionary or a grammar parser.

## Decisions

### D1: The rule and its limits

Add `STE-NOUN` in `scripts/spec/lib/ste.mjs` beside the other warnings.
Ignore letter case when you check exact words after a determiner.
Use the determiners that the delta spec lists.

Use the same prose tokens as the other warnings.
Exclude inline code and code blocks.
Exclude a word that starts with `"`, `'`, `“` or `‘`.
Thus `the "read file"` gives no warning.
Replace inline code with `CODE` in tagged test titles before the token check.

Do not match plurals or possessives.
Do not match a determiner token with punctuation before or after it.
Thus `(the read` and `"the read` give no warning.
The rule cannot find a verb that authors use as a noun after another word.

The warning names the word and does not cause an error status.

### D2: The word list and its source

Read the list `nounVerbs` from `openspec/ste/words.json` for each project check.
Treat an absent array as an empty list for old test fixtures.
Use `abort`, `destroy`, `install`, `read` and `skip`.
The archived reviews of `backfill-recent-imagery`, `osh-buffer-test-steady`, `upstream-sync-2`, `credential-boundary` and `ledger-adopt-reached` name these noun faults, respectively.
The scratch file `words.md` records the review paths, quotes and search command.
Omit `release` because it can name a version.

### D3: The guidance text

Change `.claude/agents/ste-adversary.md` so that a major finding needs evidence.
Classify STE faults as minor unless they give two meanings or disagree with the code, the specs or other prose.
Group faults of equal severity by file and numbered check.
Do not report an approved word because you prefer another.
Check changed lines and text that those lines make wrong in later rounds.
Also report each major finding that the round before did not correct.

Keep the scope sentences that the review tests check.
Add the guidance text about word faults to `.claude/agents/spec-adversary.md`.
The guidance change adds no spec scenario.
The gate test fixtures copy the real agent files.
The new guidance text must give no lint warning.
The gate tests check the warning counts.

## Checks

The host tests check the scenarios before the code change.
Each mutation changes production code and must fail the test of its scenario.
The host coverage check measures `ste.mjs`.
The lint command checks all prose, with the old archived prose.

The QA script purposes do not conflict with this change.
This change adds no QA script and changes no browser behavior.
The lead runs the ratchet command, the gates and the review after these host checks.

## Round correction decisions

Keep the behavior of the rule and correct the delta spec to describe it.
Remove the empty array default because `new Set(undefined)` is empty.
The absent-list test still applies.
The ratchet command at commit `e9b1bf8` wrote `ids.json` and `links.json`.
The command `git show --stat e9b1bf8` confirms these files.
It did not edit `gaps.json`.

The title test puts spaces around `should` inside the backticks.
Without these spaces, token punctuation hides the word even when the call to `cleanLine` is absent.
