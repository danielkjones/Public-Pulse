import json
import random

# converts json tweet file into a .sql file that can be used to load sample data
def main():
    with open('tweets.json') as json_file:
        data = json.load(json_file)
        f = open("z_test_tweets.sql", "a")
        for t in data['tweets']:
            tweet_id = t['id_str']
            tweet_text = "$tweettext$" + t['full_text'] + "$tweettext$"
            timestamp = "'" + t['created_at'] + "'"
            positive = random.random()
            negative = random.random()
            neutral = random.random()
            line = f"INSERT INTO tweets (tweet_id, keyword, tweet_text, positive, negative, neutral, time_tweeted, resp) VALUES ({tweet_id}, 1, {tweet_text}, {positive}, {negative}, {neutral}, {timestamp}, $tweetresp${json.dumps(t)}$tweetresp$);"
            f.write(line)
        f.close()


if __name__ == '__main__':
    main()
