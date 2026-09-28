export function createOshControlClient({ fetchImpl }) {
  async function request(path, options) {
    const response = await fetchImpl(path, options);
    return response.json();
  }
  return {
    async targets(systemId) {
      return request(
        `/api/control/osh/targets?system=${encodeURIComponent(systemId)}`,
      );
    },
    async send(body) {
      return request('/api/control/osh/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    },
  };
}
