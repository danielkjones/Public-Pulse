/* https://www.db-fiddle.com/f/rNfGmis7UWefGQrFFciMqq/2 */

CREATE TYPE sentiment AS ENUM ('Neutral', 'Positive', 'Negative') ;

CREATE TABLE keywords ( -- Represent the words that are being tracked e.g. #China
	id SERIAL PRIMARY KEY,
  	word TEXT UNIQUE NOT NULL
);

CREATE TABLE tweets (
	tweet_id BIGINT PRIMARY KEY, -- ID from the tweet
  	keyword INTEGER REFERENCES keywords(id), -- The keyword that this tweet belongs to
  	tweet_text TEXT NOT NULL,
  	sentiment sentiment, -- Sentiment for after processing
  	resp JSONB -- The full resp of the tweet from the api call (incase there's fields we want later)
);