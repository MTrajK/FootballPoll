import unittest
from context import functions
import time
import sys

class Test_update_current_poll(unittest.TestCase):

    def test_no_input(self):
        # arrange
        item = {}

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 403)

    def test_no_admin_password(self):
        # arrange
        item = {
            'admin_name': 'adsas'
        }

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 403)
    
    def test_no_admin_name(self):
        # arrange
        item = {
            'admin_password': 'adsas'
        }

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 403)

    def test_no_admin_doesnt_exist(self):
        # arrange
        item = {
            'admin_name': 'adsas',
            'admin_password': 'adsas'
        }

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 403)

    def test_no_wrong_password(self):
        # arrange
        item = {
            'admin_name': 'example',
            'admin_password': 'adsas'
        }

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 403)

    def test_nothing_to_update(self):
        # arrange
        item = {
            'admin_name': 'example',
            'admin_password': 'example'
        }

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_too_long_title(self):
        # arrange
        item = {
            'admin_name': 'example',
            'admin_password': 'example',
            'title': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        }

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_not_integer(self):
        # arrange
        item = {
            'admin_name': 'example',
            'admin_password': 'example',
            'max': 'abc'
        }

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_dt_bigger_than_end(self):
        # arrange
        item = {
            'admin_name': 'example',
            'admin_password': 'example',
            'dt': 15600000,
            'end': 10000000
        }

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_need_bigger_than_max(self):
        # arrange
        item = {
            'admin_name': 'example',
            'admin_password': 'example',
            'need': 15,
            'max': 10
        }

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 400)

    def test_good_input(self):
        # arrange
        item = {
            'admin_name': 'example',
            'admin_password': 'example',
            'title': 'something new',
            'desc': 'something new',
            'locDesc': 'something new',
            'need': 11,
            'max': 11
        }

        # act
        response = functions.update_current_poll(item, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 200)

if __name__ == '__main__':
    unittest.main()