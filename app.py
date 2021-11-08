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
import pyopenssl
from flask_login import UserMixin
from googleauth import get_google_provider_cfg
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
from yelpInfo import *

load_dotenv(find_dotenv())

# OAuth 2 client setup
client = WebApplicationClient(os.environ.get("GOOGLE_CLIENT_ID", None))

app = flask.Flask(__name__, static_folder="./build/static")
# This tells our Flask app to look at the results of `npm build` instead of the
# actual files in /templates when we're looking for the index page file. This allows
# us to load React code into a webpage. Look up create-react-app for more reading on
# why this is necessary.
bp = flask.Blueprint("bp", __name__, template_folder="./build")

db = SQLAlchemy(app)


class User(UserMixin, db.Model):
    id = db.Column(
        db.Integer, primary_key=True
    )  # primary keys are required by SQLAlchemy
    username = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(100), unique=True)
    profile_pic = db.Column(db.String(100))
    zipCode = db.Column(db.String(20))
    yelpRestaurantID = db.Column(db.String(20))
    favs = db.relationship("FavoriteRestraunts", backref="user", lazy=True)
    friends = db.relationship("Friends", backref="user", lazy=True)
    posts = db.relationship("UserPost", backref="user", lazy=True)


class FavoriteRestraunts(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    RestaurantName = db.Column(db.String(120))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class Friends(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    FriendID = db.Column(db.String(120))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class UserPost(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    AuthorID = db.Column(db.String(100), nullable=False)
    postText = db.Column(db.String(300), nullable=False)
    postTitle = db.Column(db.String(50), nullable=False)
    postLikes = db.Column(db.Integer)
    RestaurantName = db.Column(db.String(120))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    post_comments = db.relationship("UserPost", backref="user", lazy=True)


class PostComments(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    AuthorID = db.Column(db.String(100), nullable=False)
    postText = db.Column(db.String(300), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("UserPost.id"))


db.create_all()

app.secret_key = os.environ.get("SECRET_KEY")
login_manager = LoginManager()
login_manager.init_app(app)

# Flask-Login helper to retrieve a user from our db
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)


@bp.route("/discover")
@login_required
def discover():
    # TODO: insert the data fetched by your app main page here as a JSON
    DATA = {"your": "data here"}
    data = json.dumps(DATA)
    return flask.render_template(
        "index.html",
        data=data,
    )


@bp.route("/profile")
@login_required
def profile():
    # TODO: insert the data fetched by your app main page here as a JSON
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
        postComments = PostComments.query.filter_by(post_id=UserPosts[x].id)
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
        redirect_uri=requests.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return flask.redirect(request_uri)


@app.route("/login/callback")
def callback():
    # Get authorization code Google sent back to you
    code = requests.args.get("code")
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    # Prepare and send a request to get tokens! Yay tokens!
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=requests.url,
        redirect_url=requests.base_url,
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
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400
    # Create a user in your db with the information provided
    # by Google
    user = User(id=unique_id, name=users_name, email=users_email, profile_pic=picture)

    # Doesn't exist? Add it to the database.
    if not User.query.filter_by(id=unique_id).first():
        db.session.add(user)

    # Begin user session by logging the user in
    login_user(user)

    # Send user back to homepage
    return flask.redirect(flask.url_for("bp.index"))


@app.route("/login", methods=["POST"])
def login_post():
    ...


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return flask.redirect(flask.url_for("bp.index"))


@app.route("/save", methods=["POST"])
def save():
    ...


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


app.run(host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", 8081)), debug=True)
