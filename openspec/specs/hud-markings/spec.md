# hud-markings Specification

## Purpose
Remove each classification marking of a government from the HUD, and do not add a new one. The open marking "UNCLASSIFIED" is the only exception. The program shows open data only. Keep the three parts of the top bar.
## Requirements
### Requirement: No classification marking
The HUD MUST NOT show a classification marking of a government. The program shows open data only. The open marking "UNCLASSIFIED" is the only exception.
Origin: spec-first

#### Scenario: Stop for a classification marking in a HUD file `hud-markings-001`
- **WHEN** a HUD source file or a HUD style file has one of the markings "TOP SECRET", "SI-TK", "NOFORN", "CONFIDENTIAL" or "CLASSIFIED"
- **AND** the two letters before "CLASSIFIED" are not "UN"
- **AND** the letters of the marking are in any letter case
- **THEN** the test stops the build
- **AND** a file `src/hud.js` without the class "hud-top-bar" also stops the build

#### Scenario: Stop for a classification element in the HUD code `hud-markings-002`
- **WHEN** `src/hud.js` has the class name "hud-classification"
- **THEN** the test stops the build

#### Scenario: Stop for a style rule of the removed element `hud-markings-004`
- **WHEN** `src/ui/styles/overlays.css` has a rule or a selector for the class "hud-classification"
- **THEN** the test stops the build

