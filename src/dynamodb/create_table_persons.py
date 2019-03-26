import boto3

dynamodb = boto3.resource('dynamodb')

"""
Table: fp.persons
Partition key: name (string)
Attributes: polls (number), friends (number)
RCU: 2
WCU: 2
"""
persons = dynamodb.create_table(
    TableName='fp.persons',
    KeySchema=[
        {
            'AttributeName': 'name',
            'KeyType': 'HASH'  #Partition key
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'name',
            'AttributeType': 'S'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 2,
        'WriteCapacityUnits': 2
    }
)