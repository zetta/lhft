
.PHONY: publish
publish: build-backend build-frontend
	docker push zettacio/lhft-server:latest
	docker push zettacio/lhft-web-gui:latest

.PHONY: build-backend
build-backend:
	(cd backend && \
	docker build -t zettacio/lhft-server:latest . )

.PHONY: build-frontend
build-frontend:
	(cd frontend && \
	docker build -t zettacio/lhft-web-gui:latest . )

.PHONY: start
start:
	docker-compose up
