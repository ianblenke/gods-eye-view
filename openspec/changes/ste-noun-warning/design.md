## Context

The tree starts at commit `290b5d2`, from the command `git rev-parse HEAD`.
The command `rg ste-lint- openspec/specs/ste-lint/spec.md` supplies the current scenario IDs.
The STE lint already gives warnings for passive voice and words that end in `-ing`.
Archived reviews repeatedly report word class faults and faults that corrections add.

## Goals and non-goals

Find likely noun uses of listed verbs without an error status.
Keep review severity tied to meaning and agreement with the project.
Do not supply a full dictionary or a grammar parser.

## Decisions

### D1: The rule and its limits

Add `STE-NOUN` in `scripts/spec/lib/ste.mjs` beside the other warnings.
Ignore letter case when you check exact words after a determiner from the delta spec.
Use the same prose tokens as the other warnings.
Exclude inline code and code blocks.
Exclude single-word identifiers in straight or curved quotes.
Clean inline code in tagged test titles before the token check.

Do not match plurals or possessives.
Do not match a determiner with punctuation after it.
The rule cannot find a verb that authors use as a noun after another word.

The warning names the word and does not cause an error status.

### D2: The word list and its source

Read `nounVerbs` from `openspec/ste/words.json` for each project check.
Treat an absent array as an empty list for old test fixtures.
Use `abort`, `destroy`, `install`, `read` and `skip`.
The archived reviews of `backfill-recent-imagery`, `osh-buffer-test-steady`, `upstream-sync-2`, `credential-boundary` and `ledger-adopt-reached` name these noun faults, respectively.
The scratch file `words.md` records the review paths, quotes and search command.
Omit `release` because it can name a version.

### D3: The guidance text

Change `.claude/agents/ste-adversary.md` to demand evidence for major findings.
Classify word class faults as minor unless they give two meanings.
Group each class of fault by file.
Exclude preferences about words.
Limit later rounds to changed lines and new faults that corrections add.

Keep the scope sentences that the review tests check.
Add the sentence about word faults to `.claude/agents/spec-adversary.md`.
The guidance change adds no spec scenario.
The gate test fixtures copy the real agent files.
The new sentence gives no lint warning, so the gate tests keep their old counts.

## Checks

The host tests check the scenarios before the code change.
Each mutation changes production code and must fail the test of its scenario.
The host coverage check measures `ste.mjs`.
The lint command checks all prose, with the old archived prose.

The QA lines of the gate output do not apply to this change.
This change adds no QA script and changes no browser behavior.
The lead runs the ratchet command, the gates and the review after these host checks.
