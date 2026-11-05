# The review corrections

Source commit: `74ec10e054a88935c7fcfce96300ea660f7c7747`.
Branch: `backfill-voice-panel`.
This report describes the worktree corrections.

## The findings

| Finding | Source | Correction | Mutation |
| --- | --- | --- | --- |
| Spec F1 | openspec/changes/archive/2026-11-03-backfill-voice-panel/mutation-results.json:1 | Rebuild every record from complete failure events. | A036-right |
| Spec F2 | src/voice/panel/backfill.test.mjs:3649 | Check all six callback values across OpenAI and Gemini state changes. | R070-all-false |
| Spec F3 | src/voice/panel/backfill.test.mjs:2821 | Check DOM state, listener removal and later requests after normal disposal. | R017-sync |
| Spec F4 | src/voice/panel/backfill.test.mjs:617 | Use distinct scenarios for Close and invalid listeners. | R071-close |
| STE F1 | openspec/specs/voice-panel/spec.md:300 | Name the observer as the object that the owner destroys. | R047-exact |
| STE F2 | openspec/specs/voice-panel/spec.md:348 | Use the final replay text and id in the scenario. | S055 |
| STE F3 | src/voice/panel/backfill.test.mjs:2731 | Use absent in the visibility test title. | R020-method |

The source search and mutation output check each correction.
The [event data](mutation-events.jsonl) keeps each complete failure event.

```text
openspec/changes/archive/2026-11-03-backfill-voice-panel/mutation-results.json:1
A036-right: KILLED; [voice-panel-053] The session boundary cancels an operation in case 0
src/voice/panel/backfill.test.mjs:3649
R070-all-false: KILLED; [voice-panel-070] An untracked event still sends an activity notice in case 0
src/voice/panel/backfill.test.mjs:2821
R017-sync: KILLED; [voice-panel-017] The owner destroys an open panel in case 0
src/voice/panel/backfill.test.mjs:617
R071-close: KILLED; [voice-panel-071] The close control ends the current presentation in case 0
openspec/specs/voice-panel/spec.md:300
R047-exact: KILLED; [voice-panel-040 voice-panel-047] The input method keeps its call in case 0
openspec/specs/voice-panel/spec.md:348
S055: KILLED; [voice-panel-055] The host compares reply identifiers in case 0
src/voice/panel/backfill.test.mjs:2731
R020-method: KILLED; [voice-panel-020] An absent visibility method does not prevent focus
R072-type: KILLED; [voice-panel-072] The model rejects an invalid listener in case 0
R-limit-dom: KILLED; The card can select a view during panel teardown in case 0
```

The Close tests use `voice-panel-071` for both views.
The invalid listener tests use `voice-panel-072` for five values.
The [known limit](design.md) describes card callbacks that select a view during teardown.
The [probe output](known-limits.txt) gives the DOM values for both views.

The invalid listener tests start at `src/voice/panel/backfill.test.mjs:771`.
Those probes check visible DOM nodes and false snapshot flags separately.
No production change corrects that behavior.

## The full sweep

The static scan checks every test definition in the panel directory.
It reports no test that checks only counts or key names.
It reports no assertion with identical operands.
The [test audit](test-audit.json) checks the runtime names, tags and assertion methods.
The manual sweep checks scenario clauses against their tests and source.

The corrections add these checks:

- Compare reply events with literal text and id values.
- Compare each preference control result with a literal snapshot.
- Seed stale status text before the host writes native status text.
- Compare each restored input method with its original function.
- Check literal method arguments and results.
- Check initial output knowledge before silent completion.
- Check a live deadline before the held-key expiry test.
- Check every panel listener before and after disposal.
- Check both panes and the card after Close and disposal.

The [mutation specification](mutations.json) gives each exact edit.
The [result data](mutation-results.json) gives each test that fails.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && node /home/ianblenke/docker/gev-tools/voicepanel/weak-shape-sweep.mjs
cd /home/ianblenke/docker/gev-work/voicepanel && node /home/ianblenke/docker/gev-tools/voicepanel/test-audit.mjs
cd /home/ianblenke/docker/gev-work/voicepanel && python3 /home/ianblenke/docker/gev-tools/voicepanel/review-recount.py
```

## The totals

The spec contains 72 scenarios.
The scope suite contains 405 tests, with 383 tagged tests.
The change tags 54 of 76 old tests and adds 329 tests.
The 22 old tests keep their names without tags.

The mutation specification contains 566 cases: 554 KILLED and 12 EQUIVALENT.
The sources are 426 decision cases, 76 key cases, 26 scenario cases and 38 review cases.
The recount command supplies these totals.
It also compares every failure list with its name filter and complete event list.

```text
Invalid failure links: 0
Failure-event mismatches: 0
A036-right actual failures: 22
```

## The scenario and test title changes

The lead must run a new ratchet for these changes:

- Add a condition to `voice-panel-017` that excludes a card callback that selects a view during teardown.
- Name the observer in the WHEN sentence of `voice-panel-047`.
- Replace the final replay phrase in the THEN sentence of `voice-panel-055`.
- Add callback field and state clauses to `voice-panel-070`.
- Add the Close scenario `voice-panel-071`.
- Add the invalid listener scenario `voice-panel-072`.

The archive spec now uses the live spec structure.
Both copies contain identical bytes, with the original live Purpose text.
No requirement changes its first sentence.

The runtime title comparison gives every old and new name below.
The new names include new tests and tests with a different title or tag.
The old reentrant tests become normal disposal tests; the scratch probes keep the exception.

```text
Removed names or tags:
src/voice/panel/backfill.test.mjs :: [voice-panel-017] A reentrant card cannot reopen a disposed snapshot in case 0
src/voice/panel/backfill.test.mjs :: [voice-panel-017] A reentrant card cannot reopen a disposed snapshot in case 1
src/voice/panel/backfill.test.mjs :: [voice-panel-017] The close control ends the current presentation
src/voice/panel/backfill.test.mjs :: [voice-panel-020] A missing visibility method does not prevent focus
src/voice/panel/backfill.test.mjs :: [voice-panel-028] The model rejects an invalid listener
src/voice/panel/backfill.test.mjs :: [voice-panel-037 voice-panel-040 voice-panel-047] The audio method updates output in case 0
src/voice/panel/backfill.test.mjs :: [voice-panel-037 voice-panel-040 voice-panel-047] The audio method updates output in case 1
src/voice/panel/backfill.test.mjs :: [voice-panel-037 voice-panel-040 voice-panel-047] The audio method updates output in case 2
src/voice/panel/backfill.test.mjs :: [voice-panel-054] An inactive state event reaches the card

New names or tags:
src/voice/panel/backfill.test.mjs :: [voice-panel-017] The owner destroys an open panel in case 0
src/voice/panel/backfill.test.mjs :: [voice-panel-017] The owner destroys an open panel in case 1
src/voice/panel/backfill.test.mjs :: [voice-panel-020] An absent visibility method does not prevent focus
src/voice/panel/backfill.test.mjs :: [voice-panel-037 voice-panel-040] The audio method updates output in case 0
src/voice/panel/backfill.test.mjs :: [voice-panel-037 voice-panel-040] The audio method updates output in case 1
src/voice/panel/backfill.test.mjs :: [voice-panel-037 voice-panel-040] The audio method updates output in case 2
src/voice/panel/backfill.test.mjs :: [voice-panel-069] An inactive state event reaches the card
src/voice/panel/backfill.test.mjs :: [voice-panel-070] The Gemini callback reports input and playback changes
src/voice/panel/backfill.test.mjs :: [voice-panel-070] The OpenAI callback reports each activity value across changes
src/voice/panel/backfill.test.mjs :: [voice-panel-071] The close control ends the current presentation in case 0
src/voice/panel/backfill.test.mjs :: [voice-panel-071] The close control ends the current presentation in case 1
src/voice/panel/backfill.test.mjs :: [voice-panel-072] The model rejects an invalid listener in case 0
src/voice/panel/backfill.test.mjs :: [voice-panel-072] The model rejects an invalid listener in case 1
src/voice/panel/backfill.test.mjs :: [voice-panel-072] The model rejects an invalid listener in case 2
src/voice/panel/backfill.test.mjs :: [voice-panel-072] The model rejects an invalid listener in case 3
src/voice/panel/backfill.test.mjs :: [voice-panel-072] The model rejects an invalid listener in case 4
```

## The limits and decisions

I agree with all seven findings.
The reentrant DOM exception remains a neutral known limit because this backfill changes no production behavior.
The first mutation segment stops at a reporter error; that interrupted case gives no verdict.
The later segment completes that case after the scratch reporter correction.
The host coverage result gives no calibrated gate verdict.
The lead owns the ratchet, final gates and review verdicts.
