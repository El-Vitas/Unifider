.PHONY: run stop network

CLIENT_COMPOSE_FILE = ./client/docker-compose.yml
SERVER_COMPOSE_FILE = ./server/docker-compose.yml

run: network
	docker-compose -f $(CLIENT_COMPOSE_FILE) up -d
	docker-compose -f $(SERVER_COMPOSE_FILE) up -d

stop:
	docker-compose -f $(CLIENT_COMPOSE_FILE) down
	docker-compose -f $(SERVER_COMPOSE_FILE) down

network:
	docker network inspect unifider_network >/dev/null 2>&1 || docker network create unifider_network
