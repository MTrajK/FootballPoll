import boto3

dynamodb = boto3.resource('dynamodb')

"""
Table: fp.participants
Partition key: poll (number)
Sort key: added (number)
Attributes: person (string), friend (string)
RCU: 2
WCU: 2
"""
participants = dynamodb.create_table(
    TableName='fp.participants',
    KeySchema=[
        {
            'AttributeName': 'poll',
            'KeyType': 'HASH'  #Partition key
        },
        {
            'AttributeName': 'added',
            'KeyType': 'RANGE'  #Sort key
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'poll',
            'AttributeType': 'N'
        },
        {
            'AttributeName': 'added',
            'AttributeType': 'N'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 2,
        'WriteCapacityUnits': 2
    }
)