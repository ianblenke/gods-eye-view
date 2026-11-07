## Context

The source tree is commit `0da2dc27655330708ef443829b0f00dc369d4a42`.
Scout sections 4, 4.1, 4.2, 8 and 11 supply the assumed response shapes.
No live call checks those shapes.

## Decisions

The new folder holds complete URL constants and the only quote allow-list.
The generic client checks the HTTPS API origin before login and uses the source token cache.
Only quote POST calls accept status 207. The source response rules stay unchanged.

The shared capped JSON reader races the signal. The signal also bounds error cancellation.
No new return uses a finally block.

The route checks path, method, site, switch, rate, body, validation, credentials, store and daily count in that order.
The GET route skips body, credential and quote count checks because its product list is public.
Both routes share six requests per minute.
The disabled answer is 404 with an error field, as in the thumbnail route.

The input module reuses the source body reader and area function.
It accepts only the named params and scalar types. An empty checks array fails because it requests no facts.
It sorts params and checks for the store key and converts UUID letters to lower case.

The product module expects a Spring content array with id, title and optional collection strings.
An absent title uses the id. An invalid row fails the list and grants no membership.
The public list has a six-hour cache and one in-flight promise.

The quote module sends one geometry and reads one geometry result for each check.
It runs checks in sequence. Validation reads the object keyed by feature name.
Estimate reads summary.totalCredits and summary.totalSize. Feasibility reads results and feasibilityOutcome.

Opportunities reads results, opportunities.features and the named STAC properties.
The normalizer builds fresh output objects and caps strings at 160 characters.
Geometry errors never pass as an empty success merely because the status is 207.

The route claims each new promise before its first wait.
It counts the round before public discovery, because that request also reaches UP42.
A valid or partial answer enters a sixteen-entry store for less than ten minutes.
Every store lookup checks secret safety again, also after credential changes.
Failures never enter the store. The daily count resets at UTC midnight.

The combined list wraps up42SourcePlugins with a supplied shared client and adds up42-quotes.
The old list functions keep their plugin names, order and count.
The thumbnail list accepts that client through one minimal hook.

## Files and measures

The proposal lists the changed paths.
Tests use assert methods, a fake fetch that records requests, fake timers and literal expected facts.
The request guard covers every non-empty check subset and each failure class.
The source scan checks every forbidden path occurrence and every URL literal in the new folder.
Mutations change destinations, methods, input checks, store identity, secrets and transport bounds.

Each mutation must fail a named test. Evidence contains prose records only.

Host Node measures line, branch and function coverage for each new or edited code file.
The STE lint checks the change documents. A word-list check reads expanded test titles.
The lead runs archive, ratchet, calibrated gates and both review agents before merge.

## Purpose at archive time

Describe how the server gives UP42 quote facts without an order while it keeps credentials private.
