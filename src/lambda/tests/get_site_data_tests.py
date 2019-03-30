from context import functions
import sys

response = functions.get_site_data({}, None)
print('Current poll id: ' + str(response['body']['current_poll']))
print('Length polls: ' + str(len(response['body']['polls'])))
print('Length participants: ' + str(len(response['body']['participants'])))
print('Length persons: ' + str(len(response['body']['persons'])))
sys.stdout.buffer.write(str(response).encode('utf-8'))
print()