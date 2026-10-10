IMAGE := gods-eye-view:local
RUN_IMAGE := docker run --rm -v "$(CURDIR)":/app -v /app/node_modules -w /app $(IMAGE)
# The gates run on a copy without the files that Git ignores, which is almost the same as CI. Ignored local files,
# such as .env, can change the coverage of the tests. The copy also gets .git.
# Each copy step stops the target when it fails. The container command
# removes the values NODE_ENV, HOST and PORT of the image, which the CI job does not set.
# The gates and ratchet targets copy openspec/trace/ and .gev-cache/spec/ back to the source folder.
# The document gates and precheck targets copy no files back.
GATES_COPY := mkdir -p /tmp/work && cd /src && git ls-files -z --cached --others --exclude-standard > /tmp/listed && git ls-files -z --deleted > /tmp/removed && sort -zu /tmp/listed > /tmp/all && sort -zu /tmp/removed > /tmp/deleted && comm -z -23 /tmp/all /tmp/deleted > /tmp/files && tar --null --verbatim-files-from -T /tmp/files -cf /tmp/copy.tar && tar -xf /tmp/copy.tar -C /tmp/work && cp -a /src/.git /tmp/work/.git && ln -s /app/node_modules /tmp/work/node_modules && mkdir -p /tmp/work/.gev-cache/spec && if [ ! -f /src/.gev-cache/spec/measurement.json ]; then :; else cp /src/.gev-cache/spec/measurement.json /tmp/work/.gev-cache/spec/measurement.json; fi && cd /tmp/work
GATES_BACK := if [ ! -f /tmp/doc-markers ]; then :; else cd /tmp/work && xargs -0 -r rm -f -- < /tmp/doc-markers; fi && rm -rf /src/.gev-cache/spec && cp -a /tmp/work/openspec/trace/. /src/openspec/trace/ && mkdir -p /src/.gev-cache/spec && cp -a /tmp/work/.gev-cache/spec/. /src/.gev-cache/spec/
GATES_DOCS_MARKERS := cd /src && : > /tmp/doc-markers && git ls-files --others -z -- "scripts/spec" "package.json" "package-lock.json" ".node-version" "Makefile" ":(glob)scripts/qa-*.mjs" ":(glob)**/*.test.mjs" ":(glob)**/Dockerfile*" ":(glob)**/*compose*.yaml" ":(glob)**/*compose*.yml" ":(glob)**/*.js" ":(glob)**/*.mjs" ":(glob)**/*.cjs" ":(glob)**/*.ts" ":(glob)**/*.mts" ":(glob)**/*.cts" ":(glob)**/*.jsx" ":(glob)**/*.tsx" ":(glob)**/*.html" ":(glob)**/*.sh" ":(exclude,glob)**/node_modules/**" ":(exclude,glob).gev-cache/**" > /tmp/doc-inputs && xargs -0 -r sh -c "for marker_file do marker_path=/tmp/work/\$$marker_file; if [ ! -e \"\$$marker_path\" ]; then mkdir -p \"\$$(dirname \"\$$marker_path\")\" && printf \"{}\" > \"\$$marker_path\" && printf \"%s\\0\" \"\$$marker_file\" >> /tmp/doc-markers || exit 2; fi; done" markers < /tmp/doc-inputs && cd /tmp/work
GATES := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; if [ "$$1" != ratchet ]; then :; else $(GATES_DOCS_MARKERS) || exit 2; fi; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates

GATES_DOCS := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; $(GATES_DOCS_MARKERS) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"' gates

CHANGE_ARG := $(if $(CHANGE),--change $(CHANGE),)
BASE_ARG := $(if $(BASE),--base $(BASE),)
FROM_ARG := $(if $(FROM),--from $(FROM),)

.PHONY: up up-codex down image ensure-image test gates gates-docs precheck gates-init ratchet adopt lint tree

up:
	docker compose build
	docker compose up --force-recreate

up-codex:
	docker compose -f compose.yaml -f compose.codex.yaml build
	docker compose -f compose.yaml -f compose.codex.yaml up --force-recreate

down:
	docker compose down

image:
	docker compose build

ensure-image:
	@docker image inspect $(IMAGE) >/dev/null 2>&1 || docker compose build

test: ensure-image
	$(RUN_IMAGE) npm test

gates: ensure-image
	$(GATES) check $(CHANGE_ARG) $(BASE_ARG)

gates-docs: ensure-image
	$(GATES_DOCS) check --no-measure $(CHANGE_ARG) $(BASE_ARG)

precheck: ensure-image
	docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; env -u NODE_ENV -u HOST -u PORT sh -c "node scripts/format.mjs --check && node scripts/check-import-directions.mjs && node scripts/check-package-boundaries.mjs && node scripts/check-layer-state-tokens.mjs --base-ref origin/main"'

gates-init: ensure-image
	$(GATES) init $(BASE_ARG)

ratchet: ensure-image
	$(GATES) ratchet $(CHANGE_ARG) $(BASE_ARG)

adopt: ensure-image
	$(GATES) adopt $(CHANGE_ARG) $(BASE_ARG) $(FROM_ARG)


lint: ensure-image
	$(GATES) lint

tree: ensure-image
	$(GATES) tree $(CHANGE_ARG) $(BASE_ARG)
