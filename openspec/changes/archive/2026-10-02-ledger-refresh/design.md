## Context

The ledger entries of two files do not match the counts that CI measured on `main`.

## Goals and non-goals

- Make the ledger show the counts of a current run.
- Do not change code, tests or scenarios.

## D1 The ratchet command

The ratchet command measures all files and writes the counts. This change keeps each line that the command writes, for all 13 files. The proposal lists the files.

## Gates on this tree

The ledger must show the counts of the run. The two limits `refresh-may-flip` and `refresh-cause` name the exception.
