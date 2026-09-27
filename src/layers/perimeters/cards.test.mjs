import test from 'node:test';
import assert from 'node:assert/strict';
import {
  perimeterAnchorDegrees,
  buildIncidentCard,
  containmentAccent,
} from './cards.js';

const square = [
  [-108.2, 35.0],
  [-108.0, 35.0],
  [-108.0, 35.2],
  [-108.2, 35.2],
  [-108.2, 35.0],
];
const tiny = [
  [-107.01, 34.0],
  [-107.0, 34.0],
  [-107.0, 34.01],
  [-107.01, 34.0],
];

test('[perimeters-005] the card anchors at the centroid of the largest polygon', () => {
  const anchor = perimeterAnchorDegrees([[tiny], [square]]);
  assert.ok(Math.abs(anchor.lon - -108.1) < 1e-9);
  assert.ok(Math.abs(anchor.lat - 35.1) < 1e-9);
});

test('[perimeters-006] a full incident row renders name, size, containment, and ages', () => {
  const now = 1758000000000;
  const card = buildIncidentCard(
    {
      stableId: '2026-NMGNF-000123',
      name: 'Frijoles',
      acres: 15956.4,
      containedPct: 74,
      state: 'US-NM',
      category: 'WF',
      discoveredTime: now - 36 * 3600000,
      updatedTime: now - 2 * 3600000,
      cause: 'Natural',
      behavior: 'Active',
      personnel: 380,
      county: 'Sandoval',
      costToDate: 4200000,
      complexity: 'Type 3 Incident',
    },
    now,
  );
  assert.equal(card.id, 'fire-perimeter-card:2026-NMGNF-000123');
  assert.equal(card.title, 'FIRE · Frijoles');
  assert.deepEqual(card.details, [
    '15,956 ac · 74% contained · US-NM',
    'Natural cause · Active · Type 3 Incident',
    '380 personnel · Sandoval County · $4.2M to date',
    'discovered 1d ago · updated 2h ago',
  ]);
  assert.equal(card.selected, true);
  assert.equal(typeof card.accent, 'string');
});

test('[perimeters-006] missing attributes degrade to available facts instead of placeholders', () => {
  const card = buildIncidentCard(
    {
      stableId: 'x',
      name: null,
      acres: null,
      containedPct: null,
      state: null,
      category: 'RX',
      discoveredTime: null,
      updatedTime: null,
      cause: null,
      behavior: null,
      personnel: null,
      county: null,
      costToDate: null,
      complexity: null,
    },
    1758000000000,
  );
  assert.equal(card.title, 'FIRE · Unnamed incident');
  assert.deepEqual(card.details, ['containment unknown · RX']);
});

test('[perimeters-006] a known InciWeb page adds a link line to the card', () => {
  const card = buildIncidentCard(
    {
      stableId: 'x',
      name: 'Timber',
      acres: 25426,
      containedPct: 44,
      state: 'US-CA',
      category: 'WF',
      discoveredTime: null,
      updatedTime: null,
      cause: null,
      behavior: null,
      personnel: null,
      county: null,
      costToDate: null,
      complexity: null,
    },
    1758000000000,
    {
      link: 'https://inciweb.wildfire.gov/incident-information/calpf-timber-fire',
    },
  );
  assert.equal(card.details.at(-1), 'InciWeb ↗ · click card to open');
  assert.equal(card.interactive, true);
  assert.match(card.accessibilityLabel, /InciWeb/);
});

test('[perimeters-006] the selected card claims the selected paint lane, not the ambient lane', () => {
  const card = buildIncidentCard(
    {
      stableId: 'x',
      name: 'Any',
      acres: 1,
      containedPct: 1,
      state: 'US-NM',
      category: 'WF',
      discoveredTime: null,
      updatedTime: null,
      cause: null,
      behavior: null,
      personnel: null,
      county: null,
      costToDate: null,
      complexity: null,
      complexName: null,
    },
    1758000000000,
  );
  assert.equal(card.selected, true);
  // An explicit paintLane would override `selected` in the overlay host's
  // lane resolver and push the card under other selected cards.
  assert.equal('paintLane' in card, false);
  assert.equal('collisionGroup' in card, false);
});

test('[perimeters-006] costs near a unit boundary promote to the larger unit', () => {
  const base = {
    stableId: 'x',
    name: 'Any',
    acres: null,
    containedPct: null,
    state: null,
    category: null,
    discoveredTime: null,
    updatedTime: null,
    cause: null,
    behavior: null,
    personnel: null,
    county: null,
    complexity: null,
    complexName: null,
  };
  const costLine = (costToDate) =>
    buildIncidentCard({ ...base, costToDate }, 0).details.find((line) =>
      line.includes('to date'),
    );
  assert.equal(costLine(999500), '$1M to date');
  assert.equal(costLine(999499), '$999K to date');
  assert.equal(costLine(999600000), '$1B to date');
  assert.equal(costLine(4200000), '$4.2M to date');
});

test('[perimeters-006] a complex member names its complex on the card', () => {
  const card = buildIncidentCard(
    {
      stableId: 'x',
      name: 'Crosswhite',
      acres: 342923,
      containedPct: 99,
      state: 'US-OR',
      category: 'WF',
      discoveredTime: null,
      updatedTime: null,
      cause: null,
      behavior: null,
      personnel: null,
      county: null,
      costToDate: null,
      complexity: null,
      complexName: 'ROWE CREEK COMPLEX',
    },
    1758000000000,
  );
  assert.ok(card.details.includes('part of Rowe Creek Complex'));
});

test('[perimeters-006] a card without a link is not interactive', () => {
  const card = buildIncidentCard(
    {
      stableId: 'x',
      name: 'Crosswhite',
      acres: 1,
      containedPct: 1,
      state: 'US-OR',
      category: 'WF',
      discoveredTime: null,
      updatedTime: null,
      cause: null,
      behavior: null,
      personnel: null,
      county: null,
      costToDate: null,
      complexity: null,
    },
    1758000000000,
  );
  assert.equal(card.interactive, false);
});

test('[perimeters-006] partial incident details render only the facts that exist', () => {
  const card = buildIncidentCard(
    {
      stableId: 'x',
      name: 'Whiskey',
      acres: 542,
      containedPct: 48,
      state: 'US-NM',
      category: 'WF',
      discoveredTime: null,
      updatedTime: null,
      cause: 'Human',
      behavior: null,
      personnel: null,
      county: 'Catron',
      costToDate: 85000,
      complexity: null,
    },
    1758000000000,
  );
  assert.deepEqual(card.details, [
    '542 ac · 48% contained · US-NM',
    'Human cause',
    'Catron County · $85K to date',
  ]);
});

test('[perimeters-006] full containment is green and a low cost has no text', () => {
  assert.equal(containmentAccent(100), '#8bc34a');
  const card = buildIncidentCard(
    {
      stableId: 'a',
      name: '',
      containedPct: 100,
      costToDate: 999,
      polygons: [],
    },
    0,
  );
  assert.equal(card.title, 'FIRE · Unnamed incident');
  assert.equal(card.accent, '#8bc34a');
  assert.equal(
    card.details.some((part) => part.includes('to date')),
    false,
  );
});

test('[perimeters-006] a negative age has no age text', () => {
  const card = buildIncidentCard(
    {
      stableId: 'a',
      name: 'A',
      containedPct: 0,
      discoveredTime: 100,
      updatedTime: 100,
    },
    0,
  );
  assert.equal(
    card.details.some((part) => part.includes('ago')),
    false,
  );
});
