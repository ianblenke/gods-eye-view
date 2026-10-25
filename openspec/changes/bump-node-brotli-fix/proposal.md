## Why

On 2026-10-21 Node.js disclosed the flaw CVE-2026-111497 in its Brotli decoder. A response with crafted Brotli data can write outside a buffer. The fixed Node versions are 22.23.4, 24.22.1 and 26.12.1.

The app container runs Node 24.21.0, which has the flaw. The server calls many upstream services with `fetch`. `fetch` asks only for gzip and deflate, but it also decodes Brotli when an upstream sends it. So a bad or taken-over upstream can send such a response.

The owner said yes on 2026-10-25 to a small change that moves the image to a fixed Node version.

## What Changes

- Change the Node version of `.node-version` and of the base image in `Dockerfile` from 24.21.0 to 24.22.1.
- Add a requirement and one scenario to `ci-gates`. A test reads `.node-version` and refuses a Node version without the Brotli fix.
- Write the entry in `CHANGELOG.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ci-gates`: A new requirement says that the pinned Node version has the Brotli fix. The old requirements stay as they are.

## Impact

Changed files: `.node-version` and `Dockerfile` (both owned), `src/tooling/spec/ciFiles.test.mjs`, `CHANGELOG.md` and the `ci-gates` delta spec.
The change adds no dependency, no layer, no QA script and no code file. It opens no gap in `openspec/trace`.
The image changes, so the gates run on the new Node version. The coverage counts can differ from the counts of Node 24.21.0. The ratchet run shows if they do.

## Known limits and later changes

- Known limit `floor`: The `engines` field of `package.json`, the CI jobs with Node 24.14.0, the setup doctor and the contributor documents keep the floor 24.14. These files are upstream files, and a contributor machine does not run the server for other people. A later change can raise the floor.
- Known limit `host`: The Node of the host is not part of this change. The owner or the lead updates it with the package manager. The host Node was 26.11.1 on 2026-10-25, and the fixed version of that line is 26.12.1.
- Known limit `fixed-table`: The test knows the fixed versions of the lines 24 and 26 only. A new line needs a new row in the test.
