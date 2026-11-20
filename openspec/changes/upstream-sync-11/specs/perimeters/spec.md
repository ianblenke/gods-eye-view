## REMOVED Requirements

### Requirement: Layer entities
**Reason**: Upstream moved the perimeters layer to the renderer ports. The fork tests of this requirement used the old Cesium objects, and they fail against the merged code. The merge takes the upstream tests of the layer. This change retires the scenarios `perimeters-010`, `perimeters-011`, `perimeters-012`, `perimeters-013`, `perimeters-014`, `perimeters-015`, `perimeters-016`.
**Migration**: None.

