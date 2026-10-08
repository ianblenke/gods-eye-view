## Source

Base commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.
No current specification names Ontario or the CCTV source packs.
Use the live-sources capability for the new transport requirement. Do not change an old requirement sentence.

## Key decision

Use `ONTARIO_511_API_KEY` beside the CCTV Ontario variables in `.env.example`.
Read it only on the server. Use URLSearchParams for the documented `key` parameter.

Keep the catalog entry enabled. Add no source pack.
Use a server helper for the request and fixed warning text for each error.
The helper records one warning per process for absent keys and one for request errors.
The source loader keeps its camera row logic.

## Health decision

The layer health map holds per-camera rows. The catalog has no pack status field.
An absent key supplies no camera row. Do not add a new health interface in this change.

## Documents

Correct DATA_SOURCES.md, .env.example, SECURITY.md, CHANGELOG.md and docs/CURRENT-STATE.md.
README.md calls the CCTV layer keyless because other packs have no key. Add the Ontario key detail beside that table.
The public page gives no price. State that price limit beside the owner decision about a free key.

## Checks

Use fixtures only. Test the key, absent keys, HTTP errors and thrown errors.
Run named mutations and the automatic mutation tool on changed lines.
Measure each changed code file on the host. Run each CCTV test file in one process before and after.

Run the STE lint after each edit group. The image checks belong to the lead.
The CCTV browser QA purpose stays the same: camera markers and feeds work in the browser.
