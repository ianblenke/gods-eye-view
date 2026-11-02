import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeHtmlEntities,
  fieldLabel,
  htmlToText,
  kmlColor,
  parseDescriptionFields,
  wrapCardText,
} from './records.js';

// The shape ArcGIS Pro writes into every S2 placemark description.
const ARCGIS = `<html xmlns:fo="http://www.w3.org/1999/XSL/Format"><head>
<META http-equiv="Content-Type" content="text/html"></head>
<body style="margin:0px"><table style="font-family:Arial">
<tr style="text-align:center;font-weight:bold;background:#9CBCE2"><td>HistoricProtestSite</td></tr>
<tr><td><table style="font-family:Arial">
<tr><td>SHAPE</td><td>Point</td></tr>
<tr bgcolor="#D4E4F3"><td>InstallationType</td><td>HistoricProtestSite</td></tr>
<tr><td>OperationalStatus</td><td>ACTIVE</td></tr>
<tr bgcolor="#D4E4F3"><td>Affiliation</td><td>&lt;Null&gt;</td></tr>
<tr><td>Description</td><td>Locals gather here &amp; protest &#8212; weekly.</td></tr>
<tr><td>Research1</td><td><a target="_blank" href="https://x.com/a/status/1">https://x.com/a/status/1</a></td></tr>
<tr><td>Research2</td><td><a href="javascript:alert(1)">bad</a></td></tr>
<tr><td>Research3</td><td>&lt;Null&gt;</td></tr>
</table></td></tr></table></body><script type="text/javascript">
function changeImage(a, b) { document.getElementById('x').innerHTML = b; }
</script></html>`;

test('[ghostmaps-007] ArcGIS popup tables become plain label/value fields and http links', () => {
  const { fields, links } = parseDescriptionFields(ARCGIS);
  assert.deepEqual(fields, [
    { label: 'InstallationType', value: 'HistoricProtestSite' },
    { label: 'OperationalStatus', value: 'ACTIVE' },
    { label: 'Description', value: 'Locals gather here & protest — weekly.' },
    { label: 'Research2', value: 'bad' },
  ]);
  // javascript: and other schemes never become links.
  assert.deepEqual(links, ['https://x.com/a/status/1']);
});

test('[ghostmaps-008] free-form descriptions become one unlabelled field; scripts are dropped', () => {
  assert.deepEqual(
    parseDescriptionFields(
      '<p>Front line<br>as of 10 Oct</p><script>steal()</script><a href="https://s2.example/x">more</a>',
    ),
    {
      fields: [{ label: '', value: 'Front line as of 10 Oct more' }],
      links: ['https://s2.example/x'],
    },
  );
  assert.deepEqual(parseDescriptionFields(''), { fields: [], links: [] });
  assert.deepEqual(parseDescriptionFields(undefined), {
    fields: [],
    links: [],
  });
});

test('[ghostmaps-009] field values and counts are bounded', () => {
  const rows = Array.from(
    { length: 40 },
    (_, i) =>
      `<tr><td>K${i}</td><td>${String.fromCharCode(65 + (i % 26)).repeat(900)}</td></tr>`,
  ).join('');
  const { fields } = parseDescriptionFields(`<table>${rows}</table>`);
  assert.equal(fields.length, 24);
  assert.deepEqual(
    fields.map((field) => field.value.length),
    Array(24).fill(600),
  );
  assert.deepEqual(
    fields.map((field) => field.value),
    'ABCDEFGHIJKLMNOPQRSTUVWX'.split('').map((letter) => letter.repeat(600)),
  );
  assert.deepEqual(
    fields.map((field) => field.label),
    Array.from({ length: 24 }, (_, i) => `K${i}`),
  );
});

test('[ghostmaps-010] entities and tags decode to text', () => {
  assert.equal(
    decodeHtmlEntities('&lt;b&gt; &#x41;&#66; &nbsp;&bogus;'),
    '<b> AB  &bogus;',
  );
  assert.equal(decodeHtmlEntities('&#xD800;&#0;'), '');
  assert.equal(htmlToText('<style>a{}</style><b>One</b>\n two'), 'One two');
});

test('[ghostmaps-011] KML aabbggrr colors convert to rgba', () => {
  assert.deepEqual(kmlColor('ff0000ff'), [1, 0, 0, 1]);
  assert.deepEqual(kmlColor('8000ff00'), [0, 1, 0, 128 / 255]);
  assert.equal(kmlColor('red'), null);
  assert.equal(kmlColor(''), null);
});

test('[ghostmaps-012] card text wraps on words, cuts long words and marks truncation', () => {
  assert.deepEqual(wrapCardText('one two three four', 9, 4), [
    'one two',
    'three',
    'four',
  ]);
  assert.deepEqual(wrapCardText('abcdefghijkl', 5, 4), [
    'abcde',
    'fghij',
    'kl',
  ]);
  assert.deepEqual(wrapCardText('aa bb cc dd ee', 5, 2), ['aa bb', 'cc d…']);
  assert.deepEqual(wrapCardText('', 5, 2), []);
  for (const line of wrapCardText('word '.repeat(200), 20, 3))
    assert.ok(line.length <= 20);
});

test('[ghostmaps-013] CamelCase field labels read as words', () => {
  assert.equal(fieldLabel('OperationalStatus'), 'Operational Status');
  assert.equal(fieldLabel('Research1'), 'Research 1');
  assert.equal(fieldLabel('Kinetic_Activity'), 'Kinetic Activity');
});

for (const [name, input, expected] of [
  ['lowercase hex', '&#x41;', 'A'],
  ['uppercase hex', '&#X41;', 'A'],
  ['decimal', '&#65;', 'A'],
  ['zero', '&#0;', ''],
  ['the upper bound', '&#1114112;', ''],
  ['the low surrogate bound', '&#55296;', ''],
  ['the high surrogate bound', '&#57343;', ''],
  ['below surrogate', '&#55295;', '\ud7ff'],
  ['above surrogate', '&#57344;', '\ue000'],
  ['an unknown name', '&bogus;', '&bogus;'],
  ['absent text', undefined, ''],
  ['amp', '&amp;', '&'],
  ['lt', '&lt;', '<'],
  ['gt', '&gt;', '>'],
  ['quot', '&quot;', '"'],
  ['apos', '&apos;', "'"],
  ['nbsp', '&nbsp;', ' '],
]) {
  test(`[ghostmaps-010] The decoder checks ${name}`, () => {
    assert.equal(decodeHtmlEntities(input), expected);
  });
}

for (const label of ['shape', 'objectid', 'fid', 'globalid', '']) {
  test(`[ghostmaps-007] The table parser excludes the ${label || 'empty'} label`, () => {
    const html = `<tr><td>${label}</td><td>internal</td></tr><tr><td>Note</td><td>public</td></tr>`;
    assert.deepEqual(parseDescriptionFields(html).fields, [
      { label: 'Note', value: 'public' },
    ]);
  });
}

for (const value of ['', '&lt;null&gt;', 'null', 'n/a', '-', '&lt;blank&gt;']) {
  test(`[ghostmaps-007] The table parser excludes the ${value || 'empty'} value`, () => {
    const html = `<tr><td>Type</td><td>${value}</td></tr><tr><td>Note</td><td>public</td></tr>`;
    assert.deepEqual(parseDescriptionFields(html).fields, [
      { label: 'Note', value: 'public' },
    ]);
  });
}

test('[ghostmaps-007] The table parser keeps one copy of each valid link', () => {
  const html =
    '<tr><td>Link</td><td><a href="https://a.test/">https://a.test/</a><a href="https://a.test/">https://a.test/</a><a href="ftp://b.test/">bad</a></td></tr>';
  assert.deepEqual(parseDescriptionFields(html).links, ['https://a.test/']);
});

test('[ghostmaps-008] The text helper accepts absent markup', () => {
  assert.equal(htmlToText(), '');
});

test('[ghostmaps-009 ghostmaps-063] The parser caps source links and free text', () => {
  assert.equal(
    parseDescriptionFields('a'.repeat(700)).fields[0].value.length,
    600,
  );
  assert.deepEqual(
    parseDescriptionFields(
      Array.from(
        { length: 8 },
        (_, i) => `<a href="https://a.test/${i}">x</a>`,
      ).join(''),
    ).links,
    [
      'https://a.test/0',
      'https://a.test/1',
      'https://a.test/2',
      'https://a.test/3',
      'https://a.test/4',
      'https://a.test/5',
    ],
  );
});

test('[ghostmaps-011] The color parser accepts absent text', () => {
  assert.equal(kmlColor(), null);
});

test('[ghostmaps-012] The wrapper places a short word before a long word', () => {
  assert.deepEqual(wrapCardText('a abcdef', 3, 4), ['a', 'abc', 'def']);
});

test('[ghostmaps-012] The wrapper accepts absent text and its default width', () => {
  assert.deepEqual(wrapCardText(), []);
  assert.deepEqual(wrapCardText('a b'), ['a b']);
  assert.deepEqual(wrapCardText('abc', 2, 0), []);
});

test('[ghostmaps-013] The label helper accepts absent text', () => {
  assert.equal(fieldLabel(), '');
});

test('[ghostmaps-007] A link table does not add a duplicate text field', () => {
  assert.deepEqual(
    parseDescriptionFields(
      '<tr><td>Link</td><td><a href="https://a.test/">https://a.test/</a></td></tr>',
    ),
    { fields: [], links: ['https://a.test/'] },
  );
});

test('[ghostmaps-012] The wrapper checks the final line limit before it adds text', () => {
  let calls = 0;
  const limit = { valueOf: () => [10, 10, 0, 1][calls++] ?? 1 };
  assert.deepEqual(wrapCardText('aa bb', 2, limit), ['a…']);
});

test('[ghostmaps-011] The color parser returns the blue channel', () => {
  assert.deepEqual(kmlColor('40ff0000'), [0, 0, 1, 64 / 255]);
});

test('[ghostmaps-008] The text helper excludes script content', () => {
  assert.equal(htmlToText('<script>bad()</script><p>Good</p>'), 'Good');
});

test('[ghostmaps-008] The description parser excludes rows inside script markup', () => {
  const html =
    '<script><tr><td>Fake</td><td>Script text</td></tr></script><tr><td>Note</td><td>Public text</td></tr>';
  assert.deepEqual(parseDescriptionFields(html), {
    fields: [{ label: 'Note', value: 'Public text' }],
    links: [],
  });
});
