# live-sources Specification

## Purpose
Keep the identity of an error that a transport aborts. Reject a fetch with the same error object that the fetch function gave.
## Requirements
### Requirement: Transport abort error
A fetch function can reject with an `AbortError`. No external abort signal aborts the request. `readResponse()` MUST then reject with the same error object.
Origin: backfill

#### Scenario: Keep the transport abort error `live-sources-001`
- **WHEN** `readResponse()` calls a fetch function that rejects with an `AbortError`, and no external abort signal aborts the request
- **THEN** `readResponse()` rejects with that same error object

