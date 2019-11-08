import boto3
import json
import psycopg2


comprehend = boto3.client('comprehend')
creds = "dbname='tweet_db' user='adminuser' host='tweetdb.c0dnyygelykr.us-east-1.rds.amazonaws.com' password=''"


def lambda_handler(event, context):
    sentiment = json.dumps(comprehend.detect_sentiment(Text=event['tweet_text'], LanguageCode='en'), sort_keys=True, indent=4)
    print(sentiment)
    try:
        conn = psycopg2.connect(creds)
        cursor = conn.cursor()
        insert = ("INSERT INTO tweets VALUES(%d,%d,%s,%d,%d,%d,%s,%s)"
                    % event['tweet_id'], event['keyword_id'], event['tweet_text'],
                    sentiment['SentimentScore']['Positive'], sentiment['SentimentScore']['Negative'],
                    sentiment['SentimentScore']['Neutral'], event['time_tweeted'], JSON.stringify(event));
        cursor.execute(insert)
    except Exception as e:
        print(e)
    return sentiment
