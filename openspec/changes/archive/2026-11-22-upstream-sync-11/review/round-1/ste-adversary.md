Verdict: FAIL

Commit read: `08b1338c2` in `/home/ianblenke/docker/gev-work/upstream-sync-11`. Round 1, scope `full`. I did not re-run the lint. The older lint log `sync11-lint.log` has no warnings for new prose beyond those it names for `upstream-sync-11/` (design.md:45, proposal.md:29, coverage-gate spec:4, share-codec spec:23 and 50, voice-panel spec:69). The old-spec text copied unchanged was not checked. I did not count the 196 retired IDs.

Paths below are in `/home/ianblenke/docker/gev-work/upstream-sync-11/openspec/changes/archive/2026-11-22-upstream-sync-11/`, unless the path starts with `src/`.

- [x] FINDING major proposal.md:28,30-33 "None." Disagrees with the delta specs.
  - The change adds `specs/cable-bundled-source/spec.md` and `specs/cockpit-contact-dot/spec.md`. They are new capability files that carry new purpose lines.
  - The change also adds requirements to `coverage-gate` and `spec-trace`. The "Modified Capabilities" list names neither.
  - Write: list `cable-bundled-source` and `cockpit-contact-dot` under New Capabilities. Add `coverage-gate` and `spec-trace` to Modified Capabilities.

- [x] FINDING major proposal.md:20 and design.md:89-97 "Change the gate scripts in three ways." / "Three changes of the gate scripts".
  - The change has four gate changes. The fourth is the limit of parallel test processes: `specs/coverage-gate/spec.md:40-46`, task 1.22, and `scripts/spec/gates.mjs:120`.
  - D8 lists only three. It also says "The owner approved the second change", and the reader cannot tell which one that is.
  - Write: "four ways" and add a fourth bullet for `coverage-gate-107`. Name the approved change by its scenario ID.

- [x] FINDING major specs/coverage-gate/spec.md:13,18 "The gate MUST excuse three findings for a test file that the ownership manifest does not list." and "MUST excuse a finding only when the file ... records".
  - Two normative sentences give two meanings. The first says the gate always excuses these findings for an upstream file. The second says it excuses them only when the record lists them.
  - Write: "The gate MUST excuse one of three findings for an upstream test file only when the record lists the file and the finding code."

- [x] FINDING major specs/coverage-gate/spec.md:37-38 "the command stops for any other error".
  - `scripts/spec/gates.mjs:575` drops `GATES-FINDING-STALE` and `QA-HEADER` in the findings command. It also drops errors that the run recorded as findings. So "any other error" is false.
  - Write: "the command stops for each error except `GATES-FINDING-STALE`, `QA-HEADER` and the findings that it records".
  - Related, minor: scenario 105 (line 31) says nothing about why `GATES-TEST-LEAK` has no stale error. `scripts/spec/lib/upstream-findings.mjs:43` skips it. Add one sentence that says so.

- [x] FINDING major tasks.md:4,5,8,10,36 Each of these tasks gives two sequential instructions.
  - Examples: "Merge ... and resolve", "Keep ... and give", "Add ... and regenerate", "Adapt ... and delete", "Fetch ... and check".
  - Write one task for each verb.

- [x] FINDING major src/voice/panel/inactivityBranches.test.mjs:27, src/voice/panel/nativeActivityBranches.test.mjs:34,48 Test titles do not match their scenario IDs.
  - `[voice-panel-034]` is "Cancel stale timers". The test at line 27 checks the default of five minutes for a limit that is not valid. The spec puts the selected minutes under `voice-panel-030`.
  - `[voice-panel-040]` is "Keep native method calls". The test at line 34 checks that an already aborted signal destroys the observer. That is the topic of `voice-panel-047`.
  - `[voice-panel-045]` is "Accept silent responses". The test at line 48 checks speech events with no type. That is the topic of `voice-panel-036`.
  - Move each test to the matching scenario ID, or write a scenario for it.

- [x] FINDING minor proposal.md:37 "three test files of the fork backfills".
  - `design.md:65-70` keeps four fork backfill test files, and `openspec/ownership.json:175-185` lists four `forkBackfill` files plus seven other new test files.
  - The count may be right if one file was already owned. Give the count that the diff shows.

- [x] FINDING minor design.md:24 "forbids to make a gate weaker". Wrong grammar, and "forbid" is not approved. Write: "says: do not make a gate weaker."

- [x] FINDING minor design.md:44 "the tests of the ledger use the one-character rows as the old ledger, and they remove `gdacs` where they need the last digit free". Two possible meanings. Write what the tests do, in two short sentences.

- [x] FINDING minor design.md:22,26-30 and proposal.md:12 "Port" and "ratchet" each have two meanings.
  - "Port" is a verb (move code) and a noun (renderer port). "ratchet" is a test name (`noCesiumOutsideRender`) and the command `make ratchet`.
  - Use "move" for the verb. Write "boundary tests" for the tests.

- [x] FINDING minor proposal.md:5 "The fork changed 2006 commits in the same time. 153 files changed on both sides."
  - Write: "The fork has 2006 new commits in the same time. 153 files changed on both sides."
  - The same line reads "Its tree changed 4032 files". It should say "Its tree has 4032 changed files".

- [x] FINDING minor proposal.md:14 "with its file `images.js`". "its" can refer to `sceneLayer`, `skywatchScenes` or `up42Scenes`. Write: "and the file `images.js` of `up42Scenes`".

- [x] FINDING minor proposal.md:47 "do not draw over the images by a rule". Unclear. Write: "No rule puts the outlines above the images."

- [x] FINDING minor proposal.md:32 "name the neighbour layer". "neighbour" is not approved. Write: "name the layer next to it".

- [x] FINDING minor specs/share-codec/spec.md:4,8,12,16,20,24,28,32 "style snow", "pinned".
  - "style snow" is a noun string that is not clear. Write: "the style named snow".
  - "pinned" is not an approved verb. Write: "checked".

- [x] FINDING minor specs/share-codec/spec.md:36,40, specs/hud-markings/spec.md:4, specs/ghostmaps/spec.md:8 "the scenarios `X`" with one ID. Write the singular: "the scenario".

- [x] FINDING minor specs/coverage-gate/spec.md:14-16,21-22,36 and src/tooling/spec/gates.test.mjs:1049 "excuse" and "excuses". "excuse" is not an approved STE verb. Write: "give no error for".

- [x] FINDING minor specs/spec-trace/spec.md:3 "Removal of a scenario by a modified requirement". "Removal" is a verb used as a noun. Write: "Scenario that a modified requirement drops".

- [x] FINDING minor specs/cable-bundled-source/spec.md:8 "makes the source". "make" is vague. Write: "creates the source".

- [x] FINDING minor test names, passive voice and a non-technical -ing word.
  - `src/data/cockpitContactDot.test.mjs:5` "is drawn". Write: "the cockpit draws the contact dot once".
  - `src/voice/panel/nativeActivityBranches.test.mjs:20` "a failing text callback". "failing" is an -ing word that is not a technical name. Write: "a text callback that throws".
  - `src/voice/panel/nativeActivityBranches.test.mjs:34` and `src/voice/panel/inactivityBranches.test.mjs:36` "already aborted". Passive, and the active form is possible. Write: "a signal that has aborted".
  - `src/share/wireBranches.test.mjs:5` "is refused". Write: "the codec refuses a value past the limit".
  - `src/tooling/spec/specs.test.mjs:238` "counts ... as removed, and no other scenario". Ambiguous. Write: "counts only a scenario that a modified requirement drops as removed".

- [x] FINDING minor design.md:4 "sync 12 takes them". "takes" is vague. Write: "sync 12 merges them".

Skipped or not checked: I did not count the 196 retired IDs, and I did not check the `openspec/specs/` copies against the delta text. I assumed the old scenario text in the delta specs is unchanged.
