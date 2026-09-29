function resourceUrl(root, path) {
  const url = new URL(path, root);
  if (
    url.origin !== root.origin ||
    !url.pathname.startsWith(root.pathname) ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  )
    throw new Error('Unsafe OSH control URL');
  return url;
}

export function oshControlStreamsUrl(root, system) {
  return resourceUrl(
    root,
    `systems/${encodeURIComponent(system)}/controlstreams`,
  );
}

export function oshControlSchemaUrl(root, id) {
  return resourceUrl(root, `controlstreams/${encodeURIComponent(id)}/schema`);
}

export function oshCommandUrl(root, controlStreamId) {
  return resourceUrl(
    root,
    `controlstreams/${encodeURIComponent(controlStreamId)}/commands`,
  );
}

export function assertCommandUrl(url, root, controlStreamId) {
  const expected = `${root.pathname}controlstreams/${encodeURIComponent(controlStreamId)}/commands`;
  if (
    url.origin !== root.origin ||
    url.pathname !== expected ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    root.username ||
    root.password
  )
    throw new Error('Unsafe OSH command URL');
}
