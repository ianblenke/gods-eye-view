import { normalizeCheck, normalizeProducts } from './normalize.js';

const PRODUCTS = 'https://api.up42.com/v2/data-products?type=TASKING&size=100';
const URLS = {
  validation: 'https://api.up42.com/v2/orders/validation',
  estimate: 'https://api.up42.com/v2/orders/estimate',
  feasibility: 'https://api.up42.com/v2/tasking/orders/feasibility',
  opportunities: 'https://api.up42.com/v2/tasking/orders/opportunities',
};
const failed = (error) => ({ ok: false, error });
function bodyOf({ dataProduct, box: [w, s, e, n], params }) {
  return {
    dataProduct,
    displayName: 'gev-quote',
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

/** Fixed quote destinations and a shared public product cache. */
export function createQuotes(client, now) {
  let cached = null;
  let inFlight = null;
  async function load() {
    const answer = await client.getPublic(PRODUCTS);
    if (!answer.ok) return failed(answer.kind);
    const products = normalizeProducts(answer.value);
    if (
      products === null ||
      !client.isSafe(answer.value) ||
      !client.isSafe(products)
    )
      return failed('bad_upstream');
    cached = { products, at: now() };
    return { ok: true, products };
  }
  async function fresh() {
    const result = await load();
    inFlight = null;
    return result;
  }
  function products() {
    if (cached !== null && now() - cached.at < 21600000) {
      return Promise.resolve(
        client.isSafe(cached.products)
          ? { ok: true, products: cached.products }
          : failed('bad_upstream'),
      );
    }
    if (inFlight === null) inFlight = fresh();
    return inFlight;
  }
  async function run(input) {
    const list = await products();
    if (!list.ok) return list;
    if (!list.products.some((p) => p.id === input.dataProduct))
      return failed('unknown_product');
    const results = {};
    const body = bodyOf(input);
    for (const name of input.checks) {
      const answer = await client.post(URLS[name], body);
      if (!answer.ok) results[name] = failed(answer.kind);
      else {
        const result = normalizeCheck(name, answer.value);
        results[name] =
          !client.isSafe(answer.value) || !client.isSafe(result)
            ? failed('bad_upstream')
            : result;
      }
    }
    const values = Object.values(results);
    if (values.every((v) => !v.ok))
      return failed(
        values.every((v) => v.error === 'credentials_rejected')
          ? 'credentials_rejected'
          : 'upstream_failed',
      );
    return { ok: true, results };
  }
  return { products, run };
}
