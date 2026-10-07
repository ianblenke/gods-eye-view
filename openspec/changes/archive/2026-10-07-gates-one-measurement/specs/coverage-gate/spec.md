## ADDED Requirements

### Requirement: Trusted measurement for document changes
The command `check --no-measure` MUST run every file gate without tests or trace writes.
The mode trusts the commit of the last ratchet history line for the named change.
Allowed paths start with `openspec/changes/`, `openspec/specs/` or `openspec/trace/`.
The mode compares all tracked and untracked paths with the trusted commit.

Both names of a renamed file must have an allowed path.
Ignored protected files cause refusal, except files under `node_modules/` and `.gev-cache/`.

Ignored protected classes include tests, QA scripts, package metadata, lockfiles, Node version, Makefile, Dockerfiles, compose files and `scripts/spec/`.
The code inventory at the ratchet commit also defines ignored protected paths.
Other ignored files do not cause refusal.
The dependency exception also applies to nested `node_modules/` folders.

The mode MUST refuse with status 2 when protected content differs, history is absent, or Git cannot find the commit.
The mode MUST also refuse when the snapshot is absent or its hash differs from the history hash.

The first refusal line is `NO MEASUREMENT: refused`.
Each changed file has its own line, followed by the trusted commit.
A refusal gives no gate verdict.
The first success line has this form:

```
NO MEASUREMENT: the measurement of commit <hash> is trusted
```

The mode exits with status 0 for success or status 1 for comparison errors.

The mode prints the usual verdict lines and ends its verdict with `Gates passed.` or the error total.
Origin: spec-first

#### Scenario: Trust a changed document `coverage-gate-068`
- **WHEN** only a change document differs from the trusted commit
- **THEN** the mode runs all file gates without tests or trace writes

#### Scenario: Refuse a changed inventory file `coverage-gate-069`
- **WHEN** an inventory file differs from the trusted commit and has a refused path
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed test file `coverage-gate-070`
- **WHEN** a test file differs from the trusted commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed QA script `coverage-gate-071`
- **WHEN** a QA script differs from the trusted commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed package lock `coverage-gate-072`
- **WHEN** `package-lock.json` differs from the trusted commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed Node version `coverage-gate-073`
- **WHEN** `.node-version` differs from the trusted commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed Makefile `coverage-gate-074`
- **WHEN** `Makefile` differs from the trusted commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed Dockerfile `coverage-gate-075`
- **WHEN** a Dockerfile differs from the trusted commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed compose file `coverage-gate-076`
- **WHEN** a compose file differs from the trusted commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a changed gate file `coverage-gate-077`
- **WHEN** a file under `scripts/spec/` differs from the trusted commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse an untracked protected file `coverage-gate-078`
- **WHEN** an untracked file has a protected path
- **THEN** the mode refuses and names the file
- **AND** the mode also refuses a protected file that Git ignores

#### Scenario: Refuse without ratchet history `coverage-gate-079`
- **WHEN** the change has no ratchet history line
- **THEN** the mode refuses because no measurement has a trusted commit

#### Scenario: Refuse a commit that Git cannot find `coverage-gate-080`
- **WHEN** Git cannot find the ratchet commit
- **THEN** the mode refuses and names that commit

#### Scenario: Refuse a changed word list `coverage-gate-081`
- **WHEN** only `openspec/ste/words.json` changes
- **THEN** the mode refuses and names the file

#### Scenario: Refuse an absent measurement snapshot `coverage-gate-082`
- **WHEN** the ratchet snapshot is absent or its hash differs from the history hash
- **THEN** the mode refuses without a verdict

### Requirement: Gate command times
The commands `check`, `ratchet` and `check --no-measure` MUST show times after the first command or trust line.
Use Coordinated Universal Time (UTC).
The start line uses `Started:` and the last line uses `Finished:` with elapsed seconds.
Phases use the names `measure`, `specs`, `compare`, `lint` and `review`.
A phase MUST show its seconds only when its time is more than one second.

The clock MUST accept a test function.
Origin: spec-first

#### Scenario: Show command times `coverage-gate-083`
- **WHEN** a gate command completes with an injected clock
- **THEN** the command shows literal UTC start and finish times and elapsed seconds

#### Scenario: Show slow phase times `coverage-gate-084`
- **WHEN** a phase takes more than one second
- **THEN** the command shows the phase name and seconds

### Requirement: File gates without tests
The document mode MUST check specs, OpenSpec, archived changes, registry, links, ledger against base, STE and reviews.
The mode MUST use current specs and prose with test names and assertions from the trusted snapshot.
The mode MUST keep the runtime, local environment, QA header, coverage filter, source import and coverage comment gates.
Origin: spec-first

#### Scenario: Keep every file gate `coverage-gate-085`
- **WHEN** a document has a fault in specs, links, registry, STE or reviews
- **THEN** the mode reports the fault without tests

### Requirement: Safe Git comparison
The document mode MUST protect package metadata because that file can change how Node loads code.
The mode MUST refuse when Git cannot compare content or list untracked protected files.
Origin: spec-first

#### Scenario: Refuse changed package metadata `coverage-gate-086`
- **WHEN** `package.json` differs from the trusted commit
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a failed Git comparison `coverage-gate-087`
- **WHEN** Git cannot compare content or list untracked protected files
- **THEN** the mode refuses with status 2 and no verdict

### Requirement: Protected names in the image copy
The image copy for document gates MUST keep all untracked protected names outside dependency folders, even when Git excludes those names.
The copy MUST add marker files when the usual image copy omits those names.
The marker files MUST have empty JSON objects instead of source contents.
Origin: spec-first

#### Scenario: Refuse an omitted protected file `coverage-gate-088`
- **WHEN** the image copy omits an ignored protected file
- **THEN** the document copy adds a marker without source contents and the mode refuses

### Requirement: Allowed document paths
The document mode MUST refuse each changed path outside `openspec/changes/`, `openspec/specs/` and `openspec/trace/`.
The path prefixes MUST include the final slash.
Origin: spec-first

#### Scenario: Trust each allowed prefix `coverage-gate-089`
- **WHEN** a file changes under `openspec/changes/archive/`, `openspec/specs/` or `openspec/trace/`
- **THEN** the mode trusts the snapshot

#### Scenario: Refuse other file inputs `coverage-gate-090`
- **WHEN** an agent file, command file, document, workflow, JSON fixture or config file changes outside the allowed paths
- **THEN** the mode refuses and names the file

#### Scenario: Refuse a false prefix `coverage-gate-091`
- **WHEN** a file changes at `openspec/changes-old/x.md`, `openspec/specs.md` or `openspec/other.yaml`
- **THEN** the mode refuses and names the file

#### Scenario: Refuse both rename directions `coverage-gate-092`
- **WHEN** a file moves between an allowed path and another path
- **THEN** the mode refuses and names the path outside the allowed paths

#### Scenario: Refuse a dirty ratchet `coverage-gate-093`
- **WHEN** the ratchet history line has a nonempty `dirty` list
- **THEN** the mode refuses with the reason "The ratchet ran with uncommitted protected files"
- **AND** the mode lists those files even after their content returns to HEAD
