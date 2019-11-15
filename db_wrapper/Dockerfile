FROM postgres:12

ENV PGDATABASE tweet_db
ENV PGUSER root
ENV PGPASSWORD password1234
ENV PGPORT 5432

COPY ./db_wrapper/sql/V1__Init__.sql /docker-entrypoint-initdb.d/
COPY ./db_wrapper/test/z_test_tweets.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
CMD ["postgres"]