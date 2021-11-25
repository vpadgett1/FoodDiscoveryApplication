# pylint: disable=E1101
# pylint: disable=C0413
# pylint: disable=W1508
# pylint: disable=R0903
# pylint: disable=W0603
from typing import NewType

from requests.api import post
from app import app, db, oauth
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
from flask_oauthlib.client import OAuth, OAuthException
from googleauth import get_google_provider_cfg
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
from yelpInfo import query_resturants, query_one_resturant, query_api

load_dotenv(find_dotenv())
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# OAuth 2 client setup
#client = oauthlib.WebApplicationClient(os.environ.get("GOOGLE_CLIENT_ID", None))
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_name):
    return user.query.get(user_name)


def timeConvert(miliTime):
    miliTime = int(miliTime)
    hours = miliTime / 100
    minutes = 00
    setting = "AM"
    if hours > 12:
        setting = "PM"
        hours -= 12
    return ("%d:%02d" + setting) % (hours, minutes)


bp = flask.Blueprint("bp", __name__, template_folder="./build")


@bp.route("/getUserProfile")
@login_required
def profile():
    UserDATA = {
        "name": current_user.username,
        "email": current_user.email,
        "profilePic": current_user.profile_pic,
        "zipcode": current_user.zipCode,
        "yelpRestaurantID": current_user.yelpRestaurantID,
    }
    UserFriends = current_user.friends
    UserFriendsList = []
    for x in range(len(UserFriends)):
        UserFriendsList.append({"user_id": UserFriends[x].FriendID})

    UserFavoriteRestaurants = current_user.favs
    UserFavRestaurantsList = []
    for x in range(len(UserFavoriteRestaurants)):
        UserFavRestaurantsList.append(UserFavoriteRestaurants[x].Restaurant)

    UserPosts = current_user.posts
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

    return {
        "UserDATA": UserDATA,
        "UserFriendsList": UserFriendsList,
        "UserFavRestaurantsList": UserFavRestaurantsList,
        "UserPostsList": UserPostsList,
    }


@bp.route("/zipcode", methods=["GET", "POST"])
def zipcode():
    if flask.request.method == "POST":
        yelp_api_key = os.getenv("YELP_APIKEY")
        business_search_url = "https://api.yelp.com/v3/businesses/search"
        newheaders = {"Authorization": "bearer %s" % yelp_api_key}
        zip_code = current_user.zipcode
        search_params = {"term": "restaurants", "location": zip_code, "limit": 25}
        restaurant_search_response = requests.get(
            business_search_url, headers=newheaders, params=search_params
        )
        restaurant_search_response_data = restaurant_search_response.json()
        businesses = restaurant_search_response_data["businesses"]

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

        DATA = {
            "names": name,
            "img_urls": img_url,
            "ratings": rating,
            "is_closeds": is_closed,
            "urls": url,
            "coords": coord,
            "ids": id,
        }

        return flask.jsonify({"data": DATA})
    else:
        return flask.render_template("index.html")


app.register_blueprint(bp)

google = oauth.remote_app(
    'google',
    consumer_key=app.config.get('GOOGLE_CLIENT_ID'),
    consumer_secret=app.config.get('GOOGLE_CLIENT_SECRET'),
    request_token_params={
        'scope': 'email'
    },
    base_url='https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)


@app.route('/login', methods=["POST"])
def login_post():
    return google.authorize(callback=flask.url_for('authorized', _external=True))

@google.tokengetter
def get_google_oauth_token():
    return flask.session.get('google_token')


@app.route('/login/authorized')
def authorized():
    resp = google.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            flask.request.args['error_reason'],
            flask.request.args['error_description']
        )
    flask.session['google_token'] = (resp['access_token'], '')
    me = google.get('userinfo')
    print(me.data)
    #userinfo_response = requests.get(uri, headers=headers, data=body)
    if me.data["verified_email"]:
        users_email = me.data["email"]
        picture = me.data["picture"]
        users_name = me.data["id"]
    else:
        return "User email not available or not verified by Google.", 400
    # Create a user in our database with the information provided by the Google response json
    newUser = user(username=users_name, email=users_email, profile_pic=picture)

    # Doesn't exist? Add it to the database.
    previousUser = True
    if not user.query.filter_by(username=users_name).first():
        db.session.add(newUser)
        db.session.commit()
        previousUser = False
        # return flask.redirect(flask.url_for(#pathing redirect for onboarding page
        # ))

    # Begin user session by logging the user in
    login_user(user.query.filter_by(username=users_name).first())

    # if user already exists, send straight to their home page
    if previousUser:
        # if merchant user, send to merchant homepage
        # otherwise, regular
        if current_user.yelpRestaurantID:
            return flask.redirect(flask.url_for("merchant"))
        else:
            return flask.redirect(flask.url_for("discover"))

    # if not, send to onboarding
    return flask.redirect(flask.url_for("onboarding"))


@app.route("/onboarding")
def onboarding():
    return flask.render_template("index.html")


@app.route("/discover")
def discover():
    return flask.render_template("index.html")


@app.route("/merchant")
def merchant():
    return flask.render_template("index.html")


@app.route("/map", methods=["GET", "POST"])
def map():

    if flask.request.method == "POST":

        zip_code = flask.request.json.get("zipcode")
        print(zip_code)
        search_limit = 13
        # search_params = {'term':'restaurants',
        #                 'location':zip_code,
        #                 'limit':25
        # }
        # restaurant_search_response = requests.get(business_search_url, headers = newheaders, params = search_params)
        restaurant_results = query_resturants("restaurant", zip_code, search_limit)
        print(restaurant_results)

        name = []
        img_url = []
        rating = []
        is_closed = []
        url = []
        coord = []
        id = []
        for x in range(len(restaurant_results["names"])):
            rest_info = {
                "name": restaurant_results["names"][x],
                "location": restaurant_results["locations"][x],
                "coordinates": restaurant_results["coordinates"][x],
                "opening": timeConvert(restaurant_results["hours"][x][0]),
                "closing": timeConvert(restaurant_results["hours"][x][1]),
                "phone_number": restaurant_results["phone_numbers"][x],
                "rating": restaurant_results["ratings"][x],
                "categories": restaurant_results["resturant_type_categories"][x][0][
                    "title"
                ],
                "image": restaurant_results["pictures"][x],
            }
            name.append(rest_info["name"])
            img_url.append(rest_info["image"])
            rating.append(rest_info["rating"])
            coord.append(rest_info["coordinates"])

        DATA = {
            "names": name,
            "img_urls": img_url,
            "ratings": rating,
            "coords": coord,
        }

        return flask.jsonify({"data": DATA})

    else:
        return flask.render_template("index.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    flask.session.pop('google_token', None)
    return flask.redirect(flask.url_for('login'))


@app.route("/post", methods=["POST", "GET"])
def post():
    if flask.request.method == "POST":
        postInput = flask.request.json.get("get_user_post")
        post = user_post(postText=postInput)
        db.session.add(post)
        db.session.commit()

    else:
        user_posts = user_post.postText.query.all()
        post_list = []
        for posts in user_posts:
            post_list.append(posts.postText)
        return flask.jsonify({"data": post_list})


@app.route("/createAccount", methods=["POST"])
@login_required
def createAccount():
    zipcode = flask.request.args.get("zipcode")
    print("Printing zip code")
    print(zipcode)
    current_user.zipCode = zipcode
    db.session.commit()
    yelpID = flask.request.args.get("yelpID")
    if yelpID:
        current_user.yelpRestaurantID = yelpID
        db.session.commit()

    status = "failed"
    if user.query.filter_by(
        username=current_user.username, email=current_user.email
    ).first():
        if (
            user.query.filter_by(
                username=current_user.username, email=current_user.email
            )
            .first()
            .zipCode
            == zipcode
        ):
            status = "success"
    return {"status": status}


@app.route("/createPost", methods=["POST"])
@login_required
def createPost():
    AuthorID = flask.request.get("AuthorID")
    postText = flask.request.get("postText")
    postTitle = flask.request.get("postTitle")
    RestaurantName = flask.request.get("RestaurantName")
    newUserPost = user_post(
        AuthorID=AuthorID,
        postText=postText,
        postTitle=postTitle,
        RestaurantName=RestaurantName,
        postLikes=0,
        user_id=current_user.id,
    )
    db.session.add(newUserPost)
    db.session.commit()

    status = "failed"
    if user_post.query.filter_by(postTitle=postTitle, AuthorID=AuthorID).first():
        status = "success"
    return flask.jsonify(status)


@app.route("/createComment", methods=["POST"])
@login_required
def createComment():
    AuthorID = flask.request.get("AuthorID")
    postText = flask.request.get("postText")
    post_id = flask.request.get("post_id")
    newUserComment = post_comments(
        AuthorID=AuthorID, postText=postText, post_id=post_id
    )
    db.session.add(newUserComment)
    db.session.commit()

    status = "failed"
    if post_comments.query.filter_by(AuthorID=AuthorID, post_id=post_id).first():
        status = "success"
    return flask.jsonify(status)


@app.route("/search", methods=["POST"])
@login_required
def search_post():
    rest_name = flask.request.get("resturant_name")
    result_limit = 3
    yelp_results = query_resturants(rest_name, current_user.zipCode, result_limit)
    resturant_data = []
    for x in range(len(yelp_results["names"])):
        rest_info = {
            "name": yelp_results["names"][x],
            "location": yelp_results["locations"][x],
            "opening": timeConvert(yelp_results["hours"][x][0]),
            "closing": timeConvert(yelp_results["hours"][x][1]),
            "phone_number": yelp_results["phone_numbers"][x],
            "rating": yelp_results["ratingsgit "][x],
            "categories": yelp_results["resturant_type_categories"][x][0]["title"],
            "image": yelp_results["pictures"][x],
        }
        resturant_data.append(rest_info)
    # return flask.render_template("", resturant_data = resturant_data)
    return flask.jsonify(resturant_data)


@app.route("/addFollower")
@login_required
def addFollower():
    # recieved follower_id
    follower_id = flask.request.args.get("follower_id")
    # query to verify they are not already following
    following_check = friends.query.filter_by(
        user_id=current_user.id, FriendID=follower_id
    ).all()
    if not following_check:
        friend_request = friends(user_id=current_user.id, FriendID=follower_id)
        db.session.add(friend_request)
        try:
            db.session.commit()
            return {
                "status": 200,
                "message": "You have successfully followed this person.",
            }
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            return {
                "status": 400,
                "message": "Failed to commit friend request to the database. Please Try again.",
            }
    else:
        return {"status": 400, "message": "You are already friends with this person"}


@app.route("/deleteFollower")
@login_required
def deleteFollower():
    follower_id = flask.request.args.get("follower_id")
    currentDB = friends.query.filter_by(user_id=current_user.id).all()
    extraVal = list((set(currentDB) - set(follower_id)))[0]
    if extraVal:
        removeFollower = friends.query.filter(
            (friends.user_id == current_user.id)
            & (friends.FriendID == extraVal.FriendID)
        ).first()
        db.session.delete(removeFollower)
        try:
            db.session.commit()
            return {
                "status": 200,
                "message": "You have successfully unfollowed this user.",
            }
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            return {
                "status": 400,
                "message": "Failed to commit unfriend request to the database. Please Try again.",
            }
    else:
        return {
            "status": 400,
            "message": "You are not friends with this person. Please try again to friend this user.",
        }


@app.route("/addFavoriteRestaurant", methods=["POST"])
@login_required
def addFavoriteRestaurant():
    # recieved follower_id
    yelp_restaurant_id = flask.request.json.get("yelp_restaurant_id")
    # query to verify they are not already following
    following_check = favorite_restraunts.query.filter_by(
        user_id=current_user.username, RestaurantName=yelp_restaurant_id
    ).all()
    if not following_check:
        follow_request = favorite_restraunts(
            user_id=current_user.username, RestaurantName=yelp_restaurant_id
        )
        db.session.add(follow_request)
        try:
            db.session.commit()
            return flask.jsonify(
                {
                    "status": 200,
                    "message": "You have successfully added this restaurant to your favorites.",
                }
            )
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            return flask.jsonify(
                {
                    "status": 400,
                    "message": "Failed to commit favorite restaurant request to the database. Please Try again.",
                }
            )
    else:
        return flask.jsonify(
            {
                "status": 400,
                "message": "You have already favorited this restaurant. Please try again to remove this restaurant from your favorites.",
            }
        )


@app.route("/deleteFavoriteRestaurant", methods=["POST"])
@login_required
def deleteFavoriteRestaurant():
    yelp_restaurant_id = flask.request.json.get("yelp_restaurant_id")
    currentDB = favorite_restraunts.query.filter_by(user_id=current_user.username).all()
    extraVal = list((set(currentDB) - set(yelp_restaurant_id)))[0]
    if extraVal:
        removeFollower = friends.query.filter(
            (favorite_restraunts.user_id == current_user.username)
            & (favorite_restraunts.RestaurantName == extraVal.yelp_restaurant_id)
        ).first()
        db.session.delete(removeFollower)
        try:
            db.session.commit()
            return flask.jsonify(
                {
                    "status": 200,
                    "message": "You have successfully removed this restaurant from your favorites.",
                }
            )
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            return flask.jsonify(
                {
                    "status": 400,
                    "message": "Failed to commit unfavorite restaurant request to the database. Please Try again.",
                }
            )
    else:
        return flask.jsonify(
            {
                "status": 400,
                "message": "You have not favorited this restaurant. Please try again to add this restaurant to your favorites.",
            }
        )


app.route("/getRestaurantData", methods=["GET"])


def getRestaurantData():
    restaurant_id = current_user.yelpRestaurantID
    store_data = query_one_resturant(restaurant_id)
    if not store_data:
        return flask.jsonify(
            {
                "status": 400,
                "message": "Could not find data for this restaurant.",
            }
        )
    return flask.jsonify(
        {"status": 200, "message": "Retrieved restaurant data.", "data": store_data}
    )


app.route("/getPostsByUser", methods=["GET"])


def getPostsByUser():
    posts = user_post.query.filter_by(user_id=current_user.username).all()
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
    return flask.render_template("index.html", postsData=postsData)


@app.route("/getUserInfoByEmail")
@login_required
def getUserInfoByEmail():
    # get all the info of a user given their email as input
    email = flask.request.args.get("email")
    otherUser = user.query.filter_by(email=email).first()
    UserDATA = {
        "id": otherUser.id,
        "name": otherUser.username,
        "email": otherUser.email,
        "profilePic": otherUser.profile_pic,
        "zipcode": otherUser.zipCode,
    }

    return UserDATA


@app.route("/getDetailedUserInfo")
@login_required
def getDetailedUserInfo():
    # get all the info of a user given their email as input
    userID = flask.request.args.get("userID")
    otherUser = user.query.filter_by(id=userID).first()
    UserDATA = {
        "id": otherUser.id,
        "name": otherUser.username,
        "email": otherUser.email,
        "profilePic": otherUser.profile_pic,
        "zipcode": otherUser.zipCode,
    }

    UserFriends = otherUser.friends
    UserFriendsList = []
    for x in range(len(UserFriends)):
        UserFriendsList.append(UserFriends[x].FriendID)

    UserFavoriteRestaurants = otherUser.favs
    UserFavRestaurantsList = []
    for x in range(len(UserFavoriteRestaurants)):
        UserFavRestaurantsList.append(UserFavoriteRestaurants[x].Restaurant)

    UserPosts = otherUser.posts
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

    return {
        "UserDATA": UserDATA,
        "UserFriendsList": UserFriendsList,
        "UserFavRestaurantsList": UserFavRestaurantsList,
        "UserPostsList": UserPostsList,
    }


# returns a status and boolean true/false depending on
# if the user is friends with the given user id
@app.route("/isFriends")
def isFriends():
    # query the database for a relationship between the
    # two. If exists, return true.
    follower_id = flask.request.args.get("follower_id")
    following_check = friends.query.filter_by(
        user_id=current_user.id, FriendID=follower_id
    ).all()

    if following_check == None:
        return {"status": 200, "isFriends": False}

    return {"status": 200, "isFriends": True}


@app.route("/")
def main():
    if current_user.is_authenticated:
        if current_user.yelpRestaurantID:
            return flask.redirect(flask.url_for("merchant"))
        else:
            return flask.redirect(flask.url_for("discover"))
    else:
        return flask.render_template("index.html")


if __name__ == "__main__":
    app.run(
        host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", 5000)), debug=True
<<<<<<< HEAD
    )
=======
    )
>>>>>>> 491561649ac360f6108f46001a849b9401b07856
