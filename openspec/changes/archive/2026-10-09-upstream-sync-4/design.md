## Context

Base commit: `ab11cf1b2eed35481e1e2a49d82dbdcb31bd9dec`.
Upstream commit: `6be25595b16491ce01ffd8d81e66921f321ee200`.
The command `git ls-remote upstream main` returned the upstream commit on 2026-10-09.
The shared ancestor is the commit `95fa8162`, which sync 3 merged.

The first parent of the merge commit is the plan commit `7c1a511e`. The plan commit has the base commit as its parent.
The upstream commit is the second parent.
The lead must record the check of the second parent in `review.md`.

## Conflict resolutions

A trial merge in a scratch clone reported three conflicts. All three are content conflicts in text files.

| File | Resolution |
|---|---|
| `.env.example` | Keep the fork Gemini lines and the upstream `GEV_PREFER_CODEX_OAUTH` lines, one after the other. |
| `CHANGELOG.md` | Keep the fork Ontario entry and the upstream tile origin entry. |
| `SECURITY.md` | Keep the upstream Codex row and the fork Ontario row in the key table. |

## Decisions

### D1: The QA scripts

The two added upstream QA scripts have no QA tag in their first comment block.
Rule 22 gives each of them a synthetic header, when a valid adopt record names that script.
The adopt command writes the two records, so the fork does not change the upstream scripts.

### D2: The register test

The register test of `qa-scripts-023` passes the manifest and one adopt record for each tracked script to the register.

The test cannot read the adopt records, because the adopt command measures the tests before it writes the records.
The gate itself needs the records. It stops with QA-HEADER for a script that has no record.

### D3: The scenario

The `ownership` capability says that `qa-scripts-023` does not apply within the exception of the synthetic header.
So the scenario names no header for the two scripts, and the register test asserts no list of them.

### D4: The count

The tracked QA scripts increase from 88 to 90.
The scenario `qa-scripts-023` and the register test expect 90.
