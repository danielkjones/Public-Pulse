"""
Testing the tweepy package for downloading historical Tweets. 
Documentation can be found here:
https://tweepy.readthedocs.io/en/latest/getting_started.html

Some potential tips for using the search API:
https://bhaskarvk.github.io/2015/01/how-to-use-twitters-search-rest-api-most-effectively./

"""

import tweepy
import sys
import os
import jsonpickle
from datetime import datetime, timedelta
from dotenv import load_dotenv  # this is for loading the .env file locally

load_dotenv()  # load in the .env file

CONSUMER_KEY= os.getenv("CONSUMER_KEY")
CONSUMER_SECRET= os.getenv("CONSUMER_SECRET")
ACCESS_TOKEN_KEY= os.getenv("ACCESS_TOKEN_KEY")
ACCESS_TOKEN_SECRET= os.getenv("ACCESS_TOKEN_SECRET")

# Need to use "application-only auth" for maximum rate limit with Search API
print("Creating App Auth Handler")
auth = tweepy.AppAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
print("Creating Tweepy API Client")
api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
if not api:
    print("Unable to authentical API")
    exit()

# Generate the date string for how far to go back
date_today = datetime.today()
week_ago = date_today - timedelta(days=7)
week_ago_datestring = week_ago.strftime("%Y-%m-%d")

max_tweets = 10000000
tweet_count = 0
tweets_per_query = 100  # this is the max per the API 
file_name = "tweets.txt"
since_id = None
max_id = -1
search_query = "#zuckerberg"

with open(file_name, "w") as f:
    while tweet_count < max_tweets:
        try:
            if (max_id <= 0):
                if (not since_id):
                    new_tweets = api.search(q=search_query, count=tweets_per_query, 
                                            tweet_mode='extended')
                else:
                    new_tweets = api.search(q=search_query, count=tweets_per_query,
                                            since_id=since_id, tweet_mode='extended')
            else:
                if (not since_id):
                    new_tweets = api.search(q=search_query, count=tweets_per_query,
                                            max_id=str(max_id - 1), tweet_mode='extended')
                else:
                    new_tweets = api.search(q=search_query, count=tweets_per_query,
                                            max_id=str(max_id - 1),
                                            since_id=since_id, tweet_mode='extended')
            if not new_tweets:
                print("No more tweets found")
                break
            for tweet in new_tweets:
                # f.write(jsonpickle.encode(tweet._json, unpicklable=False) +
                #         '\n')
                f.write(str(tweet) + '\n')
            tweet_count += len(new_tweets)
            print("Downloaded {0} tweets".format(tweet_count))
            max_id = new_tweets[-1].id
        except tweepy.TweepError as e:
            # Just exit if any error
            print("some error : " + str(e))
            break
