# pylint: disable=E1101
# pylint: disable=C0413
# pylint: disable=W1508
# pylint: disable=R0903
# pylint: disable=W0603
from app import app, db
from models import user, favorite_restraunts, friends, user_post, post_comments
import flask
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
import os
import json
import requests
from oauthlib.oauth2 import WebApplicationClient
from yelpInfo import query_api, query_resturants
from googleauth import get_google_provider_cfg
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
from yelpInfo import *

load_dotenv(find_dotenv())

# OAuth 2 client setup
client = WebApplicationClient(os.environ.get("GOOGLE_CLIENT_ID", None))

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

login_manager = LoginManager()
login_manager.init_app(app)

# Flask-Login helper to retrieve a user from our db
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

def timeConvert(miliTime):
    miliTime = int(miliTime)
    hours = miliTime / 100
    minutes = 00
    setting = "AM"
    if hours > 12:
        setting = "PM"
        hours -= 12
    return(("%d:%02d" + setting) % (hours, minutes))

bp = flask.Blueprint("bp", __name__, template_folder="./build")

@bp.route("/profile")
@login_required
def profile():
    UserDATA = {
        "name": current_user.username,
        "email": current_user.email,
        "profilePic": current_user.profile_pic,
        "zipcode": current_user.zipCode,
        "yelpRestaurantID": current_user.yelpRestaurantID,
    }
    UserFriends = current_user.Friends
    UserFriendsList = []
    for x in range(len(UserFriends)):
        UserFriendsList.append(UserFriends[x].FriendID)

    UserFavoriteRestaurants = current_user.FavoriteRestaurants
    UserFavRestaurantsList = []
    for x in range(len(UserFavoriteRestaurants)):
        UserFavRestaurantsList.append(UserFavoriteRestaurants[x].Restaurant)

    UserPosts = current_user.UserPost
    UserPostsList = []
    for x in range(len(UserPosts)):
        postComments = post_comments.query.filter_by(post_id=UserPosts[x].id)
        postCommentsList = []
        for y in range(len(postComments)):
            commentData = {
                "AuthorID": postComments[y].AuthorID,
                "postText": postComments[y].postText,
            }
            postCommentsList.append(commentData)
        PostDATA = {
            "AuthorID": UserPosts[x].AuthorID,
            "postText": UserPosts[x].postText,
            "postTitle": UserPosts[x].postTitle,
            "postLikes": UserPosts[x].postLikes,
            "RestaurantName": UserPosts[x].RestaurantName,
            "comments": postCommentsList,
        }
        UserPostsList.append(PostDATA)

    return flask.jsonify(
        {
            "UserDATA": UserDATA,
            "UserFriendsList": UserFriendsList,
            "UserFavRestaurantsList": UserFavRestaurantsList,
            "UserPostsList": UserPostsList,
        }
    )


app.register_blueprint(bp)

@app.route("/login")
def login():
    # Find out what URL to hit for Google login
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for Google login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=flask.request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return flask.redirect(request_uri)


@app.route("/login/callback")
def callback():
    # Get authorization code Google sent back to you
    code = flask.request.args.get("code")
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    # Prepare and send a request to get tokens! Yay tokens!
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=flask.request.url,
        redirect_url=flask.request.base_url,
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(os.getenv("GOOGLE_CLIENT_ID"), os.getenv("GOOGLE_CLIENT_SECRET")),
    )
    # Parse the tokens!
    client.parse_request_body_response(json.dumps(token_response.json()))
    # Now that you have tokens (yay) let's find and hit the URL
    # from Google that gives you the user's profile information,
    # including their Google profile image and email
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)
    # You want to make sure their email is verified.
    # The user authenticated with Google, authorized your
    # app, and now you've verified their email through Google!
    if userinfo_response.json().get("email_verified"):
        #unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400
    # Create a user in your db with the information provided
    # by Google
    newUser = user(username=users_name, email=users_email, profile_pic=picture)
    
    # Doesn't exist? Add it to the database.
    if not user.query.filter_by(username=users_name).first():
        db.session.add(newUser)
        #return flask.redirect(flask.url_for(#pathing redirect for onboarding page
        #))

    # Begin user session by logging the user in
    login_user(newUser)

    # Send user back to homepage
    return flask.redirect(flask.url_for("bp.index"))


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return flask.redirect(flask.url_for("bp.index"))


@app.route("/search", methods = ["POST"])
@login_required
def discover_post():
    rest_name = flask.request.get("resturant_name")
    yelp_results = query_resturants(rest_name, current_user.zipCode)
    resturant_data = []
    for x in range(len(yelp_results["names"])): 
        rest_info = {
            'name' : yelp_results["names"][x], 
            'location' : yelp_results["locations"][x],
            'opening' : timeConvert(yelp_results["hours"][x][0]), 
            'closing': timeConvert(yelp_results["hours"][x][1]),
            'phone_number' : yelp_results["phone_numbers"][x],
            'rating' : yelp_results['ratingsgit '][x],
            'categories' : yelp_results['resturant_type_categories'][x][0]["title"],
            'image' : yelp_results['pictures'][x]
        }
        resturant_data.append(rest_info)
    #return flask.render_template("", resturant_data = resturant_data)
    return flask.jsonify(resturant_data)

@app.route("/addFollower", methods = ["POST"])
@login_required
def addFollower():
    #recieved follower_id
    follower_id = flask.request.json.get("follower_id")
    #query to verify they are not already following
    following_check = friends.query.filter_by(user_id = current_user.username, FriendID = follower_id).all()
    if not following_check: 
        friend_request = friends(user_id = current_user.username, FriendID=follower_id)
        db.session.add(friend_request)
        try:
            db.session.commit()
            return flask.jsonify({"status": 200, "message": "You have successfully followed this person."})
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            return flask.jsonify({"status": 400, "message": "Failed to commit friend request to the database. Please Try again."})
    else:
        return flask.jsonify({"status": 400, "message": "You are already friends with this person"})

@app.route("/deleteFollower", methods = ["POST"])
@login_required
def deleteFollower():
    follower_id = flask.request.json.get("follower_id")
    currentDB = friends.query.filter_by(user_id=current_user.username).all()
    extraVal = list((set(currentDB)-set(follower_id)))[0]
    if extraVal:
        removeFollower = friends.query.filter(
            (friends.user_id==current_user.username) & (friends.FriendID==extraVal.follower_id)).first()
        db.session.delete(removeFollower)
        try:
            db.session.commit()
            return flask.jsonify({"status": 200, "message": "You have successfully unfollowed this user."})
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            return flask.jsonify({"status": 400, "message": "Failed to commit unfriend request to the database. Please Try again."})
    else:
        return flask.jsonify({"status": 400, "message": "You are not friends with this person. Please try again to friend this user."})

app.route("/getPostsByUser", methods = ["GET"])
def getPostsByUser():
    posts = user_post.query.filter_by(user_id = current_user.username).all()
    postsData = []
    for post in posts:
        postComments = post_comments.query.filter_by(post_id=post.id)
        postCommentsList = []
        for comment in postComments:
            commentData = {
                "AuthorID": comment.AuthorID,
                "postText": comment.postText,
            }
            postCommentsList.append(commentData)
        singlepostData = {
            "AuthorID": posts.AuthorID,
            "postText": posts.postText,
            "postTitle": posts.postTitle,
            "postLikes": posts.postLikes,
            "RestaurantName": posts.RestaurantName,
            "comments": postCommentsList,
        }
        postsData.append(singlepostData)
    return flask.render_template("", postsData = postsData)

@app.route("/")
def main():
    if current_user.is_authenticated:
        return (
            "<p>Hello, {}! You're logged in! Email: {}</p>"
            "<div><p>Google Profile Picture:</p>"
            '<img src="{}" alt="Google profile pic"></img></div>'
            '<a class="button" href="/logout">Logout</a>'.format(
                current_user.name, current_user.email, current_user.profile_pic
            )
        )
    else:
        return '<a class="button" href="/login">Google Login</a>'

if __name__ == "__main__":
    app.run(host=os.getenv("IP", "127.0.0.1"), port=int(os.getenv("PORT", 5000)), debug=True)