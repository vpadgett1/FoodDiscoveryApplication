/* eslint-disable react/no-unused-prop-types */
import '../App.css';
import '../styling/RestaurantPage.css';
import React, {
  useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';
import FiveStars from '../assets/yelp_stars/regular_5.png';
import FourHalfStars from '../assets/yelp_stars/regular_4_half.png';
import FourStars from '../assets/yelp_stars/regular_4.png';
import ThreeHalfStars from '../assets/yelp_stars/regular_3_half.png';
import ThreeStars from '../assets/yelp_stars/regular_3.png';
import TwoHalfStars from '../assets/yelp_stars/regular_2_half.png';
import TwoStars from '../assets/yelp_stars/regular_2.png';
import OneHalfStars from '../assets/yelp_stars/regular_1_half.png';
import OneStars from '../assets/yelp_stars/regular_1.png';
import ZeroStars from '../assets/yelp_stars/regular_0.png';
import Post from '../Components/Post';

const RestaurantPage = () => {
  // set state
  const [restaurantName, setRestaurantName] = useState(null);
  const [restaurantRating, setRestaurantRating] = useState(null);
  const [restaurantRatingCount, setRestaurantRatingCount] = useState(null);
  const [restaurantUrl, setRestaurantUrl] = useState(null);
  const [categories, setCategories] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [openingHours, setOpeningHours] = useState(null);
  const [closingHours, setClosingHours] = useState(null);
  const [address, setAddress] = useState(null);
  const [images, setImages] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [followingRestaurant, setFollowingRestaurant] = useState(null);
  const [restaurantPosts, setRestaurantPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [userProfilePic, setUserProfilePic] = useState('');

  // get restaurant ID from session storage
  const restID = sessionStorage.getItem('restaurantID');
  async function loadPage() {
  // get yelp data
    await fetch('/restaurantprofile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restID }),
    }).then((response) => response.json()).then((data) => {
      setRestaurantName(data.data.name);
      setRestaurantRating(data.data.ratings);
      setRestaurantRatingCount(data.data.rating_count);
      setRestaurantUrl(data.data.url);
      setCategories(data.data.categories);
      setPhoneNumber(data.data.phone);
      setOpeningHours(data.data.opening[0]);
      setClosingHours(data.data.closing[0]);
      setAddress(data.data.address);
      setImages(data.data.photos[0]);
      setMainImage(data.data.img_urls);
      setFollowingRestaurant(data.data.isFollowing);
    });

    // get the user ID
    await fetch('/getUserID')
      .then((response) => response.json())
      .then((result) => {
        setUserID(result.userID);
      }).catch((error) => console.log(error));

    // get the user name
    await fetch('/getUserName')
      .then((response) => response.json())
      .then((result) => {
        setUserName(result.username);
      }).catch((error) => console.log(error));

    // get the user profile pic
    await fetch('/getUserProfilePic')
      .then((response) => response.json())
      .then((result) => {
        setUserProfilePic(result.profile_pic);
      }).catch((error) => console.log(error));

    await fetch(`/getPostsByRestaurant?restID=${restID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.posts && data.posts.length > 0) {
          setRestaurantPosts([...data.posts]);
        } else if (data.message) {
          setMessage(data.message);
        }
      }).catch((error) => console.log(error));
  }

  function addFollow() {
    fetch(`/addFavoriteRestaurant?restID=${restID}&restaurantName=${restaurantName}`, {
      method: 'POST',
    }).then((response) => response.json()).then((data) => {
      console.log(data);
      console.log(data.status);
    });
  }

  function removeFollow() {
    fetch('/deleteFavoriteRestaurant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restID }),
    }).then((response) => response.json()).then((data) => {
      console.log(data);
    });
  }

  // fetch data from backend
  useEffect(() => {
    loadPage();
  }, []);

  function renderPostsByRestaurant() {
    if (restaurantPosts && restaurantPosts.length > 0) {
      return (
        <div className="restaurantPosts">
          {restaurantPosts && restaurantPosts.map((x) => (
            <Post
              postID={x.id}
              AuthorID={x.AuthorID}
              postText={x.postText}
              postTitle={x.postTitle}
              postLikes={x.postLikes}
              profilePic={x.profilePic}
              postComments={x.post_comments}
              currentUserID={userID}
              currentUserProfilePic={userProfilePic}
              currentUserName={userName}
              AuthorName={x.AuthorName}
              ImageData={x.post_picture}
              YelpRestaurantID={x.Yelp_ID}
            />
          ))}
        </div>
      );
    }
    return (
      <div className="restaurantPosts RestaurantMessage">
        {message}
      </div>
    );
  }

  const onClickFollowButton = () => {
    const followButton = document.getElementById('followRestaurantButton');
    if (!followingRestaurant) {
      addFollow();
      followButton.innerHTML = 'Unfollow';
      setFollowingRestaurant(true);
    } else if (followingRestaurant) {
      removeFollow();
      followButton.innerHTML = 'Follow';
      setFollowingRestaurant(false);
    }

    // SPRINT 2 : style of button should change as well
  };

  function renderStars() {
    if (restaurantRating < 1) {
      return (<img src={ZeroStars} alt="yelp stars" />);
    } if (restaurantRating < 1.5) {
      return (<img src={OneStars} alt="yelp stars" />);
    } if (restaurantRating < 2) {
      return (<img src={OneHalfStars} alt="yelp stars" />);
    } if (restaurantRating < 2.5) {
      return (<img src={TwoStars} alt="yelp stars" />);
    } if (restaurantRating < 3) {
      return (<img src={TwoHalfStars} alt="yelp stars" />);
    } if (restaurantRating < 3.5) {
      return (<img src={ThreeStars} alt="yelp stars" />);
    } if (restaurantRating < 4) {
      return (<img src={ThreeHalfStars} alt="yelp stars" />);
    } if (restaurantRating < 4.5) {
      return (<img src={FourStars} alt="yelp stars" />);
    } if (restaurantRating < 5) {
      return (<img src={FourHalfStars} alt="yelp stars" />);
    }
    return (<img src={FiveStars} alt="yelp stars" />);
  }

  if (!openingHours || !closingHours || !images) {
    return (
      <>
        <Navigation />
        <h1>Loading...</h1>
      </>
    );
  }
  return (
    <>
      <Navigation />
      <img src={mainImage} alt="cover" className="mainImg" />
      <div className="infoCard1">
        <div className="TitleDiv">
          <div className="restaurantTitle">{restaurantName}</div>
          <button type="button" className={followingRestaurant ? 'UnfollowButton' : 'FollowButton'} id="followRestaurantButton" onClick={onClickFollowButton}>
            {followingRestaurant ? 'Unfollow' : 'Follow'}
          </button>
        </div>
        <div className="starsAndDollars">
          {renderStars()}
          <p>
            ratings:
            {restaurantRating}
            (
            {restaurantRatingCount}
            )
          </p>
        </div>
        <div className="website">
          <a href={restaurantUrl}>
            Yelp Website
          </a>
        </div>
        <div className="categories">{categories}</div>
        <div className="phoneNumber">{phoneNumber}</div>
      </div>
      <div className="infoCard2">
        <div className="hours">
          <div className="hoursTitle">Hours and Location</div>
          <Hours day="Sunday" openingHour={openingHours.Sunday} closingHour={closingHours.Sunday} />
          <Hours day="Monday" openingHour={openingHours.Monday} closingHour={closingHours.Monday} />
          <Hours day="Tuesday" openingHour={openingHours.Tuesday} closingHour={closingHours.Tuesday} />
          <Hours day="Wednesday" openingHour={openingHours.Wednesday} closingHour={closingHours.Wednesday} />
          <Hours day="Thursday" openingHour={openingHours.Thursday} closingHour={closingHours.Thursday} />
          <Hours day="Friday" openingHour={openingHours.Friday} closingHour={closingHours.Friday} />
          <Hours day="Saturday" openingHour={openingHours.Saturday} closingHour={closingHours.Saturday} />
        </div>
        <div className="location">
          <p>
            Address:
            {address}
          </p>
        </div>
      </div>
      <div className="subTitle">Images</div>
      <div className="restaurantImages">
        {images.map((pictures, index) => (
          <img className="restaurantImg" key={index} src={pictures} alt="restaurant food" />
        ))}
      </div>
      <div className="subTitle">Posts by the Restaurant</div>
      {renderPostsByRestaurant()}
    </>
  );
};

// TODO: PropTypes
RestaurantPage.propTypes = {
  restaurantID: PropTypes.string.isRequired,
  location: PropTypes.shape(
    { state: PropTypes.shape({ restaurantID: PropTypes.string }) },
  ).isRequired,
};

const Hours = (props) => {
  // deconstruct props
  const { day, openingHour, closingHour } = props;

  return (
    <div className="Hours">
      <div>{day}</div>
      <div>{`${openingHour}-${closingHour}`}</div>
    </div>
  );
};

Hours.propTypes = {
  day: PropTypes.string.isRequired,
  openingHour: PropTypes.string.isRequired,
  closingHour: PropTypes.string.isRequired,
};

export default RestaurantPage;
