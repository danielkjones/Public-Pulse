# Public Pulse
Repository for Team 2/Team Sounds Good
### Instructions

#### Repository

1.  Select a file location on your local computer
    
2.  Open up bash/terminal in this location
    
3.  Run `git clone https://github.com/swen-549-fall2019/Public-Pulse.git`
    

#### User Facing Website and Operations

1.  Start an EC2 instance of any size (we are using t2.micro)
    
2.  Create a load balancer (on the right side of the EC2 dashboard)
    

	a.  Select Application Load Balancer
	    
	b.  Name doesn’t matter
	    
	c.  Leave the default listener of HTTP on Port 80
	    
	d.  Leave the default VPC
	    
	e.  Select us-east-1a, us-east-1b for availability
	    
	f.  Click Next: Security Settings
	    
	g.  Click Next: Configure Security Groups
	    
	h.  Select the default security group (make sure the security group allows all inbound traffic)
	    
	i.  Click Next: Configure Routing
	    
	j.  Leave all of the settings default and name it whatever you want
	    
	k.  Select the EC2 instance you plan to run the website on and press add to registered on port 3000
    

3.  SSH into the instance
    
4.  Copy over the project to the EC2 instance (either by using SCP, or git cloning directly into it)
    
5.  CD into Public_Pulse/website
    
6.  Run yarn install
    
7.  CD into Public_Pulse/ec2-prostgraphile-and-frontend
    
8.  Run yarn install
    
9.  Run yarn start
    
10.  The website should now be running and accessible from the IP address on the load balancer
    

  

#### Data Store

1.  Create a Security Group (this can be found under the VPC menu in the AWS Console) that allows for an inbound PostgreSQL HTTP request on port 5432 from anywhere “0.0.0.0/0”
    
2.  Start an RDS PostgreSQL Database
    

	a.  Use the Free Tier option
    
	b.  Set the username and password credentials
    
	c.  Under “Additional connectivity configuration” turn the database onto “Publicly Accessible”
    
	d.  Make sure to add the Security Group that allows for PostgreSQL requests to the RDS    

3.  Connect to the RDS PostgreSQL database using some Postgres client (pgAdmin4 for example)
    
4.  Using the sql commands in the “Public-pulse/db_wrapper/sql/V1_init_.sql” file, copy and paste into the Postgres client and execute the commands to create the required database tables for the system
    

#### Tweet Gathering and Sanitizing

##### Lambda

1.  Create lambda with Python 3.7 as the runtime environment
    
2.  Create an IAM Lambda Role with the following permissions:
    

	a.  AmazonSQSFullAccess
    
	b.  CloudWatchFullAccess (if you would like good logging)
    

3.  Use the role you just created as the execution role for the lambda
    
4.  Go into the repo for the “Public-Pulse/tweet_fetcher” and fill out the configurations in the “configs/config.json” file. This will include your:
    

	a.  Twitter API Consumer Key/Secret
    
	b.  The URL of the SQS Queue for your Data Analysis Pipeline subsystem (if you do not have this already, might be safe to make it now)
    
	c.  The PostgreSQL credentials for your RDS Database (Make sure the security group allows it to be open to the public, because otherwise the Lambda cannot connect as is)
    

5.  Run the “./zip-update.sh” command in the “Public-Pulse/tweet_fetcher” to remake the “tweet_fetcher_package.zip” file
    
6.  Upload the tweet_fetcher_package.zip file to the Lambda as source code
    
7.  Create an API Gateway for the Lambda that accepts GET and POST as triggers (this will be used in your cron job and your website)
    

##### Cron Job

1.  Pull the repo onto an EC2 Instance (this could be the same instance where the front-end is hosted)
    
2.  Go into your “Public-Pulse/cron_job” folder
    
3.  Adjust the “config.json” file to contain the “apiGatewayUri” value (from the Tweet Fetcher Lambda API Gateway Trigger)
    
4.  Make sure NPM/Node are installed on the EC2
    
5.  Run `npm install` and then `npm start` (now a background Node process will be running a cron job to trigger the API Gateway every hour)
    

#### Data Analysis Pipeline

1.  Create a lambda with Python 3.6 as the runtime environment
    
2.  Create an IAM lambda role with the following permissions:
    

	a.  AmazonLambdaSQSQueueExecutionRole
    
	b.  AmazonRDSFullAccess
    
	c.  ComprehendReadOnly
    
	d.  CloudWatchLogsFullAccess
    

4.  Use the role you just created as the execution role for the lambda
    
5.  Create a SQS as a “Standard Queue” with “Quick create”
    
6.  Add the SQS you created as a trigger for the lambda with a batch size of 1
    
7.  Upload the “comprehend_query.zip” found in the path “Public-Pulse\sentiment_analyzer\lambda”
