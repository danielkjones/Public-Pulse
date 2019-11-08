import json
# from aws_services import retrieve_twitter_api_keys


class Config:
    class __SingletonConfig:  # nested class for singleton behavior
        def __init__(self):
            with open('configs/config.json', 'r') as f:
                dic = json.load(f)
            self.twitter_api = dic['twitter_api']
            self.sqs = dic['sqs']
            self.postgres = dic['postgres']
        #     self._set_twitter_creds_from_secrets()

        # def _set_twitter_creds_from_secrets(self):
        #     consumer_key, consumer_secret = retrieve_twitter_api_keys()
        #     self.twitter_api['consumer_key'] = consumer_key
        #     self.twitter_api['consumer_secret'] = consumer_secret

    instance = None
    def __init__(self):
        if not Config.instance:
            Config.instance = Config.__SingletonConfig()
        # if the Config.instance exists, the singleton is instantiated
    
    def __getattr__(self, name):
        return getattr(self.instance, name)


if __name__ == "__main__":
    print(Config().twitter_api)
    print(Config().sqs)
