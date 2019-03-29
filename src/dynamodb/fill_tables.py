import parse_doodle_results as pdr
import time
import sys
import boto3

polls, participants, persons = pdr.parse_file()
dynamodb = boto3.resource('dynamodb')

def init_table(table_name):
    """Creates a resource representing an Amazon DynamoDB table.

    Parameters:
        table_name: Name of the Amazon DynamoDB table.

    Returns:
        Amazon DynamoDB resoruce from the wanted table.
    """

    print('\n============================================')
    print('Start filling the ' + table_name + ' table...')
    print('============================================')
    
    return dynamodb.Table(table_name)

def wait(wait_time):
    """Stops the program for X seconds.

    Parameters:
        wait_time: How many seconds & milliseconds should the programm sleep (1.1 = 1 second and 100 milliseconds).
    """

    print('Wait ' + str(wait_time) + ' seconds...')
    time.sleep(1)

def put_item(table, item, table_name, second_trial=False):
    """Puts/adds an item to an Amazon DynamoDB table. Tries again if the first trial is unsuccessful.
    
    Parameters:
        table: Amazon DynamoDB resoruce of the table.
        item: A python object with attributes specific for this table.
        table_name: Name of the Amazon DynamoDB table.
        second_trial: Flag for the second trial.
    """

    try:
        table.put_item(
            Item=item
        )
    except Exception as e:
        if second_trial:
            raise Exception('Second trial failed!')
        
        print('Error!')
        print(e)

        wait(1)
        print('Trying to add the item adain!')
        put_item(table, item, table_name, True)

    print('Successfully added item into ' + table_name +' table!')
    sys.stdout.buffer.write(str(item).encode('utf-8'))
    print()

# fill polls table
table_name = 'fp.polls'
polls_table = init_table(table_name)
for poll in polls:
    put_item(polls_table, poll, table_name)
    wait(1) # WCU = 1

# fill participants table
table_name = 'fp.participants'
participants_table = init_table(table_name)
idx = 1
for participant in participants:
    put_item(participants_table, participant, table_name)
    if idx % 2 == 0:
        wait(1) # WCU = 2
    idx += 1

# fill persons table
table_name = 'fp.persons'
persons_table = init_table(table_name)
idx = 1
for person in persons:
    put_item(persons_table, person, table_name)
    if idx % 2 == 0:
        wait(1) # WCU = 2
    idx += 1

# fill config table
table_name = 'fp.config'
config_table = init_table(table_name)
item = {
    'id': 'CurrentPoll',
    'value': str(len(polls) - 1)
}
put_item(config_table, item, table_name)