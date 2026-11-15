import test from 'node:test';
import assert from 'node:assert/strict';
import { createUp42Source } from './source.js';

const PRODUCT = '11111111-2222-3333-4444-555555555555';
const ORDER = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
const QUOTATION = 'bbbbbbbb-bbbb-cccc-dddd-eeeeeeeeeeee';
const BOX = [9.568326, 59.784163, 10.431674, 60.215837];
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status });

function make(respond) {
  const calls = [];
  const source = createUp42Source({
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return respond(url, init);
    },
    setTimer: () => 1,
    clearTimer: () => {},
  });
  return { source, calls };
}
test('[up42-order-panel-001] posts the product, the box and the credits for one order', async () => {
  const { source, calls } = make(() =>
    json({ orderId: ORDER, credits: 120, spent: false }, 200),
  );
  const answer = await source.placeOrder({
    dataProduct: PRODUCT,
    box: BOX,
    approvedCredits: 120,
  });
  assert.deepEqual(answer, { ok: true, orderId: ORDER, credits: 120 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/up42/order');
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(calls[0].init.headers, {
    'Content-Type': 'application/json',
  });
  assert.equal(
    calls[0].init.body,
    `{"dataProduct":"${PRODUCT}","box":[9.568326,59.784163,10.431674,60.215837],"approvedCredits":120}`,
  );
});

test('[up42-order-panel-001] reports an order answer that fails', async () => {
  for (const make1 of [
    () => json({ credits: 1 }),
    () => json({ orderId: 'x', credits: 1 }),
    () => json({ orderId: ORDER, credits: -1 }),
    () => json([]),
    () => new Response('{'),
  ]) {
    const { source } = make(make1);
    assert.deepEqual(await source.placeOrder({}), {
      ok: false,
      status: 200,
      error: 'bad_answer',
    });
  }
  const refused = make(() => json({ error: 'over_cap' }, 409));
  assert.deepEqual(await refused.source.placeOrder({}), {
    ok: false,
    status: 409,
    error: 'over_cap',
  });
  const budget = make(() =>
    json({ error: 'budget', used: 2, limit: 2, x: 1 }, 429),
  );
  assert.deepEqual(await budget.source.placeOrder({}), {
    ok: false,
    status: 429,
    error: 'budget',
    used: 2,
    limit: 2,
  });
  const odd = make(() => json({ error: 5 }, 502));
  assert.deepEqual(await odd.source.placeOrder({}), {
    ok: false,
    status: 502,
    error: 'unknown',
  });
  const down = createUp42Source({
    fetchImpl: async () => {
      throw new Error('down');
    },
    setTimer: () => 1,
    clearTimer: () => {},
  });
  assert.deepEqual(await down.placeOrder({}), {
    ok: false,
    status: 0,
    error: 'unreachable',
  });
  const stop = new AbortController();
  stop.abort();
  await assert.rejects(() =>
    refused.source.placeOrder({ signal: stop.signal }),
  );
});

test('[up42-order-panel-002] reads the quotation of one order with one GET', async () => {
  const body = {
    quotation: { id: QUOTATION, credits: 90.5, decision: 'NOT_DECIDED' },
  };
  const { source, calls } = make(() => json(body));
  assert.deepEqual(await source.getQuotation({ orderId: ORDER }), {
    ok: true,
    quotation: body.quotation,
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `/api/up42/order/quotation?orderId=${ORDER}`);
  assert.equal(calls[0].init.method, undefined);
  assert.equal(calls[0].init.body, undefined);
  const none = make(() => json({ quotation: null }));
  assert.deepEqual(await none.source.getQuotation({ orderId: ORDER }), {
    ok: true,
    quotation: null,
  });
  for (const bad of [
    json({}),
    json([]),
    json({ quotation: [] }),
    json({ quotation: { id: 'x', credits: 1, decision: 'A' } }),
    json({ quotation: { id: QUOTATION, credits: 'x', decision: 'A' } }),
    json({ quotation: { id: QUOTATION, credits: 1, decision: 'a b' } }),
    json({ quotation: { id: QUOTATION, credits: 1, decision: 5 } }),
  ]) {
    const x = make(() => bad);
    assert.equal(
      (await x.source.getQuotation({ orderId: ORDER })).error,
      'bad_answer',
    );
  }
  const unknown = make(() => assert.fail('no call'));
  for (const orderId of [undefined, 'x', `${ORDER}&a=1`])
    assert.deepEqual(await unknown.source.getQuotation({ orderId }), {
      ok: false,
      status: 404,
      error: 'unknown_order',
    });
  assert.equal(unknown.calls.length, 0);
});

test('[up42-order-panel-003] posts the quotation and the credits for one accept', async () => {
  const { source, calls } = make(() => json({ accepted: true, credits: 90 }));
  assert.deepEqual(
    await source.acceptQuotation({
      quotationId: QUOTATION,
      approvedCredits: 90,
    }),
    { ok: true, credits: 90 },
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/up42/order/accept');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(
    calls[0].init.body,
    `{"quotationId":"${QUOTATION}","approvedCredits":90}`,
  );
  for (const bad of [
    json({ accepted: false, credits: 1 }),
    json({ accepted: true }),
    json([]),
  ]) {
    const x = make(() => bad);
    assert.equal((await x.source.acceptQuotation({})).error, 'bad_answer');
  }
  const refused = make(() =>
    json({ error: 'accept_unclear', maySpend: true }, 502),
  );
  assert.deepEqual(await refused.source.acceptQuotation({}), {
    ok: false,
    status: 502,
    error: 'accept_unclear',
  });
});

test('[up42-order-panel-013] posts the quotation for one reject', async () => {
  const { source, calls } = make(() => json({ rejected: true }));
  assert.deepEqual(await source.rejectQuotation({ quotationId: QUOTATION }), {
    ok: true,
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/up42/order/reject');
  assert.equal(calls[0].init.body, `{"quotationId":"${QUOTATION}"}`);
  for (const bad of [json({ rejected: false }), json({}), json([])]) {
    const x = make(() => bad);
    assert.equal((await x.source.rejectQuotation({})).error, 'bad_answer');
  }
  const refused = make(() => json({ error: 'decided' }, 409));
  assert.deepEqual(await refused.source.rejectQuotation({}), {
    ok: false,
    status: 409,
    error: 'decided',
  });
});

test('[up42-order-panel-001 up42-order-panel-002 up42-order-panel-003] stops each order call after 60 seconds with no repeat', async () => {
  const calls = [];
  const timers = [];
  const source = createUp42Source({
    fetchImpl: (url, init) => {
      calls.push({ url, init });
      return new Promise((resolve, reject) =>
        init.signal.addEventListener('abort', () =>
          reject(new DOMException('aborted', 'AbortError')),
        ),
      );
    },
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: () => {},
  });
  const runs = [
    () =>
      source.placeOrder({ dataProduct: PRODUCT, box: BOX, approvedCredits: 1 }),
    () => source.getQuotation({ orderId: ORDER }),
    () =>
      source.acceptQuotation({ quotationId: QUOTATION, approvedCredits: 1 }),
  ];
  for (const [index, run] of runs.entries()) {
    const pending = run();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(timers[index].ms, 60000);
    assert.equal(calls.length, index + 1);
    timers[index].fn();
    assert.deepEqual(await pending, {
      ok: false,
      status: 0,
      error: 'unreachable',
    });
    assert.equal(calls[index].init.signal.aborted, true);
    assert.equal(calls.length, index + 1);
  }
});

test('[up42-order-panel-013] stops the reject call after 60 seconds with no repeat', async () => {
  const calls = [];
  const timers = [];
  const source = createUp42Source({
    fetchImpl: (url, init) => {
      calls.push({ url, init });
      return new Promise((resolve, reject) =>
        init.signal.addEventListener('abort', () =>
          reject(new DOMException('aborted', 'AbortError')),
        ),
      );
    },
    setTimer: (fn, ms) => {
      timers.push({ fn, ms });
      return timers.length;
    },
    clearTimer: () => {},
  });
  const runs = [() => source.rejectQuotation({ quotationId: QUOTATION })];
  for (const [index, run] of runs.entries()) {
    const pending = run();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(timers[index].ms, 60000);
    assert.equal(calls.length, index + 1);
    timers[index].fn();
    assert.deepEqual(await pending, {
      ok: false,
      status: 0,
      error: 'unreachable',
    });
    assert.equal(calls[index].init.signal.aborted, true);
    assert.equal(calls.length, index + 1);
  }
});
