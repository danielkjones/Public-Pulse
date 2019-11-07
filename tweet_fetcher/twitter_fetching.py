"""
Testing the tweepy package for downloading historical Tweets. 
Documentation can be found here:
https://tweepy.readthedocs.io/en/latest/getting_started.html

Some potential tips for using the search API:
https://bhaskarvk.github.io/2015/01/how-to-use-twitters-search-rest-api-most-effectively./

"""
import tweepy
import json
from aws_services import send_message_to_sqs

# CONSUMER_KEY= os.getenv("CONSUMER_KEY")
# CONSUMER_SECRET= os.getenv("CONSUMER_SECRET")
# ACCESS_TOKEN_KEY= os.getenv("ACCESS_TOKEN_KEY")
# ACCESS_TOKEN_SECRET= os.getenv("ACCESS_TOKEN_SECRET")

CONSUMER_KEY='YcIXq8uEdENAARiFsanLTwUDN'
CONSUMER_SECRET='T46jBbiKEJsMn3iNnddEFaffd3FEHYKFliPjyfrftVGtcXkeDd'
ACCESS_TOKEN_KEY='1167833051897978882-0XLNJE7vBCSoKGf3l3kNS4Homgw7Rn'
ACCESS_TOKEN_SECRET='Wn8hyqmoAum736ae5opbBLytIEEgauok5KE61eO75zTeL'


def retrieve_new_tweets(search_query="#ellen", keyword_id=1, since_tweet_id=None):  
    # Need to use "application-only auth" for maximum rate limit with Search API
    auth = tweepy.AppAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
    if not api:
        print("Unable to authentical API")
        exit()

    max_tweets = 10000000
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
                print("All recent Tweets retrieved for Keyword ID: {}".format(keyword_id))
                break
            for tweet in new_tweets:
                if hasattr(tweet, "retweeted_status"):
                    # for now we are not considering retweets for analysis
                    pass 
                else:
                    send_tweet_info(tweet, keyword_id)
            max_id = new_tweets[-1].id
        except tweepy.TweepError as e:
            # Just exit if any error
            print("Tweepy Error : " + str(e))
            break
    

def build_message_dict(status, keyword_id):
    message_dict = {
        "tweet_id": status.id,  # big int, ie 1189142362666295298
        "keyword_id": keyword_id,  # int, ie 3
        "tweet_text": status.full_text,  # string, may contain escape characters such as '\n'
        "time_tweeted": str(status.created_at),  # string in the format '2019-10-29 11:30:07'
        "raw_response": status._json  # json object with all API response information
    }
    return message_dict


def send_tweet_info(tweet, keyword_id):
    message_dict = build_message_dict(tweet, keyword_id)
    message_body = json.dumps(message_dict)
    send_message_to_sqs(message_body)

if __name__ == "__main__":
    retrieve_new_tweets()
