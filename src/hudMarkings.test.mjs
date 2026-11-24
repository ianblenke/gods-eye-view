import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');
const hud = read('./hud.js');
const view = read('./ui/views/IntelHudView.vue');
const overlays = read('./ui/styles/overlays.css');

// Markings of the United States government. The program shows open data only.
// "UNCLASSIFIED" is a correct open marking, so "CLASSIFIED" needs no "UN" before it.
const MARKINGS = [
  /TOP SECRET/,
  /SI-TK/,
  /NOFORN/,
  /CONFIDENTIAL/,
  /(?<!UN)CLASSIFIED/,
];
// The files that make the HUD and its styles. See the known limit hud-markings-file-scope.
const HUD_FILES = [
  './hud.js',
  './ui/views/IntelHudView.vue',
  './hudLocality.js',
  './hudSummaryResponse.js',
  '../index.html',
  './ui/styles/overlays.css',
  './ui/styles/responsive.css',
  './ui/styles/cockpit.css',
];

test('[hud-markings-001] shows no classification marking in a HUD file, in any letter case', () => {
  for (const name of HUD_FILES) {
    const upper = read(name).toUpperCase();
    for (const marking of MARKINGS) {
      assert.equal(
        marking.test(upper),
        false,
        `${name} has the marking ${marking}`,
      );
    }
  }
});

test('[hud-markings-002] has no classification element in the HUD code', () => {
  assert.equal(
    hud.includes('hud-classification'),
    false,
    'src/hud.js has the class hud-classification',
  );
  assert.equal(
    view.includes('hud-classification'),
    false,
    'IntelHudView.vue has the class hud-classification',
  );
});

test('[hud-markings-004] has no style rule for the removed element', () => {
  assert.equal(
    overlays.includes('hud-classification'),
    false,
    'overlays.css has a rule for hud-classification',
  );
});
