import boto3
import time
import json
import decimal
        
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

def get_old_polls(event, context):
    """Returns at most 5 polls older than the last_poll.

    Returns:
        List of max 5 polls.
    """

    if (event['queryStringParameters'] is None) or ('last_poll' not in event['queryStringParameters']):
        return {
            'statusCode': 400,
            'body': json.dumps({'errorMessage': 'last_poll parameter doesn\'t exist in the API call!'})
        }

    try:
        last_poll = int(event['queryStringParameters']['last_poll'])
    except:
        return {
            'statusCode': 400,
            'body': json.dumps({'errorMessage': 'last_poll value is not an integer number!'})
        }

    first_poll = max(last_poll - 5, 0)
    keys = [{'id': id} for id in range(first_poll, last_poll)]

    try:
        polls = batch_get_item_polls(keys)
    except Exception:
        return {
            'statusCode': 500,
            'body': json.dumps({'errorMessage': 'Database error!'})
        }

    return {
        'statusCode': 200,
        'body': json.dumps(polls, cls=DecimalEncoder, ensure_ascii=False)
    }