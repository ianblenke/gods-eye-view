import { fileURLToPath } from 'node:url';

const COVERAGE_MARK = 'node:' + 'coverage';
const NEXT_COMMENT = new RegExp(`/\\* ${COVERAGE_MARK} ignore next (\\d+ )?\\*/`);
const STATUS_COMMENT = new RegExp(`/\\* ${COVERAGE_MARK} (enable|disable) \\*/`);

function sourceLines(source) {
  let offset = 0;
  let ignoreCount = 0;
  let enabled = true;
  return source.split(/(?<=\r?\n)/u).map((text) => {
    const startOffset = offset;
    offset += text.length;
    const endOffset = startOffset + text.replace(/\r?\n$/u, '').length;
    const line = { startOffset, endOffset, ignore: false, count: 0 };
    line.count = line.startOffset === line.endOffset ? 1 : 0;
    if (ignoreCount > 0) {
      ignoreCount -= 1;
      line.ignore = true;
    } else if (!enabled) {
      line.ignore = true;
    }
    if (!line.ignore) {
      const match = text.match(NEXT_COMMENT);
      if (match) ignoreCount = Number.parseInt(match[1] ?? '1', 10);
    }
    const status = text.match(STATUS_COMMENT);
    if (status) {
      ignoreCount = 0;
      enabled = status[1] === 'enable';
    }
    return line;
  });
}

function mapRange(range, lines) {
  let start = 0;
  let end = lines.length;
  let index = -1;
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const line = lines[mid];
    if (!line) {
      end = mid - 1;
    } else if (range.startOffset >= line.startOffset && range.startOffset <= line.endOffset) {
      index = mid;
      break;
    } else if (range.startOffset >= line.endOffset) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  let ignored = true;
  if (index < 0) return ignored;
  for (; index < lines.length; index += 1) {
    const line = lines[index];
    if (range.endOffset <= line.startOffset) break;
    if (range.startOffset <= line.startOffset && range.endOffset >= line.endOffset) line.count = range.count;
    if (!line.ignore) ignored = false;
  }
  return ignored;
}

function functionKey(fn) {
  return JSON.stringify([fn.functionName, fn.ranges[0].startOffset, fn.ranges[0].endOffset]);
}

function branchKey(range, occurrence) {
  return JSON.stringify([range.startOffset, range.endOffset, occurrence]);
}

export function createCoverage(readSource) {
  return { readSource, files: new Map() };
}

export function addProcess(state, process, accept = () => true) {
  for (const script of process.result) {
    if (!accept(script.url)) continue;
    if (!state.files.has(script.url)) {
      state.files.set(script.url, { source: state.readSource(script.url), covered: new Set(), functions: new Map() });
    }
    const entry = state.files.get(script.url);
    const lines = sourceLines(entry.source);
    for (let index = 0; index < script.functions.length; index += 1) {
      const fn = script.functions[index];
      if (fn.ranges.length === 0) continue;
      const key = functionKey(fn);
      if (!entry.functions.has(key)) entry.functions.set(key, { counted: false, covered: false, branches: new Map(), variants: new Map() });
      const item = entry.functions.get(key);
      if (index > 0) item.counted = true;
      const occurrences = new Map();
      const ranges = fn.ranges.map((range) => {
        const ignored = mapRange(range, lines);
        const extent = JSON.stringify([range.startOffset, range.endOffset]);
        const occurrence = occurrences.get(extent) ?? 0;
        occurrences.set(extent, occurrence + 1);
        const id = branchKey(range, occurrence);
        const effective = { startOffset: range.startOffset, endOffset: range.endOffset, covered: range.count !== 0 || ignored, id };
        if (fn.isBlockCoverage) item.branches.set(id, effective);
        return effective;
      });
      if (ranges[0].covered) item.covered = true;
      const variant = { block: fn.isBlockCoverage, ranges };
      item.variants.set(JSON.stringify(variant), variant);
    }
    for (let index = 0; index < lines.length; index += 1) {
      if (lines[index].count > 0 || lines[index].ignore) entry.covered.add(index);
    }
  }
  return state;
}

export function combineCoverage(states) {
  const result = createCoverage(states[0].readSource);
  for (const state of states) {
    for (const [url, entry] of state.files) {
      if (!result.files.has(url)) result.files.set(url, { source: entry.source, covered: new Set(), functions: new Map() });
      const target = result.files.get(url);
      for (const line of entry.covered) target.covered.add(line);
      for (const [key, item] of entry.functions) {
        if (!target.functions.has(key)) target.functions.set(key, { counted: false, covered: false, branches: new Map(), variants: new Map() });
        const fn = target.functions.get(key);
        if (item.counted) fn.counted = true;
        if (item.covered) fn.covered = true;
        for (const [id, branch] of item.branches) fn.branches.set(id, branch);
        for (const [id, variant] of item.variants) fn.variants.set(id, variant);
      }
    }
  }
  return result;
}

function branchCovered(branch, variant) {
  if (!variant.block) return variant.ranges[0].covered;
  const listed = variant.ranges.find((range) => range.id === branch.id);
  if (listed) return listed.covered;
  let parent;
  for (const range of variant.ranges) {
    if (range.startOffset > branch.startOffset) continue;
    if (range.endOffset < branch.endOffset) continue;
    if (parent) {
      if (range.endOffset - range.startOffset > parent.endOffset - parent.startOffset) continue;
    }
    parent = range;
  }
  if (!parent) return false;
  return parent.covered;
}

export function coverageCounts(state) {
  const result = new Map();
  for (const [url, entry] of [...state.files].sort(([a], [b]) => a.localeCompare(b))) {
    const counts = { LF: sourceLines(entry.source).length, LH: entry.covered.size, BRF: 0, BRH: 0, FNF: 0, FNH: 0 };
    for (const item of entry.functions.values()) {
      if (item.counted) {
        counts.FNF += 1;
        if (item.covered) counts.FNH += 1;
      }
      for (const branch of item.branches.values()) {
        counts.BRF += 1;
        if ([...item.variants.values()].some((variant) => branchCovered(branch, variant))) counts.BRH += 1;
      }
    }
    result.set(url, counts);
  }
  return result;
}

export function coverageLcov(state) {
  let text = '';
  for (const [url, counts] of coverageCounts(state)) {
    text += `SF:${fileURLToPath(url)}\n`;
    for (const metric of ['LF', 'LH', 'BRF', 'BRH', 'FNF', 'FNH']) text += `${metric}:${counts[metric]}\n`;
    const entry = state.files.get(url);
    for (let index = 0; index < counts.LF; index += 1) text += `DA:${index + 1},${entry.covered.has(index) ? 1 : 0}\n`;
    text += 'end_of_record\n';
  }
  return text;
}

export function replaceLcov(text, state) {
  const loaded = new Set([...state.files.keys()].map((url) => fileURLToPath(url)));
  const retained = text.split('end_of_record\n').filter((record) => {
    const source = record.match(/^SF:(.*)$/m);
    if (!source) return true;
    return !loaded.has(source[1]);
  });
  return retained.join('end_of_record\n') + coverageLcov(state);
}
