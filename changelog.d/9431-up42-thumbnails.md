- Add the UP42 thumbnail route for scenes in kept answers. It stays off by default until `UP42_THUMBNAILS=true`.
  The server checks the image type, size and first bytes, and keeps credentials private.
  It keeps at most 32 images in RAM, each for less than ten minutes, and allows 30 requests per minute.
  UP42 display terms remain unconfirmed. No live call checks the image format.
