import sys
from context import functions

item={
    'person': 'Stojce'
}
response = functions.add_participant(item, None)
sys.stdout.buffer.write(str(response).encode('utf-8'))
print()


item={
    'person': 'Zlatko'
}
response = functions.add_participant(item, None)
sys.stdout.buffer.write(str(response).encode('utf-8'))
print()


item={
    'person': 'Мето'
}
response = functions.add_participant(item, None)
sys.stdout.buffer.write(str(response).encode('utf-8'))
print()

item={
    'person': 'Assdad'
}
response = functions.add_participant(item, None)
sys.stdout.buffer.write(str(response).encode('utf-8'))
print()