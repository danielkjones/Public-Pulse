import React from "react";
import Chart from "./Chart";
import { Spinner } from "reactstrap";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_TWEETS = gql`
  query getTweetsForKeyword($word: String!) {
    keywordByWord(word: $word) {
      word
      id
      active
      tweetsByKeyword {
        nodes {
          positive
          neutral
          negative
          timeTweeted
        }
      }
    }
  }
`;

const sentiment = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  NEUTRAL: "NEUTRAL"
};

const determineSentiment = tweet => {
  if (tweet.positive >= tweet.neutral && tweet.positive >= tweet.negative) {
    return sentiment.POSITIVE;
  } else if (
    tweet.neutral >= tweet.positive &&
    tweet.neutral >= tweet.negative
  ) {
    return sentiment.NEUTRAL;
  } else {
    return sentiment.NEGATIVE;
  }
};

const analyzeData = data => {
  let days = {};

  data.forEach(tweet => {
    let formattedDay = new Date(tweet.timeTweeted)
      .toLocaleString()
      .split(",")[0];
    const tweetSentiment = determineSentiment(tweet);

    if (!days[formattedDay]) {
      days[formattedDay] = {
        numTweets: 0,
        "Number of positive tweets": 0,
        "Number of negative tweets": 0,
        "Number of neutral tweets": 0
      };
    }
    if (tweetSentiment === sentiment.POSITIVE) {
      days[formattedDay] = {
        numTweets: days[formattedDay].numTweets + 1,
        "Number of positive tweets": days[formattedDay]["Number of positive tweets"] + 1,
        "Number of negative tweets": days[formattedDay]["Number of negative tweets"] + 0,
        "Number of neutral tweets": days[formattedDay]["Number of neutral tweets"] + 0
      };
    } else if (tweetSentiment === sentiment.NEUTRAL) {
      days[formattedDay] = {
        numTweets: days[formattedDay].numTweets + 1,
        "Number of positive tweets": days[formattedDay]["Number of positive tweets"] + 0,
        "Number of negative tweets": days[formattedDay]["Number of negative tweets"] + 0,
        "Number of neutral tweets": days[formattedDay]["Number of neutral tweets"] + 1
      };
    } else {
      days[formattedDay] = {
        numTweets: days[formattedDay].numTweets + 1,
        "Number of positive tweets": days[formattedDay]["Number of positive tweets"] + 0,
        "Number of negative tweets": days[formattedDay]["Number of negative tweets"] + 1,
        "Number of neutral tweets": days[formattedDay]["Number of neutral tweets"] + 0
      };
    }
  });

  let summedDataByDay = Object.keys(days).map(day => {
    return {
      day,
      ...days[day]
    };
  });
  console.log(summedDataByDay)
  return summedDataByDay;
};

export default ({ queryString }) => {
  let { called, loading, data, error } = useQuery(GET_TWEETS, {
    variables: { word: queryString }
  });
  if (error) {
    return <code>{JSON.stringify(error)}</code>;
  } else if (called && !loading) {
    console.log(data);
    let tweets = data.keywordByWord.tweetsByKeyword.nodes;
    let sortedData = tweets.sort((a, b) =>
      a.timeTweeted > b.timeTweeted ? 1 : -1
    );
    const analyzedData = analyzeData(sortedData);
    console.log(analyzedData);
    return (
      <div>
        <Chart data={analyzedData} />
      </div>
    );
  } else {
    return <Spinner />;
  }
};
