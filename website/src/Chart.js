import React, { PureComponent } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  BarChart
} from "recharts";




const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <div>
          <div>
            <b>Date</b>
          </div>
          <div>{JSON.stringify(label)}</div>
        </div>
        <div>
          <div>
            <b>Number of Tweets</b>
          </div>
          <div>{JSON.stringify(payload[0].payload.numTweets)}</div>
        </div>
        <div>
          <div>
            <b>Average Positive Sentiment</b>
          </div>
          <div>{JSON.stringify(payload[0].payload.avgPositiveSentiment)}</div>
        </div>
        <div>
          <div>
            <b>Average Neutral Sentiment</b>
          </div>
          <div>{JSON.stringify(payload[0].payload.avgNeutralSentiment)}</div>
        </div>
        <div>
          <div>
            <b>Average Negative Sentiment</b>
          </div>
          <div>{JSON.stringify(payload[0].payload.avgNegativeSentiment)}</div>
        </div>
      </div>
    );
  }

  return null;
};

export default class Example extends PureComponent {
  render() {
    const data = this.props.data
    return (
      <div>
        <BarChart
          width={1000}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          {/* <Tooltip content={<CustomTooltip />} /> */}

          <Legend />
          <Bar dataKey="Number of negative tweets" stackId="a" fill="#ff7675" />
          <Bar dataKey="Number of neutral tweets" stackId="a"  fill="#b2bec3"/>
          <Bar dataKey="Number of positive tweets" stackId="a" fill="#00b894" />

        </BarChart>
      </div>
    );
  }
}
