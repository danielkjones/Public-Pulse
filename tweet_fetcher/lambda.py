from twitter_fetching import retrieve_new_tweets
from query import get_search_strings


def main(event, context):
    # get the info from the DB
    keywords_array = get_search_strings()
    
    for keyword_info in keywords_array:
        search_query = keyword_info[1]
        keyword_id = keyword_info[0]
        max_tweet_id = keyword_info[2]
        retrieve_new_tweets(
            search_query=search_query,
            keyword_id=keyword_id,
            since_tweet_id=max_tweet_id
        )
        print("\n\n\nRetrieved tweets for keyword {}\n\n\n".format(search_query))
    return {
        "status": "success",
        "message": "Message sent successfully. Check the Queue."
    }    


if __name__ == "__main__":
    main(None, None)