import test from 'node:test';
import assert from 'node:assert/strict';
import {
  object,
  fields,
  string,
  number,
  optional,
  array,
  ids,
  uniqueId,
  jsonTree,
  SceneDocumentError,
} from './documentFields.js';

test('[director-005] The object check rejects null', () => {
  assert.throws(() => object(null, '$'), /expected an object/);
});

test('[director-005] The object check rejects text', () => {
  assert.throws(() => object('x', '$'), /expected an object/);
});

test('[director-005] The object check rejects an array', () => {
  assert.throws(() => object([], '$'), /expected an object/);
});

test('[director-005] The field check rejects each unsupported key', () => {
  assert.throws(() => fields({ extra: 1 }, '$', ['good']), /\$\.extra/);
  assert.doesNotThrow(() => fields({ good: 1 }, '$', ['good']));
});

test('[director-006] The text check rejects numbers', () => {
  assert.throws(() => string(1, '$', 3), /nonempty text/);
});

test('[director-006] The text check rejects blank text', () => {
  assert.throws(() => string(' ', '$', 3), /nonempty text/);
});

test('[director-006] The text check rejects excess length', () => {
  assert.throws(() => string('abcd', '$', 3), /nonempty text/);
});

test('[director-006] The text check accepts the exact limit', () => {
  assert.doesNotThrow(() => string('abc', '$', 3));
  assert.doesNotThrow(() => string('x', '$'));
});

test('[director-007] The number check rejects text', () => {
  assert.throws(() => number('2', '$', 0, 3, false), /expected a number/);
});

test('[director-007] The number check rejects NaN', () => {
  assert.throws(() => number(NaN, '$', 0, 3, false), /expected a number/);
});

test('[director-007] The number check rejects the lower excess', () => {
  assert.throws(() => number(-1, '$', 0, 3, false), /expected a number/);
});

test('[director-007] The number check rejects the upper excess', () => {
  assert.throws(() => number(4, '$', 0, 3, false), /expected a number/);
});

test('[director-007] The legacy flag alone allows numeric text', () => {
  assert.doesNotThrow(() => number('2', '$', 0, 3, true));
  assert.throws(() => number('2', '$', 0, 3, false));
});

test('[director-007] The legacy number input keeps its type', () => {
  assert.doesNotThrow(() => number(2, '$', 0, 3, true));
  assert.throws(() => number({ toString: () => '2' }, '$', 0, 3, true));
});

test('[director-007] The legacy blank text fails numeric checks', () => {
  assert.throws(() => number(' ', '$', 0, 3, true));
});

test('[director-007] The number check accepts both bounds', () => {
  assert.doesNotThrow(() => number(0, '$', 0, 3));
  assert.doesNotThrow(() => number(3, '$', 0, 3));
});

test('[director-008] The optional check uses own fields only', () => {
  const calls = [];
  const check = (v, p) => calls.push([v, p]);
  optional(Object.create({ x: 1 }), 'x', '$', check);
  optional({ x: 2 }, 'x', '$', check);
  assert.deepEqual(calls, [[2, '$.x']]);
});

test('[director-009] The array check rejects objects', () => {
  assert.throws(() => array({}, '$', 1), /expected an array/);
});

test('[director-009] The array check rejects excess entries', () => {
  assert.throws(() => array([1, 2], '$', 1), /expected an array/);
});

test('[director-009] The ID list checks every entry', () => {
  assert.doesNotThrow(() => ids(['a', 'b'], '$'));
  assert.throws(() => ids(['a', ' '], '$'), /\$\[1\]/);
});

test('[director-009] The unique ID check keeps its set', () => {
  const seen = new Set();
  uniqueId({}, '$', seen);
  uniqueId({ id: 'a' }, '$', seen);
  assert.deepEqual([...seen], ['a']);
  assert.throws(() => uniqueId({ id: 'a' }, '$', seen), /duplicate ID/);
});

test('[director-010] The node budget rejects its next value', () => {
  assert.throws(() => jsonTree(null, '$', { nodes: 200000 }), /complexity/);
  assert.doesNotThrow(() => jsonTree(null, '$', { nodes: 199999 }));
});

test('[director-010] The depth check rejects its next level', () => {
  assert.throws(() => jsonTree(null, '$', { nodes: 0 }, 25), /complexity/);
  assert.doesNotThrow(() => jsonTree(null, '$', { nodes: 0 }, 24));
});

test('[director-011] The JSON null takes its own path', () => {
  assert.doesNotThrow(() => jsonTree(null, '$', { nodes: 0 }));
});

test('[director-011] The JSON boolean takes its own path', () => {
  assert.doesNotThrow(() => jsonTree(true, '$', { nodes: 0 }));
});

test('[director-011] The JSON finite number takes its own path', () => {
  assert.doesNotThrow(() => jsonTree(3, '$', { nodes: 0 }));
});

test('[director-011] The JSON rejects an infinite number', () => {
  assert.throws(() => jsonTree(Infinity, '$', { nodes: 0 }));
});

test('[director-011] The JSON rejects undefined', () => {
  assert.throws(() => jsonTree(undefined, '$', { nodes: 0 }), /JSON value/);
});

test('[director-011] The JSON rejects functions', () => {
  assert.throws(() => jsonTree(() => 1, '$', { nodes: 0 }), /JSON value/);
});

test('[director-011] The JSON accepts an ordinary object', () => {
  assert.doesNotThrow(() => jsonTree({ a: 1 }, '$', { nodes: 0 }));
});

test('[director-011] The JSON accepts arrays', () => {
  assert.doesNotThrow(() => jsonTree([1], '$', { nodes: 0 }));
});

test('[director-011] The JSON accepts a null prototype', () => {
  assert.doesNotThrow(() =>
    jsonTree(Object.assign(Object.create(null), { a: 1 }), '$', { nodes: 0 }),
  );
});

test('[director-011] The JSON rejects a custom prototype', () => {
  assert.throws(
    () => jsonTree(Object.create({ x: 1 }), '$', { nodes: 0 }),
    /JSON object/,
  );
});

test('[director-012] The JSON text limit checks its boundary', () => {
  assert.doesNotThrow(() => jsonTree('x'.repeat(65536), '$', { nodes: 0 }));
  assert.throws(
    () => jsonTree('x'.repeat(65537), '$', { nodes: 0 }),
    /text is too long/,
  );
});

test('[director-012] The JSON entry limit checks its boundary', () => {
  assert.throws(
    () => jsonTree(Array(10001).fill(null), '$', { nodes: 0 }),
    /too many entries/,
  );
  assert.doesNotThrow(() =>
    jsonTree(Array(10000).fill(null), '$', { nodes: 0 }),
  );
});

test('[director-012] The JSON rejects the __proto__ key', () => {
  assert.throws(
    () => jsonTree({ ['__proto__']: null }, '$', { nodes: 0 }),
    /unsafe object key/,
  );
});

test('[director-012] The JSON rejects the constructor key', () => {
  assert.throws(
    () => jsonTree({ ['constructor']: null }, '$', { nodes: 0 }),
    /unsafe object key/,
  );
});

test('[director-012] The JSON rejects the prototype key', () => {
  assert.throws(
    () => jsonTree({ ['prototype']: null }, '$', { nodes: 0 }),
    /unsafe object key/,
  );
});

test('[director-012] The JSON rejects long field names', () => {
  assert.throws(
    () => jsonTree({ ['x'.repeat(257)]: null }, '$', { nodes: 0 }),
    /field name/,
  );
});

test('[director-007] The number check rejects custom conversion objects', () => {
  assert.throws(() => number({ valueOf: () => 2 }, '$', 0, 3, true));
  assert.throws(() => number(new Number(2), '$', 0, 3, true));
});

test('[director-011] The JSON rejects falsy nonobject values', () => {
  for (const value of [undefined, NaN, 0n, '']) {
    if (value === '')
      assert.doesNotThrow(() => jsonTree(value, '$', { nodes: 0 }));
    else assert.throws(() => jsonTree(value, '$', { nodes: 0 }));
  }
});

test('[director-006] The default text limit accepts 256 characters', () => {
  assert.doesNotThrow(() => string('x'.repeat(256), '$'));
});

test('[director-006] The default text limit rejects 257 characters', () => {
  assert.throws(() => string('x'.repeat(257), '$'), { name: 'SceneDocumentError', path: '$' });
});
