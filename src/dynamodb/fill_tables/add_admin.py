import boto3
import password_hashing as ph

def add_admin(name, password):
    """Adds admin in Amazon DynamoDB fp.admins table.

    Parameters:
        name: Name of the admin.
        password: Password of the admin.
    """

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('fp.admins')

    salt = ph.generate_salt()
    hashed_password = ph.hash_password(password, salt)

    response = table.put_item(
        Item={
            'name': name,
            'password': hashed_password,
            'salt': salt
        }
    )

    if response['ResponseMetadata']['HTTPStatusCode'] == 200:
        print('Successfully added admin!')
    else:
        print('Error!')
        print(response)