import boto3
import time
import datetime
        
dynamodb = boto3.resource('dynamodb')

def get_current_poll_id(second_attempt = False):
    """Tries 2 times to access the config table and take the current poll id.

    Parameters:
        second_attempt: Flag for the second attempt.

    Returns:
        Current poll id.
    """

    config_table = dynamodb.Table('fp.config')

    try:
        response = response = config_table.get_item(
            Key={
                'id': 'CurrentPoll'
            }
        )
    except Exception:
        raise Exception('Database error!')
    else:
        if 'Item' not in response:
            if second_attempt:
                raise Exception('Database error!')

            time.sleep(1)
            return get_current_poll_id(True)

        return int(response['Item']['value'])

def add_participant(event, context):
    """Add a participant into the current poll.

    Returns:
        Status of adding.
    """

    if 'person' not in event:
        return {
            'statusCode': 400,
            'errorMessage': 'person parameter doesn\'t exist in the API call!'
        }
    
    person = event['person']
    friend = r'/'

    if 'friend' not in event:
        friend = event['friend']

    # check the name format

    # get current poll id
    try:
        current_poll_id = get_current_poll_id()
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }

    # query participants
    participants_table = dynamodb.Table('fp.participants')

    try:
        # query

    # add participant
    added = datetime.datetime.now().timestamp() * 1000

    try:
        # add

    return {
        'statusCode': 200,
        'statusMessage': 'Participant ' + person + '(' + friend + ')' + ' is successfully added!'
    }