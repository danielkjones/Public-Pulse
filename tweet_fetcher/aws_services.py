import boto3
import json


def retrieve_twitter_api_keys():
    secret_name = "prod/twitter/api"
    client = boto3.client('secretsmanager')
    secret_value_response = client.get_secret_value(SecretId=secret_name)
    secret_string = secret_value_response['SecretString']
    consumer_key = json.loads(secret_string)['consumer_key']
    consumer_secret = json.loads(secret_string)['consumer_secret']
    return consumer_key, consumer_secret


def send_message_to_sqs(message_body):
    client = boto3.client('sqs')
    client.send_message(
        QueueUrl='https://sqs.us-east-1.amazonaws.com/830714197270/Test-Queue',
        MessageBody= json.dumps(message_body)
        )
