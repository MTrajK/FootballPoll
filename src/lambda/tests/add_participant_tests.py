import unittest
from context import functions
import time
import sys

class Test_add_participant(unittest.TestCase):

    def test_no_input(self):
        # arrange
        item = {}

        # act
        response = functions.add_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_no_person(self):
        # arrange
        item = {
            'friend': '+1'
        }

        # act
        response = functions.add_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_too_long_person_name(self):
        # arrange
        item = {
            'person': 'aaaaaaaaaaaaaaaa bbbbbbbbbbbbb'
        }

        # act
        response = functions.add_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_too_short_person_name(self):
        # arrange
        item = {
            'person': 'ab'
        }

        # act
        response = functions.add_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_too_long_friend_name(self):
        # arrange
        item = {
            'person': 'name',
            'friend': 'aaaaaaaaaaaaaaaa bbbbbbbbbbbbb'
        }

        # act
        response = functions.add_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_not_valid_chars_person(self):
        # arrange
        item = {
            'person': 'st*ab/',
            'friend': '+1'
        }

        # act
        response = functions.add_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_not_valid_chars_friend(self):
        # arrange
        item = {
            'person': 'name',
            'friend': '(fri@&end)'
        }

        # act
        response = functions.add_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)
    
    def test_good_input_only_person(self):
        # arrange
        item = {
            'person': 'example person'
        }

        # act
        response = functions.add_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 200)

    def test_good_input_person_and_friend(self):
        # arrange
        item = {
            'person': 'example person 2',
            'friend': '+1'
        }

        # act
        response = functions.add_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 200)

if __name__ == '__main__':
    unittest.main()