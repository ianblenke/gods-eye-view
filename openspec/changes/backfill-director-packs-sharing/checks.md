# Director check results

Commit: `3e1160f47c8d1f63f4b550318134c77fa3f46c5b`.

## Test result

The final command passed all 295 repository tests in scope.
The output reports zero failures, cancellations or skipped tests.
The scope sweep in the evidence checks the test total.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit src/director/packs/packs.test.mjs src/director/packs/backfill.test.mjs src/director/sharing/sharing.test.mjs
```

## STE result

The lint output reports zero errors and 349 warnings.
The command checks repository prose and the named change.
The scope sweep checks every tagged title against the word list and the length limit.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && node scripts/spec/gates.mjs lint --change backfill-director-packs-sharing 2>&1 | grep -E "^(ERROR|STE)"
```

## Format results

Both format commands stopped before the end with the error below.
Neither command gives a format verdict.
Direct Prettier checks pass for each changed test file.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/director-3 && node scripts/format.mjs --check
```

```text
spawnSync git EPERM
```

The lead must repeat these commands in an environment that allows the child process.

## Tree result

The source comparison finds no production change.
The title comparison confirms each old title after removal of its new tag, except three titles that changed one word.
The path check finds no browser QA script or earlier director change.
The whitespace check passes.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && git diff --check
cd /home/ianblenke/docker/gev-work/director-3 && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/director-3 && git status --short
```

```text
 M src/director/packs/packs.test.mjs
 M src/director/sharing/sharing.test.mjs
?? openspec/changes/backfill-director-packs-sharing/
?? src/director/packs/backfill.test.mjs
```

The lead runs the ratchet, gates and both reviews.
This change does not record a gate verdict or a review verdict.
