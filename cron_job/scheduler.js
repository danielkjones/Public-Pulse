var schedule = require('node-schedule');
var Axios = require('axios');


function triggerTweetFetcher() {
    const uri = 'https://wxk312x9i2.execute-api.us-east-1.amazonaws.com/default/Test-Queue-Function';
    console.log('Tweet Fetcher Triggered at ' + Date.now());
    Axios.get(uri)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        })
}


function initializeScheduler() {
    // refresh at the end of the daya (subject to change)
    _ = schedule.scheduleJob('0 0 * * * *', () => {
        triggerTweetFetcher();
    })
}


console.log("Scheduler is started at " + Date.now())
initializeScheduler();