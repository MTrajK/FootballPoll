import boto3
from boto3.dynamodb.conditions import Key
        
dynamodb = boto3.resource('dynamodb')

def get_poll_participants(event, context):
    """Returns all participants from poll_id poll.

    Returns:
        List of all participants from the wanted poll.
    """

    if 'poll_id' not in event:
        return {
            'statusCode': 400,
            'errorMessage': 'poll_id parameter doesn\'t exist in the API call!'
        }
        
    try:
        pollId = int(event['poll_id'])
    except:
        return {
            'statusCode': 400,
            'errorMessage': 'poll_id value is not an integer number!'
        }

    participants_table = dynamodb.Table('fp.participants')

    participants = []

    try:
        response = participants_table.query(
            KeyConditionExpression=Key('poll').eq(pollId)
        )
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }
    else:
        if 'Items' in response:
            participants = response['Items']


    return {
        'statusCode': 200,
        'body': participants
    }