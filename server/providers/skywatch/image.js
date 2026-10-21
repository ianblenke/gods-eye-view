/** Checks of a SkyWatch thumbnail: the URL before the request, and the image after it. Nothing in this file sends a request. */

export const MAX_IMAGE_BYTES = 1_048_576;
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const IPV4 = /^\d+\.\d+\.\d+\.\d+$/;
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG = [0xff, 0xd8, 0xff];
const RIFF = [0x52, 0x49, 0x46, 0x46];
const WEBP = [0x57, 0x45, 0x42, 0x50];

/**
 * The parsed thumbnail URL, or null. The URL must have the scheme `https:`,
 * no user name, no password and no port. Its host name, with one dot at its
 * end removed, must not be an IP address, `localhost` or a name below
 * `localhost`.
 * @param {unknown} text
 * @returns {URL|null}
 */
export function parseThumbnailUrl(text) {
  let url;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  if (
    url.protocol !== 'https:' ||
    url.username !== '' ||
    url.password !== '' ||
    url.port !== ''
  ) {
    return null;
  }
  const host = url.hostname.replace(/\.$/, '');
  if (IPV4.test(host) || host.startsWith('[')) return null;
  if (host === 'localhost' || host.endsWith('.localhost')) return null;
  return url;
}

/** The media type of a Content-Type header: the text before the first `;`, trimmed, in lower case. */
export function mediaTypeOf(header) {
  return String(header ?? '')
    .split(';')[0]
    .trim()
    .toLowerCase();
}

/** True for `image/png`, `image/jpeg` and `image/webp`. */
export const isImageType = (type) => IMAGE_TYPES.has(type);

const hasBytesAt = (bytes, expected, offset) =>
  expected.every((value, index) => bytes[offset + index] === value);

/** True when the first bytes show the media type. */
export function hasImageSignature(type, bytes) {
  switch (type) {
    case 'image/png':
      return hasBytesAt(bytes, PNG, 0);
    case 'image/jpeg':
      return hasBytesAt(bytes, JPEG, 0);
    case 'image/webp':
      return hasBytesAt(bytes, RIFF, 0) && hasBytesAt(bytes, WEBP, 8);
    default:
      return false;
  }
}
