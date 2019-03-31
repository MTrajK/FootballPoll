import re

person = 'sad сда сад Sdas q21 3094dASAD САДСАДс сд'
search_not_allowed = '[^\w\d ]'

if re.search(search_not_allowed, person):
    print('bad')
else:
    print('good')