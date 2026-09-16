IMAGE := gods-eye-view:local
RUN_IMAGE := docker run --rm -v "$(CURDIR)":/app -v /app/node_modules -w /app $(IMAGE)
# The gates run on a copy without the files that Git ignores, which is almost the same as CI. Ignored local files,
# such as .env, can change the coverage of the tests. The copy also gets .git.
# Each copy step stops the target when it fails. The container command
# removes the values NODE_ENV, HOST and PORT of the image, which the CI job does not set. The
# gates write openspec/trace/ and .gev-cache/, so the target copies these folders back.
GATES_COPY := mkdir -p /tmp/work && cd /src && git ls-files -z --cached --others --exclude-standard > /tmp/listed && git ls-files -z --deleted > /tmp/removed && sort -zu /tmp/listed > /tmp/all && sort -zu /tmp/removed > /tmp/deleted && comm -z -23 /tmp/all /tmp/deleted > /tmp/files && tar --null --verbatim-files-from -T /tmp/files -cf /tmp/copy.tar && tar -xf /tmp/copy.tar -C /tmp/work && cp -a /src/.git /tmp/work/.git && ln -s /app/node_modules /tmp/work/node_modules && mkdir -p /tmp/work/.gev-cache && cd /tmp/work
GATES_BACK := rm -rf /src/.gev-cache/spec && cp -a /tmp/work/openspec/trace/. /src/openspec/trace/ && mkdir -p /src/.gev-cache && cp -a /tmp/work/.gev-cache/. /src/.gev-cache/
GATES := docker run --rm -v "$(CURDIR)":/src $(IMAGE) sh -c '$(GATES_COPY) || exit 2; env -u NODE_ENV -u HOST -u PORT node scripts/spec/gates.mjs "$$@"; status=$$?; $(GATES_BACK) || exit 2; exit $$status' gates

CHANGE_ARG := $(if $(CHANGE),--change $(CHANGE),)
BASE_ARG := $(if $(BASE),--base $(BASE),)

.PHONY: up down image ensure-image test gates gates-init ratchet lint tree

up:
	docker compose build
	docker compose up --force-recreate

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

gates-init: ensure-image
	$(GATES) init $(BASE_ARG)

ratchet: ensure-image
	$(GATES) ratchet $(CHANGE_ARG) $(BASE_ARG)


lint: ensure-image
	$(GATES) lint

tree: ensure-image
	$(GATES) tree $(CHANGE_ARG) $(BASE_ARG)
