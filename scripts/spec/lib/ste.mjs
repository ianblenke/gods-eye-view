import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const SENTENCE_LIMIT = 25;
const INSTRUCTION_LIMIT = 20;
const PARAGRAPH_LIMIT = 6;

const FENCE = /^\s*(```|~~~)/;
const TABLE_SEPARATOR = /^\s*\|?\s*:?-{2,}/;
const HEADING = /^\s*#{1,6}\s+/;
const LIST_ITEM = /^\s*(?:[-*+]|\d+\.)\s+/;
const TASK_ITEM = /^\s*-\s+\[[ xX]\]\s+(?:\d+(?:\.\d+)*\s+)?/;
const ABBREVIATIONS = new Set(['e.g', 'i.e', 'etc', 'vs']);
const BE_FORMS = new Set(['is', 'are', 'was', 'were', 'be', 'been', 'being']);
const NOT_PARTICIPLES = new Set(['then', 'when', 'open', 'even', 'often', 'token', 'seven', 'eleven']);
const CONTRACTION = /^(?:[a-z]+n['’]t|[a-z]+['’](?:re|ve|ll|d|m)|(?:it|that|there|what|here|let|who|he|she)['’]s)$/i;
const ING_WORD = /^[a-z]{2,}ing$/i;
const CODE_SPAN = /`([^`]*)`/g;
const CODE_SPAN_LIMIT = 4;
const PROCESS_FILES = ['AGENTS.md', '.claude/commands/opsx/review.md'];

/**
 * Replace the parts of a line that the lint does not check. Inline code and
 * URLs become one placeholder word, so a period after them still ends the
 * sentence and the code still counts as one word.
 */
function cleanLine(line) {
  return line
    .replace(/`[^`]*`/g, 'CODE')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/[^\s)]+?(?=[.,;:!?]?(?:\s|$))/g, 'URL')
    .replace(/\*\*|__/g, '');
}

function tokensOf(text, line) {
  return text
    .split(/\s+/)
    .filter((token) => /[A-Za-z0-9]/.test(token))
    .map((token) => ({ text: token, line }));
}

/** Split Markdown into paragraphs of tokens. Each list item, heading and table cell is one paragraph. */
function paragraphsOf(text, { isTasks }) {
  const paragraphs = [];
  let current = null;
  let inFence = false;
  const close = () => {
    if (current && current.tokens.length > 0) paragraphs.push(current);
    current = null;
  };
  const open = (line, kind) => {
    close();
    current = { line, kind, tokens: [] };
  };

  text.split('\n').forEach((raw, index) => {
    const lineNumber = index + 1;
    if (FENCE.test(raw)) {
      close();
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    if (raw.trim() === '') {
      close();
      return;
    }
    if (TABLE_SEPARATOR.test(raw)) return;
    if (raw.trim().startsWith('|')) {
      close();
      for (const cell of raw.split('|')) {
        open(lineNumber, 'cell');
        current.tokens.push(...tokensOf(cleanLine(cell), lineNumber));
        close();
      }
      return;
    }
    if (HEADING.test(raw)) {
      open(lineNumber, 'heading');
      current.tokens.push(...tokensOf(cleanLine(raw.replace(HEADING, '')), lineNumber));
      close();
      return;
    }
    if (isTasks && TASK_ITEM.test(raw)) {
      open(lineNumber, 'task');
      current.tokens.push(...tokensOf(cleanLine(raw.replace(TASK_ITEM, '')), lineNumber));
      return;
    }
    if (LIST_ITEM.test(raw)) {
      open(lineNumber, 'item');
      current.tokens.push(...tokensOf(cleanLine(raw.replace(LIST_ITEM, '')), lineNumber));
      return;
    }
    if (!current) open(lineNumber, 'text');
    current.tokens.push(...tokensOf(cleanLine(raw), lineNumber));
  });
  close();
  return paragraphs;
}

function bare(token) {
  return token.text.replace(/^[("'“‘]+/, '').replace(/[.,;:!?)"'”’]+$/, '');
}

function sentencesOf(tokens) {
  const sentences = [];
  let current = [];
  for (const token of tokens) {
    current.push(token);
    const ends = /[.!?]["')”’]*$/.test(token.text);
    if (ends && !ABBREVIATIONS.has(bare(token).toLowerCase())) {
      sentences.push(current);
      current = [];
    }
  }
  if (current.length > 0) sentences.push(current);
  return sentences;
}

function finding(rule, level, line, message) {
  return { rule, level, line, message };
}

/** Check one list of tokens against all rules. */
function checkParagraph(paragraph, words) {
  const findings = [];
  const { tokens } = paragraph;
  const sentences = sentencesOf(tokens);

  if (paragraph.kind === 'task') {
    if (tokens.length > INSTRUCTION_LIMIT) {
      findings.push(
        finding('STE-INSTRUCTION', 'error', paragraph.line, `The task has ${tokens.length} words. The limit is ${INSTRUCTION_LIMIT}.`),
      );
    }
  } else {
    for (const sentence of sentences) {
      if (sentence.length > SENTENCE_LIMIT) {
        findings.push(
          finding('STE-SENTENCE', 'error', sentence[0].line, `The sentence has ${sentence.length} words. The limit is ${SENTENCE_LIMIT}.`),
        );
      }
    }
  }
  if (sentences.length > PARAGRAPH_LIMIT) {
    findings.push(
      finding('STE-PARAGRAPH', 'error', paragraph.line, `The paragraph has ${sentences.length} sentences. The limit is ${PARAGRAPH_LIMIT}.`),
    );
  }

  for (const token of tokens) {
    if (CONTRACTION.test(bare(token))) {
      findings.push(finding('STE-CONTRACTION', 'error', token.line, `Write "${bare(token)}" in full`));
    }
  }
  for (const token of tokens) {
    const word = bare(token).toLowerCase();
    if (Object.hasOwn(words.words, word)) {
      findings.push(finding('STE-WORD', 'error', token.line, `Use "${words.words[word]}", not "${word}"`));
    }
  }
  const lowered = tokens.map((token) => bare(token).toLowerCase());
  for (const [phrase, replacement] of Object.entries(words.phrases)) {
    const parts = phrase.split(' ');
    for (let index = 0; index + parts.length <= lowered.length; index += 1) {
      if (parts.every((part, offset) => lowered[index + offset] === part)) {
        findings.push(finding('STE-WORD', 'error', tokens[index].line, `Use "${replacement}", not "${phrase}"`));
      }
    }
  }
  for (let index = 0; index + 1 < tokens.length; index += 1) {
    const next = lowered[index + 1];
    if (BE_FORMS.has(lowered[index]) && /(ed|en)$/.test(next) && !NOT_PARTICIPLES.has(next)) {
      findings.push(finding('STE-PASSIVE', 'warning', tokens[index].line, `Check for passive voice: "${lowered[index]} ${next}"`));
    }
  }
  const allowed = new Set(words.allowedIng);
  for (const token of tokens) {
    const word = bare(token);
    if (ING_WORD.test(word) && !allowed.has(word.toLowerCase())) {
      findings.push(finding('STE-ING', 'warning', token.line, `Check the -ing word "${word}"`));
    }
  }
  return findings;
}

/** Find inline code with more words than the limit, outside fenced code. */
function codeSpanFindings(text) {
  const findings = [];
  let inFence = false;
  text.split('\n').forEach((raw, index) => {
    if (FENCE.test(raw)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    for (const match of raw.matchAll(CODE_SPAN)) {
      const count = match[1].split(/\s+/).filter(Boolean).length;
      if (count > CODE_SPAN_LIMIT) {
        findings.push(finding('STE-CODE-SPAN', 'error', index + 1, `The inline code has ${count} words. The limit is ${CODE_SPAN_LIMIT}. Write the words as prose.`));
      }
    }
  });
  return findings;
}

/**
 * Lint one Markdown file.
 *
 * @returns {object[]} Findings with rule, level, file, line and message.
 */
export function lintMarkdown(text, { file, words }) {
  const isTasks = path.posix.basename(file) === 'tasks.md';
  return [...paragraphsOf(text, { isTasks }).flatMap((paragraph) => checkParagraph(paragraph, words)), ...codeSpanFindings(text)]
    .map((item) => ({ rule: item.rule, level: item.level, file, line: item.line, message: item.message }));
}

/** Lint the names of traced tests, without their tags. */
export function lintTestNames(records, words) {
  return records
    .filter((record) => record.kind === 'test' && record.tags.length > 0)
    .flatMap((record) =>
      checkParagraph({ kind: 'text', line: 0, tokens: tokensOf(record.title, 0) }, words).map((item) => ({
        rule: item.rule,
        level: item.level,
        file: record.file,
        line: 0,
        message: `Test "${record.name}": ${item.message[0].toLowerCase()}${item.message.slice(1)}`,
      })),
    );
}

/** True for `review.md` or the folder `review/` directly in an active or archived change folder. */
function isChangeReview(relative) {
  const parts = relative.split('/');
  if (parts[0] !== 'openspec' || parts[1] !== 'changes') return false;
  const at = parts[2] === 'archive' ? 4 : 3;
  if (parts.length <= at) return false;
  return parts[at] === 'review.md' || parts[at] === 'review';
}

/** List the Markdown files in `openspec/`, the agent files and the process files, sorted. */
export function listMarkdownFiles(root) {
  const found = [];
  const visit = (directory, recursive) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      const relative = path.relative(root, absolute).split(path.sep).join('/');
      if (isChangeReview(relative)) continue;
      if (entry.isDirectory()) {
        if (recursive) visit(absolute, recursive);
      } else if (entry.name.endsWith('.md')) {
        found.push(relative);
      }
    }
  };
  visit(path.join(root, 'openspec'), true);
  visit(path.join(root, '.claude/agents'), false);
  for (const file of PROCESS_FILES) {
    if (existsSync(path.join(root, file))) found.push(file);
  }
  return found.sort();
}

/** Read `openspec/ste/words.json`. */
export function readWordList(root) {
  return JSON.parse(readFileSync(path.join(root, 'openspec/ste/words.json'), 'utf8'));
}

/** Lint all Markdown files in `openspec/` and the names of traced tests. */
export function lintProject({ root, records }) {
  const words = readWordList(root);
  return [
    ...listMarkdownFiles(root).flatMap((file) =>
      lintMarkdown(readFileSync(path.join(root, file), 'utf8'), { file, words }),
    ),
    ...lintTestNames(records, words),
  ];
}

/** True when one or more findings are errors. */
export function hasErrors(findings) {
  return findings.some((item) => item.level === 'error');
}
