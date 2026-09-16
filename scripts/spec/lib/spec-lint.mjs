import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Check the format of requirements and scenarios, and the tasks of each active change.
 *
 * @param {object} input
 * @param {object[]} input.requirements - Requirements from loadSpecs.
 * @param {object[]} [input.orphans] - Scenarios outside a requirement, from loadSpecs.
 * @param {Map<string, string[]>} input.changeIds - Scenario IDs of each active change.
 * @param {(change: string) => string|null} input.readTasks - Reads the tasks.md file of a change.
 * @returns {object[]} Errors.
 */
export function lintSpecs({ requirements, orphans = [], changeIds, readTasks }) {
  const errors = [];
  for (const orphan of orphans) {
    errors.push({ code: 'SPEC-LINT-NO-REQUIREMENT', file: orphan.file, line: orphan.line, message: `Scenario "${orphan.name}" is not under a requirement` });
  }
  for (const requirement of requirements) {
    if (requirement.removed) continue;
    const at = { file: requirement.file, line: requirement.line };
    if (!requirement.firstLine || !requirement.firstLine.includes('MUST')) {
      errors.push({ code: 'SPEC-LINT-NO-MUST', ...at, message: `The first line of requirement "${requirement.name}" does not contain MUST` });
    }
    if (requirement.origin === 'unknown') {
      errors.push({ code: 'SPEC-LINT-NO-ORIGIN', ...at, message: `Requirement "${requirement.name}" has no Origin line` });
    }
    if (requirement.scenarios.length === 0) {
      errors.push({ code: 'SPEC-LINT-NO-SCENARIO', ...at, message: `Requirement "${requirement.name}" has no scenario` });
    }
    for (const scenario of requirement.scenarios) {
      const where = { file: requirement.file, line: scenario.line };
      if (scenario.when === 0) {
        errors.push({ code: 'SPEC-LINT-NO-WHEN', ...where, message: `Scenario "${scenario.name}" has no WHEN line` });
      }
      if (scenario.when > 1) {
        errors.push({ code: 'SPEC-LINT-TWO-WHEN', ...where, message: `Scenario "${scenario.name}" has ${scenario.when} WHEN lines` });
      }
      if (scenario.then === 0) {
        errors.push({ code: 'SPEC-LINT-NO-THEN', ...where, message: `Scenario "${scenario.name}" has no THEN line` });
      }
    }
  }
  for (const [change, ids] of changeIds) {
    const tasks = readTasks(change) ?? '';
    for (const id of ids) {
      if (tasks.includes(id)) continue;
      errors.push({
        code: 'SPEC-LINT-NO-TASK',
        file: `openspec/changes/${change}/tasks.md`,
        message: `No task names the scenario ID ${id}`,
      });
    }
  }
  return errors;
}

/** Read `openspec/changes/<change>/tasks.md`, or null when it does not exist. */
export function tasksReader(root) {
  return (change) => {
    const file = path.join(root, 'openspec/changes', change, 'tasks.md');
    return existsSync(file) ? readFileSync(file, 'utf8') : null;
  };
}
