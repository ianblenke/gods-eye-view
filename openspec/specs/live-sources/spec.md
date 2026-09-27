# live-sources Specification

## Purpose
Keep the identity of an error that a transport aborts. Reject a fetch with the same abort error that the transport gave.
## Requirements
### Requirement: Transport abort error
`readResponse()` MUST reject with the same abort error when its fetch function rejects with an `AbortError`.
Origin: backfill

#### Scenario: Keep the transport abort error `live-sources-001`
- **WHEN** `readResponse()` calls a fetch function that rejects with an `AbortError`
- **THEN** `readResponse()` rejects with that same error object

