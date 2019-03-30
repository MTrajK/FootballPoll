import boto3

dynamodb = boto3.resource('dynamodb')

def create_table_config():
    """
    Table: fp.config
    Partition key: id (string)
    Attributes: value (string)
    RCU: 1
    WCU: 1
    """

    try:
        print('Creating config table...')
        
        dynamodb.create_table(
            TableName='fp.config',
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'  #Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 1,
                'WriteCapacityUnits': 1
            }
        )
    except Exception as e:
        print('config table is not created!')
        print(e)
    else:
        print('config table is successfully created!')
        
    print()