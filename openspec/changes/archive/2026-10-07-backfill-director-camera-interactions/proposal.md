## Why

The backfill records camera moves and shot interactions at commit `290b5d2`.
The source files of `src/director` stay the same at this commit and at main.
The first director change records time and playback.
This change adds requirements to the same capability.

## What Changes

Add camera and interaction specs and tests.
Check the tests with code mutations.
Keep production code and browser QA scripts unchanged.

## Capabilities

- Add requirements to `director`.

## Impact

The evidence records the ledger sweep and host coverage.
The lead measures ledger gaps with Node 24.

## Known limits and later changes

- `session-finally-branch`: line 51 of the interaction session cannot reach normal completion before `finally`.
  The `try` and `catch` blocks both return.
- `session-callback-busy`: a state callback error at line 34 rejects dispatch and leaves the session busy.
  The adapter does not run.
  The caller can reset the state with `clear` or `activate` only if the callback does not throw an error.
  State callback errors at lines 16 and 25 also leave the new state but end the call.
  A state callback error at line 56 rejects dispatch and replaces the adapter result.
- `qa-headers-ahead`: the camera and interaction QA scripts name `director` without `pending:scenes`.
  Pick, card control, ownership and camera revoke belong to later scene changes.
  This pass does not change the QA scripts.
- Tests without tags check code outside this change.

```text
src/director/camera.test.mjs:
v3 unversioned bloom already uses scale 2 and is not migrated again in later formats
src/director/interactions/interactions.test.mjs:
settled pack shots cannot take the same-shot seek shortcut after Stop released geometry
actions preserve camera refusal, layer admission signal and explicit transition cap
```

The host lcov command records the branch at line 51 as follows.
BRDA means branch data.

```text
BRDA:51,16,0,0
```

- `session-builtin-patch`: a patched Map size getter or `clear` method can create an inactive session that holds an interaction.
  Rows m149 and m253 are equivalent for the public API of the module only.
  The m253 bound is a patched `AbortSignal` `aborted` getter.
  A patched built-in prototype is outside the public API of the module.

- `session-abort-event`: an adapter can send an abort event while the supplied signal still reports aborted false.
  The session then returns false without an adapter result.
- `missing-rows-and-lines`: the round 3 spec report names tests, rows and scenario lines that need a new ratchet.
  - No row moves `changed(state());` at line 34 of the session after the race. The new tests that read the state inside each adapter call would fail it.
  - Scenario 048 has no AND line for the 0.55 test, which gives latitude 11.271 degrees.
  - The test of scenario 073 reads `signal.aborted` only before the abort event.
  - No test of this change rejects pose text at version 4 or later. The change `version < 3` to `version !== 3` survives.
  - The change `t <= 0.5` in the split of the cubic sample is equal at 0.5.
  - The text "of the same shot" in scenario 060 has two readings. The tests use the shot that holds the shot action field.
- `probe-file`: the probe `evidence/probe-equivalent.txt` is JavaScript with a fixed path and no gate runs it.
  Its re-entrant case acts in the callback of `activate`, not in the state callback at line 34.
  The claims for m149 and m253 rest on a reading of lines 10 to 60 of `session.js`.
- `spec-wording-minors`: the round 3 STE report names wording faults in the delta spec and in test titles.
  Examples are "of the same shot", "refuses adapter call" and "and no content runs".
  Other examples are "accepts a session change" and "a camera stays a shot without a move".
  The scenario text for the abort event is another example.
  A change of scenario text or of a test title needs a new ratchet and a new archive, so the review accepts them by name.
