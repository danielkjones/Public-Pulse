import boto3
import json
import psycopg2


comprehend = boto3.client('comprehend')
creds = "dbname=tweet_db user=adminuser host=tweetdb.c0dnyygelykr.us-east-1.rds.amazonaws.com password=adminpass"


def lambda_handler(event, context):
    sentiment = comprehend.detect_sentiment(Text=event['tweet_text'], LanguageCode='en')
    try:
        print('here')
        conn = psycopg2.connect(creds)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO tweets
            VALUES(%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (event['tweet_id'], event['keyword_id'], event['tweet_text'],
            sentiment['SentimentScore']['Positive'], sentiment['SentimentScore']['Negative'],
            sentiment['SentimentScore']['Neutral'], event['time_tweeted'], json.dumps(event)))
        conn.commit()
    except Exception as e:
        print(e)
    return sentiment
