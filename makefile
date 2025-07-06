.PHONY: run stop network

CLIENT_COMPOSE_FILE = ./client/docker-compose.yml
SERVER_COMPOSE_FILE = ./server/docker-compose.yml

run: network parallel_services

stop:
	docker-compose -f $(CLIENT_COMPOSE_FILE) down
	docker-compose -f $(SERVER_COMPOSE_FILE) down

frontend:
	docker-compose -f $(CLIENT_COMPOSE_FILE) up -d

backend:
	docker-compose -f $(SERVER_COMPOSE_FILE) up -d

network:
	docker network inspect unifider_network >/dev/null 2>&1 || docker network create unifider_network

parallel_services:
	$(MAKE) frontend & \
	$(MAKE) backend & \
	wait
