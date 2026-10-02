## Context

The ledger entries of two changed files do not match the counts that CI measured on `main`.

## Goals and non-goals

- Make the ledger match a current measurement.
- Do not change code, tests or scenarios.

## D1 The ratchet command

The ratchet command measures all files and writes the counts. This change checks the diff of the ledger and keeps only the lines that the ratchet writes for the stale entries and for closed gaps.

## How the gates measure this change

The gates run on the tree of this change. The ledger must show the counts of the run, except for files with changing counts.
