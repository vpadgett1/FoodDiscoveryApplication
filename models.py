# pylint: disable=E1101
# pylint: disable=C0413
# pylint: disable=W1508
# pylint: disable=R0903
# pylint: disable=W0603
from app import db
from flask_login import UserMixin
from sqlalchemy.sql import func
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy_imageattach.entity import Image, image_attachment


class user(UserMixin, db.Model):
    id = db.Column(
        db.Integer, primary_key=True
    )  # primary keys are required by SQLAlchemy
    username = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(100), unique=True)
    profile_pic = db.Column(db.String(100))
    zip_code = db.Column(db.String(20))
    yelp_restaurant_id = db.Column(db.String(100))
    favs = db.relationship(
        "favorite_restraunts", backref="user", lazy=True, passive_deletes=True
    )
    friends = db.relationship(
        "friends", backref="user", lazy=True, passive_deletes=True
    )
    posts = db.relationship(
        "user_post", backref="user", lazy=True, passive_deletes=True
    )

    def __repr__(self):
        return f"<User {self.username}>"

    def get_username(self):
        return self.username


class favorite_restraunts(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    restaurant_name = db.Column(db.String(120))
    yelp_restraunt_id = db.Column(db.String(120))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))


class friends(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    friend_name = db.Column(db.String(120))
    friend_id = db.Column(db.String(120))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))


class user_post(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.String(100), nullable=False)
    post_text = db.Column(db.String(300), nullable=False)
    post_title = db.Column(db.String(50), nullable=False)
    post_likes = db.Column(db.Integer)
    restaurant_name = db.Column(db.String(120))
    image_data = db.Column(db.LargeBinary)  # Actual data, needed for Download
    rendered_data = db.Column(db.Text)  # Data to render the pic in browser
    date_created = db.Column(db.DateTime(timezone=True), server_default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))
    post_comments = db.relationship("post_comments", backref="user", lazy=True)

class post_comments(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.String(100), nullable=False)
    post_text = db.Column(db.String(300), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("user_post.id", ondelete="CASCADE"))


db.create_all()
