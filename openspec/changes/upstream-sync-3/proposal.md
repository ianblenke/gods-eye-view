## Why

The owner requests routine syncs more often than once each week. Upstream code is vendored with its recorded gaps.
The upstream branch has 255 commits after the shared base `e7707d9a0f34d9fbffc300023c319f95caa5be30`.

The fork keeps OSH code in this project. No OSH code goes upstream.

## What Changes

- Merge upstream commit `95fa816232456a6831172befa2f1b34b9ee73794` into canonical base `e2437f945215860c42b5d8bba6834c85f93a90ce`.
- Resolve 16 content conflicts with upstream code and the small fork additions.
- Keep OSH registration, token `3`, package entries and the Taiwan preset.
- Keep the credential boundary, spec scripts and spec CI job.
- Add four-tag headers to five upstream QA files. Count 88 files in the register test.
- Keep the two render test cleanup blocks after the pristine probe finds two pending timers.
- Correct the token width and catalog count assertions for OSH and Street Level.
- Document the optional Gemini script credential and keep the credential inventory assertion.

The merge commit is `debfde0982ad21e3359340162dbca25d592c392f`.
Its second parent is the full upstream commit above. The upstream remote main check returned that commit on 2026-10-08.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- credential-boundary: Change scenario `credential-boundary-003` to list the three public browser names.

## Impact

The upstream diff from the shared base changes 435 files. The design lists the conflict resolutions and host evidence.
The lead must record the upstream gaps in the image. The strategy estimate is 330 to 350 adopt entries.
No project adopt, ratchet or full gate command runs in this host task. The host lint command is the allowed exception.

Upstream adds Street Level, a public Mapillary token, voice comparison tools, default cost limits and browser security controls.
The fork keeps its OSH implementation files equal to the canonical base. Only the shared registration and boundary files need the fork additions.

## Known limits

The image must measure coverage and trace gaps. The lead must check the lock file and get both review results.
This host task creates no `review.md` and sends no push.

The owner allows the public Mapillary name in scenario `credential-boundary-003`.
SECURITY.md documents the token as public. DATA_SOURCES.md lists its viewer and Graph API use.
docs/CURRENT-STATE.md describes Street Level. server/providers/mapillary/constants.js states that the token lives in the browser by design.

This token must not be a Google, OpenAI or other server credential.
The three names must remain in order. With no parameters, each define value must be undefined.
The server Google key must stay outside the defines. The key-shaped literal test `credential-boundary-004` stays unchanged.

The first requirement sentence stays unchanged to keep the other scenario hashes. The lead must assess its two-credential text.
The unchanged upstream ranking time test also fails under the full suite load.

The host lint rejects `expose` in the required unchanged sentence of the new delta file.
The lead must resolve this conflict before the image steps. Do not change the word list or scenario hashes.
