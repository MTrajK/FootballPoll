import boto3
        
dynamodb = boto3.resource('dynamodb')

def get_old_polls(event, context):
    """Returns at most 5 polls older than the last_poll.

    Returns:
        List of max 5 polls.
    """

    if 'last_poll' not in event:
        return {
            'statusCode': 400,
            'errorMessage': 'last_poll parameter doesn\'t exist in the API call!'
        }

    try:
        lastPoll = int(event['last_poll'])
    except:
        return {
            'statusCode': 400,
            'errorMessage': 'last_poll value is not an integer number!'
        }

    polls_table = dynamodb.Table('fp.polls')

    polls = []

    firstPoll = max(lastPoll - 5, 0)

    for i in range(firstPoll, lastPoll):
        try:
            response = polls_table.get_item(
                Key={
                    'id': i
                }
            )
        except Exception as e:
            return {
                'statusCode': 500,
                'errorMessage': 'Database error!'
            }
        else:
            if 'Item' not in response:
                return {
                    'statusCode': 400,
                    'errorMessage': 'Poll id: ' + lastPoll + ' doesn\'t exist in the polls table!'
                }

            polls.append(response['Item'])

    return {
        'statusCode': 200,
        'body': polls
    }