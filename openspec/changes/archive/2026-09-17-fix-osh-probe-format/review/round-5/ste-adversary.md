Verdict: PASS

Findings: four minor. Every round-4 finding of mine is corrected, and every count and list I could check is right.

**What I verified myself, not on the author's word**
- Test counts: `osh-037` 3 (2 in `oshGet.test.mjs`, 1 in `oshProxy.test.mjs`), `osh-038` 1, `osh-039` 1, `osh-040` 6 (1 + 5), eleven in total. `design.md:88` (D28) matches.
- `server/providers/osh/` holds four files (`base.js`, `get.js`, `ids.js`, `observations.js`), as D24 and `osh-039` both say.
- `design.md:7` and `proposal.md:34` name the same eleven files, byte for byte.
- The 20-page cap in `osh-page-link-repeat` matches `get.js:201` (`page < 20`).
- D27's round-3 paragraph has three markers for three bugs, and each bug matches the code: the drop path in `mapOshSystems()` is real (`src/data/oshSystems.js:38`, `Point` only, no log line); `buildNextPageUrl()` at `get.js:169-181` drops every `f`, then appends once from `current` alone.
- The delta spec and `openspec/specs/osh/spec.md` carry identical `osh-037`..`osh-040` text (one trailing blank line apart).
- No host name, system id, datastream id, count or place name anywhere in the change, the spec, the provider or the tests. Every URL is `osh.example`, `attacker.example` or a `user:pass` literal; every id is a `*-fixture-*` string.
- I did not run the STE lint, so I cannot confirm the "6 STE warnings" count in `proposal.md:41`.

**Findings**

- [ ] S9 minor `openspec/changes/archive/2026-09-17-fix-osh-probe-format/design.md:74` "that loss latched" Approved words. This is the residue of my round-4 S3: "latch off" is gone, but the bare verb stays, and STE has no verb "latch". Write: "Second, the loss then continued:".
- [ ] S10 minor `server/providers/osh/get.js:14` "`path` is a fixed literal at each call site" One word, one meaning. The same 6-sentence docstring says it again at line 20, as "a fixed literal at every call site today", with "each" and "every" for one meaning. Delete the sentence at line 14; line 20 carries the fact and the reason.
- [ ] S11 minor `server/providers/osh/get.js:144` Paragraphs. The `buildNextPageUrl()` docstring is now 14 sentences with no break; this change appended 8 to a block of 6. `server/providers/osh.js` uses a blank ` *` line for this, four times. Add one before "An `f` key never carries" (line 153) and one before "A server can write" (line 159).
- [ ] S12 minor `openspec/changes/archive/2026-09-17-fix-osh-probe-format/design.md:72` "When `current` carries an `f` key, the rebuild forces `OSH_LIST_FORMAT`" Two meanings. Read on its own, this says round 2 already forced the format whenever `current` asked for one, which the first bug of the next paragraph contradicts. The paired clause ("whatever value the link writes") shows the intent was a link that carries the key. Write: "When the link carries an `f` key and `current` carries one, the rebuild forces `OSH_LIST_FORMAT`".

All four are wording, not meaning a reader cannot recover. Nothing here disagrees with the code, and I have no major. The prose is sound.
