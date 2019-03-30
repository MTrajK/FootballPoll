import boto3
import time
import datetime
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')

def batch_write_item_persons(item):
    """Tries to add new persons, tries until the query succeeded.

    Parameters:
        item: Object with table name, persons and type of requests.
    """

    if len(item['fp.persons']) != 0:
        try:
            response = dynamodb.batch_write_item(
                RequestItems=item,
                ReturnConsumedCapacity='INDEXES',
                ReturnItemCollectionMetrics='SIZE'
            )
            print('added')
            print(response)
        except Exception as a:
            print('exception ' + str(a))
            # tries again
            time.sleep(1)
            batch_write_item_persons(item)
        else:
            if ('UnprocessedItems' in response) and ('fp.persons' in response['UnprocessedItems']):
                print('UnprocessedItems')
                # tries again if there are unprocessed items
                time.sleep(1)
                batch_write_item_persons(response['UnprocessedItems'])

add_persons = []
for i in range(20):
    add_persons.append({
        'name': 'a' + str(i),
        'polls': 1,
        'friends': 0
    })

"""
    batch_write_item_persons({
        'fp.persons' : [{ 'PutRequest': { 'Item': add_person } } for add_person in add_persons]
    })
"""

client = boto3.client('dynamodb')

print(client.describe_limits())
print('table')
print(client.describe_table(TableName='fp.persons'))
print('ttl')
print(client.describe_time_to_live(
    TableName='fp.persons'
))