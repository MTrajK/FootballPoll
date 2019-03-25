import boto3
import json

dynamodb = boto3.resource('dynamodb')

# gets all tables
print(dynamodb.tables)

# creates a Table resource
table = dynamodb.Table('fp.admins')

response = table.scan()

print(response)