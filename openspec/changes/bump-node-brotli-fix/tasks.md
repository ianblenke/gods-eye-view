## 1. Write the test

- [x] 1.1 Write the test for `ci-gates-013` in `src/tooling/spec/ciFiles.test.mjs`.

## 2. Change the files

- [x] 2.1 Change `.node-version` to 24.22.1.
- [x] 2.2 Change the base image in `Dockerfile` to `node:24.22.1-bookworm-slim`.
- [x] 2.3 Write the entry in `CHANGELOG.md`.

## 3. Check on the host

- [x] 3.1 Run `src/tooling/spec/ciFiles.test.mjs` on the host.
- [x] 3.2 Run the test against its fault.
- [x] 3.3 Run the STE lint on the host.
- [x] 3.4 Run `openspec validate bump-node-brotli-fix --strict` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=bump-node-brotli-fix`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=bump-node-brotli-fix` on the final tree.
