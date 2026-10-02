# OSH tasking: roadmap spec

Status: draft roadmap. This file is not a gated change. It lives in `docs/` on
purpose. Each step below becomes one change that `/opsx:propose` writes, with
`MUST` requirements and `WHEN`/`THEN` scenarios, as `openspec/config.yaml` needs.
The scenario IDs here are proposed IDs for the capability `osh-tasking`.

## Purpose

The user orders an image from a tasking provider through the map. The provider
is an OSH driver that the OSH server shows. The app has no provider names. The
app learns what it needs at run time from the OSH server.

## Confidentiality rules

- A tracked file must not name a real provider, host, schema or field.
- Test fixtures use the placeholders `provider-a` and `provider-b`, and hosts
  that end in `.invalid`.
- A list of real names is never tracked. The owner can keep one in an ignored
  local hook.
- Proposals, specs, tests, commit messages and review files say "provider A"
  and "provider B".
- This file does not give the definition URIs, stream names or status codes of
  any real driver. The app reads them from configuration. They have no default
  in tracked code. See decision D1.

## What the app reads from the OSH server

| Item | How the app finds it |
|---|---|
| Registry of providers | One system datastream. A configured definition URI names it. |
| Control streams | The control streams of a system. A configured definition URI on the root record names each kind. A configured input name is the fallback. |
| Results | The datastreams of the same system. A configured definition URI names each kind. |
| Field meaning | The `definition`, `uom`, `constraint` and `label` of each schema field. |
| Command outcome | The first word of the command status message. A configured list gives the known words. |

The server does not say if a provider is in sandbox mode or live mode. See
open question 1.

## Requirements and proposed scenarios

### Discovery of tasking systems

The app must show a tasking mark on an OSH system only when the system has a
control stream that matches the configured contract.

- `osh-tasking-001` A control stream is recognized by its definition URI.
- `osh-tasking-002` A control stream is recognized by its input name.
- `osh-tasking-003` Nothing shows when no system can task.
- `osh-tasking-004` The registry gives the capabilities of a provider. An empty
  registry gives an empty list.

### Form from the schema

The app must build the form from the SWE Common schema of the control stream.
The form must use the renderer of the existing OSH control panel.

- `osh-tasking-010` A category field is a select.
- `osh-tasking-011` Two time fields are a time pair.
- `osh-tasking-012` A record is a nested fieldset.
- `osh-tasking-013` A unit and a limit show on a number field.
- `osh-tasking-014` An optional field is collapsed.
- `osh-tasking-015` A geometry field shows three source buttons.
- `osh-tasking-016` A table command renders as before.

### Area from the map

- `osh-tasking-020` A map click gives a point.
- `osh-tasking-021` The current view gives a box.
- `osh-tasking-022` A drawn shape gives a polygon.

### Feasibility

- `osh-tasking-030` Passes show as markers on the area.
- `osh-tasking-031` A validation-only outcome shows a badge.
- `osh-tasking-032` A failed provider call shows a named reason.
- `osh-tasking-033` A result matches its command.

### Quote before commitment

The app must show the cost of a task before the user can submit it.

- `osh-tasking-040` A minor-unit amount is divided by the unit scale. A quote of
  125000 with a scale of 100 shows 1250.00.
- `osh-tasking-041` A quote shows its basis, currency and validity.
- `osh-tasking-042` A quote that is out of date disables the submit button.
- `osh-tasking-043` The server refuses an unquoted submit to a system that can
  quote. The reason is `quote_required`.
- `osh-tasking-044` An operator flag can allow an unquoted submit.
- `osh-tasking-045` A quote that is not available shows a named reason.

### Safe submit

The app must ask the user to confirm the cost and the provider before it sends
a tasking command. The server must stop a repeated command.

- `osh-tasking-050` The confirm step names the provider and the cost.
- `osh-tasking-051` The confirm step starts with focus on Cancel.
- `osh-tasking-052` The same client reference gives the stored result.
- `osh-tasking-053` A second command to a busy system is refused.
- `osh-tasking-054` The browser never holds a credential.
- `osh-tasking-055` A log line has no provider-specific field value.
- `osh-tasking-056` Control off gives one quiet line.

### Tracking and results

- `osh-tasking-060` A command status shows in the detail panel.
- `osh-tasking-061` A task status list shows each state with its age.
- `osh-tasking-062` A result link shows as text and the app does not fetch it.
- `osh-tasking-063` A missing command location falls back to polling.
- `osh-tasking-064` A result stream with many records is read from a start time.

### Compare providers

- `osh-tasking-070` Each provider has one column.
- `osh-tasking-071` A difference in basis or currency stays visible.
- `osh-tasking-072` The app never adds or ranks the quotes.
- `osh-tasking-073` One provider can fail and the others still show.

### Repository hygiene

- `osh-tasking-080` A test scans the tracked files. No tracked file holds the
  URN, host or schema capture of a real provider.

## Wireframe

```
[Source tray] OSH > system "Imaging provider A"   (mark: Tasking)
+------------------------------------------------------------------+
| Provider A    caps: Tasking Feasibility Quote    auth: ok         |
| [VALIDATION ONLY]   LIVE: unknown                                 |
| 1 Area    ( ) point  ( ) view box  ( ) drawn shape                |
| 2 Window  start [..]  end [..]                                    |
| 3 Product mode [v]  > options of the provider (collapsed)         |
| [Check feasibility]  3 passes ...                                 |
| [Get quote]          1250.00 USD  valid 15 min                    |
| [Submit task]  disabled until a valid quote exists                |
|   Confirm: "Submit to Provider A for 1250.00 USD?" [Cancel][Submit]|
| Status: SUBMITTED > ACCEPTED ...        Result: 2 links           |
+------------------------------------------------------------------+
Compare view (two or more tasking systems): one column per provider.
```

## Design notes

Server. Extend `server/providers/osh-control.js`. Do not add a second proxy.

- A new pure module `server/providers/osh-control/form.js` turns a schema into a
  form model. The existing command table uses the same model.
- `post.js` stays the only place that sends a POST. It returns the command id.
- A new GET route reads a command status. A new route reads the registry.
- The server keeps a ten-minute map of client reference to result.
- New files stay outside `src/data/osh*.js` and `server/providers/osh/*.js`.
  Scenario `osh-005` counts the files there.

Client. `src/layers/oshControl/view.js` renders the form model. A new folder
`src/layers/oshTasking/` holds the flow state, the compare view and the
geometry capture. `src/layers/osh/detail.js` gets blocks for status, quote and
feasibility data.

## Change order (smallest first)

1. `osh-tasking-discovery`
2. `osh-tasking-form`
3. `osh-tasking-geometry`
4. `osh-tasking-feasibility`
5. `osh-tasking-quote`
6. `osh-tasking-submit`
7. `osh-tasking-track`
8. `osh-tasking-compare`
9. `osh-tasking-hygiene`

Check each change name first. A name can put a banned word in many places. Each
change updates `scripts/package-boundaries.json`, the trace files and the panel
style sheet. Each new code file keeps 100% coverage.

## Test mutations (AGENTS.md rule 13)

| Scenario | Change to the code that must fail a test |
|---|---|
| 001 | Change the configured definition suffix |
| 002 | Remove the input-name fallback |
| 004 | Invert the empty-slot test |
| 013 | Emit `min` as `max` |
| 040 | Ignore the unit scale |
| 043 | Remove the `quote_required` check |
| 052 | Remove the stored-result lookup |
| 055 | Log the raw provider field value |

Add one mutation for each part of a compound condition. Compare values with
the literal that the spec names, not with the constant that made them.

## Decisions

- D1. The contract names are configuration, not code. The app reads the
  definition URIs, input names and status words from `.env`. They have no
  default in tracked code. The owner keeps the real values outside the repo.
  Reason: a tracked default would show the shape of the closed drivers.

## Open questions for the owner

1. The OSH server does not say sandbox or live. Should the app show
   "LIVE: unknown" and read an operator list of system ids?
2. The command location and status shape are assumed. Check them on the real
   node before change 7.
3. The observation route returns only the newest record. A `since` parameter
   touches a pinned file set.
4. Result links point at provider hosts. Show them only, or proxy them?
5. Many drivers are validation-only now. Is a mostly dry-run UI acceptable?
6. The form cannot know which fields are required. Only the SWE `optional` flag
   helps. Check that the drivers set it.
7. Is D1 the right answer? The cost is that the feature does nothing until the
   owner sets the configuration.

## Not verified

No live OSH behavior. The `201` and `Location` answer of OSH. The JSON shape of
a category constraint. No STE lint ran on this file. The lint code reads only
`openspec/` and the process files, so `make lint` does not check `docs/`.
