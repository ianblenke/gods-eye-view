## Source

Base commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.
No current specification names Ontario or the CCTV source packs.
Use the live-sources capability for the two new requirements. Do not change an old requirement sentence.

## Key decision

Use `ONTARIO_511_API_KEY` beside the CCTV Ontario variables in `.env.example`.
Read the key only on the server. Use URLSearchParams for the documented `key` parameter.

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

Use fake responses only. Test the key, absent or blank keys, HTTP errors and thrown errors.
Run named mutations and the automatic mutation tool on changed lines.
Measure each changed code file on the host. Run each CCTV test file in one process before and after.

Run the prose lint after each edit group. The lead runs the Docker image checks.
The purpose of the browser QA for the CCTV layer stays the same. Camera markers and feeds work in the browser.

## Pass 6 words

| Word | Meaning |
|---|---|
| pack | The Ontario camera pack as a whole. |
| loader | `loadOntarioSourcesFromOpenData`. |
| reset hook | `_resetOntarioRequestForTest` sets both warning flags to false. It is a test function with no scenario of its own. |
| request helper | `readOntarioCameraRows`. |
| key | The value of `ONTARIO_511_API_KEY`. |
| server key | The key that stays on the server. |
| row | One record from Ontario 511. |
| source | One camera object that the loader returns. |
| view | One item in the upstream Views list. |
| console channel | One of console.log, console.info, console.debug, console.warn, console.error and console.dir. |
| warning | Text that console.warn writes. |
| fixture | The function in each Ontario test file that sets the key and replaces fetch and the console channels. |
| log line | Text that any console channel writes. |
| developer key | The key that Ontario 511 gives to an account holder. |
| Docker image | The container image for the project checks. |
| camera image | One camera frame. |
| view ID | The ID in a camera URL path. |
| empty row list | The empty list that the request helper returns. |
| empty source list | The empty list that the loader returns. |
| beforeEach callback | The callback that calls the reset hook before each test. |
| Ontario source cap | The limit of sources from Ontario; its default is `DEFAULT_ONTARIO_MAX_SOURCES`. |
| catalog cap | The limit of sources from all packs. |
| deployer | The person who installs the application. |
| lead | The person who runs the Docker image checks and review. |
| camera list | The data that the Ontario request returns. |

## Pass 7 words

| Word | Meaning |
|---|---|
| host | The computer outside the Docker image. |

## Files and measures

Add `server/providers/cctv/ontarioRequest.js` for the request helper.
Use the reset hook before each key test. Import the module once without a query string.
The reset hook is a test function with no scenario of its own. The current tests cover all its code.

Two Rows tests check the initial warning flags without the reset hook.
The coverage gate includes the reset hook in its line, branch and function counts.

Change only the Ontario catch text in `server/providers/cctv/sources.js` after Pass 1.
Change the Ontario comment in `server/providers/cctv/constants.js`.

Add `src/data/cctvOntarioKey.test.mjs` and `src/data/cctvOntarioRows.test.mjs` for scenarios 002 to 009.
Change `scripts/package-boundaries.json` to list the request helper.
Change README.md, DATA_SOURCES.md, SECURITY.md, .env.example, CHANGELOG.md and docs/CURRENT-STATE.md for the key rule.

Change only the CCTV comment in `scripts/dev-fresh.sh`.

The trace gate checks the scenario IDs and test links. The coverage gate measures lines, branches and functions.
The ledger gate compares the sources.js gap with the recorded gap. The request helper must have 100% coverage.
The package boundary check measures import directions. The format check finds files that do not use the project code style.

The prose lint checks STE. The OpenSpec commands check the change structure and print its requirements.
The named mutations and automatic mutations measure whether a code fault makes a test fail.
The lead runs the Docker image gates and both review agents on the final tree.

## Purpose at archive time

The lead adds this sentence to the live-sources Purpose at archive time:
"The capability also has requirements for the Ontario camera key. It has requirements for the Ontario row rules."
