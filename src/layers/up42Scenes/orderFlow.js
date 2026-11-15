import {
  ACCEPT_LABEL,
  ACCEPTING,
  CHECK_LABEL,
  CHECKING,
  NO_QUOTATION,
  ORDERING,
  ORDER_LABEL,
  PLACE_LABEL,
  REJECTED,
  REJECTING,
  REJECT_CONFIRM_LABEL,
  REJECT_LABEL,
  acceptConfirmLabel,
  acceptConfirmText,
  acceptedText,
  describeOrderFailure,
  orderConfirmText,
  orderedText,
  quotationText,
  rejectConfirmText,
} from './orders.js';

const CANCEL = 'Cancel';
// A failure of these errors can leave an order or a spent price: no new try.
const UNCLEAR = new Set(['order_unclear', 'accept_unclear', 'reject_unclear']);
// The answer never came, or the page cannot read it.
const LOST = new Set(['unreachable', 'bad_answer']);

/**
 * The order steps after a quote. The steps are `none`, `offered`, `confirm`,
 * `placing`, `ordered`, `checking`, `quotation`, `accept-confirm`,
 * `reject-confirm`, `working` and `done`. Each spending step needs its own
 * press of a chip.
 */
export function createOrderFlow({ source, notify, isEnabled }) {
  let step = 'none';
  let offer = null;
  let orderId = null;
  let quotation = null;
  let request = null;
  let message = null;
  // A chip works only in the step that showed it, and only until the next reset.
  let epoch = 0;

  function reset() {
    epoch += 1;
    request?.abort();
    request = null;
    step = 'none';
    offer = null;
    orderId = null;
    quotation = null;
    message = null;
  }

  /**
   * Run one source call. `back` is the step after a failure that is not unclear.
   * `unclear` names the error of a call that can have changed UP42: a lost
   * answer of that call gives this error, because the server can have acted.
   */
  async function run(text, back, call, done, unclear = null) {
    const own = new AbortController();
    request = own;
    step = 'working';
    message = text;
    notify();
    let result;
    try {
      result = await call(own.signal);
    } catch {
      result = { ok: false, status: 0, error: 'unreachable' };
    }
    if (request !== own) return;
    request = null;
    if (unclear !== null && LOST.has(result.error)) {
      result = { ok: false, error: unclear };
    }
    if (result.ok) done(result);
    else {
      step = UNCLEAR.has(result.error) ? 'done' : back;
      message = describeOrderFailure(result);
    }
    notify();
  }

  const ask = (to, text) => {
    step = to;
    message = text;
    notify();
  };
  const place = () =>
    step === 'confirm' &&
    run(
      ORDERING,
      'offered',
      (signal) =>
        source.placeOrder({
          dataProduct: offer.product.id,
          box: offer.box,
          approvedCredits: offer.credits,
          signal,
        }),
      (result) => {
        orderId = result.orderId;
        step = 'ordered';
        message = orderedText(orderId);
      },
      'order_unclear',
    );
  const check = () =>
    (step === 'ordered' || step === 'quotation') &&
    run(
      CHECKING,
      step,
      (signal) => source.getQuotation({ orderId, signal }),
      (result) => {
        quotation = result.quotation;
        step =
          quotation === null
            ? 'ordered'
            : quotation.decision === 'NOT_DECIDED'
              ? 'quotation'
              : 'done';
        message = quotation === null ? NO_QUOTATION : quotationText(quotation);
      },
    );
  const accept = () =>
    step === 'accept-confirm' &&
    run(
      ACCEPTING,
      'quotation',
      (signal) =>
        source.acceptQuotation({
          quotationId: quotation.id,
          approvedCredits: quotation.credits,
          signal,
        }),
      (result) => {
        step = 'done';
        message = acceptedText(result.credits);
      },
      'accept_unclear',
    );
  const reject = () =>
    step === 'reject-confirm' &&
    run(
      REJECTING,
      'quotation',
      (signal) => source.rejectQuotation({ quotationId: quotation.id, signal }),
      () => {
        step = 'done';
        message = REJECTED;
      },
      'reject_unclear',
    );
  const cancel = () => {
    if (step === 'confirm') ask('offered', null);
    else if (step === 'accept-confirm' || step === 'reject-confirm')
      ask('quotation', quotationText(quotation));
  };

  const CHIPS = {
    offered: () => [
      {
        id: 'order',
        label: ORDER_LABEL,
        onClick: () =>
          step === 'offered' &&
          ask('confirm', orderConfirmText(offer.product.title, offer.credits)),
      },
    ],
    confirm: () => [
      { id: 'order-confirm', label: PLACE_LABEL, onClick: place },
      { id: 'order-cancel', label: CANCEL, onClick: cancel },
    ],
    ordered: () => [{ id: 'quotation', label: CHECK_LABEL, onClick: check }],
    quotation: () => [
      {
        id: 'accept',
        label: ACCEPT_LABEL,
        onClick: () =>
          ask('accept-confirm', acceptConfirmText(quotation.credits)),
      },
      {
        id: 'reject',
        label: REJECT_LABEL,
        onClick: () =>
          ask('reject-confirm', rejectConfirmText(quotation.credits)),
      },
      { id: 'quotation', label: CHECK_LABEL, onClick: check },
    ],
    'accept-confirm': () => [
      {
        id: 'accept-confirm',
        label: acceptConfirmLabel(quotation.credits),
        onClick: accept,
      },
      { id: 'order-cancel', label: CANCEL, onClick: cancel },
    ],
    'reject-confirm': () => [
      { id: 'reject-confirm', label: REJECT_CONFIRM_LABEL, onClick: reject },
      { id: 'order-cancel', label: CANCEL, onClick: cancel },
    ],
  };

  return {
    reset,
    /** Offer an order after a quote with an estimate of `credits`. */
    offer(next) {
      reset();
      offer = next;
      step = 'offered';
    },
    chips() {
      if (!isEnabled()) return [];
      const mine = epoch;
      const shown = step;
      return (CHIPS[step]?.() ?? []).map((chip) => ({
        ...chip,
        onClick: () => epoch === mine && step === shown && chip.onClick(),
      }));
    },
    /** True while an order step shows or runs, so a new quote must wait. */
    busy: () => step !== 'none' && step !== 'offered',
    message: () => message,
  };
}
