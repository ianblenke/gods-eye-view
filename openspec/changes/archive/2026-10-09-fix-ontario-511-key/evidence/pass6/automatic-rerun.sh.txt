#!/bin/bash
cd /tmp/ont-pass6-tree || exit 1
P=/home/ianblenke/docker/gev-tools/fix-ontario-511
for ph in 1 2; do
  extra=""; [ "$ph" = 2 ] && extra="--resume"
  echo "Command: taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/automut/automut.mjs run --root /tmp/ont-pass6-tree --commit ede1c684 --mutants $P/pass5/mutants.json --tests src/data/cctvOntarioKey.test.mjs,src/data/cctvOntarioRows.test.mjs --phase $ph --jobs 1 --slow-ms 1000 --out $P/pass6/results.json $extra" > $P/pass6/automatic-phase$ph-live.log
  taskset -c 8-11 nice -n 19 node /home/ianblenke/docker/gev-tools/automut/automut.mjs run --root /tmp/ont-pass6-tree --commit ede1c684 --mutants $P/pass5/mutants.json --tests src/data/cctvOntarioKey.test.mjs,src/data/cctvOntarioRows.test.mjs --phase $ph --jobs 1 --slow-ms 1000 --out $P/pass6/results.json $extra >> $P/pass6/automatic-phase$ph-live.log 2>&1
  echo "phase $ph exit $?" >> $P/pass6/automatic-phase$ph-live.log
done
echo AUTOMATIC_RERUN_DONE
