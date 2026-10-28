## Context

Base commit: `e2637a5e`, the merge of sync 9.
Upstream commit: `2bcdca1c9a2bc0a34074577cc5f4de01d4759233`. The lead took it from the output of `git ls-remote upstream main` on 2026-10-28.
The shared ancestor is the commit `15de9d73`, which sync 9 merged.

The first merge commit has the plan commit as its first parent and the commit `e608fee7` as its second parent. A second merge commit brings the commit `2bcdca1c`, which upstream published later on 2026-10-28. The second merge has no conflict.
The lead must record the check of the second parent of each merge commit in `review.md`.

The merge brings eleven pull requests (#1014, #1209, #1344, #1374, #1401, #1402, #1404, #1405, #1430, #1431 and #1439) and the commits between them.

## Conflict resolutions

A trial merge in a clone reports seven files with a conflict. The file `evidence/conflicts.txt` shows the list.

| File | Resolution |
|---|---|
| `CHANGELOG.md` | Keep the heading `[Unreleased]`, put the fork entries below it, and then keep the upstream sections from `[0.3.0]`. |
| `package.json` | Take the upstream version 0.3.0. The two descriptions differ only in the escape of one character. |
| `src/director/clock.test.mjs` | Keep the tests of both sides. Both sides added tests at the same place. |
| `src/director/playback.test.mjs` | Keep the tests of both sides. The two sides share the last line of the hunk. |
| `src/layers/perimeters/ownership.test.mjs` | Keep the tests of both sides. The two sides share the last line of the hunk. |
| `src/layers/perimeters/source.test.mjs` | Keep the tests of both sides. The two sides share the last line of the hunk. |
| `src/i18n/locales/zh-CN.json` | Keep the 20 fork texts and the two new upstream texts. |

## Decisions

### D1: No spec delta

The merge changes no requirement of the fork. No test with a scenario ID fails on the merged tree after the fixes of D2.
The merge adds no QA script and no layer token.

### D2: The new locale zh-Hant

Upstream adds the locale `zh-Hant`. Its catalog has no text for the 20 messages that the fork added, and it keeps one stale text, "Flying to Austin, TX...".
The test `[i18n-catalogs-001]` for `zh-Hant` fails for these 21 problems. The change adds the 20 texts in Traditional characters and removes the stale text. This is the same work as in sync 9 for `zh-CN`.

The two fork packages `reticulum` and `osh-layer` list the catalogs of `zh-CN`. The change lists `zh-Hant.json` in the same two packages.

The first fault removes one text of the 20 from `zh-Hant.json`. The second fault puts back the stale text. The test `[i18n-catalogs-001]` for `zh-Hant` must fail under each fault.

### D3: The adopt command

The merge brings upstream tests with no scenario ID and upstream files with a coverage gap.
The adopt command records them. The check of the second parent of each merge commit goes into `review.md`.

### D4: The image of the gates

`package-lock.json` changes only the version fields, so the image `gods-eye-view:local` runs the gates.

## Files and measures

The change edits `scripts/package-boundaries.json` and the catalogs of the locales, and it adds the plan, the evidence and the review files.

The trace gate checks the scenario IDs and the links. The ledger gate checks the gaps of the upstream files against the adopt records.
The four checks of `make precheck` check the format, the import directions, the package boundaries and the layer tokens. The prose lint checks STE.
The lead runs the gates in Docker. The lead also runs both review agents on the final tree.
