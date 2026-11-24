// Solid chrome that card placement should avoid. It composites above the
// overlay; the host needs no paint mask. Cockpit line art is intentionally
// excluded so its large bounds cannot suppress world-space content.
export const WORLD_OVERLAY_OCCLUDER_SELECTORS = Object.freeze([
  '#title-bar',
  '#style-indicator',
  '#top-center-actions',
  '#traffic-sync-chip',
  '#cctv-sync-chip',
  '#left-panel-stack',
  '#right-context-rail',
  '.weather-summary',
  '#pp-toggles',
  '#command-dock',
  '#gev-voice-control',
  '#cesium-credits',
  '#gev-credits',
  '.hud-top-left',
  '.hud-top-right',
  '.hud-bottom-left',
  '.hud-bottom-right',
  '.hud-bottom-bar',
  '#space-mission-panel',
  '#space-mission-panel-host',
  '#military-awareness-panel',
  // OSH panel: a solid backdrop-filled window, `hidden` until the layer holds a
  // detail. Not `:not([hidden])`: the world overlay watches the `hidden` attribute
  // of an element that matches at start, and it never watches a skipped element.
  '#osh-panel',
  '#bhote-koshi-event-panel',
  // Only the cockpit's solid windows obstruct readable cards.
  '#cockpit-context',
  '#cockpit-signal-stream',
]);
