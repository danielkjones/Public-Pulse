import React, { useState } from "react";
import QueryView from "./QueryView";
import FakeData from "./testData.json";
import QueriesView from "./QueriesView";

import "./App.css";


const App = () => {

  // const removeQuery = string => {};

  const [queryIdAndWord, setQueryIdAndWord] = useState("");
  return (
    <div className="App">
      {!queryIdAndWord   && <QueriesView setQueryIdAndWord={setQueryIdAndWord}/>}
      {queryIdAndWord && (
        <React.Fragment>
          <h1>Tweets for query: {queryIdAndWord.word}</h1>
          <button onClick={() => setQueryIdAndWord("")}>Clear Query</button>
          <QueryView
            data={FakeData.filter(tweet => {
              let missingAHashtag = false;
              queryIdAndWord.word.split(",").forEach(hashtag => {
                if (!tweet.hashTags.includes(hashtag)) {
                  missingAHashtag = true;
                }
              });

              return !missingAHashtag;
            })}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default App;
