import psycopg2


def _execute_select_query(query_string):
    try:
        # create a connection to the database
        conn = psycopg2.connect(
            user="postgres",
            password="pword",
            host="localhost",
            port="5432"
        )
        # create a cursor that can execute queries
        cursor = conn.cursor()
        cursor.execute(query_string)
        results = cursor.fetchall()
        cursor.close()
        return results
    except Exception as err:
        print("Ran into following error: {}".format(err))


def get_search_strings():
    query_string = \
        "SELECT keywords.id, keywords.word, tweets.tweet_id " \
        "FROM keywords LEFT JOIN tweets " \
        "ON tweets.keyword=keywords.id "\
        "WHERE tweets.tweet_id IN (SELECT MAX(tweet_id) FROM tweets GROUP BY keyword) " \
        "OR tweets.tweet_id IS NULL;"
    query_results = _execute_select_query(query_string)
    return query_results


if __name__ == "__main__":
    print(get_search_strings())
