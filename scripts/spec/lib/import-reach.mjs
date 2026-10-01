import path from 'node:path';
import { moduleImports } from '../../module-analysis.mjs';
import { isCodeFile } from './inventory.mjs';

/** Read tracked modules once. Return the import descendants of changed code files. */
export function importReach({ files, readFile }) {
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
  return (changed) => {
    const visited = new Set();
    const reached = new Set();
    const queue = [...changed];
    while (queue.length > 0) {
      const file = queue.pop();
      if (visited.has(file)) continue;
      visited.add(file);
      for (const target of edges.get(file) ?? []) {
        reached.add(target);
        queue.push(target);
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
