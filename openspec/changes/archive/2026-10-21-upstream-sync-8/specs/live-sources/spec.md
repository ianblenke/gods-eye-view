## REMOVED Requirements

### Requirement: Ontario camera key
**Reason**: Upstream adds the same key, in the same request parameter, to `server/providers/cctv/sources.js`. The change uses the upstream code, as the owner decided for the same case in sync 6. This change retires the scenarios `live-sources-002`, `live-sources-003`, `live-sources-004` and `live-sources-005`.
**Migration**: None. The server reads the same environment variable `ONTARIO_511_API_KEY`.
