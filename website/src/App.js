import React, { useState } from "react";
import "./App.css";
import Chart from "./Chart";
import QueryView from "./QueryView";
import FakeData from "./testData.json";
import QueriesView from "./QueriesView";

const App = () => {
  const availableQueries = ["#trump", "#hillary", "#elon,#tesla"];

  const [query, setQuery] = useState(availableQueries[0]);
  return (
    <div className="App">
      {query && (
        <React.Fragment>
          <h1>Tweets for query: {query}</h1>
          <button onClick={() => setQuery("")}>Clear Query</button>
          <QueryView
            data={FakeData.filter(tweet => {
              let missingAHashtag = false
              query.split(",").forEach(hashtag => {
                if(!tweet.hashTags.includes(hashtag)){
                  missingAHashtag = true
                }
              })

              return !missingAHashtag
            })}
          />
        </React.Fragment>
      )}
      {!query && (
        <QueriesView queriesList={availableQueries} setQuery={setQuery} />
      )}
    </div>
  );
};

export default App;
