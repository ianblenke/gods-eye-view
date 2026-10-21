import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_IMAGE_BYTES,
  hasImageSignature,
  isImageType,
  mediaTypeOf,
  parseThumbnailUrl,
} from '../../server/providers/skywatch/image.js';

const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPEG = [0xff, 0xd8, 0xff];
const WEBP = [...'RIFF'].map((c) => c.charCodeAt(0));
const WEBP_TAG = [...'WEBP'].map((c) => c.charCodeAt(0));
const bytes = (...parts) => Uint8Array.from(parts.flat());

test('[skywatch-thumbnails-007] accepts an https URL with a host name and no user name, password or port', () => {
  const url = parseThumbnailUrl('https://cdn.example.test/t.png?sig=1');
  assert.equal(url.href, 'https://cdn.example.test/t.png?sig=1');
  assert.equal(
    parseThumbnailUrl('https://cdn.example.test:443/t.png').href,
    'https://cdn.example.test/t.png',
  );
  assert.equal(
    parseThumbnailUrl('https://api.skywatch.co/a/t.png').hostname,
    'api.skywatch.co',
  );
  assert.equal(
    parseThumbnailUrl('https://localhost.example.test/t.png').hostname,
    'localhost.example.test',
  );
});

test('[skywatch-thumbnails-007] refuses a text that is not an absolute URL, another scheme, a user name, a password and a port', () => {
  for (const text of [
    'not a url',
    '/relative/t.png',
    '',
    'http://cdn.example.test/t.png',
    'ftp://cdn.example.test/t.png',
    'https://user@cdn.example.test/t.png',
    'https://:secret@cdn.example.test/t.png',
    'https://cdn.example.test:8443/t.png',
  ]) {
    assert.equal(parseThumbnailUrl(text), null, text);
  }
  assert.equal(parseThumbnailUrl(undefined), null);
  assert.equal(parseThumbnailUrl(42), null);
});

test('[skywatch-thumbnails-007] refuses an IP address, localhost and a name that ends with .localhost', () => {
  for (const text of [
    'https://127.0.0.1/t.png',
    'https://10.0.0.1/t.png',
    'https://127.0.0.1./t.png',
    'https://[::1]/t.png',
    'https://[2001:db8::1]/t.png',
    'https://2130706433/t.png',
    'https://0x7f.1/t.png',
    'https://localhost/t.png',
    'https://LOCALHOST/t.png',
    'https://localhost./t.png',
    'https://a.localhost/t.png',
    'https://a.localhost./t.png',
  ]) {
    assert.equal(parseThumbnailUrl(text), null, text);
  }
});

test('[skywatch-thumbnails-009] reads the media type before the first semicolon, trimmed and in lower case', () => {
  assert.equal(mediaTypeOf('image/png'), 'image/png');
  assert.equal(mediaTypeOf('Image/PNG; charset=x'), 'image/png');
  assert.equal(mediaTypeOf('image/png ;x'), 'image/png');
  assert.equal(mediaTypeOf(' image/jpeg '), 'image/jpeg');
  assert.equal(mediaTypeOf(null), '');
  assert.equal(mediaTypeOf(''), '');
});

test('[skywatch-thumbnails-009] accepts only the media types image/png, image/jpeg and image/webp', () => {
  for (const type of ['image/png', 'image/jpeg', 'image/webp']) {
    assert.equal(isImageType(type), true, type);
  }
  for (const type of [
    'image/svg+xml',
    'text/html',
    'image/gif',
    '',
    'image/png ',
    'IMAGE/PNG',
  ]) {
    assert.equal(isImageType(type), false, type);
  }
  assert.equal(MAX_IMAGE_BYTES, 1048576);
});

test('[skywatch-thumbnails-009] checks the first bytes of each type', () => {
  assert.equal(hasImageSignature('image/png', bytes(PNG)), true);
  assert.equal(hasImageSignature('image/png', bytes(PNG, [0, 1, 2])), true);
  assert.equal(hasImageSignature('image/png', bytes(PNG.slice(0, 7))), false);
  assert.equal(hasImageSignature('image/png', bytes(JPEG, [0])), false);
  assert.equal(
    hasImageSignature('image/png', bytes([0x88], PNG.slice(1))),
    false,
  );
  assert.equal(
    hasImageSignature('image/png', bytes(PNG.slice(0, 7), [0])),
    false,
  );
  assert.equal(hasImageSignature('image/jpeg', bytes(JPEG)), true);
  assert.equal(hasImageSignature('image/jpeg', bytes(JPEG, [0xe0])), true);
  assert.equal(hasImageSignature('image/jpeg', bytes([0xff, 0xd8])), false);
  assert.equal(
    hasImageSignature('image/jpeg', bytes([0xff, 0xd8, 0xfe])),
    false,
  );
  assert.equal(hasImageSignature('image/jpeg', bytes(PNG)), false);
  assert.equal(hasImageSignature('image/jpeg', bytes([])), false);
});

test('[skywatch-thumbnails-009] checks RIFF in the first 4 bytes and WEBP in the 9th to the 12th byte', () => {
  const size = [0x24, 0, 0, 0];
  assert.equal(
    hasImageSignature('image/webp', bytes(WEBP, size, WEBP_TAG)),
    true,
  );
  assert.equal(
    hasImageSignature('image/webp', bytes(WEBP, size, WEBP_TAG, [0x56])),
    true,
  );
  assert.equal(
    hasImageSignature('image/webp', bytes(WEBP, size, WEBP_TAG.slice(0, 3))),
    false,
  );
  assert.equal(
    hasImageSignature('image/webp', bytes(WEBP, [0, 0, 0], WEBP_TAG, [0])),
    false,
  );
  assert.equal(
    hasImageSignature(
      'image/webp',
      bytes([0x52, 0x49, 0x46, 0x47], size, WEBP_TAG),
    ),
    false,
  );
  assert.equal(
    hasImageSignature(
      'image/webp',
      bytes(WEBP, size, [0x57, 0x45, 0x42, 0x51]),
    ),
    false,
  );
  assert.equal(hasImageSignature('image/webp', bytes(PNG, PNG)), false);
  assert.equal(hasImageSignature('image/gif', bytes(PNG)), false);
});
