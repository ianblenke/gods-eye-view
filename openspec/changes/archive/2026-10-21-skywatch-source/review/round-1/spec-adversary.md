Verdict: FAIL

Tree c762e08b (branch skywatch-source), round 1, scope full. I could not run code, so no fault was run. Each surviving fault below comes from reading the code and the tests.

- [ ] FINDING major src/data/skywatchUpstream.test.mjs:367 (c762e08b) No test checks the 019 clause "clears the timer after it reads the body". Move `clearTimer(timer)` from the `finally` (upstream.js:87) to just after `await fetchImpl` and each test still passes. `cleared` stays [1,2,3], and the body test at :376 uses a clearTimer that stops nothing. The named fault "timer cleared before the body" fails only because it clears twice. With real timers, the body read then has no time limit (D3). Give the body test a clearTimer that cancels the fake timer, and name this fault.
- [ ] FINDING major src/data/skywatchProxy.test.mjs:523 (c762e08b) For the 018 order, no test fails when `allow('local')` moves before `isLoopbackCommand` (skywatch.js:189-194). The 004 test and this test count at most 6 requests. After that move, a LAN machine can use up the owner's shared 'local' limit. Also, no test fails when the key step moves after the store (skywatch.js:199-204). Add 6 refused non-local requests followed by a local request that must get 200. Add a stored answer after the key is removed. Name both faults.
- [ ] FINDING major openspec/changes/archive/2026-10-21-skywatch-source/evidence/faults.txt:11 (c762e08b) Rule 13 is not met. No named fault fails skywatchUpstream.test.mjs:320, :342 or :376, skywatchInput.test.mjs:74, or skywatchScenes.test.mjs:186. Also, the assert inside the fake fetch at skywatchUpstream.test.mjs:356 cannot fail: upstream.js:84 catches its error and gives the expected upstream_failed. Name and run one fault for each test, for example a body read for each status, `east &lt; 180`, or no `isSearchId(item.id)` in sceneOf. Assert the redirect option outside the fake fetch.
- [ ] FINDING major openspec/changes/archive/2026-10-21-skywatch-source/evidence/faults.txt:1 (c762e08b) The header pins "13:38:00, Branch head: bbe14837", but the listed result is from the run on 06998ac3 at 14:22 (lines 8 and 10). The newer result sits under the old pin. Pin the last run, and give bbe14837 as an earlier run.
- [ ] FINDING major CHANGELOG.md:3 (c762e08b) "It counts at most 20 searches for each UTC day" is false when `SKYWATCH_DAILY_SEARCHES` is set to a value up to 1000 (skywatch.js:50-56, scenario 014). Add "by default; SKYWATCH_DAILY_SEARCHES can set 1 to 1000".
- [ ] FINDING minor server/providers/skywatch/normalize.js:54 (c762e08b) No test fails when this line is removed, because its only sample ['10', 60] also fails `numberIn`. Add the sample [10, 60, "x"] (020 "2 or 3 numbers").
- [ ] FINDING minor openspec/changes/archive/2026-10-21-skywatch-source/proposal.md:35 (c762e08b) The Known limits do not name the id rule (normalize.js:7). The API description gives only "string". A real id with a dot removes each scene, or fails each search with bad_upstream. Name this limit.
- [ ] FINDING minor src/data/skywatchProxy.test.mjs:298 (c762e08b) The 013 WHEN says "each failure of this specification", but no flow fires the timer, sends a too-large body or sends a bad results document. Add these flows, or narrow the WHEN.
- [ ] FINDING minor server/providers/skywatch.js:225 (c762e08b) `sameSiteGated` runs before `onOwnPath`. So `/api/skywatch/status/x` with a cross-site header or a proxy header gets 403 and does not go to `next`. That breaks the requirement "Provider routes".
- [ ] FINDING minor src/data/skywatchProxy.test.mjs:350 (c762e08b) `usedAtSend` is always the constant 'sent', so the test does not check the count at send time, as its title says. Only the test at :796 fails for "count after the search". Rename the test to what it asserts.

Files:
- /home/ianblenke/docker/gev-work/skywatch-source/server/providers/skywatch.js
- /home/ianblenke/docker/gev-work/skywatch-source/server/providers/skywatch/upstream.js
- /home/ianblenke/docker/gev-work/skywatch-source/server/providers/skywatch/normalize.js
- /home/ianblenke/docker/gev-work/skywatch-source/src/data/skywatchProxy.test.mjs
- /home/ianblenke/docker/gev-work/skywatch-source/src/data/skywatchUpstream.test.mjs
- /home/ianblenke/docker/gev-work/skywatch-source/openspec/changes/archive/2026-10-21-skywatch-source/evidence/faults.txt
- /home/ianblenke/docker/gev-work/skywatch-source/CHANGELOG.md
