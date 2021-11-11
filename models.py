# pylint: disable=E1101
# pylint: disable=C0413
# pylint: disable=W1508
# pylint: disable=R0903
# pylint: disable=W0603
from app import db
from flask_login import UserMixin

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