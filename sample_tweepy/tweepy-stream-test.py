"""
Testing the tweepy package for Tweet streaming. Documentation can be found here:
https://tweepy.readthedocs.io/en/latest/getting_started.html


Used demo from following article to get things up and running:
https://www.dataquest.io/blog/streaming-data-python/

"""
import tweepy
import os
from dotenv import load_dotenv  # this is for loading in the .env file

load_dotenv()  # load in the .env file

CONSUMER_KEY= os.getenv("CONSUMER_KEY")
CONSUMER_SECRET= os.getenv("CONSUMER_SECRET")
ACCESS_TOKEN_KEY= os.getenv("ACCESS_TOKEN_KEY")
ACCESS_TOKEN_SECRET= os.getenv("ACCESS_TOKEN_SECRET")
search_filter=["#RITSM"]

class MyStreamListener(tweepy.StreamListener):
    def on_status(self, status):
        if hasattr(status, "retweeted_status"):  # Check if Retweet
            # For now, skip counting retweets
            # May be worthwhile doing something here in the future
            # ie retweets may be useful in adding weight to sentiment
            return
        else:
            print("\n====== NEW TWEET ======")
            print("CREATED AT: " + str(status.created_at))
            print("TWEET BY: " + status.user.screen_name)
            try:
                print("TWEET:\n" + status.extended_tweet["full_text"])
            except AttributeError:
                print("TWEET:\n" + status.text)

    def on_error(self, status_code):
        if status_code == 420:
            return False

# AUTH AND API INSTANTIATION
# Need to use OAuthHandler for Streaming API
print("Creating OAuth Handler")
auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
print("Setting Access Token")
auth.set_access_token(ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET)
print("Creating Tweepy API")
api = tweepy.API(auth)

# STREAMING INSTANTIATION
print("Creating Stream Listener")
stream_listener = MyStreamListener()
print("Creating Stream")
mystream = tweepy.Stream(auth=api.auth, listener=stream_listener)
print("Starting Stream Filter")
mystream.filter(track=search_filter)
