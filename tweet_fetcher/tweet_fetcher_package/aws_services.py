import boto3
import json


def send_message_to_sqs(message_body, queue_url):
    client = boto3.client('sqs')
    client.send_message(
        QueueUrl=queue_url,
        MessageBody= json.dumps(message_body)
        )
