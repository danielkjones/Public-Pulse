import json


class Config:
    class __SingletonConfig:  # nested class for singleton behavior
        def __init__(self):
            with open('configs/config.json', 'r') as f:
                dic = json.load(f)
            self.twitter_api = dic['twitter_api']
            self.sqs = dic['sqs']
            self.postgres = dic['postgres']

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
