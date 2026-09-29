## Why

The command view draws every command's fields as plain, unstyled text next to their inputs. No element marks where one command's fields end and the next begins. An owner reported that the field labels are not clear. The owner could not see the difference between one command's field and another's.

## What Changes

- Wraps each command's fields and its send button in one visible group, with the command's own name as the group's heading.
- Puts one field on its own line within a group, instead of a list of labels with no line break.
- Adds CSS for the group and its line spacing. The command's own send button keeps its exact current text and click behaviour.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `osh-control`: the command view's field layout groups each command's controls and puts one field on its own line.

## Impact

- Changes `src/layers/oshControl/view.js` and `src/ui/styles/osh-panel.css`.
- Opens no gap in `openspec/trace`. The changed file keeps full line, branch and function coverage.

## Known limits and later changes

- Scenario `osh-control-038` says a field's label and input are the only content of their own line. This test checks that claim with a CSS class (`osh-command-field`), not a real layout measurement. The test harness's fake DOM has no layout engine, so it cannot prove a real visual line break. Accepted by Ian Blenke.
