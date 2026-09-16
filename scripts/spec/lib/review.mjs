import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const FIELDS = [
  ['reviewers', 'Reviewers', /^Reviewers:[ \t]*(\S.*)$/m],
  ['date', 'Date', /^Date:[ \t]*(\d{4}-\d{2}-\d{2})[ \t]*$/m],
  ['gates', 'Gates', /^Gates:[ \t]*(\S.*)$/m],
  ['rounds', 'Rounds', /^Rounds:[ \t]*(\d+)[ \t]*$/m],
  ['scope', 'Scope', /^Scope:[ \t]*(\S.*)$/m],
];
// The scope of the last round: the full change, or the diff against the Git commit of the round before.
const SCOPE_VALUE = /^(full|diff [0-9a-f]{7,40})$/;
// After three rounds, a person can accept an open finding with the severity minor.
// The severity is the second word of the finding text, for example "F4 minor The gate ...".
const ACCEPTED = /\bAccepted by [A-Za-z]/;
const SEVERITY = /^\S+[ \t]+(\S+)/;
const SIGN_OFF_ROUNDS = 3;
const AGENT_SCOPE = [/^## Scope of a round$/m, /limit of three rounds/, /diff since the round/];
// The review command must name the scope of a round and the round limit in its steps.
export const REVIEW_COMMAND = '.claude/commands/opsx/review.md';
const COMMAND_SCOPE = [/^Scope:/m, /^Rounds:/m, /limit of three rounds/, /scope of the round|Find the scope/];
const TREE = /^Reviewed-Tree:[ \t]*([0-9a-f]{64})[ \t]*$/m;
const VERDICT = /^Verdict:[ \t]*(\S+)[ \t]*$/gm;
const AGENT_VERDICT = /^[ \t]*Verdict:.*$/gim;
const FINDING = /^\s*(?:[-*+]|\d+[.)])\s+\[([ xX])\]\s+(.*)$/;
export const AGENTS = ['spec-adversary', 'ste-adversary'];
const ALLOWED_TOOLS = new Set(['Read', 'Grep', 'Glob']);
const ALLOWED_KEYS = new Set(['name', 'description', 'tools', 'model', 'color']);
const ARCHIVED = /^\d{4}-\d{2}-\d{2}-(.+)$/;

/**
 * Read the fixed fields and the findings of a review record.
 *
 * @param {string} text - Content of review.md.
 */
export function parseReview(text) {
  const review = { verdicts: [...text.matchAll(VERDICT)].map((match) => match[1]) };
  for (const [key, , pattern] of FIELDS) review[key] = text.match(pattern)?.[1]?.trim() ?? null;
  review.tree = text.match(TREE)?.[1] ?? null;
  review.findings = [];
  text.split('\n').forEach((line, index) => {
    const match = line.match(FINDING);
    if (match) review.findings.push({ line: index + 1, checked: match[1] !== ' ', text: match[2].trim() });
  });
  return review;
}

function listFiles(root, directory) {
  const absolute = path.join(root, directory);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(root, relative) : [relative];
  });
}

/**
 * SHA-256 hash of the change files and the diff files outside openspec/changes/. It does not include review.md or review/.
 *
 * @param {object} input
 * @param {string} input.changeDir - Folder of the change, relative to the root.
 * @param {string[]} input.diffFiles - Files that differ from the base.
 */
export function computeTreeHash({ root, changeDir, diffFiles }) {
  const entries = [];
  const add = (key, file) => {
    const absolute = path.join(root, file);
    const hash = existsSync(absolute) ? createHash('sha256').update(readFileSync(absolute)).digest('hex') : 'deleted';
    entries.push(`${key}\0${hash}`);
  };
  for (const file of listFiles(root, changeDir)) {
    const inside = file.slice(changeDir.length + 1);
    if (inside === 'review.md' || inside.startsWith('review/')) continue;
    add(`change/${inside}`, file);
  }
  for (const file of diffFiles) {
    if (file.startsWith('openspec/changes/')) continue;
    add(file, file);
  }
  return createHash('sha256').update(entries.sort().join('\n')).digest('hex');
}

function archivedFolders(root) {
  const archive = path.join(root, 'openspec/changes/archive');
  if (!existsSync(archive)) return [];
  return readdirSync(archive, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && ARCHIVED.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

/**
 * Stop for a change name that two change folders use.
 *
 * @returns {object[]} Errors.
 */
export function checkChangeNames(root) {
  const changes = path.join(root, 'openspec/changes');
  const active = existsSync(changes)
    ? readdirSync(changes, { withFileTypes: true }).filter((entry) => entry.isDirectory() && entry.name !== 'archive').map((entry) => entry.name)
    : [];
  const names = [...active, ...archivedFolders(root).map((name) => name.match(ARCHIVED)[1])];
  const reused = [...new Set(names.filter((name, index) => names.indexOf(name) !== index))].sort();
  return reused.map((name) => ({ code: 'REVIEW-NAME-REUSED', file: 'openspec/changes', message: `Two change folders have the change name ${name}. Give each change its own name.` }));
}

/** Folder of an active or archived change, or null. */
export function changeFolder(root, change) {
  const active = `openspec/changes/${change}`;
  if (change !== 'archive' && existsSync(path.join(root, active))) return active;
  const archived = archivedFolders(root).find((name) => name.match(ARCHIVED)[1] === change);
  return archived ? `openspec/changes/archive/${archived}` : null;
}

function checkReviewFolder(root, directory, change, treeHash) {
  const relative = `${directory}/review.md`;
  if (!existsSync(path.join(root, relative))) {
    return [{ code: 'REVIEW-MISSING', file: relative, message: `Change ${change} has no review.md` }];
  }
  const review = parseReview(readFileSync(path.join(root, relative), 'utf8'));
  const errors = [];
  const error = (code, message, extra = {}) => errors.push({ code, file: relative, message, ...extra });

  if (review.verdicts.length === 0) error('REVIEW-NO-VERDICT', 'review.md has no "Verdict:" line');
  if (review.verdicts.length > 1) error('REVIEW-TWO-VERDICTS', `review.md has ${review.verdicts.length} "Verdict:" lines`);
  if (review.verdicts.length === 1 && review.verdicts[0] !== 'PASS') error('REVIEW-NOT-PASS', `The verdict of ${change} is ${review.verdicts[0]}, not PASS`);
  for (const [key, label] of FIELDS) {
    if (!review[key]) error('REVIEW-FIELD', `review.md has no "${label}:" line`);
  }
  if (review.reviewers && !AGENTS.every((agent) => review.reviewers.split(/[\s,]+/).includes(agent))) {
    error('REVIEW-REVIEWERS', `The "Reviewers:" line must name ${AGENTS.join(' and ')}`);
  }
  const rounds = Number(review.rounds);
  if (review.rounds && rounds < 1) error('REVIEW-ROUNDS', 'The "Rounds:" line must have a number of 1 or more');
  if (review.scope && !SCOPE_VALUE.test(review.scope)) {
    error('REVIEW-SCOPE', `The "Scope:" line must be "full" or "diff <commit>" with 7 to 40 lowercase hexadecimal characters, not "${review.scope}"`);
  } else if (rounds === 1 && review.scope !== 'full') {
    error('REVIEW-SCOPE', 'The first round reads the whole change, so its "Scope:" line must be "full"');
  }
  for (const finding of review.findings) {
    if (finding.checked) continue;
    const severity = finding.text.match(SEVERITY)?.[1]?.toLowerCase();
    if (ACCEPTED.test(finding.text) && severity === 'minor' && rounds >= SIGN_OFF_ROUNDS) continue;
    error('REVIEW-OPEN-FINDING', `Open finding: ${finding.text}`, { line: finding.line });
  }
  for (const agent of AGENTS) {
    const output = `${directory}/review/${agent}.md`;
    if (!existsSync(path.join(root, output))) {
      errors.push({ code: 'REVIEW-AGENT-OUTPUT', file: output, message: `The output of ${agent} is not there` });
    } else {
      const verdicts = readFileSync(path.join(root, output), 'utf8').match(AGENT_VERDICT) ?? [];
      if (verdicts.length !== 1 || verdicts[0] !== 'Verdict: PASS') {
        errors.push({ code: 'REVIEW-AGENT-NOT-PASS', file: output, message: `The output of ${agent} must have one verdict line, and that line must be "Verdict: PASS"` });
      }
    }
  }
  if (treeHash !== undefined) {
    if (!review.tree) error('REVIEW-FIELD', 'review.md has no "Reviewed-Tree:" line');
    else if (review.tree !== treeHash) error('REVIEW-TREE', `The reviewed tree ${review.tree.slice(0, 12)} is not the current tree ${treeHash.slice(0, 12)}. Review the change again.`);
  }
  return errors;
}

/**
 * Check the review record of one change, active or archived.
 *
 * @param {{treeHash?: string}} [options] - The current tree hash, to compare with the review.
 */
export function checkChangeReview(root, change, { treeHash } = {}) {
  const directory = changeFolder(root, change) ?? `openspec/changes/${change}`;
  return checkReviewFolder(root, directory, change, treeHash);
}

/**
 * Check the review record of each archived change.
 *
 * @param {{except?: string|null}} [options] - A change folder that the caller checks in another way.
 */
export function checkArchivedReviews(root, { except = null } = {}) {
  return archivedFolders(root)
    .map((name) => `openspec/changes/archive/${name}`)
    .filter((folder) => folder !== except)
    .flatMap((folder) => checkReviewFolder(root, folder, path.posix.basename(folder).match(ARCHIVED)[1]));
}

/** Read the front matter and the prompt of a Claude Code agent file. */
export function readAgentDefinition(file) {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fields = {};
  const others = [];
  for (const line of (match ? match[1] : '').split('\n')) {
    const field = line.match(/^([a-z]+):\s*(.*)$/);
    if (field && ALLOWED_KEYS.has(field[1])) fields[field[1]] = field[2].trim();
    else if (line.trim() !== '') others.push(line.trim());
  }
  return {
    others,
    name: fields.name ?? '',
    description: fields.description ?? '',
    tools: (fields.tools ?? '').split(',').map((tool) => tool.trim()).filter(Boolean),
    prompt: match ? match[2].trim() : '',
  };
}

/** Check that the two review agents exist and have only read tools. */
export function checkAgents(root) {
  const errors = [];
  for (const name of AGENTS) {
    const relative = `.claude/agents/${name}.md`;
    const error = (message) => errors.push({ code: 'REVIEW-AGENT', file: relative, message });
    if (!existsSync(path.join(root, relative))) {
      error(`${name} has no agent file`);
      continue;
    }
    const agent = readAgentDefinition(path.join(root, relative));
    if (agent.name !== name) error(`${name} has no name`);
    if (!agent.description) error(`${name} has no description`);
    if (agent.tools.length === 0) error(`${name} has no tools`);
    for (const tool of agent.tools.filter((item) => !ALLOWED_TOOLS.has(item))) {
      error(`${name} has the tool ${tool}. Use only Read, Grep and Glob.`);
    }
    for (const line of agent.others) {
      error(`${name} has the front matter line "${line}". Use only the keys name, description, tools, model and color.`);
    }
    if (!AGENT_SCOPE.every((pattern) => pattern.test(agent.prompt))) {
      error(`${name} does not name the scope of a round and the limit of three rounds`);
    }
  }
  return errors;
}

/** Check that the review command names the scope of a round, the two review.md lines and the round limit. */
export function checkReviewCommand(root) {
  const command = path.join(root, REVIEW_COMMAND);
  const error = (message) => [{ code: 'REVIEW-COMMAND', file: REVIEW_COMMAND, message }];
  if (!existsSync(command)) return error('The review command file is not there');
  if (!COMMAND_SCOPE.every((pattern) => pattern.test(readFileSync(command, 'utf8')))) {
    return error('The review command does not name the scope of a round, the two review.md lines and the limit of three rounds');
  }
  return [];
}
