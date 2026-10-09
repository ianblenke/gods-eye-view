## Source

Base commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.
No current specification names Ontario or the CCTV source packs.
Use the live-sources capability for the two new requirements. Do not change an old requirement sentence.

## Key decision

Use `ONTARIO_511_API_KEY` beside the CCTV Ontario variables in `.env.example`.
Read it only on the server. Use URLSearchParams for the documented `key` parameter.

Keep the catalog entry enabled. Add no source pack.
Use the request helper and warning text that never changes for each error.
The request helper writes one warning per process for absent or blank keys and one for request errors.

The loader keeps its row rules.

## Health decision

The layer health map holds entries for each camera. The catalog has no pack status field.
An absent or blank key supplies no source. Do not add a new health interface in this change.

## Documents

Correct DATA_SOURCES.md, .env.example, SECURITY.md, CHANGELOG.md and docs/CURRENT-STATE.md.
README.md calls the CCTV layer keyless because other packs have no key. Add the Ontario key detail beside the layer table in README.md.
The developer page gives no price for a key.

## Checks

Use fixtures only. Test the key, absent or blank keys, HTTP errors and thrown errors.
Run named mutations and the automatic mutation tool on changed lines.
Measure each changed code file on the host. Run each CCTV test file in one process before and after.

Run the STE lint after each edit group. The lead runs the image checks.
The purpose of the browser QA for the CCTV layer stays the same. Camera markers and feeds work in the browser.

## Pass 3 words

| Word | Meaning |
|---|---|
| pack | The Ontario camera pack as a whole. |
| loader | `loadOntarioSourcesFromOpenData`. |
| request helper | `readOntarioCameraRows`. |
| key | The value of `ONTARIO_511_API_KEY`. |
| server key | The key that stays on the server. |
| row | One record from Ontario 511. |
| source | One camera object that the loader returns. |
| view | One item in the upstream Views list. |
| warning | Text that console.warn writes. |
| log line | Text that console.log writes. |
| Ontario source cap | The limit of sources from Ontario; its default is `DEFAULT_ONTARIO_MAX_SOURCES`. |
| catalog cap | The limit of sources from all packs. |
| deployer | The person who sets up the application. |
| lead | The person who runs the image checks and review. |
| camera list | The data that the Ontario request returns. |

## Files and measures

Add `server/providers/cctv/ontarioRequest.js` for the request helper.
Change only the Ontario catch text in `server/providers/cctv/sources.js` after Pass 1.
Change the Ontario comment in `server/providers/cctv/constants.js`.

Add `src/data/cctvOntarioKey.test.mjs` and `src/data/cctvOntarioRows.test.mjs` for scenarios 002 to 009.
Change `scripts/package-boundaries.json` to list the request helper.
Change README.md, DATA_SOURCES.md, SECURITY.md, .env.example, CHANGELOG.md and docs/CURRENT-STATE.md for the key rule.

Change only the CCTV comment in `scripts/dev-fresh.sh`.

The trace gate checks the scenario IDs and test links. The coverage gate measures lines, branches and functions.
The ledger gate compares the sources.js gap with the recorded gap. The request helper must have 100% coverage.
The package boundary check measures import directions. The format check measures the adopted file format.

The prose lint checks STE. The OpenSpec commands check the change structure and print its requirements.
The named mutations and automatic mutations measure whether a code fault makes a test fail.
The lead runs the image gates and both review agents on the final tree.

## Purpose at archive time

The lead adds this sentence to the live-sources Purpose at archive time:
"The capability also covers the Ontario camera credential and the Ontario row rules."
