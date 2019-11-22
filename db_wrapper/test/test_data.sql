/* Adding a pice of example data, directly from https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets */

INSERT INTO keywords (word)
VALUES('Pizza');

INSERT INTO tweets (tweet_id, hashtags, tweet_text, positive, negative, neutral)
VALUES (1125490788736032770, "{#hllary, #trump}"", 'MAGA , emails, blah blah blah #hillary #trump', .5, .5, .5);
