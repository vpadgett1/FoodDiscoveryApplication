# Yelp Fusion no longer uses OAuth as of December 7, 2017.
# You no longer need to provide Client ID to fetch Data
# It now uses private keys to authenticate requests (API Key)
# You can find it on
# https://www.yelp.com/developers/v3/manage_app
import argparse
import json
import pprint
import requests
import sys
import urllib
import os
from dotenv import load_dotenv, find_dotenv

# This client code can run on Python 2.x or 3.x.  Your imports can be
# simpler if you only need one of those.
# For Python 3.0 and later
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.parse import urlencode

API_KEY = os.environ.get("YelpAPIKey")


# API constants, you shouldn't have to change these.
API_HOST = "https://api.yelp.com"
SEARCH_PATH = "/v3/businesses/search"
BUSINESS_PATH = "/v3/businesses/"  # Business ID will come after slash.


# Defaults for our simple example.
DEFAULT_TERM = "dinner"
DEFAULT_LOCATION = "San Francisco, CA"
SEARCH_LIMIT = 3


def request(host, path, api_key, url_params=None):
    """Given your API_KEY, send a GET request to the API.
    Args:
        host (str): The domain host of the API.
        path (str): The path of the API after the domain.
        API_KEY (str): Your API Key.
        url_params (dict): An optional set of query parameters in the request.
    Returns:
        dict: The JSON response from the request.
    Raises:
        HTTPError: An error occurs from the HTTP request.
    """
    url_params = url_params or {}
    url = "{0}{1}".format(host, quote(path.encode("utf8")))
    headers = {
        "Authorization": "Bearer %s" % api_key,
    }

    print(u"Querying {0} ...".format(url))

    response = requests.request("GET", url, headers=headers, params=url_params)

    return response.json()


def search(api_key, term, location):
    """Query the Search API by a search term and location.
    Args:
        term (str): The search term passed to the API.
        location (str): The search location passed to the API.
    Returns:
        dict: The JSON response from the request.
    """

    url_params = {
        "term": term.replace(" ", "+"),
        "location": location.replace(" ", "+"),
        "limit": SEARCH_LIMIT,
    }
    return request(API_HOST, SEARCH_PATH, api_key, url_params=url_params)


def get_business(api_key, business_id):
    """Query the Business API by a business ID.
    Args:
        business_id (str): The ID of the business to query.
    Returns:
        dict: The JSON response from the request.
    """
    business_path = BUSINESS_PATH + business_id

    return request(API_HOST, business_path, api_key)


def query_api(term, location):
    """Queries the API by the input values from the user.
    Args:
        term (str): The search term to query.
        location (str): The location of the business to query.
    """
    response = search(API_KEY, term, location)

    businesses = response.get("businesses")

    if not businesses:
        print(u"No businesses for {0} in {1} found.".format(term, location))
        return

    business_id = businesses[0]["id"]

    print(
        u"{0} businesses found, querying business info "
        'for the top result "{1}" ...'.format(len(businesses), business_id)
    )
    response = get_business(API_KEY, business_id)

    print(u'Result for business "{0}" found:'.format(business_id))
    pprint.pprint(response, indent=2)


# a fucntion to query specific data from the resturants that we queery from instead of just the information from one specific resturant based on the query.
def query_resturants(term, location):
    """Queries the API by the input values from the user.
    Args:
        term (str): The search term to query.
        location (str): The location of the business to query.
    """
    # search for resturants with the API_KEY, the term (such as Starbucks, etc.), and the users zipcode that they stored in their profile
    response = search(API_KEY, term, location)
    # print(response)
    businesses = response.get("businesses")
    # print(businesses)
    names = []
    locations = []
    hours = []
    phone_numbers = []
    rating = []
    resturant_type_categories = []
    pictures = []
    if not businesses:
        print(u"No businesses for {0} in {1} found.".format(term, location))
        return
    for business in businesses:
        business_id = business["id"]

        # print(
        #     u"{0} businesses found, querying business info "
        # '   for the top result "{1}" ...'.format(len(businesses), business_id)
        # )
        response = get_business(API_KEY, business_id)

        names.append(response["name"])
        locations.append(response["location"])
        openhours = response["hours"]
        openinghour = openhours[0]["open"][0]["start"]
        closinghour = openhours[0]["open"][0]["end"]
        hours.append([openinghour, closinghour])
        phone_numbers.append(response["display_phone"])
        rating.append(response["rating"])
        resturant_type_categories.append(response["categories"])
        pictures.append(response["image_url"])

        # print(u'Result for business "{0}" found:'.format(business_id))
        # pprint.pprint(response, indent=2)
    DATA = {
        "names": names,
        "locations": locations,
        "hours": hours,
        "phone_numbers": phone_numbers,
        "ratings": rating,
        "resturant_type_categories": resturant_type_categories,
        "pictures": pictures,
    }
    # data = json.dumps(DATA)
    return DATA


# def main():
#     parser = argparse.ArgumentParser()

#     parser.add_argument('-q', '--term', dest='term', default=DEFAULT_TERM,
#                         type=str, help='Search term (default: %(default)s)')
#     parser.add_argument('-l', '--location', dest='location',
#                         default=DEFAULT_LOCATION, type=str,
#                         help='Search location (default: %(default)s)')

#     input_values = parser.parse_args()

#     try:
#         query_resturants(input_values.term, input_values.location)
#     except HTTPError as error:
#         sys.exit(
#             'Encountered HTTP error {0} on {1}:\n {2}\nAbort program.'.format(
#                 error.code,
#                 error.url,
#                 error.read(),
#             )
#         )


# if __name__ == '__main__':
#     main()
