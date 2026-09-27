## Context

At commit `33eaff540b9bda30404a98b7f9a34d7517b3ffc9`, `readResponse()` has this fetch and catch path:

```js
try {
  response = await fetchImpl(url, { ...init, signal });
  signal?.throwIfAborted();
} catch (error) {
  signal?.throwIfAborted();
  if (error?.name === 'AbortError') throw error;
  throw new LiveSourceError('unavailable', `${source} network error`, {
    source,
  });
}
```

The current tests cover signal aborts. They do not call the true arm of the `AbortError` check with an active signal.

## Goals

- Add one test for the missing transport abort path.
- Check that the rejected object is the same error object.

## Non-goals

- Do not change the coverage code.
- Do not redesign `parseLcov()`.
- Do not change production code or old tests.

## Test and mutation

Add the test to `src/sources/live/contract.test.mjs`. Use `assert.rejects()` and `assert.equal()` to check error identity. Change the abort test in `src/sources/live/contract.js` to `if (false) throw error;` for the mutation. The new test must fail, and the mutation runner must restore the file.

## Gates

- The trace gate checks the `live-sources-001` tag and the `node:assert` calls.
- The coverage gate counts the branches of `src/sources/live/contract.js`.
- The STE lint checks these documents and the new test name.
- The host test and mutation check the specified path. The gate uses Node 24; the host uses Node 26.
