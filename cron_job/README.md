This package is a simple cron-job styled node scheduler for triggering
Tweet Fetching.

Ideally we would be using CloudWatch, but AWS Educate does not allow 
for creating CloudWatch Events.


Do the following steps to get this cron job up and running:

1. Pull this code into an EC2 instance
2. Make sure that you have Node/NPM installed on the EC2
3. Run `npm install` in this directory
4. Replace the value for `"apiGatewayUri": ""` in `config.json` with your Lambda API Gateway trigger URI
5. Run `npm start`
6. A Node process will start that periodically triggers the Lambda
