## Context

`view.js`'s `render()` builds one plain `div` for each command. It appends one `label` per field. Each label holds its own input, then the send button follows. No element marks the start or the end of one command's group. `osh-panel.css` gives each button, input and select a 4px margin, and nothing else.

## Goals / Non-Goals

**Goals:**

- Mark the start and the fields of each command as one visible group. Use the command's own name as a heading a screen reader also announces.
- Put each field on its own line inside its group.
- Keep the send button's exact text and its exact click behaviour. No carried test needs a new click target.

**Non-Goals:**

- This change does not add a new field type or a new command.
- This change does not change the confirmation step's own markup, the Cancel button, or the 30 second timer.
- This change does not change `target.commands`, `client.js`, or any server file.

## Decisions

### D1 A `fieldset` and `legend` for each command

`row` becomes a `fieldset` element. Its first child is a `legend` with the command's own name. A `fieldset` and a `legend` are the standard HTML group for related form controls. A screen reader reads the `legend` before each control inside it.

The send button keeps the command name as its own text. `byText(host, command)` still finds the button, not the legend. `byText` returns the first match, and the button is defined after the fields. The legend has that same text too. `view.js` gives the legend a class, `osh-command-legend`, and gives the button no class. A future test can then identify each one separately if the shared text becomes unclear.

### D2 One field on its own line

Each field's `label` still holds its own input, and gets a class, `osh-command-field`. `osh-panel.css` sets `display: block` for that class. Each field then starts a new line inside its `fieldset`, whatever its own text length. The `fieldset` itself uses `display: flex; flex-direction: column;`. The legend, each field line and the button then stack in the order they are built.

### D3 CSS marks the group, not the DOM alone

`osh-panel.css` gives `#osh-panel-control fieldset` a top and bottom margin, a padding, and a subtle border. The group becomes visible with no change to `view.js`'s own logic beyond the two new classes. `osh-panel.css` gives the legend a smaller font weight than the button. The button text still names the one action a click sends.

## Risks / Trade-offs

1. **A duplicate command name, once as the legend and once as the button.** Mitigation: this is the same trade the D1 decision accepts, to keep the button's click target unchanged. A shorter, generic button label (`Send`) was considered and rejected. Scenario `osh-control-016`'s own carried tests click the button by its command-name text.
2. **A narrow panel (240px at its smallest) still breaks a long field name plus its unit onto a further line.** Mitigation: `osh-command-field` is `display: block`, not a fixed width. A long label breaks onto its own extra line and does not push another field's line out of place.

## How the gates measure this change

Coverage: `src/layers/oshControl/view.js` already has full line, branch and function coverage. The new `legend` element and the two new classes are lines this change adds, so its own tests must reach them.

Trace: no scenario is retired. `osh-control-016` and `osh-control-017`'s own tests keep their tags and their assertions about the button and the confirmation step. A new scenario states the group and the one-field-per-line rule.
