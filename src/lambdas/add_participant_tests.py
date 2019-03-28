import sys
import add_participant as ap

item={
    'person': 'Assdad',
    'friend': '+1'
}
response = ap.add_participant(item, None)
sys.stdout.buffer.write(str(response).encode('utf-8'))
print()