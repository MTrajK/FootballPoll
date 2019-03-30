import boto3

dynamodb = boto3.resource('dynamodb')

def create_table_admins():
    """
    Table: fp.polls
    Partition key: id (number)
    Attributes: start (number), end (number), dt (number), title (string), note (string), locDesc (string), locUrl (string), need (number), max (number)
    RCU: 3
    WCU: 1
    """

    try:
        print('Creating polls table...')
        
        dynamodb.create_table(
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
                'ReadCapacityUnits': 3,
                'WriteCapacityUnits': 1
            }
        )
    except Exception as e:
        print('polls table is not created!')
        print(e)
    else:
        print('polls table is successfully created!')
        
    print()