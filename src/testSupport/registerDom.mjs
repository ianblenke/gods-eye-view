import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Import first in a test file whose modules load Vue at import time: Vue binds
// the document when it loads. Each test file runs in its own process.
GlobalRegistrator.register({ url: 'http://localhost/' });

// Vue starts a three second timer for a late devtools hook in any window that
// looks like a real browser. The timer is still live when a test process ends,
// and the gate reports it as a leak. Vue skips the timer for a user agent that
// names jsdom (vuejs/core#4815), so the test window says so.
Object.defineProperty(globalThis.navigator, 'userAgent', {
  configurable: true,
  value: `${globalThis.navigator.userAgent} jsdom`,
});
