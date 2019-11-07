import boto3
import json


comprehend = boto3.client('comprehend')

def lambda_handler(event, context):
    sentimentJson = json.dumps(comprehend.detect_sentiment(Text=event['tweet_text'], LanguageCode='en'), sort_keys=True, indent=4)
    print(sentimentJson)
    print('here')
    return sentimentJson
