import sys
import add_participant as ap

item={
    'person': 'Stojce'
}
response = ap.add_participant(item, None)
sys.stdout.buffer.write(str(response).encode('utf-8'))
print()


item={
    'person': 'Zlatko'
}
response = ap.add_participant(item, None)
sys.stdout.buffer.write(str(response).encode('utf-8'))
print()


item={
    'person': 'Мето'
}
response = ap.add_participant(item, None)
sys.stdout.buffer.write(str(response).encode('utf-8'))
print()

item={
    'person': 'Assdad'
}
response = ap.add_participant(item, None)
sys.stdout.buffer.write(str(response).encode('utf-8'))
print()