## MODIFIED Requirements

### Requirement: Same-origin command request
The route MUST refuse a POST unless the host, origin, and content type pass the origin check.
Origin: spec-first

#### Scenario: Refuse a cross-origin POST `osh-control-028`
- **WHEN** `Host` is not `localhost`, `127.0.0.1` or `[::1]`, with or without a port, or `Origin` is absent or differs from the host scheme and value
- **THEN** the route answers `403` with `{error:'cross_origin'}`

#### Scenario: Refuse a POST without JSON content type `osh-control-029`
- **WHEN** `Content-Type` is not `application/json`
- **THEN** the route answers `403` with `{error:'cross_origin'}`

## ADDED Requirements

### Requirement: Local connection only
The route MUST refuse a POST that does not come from the machine that runs the server. It MUST refuse a POST that carries a proxy header.
Origin: spec-first

#### Scenario: Refuse a POST from another machine `osh-control-039`
- **WHEN** the socket address of a POST is not `127.0.0.1`, `::1` or `::ffff:127.0.0.1`, or the socket has no address
- **THEN** the route answers `403` with `{error:'cross_origin'}`, and it sends no upstream request
- **AND** the audit log gets one line with the outcome `refused` and the reason `cross_origin`
- **AND** a POST from one of the three addresses, with a loopback host and the same origin, passes this check

#### Scenario: Refuse a POST that carries a proxy header `osh-control-040`
- **WHEN** a POST from a loopback socket, with a loopback host and the same origin, has a header that is not empty
- **AND** the header is `forwarded`, `via`, `x-forwarded-for`, `x-forwarded-host`, `x-forwarded-port`, `x-forwarded-proto`, `x-real-ip`, `cf-connecting-ip` or `cf-ray`
- **THEN** the route answers `403` with `{error:'cross_origin'}`
- **AND** the same header with an empty text does not stop the POST
