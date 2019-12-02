Going to try to connect through a lambda.

In this case, Psycopg2 requires a special version for Lambdas/EC2s.
A link to this psycopg2 can be found here:
https://github.com/jkehler/awslambda-psycopg2

Also, need to be aware that any lambda code packages that need to be
downloaded need to be built for Linux (AWS's operating environment)


Follow these commands to download packages built for Linux for Lambda 
```
docker build . -t pip-package-downloader
docker run -v $(pwd):/tmp/docker-volume pip-package-downloader
```

Run the script `./zip-update.sh` after you run the Docker commands to build
a .zip package for the lambda.


ASSUMING YOU HAVE EVERYTHING NEEDED, following these steps to get ready to deploy 
to your Lambda:

1. Fill out the `configs/config.json` file with your credentials for your 
PostgreSQL Database, Twitter Consumer Key/Secret, and SQS URL for the Lambda
2. Run `./zip-update.sh` on your Mac/Linux machine
3. Upload the code to your Lambda
