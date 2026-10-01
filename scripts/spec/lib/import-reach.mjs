import path from 'node:path';
import { moduleImports } from '../../module-analysis.mjs';
import { isCodeFile } from './inventory.mjs';

/** Read the import graph of tracked code modules. */
function importGraph(files, readFile) {
  const code = new Set(files.filter(isCodeFile));
  const edges = new Map();
  for (const file of code) {
    if (!/\.([cm]?js|[cm]?ts|jsx|tsx)$/.test(file)) continue;
    let imports;
    try {
      imports = moduleImports(readFile(file));
    } catch {
      // A parse error supplies no import edges.
      continue;
    }
    const targets = [];
    for (const specifier of imports) {
      if (!specifier.startsWith('.')) continue;
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
      const resolved = [target, `${target}.js`, `${target}.mjs`, `${target}/index.js`, `${target}/index.mjs`].find((name) => code.has(name));
      if (resolved) targets.push(resolved);
    }
    edges.set(file, targets);
  }
  return edges;
}

/** Return descendants whose import path uses a merged edge absent in the base graph. */
export function importReach({ files, readFile, baseFiles, readBaseFile, fromFiles, readFromFile }) {
  const edges = importGraph(files, readFile);
  const baseEdges = importGraph(baseFiles, readBaseFile);
  const fromEdges = importGraph(fromFiles, readFromFile);
  return (changed) => {
    const visited = new Set();
    const reached = new Set();
    const queue = [...changed].map((file) => [file, false]);
    while (queue.length > 0) {
      const [file, usedNewEdge] = queue.pop();
      const state = `${file}:${usedNewEdge}`;
      if (visited.has(state)) continue;
      visited.add(state);
      for (const target of edges.get(file) ?? []) {
        const newEdge = usedNewEdge || ((fromEdges.get(file) ?? []).includes(target) && !(baseEdges.get(file) ?? []).includes(target));
        if (newEdge) reached.add(target);
        queue.push([target, newEdge]);
      }
    }
    return reached;
  };
}

/** True only for a tracked reached code file with base content and new untrue coverage. */
export function adoptableReached({ file, codeFiles, sameAsBase, current, baseLedger, reached }) {
  const baseEntry = baseLedger?.coverage[file];
  return codeFiles.has(file) && sameAsBase(file) && current.coverage.get(file)?.untrue === true && (!baseEntry || baseEntry.untrue === false) && reached.has(file);
}
