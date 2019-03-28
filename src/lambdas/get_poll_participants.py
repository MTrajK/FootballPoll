import boto3
from boto3.dynamodb.conditions import Key
        
dynamodb = boto3.resource('dynamodb')

def get_poll_participants(event, context):
    """Finds all participants from poll_id poll.

    Returns:
        List of all participants from the wanted poll.
    """

    if 'poll_id' not in event:
        return {
            'statusCode': 400,
            'errorMessage': 'poll_id parameter doesn\'t exist in the API call!'
        }
        
    try:
        poll_id = int(event['poll_id'])
    except:
        return {
            'statusCode': 400,
            'errorMessage': 'poll_id value is not an integer number!'
        }

    if poll_id < 0:
        return {
            'statusCode': 400,
            'errorMessage': 'poll_id value shouldn\'t be smaller than 0!'
        }

    participants_table = dynamodb.Table('fp.participants')

    participants = []

    try:
        response = participants_table.query(
            KeyConditionExpression=Key('poll').eq(poll_id)
        )
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }

    if 'Items' in response:
        participants = response['Items']


    return {
        'statusCode': 200,
        'body': participants
    }