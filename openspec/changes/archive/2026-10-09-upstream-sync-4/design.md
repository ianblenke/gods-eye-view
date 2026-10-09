## Context

Base commit: `ab11cf1b2eed35481e1e2a49d82dbdcb31bd9dec`.
Upstream commit: `6be25595b16491ce01ffd8d81e66921f321ee200`.
The command `git ls-remote upstream main` returned the upstream commit on 2026-10-09.
The shared ancestor is the commit `95fa8162`, which sync 3 merged.

The merge commit has the base commit as its first parent. The upstream commit is its second parent.
The lead must record the check of the second parent in `review.md`.

## Conflict resolutions

A trial merge in a scratch clone reports three conflicts. All three are content conflicts in text files.

| File | Resolution |
|---|---|
| `.env.example` | Keep the fork Gemini lines and the upstream `GEV_PREFER_CODEX_OAUTH` lines, one after the other. |
| `CHANGELOG.md` | Keep the fork Ontario entry and the upstream tile origin entry. |
| `SECURITY.md` | Keep the upstream Codex row and the fork Ontario row in the key table. |

## Decisions

### D1: The QA scripts

The two new upstream QA scripts have no QA tag in their first comment block.
Rule 22 gives them a synthetic header, when a valid adopt record names the script.
The adopt command writes the two records, so the fork does not change the upstream scripts.
The register test of `qa-scripts-023` passes the manifest to the register and treats each tracked script as adopted.

The test cannot read the adopt records, because the adopt command measures the tests before it writes the records.
The gate itself needs the records. It stops with QA-HEADER for a script that has no record.

### D2: The count

The tracked QA scripts rise from 88 to 90.
The scenario `qa-scripts-023` and the register test expect 90.
