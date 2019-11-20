const express = require("express");
const { postgraphile } = require("postgraphile");

const app = express();

app.use(
  postgraphile(
    "postgres://postgres:wordpassword@tweet-dev.c06b2dpgbgob.us-east-1.rds.amazonaws.com:5432/postgres",
    "public",
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
    }
  )
);

app.use(express.static('build'))


app.listen(3000, () => {
    console.log("Website and postgraphile being hosted on port 3000")
});