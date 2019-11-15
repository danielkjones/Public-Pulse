.PHONY: db_build, db_run_it, db_run_d, db_kill, db_connect, graph_ql

db_build:
	docker build --rm -f db_wrapper/Dockerfile -t tweet_db:latest .

db_run_i: # Run DB in interactive (crtl+c or make db_kill in a seperate terminal to quit)
	docker run -it --rm --name tweet_db -P tweet_db:latest

db_run_d: # Run DB detached (make db_kill to quit)
	docker run -d --rm --name tweet_db --expose 5432 -p 5432:5432 --net=host tweet_db:latest

db_kill:
	docker kill tweet_db

db_connect:
	docker exec -it tweet_db psql tweet_db --username root

graph_ql:
	npx postgraphile -c postgres://root:password1234@127.0.0.1:5432/tweet_db?ssl=1 --watch