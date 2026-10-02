# Test fixtures

- `tomtom-flow-austin-12-935-1686.pbf` — one real TomTom traffic-flow vector
  tile (Mapbox Vector Tile protobuf, layer `"Traffic flow"`), downtown Austin
  z12 x935 y1686, captured 2026-07-16 from
  `api.tomtom.com/traffic/map/4/tile/flow/relative/12/935/1686.pbf`
  (22,980 bytes). Used by offline decode/source tests and the explicit `qa-traffic --fixtures`
  browser mode — it is a point-in-time congestion snapshot, not a bundled
  data layer, and is never loaded by ordinary application startup. © TomTom.
- `osh-systems.json`, `osh-datastreams.json`, `osh-observation.json`,
  `osh-fois.json` — synthetic OpenSensorHub payloads for the `osh` provider
  and adapter tests. The host `https://osh.example` is not a real server.
  The ids `sys-fixture-*`, `ds-fixture-*` and `foi-fixture-*` are not real
  system, datastream or feature-of-interest ids.
- `osh-schema-vector.json`, `osh-schema-flat.json`, `osh-schema-noframe.json`
  — synthetic SWE Common `resultSchema` bodies for the location reader
  tests. The vector fixture names its `Vector` field `location` with an
  EPSG 4979 frame; the no-frame fixture names it `Location` with no frame at
  all, the shape a schema with no reference frame at its root takes; the
  flat fixture declares plain `Quantity` fields under a `urn:osh:def:fixture:`
  vendor definition. None names a real vocabulary term beyond the two public
  OGC and SensorML hosts.
- `osh-datastreams-filtered.json` — a synthetic datastream list standing in
  for the answer of a property-filtered list request, used by the location
  discovery tests.
- `osh-latest-page.json` — a synthetic newest-per-feature observation page,
  newest first, with one item carrying no `foi@id`, used by the location
  page-mapper tests.
- `adsb-austin-frames.txt` — 112 raw Mode S frames (`*<hex>;`, one per line,
  in receive order) received over Austin, TX, and
  `adsb-austin-dump1090-aircraft.json` — dump1090-fa's `aircraft.json` decode
  of the same frames, trimmed to the fields the tests assert on. Used by the
  Local ADS-B decoder and record-adapter tests; never loaded at runtime.
- `adsb-austin-capture-timed.json` — a second ~90 s receive over Austin, TX:
  846 extended squitters from six aircraft (`frames`: `[ms, hex]`), with
  dump1090-fa's decoded positions and emitter categories for the same
  interval (`dump1090`: per ICAO `flight`, `category` and `fixes` as
  `[ms, lat, lon]`). The capture has no per-frame timestamps; each frame's
  time is interpolated between the frames whose decoded position equals a
  dump1090 fix, timed as dump1090's `now − seen_pos`. Used by the decoder's
  category, speed-check and track-accuracy tests; never loaded at runtime.
- `ofm-austin-{14-3743-6745,12-935-1686}.pbf` and
  `ofm-camp-mabry-12-935-1685.pbf` — OpenFreeMap / OpenMapTiles tiles from
  `https://tiles.openfreemap.org/planet/20260913_164504_pt/{z}/{x}/{y}.pbf`,
  retrieved 2026-09-23. Trimmed to one transportation feature per class/direction
  and one military landuse feature, preserving original geometry and dictionaries.
  OpenFreeMap © OpenMapTiles Data from OpenStreetMap; © OpenStreetMap
  contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright).
  These modified data fixtures retain ODbL attribution and database share-alike;
  commercial use and redistribution are permitted under that license. Test-only.
- `osm-alpr-austin-11-467-843.pbf` — one OSM camera feature (original geometry
  and attribute dictionary) from the community-hosted hourly US extract,
  `https://tiles.dontgetflocked.com/cameras-us-hourly/11/467/843.mvt`,
  retrieved 2026-09-23. © OpenStreetMap contributors, ODbL 1.0; modified by
  trimming to one feature, test-only. Same attribution/share-alike terms above.

- `traffic-road-access.json` — representative transportation properties and two
  original vertices per feature near the Texas Capitol, Camp Mabry greenbelt,
  and Austin commercial car parks, from OpenFreeMap z14 tiles, retrieved
  2026-09-25. Each record names its XYZ tile and expected traffic eligibility.
  Modified, test-only OpenStreetMap data; same ODbL attribution and database
  share-alike terms as the OpenFreeMap fixtures above.
