import boto3
import time
        
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
        if ('Item' not in response) or ('Item' in response and 'value' not in response['Item']):
            if second_attempt:
                raise Exception('Database error!')

            time.sleep(1)
            return get_current_poll_id(True)

        return int(response['Item']['value'])

def delete_participant(event, context):
    """Deletes a participant from the current poll.

    Returns:
        Status of deleting.
    """

    if 'participant_id' not in event:
        return {
            'statusCode': 400,
            'errorMessage': 'participant_id parameter doesn\'t exist in the API call!'
        }
        
    try:
        participant_id = int(event['participant_id'])
    except:
        return {
            'statusCode': 400,
            'errorMessage': 'participant_id value is not an integer number!'
        }

    # get current poll id
    try:
        current_poll_id = get_current_poll_id()
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }

    # delete the participant
    participants_table = dynamodb.Table('fp.participants')

    try:
        response = participants_table.delete_item(
            Key={
                'poll': current_poll_id,
                'added': participant_id
            },
            ReturnValues='ALL_OLD'
        )
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }

    if 'Attributes' not in response:
        return {
            'statusCode': 400,
            'errorMessage': 'Participant ' + str(participant_id) + ' doesn\'t exist in the current poll!'
        }

    return {
        'statusCode': 200,
        'statusMessage': 'Participant ' + str(participant_id) + ' is successfully deleted!'
    }