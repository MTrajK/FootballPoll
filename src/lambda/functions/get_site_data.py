import boto3
import time
import json
import decimal
from boto3.dynamodb.conditions import Key
        
dynamodb = boto3.resource('dynamodb')

class DecimalEncoder(json.JSONEncoder):
	"""Helper class to convert a DynamoDB decimal/item to JSON
	"""
	
	def default(self, o):
		if isinstance(o, decimal.Decimal):
			if o % 1 > 0:
				return float(o)
			else:
				return int(o)
		return super(DecimalEncoder, self).default(o)

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
                raise Exception('Database error!')
            
            result.append(second_result)
        
    return result
    
def query_participants(poll_id, last_evaluated_key = None, second_attempt = False):
    """Query the participants table and returns all results for given poll, if the first attempt failed or has unprocessed keys tries again.

    Parameters:
        poll_id: Current poll id.
        last_evaluated_key: Last evaluated key, if some data is not read.
        second_attempt: Flag for the second attempt.

    Returns:
        List with participants.
    """
    
    result = []

    participants_table = dynamodb.Table('fp.participants')

    try:
        if last_evaluated_key:
            response = participants_table.query(
                KeyConditionExpression=Key('poll').eq(poll_id),
                ConsistentRead=True,
                ExclusiveStartKey=last_evaluated_key
            )
        else:
            response = participants_table.query(
                KeyConditionExpression=Key('poll').eq(poll_id),
                ConsistentRead=True
            )
    except Exception:
        if second_attempt:
            raise Exception('Database error!')
        
        # tries again if the first attempt failed
        time.sleep(1)
        return query_participants(poll_id, last_evaluated_key, True)
       
    if 'Items' in response:
        result = response['Items']

    if (not second_attempt) and ('LastEvaluatedKey' in response):
        # tries again if there are unprocessed keys
        try:
            time.sleep(1)
            second_result = query_participants(poll_id, response['LastEvaluatedKey'], True)
        except Exception:
            raise Exception('Database error!')
            
        result.append(second_result)
    
    return result

def scan_persons(last_evaluated_key = None, second_attempt = False):
    """Scans the persons table and returns all results, if the first attempt failed or has unprocessed keys tries again.

    Parameters:
        last_evaluated_key: Last evaluated key, if some data is not read.
        second_attempt: Flag for the second attempt.

    Returns:
        List with persons.
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
            raise Exception('Database error!')
            
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
            'headers': { 'Access-Control-Allow-Origin': '*' },
            'body': json.dumps({'errorMessage': 'Database error!'})
        }
    
    # get polls
    first_poll = max(current_poll_id - 3, 0)
    keys = [{'id': id} for id in range(first_poll, current_poll_id + 1)]

    try:
        polls = batch_get_item_polls(keys)
    except Exception:
        return {
            'statusCode': 500,
            'headers': { 'Access-Control-Allow-Origin': '*' },
            'body': json.dumps({'errorMessage': 'Database error!'})
        }
        
    # query participants
    try:
        participants = query_participants(current_poll_id)
    except Exception:
        return {
            'statusCode': 500,
            'headers': { 'Access-Control-Allow-Origin': '*' },
            'body': json.dumps({'errorMessage': 'Database error!'})
        }

    # get persons
    try:
        persons = scan_persons()
    except Exception:
        return {
            'statusCode': 500,
            'headers': { 'Access-Control-Allow-Origin': '*' },
            'body': json.dumps({'errorMessage': 'Database error!'})
        }

    response = {
        'current_poll': current_poll_id,
        'polls': polls,
        'participants': participants,
        'persons': persons
    }
    
    return {
        'statusCode': 200,
        'headers': { 'Access-Control-Allow-Origin': '*' },
        'body': json.dumps(response, cls=DecimalEncoder, ensure_ascii=False)
    }
