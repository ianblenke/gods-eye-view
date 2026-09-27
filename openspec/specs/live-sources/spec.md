# live-sources Specification

## Purpose
Keep the identity of an error that a transport aborts. Reject a fetch with the same error object that the fetch function gave.
## Requirements
### Requirement: Transport abort error
When a transport aborts a request with no external abort signal, `readResponse()` MUST reject with the same error object that the fetch function gave.
Origin: backfill

#### Scenario: Keep the transport abort error `live-sources-001`
- **WHEN** `readResponse()` calls a fetch function that rejects with an `AbortError`, with no external abort signal
- **THEN** `readResponse()` rejects with that same error object

