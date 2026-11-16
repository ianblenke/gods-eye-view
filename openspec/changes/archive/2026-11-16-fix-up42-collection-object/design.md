## Context

The public product list of UP42 has a collection object for each product.
The object has a name, a title and other fields.
The function normalizeProducts in normalize.js accepted a collection only as a string.
One object made the function return null, and the route then gave 502 bad_upstream.

## Goals / Non-Goals

**Goals:**
- Accept the real shape of UP42.
- Keep the answer of the route the same: id, title and an optional collection string.

**Non-Goals:**
- No new text for the error codes of the page.
- No change to the page, the order routes or the daily counts.

## Decisions

- A helper reads the collection name. A string gives itself. An object gives its name. Other values give undefined.
  The caller refuses a collection that is present and gives no string name. This includes an object with a name that is not a string.
- The string form stays valid. This keeps the old tests and any older answer shape.
- The requirement text stays the same. Only the scenario of `up42-quotes-014` changes.

## Risks / Trade-offs

- A later UP42 shape can differ again. The route then gives bad_upstream, as before.
- The tests use a fake fetch. The check against the live list was a manual run on 2026-11-16 and is not a test.

## Gates

- The scenario `up42-quotes-014` has new tests. One test reads the real object. Two tests check that the name loses control characters and has at most 160 characters, as a string does. The mutation that reads only strings makes the first test fail.
- The loop of `up42-quotes-015` has three new refusal cases: the number 7, null, and an object with the name 7.
- The file normalize.js stays at 100% line, branch and function coverage. The ratchet command records the changed scenario hash.
- `make lint` checks the prose. `make gates CHANGE=fix-up42-collection-object` runs all gates.
