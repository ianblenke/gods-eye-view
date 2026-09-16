import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');
const hud = read('./hud.js');
const overlays = read('./ui/styles/overlays.css');

// Markings of the United States government. The program shows open data only.
// "UNCLASSIFIED" is a correct open marking, so "CLASSIFIED" needs no "UN" before it.
const MARKINGS = [/TOP SECRET/, /SI-TK/, /NOFORN/, /CONFIDENTIAL/, /(?<!UN)CLASSIFIED/];
// The files that make the HUD and its styles. See the known limit hud-markings-file-scope.
const HUD_FILES = ['./hud.js', './hudLocality.js', './hudSummaryResponse.js', '../index.html', './ui/styles/overlays.css', './ui/styles/responsive.css', './ui/styles/cockpit.css'];

test('[hud-markings-001] shows no classification marking in a HUD file, in any letter case', () => {
  for (const name of HUD_FILES) {
    const upper = read(name).toUpperCase();
    for (const marking of MARKINGS) {
      assert.equal(marking.test(upper), false, `${name} has the marking ${marking}`);
    }
  }
  assert.ok(hud.includes('hud-top-bar'), 'the top bar is still there');
});

test('[hud-markings-002] has no classification element in the HUD code', () => {
  assert.equal(hud.includes('hud-classification'), false, 'src/hud.js has the class hud-classification');
});

test('[hud-markings-004] has no style rule for the removed element', () => {
  assert.equal(overlays.includes('hud-classification'), false, 'overlays.css has a rule for hud-classification');
});

test('[hud-markings-003] keeps the three parts of the top bar and gives the left part and the right part the same width', () => {
  for (const name of ['hud-top-bar-left', 'hud-top-bar-center', 'hud-top-bar-right']) {
    assert.ok(hud.includes(`class="${name}"`), `the top bar has the part ${name}`);
  }
  const rule = overlays.match(/\.hud-top-bar-left,\s*\n\.hud-top-bar-right\s*\{([^}]*)\}/);
  assert.ok(rule, 'overlays.css has one rule for the left part and the right part');
  assert.match(rule[1], /flex:\s*1 1 0;/, 'the left part and the right part have the same width');
  // A blank line before the selector, so this is not the rule that the left part shares.
  const right = overlays.match(/\n\n\.hud-top-bar-right\s*\{([^}]*)\}/);
  assert.ok(right, 'overlays.css has a rule for the right part');
  assert.match(right[1], /text-align:\s*right;/, 'the text of the right part stays at the right');
});
