## Why

The detail panel showed a record from another month with nothing to say it was old, and nothing stopped a marker from moving to it. That is the defect, and it does not depend on what the server's newest-record query means.

What that query means changed under this project in one day. On the morning of 2026-09-18, against the server's broken database, `limit=1&resultTime=latest` returned the oldest record the store held, six weeks old, as `200`. On the evening of 2026-09-18, against the restored database, the same query returned the newest record, seconds old, as `200`. Both answers looked the same to the panel. A layer that trusts the query trusts a meaning it cannot see.

So this change makes age data. The provider states the age of every observation it serves. The panel shows it and says when a record is old. A marker moves only from a fresh record, and the threshold is named in the spec. A record with no readable time has an unknown age, which is not fresh.

The owner's OSH server runs a few seconds ahead of the provider, measured across several live streams on the evening of 2026-09-18. A live reading's age is therefore negative. A negative age is the freshest reading there is. Treating it as unknown, or refusing it, would reject every live reading from that server. No marker would ever move again.

Measured on the evening of 2026-09-18 against the restored database, `resultTime=latest&limit=300` gave the newest records of three hundred distinct nodes. Those records already span more than five days. An old newest record is the normal case for a mesh station, not an error. The panel states an old record without alarm; only motion refuses it.

## What Changes

- Add `oshObservationAgeMs()`, `OSH_FRESH_MAX_AGE_MS` and `isOshObservationFresh()` to `src/data/oshObservations.js`. The age function is pure arithmetic on a caller-supplied clock reading; it reads no clock of its own.
- Change the observations route in `server/providers/osh.js` to add `ageMs` to the observation it serves, computed from the provider's injected clock at serve time. The cache keeps no age, so a stale snapshot served twice carries a larger age the second time.
- Change `pollSelected()` in `src/layers/osh/index.js` to move the selected system's entity only from a fresh record.
- Change `renderOshDetail()` in `src/layers/osh/detail.js` to show each datastream's age in words, and to mark a datastream whose record is not fresh.
- No query changes. No new file, and no requirement text changes.

## Impact

- Changed files, each at 100% coverage after the edit: `src/data/oshObservations.js`, `server/providers/osh.js`, `src/layers/osh/index.js`, `src/layers/osh/detail.js`. `src/layers/osh/source.js` needs no code change; one test confirms the age passes through unchanged.
- Five changed test files, one for each file above.
- No requirement text changes. Two requirements are MODIFIED for their scenario set only, one requirement gains one ADDED scenario.
- No change to the request shape, the query, or the fixtures. The age is arithmetic on a record the provider already holds.

## Known limits closed

- `osh-latest-is-oldest`, from `osh-geo-discovery`: closed. It stated the shipped query returns the oldest record, true as measured on the morning of 2026-09-18 against the server's broken database. On the evening of 2026-09-18, against the restored database, the same query returned the newest record. This change acts on the record's age, so it depends on neither meaning.
- `osh-latest-query-inferred`, from `osh-fusion`: closed. It stated the server might refuse `resultTime=latest`, with `502` as the sign. The server accepted the query on both dates, both as `200`; what differed was the meaning. Age is the sign this change adds.

## Known limits left open

- `osh-query-semantics-unstable`: the meaning of `resultTime=latest` differed between two database states of one server on 2026-09-18, oldest in the morning, newest in the evening, both `200`. This change keeps the query and acts on the age instead. Any later query change must rest on a measurement taken after the last restart of that server.
- `osh-fresh-threshold-one-hour`: one hour is this project's confidence in a position, not a fact about the server. Most mesh stations never move from an observation under it, because their newest record is often days old. Only the selected system polls. So the visible effect is one marker at most.
- `osh-age-from-server-clock`: the age compares two clocks and carries their difference. A provider clock that is wrong makes every age wrong by the same amount. On the evening of 2026-09-18 the owner's server ran a few seconds ahead of the reading machine. So a live record has a small negative age. That is why a negative age is fresh, and only a null age is unknown.
- `osh-closed-intervals-only`: on the evening of 2026-09-18, against the restored database, an open-ended `phenomenonTime` interval returned zero records as `200`. An explicit end, and an open-ended `resultTime`, both worked. This change sends no interval.
- `osh-selected-only-motion`: unchanged. Only the selected system's poll can move an entity.
