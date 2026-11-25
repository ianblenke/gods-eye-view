**Tree read:** `/home/ianblenke/docker/gev-work/upstream-sync-12`, HEAD `693a5a757` (as you gave it; I could not run git), plus the uncommitted archive and the `openspec/specs/` edits. In the paths below, `<change>` is `openspec/changes/archive/2026-11-25-upstream-sync-12`, and all paths are relative to the tree.

**Round-1 STE findings:** S1 to S12 are corrected. The delta specs that I compared agree with `openspec/specs/`. The corrections added the faults below.

Verdict: FAIL

- [ ] FINDING major S1 `<change>/specs/cyclones/spec.md:14`, `openspec/specs/cyclones/spec.md:37` "this holds for a storm id that does not fit its agency, with six digits in lower case". This normative text has two meanings. "with six digits in lower case" can be part of the form that the agency needs. It can also limit the rejected ids to ids that have six digits. Under the second meaning, an id with five digits is not rejected, but `source.js:143` rejects it. Digits also have no lower case. Write: "**AND** this holds for a storm id that is not a prefix of its agency in lower case and then six digits". This agrees with the two `id` patterns at `source.js:53,59`.

- [ ] FINDING major S2 `<change>/specs/perimeters/spec.md:37,39`, `openspec/specs/perimeters/spec.md:103,105` "the proxy serves the last good rows as stale data if they exist" and "serves stale rows that are 24 hours old, and gives status 502 for older rows". The two lines disagree. The THEN line serves all rows that exist, but the new AND line and `firePerimeters.js:174-179` refuse perimeter rows that are older than 24 hours. "rows that are 24 hours old" can also mean only that exact age. Write: "**THEN** the proxy serves the last good rows as stale data if they exist, except old rows of the perimeter route" and "**AND** the perimeter route serves stale rows with an age of 24 hours or less, and gives status 502 for older rows".

- [ ] FINDING major S3 `<change>/proposal.md:12,30` "The change writes again the scenarios that the section Modified Capabilities names. It writes again the tests of `cyclones-001`, ..." This disagrees with the same file and with the tests.
  - Modified Capabilities also names `director-111`, which it calls new, so the change does not write it again.
  - The test list omits tests that this change renames, tags, adds or edits: `cyclones-003`, `cyclones-004`, `cyclones-005`, `cyclones-009`, `cyclones-011` and `perimeters-021`.
  - Write: "The change writes again each scenario that the section Modified Capabilities names, other than the new `director-111`. It writes again or adds tests of `cyclones-001`, `cyclones-003`, `cyclones-004`, `cyclones-005`, `cyclones-009`, `cyclones-011`, `perimeters-001`, `perimeters-005`, `perimeters-006`, `perimeters-021`, `recent-imagery-023` and `recent-imagery-027`."
  - Check with git whether the list also needs `perimeters-002` and `live-sources-007`.

- [ ] FINDING minor S4 `<change>/proposal.md:42` "the failed write of the child process". "write" is a verb that the text uses as a noun. Write: "The gate does not measure the child process in `blenderCameraPartialWrite.test.mjs` when it cannot write its file."

- [ ] FINDING minor S5 `<change>/specs/cyclones/spec.md:52`, `openspec/specs/cyclones/spec.md:128` "each other card has the variant `card` and the accent `#7fe6ed`". The new area label is also a tactical card (line 134 of the canonical spec), and its accent is not `#7fe6ed` (`labels.js:132`). The contrast with "the selected card" shows that the line means storm cards. Write: "**AND** each other storm card has the variant `card` and the accent `#7fe6ed`".

- [ ] FINDING minor S6 `src/layers/cyclones/labels.test.mjs:203,331,344` "storm identity resolves", "its lead labels", "names its storm". "resolves" and "names" are vague here, and "lead labels" and "lead-hour labels" are two terms for one thing. Write:
  - "[cyclones-011] a card id and a lead-hour label id give the storm id"
  - "[cyclones-009] a selected storm with a danger area gets an area label after its lead-hour labels"
  - "[cyclones-011] an area label id gives its storm id"

- [ ] FINDING minor S7 `src/layers/cyclones/source.test.mjs:1329,1378` "a JTWC warning is accepted", "is accepted ... takes no danger area". The titles use the passive voice and a vague "takes no". They also say "warning" where the spec says "storm". Write:
  - "[cyclones-003 cyclones-004 cyclones-005] the validator accepts a JTWC storm with its danger area and its own links, and never with a cone"
  - "[cyclones-003 cyclones-004 cyclones-005] the validator accepts each JTWC basin and outlook, and rejects a pending storm with a danger area"

- [ ] FINDING minor S8 `src/layers/perimeters/source.test.mjs:23,193` "yields", "marked stale for a day, then refuses". "yields" is not an approved word. "refuses" has no object, and "a day" and "24 hours" are two terms for one limit. Write:
  - "[perimeters-001] a successful response gives the fires and the pieces"
  - "[perimeters-021] a failed refresh serves the last snapshot as stale data for 24 hours, and then gives status 502"

- [ ] FINDING minor S9 `src/layers/perimeters/cards.forkBackfill.test.mjs:93` "a fire with all facts renders name, size, containment, and ages". The fire does not render the facts, and the articles are missing. Write: "[perimeters-006] the card of a fire with all facts shows the name, the size, the containment and the ages".

The new `STE-NOUN` warnings need no correction: "read" at `<change>/design.md:29` is a verb, and "abort" is a technical noun.

Verdict: FAIL

Not checked: I did not run git, code or the lint, I read only a filtered part of the gate log, and I did not review code comments or `DATA_SOURCES.md` for STE. S1 and S2 change scenario text, so the ratchet must run again.
