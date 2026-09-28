## Round 2 Summary

I reviewed the `osh-mavlink-control` change (round 2, scope: diff since commit e7db8817aaee9d7d2e96798ba0e92816444f3f91) at `/home/ianblenke/docker/gev-work/mavlink`, now at commit 3ead99c per the lead's message, using `.review-round2-diff.txt` (473 lines) as the authoritative scope. I did not run any command myself (Read/Grep/Glob only).

**Verdict: PASS** (round 2)

F1 (was critical) — RESOLVED, with one caveat to verify empirically. `src/app/layers/osh.test.mjs`'s "no host" test now installs the click-capture, sets `pick()` to return `osh:sys-fixture-1`, adds the `/api/osh/*` bodies, and after `update()` actually clicks and asserts the panel detail shows "System A". I traced through what happens under the named mutation (drop the `host ? … : null` ternary in `createApplicationOsh()` so a view is always built): `host` would be `null` in this test's fixture (`getElementById` returns `null`, not undefined, for a missing id), and `view.js`'s `show()` calls `render()` synchronously as its first statement, before its first `await` — `render()` immediately does `host.replaceChildren()`, which throws on a `null` host. Because `show()` is `async` and is invoked as `void commandView?.show(...)` (no `.catch`), that throw becomes an unhandled promise rejection rather than a caught assertion failure. Neither of the test's two assertions (panel-detail content, and `asked.includes('/api/control/osh/targets')`) actually distinguishes mutated from correct behavior on their own — `client.targets()` is never even reached under the mutation, since the throw happens first, so `asked` stays exactly the same either way. The mutation would still very likely fail the test file (Node's default `--unhandled-rejections=throw` turns this into an uncaught exception during the test's synchronous click handler), but that's a crash-based signal, not a clean `node:assert` failure. Since I can't execute code, please have someone actually run the named mutation and confirm the test (or the file) reports a failure — if it doesn't crash the run for some reason, this would need a `try { click(...) } catch {}`-independent, more direct assertion (e.g., first argument the constructed `host` isn't silently `null`).

F2 (was major) — RESOLVED. `[osh-control-026]` in `src/control/route.test.mjs` now asserts `postOptions.headers.Authorization` against an independently-recomputed `Basic base64(OSH_CONTROL_USERNAME:OSH_CONTROL_PASSWORD)` (not a re-import of a code constant — a real literal derivation from the test's own `enabled` fixture), `headers['Content-Type'] === 'application/json'`, `redirect === 'manual'`, and `JSON.parse(body)` deep-equals `{parameters:{rtl:true}}`. Each is a real, non-tautological check that would break under the corresponding mutation (dropping `redirect:'manual'`, changing Content-Type, sending the wrong body shape, or using `OSH_USERNAME`/`OSH_PASSWORD` instead of the control account).

F3 (was major) — RESOLVED. The two new combined-failure cases in `[osh-control-003]` (bad URL + empty account → `no_key`; empty account + empty targets → `no_account`) correctly pin both adjacent orderings in `routeConfig()`. Any transposition of the three sequential checks is now caught by at least one of the two cases.

F4 (minor) — RESOLVED. `proposal.md`'s "scope of this round" and "Impact" sections, and `design.md`'s D9/D12/Files sections, no longer use "this round"/"the later round" framing; they now describe the change as completed, consistent with the merged tasks.md/code.

Confirmed nothing else moved: no production file (`server/providers/osh-control*`, `src/layers/oshControl/{client,view}.js`, `src/layers/osh/index.js`, `src/app/layers/osh.js`) appears in this diff at all — only doc prose and test titles/assertions. D3 timing, the Vector/`coordinates` schema handling, the 8-command table, the D1 scans, the log's field allowlisting, and the rate-limit ordering are untouched, as you said.

One new item, unrelated to F1-F4, found by re-reading the live tree rather than trusting the diff file alone:

- [ ] F5 minor openspec/specs/osh-control/spec.md (whole file) The canonical merged spec now already reads with the new wording ("This change retires `osh-control-012`", "OSH layer command view", "…destruction.", "Keep one command in flight for each system") — identical to the round-2 archived copy — but `.review-round2-diff.txt` contains no hunk at all for `openspec/specs/osh-control/spec.md`, only for the archived copy under `openspec/changes/archive/2026-09-28-osh-mavlink-control/specs/osh-control/spec.md`. Either the diff file you gave me is incomplete (generated in a way that missed this path), or this file's update is an uncommitted working-tree edit that never made it into commit `3ead99c`. Please run `git show 3ead99c:openspec/specs/osh-control/spec.md` and diff it against the working-tree file to confirm the canonical spec's wording is actually committed — an uncommitted match would silently revert on the next clean checkout.

Given F1-F4 are resolved and F5 is minor, round 2 verdict is PASS. Recommend confirming F5 and, ideally, actually executing the F1 mutation once before merge, since that's the one place my confidence rests on inference rather than execution.

---

## Follow-up exchange (same round)

**Lead's response:** Confirmed F1 by execution — `node --test` reported `pass 1 / fail 1`, exit code 1, with a clean per-test failure:
```
✖ [osh-control-032] builds the layer with no command view when the page has no control panel host
  TypeError: Cannot read properties of null (reading 'replaceChildren')
      at render (.../src/layers/oshControl/view.js:24:12)
      at Object.show (.../view.js:126:7)
      at applySelection (.../src/layers/osh/index.js:440:25)
```
The other test in the same file (the "with host" case) still passed independently. F5 confirmed: the round-2 re-archive had been staged but never committed; committed as `2e8a4d2`, with `git show 2e8a4d2:openspec/specs/osh-control/spec.md` matching the working tree.

**spec-adversary's acknowledgement:** "Good — both confirmations line up with my analysis (F1's crash-to-clean-per-test-failure mechanism, and F5's uncommitted-archive-step explanation). I have nothing further to add for osh-mavlink-control; round 2 PASS stands from my side. Go ahead with review.md."
