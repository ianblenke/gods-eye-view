## Why

The owner asks for syncs more often than once each week.
Upstream has 22 commits after the third sync.
The commits add a login with a ChatGPT account for the voice feature and a change to the tile origin of vector tiles.

## What Changes

- Merge upstream commit `6be25595b16491ce01ffd8d81e66921f321ee200` into the plan commit `7c1a511e`. The plan commit has the base commit `ab11cf1b2eed35481e1e2a49d82dbdcb31bd9dec` as its parent.
- Resolve three content conflicts in `.env.example`, `CHANGELOG.md` and `SECURITY.md`. Keep both sides in each file.
- Change the register test and the scenario `qa-scripts-023` to expect 90 tracked QA scripts.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Keep the upstream code as it is.

## Capabilities

### Modified Capabilities

- `qa-scripts`: The scenario `qa-scripts-023` names 90 tracked QA scripts.

## Impact

The merge changes 33 files and adds six of them. None of the 33 files is in `openspec/ownership.json`.

Rule 23: the six added files are upstream code, because the fork does not write them. The manifest lists only paths that the fork writes.
The six added files are `scripts/qa-voice-auth.mjs`, `scripts/qa-voice-auth-focus.mjs`, `server/providers/openai/codex-auth.js`, `src/codexOauthRealtime.test.mjs`, `src/voice/cloudVoiceAuth.js` and `src/voice/cloudVoiceAuth.test.mjs`.

Rule 25: the merge breaks one test with a scenario ID, the test of `qa-scripts-023`. The change writes the scenario again with the new count. It does not retire the scenario.
The tests that the merge adds or changes have no scenario ID.
The QA exception of the `ownership` capability applies to the two added QA scripts and gives them the synthetic header. The scenario counts the two scripts and names no header for them.

The upstream code adds two routes and one mode of the token route. One route starts the program `codex login`. Each of the three reads the auth file of Codex. The fork does not change this code.
The change opens no new coverage gap for owned code. The adopt command records the gaps of the upstream files that the merge brings.

## Known limits and later changes

- Known limit `host-node`: Host tests run on a newer Node version than the image. Host coverage cannot replace the image measurement.
- Known limit `host-skip`: Two test files skip all their tests on the host. The host Node version is not the one that the tests need. The image uses that version.
- Known limit `qa-not-run`: No gate runs the two added QA scripts, because they need a browser.
