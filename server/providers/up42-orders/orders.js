import path from 'node:path';
import { makeRateLimiter } from '../common/rate-limit.js';
import { isSameSite } from '../up42/same-site.js';
import { readBodyText } from '../up42/validate.js';
import { createLedger } from './ledger.js';
import { createOrders } from './upstream.js';
import {
  capOf,
  isUuid,
  validateAccept,
  validateOrder,
  validateReject,
} from './validate.js';

const STATUS = {
  bad_body: 400,
  orders_off: 404,
  no_cap: 503,
  no_credentials: 503,
  store_failed: 503,
  bad_workspace: 503,
  credentials_rejected: 403,
  insufficient_balance: 402,
  unknown_order: 404,
  unknown_quotation: 404,
  duplicate: 409,
  busy: 409,
  not_ours: 409,
  decided: 409,
  over_cap: 409,
  over_approved: 409,
  order_refused: 502,
  order_unclear: 502,
  accept_refused: 502,
  accept_unclear: 502,
  reject_refused: 502,
  reject_unclear: 502,
};
const WORKSPACE =
  /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

function send(res, status, payload, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(JSON.stringify(payload));
}
function fail(res, error, extra = {}) {
  return send(res, STATUS[error] ?? 502, {
    error,
    ...(error === 'credentials_rejected' ? { keyRejected: true } : {}),
    ...(error === 'accept_unclear' ? { maySpend: true } : {}),
    ...extra,
  });
}
function dailyLimit(v) {
  if (typeof v !== 'string' || !/^\d+$/.test(v)) return 2;
  const n = Number(v);
  return n >= 1 && n <= 20 ? n : 2;
}

/** Order, quotation, accept and reject routes. Each spending step has guards. */
export function up42OrderProxy({
  env = process.env,
  now = Date.now,
  client,
  fs,
} = {}) {
  const allow = makeRateLimiter({ windowMs: 60000, max: 6 });
  const ledger = createLedger({
    dir: path.resolve(env.UP42_DATA_DIR ?? '.gev-up42'),
    now,
    fs,
  });
  const busy = new Set();
  const workspaceText = (env.UP42_WORKSPACE_ID ?? '').trim();
  const badWorkspace = workspaceText !== '' && !WORKSPACE.test(workspaceText);
  const workspace = workspaceText === '' || badWorkspace ? null : workspaceText;
  const orders = createOrders(client, workspace);

  async function placeOrder(res, input, cap) {
    const key = JSON.stringify({
      dataProduct: input.dataProduct,
      box: input.box,
      params: input.params,
    });
    if (busy.has(key)) return fail(res, 'busy');
    busy.add(key);
    const done = await runOrder(res, input, cap, key);
    busy.delete(key);
    return done;
  }
  async function runOrder(res, input, cap, key) {
    const same = ledger.findKey(key);
    if (same !== null) return fail(res, 'duplicate', { orderId: same.id });
    const count = await ledger.reserve(
      'orders',
      dailyLimit(env.UP42_DAILY_ORDERS),
    );
    if (!count.ok)
      return count.full
        ? send(res, 429, {
            error: 'budget',
            used: count.used,
            limit: count.limit,
          })
        : fail(res, 'store_failed');
    const price = await orders.estimate(input);
    if (!price.ok) return fail(res, price.error);
    if (price.credits > cap) return fail(res, 'over_cap');
    if (price.credits > input.approvedCredits)
      return fail(res, 'over_approved');
    const placed = await orders.place(input);
    if (!placed.ok) return fail(res, placed.error);
    await ledger.add({ id: placed.orderId, key, credits: price.credits });
    return send(res, 200, {
      orderId: placed.orderId,
      credits: price.credits,
      spent: false,
    });
  }
  async function readQuotation(res, orderId) {
    const id = orderId.toLowerCase();
    if (!ledger.hasOrder(id)) return fail(res, 'unknown_order');
    const list = await orders.quotations();
    if (!list.ok) return fail(res, list.error);
    const q = list.items.find((item) => item.orderId === id);
    return send(res, 200, {
      quotation:
        q === undefined
          ? null
          : { id: q.id, credits: q.credits, decision: q.decision },
    });
  }
  async function decide(res, kind, input, cap) {
    if (busy.has(input.quotationId)) return fail(res, 'busy');
    busy.add(input.quotationId);
    const done = await runDecision(res, kind, input, cap);
    busy.delete(input.quotationId);
    return done;
  }
  async function runDecision(res, kind, input, cap) {
    const list = await orders.quotations();
    if (!list.ok) return fail(res, list.error);
    const q = list.items.find((item) => item.id === input.quotationId);
    if (q === undefined) return fail(res, 'unknown_quotation');
    if (!ledger.hasOrder(q.orderId)) return fail(res, 'not_ours');
    if (q.decision !== 'NOT_DECIDED') return fail(res, 'decided');
    const accept = kind === 'accept';
    if (accept) {
      if (q.credits > cap) return fail(res, 'over_cap');
      if (q.credits > input.approvedCredits) return fail(res, 'over_approved');
      const count = await ledger.reserve(
        'accepts',
        dailyLimit(env.UP42_DAILY_ORDERS),
      );
      if (!count.ok)
        return count.full
          ? send(res, 429, {
              error: 'budget',
              used: count.used,
              limit: count.limit,
            })
          : fail(res, 'store_failed');
    }
    const result = await orders.decide(kind, q.id);
    if (!result.ok) return fail(res, result.error);
    return send(
      res,
      200,
      accept ? { accepted: true, credits: q.credits } : { rejected: true },
    );
  }

  async function handle(req, res, next, route) {
    if (req.url.split('?')[0] !== '/') return next();
    if (req.method !== (route === 'quotation' ? 'GET' : 'POST'))
      return send(res, 405, { error: 'Method not allowed' });
    if (
      !isSameSite(req) ||
      (route !== 'quotation' &&
        req.headers['content-type'] !== 'application/json')
    )
      return send(res, 403, { error: 'cross_origin' });
    if (env.UP42_ORDERS !== 'true') return fail(res, 'orders_off');
    if (!allow('orders'))
      return send(res, 429, { error: 'rate_limited' }, { 'Retry-After': '60' });
    const cap = capOf(env.UP42_ORDER_MAX_CREDITS);
    // A reject spends nothing, so it needs no cap.
    if ((route === 'order' || route === 'accept') && cap === null)
      return fail(res, 'no_cap');
    let input;
    let orderId;
    if (route === 'quotation') {
      orderId = new URL(req.url, 'http://local').searchParams.get('orderId');
      if (!isUuid(orderId)) return fail(res, 'bad_body');
    } else {
      const text = await readBodyText(req);
      if (text === null) return fail(res, 'bad_body');
      input = {
        order: validateOrder,
        accept: validateAccept,
        reject: validateReject,
      }[route](text, cap);
      if (!input.ok) {
        const { ok, ...payload } = input;
        return send(res, 400, payload);
      }
    }
    if (
      (env.UP42_USERNAME ?? '').trim() === '' ||
      (env.UP42_PASSWORD ?? '').trim() === ''
    )
      return send(res, 503, { error: 'no_credentials', keyRequired: true });
    if (!(await ledger.ready())) return fail(res, 'store_failed');
    if (route === 'order') {
      if (badWorkspace) return fail(res, 'bad_workspace');
      return placeOrder(res, input, cap);
    }
    if (route === 'quotation') return readQuotation(res, orderId);
    return decide(res, route, input, cap);
  }
  const install = ({ middlewares }) => {
    for (const route of ['quotation', 'accept', 'reject']) {
      middlewares.use(`/api/up42/order/${route}`, (req, res, next) =>
        handle(req, res, next, route),
      );
    }
    middlewares.use('/api/up42/order', (req, res, next) =>
      handle(req, res, next, 'order'),
    );
  };
  return {
    name: 'up42-orders',
    configureServer: install,
    configurePreviewServer: install,
  };
}
