.PHONY: up down

up:
	docker compose build
	docker compose up --force-recreate

down:
	docker compose down
