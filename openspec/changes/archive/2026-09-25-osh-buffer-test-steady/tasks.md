## 1. The test

- [x] 1.1 Change the test `[osh-090]` with real HTTP clients in `src/data/oshLive.test.mjs`, and keep its name.
  - Make the test wait after each message until the client that reads receives the start of that message.
  - Cork the response of the client that does not read.
  - Make the test stop when the provider destroys the response, or after 40 messages.
  - Remove the import of `node:net`.
- [x] 1.2 Run the file `src/data/oshLive.test.mjs` on one CPU core, six times. Each run must pass.
- [x] 1.3 Run the test `[osh-090]` with real HTTP clients once for each mutation below. The test must fail each time.
  - B1: remove the check of `writableLength` in `server/providers/osh.js`.
  - B2: set `OSH_LIVE_MAX_CLIENT_BUFFER_BYTES` in `server/providers/osh/live.js` to 1677721600.
  - B3: keep the check of `writableLength` in `server/providers/osh.js`, and remove the call of `res.destroy()`.
- [x] 1.4 Remove each mutation after its run.

## 2. Gates and review

- [x] 2.1 Run `make lint` until no STE error remains.
- [x] 2.2 Run `make gates CHANGE=osh-buffer-test-steady`.
- [x] 2.3 Read the command output for the verdict.
- [x] 2.4 Run `npm run format:check`.
- [x] 2.5 Run `/opsx:review osh-buffer-test-steady`.
- [x] 2.6 Correct the findings.
- [x] 2.7 Record the result in `review.md`.
