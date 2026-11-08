## Context

The base tree is commit `990d28286da22b1c3063eb2a0ef0e18f79e730c6`.
The first real UP42 call found 15 hosts and two hosts with a one-collection rule.
The source selected only ten hosts and sent several collections to both restricted hosts.

## Decisions

A fixed set in upstream.js names vantor-3d and vexcel-v2.
For these hosts, each wanted collection becomes one call with exactly one collection in its body.
Other hosts keep one call with all wanted collections.
The collection map sets the host order and collection order.
The queue sends its first 24 calls. Four workers share the queue.

The cap and concurrency count calls, also when several calls use one host.

The client merges all good pages in queue order.
It counts invalid features across those pages.
A host enters failedHosts once only when all its sent calls fail.
A host with good and failed calls keeps its good scenes and makes truncated true.
The cap and a next link also make truncated true.

A complete host failure still uses failedHosts to indicate a partial answer.
The all-failed result keeps its fixed error and includes internal host names for the log.

The route does not show those names in an error body.
A credential rejection still refuses the whole search.

The daily budget counts one per accepted search, before upstream work starts.
The cost of one search is up to 24 UP42 search calls. Search spends no UP42 credits.
A kept answer or shared search adds no count.
The answer-store and daily-count requirements remain true.

The search log writes a fixed success line or a fixed failure kind.
A failed search with failedHosts also writes a separate host line.
A good answer with failedHosts writes a partial host line after the success line.

Host names come only from the checked collection map. Failure kinds come only from fixed client names.
The source secret check runs before these logs.
The thumbnail route writes its fixed failure kind before it sends an upstream refusal.
It writes no id, host, URL, body or credential.

## Files and measures

The proposal lists the edited files. No environment variable or browser code needs a change.

Tests compare literal request bodies, counts, scene identities and log strings.
A 15-host fixture needs 21 calls. A 25-call fixture sends 24 calls and marks the answer as truncated.
Gate promises prove that four calls can run within one host and across hosts.
Tests check complete and partial host failures, scene merges, the daily budget and the answer store.

All console methods enter the secret-output checks.
Each mutation runs alone and must fail its named test.
Evidence records commands and results as prose, without program text or local home paths.

Host Node measures full line, branch and function coverage for each edited code file.
The STE lint checks the change documents. The test titles also receive a word-list check.
The lead runs the ratchet command, both review agents and the final calibrated gates before merge.

## Purpose at archive time

Describe how the server searches all selected UP42 hosts within a call cap and records fixed failure facts.
