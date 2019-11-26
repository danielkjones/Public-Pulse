var schedule = require('node-schedule');
var Axios = require('axios');
const fs = require('fs');

function triggerTweetFetcher() {
    fs.readFile('config.json', (err, data) => {
        if (err) throw err;
        let configs = JSON.parse(data); 
        let uri = configs.apiGatewayUri;
        console.log('Tweet Fetcher Triggered at ' + Date.now());
        console.log(uri)
        Axios.get(uri)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    })
}


function initializeScheduler() {
    // refresh every hour
    _ = schedule.scheduleJob('0 0 * * * *', () => {
        triggerTweetFetcher();
    })
}


console.log("Scheduler is started at " + Date.now())
initializeScheduler();