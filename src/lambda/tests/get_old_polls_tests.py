import unittest
from context import functions
import time
import sys

class Test_get_old_polls(unittest.TestCase):

    def test_good_input(self):
        # arrange
        item = {
            'last_poll' : 10
        }

        # act
        response = functions.get_old_polls(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 200)

    def test_negative_input(self):
        # arrange
        item = {
            'last_poll' : -3
        }

        # act
        response = functions.get_old_polls(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 200)

    def test_big_input(self):
        # arrange
        item = {
            'last_poll' : 123213
        }

        # act
        response = functions.get_old_polls(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 200)

    def test_no_input(self):
        # arrange
        item = {}

        # act
        response = functions.get_old_polls(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_no_integer_input(self):
        # arrange
        item = {
            'last_poll' : 'asd'
        }

        # act
        response = functions.get_old_polls(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

if __name__ == '__main__':
    unittest.main()