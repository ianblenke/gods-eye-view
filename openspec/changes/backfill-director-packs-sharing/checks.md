# Host checks

EPERM is the process error code.
ERROR is the error prefix in command output.
HEAD names the current Git commit.

Base commit: `290b5d2`.

The evidence gives each test and coverage command with its result.
The mutation report gives the complete command output.
The title scan checks director-076 through director-110.
The direct format command stops with the process error below.
The host format helper completes the format commands.
The source comparison finds no production change.

The path check lists only test files and this change directory.
The lead runs the ratchet, gates and both reviews.

```text
spawnSync git EPERM
```

## Commands

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/spec/gates.mjs lint --change backfill-director-packs-sharing 2>&1 | grep -E "^(ERROR|STE)"
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/predispatch/predispatch.py openspec/changes/backfill-director-packs-sharing
cd /home/ianblenke/docker/gev-work/director-3 && cd /home/ianblenke/docker/gev-work && taskset -c 12-15 nice -n 19 node /tmp/claude-1000/gcr/scan-titles.mjs director-3 76 110
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 node --import /home/ianblenke/docker/gev-tools/director-4c/format-host.mjs scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/director-3 && git diff --check
cd /home/ianblenke/docker/gev-work/director-3 && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/director-3 && git diff HEAD -- 'src/director/**/*.js'
```

## Final results

The lint output reports zero errors.
The title scan checks 406 titles and finds zero banned forms.
The host format helper writes and checks 1158 files.
The direct format commands stop with the process error above.
The hand check uses a scratch copy with the final test files.

The file and title checks leave only historical quotes and technical code terms in the predispatch output.
The brief calls for those exact quotes and code values.
The evidence lists the text that stays the same.

Pass 4 reports 479 passed host tests.
Each of the seven production files has full line, branch and function coverage.
The automatic survivor run kills 192 cases and leaves 68 proved or bounded cases.
The complete hand run kills 406 rows and leaves only m172 and m389.
The guard-order test now kills m284.
