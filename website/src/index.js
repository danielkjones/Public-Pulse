import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Navbar from "./Navbar"

import "bootstrap/dist/css/bootstrap.min.css";

import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: `http://${window.location.hostname}:3000/graphql`
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <div>
      <Navbar />
      <br/>
      <App />
    </div>
  </ApolloProvider>,
  document.getElementById("root")
);  

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
