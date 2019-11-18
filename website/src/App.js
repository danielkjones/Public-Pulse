import React, { useState } from "react";
import QueryView from "./QueryView";
import FakeData from "./testData.json";
import QueriesView from "./QueriesView";
import {Button} from "reactstrap"

import "./App.css";


const App = () => {
  const [queryIdAndWord, setQueryIdAndWord] = useState("");
  return (
    <div className="App">
      {!queryIdAndWord   && <QueriesView setQueryIdAndWord={setQueryIdAndWord}/>}
      {queryIdAndWord && (
        <React.Fragment>
          <h1>Tweets for hashtag: {queryIdAndWord.word}</h1>
          <Button onClick={() => setQueryIdAndWord("")}>Clear hastag</Button>
          <QueryView queryString={queryIdAndWord.word}/>
        </React.Fragment>
      )}
    </div>
  );
};

export default App;
