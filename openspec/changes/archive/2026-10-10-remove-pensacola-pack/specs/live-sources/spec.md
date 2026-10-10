## REMOVED Requirements

### Requirement: Pensacola camera rows
**Reason**: The owner decided on 2026-10-10 to remove the Pensacola pack. This change retires the scenarios `live-sources-010` to `live-sources-018` and `live-sources-030`.
**Migration**: None. The catalog has no Pensacola cameras after this change.

### Requirement: Pensacola layer request
**Reason**: The owner decided on 2026-10-10 to remove the Pensacola pack, so the pack sends no request. This change retires the scenarios `live-sources-019` to `live-sources-025`.
**Migration**: None.

### Requirement: Pensacola pack settings
**Reason**: The owner decided on 2026-10-10 to remove the Pensacola pack, so the settings have no use. This change retires the scenarios `live-sources-026` to `live-sources-029`.
**Migration**: Remove the settings CCTV_PENSACOLA_ENABLED, CCTV_PENSACOLA_MAX_SOURCES and CCTV_PENSACOLA_ROWS_URL from the environment of the server. The server ignores them.
