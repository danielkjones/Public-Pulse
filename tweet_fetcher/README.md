Going to try to connect through a lambda.

In this case, Psycopg2 requires a special version for Lambdas/EC2s.
A link to this psycopg2 can be found here:
https://github.com/jkehler/awslambda-psycopg2


Also, need to be aware that any lambda code packages that need to be
downloaded need to be built for Linux (AWS's operating environment)
