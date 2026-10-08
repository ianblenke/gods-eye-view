## ADDED Requirements

### Requirement: Trusted snapshot for document changes
The command `check --no-measure` MUST run each file check whose result can change under the three allowed paths.
The mode runs no tests and changes no trace files.
The mode trusts the snapshot from the last ratchet history line for the named change.
That line gives the ratchet commit.
An input file is any changed file outside the three allowed paths.

Allowed paths start with `openspec/changes/`, `openspec/specs/` or `openspec/trace/`.
The mode compares all tracked and untracked paths with the ratchet commit.

Both names of a moved file must have an allowed path.
Protected ignored files cause refusal, except files under `node_modules/` and `.gev-cache/`.

A protected ignored file belongs to these classes: tests, QA scripts, package metadata, lockfiles, Node version, Makefile, Dockerfiles, compose files and `scripts/spec/`.
The code inventory at the ratchet commit also defines protected ignored files.
Other ignored files do not cause refusal.

Use the last path part for Dockerfile and compose names.
A Dockerfile name starts with `Dockerfile`.
A compose name has `compose` and ends with `.yaml` or `.yml`.
The dependency exception also applies to nested `node_modules/` folders.

The mode MUST refuse with status 2 when input content differs, history is absent, or Git cannot find the commit.
The mode MUST also refuse when the snapshot is absent or its hash differs from the history hash.

The first refusal line is `NO TEST RUN: refused`.
Each changed file has its own line, followed by `Ratchet commit: <hash>`.
Without a history line, the mode prints `Ratchet commit: none`.
A refusal gives no gate verdict.
The first success line has this form:

```
NO TEST RUN: the mode trusts the snapshot of commit <hash>
```

The mode exits with status 0 for success or status 1 for comparison errors.

The mode prints the usual verdict lines and ends its verdict with `Gates passed.` or the line below.

```
Gates failed with <n> errors.
```
Origin: spec-first

#### Scenario: Trust a changed document `coverage-gate-068`
- **WHEN** only a change document differs from the ratchet commit
- **THEN** the mode runs all file checks without tests or changes to trace files

#### Scenario: Refuse a changed inventory file `coverage-gate-069`
- **WHEN** an inventory file differs from the ratchet commit and has a refused path
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed test file `coverage-gate-070`
- **WHEN** a test file differs from the ratchet commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed QA script `coverage-gate-071`
- **WHEN** a QA script differs from the ratchet commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed package lock `coverage-gate-072`
- **WHEN** `package-lock.json` differs from the ratchet commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed Node version `coverage-gate-073`
- **WHEN** `.node-version` differs from the ratchet commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed Makefile `coverage-gate-074`
- **WHEN** `Makefile` differs from the ratchet commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed Dockerfile `coverage-gate-075`
- **WHEN** a Dockerfile differs from the ratchet commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed compose file `coverage-gate-076`
- **WHEN** a compose file differs from the ratchet commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed gate input file `coverage-gate-077`
- **WHEN** a file under `scripts/spec/` differs from the ratchet commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse an untracked input file `coverage-gate-078`
- **WHEN** an untracked file has an input path
- **THEN** the mode refuses and names the file
- **AND** the mode also refuses a protected ignored file

#### Scenario: Refuse without ratchet history `coverage-gate-079`
- **WHEN** the change has no ratchet history line
- **THEN** the mode refuses because no snapshot has a ratchet commit

#### Scenario: Refuse a commit that Git cannot find `coverage-gate-080`
- **WHEN** Git cannot find the ratchet commit
- **THEN** the mode refuses and names that commit

#### Scenario: Refuse a changed word list `coverage-gate-081`
- **WHEN** only `openspec/ste/words.json` changes
- **THEN** the mode refuses and names the file

#### Scenario: Refuse an absent snapshot `coverage-gate-082`
- **WHEN** the ratchet snapshot is absent or its hash differs from the history hash
- **THEN** the mode refuses without a verdict

### Requirement: Gate command times
The commands `check`, `ratchet` and `check --no-measure` MUST show times after the first command or trust line.
Use Coordinated Universal Time (UTC).
The start line uses `Started:` and the last line uses `Finished:` with elapsed seconds.
Phases use the names `measure`, `specs`, `compare`, `lint` and `review`.
A phase MUST show its seconds only when its time is more than one second.

The clock MUST accept a clock function from a test.
The commands `check` and `ratchet` print time lines; the other commands print none.
Origin: spec-first

#### Scenario: Show command times `coverage-gate-083`
- **WHEN** `check` or `ratchet` completes with an injected clock
- **THEN** the command shows literal UTC start and finish times and elapsed seconds
- **AND** a full check starts with `Command: check`
- **AND** the other commands print no time lines

#### Scenario: Show slow phase times `coverage-gate-084`
- **WHEN** a phase takes more than one second
- **THEN** the command shows the phase name and seconds

### Requirement: File checks without tests
The document mode MUST check specs, OpenSpec, archived changes, registry, links, ledger against base, STE and reviews.
The mode MUST use current specs and prose with test names and assertions from the trusted snapshot.
The mode MUST keep the runtime, local environment, QA header and coverage filter gates.

The mode does not run the source import and coverage comment gates because they read only code files and test files.
The mode refuses changed code files and test files, so those gate results equal the ratchet results.
The coverage filter gate reads tracked `.json`, `.yaml` and `.yml` files under the three allowed paths.
The mode runs that gate.
Origin: spec-first

#### Scenario: Keep every file check `coverage-gate-085`
- **WHEN** a document has a fault in specs, links, registry, STE or reviews
- **THEN** the mode reports the fault without tests
- **AND** a coverage filter option in a tracked `.json` file under the three allowed paths gives `COVERAGE-FLAG`

### Requirement: Safe Git comparison
The document mode MUST protect package metadata because that file can change how Node loads code.
The mode MUST refuse when Git cannot compare content or list untracked input files.
Origin: spec-first

#### Scenario: Refuse changed package metadata `coverage-gate-086`
- **WHEN** `package.json` differs from the ratchet commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a failed Git comparison `coverage-gate-087`
- **WHEN** Git cannot compare content or list untracked input files
- **THEN** the mode refuses with status 2 and no verdict

### Requirement: Protected ignored file names in the container copy
The container copy for document gates MUST keep protected ignored file names outside dependency and cache folders, even when Git excludes those names.
The copy MUST add marker files when the usual container copy omits those names.
The marker files MUST have empty JSON objects instead of source contents.
Origin: spec-first

#### Scenario: Refuse an omitted protected ignored file `coverage-gate-088`
- **WHEN** the container copy omits a protected ignored file
- **THEN** the marker command adds a marker without source contents and the mode refuses

### Requirement: Three allowed paths
The document mode MUST refuse each changed path outside `openspec/changes/`, `openspec/specs/` and `openspec/trace/`.
The path prefixes MUST include the final slash.
Origin: spec-first

#### Scenario: Trust each allowed prefix `coverage-gate-089`
- **WHEN** a file changes under `openspec/changes/archive/`, `openspec/specs/` or `openspec/trace/`
- **THEN** the mode trusts the snapshot

#### Scenario: Refuse other file inputs `coverage-gate-090`
- **WHEN** a file under `docs/`, an agent file, command file, workflow, JSON fixture or config file changes outside the allowed paths
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a false prefix `coverage-gate-091`
- **WHEN** a file changes at `openspec/changes-old/x.md`, `openspec/specs.md` or `openspec/tracex/f.md`
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a prefix inside another path `coverage-gate-098`
- **WHEN** a file changes at `docs/openspec/trace/x.md`, `docs/openspec/changes/x.md` or `src/openspec/specs/x.md`
- **THEN** the mode refuses and names the file

#### Scenario: Refuse files that move in either direction `coverage-gate-092`
- **WHEN** a file moves between an allowed path and another path
- **THEN** the mode refuses and names the path outside the allowed paths

#### Scenario: Refuse a dirty ratchet `coverage-gate-093`
- **WHEN** the ratchet history line has a `dirty` list that is not empty
- **THEN** the mode refuses with the reason "The ratchet ran with input files, code files or test files that differ from HEAD"
- **AND** the mode lists those files even after their content returns to HEAD

### Requirement: Safe cache contents
The marker command MUST exclude `.gev-cache/`.
The container MUST copy only `.gev-cache/spec/` back to the source cache.
The marker command MUST record only the markers that it creates.
The container MUST remove those markers before it copies files back.
The container MUST also copy files back without a marker list.
Origin: spec-first

#### Scenario: Keep cache contents after the ratchet container `coverage-gate-094`
- **WHEN** ignored files under `.gev-cache/` and `openspec/trace/` have source contents
- **THEN** the marker command adds no marker under `.gev-cache/`
- **AND** the container copies only `.gev-cache/spec/` back and keeps the source contents
- **AND** the container removes only created markers before it copies files back
- **AND** the container also copies files back without a marker list

#### Scenario: Stop when the container cannot remove a marker `coverage-gate-097`
- **WHEN** the container cannot remove a created marker
- **THEN** the command stops before it copies files back
- **AND** the source snapshot keeps its contents

### Requirement: Code and tests under allowed paths
The document mode MUST refuse changed code files and test files under the three allowed paths.
The mode checks the file class before the path.
Origin: spec-first

#### Scenario: Refuse code and tests under allowed paths `coverage-gate-095`
- **WHEN** a tracked or untracked code file or test file changes under any of the three allowed paths
- **THEN** the mode refuses and names the file

### Requirement: Ratchet commit hash
The ratchet commit MUST have forty hexadecimal digits.
Origin: spec-first

#### Scenario: Refuse a commit name `coverage-gate-096`
- **WHEN** the history line names a ref instead of a forty-digit commit hash
- **THEN** the mode refuses and names that value

### Requirement: Marker classes
The marker command MUST add a marker for each protected ignored file class and each code extension outside dependency and cache folders.
Origin: spec-first

#### Scenario: Add each marker class `coverage-gate-099`
- **WHEN** one ignored file of each class enters the marker command
- **THEN** the command adds an empty JSON marker for each file
- **AND** the command adds no marker under `.gev-cache/` or `node_modules/`
- **AND** the command names each class with its own pathspec

### Requirement: Current QA capability names
The document mode MUST compare QA capability names with current specs.
Origin: spec-first

#### Scenario: Check QA capability names without tests `coverage-gate-100`
- **WHEN** a QA script names `pending:x` and a document adds `openspec/specs/x/`
- **THEN** the mode reports `QA-COVERS-LANDED`
- **AND** a QA capability name without current specs gives `QA-COVERS-UNKNOWN`
