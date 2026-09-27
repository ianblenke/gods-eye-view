## ADDED Requirements

### Requirement: Transport abort error
`readResponse()` MUST reject with the same error object when a fetch function rejects with an `AbortError` and no external abort signal aborts the request.
Origin: backfill

#### Scenario: Keep the transport abort error `live-sources-001`
- **WHEN** `readResponse()` calls a fetch function that rejects with an `AbortError`, and no external abort signal aborts the request
- **THEN** `readResponse()` rejects with that same error object
