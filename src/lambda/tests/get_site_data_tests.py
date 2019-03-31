import unittest
from context import functions
import time
import sys

class Test_get_site_data(unittest.TestCase):
    
    def test_get_site_data(self):
        # act
        response = functions.get_site_data(None, None)
        sys.stdout.buffer.write(str(response).encode('utf-8'))
        print()
        time.sleep(1)

        # assert
        self.assertEqual(response['statusCode'], 200)

if __name__ == '__main__':
    unittest.main()