from flask import Flask, render_template
import os
import requests
from dotenv import load_dotenv
import flask
import json


load_dotenv()

app = flask.Flask(__name__, static_folder="./build/static")
bp = flask.Blueprint("bp", __name__, template_folder="./build")

yelp_client_id = os.getenv("YELP_CLIENTID")
yelp_api_key = os.getenv("YELP_APIKEY")
business_search_url = "https://api.yelp.com/v3/businesses/search"
newheaders = {'Authorization': 'bearer %s' % yelp_api_key}
parameters = {'term':'food',
    'location':'30303',
    'limit': 25
}
search_response = requests.get(business_search_url, headers = newheaders, params = parameters)
response_data = search_response.json()


@bp.route('/index') 
def index():
    
    return render_template('index.html')

app.register_blueprint(bp)

@app.route('/zipcode') 
def zipcode():
    return render_template('zipcode.html')

@app.route('/zipcode', methods=['POST']) 
def zipcode_post():

    zip_code = flask.request.form.get("zip")
    search_params = {'term':'restaurants',
                     'location':zip_code,
                     'limit':25
     }
    restaurant_search_response = requests.get(business_search_url, headers = newheaders, params = search_params)
    restaurant_search_response_data = restaurant_search_response.json()
    businesses =  restaurant_search_response_data["businesses"]

    name = []
    img_url = []
    rating = []
    is_closed = []
    url = []
    coord = []
    id = []
    
    for business in businesses:
        name.append(business["name"])
        img_url.append(business["image_url"])
        rating.append(business["rating"])
        is_closed.append(business["is_closed"])
        url.append(business["url"])
        coord.append(business["coordinates"])
        id.append(business["id"])


    # print(name,img_url,rating,is_closed,url,coord,id)

    DATA ={
         "names":name,
         "img_urls":img_url,
         "ratings":rating,
         "is_closeds":is_closed,
         "urls":url,
         "coords":coord,
     
         "ids":id,
    }
    
    data = json.dumps(DATA)
    print(data)

    return flask.render_template('index.html', data=data)

@app.route('/') 
def main():
    return flask.redirect(flask.url_for("zipcode"))

app.run(debug=True)