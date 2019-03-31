import unittest
from context import functions
import time
import sys

class Test_delete_participant(unittest.TestCase):

    def test_item_not_exist_input(self):
        # arrange
        item = {
            'participant_id' : 123213
        }

        # act
        response = functions.delete_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_no_input(self):
        # arrange
        item = {}

        # act
        response = functions.delete_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_no_integer_input(self):
        # arrange
        item = {
            'participant_id' : 'asd'
        }

        # act
        response = functions.delete_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_good_input(self):
        # arrange
        item = {
            'participant_id' : 1554074065304
        }

        # act
        response = functions.delete_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 200)

    def test_good_input2(self):
        # arrange
        item = {
            'participant_id' : 1554074134028
        }

        # act
        response = functions.delete_participant(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 200)

if __name__ == '__main__':
    unittest.main()