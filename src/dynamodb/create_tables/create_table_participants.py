import boto3

dynamodb = boto3.resource('dynamodb')

def create_table_participants():
    """
    Table: fp.participants
    Partition key: poll (number)
    Sort key: added (number)
    Attributes: person (string), friend (string)
    RCU: 2
    WCU: 2
    """

    try:
        print('Creating participants table...')
        
        dynamodb.create_table(
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
    except Exception as e:
        print('participants table is not created!')
        print(e)
    else:
        print('participants table is successfully created!')
        
    print()