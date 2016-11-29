
from pymongo import MongoClient
import os
from datetime import datetime

class MongoDB_Util(object):


    def __init__(self):
        self.client = MongoClient(str(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')))
        self.database_name = str(os.getenv('MONGODB_NAME', 'testdb'))
        self.db = self.client[self.database_name]


    def insert_record(self, collection, data):
        insertion = self.db[collection].insert_one(data)
        return insertion.inserted_id


if __name__ == "__main__":
    instance = MongoDB_Util()
    print(instance.database_name)
    id = instance.insert_record('fb_posts', {'url': 'http://example.org', 'text': 'test data', 'date': datetime.utcnow()})
    print('Something inserted with id {0}'.format(id))
