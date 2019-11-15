.PHONY: db_build, db_run_it, db_run_d, db_kill

db_build:
	docker build --rm -f db_wrapper/Dockerfile -t tweet_db:latest .

db_run_i: # Run DB in interactive (crtl+c or make db_kill in a seperate terminal to quit)
	docker run --rm --name tweet_db -it tweet_db:latest

db_run_d: # Run DB detached (make db_kill to quit)
	docker run --rm --name tweet_db -d tweet_db:latest

db_kill:
	docker kill tweet_db