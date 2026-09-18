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
