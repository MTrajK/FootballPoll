import csv
import sys
import os
import datetime

def parse_file():
    """Reads doodle_results.csv file and parse the results.

    Returns:
        3 tables: polls, participants, persons.
    """

    def epoch_time(date_time, date_time_format='%Y/%m/%d'):
        """Converts string with date and time to number (total milliseconds frin 1970).
        
        Parameters:
            date_time: Date time.
            date_time_format: Date time format.
        
        Returns:
            Epoch time (timestamp, total milliseconds from 1970).
        """
        
        dt = datetime.datetime.strptime(date_time, date_time_format)
        
        return int(dt.timestamp() * 1000)

    milliseconds_in_hour = 1000 * 60 * 60
    read_file = os.path.dirname(os.path.abspath(__file__)) + '\\doodle_results.csv'

    polls_table = []
    participants = []
    persons = {}

    with open(read_file, encoding='utf-8', mode='r') as file:
        reader = csv.reader(file)
        next(reader) # ignore the columns names

        print("All rows:")

        poll = 0

        for row in reader:
            start = epoch_time(row[1])
            end = epoch_time(row[2])
            dt = epoch_time(row[0] + ' 20:40', '%Y/%m/%d %H:%M')

            polls_table.append({
                'id': poll,
                'start': start,
                'end': end,
                'dt': dt,
                'title': 'Фудбал-INSCALE',
                'note': '/',
                'locDesc': 'ОУ Блаже Конески Аеродром',
                'locUrl': 'https://goo.gl/maps/aivZ5cdPEpz',
                'need': 12,
                'max': 14
            })
            
            added = start

            for i in range(3, len(row)):
                polls = 0
                added += milliseconds_in_hour
                person = row[i]
                friends = 0
                friend = '/'

                findBracket = row[i].find('(')

                if findBracket == -1:
                    polls = 1
                else:
                    person = row[i][:findBracket - 1]
                    friends = 1
                    friend = row[i][findBracket + 1 : -1]

                person = ' '.join(person.lower().split())
                friend = ' '.join(friend.lower().split())

                participants.append({
                    'poll': poll,
                    'added': added,
                    'person': person,
                    'friend': friend
                })

                if person in persons:
                    persons[person]['polls'] += polls
                    persons[person]['friends'] += friends
                else:
                    persons[person] = {
                        'name': person,
                        'polls': polls,
                        'friends': friends
                    }
            
            poll += 1

            # use sys.stdout.buffer.write for printing utf-8 characters
            sys.stdout.buffer.write((', '.join(row) + '\n').encode('utf-8'))

        print("\nAll polls:")
        sys.stdout.buffer.write(str(polls_table).encode('utf-8'))
        print("\n\nAll participants:")
        sys.stdout.buffer.write(str(participants).encode('utf-8'))
        print("\n\nAll persons:")
        sys.stdout.buffer.write(str(persons).encode('utf-8'))

    file.close()

    return (polls_table, participants, list(persons.values()))