import boto3
import time
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

def batch_get_item_polls(keys, second_attempt = False):
    """Performs batch get items on polls table, if the first attempt failed or has unprocessed keys tries again.

    Parameters:
        keys: List with keys of polls.
        second_attempt: Flag for the second attempt.

    Returns:
        List with max 4 polls.
    """

    result = []
        
    if len(keys) != 0:
        try:
            response = dynamodb.batch_get_item(
                RequestItems={
                    'fp.polls': {
                        'Keys': keys
                    }
                }   
            )
        except Exception:
            if second_attempt:
                raise Exception('Database error!')

            # tries again if the first attempt failed
            time.sleep(1)
            return batch_get_item_polls(keys, True)
        
        # successful response
        if ('Responses' in response) and ('fp.polls' in response['Responses']):
            result = response['Responses']['fp.polls']
        
        if (not second_attempt) and ('UnprocessedKeys' in response) and ('fp.polls' in response['UnprocessedKeys']) and ('Keys' in response['UnprocessedKeys']['fp.polls']):
            # tries again if there are unprocessed keys
            try:
                time.sleep(1)
                second_result = batch_get_item_polls(response['UnprocessedKeys']['fp.polls']['Keys'], True)
            except Exception:
                # the first response is successful, returns only the results from the first response
                pass
            else:
                result.append(second_result)
        
    return result

def scan_persons(last_evaluated_key = None, second_attempt = False):
    """Performs batch get items on polls table, if the first attempt failed or has unprocessed keys tries again.

    Parameters:
        keys: List with keys of polls.
        second_attempt: Flag for the second attempt.

    Returns:
        List with max 4 polls.
    """

    result = []

    persons_table = dynamodb.Table('fp.persons')

    try:
        response = persons_table.scan(ExclusiveStartKey=last_evaluated_key) if last_evaluated_key else persons_table.scan()
    except Exception:
        if second_attempt:
            raise Exception('Database error!')
        
        # tries again if the first attempt failed
        time.sleep(1)
        return scan_persons(last_evaluated_key, True)

    if 'Items' in response:
        result = response['Items']

    if (not second_attempt) and ('LastEvaluatedKey' in response):
        # tries again if there are unprocessed keys
        try:
            time.sleep(1)
            second_result = scan_persons(response['LastEvaluatedKey'], True)
        except Exception:
            # the first response is successful, returns only the results from the first response
            pass
        else:
            result.append(second_result)
    
    return result

def get_site_data(event, context):
    """Returns the current poll id, 4 polls (current and 3 older), current pool participants, all persons

    Returns:
        Object with current poll id, list with max 4 polls, lsit with participants, list with persons
    """

    # get current poll id
    try:
        current_poll_id = get_current_poll_id()
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }
    
    # get polls
    first_poll = max(current_poll_id - 3, 0)
    keys = [{'id': id} for id in range(first_poll, current_poll_id + 1)]

    try:
        polls_response = batch_get_item_polls(keys)
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }
        
    # get participants
    participants_table = dynamodb.Table('fp.participants')

    participants = []

    try:
        participants_response = participants_table.query(
            KeyConditionExpression=Key('poll').eq(current_poll_id)
        )
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }

    if 'Items' in participants_response:
        participants = participants_response['Items']

    # get persons
    try:
        persons_response = scan_persons()
    except Exception:
        return {
            'statusCode': 500,
            'errorMessage': 'Database error!'
        }

    return {
        'statusCode': 200,
        'body': {
            'current_poll': current_poll_id,
            'polls': polls_response,
            'participants': participants,
            'persons': persons_response
        }
    }
