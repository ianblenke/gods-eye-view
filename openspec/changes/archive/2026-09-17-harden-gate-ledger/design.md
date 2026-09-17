## Context

The review of `establish-spec-governance` kept the minor findings S220 and S221, and three known limits, for this change. The change `simplify-ledger` then removed the ranges, the count band, the stability command and the kept samples.

## Changed files

`openspec/specs/coverage-gate/spec.md`, `openspec/specs/gap-ledger/spec.md`, `src/tooling/spec/testGuard.test.mjs`, `src/tooling/spec/ledger.test.mjs`, `openspec/trace/history.jsonl`, `openspec/trace/ids.json`, and the proposal and the review record of the archived change `establish-spec-governance`.

## Goals / Non-Goals

**Goals:**
- Give a reader of the known limits information that is correct.
- Close the last open finding of the review of `establish-spec-governance`.

**Non-Goals:**
- Change the code of a gate.
- Correct the requirement "Ledger file". See the known limit `ledger-file-wording`.

## Decisions

### What `simplify-ledger` closed

| Item | State |
| --- | --- |
| `sample-identity` | Closed. The kept samples are not in the project now. |
| `ci-samples` | Closed. The kept samples are not in the project now. |
| `range-band-ratchet` | Closed. The ranges and the band are not in the project now. |
| `range-totals` | Closed. The one tolerance compares the covered counts. |
| `range-slack`, `unchanged-band` | Closed. The limit `tolerance-slack` takes the place of them. |
| `deterministic-tests` | Smaller. The limit of `simplify-ledger` records the part that stays. |
| S220 (`gap-ledger-054`) | Open. `simplify-ledger` removed the name of the retired scenario only. This change corrects the words. |
| S221 (`coverage-gate-046`) | Open. This change corrects the scenario. |

### The words of `gap-ledger-054`

The scenario has "the covered branch count or the covered function count" in one line and "its covered count" in the next line. The change gives the last **AND** line the words "a covered count".

### The words of `coverage-gate-046`

The scenario has "each test that needs the guard to count assertions" in one line and "each test that needs the guard" in another line. The two groups of words name the same tests. The change gives the last **AND** line the words of the **THEN** line.

### The edit of an archived proposal

The known limits of `establish-spec-governance` are in the proposal of that archived change. A reader finds them there, so this change changes them there. See the known limit `archived-proposal-edit`.

### How the gates measure the requirement

This change changes the body of two scenarios, so `coverage-gate-046` and `gap-ledger-054` get a new hash. The test of each scenario, in `src/tooling/spec/testGuard.test.mjs` and in `src/tooling/spec/ledger.test.mjs`, gets a new assertion.
