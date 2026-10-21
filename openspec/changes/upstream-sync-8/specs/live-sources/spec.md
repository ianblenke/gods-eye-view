## REMOVED Requirements

### Requirement: Ontario camera key
**Reason**: Upstream adds the same key, in the same request parameter, to `server/providers/cctv/sources.js`. The change uses the upstream code for the same reason as the owner decision about the geocoding routes in sync 6. The upstream code writes a warning for each failed download, and it can write the key text in a warning. This change retires the scenarios `live-sources-002`, `live-sources-003`, `live-sources-004` and `live-sources-005`.
**Migration**: None. The server reads the same key `ONTARIO_511_API_KEY`.
