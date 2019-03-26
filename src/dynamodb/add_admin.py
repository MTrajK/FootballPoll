import boto3
import password_hashing

name = 'put admin name here'
password = 'put admin password here'
salt = password_hashing.generate_salt()

hashed_password = password_hashing.hash_password(password, salt)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('fp.admins')

response = table.put_item(
   Item={
        'name': name,
        'password': hashed_password,
        'salt': salt
    }
)

print("PutItem succeeded:")
print(response)