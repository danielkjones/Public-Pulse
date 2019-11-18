FROM amazonlinux:latest

# download python 3.7 and zip (dependencies)
RUN yum -y install python3.7 zip

RUN mkdir tweet_fetcher_package/

RUN python3 -m pip install --upgrade pip \
    && python3 -m pip install tweepy -t tweet_fetcher_package

RUN mkdir /tmp/docker-volume

CMD mv tweet_fetcher_package /tmp/docker-volume
