import { createHash } from 'node:crypto';
import { appendFileSync, readFileSync, realpathSync } from 'node:fs';
import { Session } from 'node:inspector';
import { createRequire, syncBuiltinESMExports } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainThread } from 'node:worker_threads';
import { promisify } from 'node:util';

const require = createRequire(import.meta.url);
const GUARDS = Symbol.for('gev.spec.guards');
const CHILD_PROCESS_FUNCTIONS = ['spawn', 'spawnSync', 'execFile', 'execFileSync', 'exec', 'execSync', 'fork'];

/**
 * The preload option that loads this guard. Node runs `--require` preloads before
 * `--import` preloads, in order, so the guard is the first preload of `NODE_OPTIONS`.
 */
export const GUARD_PRELOAD = `--require=${JSON.stringify(fileURLToPath(import.meta.url))}`;

/**
 * Relative path of a script URL inside the root, or null.
 *
 * @param {string} url - `file:` URL or absolute path from V8.
 * @param {string} root - Project root.
 */
export function fileOfScriptUrl(url, root) {
  let absolute = null;
  if (url.startsWith('file://')) {
    try {
      absolute = fileURLToPath(url);
    } catch {
      return null;
    }
  } else if (path.isAbsolute(url)) {
    absolute = url;
  }
  if (!absolute) return null;
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return relative.split(path.sep).join('/');
}

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

/**
 * Make the guard state: source checks, checked files and assertion counts.
 *
 * @param {object} input
 * @param {string} input.root - Project root.
 * @param {Map<string, string>} input.inventory - Content hash of each code file at the start of the run.
 * @param {() => object|undefined} input.getContext - Returns the current node:test context.
 */
export function createGuard({ root, inventory, getContext }) {
  const violations = new Map();
  const checked = new Set();
  const counts = new Map();
  const checkScript = (url, source) => {
    const file = fileOfScriptUrl(url, root);
    if (!file || !inventory.has(file)) return;
    const expected = inventory.get(file);
    if (source !== undefined && (sha256(source) === expected || sha256(`\uFEFF${source}`) === expected)) {
      checked.add(file);
      return;
    }
    violations.set(file, {
      code: 'COVERAGE-FAKE',
      file,
      message: `A test ran code under the name ${file}, but the code is not the file content`,
    });
  };
  return {
    checkScript,
    onSource: (url) => (error, result) => checkScript(url, error ? undefined : result.scriptSource),
    countAssertion() {
      const context = getContext();
      if (!context || !context.filePath) return;
      const file = path.relative(root, context.filePath).split(path.sep).join('/');
      const key = `${file}\0${context.fullName}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    },
    results() {
      return {
        violations: [...violations.values()],
        checked: [...checked].sort(),
        assertions: [...counts].map(([key, count]) => {
          const [file, fullName] = key.split('\0');
          return { file, fullName, count };
        }),
      };
    },
  };
}

/** Wrap the functions of the assert modules so that each call counts. */
export function wrapAssertModules(modules, onCall) {
  for (const mod of modules) {
    for (const key of Object.keys(mod)) {
      const original = mod[key];
      if (typeof original !== 'function' || /^[A-Z]/.test(key) || key === 'strict') continue;
      mod[key] = function countedAssertion(...args) {
        onCall();
        return original.apply(this, args);
      };
    }
  }
  syncBuiltinESMExports();
}

function sameFolder(folder, other, cwd) {
  const resolve = (value) => {
    const absolute = path.resolve(cwd || process.cwd(), value);
    try {
      return realpathSync(absolute);
    } catch {
      return absolute;
    }
  };
  return resolve(folder) === resolve(other);
}

/**
 * Give the guard to a child process that collects coverage. A child process that
 * writes coverage to the coverage folder of this process always gets the gate values.
 *
 * @param {object|undefined} options - Options of a child_process call.
 * @param {Record<string, string>} guardEnv - Guard variables for the child.
 * @param {{coverageDir?: string, processEnv?: Record<string, string>}} [where]
 *   The coverage folder of this process, and the environment that a child gets without `options.env`.
 */
export function withGuardEnv(options, guardEnv, { coverageDir, processEnv = process.env } = {}) {
  const env = options && options.env ? options.env : processEnv;
  if (!env.NODE_V8_COVERAGE) return options;
  const NODE_OPTIONS = `${GUARD_PRELOAD} ${env.NODE_OPTIONS || ''}`.trim();
  const gateRun = Boolean(coverageDir) && sameFolder(env.NODE_V8_COVERAGE, coverageDir, options && options.cwd);
  const next = gateRun ? { ...env, ...guardEnv, NODE_OPTIONS } : { ...guardEnv, ...env, NODE_OPTIONS };
  return { ...(options || {}), env: next };
}

function guardArguments(args, guardEnv, where) {
  const index = args.findIndex((arg) => arg !== null && typeof arg === 'object' && !Array.isArray(arg));
  if (index >= 0) {
    args[index] = withGuardEnv(args[index], guardEnv, where);
    return args;
  }
  const options = withGuardEnv(undefined, guardEnv, where);
  if (!options) return args;
  const callback = args.findIndex((arg) => typeof arg === 'function');
  const at = callback === -1 ? args.length : callback;
  if (at > 1 && args[at - 1] === undefined) args[at - 1] = options;
  else args.splice(at, 0, options);
  return args;
}

/**
 * Wrap the child_process functions with withGuardEnv. The wrapper keeps the
 * properties of each function, and it also wraps a custom promisify function.
 */
export function wrapChildProcess(childProcess, guardEnv, where = {}) {
  for (const name of CHILD_PROCESS_FUNCTIONS) {
    const original = childProcess[name];
    const guarded = function guardedChildProcess(...args) {
      return original.apply(this, guardArguments(args, guardEnv, where));
    };
    const descriptors = Object.getOwnPropertyDescriptors(original);
    const custom = original[promisify.custom];
    delete descriptors[promisify.custom];
    Object.defineProperties(guarded, descriptors);
    if (custom) {
      Object.defineProperty(guarded, promisify.custom, {
        value: function guardedPromisified(...args) {
          return custom.apply(this, guardArguments(args, guardEnv, where));
        },
      });
    }
    childProcess[name] = guarded;
  }
  syncBuiltinESMExports();
}

/**
 * True for a node:test runner that runs its tests in child processes. Such a runner
 * has no inspector and runs no test code.
 *
 * @param {string[]} execArgv - The Node options of the process.
 * @param {string} [nodeOptions] - The value of NODE_OPTIONS.
 */
export function isChildProcessRunner(execArgv, nodeOptions = '') {
  return execArgv.includes('--test') && ![...execArgv, nodeOptions].some((option) => option.includes('test-isolation=none'));
}

const GUARD_KEYS = ['GEV_SPEC_OUT', 'GEV_SPEC_ROOT', 'GEV_SPEC_INVENTORY'];

/**
 * Keep the guard values in `process.env`. A later preload cannot remove, change or
 * replace them. The node:test runner gets `spawn` before the preloads load, so the
 * runner gives its test processes the environment, not the wrapped functions.
 *
 * @param {{env: Record<string, string>}} processObject - The process object.
 */
export function lockGuardEnv(processObject) {
  const target = processObject.env;
  const saved = Object.fromEntries(GUARD_KEYS.map((key) => [key, target[key]]));
  const guarded = (key) => GUARD_KEYS.includes(key);
  const env = new Proxy(target, {
    get: (object, key) => (guarded(key) ? saved[key] : Reflect.get(object, key)),
    set: (object, key, value) => guarded(key) || Reflect.set(object, key, value),
    deleteProperty: (object, key) => guarded(key) || Reflect.deleteProperty(object, key),
    defineProperty: (object, key, descriptor) => guarded(key) || Reflect.defineProperty(object, key, descriptor),
  });
  Object.defineProperty(processObject, 'env', { get: () => env, set: () => {}, configurable: false, enumerable: true });
}

/**
 * Install the guard in this process when GEV_SPEC_OUT is set. Throws when the hash
 * of the inventory file is not the hash in GEV_SPEC_INVENTORY. A process without an
 * inspector gets no guard. When that process collects coverage, the guard writes an
 * error that names no file. A worker thread gets no source check, so the gate gives 0%
 * coverage to a file that only a worker loads. In each case, the child processes of the
 * process or the worker get the gate values.
 *
 * @param {{env?: Record<string, string>, createSession?: () => Session, execArgv?: string[], mainThread?: boolean}} [options]
 * @returns {object|null} The guard, or null when the environment has no GEV_SPEC_OUT, the thread is a worker or the process has no inspector.
 */
export function installGuard({
  env = process.env,
  createSession = () => new Session(),
  execArgv = process.execArgv,
  mainThread = isMainThread,
  childProcess = require('node:child_process'),
  processObject = process,
} = {}) {
  if (!env.GEV_SPEC_OUT) return null;
  const guards = (globalThis[GUARDS] ||= new Map());
  if (guards.has(env.GEV_SPEC_OUT)) return guards.get(env.GEV_SPEC_OUT);

  const root = env.GEV_SPEC_ROOT;
  const outDir = env.GEV_SPEC_OUT;
  const inventoryFile = path.join(outDir, 'inventory.json');
  const inventoryText = readFileSync(inventoryFile, 'utf8');
  if (sha256(inventoryText) !== env.GEV_SPEC_INVENTORY) {
    throw new Error(`The test guard stopped: the hash of ${inventoryFile} is not the hash in GEV_SPEC_INVENTORY`);
  }
  wrapChildProcess(
    childProcess,
    { GEV_SPEC_OUT: outDir, GEV_SPEC_ROOT: root, GEV_SPEC_INVENTORY: env.GEV_SPEC_INVENTORY },
    { coverageDir: env.NODE_V8_COVERAGE },
  );
  if (isChildProcessRunner(execArgv, env.NODE_OPTIONS)) lockGuardEnv(processObject);
  if (!mainThread) return null;
  let session;
  try {
    session = createSession();
    session.connect();
  } catch (error) {
    if (!env.NODE_V8_COVERAGE || isChildProcessRunner(execArgv, env.NODE_OPTIONS)) return null;
    const violation = { code: 'COVERAGE-NO-INSPECTOR', file: '', message: `Process ${process.pid} collects coverage, but the test guard cannot start an inspector session: ${error.message}` };
    appendFileSync(path.join(outDir, `guard-${process.pid}.jsonl`), `${JSON.stringify({ violations: [violation], checked: [], assertions: [] })}\n`);
    return null;
  }
  const inventory = new Map(Object.entries(JSON.parse(inventoryText)));
  const { getTestContext } = require('node:test');
  const guard = createGuard({ root, inventory, getContext: getTestContext });
  guards.set(outDir, guard);

  session.on('Debugger.scriptParsed', ({ params }) => {
    const file = fileOfScriptUrl(params.url, root);
    if (!file || !inventory.has(file)) return;
    session.post('Debugger.getScriptSource', { scriptId: params.scriptId }, guard.onSource(params.url));
  });
  session.post('Debugger.enable');

  wrapAssertModules([require('node:assert'), require('node:assert/strict')], guard.countAssertion);
  process.on('exit', () => {
    appendFileSync(path.join(outDir, `guard-${process.pid}.jsonl`), `${JSON.stringify(guard.results())}\n`);
  });
  return guard;
}

installGuard();
