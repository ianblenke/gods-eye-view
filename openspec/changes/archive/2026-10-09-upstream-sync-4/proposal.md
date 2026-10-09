## Why

The owner asks for syncs more often than once each week.
Upstream has 22 commits after the third sync.
The commits add a sign-in with a ChatGPT account for the voice feature and a change to the tile origin of vector tiles.

## What Changes

- Merge upstream commit `6be25595b16491ce01ffd8d81e66921f321ee200` into the base commit `ab11cf1b2eed35481e1e2a49d82dbdcb31bd9dec`.
- Resolve three content conflicts in `.env.example`, `CHANGELOG.md` and `SECURITY.md`. Keep both sides in each file.
- Change the register test and the scenario `qa-scripts-023` to expect 90 tracked QA scripts.
- Run the adopt command for the two new upstream QA scripts and for the new upstream code files.
- Keep the new upstream code as it is.

## Capabilities

### Modified Capabilities

- `qa-scripts`: The scenario `qa-scripts-023` names 90 tracked QA scripts and the synthetic header of two scripts.

## Impact

The merge changes 33 files. Six files are new. None of the 33 files is in `openspec/ownership.json`.
Rule 23: the six new files stay upstream code, because the fork does not write them. The manifest lists only paths that the fork writes.
The six files are `scripts/qa-voice-auth.mjs`, `scripts/qa-voice-auth-focus.mjs`, `server/providers/openai/codex-auth.js`, `src/codexOauthRealtime.test.mjs`, `src/voice/cloudVoiceAuth.js` and `src/voice/cloudVoiceAuth.test.mjs`.

Rule 25: the merge breaks one test with a scenario ID, the test of `qa-scripts-023`. The change writes the scenario again with the new count. It does not retire the scenario. The upstream tests have no scenario ID.

The new upstream code adds a route that starts the program `codex login` and reads a token file of Codex. The fork does not change this code.
The change opens no new coverage gap for owned code. The adopt command records the gaps of the new upstream files.

## Known limits and later changes

- Known limit `host-node`: Host tests run on a newer Node version than the image. Host coverage cannot replace the image measurement.
- Known limit `qa-not-run`: No gate runs the two new QA scripts, because they need a browser.
