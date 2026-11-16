## Why

The UP42 quote panel always said "UP42 did not give a quote".
UP42 sends the collection of a product as an object with a name.
The code accepted only a string. It then refused the whole product list as bad_upstream.

## What Changes

- Read the collection of a product as a string or as an object with a string name.
- Give the name as the collection string in the products answer.
- Refuse a collection that is not a string and has no string name.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `up42-quotes`: Change the scenario of the public products requirement.

## Impact

The change edits normalize.js under server/providers/up42-quotes.
It edits the test file src/data/up42Quotes.test.mjs.
It adds changelog.d/1436-up42-collection-object.md.

It adds no code file and changes no ownership path.
No trace gap must open. The lead must run the ratchet command to record the new hash of scenario 014.
The delta replaces the text of scenario 014 of up42-quotes. The requirement text stays the same.

## Known limits

- Known limit `probe-snapshot`: The shape comes from the public product list on 2026-11-16. The tests use a fake fetch and do not repeat the probe.
- Known limit `error-texts`: The page still shows its generic text for the codes bad_upstream, cross_origin and bad_body. This change does not add texts for them.
- Known limit `empty-name`: A collection name that is empty, or has only control characters, gives an empty collection string. A string collection gave the same result before.
