import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const SCENARIO_HEADING = /^####\s+Scenario:\s*(.*?)\s*$/i;
const DELTA_SECTION = /^(ADDED|MODIFIED|REMOVED|RENAMED) Requirements$/i;
const KNOWN_SECTION = /^(Purpose|Requirements)$/i;
const TITLE_HEADING = /^#\s/;
const TRAILING_ID = /^(.*?)\s*`([a-z0-9]+(?:-[a-z0-9]+)*-\d{3})`$/;
const REQUIREMENT_HEADING = /^###\s+Requirement:\s*(.*?)\s*$/i;
const SECTION_HEADING = /^##\s+(.*?)\s*$/;
const ANY_HEADING = /^#{1,6}\s/;
const ORIGIN_LINE = /^Origin:\s*(spec-first|backfill)\s*$/;
const FENCE_OPEN = /^\s*(`{3,}|~{3,})/;
const FENCE_CLOSE = /^\s*(`{3,}|~{3,})\s*$/;
const WHEN_LINE = /^\s*-\s+\*\*WHEN\*\*/;
const THEN_LINE = /^\s*-\s+\*\*THEN\*\*/;

function headingError(file, line, text) {
  return { code: 'SPEC-HEADING', file, line, message: `The heading "${text.trim()}" is not a title, a section, a requirement or a scenario heading` };
}

/** Capability prefix of a scenario ID: `flights-004` → `flights`. */
export function capabilityOfId(id) {
  return id.replace(/-\d{3}$/, '');
}

/**
 * SHA-256 hash of the scenario name and its non-empty body lines. The hash of a scenario
 * under a requirement also has the requirement name and the requirement text. The hash
 * keeps the spaces at the start of each line and ignores the spaces at the end. It hashes
 * the parts as separate JSON fields, so a line that moves from one part to another changes it.
 *
 * @param {string} name - The scenario name.
 * @param {string[]} bodyLines - The body lines of the scenario.
 * @param {{name: string, text: string[]}|null} [requirement] - The requirement of the scenario.
 */
export function scenarioHash(name, bodyLines, requirement = null) {
  const body = bodyLines.map((line) => line.trimEnd()).filter(Boolean);
  const text = JSON.stringify(requirement ? { requirement: { name: requirement.name, text: requirement.text }, name, body } : { name, body });
  return createHash('sha256').update(text).digest('hex');
}

/**
 * Read the requirements and scenarios of one spec file.
 *
 * @param {string} text - Markdown source.
 * @param {{file: string, capability: string, source: string}} where
 * @returns {{scenarios: object[], removed: object[], requirements: object[], errors: object[]}}
 */
export function parseSpecFile(text, { file, capability, source }) {
  const scenarios = [];
  const removed = [];
  const requirements = [];
  const orphans = [];
  const errors = [];
  let fence = null;
  let section = '';
  let requirement = null;
  let scenario = null;
  const requirementText = new Map();

  const closeScenario = () => {
    if (!scenario) return;
    if (scenario.id && !scenario.removed) {
      scenarios.push({
        id: scenario.id,
        capability,
        requirement: scenario.requirement ? scenario.requirement.name : null,
        name: scenario.name,
        origin: scenario.requirement ? scenario.requirement.origin : 'unknown',
        file,
        line: scenario.line,
        source,
        hash: scenarioHash(scenario.name, scenario.body, scenario.requirement && { name: scenario.requirement.name, text: requirementText.get(scenario.requirement) }),
      });
    }
    scenario = null;
  };

  const keepFenceLine = (line) => {
    if (scenario) scenario.body.push(line);
    else if (requirement && line.trim() !== '') requirementText.get(requirement).push(line);
  };

  text.replace(/\r\n?/g, '\n').split('\n').forEach((raw, index) => {
    const line = raw.trimEnd();
    const lineNumber = index + 1;
    if (fence) {
      const close = line.match(FENCE_CLOSE);
      if (close && close[1][0] === fence.marker && close[1].length >= fence.length) fence = null;
      keepFenceLine(line);
      return;
    }
    const open = line.match(FENCE_OPEN);
    if (open) {
      fence = { marker: open[1][0], length: open[1].length };
      keepFenceLine(line);
      return;
    }

    const sectionHeading = line.match(SECTION_HEADING);
    if (sectionHeading) {
      closeScenario();
      requirement = null;
      section = sectionHeading[1];
      if (source === 'main' && DELTA_SECTION.test(section)) {
        errors.push({ code: 'SPEC-DELTA-HEADER', file, line: lineNumber, message: `The main spec has the change section "${section}". Use "Requirements".` });
      } else if (!KNOWN_SECTION.test(section) && !DELTA_SECTION.test(section)) {
        errors.push(headingError(file, lineNumber, line));
      }
      return;
    }
    const requirementHeading = line.match(REQUIREMENT_HEADING);
    if (requirementHeading) {
      closeScenario();
      if (source === 'main' && section !== '' && !/^Requirements$/i.test(section)) {
        errors.push({ code: 'SPEC-REQUIREMENT-OUTSIDE', file, line: lineNumber, message: `Requirement "${requirementHeading[1]}" is not in the section "Requirements"` });
      }
      requirement = {
        name: requirementHeading[1],
        file,
        line: lineNumber,
        firstLine: null,
        origin: 'unknown',
        scenarios: [],
        removed: /^REMOVED Requirements$/i.test(section),
        renamed: /^RENAMED Requirements$/i.test(section),
      };
      requirementText.set(requirement, []);
      if (!requirement.renamed) requirements.push(requirement);
      return;
    }
    const heading = line.match(SCENARIO_HEADING);
    if (heading) {
      closeScenario();
      if (requirement && requirement.renamed) {
        errors.push({ code: 'SPEC-RENAMED-SCENARIO', file, line: lineNumber, message: `Scenario "${heading[1]}" is under a renamed requirement. Put it under an added or modified requirement.` });
        scenario = { id: null, name: heading[1], line: lineNumber, requirement, body: [], removed: true, when: 0, then: 0 };
        return;
      }
      const idMatch = heading[1].match(TRAILING_ID);
      const name = idMatch ? idMatch[1] : heading[1];
      const id = idMatch ? idMatch[2] : null;
      const isRemoved = Boolean(requirement && requirement.removed);
      scenario = { id, name, line: lineNumber, requirement, body: [], removed: isRemoved, when: 0, then: 0 };
      if (requirement && !isRemoved) requirement.scenarios.push(scenario);
      if (!requirement) orphans.push({ id, name, file, line: lineNumber });
      if (!id) {
        if (!isRemoved) {
          errors.push({ code: 'SPEC-NO-ID', file, line: lineNumber, message: `Scenario "${heading[1]}" has no ID in backticks` });
        }
        return;
      }
      if (capabilityOfId(id) !== capability) {
        errors.push({
          code: 'SPEC-WRONG-CAPABILITY',
          file,
          line: lineNumber,
          message: `Scenario ID ${id} does not start with the capability "${capability}"`,
        });
        scenario.id = null;
        return;
      }
      if (isRemoved) removed.push({ id, file, line: lineNumber, source });
      return;
    }
    if (ANY_HEADING.test(line)) {
      closeScenario();
      if (!TITLE_HEADING.test(line)) errors.push(headingError(file, lineNumber, line));
      return;
    }

    if (scenario) {
      scenario.body.push(line);
      if (WHEN_LINE.test(line)) scenario.when += 1;
      if (THEN_LINE.test(line)) scenario.then += 1;
      return;
    }
    if (!requirement) return;
    if (line.trim() !== '') requirementText.get(requirement).push(line);
    const origin = line.match(ORIGIN_LINE);
    if (origin) {
      requirement.origin = origin[1];
      return;
    }
    if (requirement.firstLine === null && line.trim() !== '') requirement.firstLine = line.trim();
  });
  closeScenario();

  for (const item of requirements) {
    item.hash = scenarioHash('', [], { name: item.name, text: requirementText.get(item) });
    item.scenarios = item.scenarios.map((entry) => ({
      id: entry.id,
      name: entry.name,
      line: entry.line,
      when: entry.when,
      then: entry.then,
    }));
  }
  return { scenarios, removed, requirements, orphans, errors };
}

function listDirectories(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function readSpecTree(root, specsDirectory, source) {
  const results = [];
  for (const capability of listDirectories(path.join(root, specsDirectory))) {
    const relative = path.posix.join(specsDirectory, capability, 'spec.md');
    const absolute = path.join(root, relative);
    if (!existsSync(absolute)) continue;
    results.push(parseSpecFile(readFileSync(absolute, 'utf8'), { file: relative, capability, source }));
  }
  return results;
}

/** Read `openspec/trace/retired-ids.json` as a set. */
export function readRetiredIds(root) {
  const file = path.join(root, 'openspec', 'trace', 'retired-ids.json');
  if (!existsSync(file)) return new Set();
  return new Set(JSON.parse(readFileSync(file, 'utf8')));
}

/** Names of the active changes: folders in `openspec/changes` other than `archive`. */
export function listActiveChanges(root) {
  return listDirectories(path.join(root, 'openspec/changes')).filter((name) => name !== 'archive');
}

/**
 * Check that the main specs contain the delta specs of an archived change. Each added or
 * modified requirement must be in the main spec of its capability with the same name, text
 * and scenario IDs. Each added or modified scenario must be in `openspec/specs` with the same
 * hash. The main specs must not contain a removed requirement or a removed scenario, and
 * `openspec/trace/retired-ids.json` must contain each removed scenario ID.
 *
 * @param {string} root - Project root.
 * @param {string} folder - The archived change folder, relative to the root.
 * @param {{scenarios: Map<string, object>, mainIds: Set<string>, retired: Set<string>, requirements: object[]}} specs - The result of loadSpecs.
 * @returns {{errors: object[], requirements: object[], orphans: object[], ids: string[]}} The errors, and the
 *   requirements, the scenarios outside a requirement and the scenario IDs of the delta specs.
 */
export function checkArchivedChange(root, folder, specs) {
  const archived = { errors: [], requirements: [], orphans: [], ids: [] };
  if (!existsSync(path.join(root, folder, 'proposal.md'))) {
    archived.errors.push({ code: 'SPEC-ARCHIVE-NO-PROPOSAL', file: folder, message: `The archived change ${folder} has no proposal.md` });
    return archived;
  }
  const { errors } = archived;
  const notApplied = (item, message) => errors.push({ code: 'SPEC-DELTA-NOT-APPLIED', file: item.file, line: item.line, message });
  const scenarioIds = (requirement) => requirement.scenarios.map((scenario) => scenario.id).join(',');
  for (const result of readSpecTree(root, `${folder}/specs`, `archive:${path.posix.basename(folder)}`)) {
    errors.push(...result.errors);
    archived.requirements.push(...result.requirements);
    archived.orphans.push(...result.orphans);
    archived.ids.push(...result.scenarios.map((scenario) => scenario.id));
    for (const requirement of result.requirements) {
      const mainFile = `openspec/specs/${requirement.file.split('/').at(-2)}/spec.md`;
      const main = specs.requirements.find((item) => item.file === mainFile && !item.removed && item.name === requirement.name);
      if (requirement.removed) continue;
      if (!main) {
        notApplied(requirement, `Requirement "${requirement.name}" of the archived change is not in ${mainFile}`);
      } else if (main.hash !== requirement.hash || scenarioIds(main) !== scenarioIds(requirement)) {
        notApplied(requirement, `Requirement "${requirement.name}" in ${mainFile} is not equal to the requirement in the archived change`);
      }
    }
    for (const scenario of result.scenarios) {
      const main = specs.mainIds.has(scenario.id) ? specs.scenarios.get(scenario.id) : null;
      if (main && main.hash === scenario.hash) continue;
      notApplied(
        scenario,
        main
          ? `Scenario ${scenario.id} in openspec/specs is not equal to the scenario in the archived change`
          : `Scenario ${scenario.id} of the archived change is not in openspec/specs`,
      );
    }
    for (const item of result.removed) {
      if (specs.mainIds.has(item.id)) {
        notApplied(item, `The archived change removes scenario ${item.id}, but openspec/specs still has it`);
      } else if (!specs.retired.has(item.id)) {
        errors.push({ code: 'SPEC-REMOVED-NOT-RETIRED', file: item.file, line: item.line, message: `Add the removed scenario ID ${item.id} to openspec/trace/retired-ids.json` });
      }
    }
  }
  for (const capability of listDirectories(path.join(root, folder, 'specs'))) {
    const file = `${folder}/specs/${capability}/spec.md`;
    if (!existsSync(path.join(root, file))) continue;
    const mainFile = `openspec/specs/${capability}/spec.md`;
    const has = (name) => specs.requirements.some((item) => item.file === mainFile && !item.removed && item.name === name);
    const names = readDeltaNames(readFileSync(path.join(root, file), 'utf8'));
    for (const name of names.removed.filter(has)) {
      errors.push({ code: 'SPEC-DELTA-NOT-APPLIED', file, message: `The archived change removes requirement "${name}", but ${mainFile} still has it` });
    }
    for (const { from, to } of names.renamed) {
      const renames = `The archived change renames requirement "${from}" to "${to}"`;
      if (has(from)) errors.push({ code: 'SPEC-DELTA-NOT-APPLIED', file, message: `${renames}, but ${mainFile} still has "${from}"` });
      if (!has(to)) errors.push({ code: 'SPEC-DELTA-NOT-APPLIED', file, message: `${renames}, but ${mainFile} does not have "${to}"` });
    }
  }
  return archived;
}

const DELTA_TOP_SECTION = /^##\s+(.+)$/;
const REMOVED_HEADING = /^###\s*Requirement:\s*(.+)\s*$/;
const REMOVED_BULLET = /^\s*-\s*`?###\s*Requirement:\s*(.+?)`?\s*$/;
const RENAMED_FROM = /^\s*-?\s*FROM:\s*`?###\s*Requirement:\s*(.+?)`?\s*$/;
const RENAMED_TO = /^\s*-?\s*TO:\s*`?###\s*Requirement:\s*(.+?)`?\s*$/;

/**
 * Read the removed requirement names and the renamed requirement pairs of a delta spec with
 * the rules of OpenSpec 1.3.1 (`parseRemovedNames` and `parseRenamedPairs`). These rules also
 * accept a list item and a heading with no space after `###`.
 *
 * @param {string} text - Markdown source of a delta spec.
 * @returns {{removed: string[], renamed: {from: string, to: string}[]}}
 */
export function readDeltaNames(text) {
  const removed = [];
  const renamed = [];
  let section = '';
  let from = null;
  for (const line of text.replace(/\r\n?/g, '\n').split('\n')) {
    const heading = line.match(DELTA_TOP_SECTION);
    if (heading) {
      section = heading[1].trim().toLowerCase();
      continue;
    }
    if (section === 'removed requirements') {
      const match = line.match(REMOVED_HEADING) ?? line.match(REMOVED_BULLET);
      if (match) removed.push(match[1].trim());
    } else if (section === 'renamed requirements') {
      const fromMatch = line.match(RENAMED_FROM);
      const toMatch = line.match(RENAMED_TO);
      if (fromMatch) from = fromMatch[1].trim();
      else if (toMatch && from) {
        renamed.push({ from, to: toMatch[1].trim() });
        from = null;
      }
    }
  }
  return { removed, renamed };
}

function duplicateError(scenario, first) {
  return {
    code: 'SPEC-DUPLICATE-ID',
    file: scenario.file,
    line: scenario.line,
    message: `Scenario ID ${scenario.id} is also at ${first.file}:${first.line}`,
  };
}

/**
 * Read all scenarios from `openspec/specs` and from the active changes.
 * A change scenario replaces the main scenario with the same ID.
 *
 * @param {string} root - Project root.
 */
export function loadSpecs(root) {
  const errors = [];
  const retired = readRetiredIds(root);
  const scenarios = new Map();
  const mainIds = new Set();
  const requirements = [];
  const orphans = [];
  const removed = [];
  const changeIds = new Map();

  const collect = (results) => {
    const found = [];
    for (const result of results) {
      errors.push(...result.errors);
      requirements.push(...result.requirements);
      orphans.push(...result.orphans);
      removed.push(...result.removed);
      found.push(...result.scenarios);
    }
    return found;
  };

  for (const scenario of collect(readSpecTree(root, 'openspec/specs', 'main'))) {
    if (scenarios.has(scenario.id)) {
      errors.push(duplicateError(scenario, scenarios.get(scenario.id)));
      continue;
    }
    scenarios.set(scenario.id, scenario);
    mainIds.add(scenario.id);
  }

  const newIds = new Map();
  for (const change of listActiveChanges(root)) {
    const ids = [];
    changeIds.set(change, ids);
    const seenInChange = new Map();
    for (const scenario of collect(readSpecTree(root, `openspec/changes/${change}/specs`, `change:${change}`))) {
      const earlier = seenInChange.get(scenario.id) || newIds.get(scenario.id);
      if (earlier) {
        errors.push(duplicateError(scenario, earlier));
        continue;
      }
      seenInChange.set(scenario.id, scenario);
      if (!mainIds.has(scenario.id)) newIds.set(scenario.id, scenario);
      scenarios.set(scenario.id, scenario);
      ids.push(scenario.id);
    }
  }

  for (const scenario of scenarios.values()) {
    if (retired.has(scenario.id)) {
      errors.push({
        code: 'SPEC-RETIRED-ID',
        file: scenario.file,
        line: scenario.line,
        message: `Scenario ID ${scenario.id} is retired and cannot be used`,
      });
    }
  }
  for (const item of removed) {
    if (retired.has(item.id)) continue;
    errors.push({
      code: 'SPEC-REMOVED-NOT-RETIRED',
      file: item.file,
      line: item.line,
      message: `Add the removed scenario ID ${item.id} to openspec/trace/retired-ids.json`,
    });
  }

  return { scenarios, mainIds, retired, requirements, orphans, changeIds, errors };
}
