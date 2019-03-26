import boto3

dynamodb = boto3.resource('dynamodb')

"""
Table: fp.admins
Partition key: name (string)
Attributes: password (string), salt (string)
RCU: 1
WCU: 1
"""
admins = dynamodb.create_table(
    TableName='fp.admins',
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
        'ReadCapacityUnits': 1,
        'WriteCapacityUnits': 1
    }
)