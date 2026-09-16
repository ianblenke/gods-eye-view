#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Start each Node run at the same time and wait until each run stops.
 *
 * @param {{args: string[], cwd: string}[]} runs
 * @param {{spawnProcess?: Function, env?: object}} [options]
 * @returns {Promise<{status: number|null, error: string|null}[]>}
 */
export function runParallel(runs, { spawnProcess = spawn, env = process.env } = {}) {
  return Promise.all(
    runs.map(
      (run) =>
        new Promise((resolve) => {
          const child = spawnProcess(process.execPath, run.args, { cwd: run.cwd, env, stdio: ['ignore', 'ignore', 'inherit'] });
          child.on('error', (error) => resolve({ status: null, error: error.message }));
          child.on('close', (status) => resolve({ status, error: null }));
        }),
    ),
  );
}

/** Read the runs file, start the runs and write the results file. */
export async function main([runsFile, resultsFile]) {
  const runs = JSON.parse(readFileSync(runsFile, 'utf8'));
  writeFileSync(resultsFile, JSON.stringify(await runParallel(runs)));
}

if (import.meta.url === pathToFileURL(path.resolve(String(process.argv[1]))).href) {
  await main(process.argv.slice(2));
}
