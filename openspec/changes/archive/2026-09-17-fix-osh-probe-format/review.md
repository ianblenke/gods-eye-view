# Review: fix-osh-probe-format

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-17
Gates: make gates CHANGE=fix-osh-probe-format passed
Rounds: 5
Scope: diff 7659531
Reviewed-Tree: 45b6c1b4dd5b71118c155accaff50223f526f37f8abf67397abffa79bed625f5

The output of each round is in `review/round-<n>/`. The output in `review/` is the spec adversary of round 4, which gave PASS, and the STE adversary of round 5, which gave PASS. The STE adversary of round 5 read every correction that the spec adversary asked for in round 4.

The `Scope` line gives the commit `7659531`, the merge of `osh-fusion`, which is the base of this branch. Each round read the diff since that commit.

The number of findings by round: 21 in round 1, 23 in round 2, 12 in round 3, 11 in round 4 and 4 in round 5.

## Why this change exists

The owner enabled the OSH layer and it did not start. The provider probed each candidate root with this constant:

```
PROBE_PATH = 'systems?limit=1&f=application/geo+json'
```

A `+` in the value of a query key means a space. The server read `application/geo json` and refused it. Measured against the owner's server:

```
f=application/geo+json      400 from the host, 302 from inside the container
f=application%2Fgeo%2Bjson  200, a `features` array
```

Every candidate failed, so the root never resolved, the data routes answered `502 base_unresolved`, and the layer's enable threw.

The known limit `osh-no-live-test`, written by `osh-fusion`, says no test proves the server accepts a value. This is the first time that limit cost something.

## What the review found

The first version of this change corrected two constants. Each round then found that the fix was smaller than the fault.

**Round 1.** The same fault was still live on the page walk. `buildNextPageUrl()` rebuilt the `f` value from the server's next link, so a link writing `f=application/geo+json` sent `f=application%2Fgeo+json` on page 2, which decodes with a space. `osh-038` could not catch it, and the reason matters: its fixture list has no next link, so no walk runs.

**Round 2.** The fix for round 1 forced the format on every walked link, including the datastreams list, which asks for no format. A server writing any `f` into a datastreams next link would have made page 2 request an unmeasured format, and the walk throws on any status outside 200 to 299.

**Round 3.** The fix for round 2 read the format from the link rather than from the request. Three faults followed. A link that omitted `f` left page 2 with no format, and `mapOshSystems()` keeps a record only for a `Point` geometry, so a page in the server's default shape lost every record with no log line. The loss then continued, because the next page read its format from that page. A link with two `f` keys put the key on the wire twice.

**Round 4 and round 5** found no fault in the code. They found stale counts and lists, a paragraph that stated the round-2 rule too generously, and words outside the approved set.

## The rule the change settles on

Every URL this provider sends is one it built. `buildNextPageUrl()` drops every `f` the server writes, then appends `OSH_LIST_FORMAT` once, and only when the current page asked for a format. The round-4 spec adversary exercised that against ten shapes, including a raw `+`, a doubled key, an empty value, a `;` pair, an uppercase `F`, a dot segment and a trailing slash, and found no shape it gets wrong.

## Findings

### Round 1: spec-adversary

- [x] F1 major The fault was still live on the page walk, and no fixture drove a next link with an `f` key.
- [x] F2 to F6 The scan missed a key with a non-word byte; the `osh-038` WHEN named a route its test never drives; nothing enforced the contract that `path` is a fixed literal; the warning count named one of seven; and `stripComments` became shared between two guards.

### Round 1: ste-adversary

- [x] S1 major The record of an accepted warning claimed no reword fits the 20-word task limit. The agent supplied one that does, so the warning and the record both went away.
- [x] S2 to S5 Four more sentences that disagreed with the code: a limit claiming a measurement never taken, a design naming an import that does not exist, a requirement described as having one MUST sentence where it has two, and a scenario naming a route its test never drives.
- [x] S6 to S15 Wording.

### Round 2: spec-adversary

- [x] F1 major The forced format was not scoped to the list that asked for one, so the datastreams walk would have gained a format on page 2.
- [x] F2 major The `osh-040` test drove one link value, so an implementation that repaired rather than replaced would have passed every assertion while the scenario said otherwise.
- [x] F3 to F6 The design quoted a function body without its safety check; the check sat outside the probe's `try`, so one bad candidate would have rejected the whole pass; the scan limit was incomplete; three counts were stale.

### Round 2: ste-adversary

- [x] S1 to S7 Seven sentences that disagreed with the code, including three stale counts and a spec line naming an HTTP header for a URL property.
- [x] S8 to S16 Wording.

### Round 3: spec-adversary

- [x] F1 major A sentence in the design claimed a format-less page still works. `listOfSystems()` does yield the items and `mapOshSystems()` then drops every one. The claim was never measured.
- [x] F2 major The format read from the previous page's URL, so one link without `f` stopped the format for the rest of the walk.
- [x] F3 to F5 The scenario was silent on a link that omits the key; a link with two `f` keys wrote the key twice; a count was stale.

### Round 3: ste-adversary (Verdict: PASS)

- [x] M1 to M7 Seven wording findings, including two in prose that a earlier round had set aside as code: a docstring and an assertion message.

### Round 4: spec-adversary (Verdict: PASS)

- [x] F1 to F3 Two file lists that no longer agreed with each other, and a warning count named nowhere. The agent exercised the new function against ten shapes and found no fault in it.

### Round 4: ste-adversary

- [x] S1 major A sentence said "two more bugs" and then listed three.
- [x] S2 to S8 Wording, including a phrasal verb and a word used for two meanings.

### Round 5: ste-adversary (Verdict: PASS)

- [x] S9 to S12 Four wording findings. The agent also recounted every test and every file list itself rather than take the author's audit, and found them right.

## What this change shows

The fix was wrong twice before it was right, and each wrong version came from an instruction of the author's rather than from the implementing agent. Each time, the test was written first and failed, so each fault is pinned by a test that proves it.

Five counts or lists in this change went stale, each written once while the thing it counted moved. The author then read every count and list in all three documents against the tree, and the round-5 agent checked that audit rather than accept it.

Four rounds checked the repository for a leak of the owner's server. None was found.
