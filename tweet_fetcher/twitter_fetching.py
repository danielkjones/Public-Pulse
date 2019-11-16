"""
Testing the tweepy package for downloading historical Tweets. 
Documentation can be found here:
https://tweepy.readthedocs.io/en/latest/getting_started.html

Some potential tips for using the search API:
https://bhaskarvk.github.io/2015/01/how-to-use-twitters-search-rest-api-most-effectively./

"""
import tweepy
import json
import os
from lambda_configs import Config
from aws_services import send_message_to_sqs


def retrieve_new_tweets(search_query, keyword_id, since_tweet_id=None):  
    # Get the configured API Keys for Twitter Auth
    CONSUMER_KEY = Config().twitter_api["consumer_key"]
    CONSUMER_SECRET = Config().twitter_api["consumer_secret"]
    # Need to use "application-only auth" for maximum rate limit with Search API
    auth = tweepy.AppAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
    if not api:
        print("Unable to authentical API")
        exit()

    max_tweets = 10000000  # obscurely large number to restrict loop
    tweet_count = 0
    tweets_per_query = 100  # this is the max per the API 
    since_id = since_tweet_id  # if given a tweet ID, find tweets since then
    max_id = -1
    
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
                break
            for tweet in new_tweets:
                if hasattr(tweet, "retweeted_status"):
                    # for now we are not considering retweets for analysis
                    pass 
                else:
                    _send_tweet_info(tweet, keyword_id)
            tweet_count += len(new_tweets)
            max_id = new_tweets[-1].id
        except tweepy.TweepError as e:
            # Just exit if any error
            print("Tweepy Error : " + str(e))
            break
    

def _build_message_dict(status, keyword_id):
    message_dict = {
        "tweet_id": status.id,  # big int, ie 1189142362666295298
        "keyword_id": keyword_id,  # int, ie 3
        "tweet_text": status.full_text,  # string, may contain escape characters such as '\n'
        "time_tweeted": str(status.created_at),  # string in the format '2019-10-29 11:30:07'
        "raw_response": status._json  # json object with all API response information
    }
    return message_dict


def _remove_escape_characters(message_body):
    return message_body.replace("\\n", " ")


def _send_tweet_info(tweet, keyword_id):
    message_dict = _build_message_dict(tweet, keyword_id)
    message_body = json.dumps(message_dict)
    message_body = _remove_escape_characters(message_body)
    if os.environ.get('PROD'):
        send_message_to_sqs(message_body, Config().sqs["url"])
    else:
        print(message_body)


if __name__ == "__main__":
    retrieve_new_tweets('#kanye', 2)
