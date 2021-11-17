import unittest
from routes import timeConvert, getFriendsList,getFavoriteRestaurantsList, getPostsList

class TestRoutes(unittest.TestCase):

    def test_time_convert(self):
        result = timeConvert(1700)
        self.assertEqual(result,"5:00PM")
    
    def test_friends_list(self):
        result = getFriendsList()
        self.assertIsNotNone(result)

    def test_favorite_restaurants_list(self):
        result = getFavoriteRestaurantsList()
        self.assertIsNotNone(result)

    
    def test_Posts_list(self):
        result = getPostsList
        self.assertIsNotNone(result)

if __name__ == '__main__':
    unittest.main()