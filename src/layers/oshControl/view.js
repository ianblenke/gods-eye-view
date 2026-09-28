export function createOshCommandView({ host, client, documentImpl }) {
  let generation = 0;
  let timer = null;
  let target = null;
  let systemName = '';
  let confirmation = null;
  let busy = false;

  function element(tag, text = '') {
    const node = documentImpl.createElement(tag);
    node.textContent = text;
    return node;
  }

  function closeConfirmation() {
    if (timer) clearTimeout(timer);
    timer = null;
    confirmation = null;
    render();
  }

  function render() {
    if (!target) {
      host.replaceChildren();
      host.hidden = true;
      return;
    }
    host.hidden = false;
    const content = [element('div', `${systemName} (${target.system})`)];
    for (const [command, definition] of Object.entries(target.commands)) {
      const row = element('div');
      const inputs = {};
      for (const [name, field] of Object.entries(definition.fields)) {
        const label = element(
          'label',
          `${name}${field.unit ? ` (${field.unit})` : ''}`,
        );
        const input = element(field.type === 'boolean' ? 'select' : 'input');
        if (field.type === 'boolean') {
          const falseOption = element('option', 'false');
          falseOption.value = 'false';
          const trueOption = element('option', 'true');
          trueOption.value = 'true';
          input.append(falseOption, trueOption);
        }
        input.value = field.type === 'boolean' ? 'false' : String(field.min);
        if (field.type === 'number') {
          input.type = 'number';
          input.min = field.min;
          input.max = field.max;
        }
        label.append(input);
        row.append(label);
        inputs[name] = input;
      }
      const button = element('button', command);
      button.disabled = busy;
      button.addEventListener('click', () => {
        if (busy) return;
        const parameters = Object.fromEntries(
          Object.entries(definition.fields).map(([name, field]) => [
            name,
            field.type === 'boolean'
              ? inputs[name].value === 'true'
              : Number(inputs[name].value),
          ]),
        );
        confirmation = { command, parameters };
        render();
      });
      row.append(button);
      content.push(row);
    }
    if (confirmation) {
      const { command, parameters } = confirmation;
      const fields = target.commands[command].fields;
      const values = Object.entries(parameters)
        .map(
          ([name, value]) =>
            `${name}: ${value}${fields[name].unit ? ` ${fields[name].unit}` : ''}`,
        )
        .join(', ');
      content.push(
        element('div', `${systemName} (${target.system}) ${command} ${values}`),
      );
      const cancel = element('button', 'Cancel');
      cancel.addEventListener('click', closeConfirmation);
      const send = element('button', 'Send command');
      send.addEventListener('click', async () => {
        if (!confirmation || busy) return;
        busy = true;
        const current = generation;
        const body = { system: target.system, command, parameters };
        render();
        try {
          const result = await client.send(body);
          if (current === generation) {
            closeConfirmation();
            host.append(
              element(
                'div',
                result.outcome === 'refused' ? result.reason : result.outcome,
              ),
            );
          }
        } catch {
          if (current === generation) {
            closeConfirmation();
            host.append(element('div', 'failed'));
          }
        } finally {
          busy = false;
        }
      });
      send.disabled = busy;
      content.push(send, cancel);
      if (!timer) timer = setTimeout(closeConfirmation, 30_000);
      host.replaceChildren(...content);
      cancel.focus();
      return;
    }
    host.replaceChildren(...content);
  }

  return {
    async show({ systemId, systemName: name }) {
      generation += 1;
      if (timer) clearTimeout(timer);
      timer = null;
      confirmation = null;
      target = null;
      systemName = name || systemId;
      render();
      const current = generation;
      const result = await client.targets(systemId).catch(() => null);
      if (current !== generation || !result) return;
      target =
        result.enabled && Object.keys(result.commands).length
          ? { system: systemId, commands: result.commands }
          : null;
      render();
    },
    clear() {
      generation += 1;
      if (timer) clearTimeout(timer);
      timer = null;
      confirmation = null;
      target = null;
      render();
    },
  };
}
