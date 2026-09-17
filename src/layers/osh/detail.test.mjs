import assert from 'node:assert/strict';
import test from 'node:test';
import { renderOshDetail, writeOshDetail } from './detail.js';

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
  assert.doesNotMatch(html, /<System>/);
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

test('[osh-032] renders no rows and no time when there is no observation yet', () => {
  const html = renderOshDetail({
    system: { id: 'sys-fixture-3' },
    datastreams: [{ id: 'ds-fixture-3' }],
  });
  assert.match(html, /No data/);
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
