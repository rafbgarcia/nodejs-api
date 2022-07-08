up:
	@docker-compose up -d mongo mongo-express

stop:
	@docker-compose stop mongo mongo-express

start:
	@docker-compose up api

env:
	echo "TOKEN_KEY=super_secret_key" > .env
	echo "MONGO_URI=mongodb://mongo:27017/" >> .env

seed:
	@docker-compose up --build mongo-seed

setup: env up seed
	@docker-compose build api

tests_run:
	@docker-compose exec api npm run test

tests_watch:
	@docker-compose exec api npm run test:watch
