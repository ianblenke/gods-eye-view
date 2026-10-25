## Context

The flaw is in the decoder of Brotli. Only code that decodes untrusted Brotli data can be harmed. The server of this project uses `fetch` for its upstream calls. `fetch` sends `Accept-Encoding: gzip, deflate`, and it still decodes a response with `Content-Encoding: br`.
A visitor cannot make the server fetch a server of the visitor. The exposure is a bad or taken-over upstream.

The gates run in the Docker image, and the image must have the Node version of `.node-version` (`ci-gates-008`). So one change of two files moves the app container and the gates to the fixed version.

## Goals / Non-Goals

**Goals:**
- Run the app container and the gates on Node 24.22.1.
- Make a test fail when `.node-version` names a version without the fix.

**Non-Goals:**
- A change of the `engines` field, of the CI matrix, of the setup doctor or of the contributor documents.
- A check that rejects a Brotli response in the code. The new Node version removes the need.
- An update of the Node of the host.

## Decisions

### D1: Version 24.22.1

24.22.1 is the fixed version of the line 24. The app stays on the line 24, so the change moves only the patch and minor numbers.

### D2: The test reads a table of fixed versions

The test has a function that compares a version with the first fixed version of its line. These are 24.22.1 for the line 24 and 26.12.1 for the line 26. The test checks the function with literal samples and then checks `.node-version`. A version of another line below 26 gives false. A version above the line 26 gives true.
The test does not compare `.node-version` with the version of the Dockerfile, because `ci-gates-008` does it.

### D3: Gates on the new Node

The Docker image changes, so the lead runs the ratchet and the final gates on the new image. If a coverage count differs from the count of 24.21.0, the lead reports the difference before it goes on.

## Files and measures

Changed files: `.node-version`, `Dockerfile`, `src/tooling/spec/ciFiles.test.mjs` and `CHANGELOG.md`.
The trace gate checks the scenario ID `ci-gates-013` and its test. The prose lint checks STE.
The lead runs the checks of `make precheck` on the host where it can, and the gates in Docker. The two review agents read the final tree.

## Purpose at archive time

Run the gates in CI on the pinned Node version for the archived change of each pull request. Pin a Node version that has the fix for the Brotli flaw CVE-2026-111497.
