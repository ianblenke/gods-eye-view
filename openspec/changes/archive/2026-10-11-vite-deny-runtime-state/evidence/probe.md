# Requests to a scratch server

The lead built a harness: a real Vite dev server on 127.0.0.1 with the browser config and a scratch project folder that holds canary files. Each canary file has a text that starts with `CANARY-`. The file `probe-server.txt` is the harness. The control variant `base` removes the two new entries, so every request form must leak the canary there.
The harness never touched the real app on port 4173.

## Encoding and normalization forms (run by the lead)

The file `probe-encodings.txt` sends 39 request paths with a raw HTTP client that does not normalize the path. The paths use percent codes, double percent codes, repeated slashes, dot segments, null bytes, spaces, semicolons, query strings, backslashes and an absolute-form request line.
The result: the new config leaked 0 times, and the base config leaked the canary 19 times. The other 20 paths give the index page on both servers, because they do not name a real file.

## Four attack families (run by agents)

Four agents attacked the same harness in parallel. One of them was stopped by a safety classifier before it sent a request, and the lead ran its forms (above).

- **Vite routes and suffixes:** The new entries blocked every form that the agent tried. The forms were `/@fs/` paths with plain, encoded and double-encoded codes, and the suffixes `?raw`, `?url`, `?import`, `?inline`, `?worker`, `?direct` and `?html-proxy`. They also included extension tricks, a module that imports the log file, HEAD requests and Range requests. Every form leaked on the base server.
- **Case, links and file-system rules:** Upper and mixed case reach no file on Linux, and the glob also ignores case. Names such as `.gev-logs-old` are not blocked, on purpose. A symlink or a hard link that points to a protected file, and a file under the `public` folder, are served. The base server serves them too. Vite matches the deny glob against the request path and not against the real file, and it skips the deny check for the `public` folder.
- **Sweep for other files:** The agent drove the real log writers and the real panel key writer into the scratch folders. The new config refused all three files, and the base config served the real records. The sweep also found older names that the server still serves. They are `.env~`, `ENVIRONMENT.bak` and two temp files of the credential writer: `..env.<8 hex>.tmp` and `.ENVIRONMENT.<8 hex>.tmp`. The writer keeps a temp file for a few milliseconds.

## Checks of the lead on the older names

The lead asked Vite with `isFileLoadingAllowed`. The names `.env~`, `..env.deadbeef.tmp`, `pinokio/ENVIRONMENT.bak` and `pinokio/.ENVIRONMENT.deadbeef.tmp` are allowed. The names `.env.bak`, `.env.swp` and `.env.deadbeef.tmp` are denied. The temp name comes from `server/standalone/key-setup.js` line 198.

## What this shows and what it does not show

The two new entries hold against every request form for the two folders. The two inherent limits of Vite and the older names are in the Known limits of the proposal. The agents could not check a case-insensitive file system or Windows. The full reports of the agents are in `probe-agents.txt`.
