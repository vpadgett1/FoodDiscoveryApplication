# pylint: disable=E1101
# pylint: disable=C0413
# pylint: disable=W1508
# pylint: disable=R0903
# pylint: disable=W0603
from collections import UserString
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
import base64
from flask_oauthlib.client import OAuth, OAuthException
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import update
from dotenv import load_dotenv, find_dotenv
from yelpInfo import (
    get_buisness,
    get_buisness_from_yelp,
    query_resturants,
    query_one_resturant,
    query_api,
)

# from sqlalchemy_imageattach.entity import entity
# from sqlalchemy_imageattach.context import store_context
# import sqlalchemy_imageattach.stores.fs
# from sqlalchemy_imageattach.store import Store
from datetime import datetime
from base64 import b64encode
from io import BytesIO

load_dotenv(find_dotenv())
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# OAuth 2 client setup
# client = oauthlib.WebApplicationClient(os.environ.get("GOOGLE_CLIENT_ID", None))
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

YELP_API_KEY = os.environ["YELP_API_KEY"]


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


def render_picture(data):

    render_pic = base64.b64encode(data).decode("ascii")
    return render_pic


bp = flask.Blueprint("bp", __name__, template_folder="./build")


@bp.route("/getUserProfile")
@login_required
def profile():
    UserDATA = {
        "name": current_user.username,
        "email": current_user.email,
        "profilePic": current_user.profile_pic,
        "zipcode": current_user.zip_code,
        "yelpRestaurantID": current_user.yelp_restaurant_id,
        "id": current_user.id,
    }
    UserFriends = current_user.friends
    UserFriendsList = []
    for x in range(len(UserFriends)):
        # Also get the profile picture and the name of the friend
        friend = user.query.filter_by(id=UserFriends[x].friend_id).first()
        UserFriendsList.append(
            {
                "user_id": UserFriends[x].friend_id,
                "name": friend.username,
                "profile_pic": friend.profile_pic,
            }
        )

    UserFavRestaurantsList = getFavoriteRestaurants(current_user.id)

    UserPostsList = getPosts(current_user.id)

    return {
        "UserDATA": UserDATA,
        "UserFriendsList": UserFriendsList,
        "UserFavRestaurantsList": UserFavRestaurantsList,
        "UserPostsList": UserPostsList,
    }


app.register_blueprint(bp)

google = oauth.remote_app(
    "google",
    consumer_key=app.config.get("GOOGLE_CLIENT_ID"),
    consumer_secret=app.config.get("GOOGLE_CLIENT_SECRET"),
    request_token_params={"scope": "email"},
    base_url="https://www.googleapis.com/oauth2/v1/",
    request_token_url=None,
    access_token_method="POST",
    access_token_url="https://accounts.google.com/o/oauth2/token",
    authorize_url="https://accounts.google.com/o/oauth2/auth",
)


@app.route("/login", methods=["POST"])
def login_post():
    return google.authorize(callback=flask.url_for("authorized", _external=True))


@google.tokengetter
def get_google_oauth_token():
    return flask.session.get("google_token")


@app.route("/login/authorized")
def authorized():
    resp = google.authorized_response()
    if resp is None:
        return "Access denied: reason=%s error=%s" % (
            flask.request.args["error_reason"],
            flask.request.args["error_description"],
        )
    flask.session["google_token"] = (resp["access_token"], "")
    me = google.get("userinfo")
    # print(me.data)
    # userinfo_response = requests.get(uri, headers=headers, data=body)
    if me.data["verified_email"]:
        users_email = me.data["email"]
        picture = me.data["picture"]
        # users_name = me.data["id"]
    else:
        return "User email not available or not verified by Google.", 400
    # Create a user in our database with the information provided by the Google response json
    newUser = user(email=users_email, profile_pic=picture)

    # Doesn't exist? Add it to the database.
    previousUser = True
    if not user.query.filter_by(email=users_email).first():
        db.session.add(newUser)
        db.session.commit()
        previousUser = False
        # return flask.redirect(flask.url_for(#pathing redirect for onboarding page
        # ))

    # Begin user session by logging the user in
    login_user(user.query.filter_by(email=users_email).first())

    # if user already exists, send straight to their home page
    if previousUser:
        # check if user finished onboarding
        print(current_user.zip_code)
        if current_user.zip_code == None:
            return flask.redirect(flask.url_for("onboarding"))
        # if merchant user, send to merchant homepage
        # otherwise, regular
        if current_user.yelp_restaurant_id:
            return flask.redirect(flask.url_for("merchant"))
        else:
            return flask.redirect(flask.url_for("discover"))

    # if not, send to onboarding
    return flask.redirect(flask.url_for("onboarding"))


@app.route("/onboarding")
def onboarding():
    return flask.render_template("index.html")


@app.route("/discover")
@login_required
def discover():
    if current_user.is_authenticated:
        return flask.render_template("index.html")
    else:
        return flask.render_template(flask.url_for("/"))


@app.route("/merchant")
@login_required
def merchant():
    return flask.render_template("index.html")


@app.route("/restaurantprofile", methods=["GET", "POST"])
def restaurantprofile():

    if flask.request.method == "POST":

        restaurant_id = flask.request.json.get("restID")
        business_results = get_buisness_from_yelp(YELP_API_KEY, restaurant_id)
        # print(business_results)

        name = []
        img_url = []
        rating = []
        rating_count = []
        is_closed = []
        url = []
        address = []
        opening = []
        closing = []
        phone_number = []
        categories = []
        photos = []

        for x in range(len(business_results["name"])):
            rest_info = {
                "name": business_results["name"],
                "location": business_results["location"]["display_address"],
                "rating_count": business_results["review_count"],
                "phone_number": business_results["display_phone"],
                "rating": business_results["rating"],
                "categories": business_results["categories"][0]["title"],
                "image": business_results["image_url"],
                "photos": business_results["photos"],
                "url": business_results["url"],
            }
        for y in range(len(business_results["hours"][0]["open"])):
            open_hours_info = {
                "Sunday": timeConvert(business_results["hours"][0]["open"][y]["start"]),
                "Monday": timeConvert(business_results["hours"][0]["open"][y]["start"]),
                "Tuesday": timeConvert(
                    business_results["hours"][0]["open"][y]["start"]
                ),
                "Wednesday": timeConvert(
                    business_results["hours"][0]["open"][y]["start"]
                ),
                "Thursday": timeConvert(
                    business_results["hours"][0]["open"][y]["start"]
                ),
                "Friday": timeConvert(business_results["hours"][0]["open"][y]["start"]),
                "Saturday": timeConvert(
                    business_results["hours"][0]["open"][y]["start"]
                ),
            }
        for z in range(len(business_results["hours"][0]["open"])):
            close_hours_info = {
                "Sunday": timeConvert(business_results["hours"][0]["open"][z]["end"]),
                "Monday": timeConvert(business_results["hours"][0]["open"][z]["end"]),
                "Tuesday": timeConvert(business_results["hours"][0]["open"][z]["end"]),
                "Wednesday": timeConvert(
                    business_results["hours"][0]["open"][z]["end"]
                ),
                "Thursday": timeConvert(business_results["hours"][0]["open"][z]["end"]),
                "Friday": timeConvert(business_results["hours"][0]["open"][z]["end"]),
                "Saturday": timeConvert(business_results["hours"][0]["open"][z]["end"]),
            }
        opening.append(open_hours_info)
        closing.append(close_hours_info)
        name.append(rest_info["name"])
        img_url.append(rest_info["image"])
        rating.append(rest_info["rating"])
        rating_count.append(rest_info["rating_count"])
        address.append(rest_info["location"])
        categories.append(rest_info["categories"])
        photos.append(rest_info["photos"])
        phone_number.append(rest_info["phone_number"])
        url.append(rest_info["url"])

        # check if user is following the restaurant
        isFollowingCheck = favorite_restraunts.query.filter_by(
            user_id=current_user.id, yelp_restraunt_id=restaurant_id
        ).all()
        isFollowing = False
        if isFollowingCheck:
            isFollowing = True

        DATA = {
            "name": name,
            "img_urls": img_url,
            "ratings": rating,
            "rating_count": rating_count,
            "address": address,
            "opening": opening,
            "closing": closing,
            "url": url,
            "phone": phone_number,
            "categories": categories,
            "photos": photos,
            "isFollowing": isFollowing,
        }

        return flask.jsonify({"data": DATA})
    else:
        return flask.render_template("index.html")


@app.route("/map", methods=["GET", "POST"])
@login_required
def map():
    if flask.request.method == "POST":

        zip_code = flask.request.json.get("zipcode")
        # print(zip_code)
        search_limit = 13
        # search_params = {'term':'restaurants',
        #                 'location':zip_code,
        #                 'limit':25
        # }
        # restaurant_search_response = requests.get(business_search_url, headers = newheaders, params = search_params)
        restaurant_results = query_resturants("restaurant", zip_code, search_limit)
        # print(restaurant_results)

        name = []
        img_url = []
        rating = []
        is_closed = []
        url = []
        coord = []
        address = []
        opening = []
        closing = []
        ids = []
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
                "ids": restaurant_results["ids"][x],
            }
            name.append(rest_info["name"])
            img_url.append(rest_info["image"])
            rating.append(rest_info["rating"])
            coord.append(rest_info["coordinates"])
            address.append(rest_info["location"])
            opening.append(rest_info["opening"])
            closing.append(rest_info["closing"])
            ids.append(rest_info["ids"])
        DATA = {
            "names": name,
            "img_urls": img_url,
            "ratings": rating,
            "coords": coord,
            "address": address,
            "opening": opening,
            "closing": closing,
            "ids": ids,
        }
        # print(restaurant_results)

        return flask.jsonify({"data": DATA})

    else:
        return flask.render_template("index.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    flask.session.pop("google_token", None)
    return {"status": 200}


@app.route("/post", methods=["POST", "GET"])
def post():
    if flask.request.method == "POST":
        postInput = flask.request.json.get("get_user_post")
        post = user_post(post_text=postInput)
        db.session.add(post)
        db.session.commit()

    else:
        user_posts = user_post.post_text.query.all()
        post_list = []
        for posts in user_posts:
            post_list.append(posts.post_text)
    return flask.jsonify({"data": post_list})


@app.route("/createAccount", methods=["POST"])
@login_required
def createAccount():
    wantedUsername = flask.request.args.get("username")
    zipcode = flask.request.args.get("zipcode")
    # check if restaurant ID is valid first
    yelpID = flask.request.args.get("yelpID")
    print(yelpID)
    if yelpID != "" and yelpID:
        realRestuarant = get_buisness(yelpID)
        if "error" in realRestuarant:
            return {
                "status": 200,
                "newAccountCreated": False,
                "message": "yelp restaurant id is invalid",
            }
        else:
            current_user.yelp_restaurant_id = yelpID
            db.session.commit()

    userExists = user.query.filter_by(username=wantedUsername).all()
    if userExists:
        print("existing username try again")
        return {
            "status": 200,
            "newAccountCreated": False,
            "message": "Username is already taken. Please try again with another username",
        }
    current_user.username = wantedUsername
    current_user.zip_code = zipcode
    db.session.commit()

    status = 400
    newAccountCreated = False
    message = "Failed account creation. Please refresh the page and try again."
    if user.query.filter_by(
        username=current_user.username, email=current_user.email
    ).first():
        if (
            user.query.filter_by(
                username=current_user.username, email=current_user.email
            )
            .first()
            .zip_code
            == zipcode
        ):
            status = 200
            newAccountCreated = True
            message = "success!"
    return {
        "status": status,
        "newAccountCreated": newAccountCreated,
        "message": message,
    }


@app.route("/deleteAccount", methods=["POST"])
@login_required
def deleteAccount():
    userID = current_user.id
    print("Printing UserID")
    print(userID)

    # get all items in favorite restaurants table with the userID
    delRestaurants = favorite_restraunts.query.filter_by(user_id=userID).all()
    for restaurant in delRestaurants:
        db.session.delete(restaurant)
        db.session.commit()

    # get all items in friends table with the userID
    delFriends = friends.query.filter_by(user_id=userID).all()
    for friend in delFriends:
        db.session.delete(friend)
        db.session.commit()

    # get all items in posts table with the userID
    delPosts = user_post.query.filter_by(user_id=userID).all()
    for post in delPosts:
        # get the comments for this post and delete all of them
        delComments = post_comments.query.filter_by(post_id=post.id).all()
        for comment in delComments:
            db.session.delete(comment)
            db.session.commit()

        db.session.delete(post)
        db.session.commit()

    # delete the user
    delUser = user.query.filter_by(id=userID).first()
    db.session.delete(delUser)
    db.session.commit()

    status = 200
    if user.query.filter_by(id=userID).first():
        status = 400

    # log user out after deleting account
    logout_user()
    flask.session.pop("google_token", None)

    return {"status": status}


@app.route("/createPost", methods=["POST", "GET"])
@login_required
def createPost():
    AuthorID = flask.request.args.get("AuthorID")
    postText = flask.request.args.get("postText")
    postTitle = flask.request.args.get("postTitle")
    RestaurantName = flask.request.args.get("RestaurantName")
    image = flask.request.files.get("image")
    render_file = ""
    data_of_image = b""
    if image:
        data_of_image = image.read()
        render_file = render_picture(data_of_image)
    # Image = flask.request.args.get("image")
    # print(image)
    newUserPost = user_post(
        author_id=AuthorID,
        post_text=postText,
        post_title=postTitle,
        post_likes=0,
        restaurant_name=RestaurantName,
        image_data=data_of_image,
        rendered_data=render_file,
        user_id=current_user.id,
    )
    db.session.add(newUserPost)
    db.session.commit()

    status = 400
    postID = 0
    post = user_post.query.filter_by(post_title=postTitle, author_id=AuthorID).first()
    if post:
        status = 200
        postID = post.id
    return {"status": status, "postID": postID, "renderFile": render_file}


@app.route("/searchPost", methods=["POST"])
@login_required
def searchPost():
    tag = flask.request.args.get("postTitle")
    search = "%{}%".format(tag)
    Posts = user_post.query.filter(user_post.post_title.like(search)).all()
    postsData = []
    for post in Posts:
        postComments = post_comments.query.filter_by(post_id=post.id)
        postCommentsList = []
        for comment in postComments:
            commentData = {
                "CommentAuthorProfilePic": user.query.filter(comment.author_id)
                .first()
                .profile_pic,
                "AuthorID": comment.author_id,
                "postText": comment.post_text,
            }
            postCommentsList.append(commentData)
        singlepostData = {
            "AuthorID": post.author_id,
            "postText": post.post_text,
            "postTitle": post.post_title,
            "postLikes": post.post_likes,
            "RestaurantName": post.restaurant_name,
            "comments": postCommentsList,
            "PostAuthorProfilePic": user.query.filter(post.user_id).first().profile_pic,
        }
        postsData.append(singlepostData)
    return flask.jsonify(postsData)


@app.route("/createComment", methods=["POST", "GET"])
@login_required
def createComment():
    AuthorID = flask.request.args.get("AuthorID")
    postText = flask.request.args.get("postText")
    post_id = flask.request.args.get("post_id")
    newUserComment = post_comments(
        author_id=AuthorID, post_text=postText, post_id=post_id
    )
    db.session.add(newUserComment)
    db.session.commit()

    status = "failed"
    if post_comments.query.filter_by(author_id=AuthorID, post_id=post_id).first():
        status = "success"
    return flask.jsonify(status)


@app.route("/likeAPost", methods=["POST"])
@login_required
def likeAPost():
    postId = flask.request.args.get("PostID")
    authorId = flask.request.args.get("AuthorID")
    postInfo = user_post.query.filter_by(id=postId, author_id=authorId).first()
    postInfo.post_likes += 1
    db.session.commit()
    likeCount = postInfo.post_likes
    return flask.jsonify({"likes": likeCount, "message": "like success", "status": 200})


@app.route("/unlikeAPost", methods=["POST"])
@login_required
def unlikeAPost():
    postId = flask.request.args.get("PostID")
    authorId = flask.request.args.get("AuthorID")
    postInfo = user_post.query.filter_by(id=postId, author_id=authorId).first()
    postInfo.post_likes -= 1
    db.session.commit()
    likeCount = postInfo.post_likes
    return flask.jsonify(
        {"likes": likeCount, "message": " unlike success", "status": 200}
    )


@app.route("/search", methods=["POST"])
def search_post():
    rest_name = flask.request.json.get("searchInput")
    result_limit = 3
    print(current_user.zip_code)
    yelp_results = query_resturants(rest_name, current_user.zip_code, result_limit)
    print(yelp_results)
    resturant_data = []
    for x in range(len(yelp_results["names"])):
        rest_info = {
            "name": yelp_results["names"][x],
            "location": yelp_results["locations"][x],
            "opening": timeConvert(yelp_results["hours"][x][0]),
            "closing": timeConvert(yelp_results["hours"][x][1]),
            "phone_number": yelp_results["phone_numbers"][x],
            "rating": yelp_results["ratings"][x],
            "categories": yelp_results["resturant_type_categories"][x][0]["title"],
            "image": yelp_results["pictures"][x],
            "ids": yelp_results["ids"][x],
        }
        resturant_data.append(rest_info)
    # return flask.render_template("", resturant_data = resturant_data)
    return flask.jsonify(resturant_data)


@app.route("/searchUsername", methods=["POST"])
@login_required
def search_username():
    user_name = flask.request.get("username")
    usersWithUsername = []
    user_data = user.query.filter_by(username=user_name).all()
    for x in user_data:
        user_info = {"username": user_data.username}
        usersWithUsername.append(user_info)
    # return flask.render_template("", resturant_data = resturant_data)
    return flask.jsonify(usersWithUsername)


@app.route("/addFollower")
@login_required
def addFollower():
    # recieved follower_id
    follower_id = flask.request.args.get("follower_id")
    # query to verify they are not already following
    following_check = friends.query.filter_by(
        user_id=current_user.id, friend_id=follower_id
    ).all()
    if not following_check:
        friend_request = friends(user_id=current_user.id, friend_id=follower_id)
        db.session.add(friend_request)
        try:
            db.session.commit()
            # get the name of the user and their profile pic
            friendData = user.query.filter_by(id=follower_id).first()
            getFriendData = {
                "user_id": friendData.id,
                "name": friendData.username,
                "profile_pic": friendData.profile_pic,
            }
            return {
                "status": 200,
                "message": "You have successfully followed this person.",
                "friendData": getFriendData,
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
            & (friends.friend_id == extraVal.friend_id)
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
    yelp_restaurant_id = flask.request.json.get("restID")
    print(yelp_restaurant_id)
    # query to verify they are not already following
    following_check = favorite_restraunts.query.filter_by(
        user_id=current_user.id, yelp_restraunt_id=yelp_restaurant_id
    ).all()
    if not following_check:
        follow_request = favorite_restraunts(
            user_id=current_user.id, yelp_restraunt_id=yelp_restaurant_id
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
    yelp_restaurant_id = flask.request.json.get("restID")
    currentDB = favorite_restraunts.query.filter_by(user_id=current_user.id).all()
    extraVal = list((set(currentDB) - set(yelp_restaurant_id)))[0]
    if extraVal:
        removeFollower = favorite_restraunts.query.filter(
            (favorite_restraunts.user_id == current_user.id)
            & (favorite_restraunts.yelp_restraunt_id == extraVal.yelp_restraunt_id)
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


@app.route("/getRestaurantData")
def getRestaurantData():
    restaurant_id = current_user.yelp_restaurant_id
    store_data = query_one_resturant(restaurant_id)
    if not store_data:
        return {"status": 400, "message": "Could not find data for this restaurant."}
    return {"status": 200, "message": "Retrieved restaurant data.", "data": store_data}


@app.route("/getPostsByUser", methods=["GET"])
def getPostsByUser():
    posts = user_post.query.filter_by(user_id=current_user.username).all()
    postsData = []
    for post in posts:
        postComments = post_comments.query.filter_by(post_id=post.id)
        postCommentsList = []
        for comment in postComments:
            commentData = {
                "AuthorID": comment.author_id,
                "postText": comment.post_text,
            }
            postCommentsList.append(commentData)
        singlepostData = {
            "AuthorID": posts.author_id,
            "postText": posts.post_text,
            "postTitle": posts.post_title,
            "postLikes": posts.post_likes,
            "RestaurantName": posts.restaurant_name,
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
        "zipcode": otherUser.zip_code,
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
        "zipcode": otherUser.zip_code,
    }

    UserFriends = otherUser.friends
    UserFriendsList = []
    for x in range(len(UserFriends)):
        UserFriendsList.append(UserFriends[x].friend_id)

    UserFavoriteRestaurants = otherUser.favs
    UserFavRestaurantsList = []
    for x in range(len(UserFavoriteRestaurants)):
        UserFavRestaurantsList.append(UserFavoriteRestaurants[x].Restaurant)

    UserPostsList = getPosts(userID)

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


@app.route("/getUserID")
@login_required
def getUserID():
    return {"userID": current_user.id}


@app.route("/getUserName")
@login_required
def getUserName():
    return {"username": current_user.username}


@app.route("/getUserProfilePic")
@login_required
def getUserProfilePic():
    return {"profile_pic": current_user.profile_pic}


@app.route("/getDiscoverPage")
def getDiscoverPage():
    # things to send to discover page
    noContent = True
    noFriends = False
    message = ""
    # Get all the friends of this user
    UserFriends = friends.query.filter_by(user_id=current_user.id).all()
    UserFriendsList = []
    for x in range(len(UserFriends)):
        UserFriendsList.append(
            {
                "friendID": UserFriends[x].friend_id,
            }
        )

    # if the user has no friends, send a message
    if len(UserFriendsList) == 0:
        message = "You have no friends or favorite restaurants. Go add some!"
        noFriends = True

    # Get all the posts from the friends of this user
    DiscoverPagePosts = []
    for friend in range(len(UserFriendsList)):
        DiscoverPagePosts.extend(getPosts(UserFriendsList[friend]["friendID"]))

    # get all the posts made by the current user
    current_user_posts = getPosts(current_user.id)
    if len(current_user_posts) != 0:
        noContent = False
        DiscoverPagePosts.extend(current_user_posts)

    # Get all the restaurants of this user

    # Get all the posts from restaurants this user follows

    # if there are no posts, send a message
    if len(DiscoverPagePosts) == 0:
        if not noFriends:
            message = (
                "There are currently no posts in your feed. Why not make the first?"
            )

        return {
            "status": 200,
            "noContent": True,
            "noFriends": noFriends,
            "message": message,
            "posts": [],
        }

    # sort the posts by most newly created to the least newly created

    return {
        "status": 200,
        "noContent": noContent,
        "noFriends": noFriends,
        "message": message,
        "posts": DiscoverPagePosts,
    }


def getPosts(userID):
    posts = []
    author = user.query.filter_by(id=userID).first()
    query_posts = user_post.query.filter_by(user_id=userID).all()
    for x in range(len(query_posts)):
        postComments = post_comments.query.filter_by(post_id=query_posts[x].id).all()
        postCommentsList = []
        for y in range(len(postComments)):
            # Get the user who posted this comment to get their
            # profile pic and name
            commentor = user.query.filter_by(id=postComments[y].author_id).first()
            commentData = {
                "AuthorID": postComments[y].author_id,
                "postText": postComments[y].post_text,
                "CommentorProfilePic": commentor.profile_pic,
                "CommentorName": commentor.username,
            }
            postCommentsList.append(commentData)
        posts.append(
            {
                "id": query_posts[x].id,
                "AuthorID": query_posts[x].author_id,
                "postText": query_posts[x].post_text,
                "postTitle": query_posts[x].post_title,
                "postLikes": query_posts[x].post_likes,
                "RestaurantName": query_posts[x].restaurant_name,
                "user_id": query_posts[x].user_id,
                "post_picture": query_posts[x].rendered_data,
                "post_comments": postCommentsList,
                "profilePic": author.profile_pic,
                "AuthorName": author.username,
            }
        )
    return posts


def getFavoriteRestaurants(userID):
    getRestaurants = favorite_restraunts.query.filter_by(user_id=userID).all()

    UserFavRestaurantsList = []
    for x in range(len(getRestaurants)):
        UserFavRestaurantsList.append(
            {
                "restaurant_name": getRestaurants[x].restaurant_name,
                "restaurant_id": getRestaurants[x].yelp_restraunt_id,
            }
        )

    return UserFavRestaurantsList


@app.route("/")
def main():
    if current_user.is_authenticated:
        if current_user.yelp_restaurant_id:
            return flask.redirect(flask.url_for("merchant"))
        elif current_user.zip_code:
            return flask.redirect(flask.url_for("discover"))
        else:
            return flask.redirect(flask.url_for("onboarding"))
    else:
        return flask.render_template("index.html")


if __name__ == "__main__":
    app.run(
        host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", 5000)), debug=True
    )
