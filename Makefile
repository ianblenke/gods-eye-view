IMAGE := gods-eye-view:local
RUN_IMAGE := docker run --rm -v "$(CURDIR)":/app -v /app/node_modules -w /app $(IMAGE)
GATES := $(RUN_IMAGE) node scripts/spec/gates.mjs
CHANGE_ARG := $(if $(CHANGE),--change $(CHANGE),)
BASE_ARG := $(if $(BASE),--base $(BASE),)

.PHONY: up down image ensure-image test gates gates-init ratchet stability lint tree

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

stability: ensure-image
	$(GATES) stability $(CHANGE_ARG) $(BASE_ARG)

lint: ensure-image
	$(GATES) lint

tree: ensure-image
	$(GATES) tree $(CHANGE_ARG) $(BASE_ARG)
