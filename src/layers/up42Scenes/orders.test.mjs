import test from 'node:test';
import assert from 'node:assert/strict';
import {
  acceptConfirmText,
  acceptedText,
  describeOrderFailure,
  orderConfirmText,
  orderedText,
  quotationText,
  rejectConfirmText,
} from './orders.js';

const ORDER = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

test('[up42-order-panel-005] states the amount and no spend in the order confirm text', () => {
  assert.equal(
    orderConfirmText('Pleiades', 120),
    'Order Pleiades for this view? The estimate is 120 credits. This spends no credits yet.',
  );
});

test('[up42-order-panel-006] names the order with its first eight characters', () => {
  assert.equal(orderedText(ORDER), 'Order aaaaaaaa is placed. No credits are spent.');
});

test('[up42-order-panel-007] gives the price of an undecided quotation and the decision of another', () => {
  assert.equal(
    quotationText({ credits: 90, decision: 'NOT_DECIDED' }),
    'Quotation: 90 credits.',
  );
  assert.equal(
    quotationText({ credits: 90, decision: 'ACCEPTED' }),
    'This quotation is accepted.',
  );
  assert.equal(
    quotationText({ credits: 90, decision: 'REJECTED' }),
    'This quotation is rejected.',
  );
});

test('[up42-order-panel-008] states the spend and that it cannot be reversed in the accept text', () => {
  assert.equal(
    acceptConfirmText(90),
    'Accept the quotation of 90 credits? This spends 90 credits. UP42 cannot reverse it.',
  );
});

test('[up42-order-panel-009] states the spent credits after an accept', () => {
  assert.equal(
    acceptedText(90),
    'The quotation is accepted. 90 credits are spent.',
  );
});

test('[up42-order-panel-014] states that a reject spends no credits', () => {
  assert.equal(
    rejectConfirmText(90),
    'Reject the quotation of 90 credits? The order stays unpaid and spends no credits.',
  );
});

const KNOWN = [
  ['over_cap', 'The price is above the credit cap of the server. Nothing is spent.'],
  ['over_approved', 'The price is above the price that you saw. Nothing is spent. Quote again.'],
  ['duplicate', 'This order exists already. Check the quotation.'],
  ['busy', 'The server is still working on this request.'],
  ['budget', 'No more orders today.'],
  ['decided', 'This quotation has its decision already.'],
  ['insufficient_balance', 'The UP42 balance is too low. Nothing is spent.'],
  ['order_unclear', 'UP42 gave no clear answer. An order can exist. Check UP42 before you try again.'],
  ['accept_unclear', 'UP42 gave no clear answer. Credits can be spent. Check the order in UP42 before you try again.'],
  ['reject_unclear', 'UP42 gave no clear answer. Check the order in UP42 before you try again.'],
  ['orders_off', 'Orders are off. Set UP42_ORDERS=true in .env and restart the app.'],
  ['no_cap', 'No credit cap. Set UP42_ORDER_MAX_CREDITS in .env and restart the app.'],
  ['store_failed', 'The server cannot write its order file. Check the volume of the app.'],
  ['unreachable', 'The server did not answer.'],
];
test('[up42-order-panel-010] shows a fixed text for each known error and a generic text for another', () => {
  for (const [error, text] of KNOWN)
    assert.equal(describeOrderFailure({ error }), text);
  for (const error of [
    'rate_limited',
    'no_credentials',
    'credentials_rejected',
    'order_refused',
    'accept_refused',
    'reject_refused',
    'unknown_order',
    'unknown_quotation',
    'not_ours',
    'area_too_large',
    'upstream_failed',
    'bad_answer',
  ])
    assert.notEqual(describeOrderFailure({ error }), 'UP42 did not complete the step.');
  assert.equal(describeOrderFailure({ error: 'x' }), 'UP42 did not complete the step.');
  assert.equal(describeOrderFailure({ error: 'toString' }), 'UP42 did not complete the step.');
});
