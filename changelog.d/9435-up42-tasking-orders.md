### Added

- Add UP42 tasking orders from the UP42 Scenes row. A person quotes, places an order, reads the binding quotation and accepts or rejects it, each step with its own confirm.
- Add guards on the server: an off switch, a credit cap, a daily count, a ledger file in a volume and no repeat after an unclear answer.
- Accepting a quotation spends credits and UP42 cannot reverse it. The routes stay off until `UP42_ORDERS=true`.
