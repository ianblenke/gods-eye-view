import { readResponseTextCapped } from '../common/http.js';
import { OSH_REQUEST_TIMEOUT_MS } from '../osh/get.js';

export async function oshPostCommand(fetchImpl, url, { headers, body }) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () =>
      controller.abort(new DOMException('OSH command timeout', 'TimeoutError')),
    OSH_REQUEST_TIMEOUT_MS,
  );
  try {
    const response = await fetchImpl(String(url), {
      method: 'POST',
      redirect: 'manual',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (response.status >= 300 && response.status < 400) {
      void response.body?.cancel?.().catch(() => {});
      const error = new Error('OSH command redirected');
      error.code = 'OSH_REDIRECT';
      error.status = response.status;
      throw error;
    }
    if (response.status !== 204)
      await readResponseTextCapped(response, 64 * 1024, controller.signal);
    return { status: response.status };
  } finally {
    clearTimeout(timeout);
  }
}
