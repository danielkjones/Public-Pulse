/* https://www.db-fiddle.com/f/rNfGmis7UWefGQrFFciMqq/2 */
CREATE TABLE keywords ( -- Represent the words that are being tracked e.g. #China
	id SERIAL PRIMARY KEY,
  	word TEXT UNIQUE NOT NULL,
	active BOOLEAN DEFAULT TRUE
);

CREATE TABLE tweets (
	tweet_id BIGINT PRIMARY KEY, -- ID from the tweet
  	keyword INTEGER REFERENCES keywords(id), -- The keyword that this tweet belongs to
  	tweet_text TEXT NOT NULL,
	positive DECIMAL,
	negative DECIMAL,
	neutral DECIMAL,
	time_tweeted TIMESTAMP,
  	resp JSONB -- The full resp of the tweet from the api call (incase there's fields we want later)
);

CREATE INDEX ON "public"."tweets"("keyword");