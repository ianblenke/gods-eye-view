Verdict: FAIL

Spec adversary, round 2 (scope: diff c762e08b), skywatch-source. I read the clone /home/ianblenke/docker/gev-work/skywatch-source at 2a4dc0b6. I could not run code or git. I checked each fault against the fault definitions in /home/ianblenke/docker/gev-tools/skywatch-source/faults.py and against faults-6.log, which ends "faults 125, killed 125".

Round-1 majors of my role, all at 2a4dc0b6:
- F1 (timer after the body): closed. faults.py:160 adds a clear after the headers. At that first clear, the body is not read yet, so skywatchUpstream.test.mjs:454 fails.
- F2 (step order): closed. Under "rate limit before the local check", the 7th refused request at skywatchProxy.test.mjs:852 gets 429. Under "key after the store", :862 gets the stored 200.
- F3 (rule 13): closed. Each listed test now has a named fault that fails it. The redirect option is asserted outside the fake fetch (:364). The time-limit test has a test time limit, so the fault fails it and does not hang.
- F4 (faults pin): closed.
- F5 (CHANGELOG): closed.

Round-1 minors F6 to F10: closed.

The 013 test covers each failure kind: key_rejected (401, 403), upstream_rate_limit, upstream_failed (500, a network error, a redirect), bad_upstream (a bad id, `data` {}, a body of 4 MiB + 1) and search_timeout. The status route now checks the path, then the same-site gate, then the method. This is correct for `/`, for `/?q` and for `/x`, and faults.py:40 is killed.

- [ ] FINDING major openspec/changes/archive/2026-10-21-skywatch-source/evidence/faults.txt:10 (2a4dc0b6) This sentence is false: "The commit 358a1140 adds tests for them". For five of the 11 faults, the failing test is a test that 358a1140 does not change for that fault:
  - "body read for each status" fails skywatchUpstream.test.mjs:320, which did not change.
  - "network error gives bad_upstream" fails the network part of :342, which did not change.
  - "east 180 refused" and "west -180 refused" fail skywatchInput.test.mjs:74. In that file, the diff changes only the titles at :43 and :156.
  - "scene id not checked" fails skywatchScenes.test.mjs:186, which did not change.
  
  The owner rule makes a false statement major. Write, for example: "For six of them, 358a1140 adds a test, an assertion, a sample or a test time limit. Tests of c762e08b kill the other five: a body read for each status, a network error as bad_upstream, east 180 and west -180 refused, and a scene id not checked." I could not check this text against git.
- [ ] FINDING minor openspec/changes/archive/2026-10-21-skywatch-source/evidence/faults.txt:6 (2a4dc0b6) The list of earlier runs leaves out the second run, which stopped before the end. /home/ianblenke/docker/gev-tools/skywatch-source/faults-2.log ends with `TimeoutExpired` after 300 s on src/data/skywatchProxy.test.mjs, at the fault "count after the search". So "the next run" at :8 is really the third run (faults-3.log, 113 of 114). AGENTS rule 10 asks the author to say plainly when a run stopped. Add that run, and the change that the lead made after it.

Files:
- /home/ianblenke/docker/gev-work/skywatch-source/openspec/changes/archive/2026-10-21-skywatch-source/evidence/faults.txt
- /home/ianblenke/docker/gev-work/skywatch-source/src/data/skywatchUpstream.test.mjs
- /home/ianblenke/docker/gev-work/skywatch-source/src/data/skywatchProxy.test.mjs
- /home/ianblenke/docker/gev-work/skywatch-source/server/providers/skywatch.js
- /home/ianblenke/docker/gev-tools/skywatch-source/faults-2.log
