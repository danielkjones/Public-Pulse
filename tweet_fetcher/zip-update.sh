#!/bin/bash

ZIP_FILE='tweet_fetcher_package.zip'
ZIP_FOLDER='tweet_fetcher_package'

cp lambda.py query.py lambda_configs.py aws_services.py twitter_fetching.py tweet_fetcher_package/
cp -r configs tweet_fetcher_package/configs/
cp -r psycopg2 tweet_fetcher_package/psycopg2/


cd $ZIP_FOLDER

zip -r $ZIP_FILE .

mv $ZIP_FILE ../

