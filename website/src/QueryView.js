import React from "react"
import Chart from "./Chart"

const analyzeData = data => {
    let days = {};
  
    data.forEach(tweet => {
      let formattedDay = new Date(tweet.date).toLocaleString().split(",")[0];
  
      if (!days[formattedDay]) {
        days[formattedDay] = {
          numTweets: 1,
          sumPositiveSentiment: tweet.sentiment.positive,
          sumNegativeSentiment: tweet.sentiment.negative,
          sumNeutralSentiment: tweet.sentiment.neutral
        };
      } else {
        days[formattedDay] = {
          numTweets: days[formattedDay].numTweets + 1,
          sumPositiveSentiment:
            days[formattedDay].numTweets + tweet.sentiment.positive,
          sumNegativeSentiment:
            days[formattedDay].numTweets + tweet.sentiment.negative,
          sumNeutralSentiment:
            days[formattedDay].numTweets + tweet.sentiment.neutral
        };
      }
    });
  
    let summedDataByDay = Object.keys(days).map(day => {
      return {
        day,
        ...days[day]
      };
    });
  
    return summedDataByDay.map(day => {
      //   here we will calculate average sentiment over all tweets
      // by dividing the sum by the number of tweets
      return {
        ...day,
        avgPositiveSentiment: day.sumPositiveSentiment / day.numTweets || 0,
        avgNegativeSentiment: day.sumNegativeSentiment / day.numTweets || 0,
        avgNeutralSentiment: day.sumNeutralSentiment / day.numTweets || 0
      };
    });
  };

export default ({queryString, data}) => {
    let sortedData = data.sort((a, b) => (a.date > b.date ? 1 : -1));
    const analyzedData = analyzeData(sortedData);
    return (
        <div>
            <h1>{queryString}</h1>
            <Chart data={analyzedData} />
        </div>
    )
}