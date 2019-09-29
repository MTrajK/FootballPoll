import boto3
import time
import datetime
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')

def get_current_poll_id():
    """Tries to access the config table and takes the current poll id, tries until the query succeeded.

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
        # tries again
        time.sleep(1)
        return get_current_poll_id()
        
    return int(response['Item']['value'])

def get_item_polls(poll_id):
    """Tries to access the polls table and take the current poll, tries until the query succeeded.

    Parameters:
        poll_id: Current poll id.

    Returns:
        Current poll item.
    """

    polls_table = dynamodb.Table('fp.polls')

    try:
        response = polls_table.get_item(
            Key={
                'id': poll_id
            }
        )
    except Exception:
        # tries again
        time.sleep(1)
        return get_item_polls(poll_id)
        
    return response['Item']

def query_participants(poll_id, last_evaluated_key = None):
    """Query the participants table and returns all results for given poll, tries until the query succeeded.

    Parameters:
        poll_id: Current poll id.
        last_evaluated_key: Last evaluated key, if some data is not read.

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
        # tries again
        time.sleep(1)
        return query_participants(poll_id, last_evaluated_key)
       
    if 'Items' in response:
        result = response['Items']

    if 'LastEvaluatedKey' in response:
        # tries again if there are unprocessed keys
        time.sleep(1)
        second_result = query_participants(poll_id, response['LastEvaluatedKey'])
        result.append(second_result)
    
    return result

def delete_item_participants(poll_id, participants):
    """Deletes all participants, tries until the query succeeded.

    Parameters:
        poll_id: Current poll id.
        participants: List with participants.
    """

    if len(participants) != 0:
        participants_table = dynamodb.Table('fp.participants')

        try:
            response = participants_table.delete_item(
                Key={
                    'poll': poll_id,
                    'added': participants[0]['added']
                },
                ReturnValues='ALL_OLD'
            )
        except Exception:
            # tries again
            time.sleep(1)
            delete_item_participants(poll_id, participants)
        else:
            # ignores only the deleted participant
            delete_item_participants(poll_id, participants[1:])

def scan_persons(last_evaluated_key = None):
    """Scans the persons table and returns all results, tries until the query succeeded.

    Parameters:
        last_evaluated_key: Last evaluated key, if some data is not read.

    Returns:
        List with persons.
    """

    result = []

    persons_table = dynamodb.Table('fp.persons')

    try:
        response = persons_table.scan(ExclusiveStartKey=last_evaluated_key) if last_evaluated_key else persons_table.scan()
    except Exception:
        # tries again
        time.sleep(1)
        return scan_persons(last_evaluated_key)

    if 'Items' in response:
        result = response['Items']

    if 'LastEvaluatedKey' in response:
        # tries again if there are unprocessed keys
        time.sleep(1)
        second_result = scan_persons(response['LastEvaluatedKey'])
        result.append(second_result)
    
    return result

def batch_write_item_persons(item):
    """Tries to add new persons, tries until the query succeeded.

    Parameters:
        item: Object with table name, persons and type of requests.
    """

    if len(item['fp.persons']) != 0:
        try:
            response = dynamodb.batch_write_item(
                RequestItems=item
            )
        except Exception:
            # tries again
            time.sleep(1)
            batch_write_item_persons(item)
        else:
            if ('UnprocessedItems' in response) and ('fp.persons' in response['UnprocessedItems']):
                # tries again if there are unprocessed items
                time.sleep(1)
                batch_write_item_persons(response['UnprocessedItems'])

def update_item_persons(persons):
    """Tries to update persons, tries until the query succeeded.

    Parameters:
        persons: List with persons.
    """

    if len(persons) != 0:
        persons_table = dynamodb.Table('fp.persons')

        try:
            persons_table.update_item(
                Key={
                    'name': persons[0]['name']
                },
                UpdateExpression="SET #polls= :polls, #friends= :friends",
                ExpressionAttributeNames={
                    '#polls': 'polls',
                    '#friends': 'friends'
                },
                ExpressionAttributeValues={
                    ':polls': persons[0]['polls'],
                    ':friends': persons[0]['friends']
                }
            )
        except Exception:
            # tries again
            time.sleep(1)
            update_item_persons(persons)
        else:
            # ignores only the updated person
            update_item_persons(persons[1:])

def put_item_polls(item):
    """Tries to add the new poll until the query succeeded.

    Parameters:
        item: New polls item.
    """

    polls_table = dynamodb.Table('fp.polls')

    try:
        polls_table.put_item(
            Item=item
        )
    except Exception:
        # tries again
        time.sleep(1)
        put_item_polls(item)

def update_item_config(new_poll_id):
    """Tries to update the config (new current poll id) until the query succeeded.

    Parameters:
        new_poll_id: New poll id.
    """

    config_table = dynamodb.Table('fp.config')

    try:
        config_table.update_item(
            Key={
                'id': 'CurrentPoll'
            },
            UpdateExpression="SET #value = :value",
            ExpressionAttributeNames={
                '#value': 'value'
            },
            ExpressionAttributeValues={
                ':value': new_poll_id
            }
        )
    except Exception:
        # tries again
        time.sleep(1)
        update_item_config(new_poll_id)

def check_if_current_poll_expired(event, context):
    """ Checks if the current poll expired.
    If the current poll is expired then creates a new poll and updates the persons statistics.

    Returns:
        Status of the function.
    """

    # get current id
    current_poll_id = get_current_poll_id()

    # get current poll
    current_poll = get_item_polls(current_poll_id)

    # check if the current poll expired
    date_now = int(datetime.datetime.now().timestamp() * 1000)

    if current_poll['end'] > date_now:
        return {
            'statusCode': 400,
            'statusMessage': 'The current poll is still valid!'
        }

    # get current participants
    participants = query_participants(current_poll_id)

    # check if there are enough participats for the game (at least 2 participants could miss)
    if len(participants) < current_poll['need'] - 2:
        # if there are less participants, then delete all of them
        delete_item_participants(current_poll_id, participants)
    else:
        # if there are enough participants update players and participants
        all_poll_persons = {}
        
        # find all unique persons from the current poll
        for participant in participants:
            person = participant['person']

            if person not in all_poll_persons:
                all_poll_persons[person] = {
                    'name': person,
                    'friends': 0,
                    'polls': 0
                }
                
            if participant['friend'] == '/':
                all_poll_persons[person]['polls'] += 1
            else:
                all_poll_persons[person]['friends'] += 1
                
        # get persons
        persons = scan_persons()

        db_persons = {}

        for person in persons:
            db_persons[person['name']] = person
    
        # find which unique persons from the current poll exist in the db and which are new
        old_persons = []
        new_persons = []
        
        for name in all_poll_persons.keys():
            if name in db_persons:
                # exists in the db
                old_persons.append({
                    'name': name,
                    'friends': all_poll_persons[name]['friends'] + db_persons[name]['friends'],
                    'polls': all_poll_persons[name]['polls'] + db_persons[name]['polls']
                })
            else:
                # doesn't exist in the db
                new_persons.append(all_poll_persons[name])

        # batch write - add new persons (if there are)
        if len(new_persons) > 0:
            batch_write_item_persons({
                'fp.persons' : [
                    { 
                        'PutRequest': { 
                            'Item': new_person
                        } 
                    } 
                for new_person in new_persons]
            })

        # update persons (if there are persons that need to be updated)
        if len(old_persons) > 0:
            update_item_persons(old_persons)

    # add new poll
    new_poll_id = current_poll_id + 1
    week_milliseconds = 1000 * 60 * 60 * 24 * 7

    put_item_polls({
        'id': new_poll_id,
        'start': current_poll['end'], # because the end and dt dates can be changed
        'end': current_poll['end'] + week_milliseconds,
        'dt': current_poll['dt'] + week_milliseconds,
        'title': current_poll['title'],
        'note': current_poll['note'],
        'locDesc': current_poll['locDesc'],
        'locUrl': current_poll['locUrl'],
        'need': current_poll['need'],
        'max': current_poll['max']
    })
    
    # update current id
    update_item_config(new_poll_id)

    return {
        'statusCode': 200,
        'statusMessage': 'New poll is started successfully!'
    }