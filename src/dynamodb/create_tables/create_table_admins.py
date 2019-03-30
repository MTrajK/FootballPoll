import boto3

dynamodb = boto3.resource('dynamodb')

def create_table_admins():
    """
    Table: fp.admins
    Partition key: name (string)
    Attributes: password (string), salt (string)
    RCU: 1
    WCU: 1
    """
    
    try:
        print('Creating admins table...')
        
        dynamodb.create_table(
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
    except Exception as e:
        print('admins table is not created!')
        print(e)
    else:
        print('admins table is successfully created!')
    
    print()