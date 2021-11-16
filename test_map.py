"""
    test_yelpInfo.py
    
    Tests the functions in yelpInfo.py
"""

import unittest
import unittest.mock as mock
from unittest.mock import patch

from yelpInfo import query_api, query_resturants, query_one_resturant

INPUT = "input_resturant_search_and_zipcode"
EXPECTED_OUTPUT = "expected"

class GetURLTestCase(unittest.TestCase):
    def setUp(self):
        self.query_api_input_test_params = [
            {
                INPUT: {"term" : "dinner", "location" : "San Francisco, CA"},
                EXPECTED_OUTPUT: "Miller & Lux",
            },
        ]
        self.none_test_params = {INPUT: None, EXPECTED_OUTPUT: None}

    def test_noneyelpInfo(self):
        if self.none_test_params:
            actual_result = query_api(self.none_test_params[INPUT], self.none_test_params[INPUT])
            expected_result = self.none_test_params[EXPECTED_OUTPUT]
            self.assertEqual(actual_result, expected_result)
    def test_query_api(self):
        for test in self.query_api_input_test_params:
                actual_result = query_api(test[INPUT]["term"], test[INPUT]["location"])
                expected_result = test[EXPECTED_OUTPUT]
                self.assertEqual(actual_result, expected_result)

if __name__ == "__main__":
    unittest.main()