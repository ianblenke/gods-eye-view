# dev-server-files Specification

## Purpose
Keep the log folder and the cache folder away from the development server. The deny list of the server names both folders.
## Requirements
### Requirement: The development server refuses runtime state files
The browser config of the development server MUST name the folders `.gev-logs` and `.gev-cache` in `server.fs.deny`, so that Vite refuses to serve their files.
It MUST keep the entries for `.env`, `.env.*`, `*.{crt,pem}`, `**/.git/**` and `**/ENVIRONMENT`, and it MUST keep the files of the app available.
Origin: spec-first

#### Scenario: Name the log and cache folders in the deny list `dev-server-files-001`
- **WHEN** a test reads `server.fs.deny` of the browser config
- **THEN** the list holds "**/.gev-logs/**" and "**/.gev-cache/**"
- **AND** the list holds ".env", ".env.*", "*.{crt,pem}", "**/.git/**" and "**/ENVIRONMENT"

#### Scenario: Refuse the files of the folders and load the files of the app `dev-server-files-002`
- **WHEN** a test asks Vite to load ".gev-logs/realtime-conversations.jsonl", ".gev-logs/osh-commands.jsonl", ".gev-cache/adsbdb.json", ".gev-cache/mcp-panel-key", "nested/.gev-logs/x.jsonl", "package.json" or "src/main.js" with the resolved browser config
- **THEN** Vite refuses each of the first five files
- **AND** Vite allows "package.json" and "src/main.js"

