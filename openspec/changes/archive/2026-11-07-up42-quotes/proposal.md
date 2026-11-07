## Why

The owner needs quote facts for a small area and a tasking data product.
The server must never place an order or spend credits.

## What Changes

- Add POST `/api/up42/quote` and GET `/api/up42/quote/products`.
- Keep both routes off until `UP42_QUOTES=true`.
- Check input before login and use a public TASKING product list.
- Send only validation, estimate, feasibility and opportunities requests.
- Keep separate results and bounded RAM stores.
- Share the source token client through a new combined plugin list.

## Capabilities

### New Capabilities

- `up42-quotes`: Give quote facts without an order.

### Modified Capabilities

None. Source and thumbnail specs and tests stay unchanged.

## Impact

The base is commit `0da2dc27655330708ef443829b0f00dc369d4a42`.
New code lives under `server/providers/up42-quotes/`.
New tests live in `src/data/up42Quotes.test.mjs`.
The change adds those files to `openspec/ownership.json`.
Minimal hooks change `server/providers/up42/auth.js` and `server/providers/up42-thumbnails/plugins.js`.

The change connects the new list in `server/providers/local.js`.
It edits `.env.example` and `DATA_SOURCES.md` and adds `changelog.d/1432-up42-quotes.md`.
The change closes no old gap. The ratchet command updates the trace records.

Each new or edited code file needs full host coverage.

## Known limits

- Known limit `no-live-check`: Fixtures follow the scout documentation. Real response fields and the product list shape can differ.
- Known limit `unknown-cost`: The documentation gives no cost for feasibility or opportunities. Default checks include both. The daily count bounds requests.
- Known limit `viewer-role-unknown`: Viewer access to these calls is unknown.
- Known limit `credits-not-currency`: Prices use credits only. The documentation gives no stable currency conversion.
- Known limit `no-binding-quote`: A binding quote needs an order. This route never places one.
- Known limit `count-in-ram`: A restart clears the count and stores.
- Known limit `lan-access`: A LAN client can reach the server. Same-site and rate gates still apply.
- Known limit `display-terms`: Not applicable. This route shows no image.
- Known limit `plan-gating-unknown`: The account plan can refuse API access.
