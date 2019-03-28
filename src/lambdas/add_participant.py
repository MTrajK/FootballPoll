import boto3
import time
import datetime
import re
from boto3.dynamodb.conditions import Key
        
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
        response = config_table.get_item(
            Key={
                'id': 'CurrentPoll'
            }
        )
    except Exception:
        if second_attempt:
            raise Exception('Database error!')

        # tries again if the first attempt failed
        time.sleep(1)
        return get_current_poll_id(True)
        
    return int(response['Item']['value'])

def add_participant(event, context):
    """Adds a participant into the current poll.

    Returns:
        Status of adding.
    """

    if 'person' not in event:
        return {
            'statusCode': 400,
            'errorMessage': 'person parameter doesn\'t exist in the API call!'
        }
    
    # lower letters and remove all unnecessary whitespaces
    person = ' '.join(event['person'].lower().split())
    friend = '/'

    if 'friend' in event:
        friend = ' '.join(event['friend'].lower().split())

    # allowed characters - LETTERS (cyrilic, latin), digits, +, -, whitespace between characters
    match_string = '^[\w\d +-]*$'

    if re.match(match_string, person):
        return {
            'statusCode': 400,
            'errorMessage': 'person value contains not allowed characters!'
        }
    
    if re.match(match_string, friend):
        return {
            'statusCode': 400,
            'errorMessage': 'friend value contains not allowed characters!'
        }

    # get current poll id
    try:
        current_poll_id = get_current_poll_id()
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }

    # get max participants
    polls_table = dynamodb.Table('fp.polls')

    try:
        polls_response = polls_table.get_item(
            Key={
                'id': current_poll_id
            }
        )
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }

    max_participants = polls_response['Item']['max']

    # query participants
    participants_table = dynamodb.Table('fp.participants')

    try:
        participants_response = participants_table.query(
            KeyConditionExpression=Key('poll').eq(current_poll_id)
        )
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }

    participants = []
    if 'Items' in participants_response:
        participants = participants_response['Items']

    if len(participants) == max_participants:
        return {
            'statusCode': 400,
            'errorMessage': 'No more participants in this poll!'
        }

    # check for duplicate
    if friend == '/':
        for participant in participants:
            if participant['person'] == person:
                return {
                    'statusCode': 400,
                    'errorMessage': 'Participant ' + person + ' exists in the current poll!'
                }

    # add the participant
    added = int(datetime.datetime.now().timestamp() * 1000)

    try:
        participants_table.put_item(
            Item={
                'poll': current_poll_id,
                'added': added,
                'person': person,
                'friend': friend
            }
        )
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }

    return {
        'statusCode': 200,
        'statusMessage': 'Participant ' + person + (' (' + friend + ')' if friend != '/' else '') + ' is successfully added!'
    }