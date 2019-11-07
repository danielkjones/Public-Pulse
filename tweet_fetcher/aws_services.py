import boto3
import json
from config import Config


def retrieve_twitter_api_keys():
    SECRET_NAME = Config().twitter_api["secret_name"]
    client = boto3.client('secretsmanager')
    secret_value_response = client.get_secret_value(SecretId=SECRET_NAME)
    secret_string = secret_value_response['SecretString']
    consumer_key = json.loads(secret_string)['consumer_key']
    consumer_secret = json.loads(secret_string)['consumer_secret']
    return consumer_key, consumer_secret


def send_message_to_sqs(message_body):
    QUEUE_URL = Config().sqs["url"]
    client = boto3.client('sqs')
    client.send_message(
        QueueUrl=QUEUE_URL,
        MessageBody= json.dumps(message_body)
        )
