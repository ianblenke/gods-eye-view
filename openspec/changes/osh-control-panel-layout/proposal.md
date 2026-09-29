## Why

The confirmation panel draws every command's fields as plain, unstyled text next to their inputs. Nothing marks where one command's fields end and the next begins. An owner reported that the field labels read as unclear, and could not tell one command's field from another's.

## What Changes

- Wraps each command's fields and its send button in one visible group, with the command's own name as the group's heading.
- Puts one field on its own line within a group, instead of a run of labels with no line break.
- Adds CSS for the group and its line spacing. The command's own send button keeps its exact current text and click behaviour.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `osh-control`: the confirmation panel's field layout groups each command's controls and puts one field on its own line.

## Impact

- Changes `src/layers/oshControl/view.js` and `src/ui/styles/osh-panel.css`.
- Opens no gap in `openspec/trace`. The changed file keeps full line, branch and function coverage.
