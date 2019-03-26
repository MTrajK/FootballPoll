import boto3

dynamodb = boto3.resource('dynamodb')

"""
Table: fp.polls
Partition key: id (number)
Attributes: start (number), end (number), dt (number), title (string), note (string), locDesc (string), locUrl (string), max (number)
RCU: 5
WCU: 1
"""
polls = dynamodb.create_table(
    TableName='fp.polls',
    KeySchema=[
        {
            'AttributeName': 'id',
            'KeyType': 'HASH'  #Partition key
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'id',
            'AttributeType': 'N'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 1
    }
)