## 1. Specs and tests

- [x] 1.1 Write the delta before the tests.

- [x] 1.2 Add tests for `voice-panel-001`.

  Mutation: `S001` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

  ```json

  ```

{"old": "throw new TypeError('runAction is required');", "new": "throw new TypeError('wrong');"}

````

- [x] 1.3 Add tests for `voice-panel-002`.

Mutation: `A005-no` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

```json
{"old": "originalOptions == null\n          ? {}\n          : Object.getOwnPropertyDescriptors(originalOptions)", "new": "({})"}
````

- [x] 1.4 Add tests for `voice-panel-003`.

  Mutation: `S003` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

  ```json

  ```

{"old": "() => settle('fulfilled'),", "new": "() => settle('rejected'),"}

````

- [x] 1.5 Add tests for `voice-panel-004`.

Mutation: `S004` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

```json
{"old": "key: Object.freeze({}),", "new": "key: null,"}
````

- [x] 1.6 Add tests for `voice-panel-005`.

  Mutation: `A003-yes` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

  ```json

  ```

{"old": "typeof args[0] === 'string' ? args[0] : undefined", "new": "(undefined)"}

````

- [x] 1.7 Add tests for `voice-panel-006`.

Mutation: `S006` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

```json
{"old": "const callerSignal = descriptors.signal?.value;", "new": "const callerSignal = originalOptions?.signal;"}
````

- [x] 1.8 Add tests for `voice-panel-007`.

  Mutation: `S007` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

  ```json

  ```

{"old": "record.abort = () => retireOne(record, 'caller-aborted');", "new": "record.abort = () => {};"}

````

- [x] 1.9 Add tests for `voice-panel-008`.

Mutation: `S008` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

```json
{"old": "if (disposed) return Reflect.apply(runAction, this, args);", "new": "if (disposed) return Reflect.apply(runAction, null, args);"}
````

- [x] 1.10 Add tests for `voice-panel-009`.

  Mutation: `A006-left` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

  ```json

  ```

{"old": "originalOptions !== undefined &&\n originalOptions !== null &&\n (prototype === Object.prototype || prototype === null) &&\n dataOnly &&\n (originalProgress == null || typeof originalProgress === 'function')", "new": "(originalProgress == null || typeof originalProgress === 'function')"}

````

- [x] 1.11 Add tests for `voice-panel-010`.

Mutation: `A011-left` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

```json
{"old": "originalProgress == null || typeof originalProgress === 'function'", "new": "(typeof originalProgress === 'function')"}
````

- [x] 1.12 Add tests for `voice-panel-011`.

  Mutation: `A003-yes` changes `src/voice/panel/actionObserver.js` as shown below. The test must fail.

  ```json

  ```

{"old": "typeof args[0] === 'string' ? args[0] : undefined", "new": "(undefined)"}

````

- [x] 1.13 Add tests for `voice-panel-067`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.14 Add tests for `voice-panel-012`.

  Mutation: `S012` changes `src/voice/control.js` as shown below. The test must fail.

  ```json

  ```

{"old": "aria-controls=\"gev-voice-panel\"", "new": "aria-controls=\"wrong-panel\""}

````

- [x] 1.15 Add tests for `voice-panel-013`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.16 Add tests for `voice-panel-014`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.17 Add tests for `voice-panel-015`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.18 Add tests for `voice-panel-016`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.19 Add tests for `voice-panel-017`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.20 Add tests for `voice-panel-018`.

  Mutation: `S018` changes `src/voice/panel/manualPanel.js` as shown below. The test must fail.

  ```json

  ```

{"old": "const ROW_GRACE_MS = 700;", "new": "const ROW_GRACE_MS = 699;"}

````

- [x] 1.21 Add tests for `voice-panel-019`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.22 Add tests for `voice-panel-020`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.23 Add tests for `voice-panel-021`.

Mutation: `S021` changes `src/voice/panel/preferences.js` as shown below. The test must fail.

```json
{"old": "(parseMinutes(rawMinutes) ?? 5)", "new": "(parseMinutes(rawMinutes) ?? 6)"}
````

- [x] 1.24 Add tests for `voice-panel-022`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.25 Add tests for `voice-panel-023`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.26 Add tests for `voice-panel-024`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.27 Add tests for `voice-panel-025`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.28 Add tests for `voice-panel-026`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.29 Add tests for `voice-panel-027`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.30 Add tests for `voice-panel-028`.

  Mutation: `S028` changes `src/voice/panel/preferences.js` as shown below. The test must fail.

  ```json

  ```

{"old": "const snapshot = () => ({ ...state });", "new": "const snapshot = () => state;"}

````

- [x] 1.31 Add tests for `voice-panel-029`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.32 Add tests for `voice-panel-030`.

  Mutation: `S030` changes `src/voice/panel/inactivity.js` as shown below. The test must fail.

  ```json

  ```

{"old": "deadline = now() + minutes * 60000;", "new": "deadline = now() + minutes * 30000;"}

````

- [x] 1.33 Add tests for `voice-panel-031`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.34 Add tests for `voice-panel-032`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.35 Add tests for `voice-panel-033`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.36 Add tests for `voice-panel-034`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.37 Add tests for `voice-panel-065`.

Mutation: `S065` changes `src/voice/panel/inactivity.js` as shown below. The test must fail.

```json
{"old": "if (!minutes || disposed) return;", "new": "if (disposed) return;"}
````

- [x] 1.38 Add tests for `voice-panel-035`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.39 Add tests for `voice-panel-036`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.40 Add tests for `voice-panel-037`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.41 Add tests for `voice-panel-038`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.42 Add tests for `voice-panel-039`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.43 Add tests for `voice-panel-040`.

Mutation: `S040` changes `src/voice/panel/nativeActivity.js` as shown below. The test must fail.

```json
{"old": "const result = Reflect.apply(original, this, args);", "new": "const result = Reflect.apply(original, null, args);"}
````

- [x] 1.44 Add tests for `voice-panel-041`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.45 Add tests for `voice-panel-042`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.46 Add tests for `voice-panel-043`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.47 Add tests for `voice-panel-044`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.48 Add tests for `voice-panel-045`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.49 Add tests for `voice-panel-046`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.50 Add tests for `voice-panel-047`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.51 Add tests for `voice-panel-048`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.52 Add tests for `voice-panel-049`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.53 Add tests for `voice-panel-050`.

Mutation: `A023-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "!dead && !disposed && current === binding && !session.disposed", "new": "(!dead && !disposed && current === binding)"}
````

- [x] 1.54 Add tests for `voice-panel-051`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.55 Add tests for `voice-panel-052`.

Mutation: `A019-left` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "disposed || !ui.voicePanel || !card?.setEnabled || !card?.setPresented", "new": "(!card?.setPresented)"}
````

- [x] 1.56 Add tests for `voice-panel-053`.

  Mutation: `A031-left` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "owns() && stamp === revision && epoch === operationEpoch", "new": "(epoch === operationEpoch)"}

````

- [x] 1.57 Add tests for `voice-panel-054`.

Mutation: `A022-left` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "!owns() || !session.isActive()", "new": "(!session.isActive())"}
````

- [x] 1.58 Add tests for `voice-panel-055`.

  Mutation: `S055` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "if (\n finalTranscript &&", "new": "if (\n false &&"}

````

- [x] 1.59 Add tests for `voice-panel-056`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.60 Add tests for `voice-panel-057`.

  Mutation: `S057` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "if (!(event.type === 'interruption' && event.preserveAdvisoryCaption))", "new": "if (true)"}

````

- [x] 1.61 Add tests for `voice-panel-058`.

Mutation: `A022-left` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "!owns() || !session.isActive()", "new": "(!session.isActive())"}
````

- [x] 1.62 Add tests for `voice-panel-066`.

  Mutation: `S066` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "t('Automatic stop is unavailable for this voice connection.')", "new": "''"}

````

- [x] 1.63 Add tests for `voice-panel-059`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

- [x] 1.64 Add tests for `voice-panel-060`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.65 Add tests for `voice-panel-061`.

Mutation: `S061` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "result = preferences.setMinutes(value);", "new": "result = preferences.setMinutes(value + 1);"}
````

- [x] 1.66 Add tests for `voice-panel-062`.

  Mutation: `S062` changes `src/voice/gevActions.js` as shown below. The test must fail.

  ```json

  ```

{"old": "const voiceUnavailable = (action) => ({\n ok: false,\n action,\n applied: false,\n unavailable: true,", "new": "const voiceUnavailable = (action) => ({\n ok: false,\n action,\n applied: false,\n unavailable: false,"}

````

- [x] 1.67 Add tests for `voice-panel-063`.

Mutation: `S063` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "owns() && stamp === revision && epoch === operationEpoch", "new": "owns()"}
````

- [x] 1.68 Add tests for `voice-panel-064`.

  Mutation: `S064` changes `src/voice/gevActions.js` as shown below. The test must fail.

  ```json

  ```

{"old": " button.click();\n // Opening", "new": " // Opening"}

````

- [x] 1.69 Add tests for `voice-panel-068`.

Mutation: `A026-yes` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "nativeProvider === 'openai' || nativeProvider === 'gemini'\n            ? ''\n            : t('Automatic stop is unavailable for this voice connection.')", "new": "(t('Automatic stop is unavailable for this voice connection.'))"}
````

- [x] 1.70 Add tests for `voice-panel-069`.

  Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

  ```json

  ```

{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}

````

- [x] 1.71 Add tests for `voice-panel-070`.

Mutation: `A036-right` changes `src/voice/panel/host.js` as shown below. The test must fail.

```json
{"old": "event.type !== 'state' && !session.isActive()", "new": "(event.type !== 'state')"}
````

## 2. Host checks

- [x] 2.1 Check the decisions and keys with mutations.

- [x] 2.2 Measure each scope file with host coverage.

- [x] 2.3 Check each test title and assertion method.

- [x] 2.4 Format the scope test files.

- [x] 2.5 Check the repository format.

- [x] 2.6 Check the STE prose.

## 3. Gates and review

- [ ] 3.1 Commit the scope tests.

- [ ] 3.2 Run `make ratchet CHANGE=backfill-voice-panel`.

- [ ] 3.3 Read the ratchet verdict.

- [ ] 3.4 Archive the change.

- [ ] 3.5 Run both formal review agents.

- [ ] 3.6 Record both reviews in `review.md`.

- [ ] 3.7 Run `make gates CHANGE=backfill-voice-panel`.

- [ ] 3.8 Commit the change and trace files.
