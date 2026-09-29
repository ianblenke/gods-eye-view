/** Find the first camera with the selected system's first number. */
export function findLinkedCameraSystem({ selectedId, selectedName, systemRecords }) {
  const number = selectedName?.match(/\d+/)?.[0];
  if (!number) return null;
  for (const record of systemRecords) {
    if (!record.name || record.id === selectedId) continue;
    if (record.name.match(/\d+/)?.[0] === number && /camera/i.test(record.name))
      return record;
  }
  return null;
}
