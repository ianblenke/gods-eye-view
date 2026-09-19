import assert from 'node:assert/strict';
import test from 'node:test';
import { renderOshDetail, writeOshDetail } from './detail.js';
import { OSH_FRESH_MAX_AGE_MS } from '../../data/oshObservations.js';

const DETAIL = {
  system: {
    id: 'sys-fixture-1',
    uid: 'urn:osh:sys-fixture-1',
    name: 'Fixture <System>',
    description: 'A & B "quoted"',
  },
  datastreams: [
    {
      id: 'ds-fixture-1',
      name: 'Weather',
      observation: {
        resultTime: '2026-01-01T00:05:01Z',
        rows: [{ path: 'temp<eratur>e', value: '21 & "cold"' }],
        ageMs: 12_000,
      },
    },
  ],
};

test('[osh-032] renders the system and its datastreams with escaped values', () => {
  const html = renderOshDetail(DETAIL);
  assert.match(html, /Fixture &lt;System&gt;/);
  assert.match(html, /A &amp; B &quot;quoted&quot;/);
  assert.match(html, /temp&lt;eratur&gt;e/);
  assert.match(html, /21 &amp; &quot;cold&quot;/);
  assert.match(html, /2026-01-01T00:05:01Z/);
  assert.match(html, /12 s/);
  assert.doesNotMatch(html, /osh-detail-old/);
  assert.doesNotMatch(html, /<System>/);
});

test('[osh-032] shows the observation age in words: seconds, minutes, hours and days', () => {
  const html = (ageMs) =>
    renderOshDetail({
      system: { id: 'sys-fixture-1' },
      datastreams: [{ id: 'ds-fixture-1', observation: { rows: [], ageMs } }],
    });
  assert.match(html(12_000), /12 s/);
  assert.match(html(5 * 60_000), /5 min/);
  assert.match(html(3 * 60 * 60_000), /3 h/);
  assert.match(html(6 * 24 * 60 * 60_000), /6 d/);
});

test('[osh-032] adds the class osh-detail-old and the word old to a datastream past the threshold', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-1' },
    datastreams: [
      { id: 'ds-fixture-1', observation: { rows: [], ageMs: OSH_FRESH_MAX_AGE_MS + 1 } },
    ],
  });
  assert.match(html, /osh-detail-old/);
  // Not just the class name: the rendered text itself must carry the word
  // "old" as content, past the closing quote of the class attribute.
  assert.match(html, /osh-detail-old">[^<]*\bold\b/);
});

test('[osh-032] a datastream at the freshness threshold is not marked old', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-1' },
    datastreams: [{ id: 'ds-fixture-1', observation: { rows: [], ageMs: OSH_FRESH_MAX_AGE_MS } }],
  });
  assert.doesNotMatch(html, /osh-detail-old/);
});

test('[osh-032] a negative age is fresh and renders as a plain age, not old', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-1' },
    datastreams: [{ id: 'ds-fixture-1', observation: { rows: [], ageMs: -5000 } }],
  });
  assert.doesNotMatch(html, /osh-detail-old/);
  assert.match(html, /0 s/);
});

test('[osh-032] a null ageMs reads "age unknown", takes the class, and never takes the word old', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-1' },
    datastreams: [{ id: 'ds-fixture-1', observation: { rows: [], ageMs: null } }],
  });
  assert.match(html, /age unknown/);
  assert.match(html, /osh-detail-old/);
  // An unknown age must not read as an old one. The panel showed
  // `age unknown old` before this assertion existed.
  assert.doesNotMatch(html, /age unknown old/);
});

test('[osh-032] a time further ahead than drift explains reads as ahead, never as old', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-1' },
    datastreams: [{ id: 'ds-fixture-1', observation: { rows: [], ageMs: -31_536_000_000 } }],
  });
  assert.match(html, /ahead of the clock/);
  assert.match(html, /osh-detail-old/);
  // Without the bound this read `0 s` with no mark, the freshest reading
  // the panel can show, for a record dated a year from now.
  assert.doesNotMatch(html, /0 s/);
  assert.doesNotMatch(html, /clock old/);
});

test('[osh-032] the panel and the freshness rule agree at the skew bound itself', () => {
  // The bound is one function now. When it was spelled out in three places,
  // flipping one copy to `<=` left this value fresh to the layer and
  // unusable to the panel, and all 164 tests passed.
  const at = renderOshDetail({
    system: { id: 'sys-fixture-1' },
    datastreams: [{ id: 'ds-fixture-1', observation: { rows: [], ageMs: -300_000 } }],
  });
  assert.match(at, /0 s/);
  assert.doesNotMatch(at, /osh-detail-old/);
  assert.doesNotMatch(at, /ahead of the clock/);
  const past = renderOshDetail({
    system: { id: 'sys-fixture-1' },
    datastreams: [{ id: 'ds-fixture-1', observation: { rows: [], ageMs: -300_001 } }],
  });
  assert.match(past, /ahead of the clock/);
  assert.match(past, /osh-detail-old/);
});

test('[osh-032] the measured clock skew still reads as a fresh zero', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-1' },
    datastreams: [{ id: 'ds-fixture-1', observation: { rows: [], ageMs: -5_000 } }],
  });
  assert.match(html, /0 s/);
  assert.doesNotMatch(html, /osh-detail-old/);
});

test('[osh-032] an age past the threshold does take the word old', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-1' },
    datastreams: [{ id: 'ds-fixture-1', observation: { rows: [], ageMs: 7_200_000 } }],
  });
  assert.match(html, /osh-detail-old/);
  assert.match(html, /2 h old/);
});

test('[osh-032] renders "No data" for a datastream with no rows, and falls back to the id', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-2' },
    datastreams: [{ id: 'ds-fixture-2', observation: { rows: [] } }],
  });
  assert.match(html, /No data/);
  assert.match(html, /sys-fixture-2/);
  assert.match(html, /ds-fixture-2/);
  assert.match(html, /—/);
});

test('[osh-032] renders no rows and no time when there is no observation yet, and marks the age unknown', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-3' },
    datastreams: [{ id: 'ds-fixture-3' }],
  });
  assert.match(html, /No data/);
  assert.match(html, /age unknown/);
});

test('[osh-032] renders a null row value as an empty string', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-5' },
    datastreams: [
      {
        id: 'ds-fixture-5',
        observation: { rows: [{ path: 'note', value: null }] },
      },
    ],
  });
  assert.match(html, /osh-detail-value"><\/span>/);
});

test('[osh-032] renders an empty string for no selection', () => {
  assert.equal(renderOshDetail(null), '');
  assert.equal(renderOshDetail(undefined), '');
  assert.equal(renderOshDetail({}), '');
});

test('[osh-032] a system with no datastreams still renders the system header', () => {
  const html = renderOshDetail({ system: { id: 'sys-fixture-4' } });
  assert.notEqual(html, '');
  assert.match(html, /sys-fixture-4/);
  assert.equal(
    html,
    renderOshDetail({ system: { id: 'sys-fixture-4' }, datastreams: [] }),
    'an absent datastreams list must render the same as an explicit empty one',
  );
});

test('[osh-032] shows the feature name above the host name, when the selection came from a feature with a known host', () => {
  const html = renderOshDetail({
    feature: { id: 'foi-fixture-1', name: 'Fixture <Node>' },
    hostId: 'sys-fixture-1',
    system: { id: 'sys-fixture-1', name: 'Fixture Host', uid: null, description: null },
    datastreams: [],
  });
  assert.match(html, /Fixture &lt;Node&gt;/);
  assert.match(html, /Host: Fixture Host/);
  const featureIndex = html.indexOf('Fixture &lt;Node&gt;');
  const hostIndex = html.indexOf('Fixture Host');
  assert.ok(featureIndex < hostIndex, 'the feature name must render above the host name');
});

test('[osh-032] shows the host id when the host has no record', () => {
  const html = renderOshDetail({
    feature: { id: 'foi-fixture-2', name: 'Fixture Node Two' },
    hostId: 'sys-fixture-9',
    system: null,
    datastreams: [],
  });
  assert.match(html, /Host: sys-fixture-9/);
});

test('[osh-032] shows Host: — when the feature has no host', () => {
  const html = renderOshDetail({
    feature: { id: 'foi-fixture-3', name: 'Fixture Node Three' },
    hostId: null,
    system: null,
    datastreams: [],
  });
  assert.match(html, /Host: —/);
});

test('[osh-032] falls back to the feature id when the feature has no name', () => {
  const html = renderOshDetail({
    feature: { id: 'foi-fixture-9', name: null },
    hostId: null,
    system: null,
    datastreams: [],
  });
  assert.match(html, /foi-fixture-9/);
});

test('[osh-032] falls back to the host system id when the host record has no name', () => {
  const html = renderOshDetail({
    feature: { id: 'foi-fixture-10', name: 'Fixture Node Ten' },
    hostId: 'sys-fixture-10',
    system: { id: 'sys-fixture-10', name: null, uid: null, description: null },
    datastreams: [],
  });
  assert.match(html, /Host: sys-fixture-10/);
});

test('[osh-032] a system-only selection still renders the plain system header, with no feature block', () => {
  const html = renderOshDetail(DETAIL);
  assert.doesNotMatch(html, /osh-detail-feature/);
  assert.match(html, /osh-detail-system/);
});

test('[osh-032] the host innerHTML receives the rendered detail, and an empty selection clears it', () => {
  const host = { innerHTML: '' };
  writeOshDetail(host, DETAIL);
  assert.match(host.innerHTML, /Fixture &lt;System&gt;/);
  writeOshDetail(host, null);
  assert.equal(host.innerHTML, '');
});

test('[osh-032] the function does nothing when there is no host', () => {
  assert.doesNotThrow(() => writeOshDetail(null, DETAIL));
});

// --- osh-032 (further MODIFIED by osh-location-streams): the placed-by line ---

test('[osh-032] shows Placed by with the datastream name and the age, for a stream-placed system', () => {
  const html = renderOshDetail({
    system: {
      id: 'sys-fixture-9',
      uid: null,
      name: null,
      description: null,
      placedBy: { datastreamName: 'Aircraft <Position>', ageMs: 12_000 },
    },
    datastreams: [],
  });
  assert.match(html, /Placed by Aircraft &lt;Position&gt; \(12 s\)/);
});

test('[osh-032] Placed by falls back to an em dash for a datastream with no name', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-9', uid: null, name: null, description: null, placedBy: { datastreamName: null, ageMs: 5000 } },
    datastreams: [],
  });
  assert.match(html, /Placed by — \(5 s\)/);
});

test('[osh-032] no Placed by line for a system placed by its own geometry', () => {
  const html = renderOshDetail(DETAIL);
  assert.doesNotMatch(html, /Placed by/);
  assert.doesNotMatch(html, /osh-detail-placed-by/);
});

test('[osh-032] the system id stands in for its name when the system has neither, for a stream-placed system', () => {
  const html = renderOshDetail({
    system: {
      id: 'sys-fixture-unread',
      uid: null,
      name: null,
      description: null,
      placedBy: { datastreamName: 'Aircraft Position', ageMs: null },
    },
    datastreams: [],
  });
  assert.match(html, /<h3>sys-fixture-unread<\/h3>/);
  assert.match(html, /Placed by Aircraft Position \(age unknown\)/);
});
