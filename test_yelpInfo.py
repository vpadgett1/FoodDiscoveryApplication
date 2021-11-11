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
            {
                INPUT: {"term" : "breakfast", "location" : "30303"},
                EXPECTED_OUTPUT: "Atlanta Breakfast Club",
            }
        ]
        self.query_one_resturant_test_params = [
            {
                INPUT: {"term" : "dinner", "location" : "San Francisco, CA"},
                EXPECTED_OUTPUT: {'names': ['Miller & Lux'], 'locations': [{'address1': '700 Terry A Francois Blvd', 'address2': '', 'address3': '', 'city': 'San Francisco', 'zip_code': '94158', 'country': 'US', 'state': 'CA', 'display_address': ['700 Terry A Francois Blvd', 'San Francisco, CA 94158'], 'cross_streets': ''}], 'hours': [['1700', '2300']], 'phone_numbers': ['(415) 872-6699'], 'ratings': [4.5], 'resturant_type_categories': [[{'alias': 'tradamerican', 'title': 'American (Traditional)'}, {'alias': 'steak', 'title': 'Steakhouses'}, {'alias': 'seafood', 'title': 'Seafood'}]], 'pictures': ['https://s3-media4.fl.yelpcdn.com/bphoto/sR8PcJ_ASWEIOphlCqVfFw/o.jpg']}
            }, 
            {
                INPUT: {"term" : "breakfast", "location" : "30303"},
                EXPECTED_OUTPUT: {'names': ['Atlanta Breakfast Club'], 'locations': [{'address1': '249 Ivan Allen Jr Blvd', 'address2': '', 'address3': '', 'city': 'Atlanta', 'zip_code': '30313', 'country': 'US', 'state': 'GA', 'display_address': ['249 Ivan Allen Jr Blvd', 'Atlanta, GA 30313'], 'cross_streets': ''}], 'hours': [['0630', '1500']], 'phone_numbers': ['(470) 428-3825'], 'ratings': [4.5], 'resturant_type_categories': [[{'alias': 'southern', 'title': 'Southern'}, {'alias': 'breakfast_brunch', 'title': 'Breakfast & Brunch'}, {'alias': 'tradamerican', 'title': 'American (Traditional)'}]], 'pictures': ['https://s3-media1.fl.yelpcdn.com/bphoto/cGL6b-pSEqzaNrF32gXd2w/o.jpg']}
            },
        ]
        self.query_resturant_input_test_params = [
            {
                INPUT: {"term" : "dinner", "location" : "San Francisco, CA"},
                EXPECTED_OUTPUT: {'names': ['Miller & Lux', "The Tailor's Son", 'Dumpling House'], 'locations': [{'address1': '700 Terry A Francois Blvd', 'address2': '', 'address3': '', 'city': 'San Francisco', 'zip_code': '94158', 'country': 'US', 'state': 'CA', 'display_address': ['700 Terry A Francois Blvd', 'San Francisco, CA 94158'], 'cross_streets': ''}, {'address1': '2049 Fillmore St', 'address2': '', 'address3': None, 'city': 'San Francisco', 'zip_code': '94115', 'country': 'US', 'state': 'CA', 'display_address': ['2049 Fillmore St', 'San Francisco, CA 94115'], 'cross_streets': 'Pine St & California St'}, {'address1': '335 Noe St', 'address2': '', 'address3': None, 'city': 'San Francisco', 'zip_code': '94114', 'country': 'US', 'state': 'CA', 'display_address': ['335 Noe St', 'San Francisco, CA 94114'], 'cross_streets': '17th St & 16th St'}], 'hours': [['1700', '2300'], ['1700', '2200'], ['1100', '1430']], 'phone_numbers': ['(415) 872-6699', '(415) 673-7200', '(415) 829-2789'], 'ratings': [4.5, 4.0, 4.5], 'resturant_type_categories': [[{'alias': 'tradamerican', 'title': 'American (Traditional)'}, {'alias': 'steak', 'title': 'Steakhouses'}, {'alias': 'seafood', 'title': 'Seafood'}], [{'alias': 'italian', 'title': 'Italian'}, {'alias': 'cocktailbars', 'title': 'Cocktail Bars'}], [{'alias': 'dimsum', 'title': 'Dim Sum'}, {'alias': 'asianfusion', 'title': 'Asian Fusion'}]], 'pictures': ['https://s3-media4.fl.yelpcdn.com/bphoto/sR8PcJ_ASWEIOphlCqVfFw/o.jpg', 'https://s3-media2.fl.yelpcdn.com/bphoto/P4NfQ7KFvHpcfBcOwxBZJA/o.jpg', 'https://s3-media2.fl.yelpcdn.com/bphoto/DNfqq1zYxbJ-gsalml7wng/o.jpg']}
            }, 
            {
                INPUT: {"term" : "breakfast", "location" : "30303"},
                EXPECTED_OUTPUT: {'names': ['Atlanta Breakfast Club', 'Breakfast At Barneys', 'The Food Shoppe'], 'locations': [{'address1': '249 Ivan Allen Jr Blvd', 'address2': '', 'address3': '', 'city': 'Atlanta', 'zip_code': '30313', 'country': 'US', 'state': 'GA', 'display_address': ['249 Ivan Allen Jr Blvd', 'Atlanta, GA 30313'], 'cross_streets': ''}, {'address1': '349 Decatur St SE', 'address2': '', 'address3': '', 'city': 'Atlanta', 'zip_code': '30312', 'country': 'US', 'state': 'GA', 'display_address': ['349 Decatur St SE', 'Atlanta, GA 30312'], 'cross_streets': ''}, {'address1': '123 Luckie St NW', 'address2': 'Ste 108', 'address3': '', 'city': 'Atlanta', 'zip_code': '30303', 'country': 'US', 'state': 'GA', 'display_address': ['123 Luckie St NW', 'Ste 108', 'Atlanta, GA 30303'], 'cross_streets': ''}], 'hours': [['0630', '1500'], ['0700', '2000'], ['0830', '1600']], 'phone_numbers': ['(470) 428-3825', '(404) 549-6042', '(404) 600-8443'], 'ratings': [4.5, 4.0, 4.5], 'resturant_type_categories': [[{'alias': 'southern', 'title': 'Southern'}, {'alias': 'breakfast_brunch', 'title': 'Breakfast & Brunch'}, {'alias': 'tradamerican', 'title': 'American (Traditional)'}], [{'alias': 'breakfast_brunch', 'title': 'Breakfast & Brunch'}, {'alias': 'newamerican', 'title': 'American (New)'}, {'alias': 'champagne_bars', 'title': 'Champagne Bars'}], [{'alias': 'cajun', 'title': 'Cajun/Creole'}, {'alias': 'breakfast_brunch', 'title': 'Breakfast & Brunch'}]], 'pictures': ['https://s3-media1.fl.yelpcdn.com/bphoto/cGL6b-pSEqzaNrF32gXd2w/o.jpg', 'https://s3-media3.fl.yelpcdn.com/bphoto/Emhp7nDXxZ1s1Sbc11T-9g/o.jpg', 'https://s3-media3.fl.yelpcdn.com/bphoto/TeCMzM8CRCa21rA_KZQaGw/o.jpg']}
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
    def test_query_one_resturant(self):
        for test in self.query_one_resturant_test_params:
                actual_result = query_one_resturant(test[INPUT]["term"], test[INPUT]["location"])
                expected_result = test[EXPECTED_OUTPUT]
                self.assertEqual(actual_result, expected_result)
    def test_query_resturant(self):
        for test in self.query_resturant_input_test_params:
                actual_result = query_resturants(test[INPUT]["term"], test[INPUT]["location"])
                expected_result = test[EXPECTED_OUTPUT]
                self.maxDiff = None
                self.assertEqual(actual_result, expected_result)

if __name__ == "__main__":
    unittest.main()