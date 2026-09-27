export function createOshControlClient({ fetchImpl }) {
  async function request(path, options) {
    const response = await fetchImpl(path, options);
    return response.json();
  }
  return {
    async targets() {
      return request('/api/control/osh/targets');
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
