import boto3

dynamodb = boto3.resource('dynamodb')

def create_table_persons():
    """
    Table: fp.persons
    Partition key: name (string)
    Attributes: polls (number), friends (number)
    RCU: 2
    WCU: 2
    """

    try:
        print('Creating persons table...')
        
        dynamodb.create_table(
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
    except Exception as e:
        print('persons table is not created!')
        print(e)
    else:
        print('persons table is successfully created!')
        
    print()