import boto3
import time
import json
        
dynamodb = boto3.resource('dynamodb')
responseHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials' : True }

def get_current_poll_id(second_attempt = False):
    """Tries 2 times to access the config table and takes the current poll id.

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

def delete_item_participants(poll_id, participant_id, second_attempt = False):
    """Tries 2 time to delete the participant, if the first attempt failed tries again.

    Parameters:
        poll_id: Current poll id.
        participant_id: Id of the participant that need to be deleted.
        second_attempt: Flag for the second attempt.

    Returns:
        Status of deleting.
    """

    participants_table = dynamodb.Table('fp.participants')

    try:
        response = participants_table.delete_item(
            Key={
                'poll': poll_id,
                'added': participant_id
            },
            ReturnValues='ALL_OLD'
        )
    except Exception:
        if second_attempt:
            raise Exception('Database error!')

        # tries again if the first attempt failed
        time.sleep(1)
        return delete_item_participants(poll_id, participant_id, True)
    
    if 'Attributes' not in response:
        return {
            'statusCode': 400,
            'headers': responseHeaders,
            'body': json.dumps({'errorMessage': 'Participant ' + str(participant_id) + ' doesn\'t exist in the current poll!'})
        }

    return {
        'statusCode': 200,
            'headers': responseHeaders,
        'body': json.dumps({'statusMessage': 'Participant ' + str(participant_id) + ' is successfully deleted!'})
    }

def delete_participant(event, context):
    """Deletes a participant from the current poll.

    Returns:
        Status of deleting.
    """

    if event['body'] is None:
        return {
            'statusCode': 400,
            'headers': responseHeaders,
            'body': json.dumps({'errorMessage': 'No request body!'})
        }

    try:
        requestBody = json.loads(event['body'])
    except:
        return {
            'statusCode': 400,
            'headers': responseHeaders,
            'body': json.dumps({'errorMessage': 'Bad request body!'})
        }
    
    if type(requestBody) != dict:
        return {
            'statusCode': 400,
            'headers': responseHeaders,
            'body': json.dumps({'errorMessage': 'Bad request body!'})
        }

    if 'participant_id' not in requestBody:
        return {
            'statusCode': 400,
            'headers': responseHeaders,
            'body': json.dumps({'errorMessage': 'participant_id parameter doesn\'t exist in the API call!'})
        }
        
    try:
        participant_id = int(requestBody['participant_id'])
    except:
        return {
            'statusCode': 400,
            'headers': responseHeaders,
            'body': json.dumps({'errorMessage': 'participant_id value is not an integer number!'})
        }

    # get current poll id
    try:
        current_poll_id = get_current_poll_id()
    except Exception:
        return {
            'statusCode': 500,
            'headers': responseHeaders,
            'body': json.dumps({'errorMessage': 'Database error!'})
        }

    # delete the participant
    try:
        delete_status = delete_item_participants(current_poll_id, participant_id)
    except Exception:
        return {
            'statusCode': 500,
            'headers': responseHeaders,
            'body': json.dumps({'errorMessage': 'Database error!'})
        }

    return delete_status