from twitter_fetching import retrieve_new_tweets


def main(event, context):
    retrieve_new_tweets()
    return {
        "status": "success",
        "message": "Message sent successfully. Check the Queue."
    }    
