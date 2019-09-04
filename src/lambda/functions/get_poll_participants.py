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

def query_participants(poll_id, last_evaluated_key = None, second_attempt = False):
    """Query the participants table and returns all results for given poll, if the first attempt failed or has unprocessed keys tries again.

    Parameters:
        poll_id: Poll id.
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
                ExclusiveStartKey=last_evaluated_key
            )
        else:
            response = participants_table.query(
                KeyConditionExpression=Key('poll').eq(poll_id)
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

def get_poll_participants(event, context):
    """Finds all participants from poll_id poll.

    Returns:
        List of all participants from the wanted poll.
    """

    if (event['queryStringParameters'] is None) or ('poll_id' not in event['queryStringParameters']):
        return {
            'statusCode': 400,
            'body': json.dumps({'errorMessage': 'poll_id parameter doesn\'t exist in the API call!'})
        }
        
    try:
        poll_id = int(event['queryStringParameters']['poll_id'])
    except:
        return {
            'statusCode': 400,
            'body': json.dumps({'errorMessage': 'poll_id value is not an integer number!'})
        }

    if poll_id < 0:
        return {
            'statusCode': 400,
            'body': json.dumps({'errorMessage': 'poll_id value shouldn\'t be smaller than 0!'})
        }

    # query participants
    try:
        participants = query_participants(poll_id)
    except Exception:
        return {
            'statusCode': 500,
            'body': json.dumps({'errorMessage': 'Database error!'})
        }

    return {
        'statusCode': 200,
        'body': json.dumps(participants, cls=DecimalEncoder, ensure_ascii=False)
    }