import { admitSameSiteRequest } from '../../../src/localRequestGate.mjs';

/**
 * Whether a request passes `admitSameSiteRequest()`. The protocol is `https:`
 * for an encrypted socket and `http:` for another socket, as in
 * `admitSameSite()`.
 * @param {import('node:http').IncomingMessage} req
 * @returns {boolean}
 */
export function isSameSite(req) {
  return admitSameSiteRequest({
    hostHeader: req.headers.host,
    protocol: req.socket.encrypted ? 'https:' : 'http:',
    origin: req.headers.origin,
    secFetchSite: req.headers['sec-fetch-site'],
    proxyHeaders: req.headers,
  }).ok;
}
