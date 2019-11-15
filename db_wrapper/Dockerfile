FROM postgres:12

ENV POSTGRES_DB tweet_db
ENV POSTGRES_USER root
ENV POSTGRES_PASSWORD password1234

COPY ./db_wrapper/sql/V1__Init__.sql /docker-entrypoint-initdb.d/
COPY ./db_wrapper/test/z_test_tweets.sql /docker-entrypoint-initdb.d/

EXPOSE 5432