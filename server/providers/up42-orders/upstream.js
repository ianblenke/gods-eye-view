import { isUuid } from './validate.js';

const ESTIMATE = 'https://api.up42.com/v2/orders/estimate';
const ORDER = 'https://api.up42.com/v2/orders';
const QUOTATIONS = 'https://api.up42.com/v2/tasking/quotation?page=0&size=100';
const QUOTATION = 'https://api.up42.com/v2/tasking/quotation/';
const DECISIONS = {
  accept: { decision: 'ACCEPTED' },
  reject: { decision: 'REJECTED' },
};
const MERGE = 'application/merge-patch+json';
const failed = (error, extra = {}) => ({ ok: false, error, ...extra });

function bodyOf({ dataProduct, box: [w, s, e, n], params }) {
  return {
    dataProduct,
    displayName: 'gev-order',
    featureCollection: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [w, s],
                [e, s],
                [e, n],
                [w, n],
                [w, s],
              ],
            ],
          },
          properties: {},
        },
      ],
    },
    params,
  };
}

/** A refused call has a status below 500. A fault, a time-out or a 5xx answer is unclear. */
const refused = (answer) =>
  answer.status !== undefined && answer.status >= 400 && answer.status < 500;

/** Map a failed client answer to a fixed error name. */
function mapFailure(answer, refusedName, unclearName) {
  if (answer.kind === 'credentials_rejected')
    return failed('credentials_rejected');
  if (refused(answer))
    return failed(answer.status === 402 ? 'insufficient_balance' : refusedName);
  return failed(unclearName);
}

/** Fixed order destinations over one shared client. */
export function createOrders(client, workspace) {
  const orderUrl =
    workspace === null ? ORDER : `${ORDER}?workspaceId=${workspace}`;
  return {
    /** The credits that the estimate states for the order body. */
    async estimate(input) {
      const answer = await client.call('POST', ESTIMATE, {
        body: bodyOf(input),
        statuses: [200],
      });
      if (!answer.ok)
        return answer.kind === 'credentials_rejected'
          ? failed('credentials_rejected')
          : failed('upstream_failed');
      const credits = answer.value?.summary?.totalCredits;
      return Number.isFinite(credits) &&
        credits >= 0 &&
        client.isSafe(answer.value)
        ? { ok: true, credits }
        : failed('bad_upstream');
    },
    /** One order call. It never repeats. */
    async place(input) {
      const answer = await client.call('POST', orderUrl, {
        body: bodyOf(input),
        statuses: [200, 201, 202],
      });
      if (!answer.ok)
        return mapFailure(answer, 'order_refused', 'order_unclear');
      const id = answer.value?.results?.[0]?.id;
      return isUuid(id) && client.isSafe(answer.value)
        ? { ok: true, orderId: id.toLowerCase() }
        : failed('order_unclear');
    },
    /** The quotation list as `{id, orderId, credits, decision}` items. */
    async quotations() {
      const answer = await client.call('GET', QUOTATIONS, { statuses: [200] });
      if (!answer.ok)
        return answer.kind === 'credentials_rejected'
          ? failed('credentials_rejected')
          : failed('upstream_failed');
      const content = answer.value?.content;
      if (!Array.isArray(content) || !client.isSafe(answer.value))
        return failed('bad_upstream');
      const items = [];
      for (const q of content) {
        if (
          isUuid(q?.id) &&
          isUuid(q.orderId) &&
          Number.isFinite(q.creditsPrice) &&
          q.creditsPrice >= 0 &&
          typeof q.decision === 'string'
        )
          items.push({
            id: q.id.toLowerCase(),
            orderId: q.orderId.toLowerCase(),
            credits: q.creditsPrice,
            decision: q.decision,
          });
      }
      return { ok: true, items };
    },
    /** One decision call on a quotation id that the caller validated. */
    async decide(kind, quotationId) {
      const accept = kind === 'accept';
      const answer = await client.call('PATCH', `${QUOTATION}${quotationId}`, {
        body: DECISIONS[kind],
        type: MERGE,
        statuses: [200, 204],
        discard: true,
      });
      return answer.ok
        ? { ok: true }
        : mapFailure(
            answer,
            accept ? 'accept_refused' : 'reject_refused',
            accept ? 'accept_unclear' : 'reject_unclear',
          );
    },
  };
}
