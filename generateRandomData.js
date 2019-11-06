/**
 * This script just generates fake data similar to what we want and writes it to
 * a json file
 */

const fs = require("fs");

const hashTags = ["#trump", "#hillary", "#elon,#tesla"];

const randomDate = (start, end) => {
  var date = new Date(+start + Math.random() * (end - start));
  return date;
};

const randomDateInPastHundredDays = () => {
  let now = new Date();
  let fromDate = new Date();
  fromDate.setDate(now.getDate() - 100);
  return randomDate(fromDate, now);
};

let data = [];
hashTags.forEach(hashtag => {
  for (let i = 0; i < 100; i++) {
    data.push({
      hashTags: hashtag.split(","),
      date: randomDateInPastHundredDays(),
      text: `This is an example tweet from some random person about ${hashtag
        .split(",")
        .join(" ")}`,
      sentiment: {
        positive: Math.random(),
        negative: Math.random(),
        neutral: Math.random()
      }
    });
  }
});

fs.writeFileSync("./testData.json", JSON.stringify(data, null, 4));
console.log("Wrote fake data to ./testData.json");
