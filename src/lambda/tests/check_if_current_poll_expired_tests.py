import unittest
from context import functions
import time
import sys

class Test_check_if_current_poll_expired(unittest.TestCase):
    
    def test_check_if_current_poll_expired(self):
        # act
        response = functions.check_if_current_poll_expired(None, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 200)

if __name__ == '__main__':
    unittest.main()