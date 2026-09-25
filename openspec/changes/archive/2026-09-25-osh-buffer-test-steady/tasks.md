## 1. The test

- [x] 1.1 Change the test `[osh-090]` with real HTTP clients in `src/data/oshLive.test.mjs`. Keep its name.
  - The test waits after each message until the client that reads has got it.
  - The client that does not read has a corked response.
  - The test stops after 40 messages, and it does not import `node:net`.
- [x] 1.2 Run the file `src/data/oshLive.test.mjs` on one CPU core, six times.
- [x] 1.3 Run each mutation below. `[osh-090]` fails each time.
  - B1: remove the check of `writableLength` in `server/providers/osh.js`.
  - B2: raise the limit of the unwritten bytes to 1677721600.
  - B3: check the bytes and do not destroy the response.

## 2. Gates and review

- [x] 2.1 Run `make lint` until no STE error remains.
- [ ] 2.2 Run `make gates CHANGE=osh-buffer-test-steady`.
- [ ] 2.3 Read the command output for the verdict.
- [ ] 2.4 Run `npm run format:check`.
- [ ] 2.5 Run `/opsx:review osh-buffer-test-steady`.
- [ ] 2.6 Correct the findings.
- [ ] 2.7 Record the result in `review.md`.
