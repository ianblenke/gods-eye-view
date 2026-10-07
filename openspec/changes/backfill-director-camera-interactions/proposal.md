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
  The caller can recover with `clear` or `activate`.
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
The tag `BRDA` records branch data.

```text
BRDA:51,16,0,0
```
