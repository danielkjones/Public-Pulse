import React from "react";

export default ({ queriesList, setQuery }) => {
  return (
    <ul>
      {queriesList.map(queryString => (
        <li onClick={() => setQuery(queryString)}>{queryString}</li>
      ))}
    </ul>
  );
};
