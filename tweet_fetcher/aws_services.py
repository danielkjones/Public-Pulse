import boto3
import json

def retrieve_keys():
    return

def send_message_to_sqs(message_body):
    client = boto3.client('sqs')
    client.send_message(
        QueueUrl='https://sqs.us-east-1.amazonaws.com/830714197270/Test-Queue',
        MessageBody= json.dumps(message_body)
        )
