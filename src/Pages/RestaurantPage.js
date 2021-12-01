/* eslint-disable react/no-unused-prop-types */
import '../App.css';
import React, {
  // useState,
  useEffect, useState,
  // useState,
} from 'react';
// import $ from 'jquery';s
// import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';
// import TempRestaurantBackground from '../assets/TempRestaurantBackgroundImg.png';
import FiveStars from '../assets/yelp_stars/regular_5.png';
import TempMap from '../assets/TempMap.png';
// import Sandwiches from '../assets/Sandwiches.png';
// import Post from '../Components/Post';

// this line will become const RestaurantPage = (props) => { once there are props
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
  // const [postsAboutRestaurant, setPostsAboutRestaurant] = useState([]);
  // const [postsByRestaurant, setPostsByRestaurant] = useState([]);
  const [followingRestaurant, setFollowingRestaurant] = useState(null);
  // const [restaurantID] = useState('nothing');

  // deconstruct props
  const restID = sessionStorage.getItem('restaurantID');
  // console.log(restID);
  function loadPage() {
  // get yelp data
    fetch('/restaurantprofile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restID }),
    }).then((response) => response.json()).then((data) => {
      // console.log(data.data.opening[0]);
      console.log(data.data);
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
    });
  }
  function addFollow() {
    fetch('/addFavoriteRestaurant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restID }),
    }).then((response) => response.json()).then((data) => {
      console.log(data);
      console.log(data.status);
      // if (data.status === 200) {
      //   setFollowingRestaurant(true);
      // } else {
      //   setFollowingRestaurant(false);
      // }
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
      // if (data.status === 200) {
      //   setFollowingRestaurant(false);
      // } else {
      //   setFollowingRestaurant(true);
      // }
      // console.log(data.status);
    });
  }
  // loadPage();
  // get posts made by the restaurant
  /* await fetch('\\getPostsByRestaurant')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      }).catch((error) => console.log(error)); */

  // get posts about the restaurant
  /* await fetch('\\getPostsAboutRestaurant')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      }).catch((error) => console.log(error)); */

  // STRETCH GOAL FETCH - an image from google
  // maps of the location of the restaurant
  // await fetch("\mapsImage")
  // }

  // TODO: fetch data from backend
  useEffect(() => {
    loadPage();
  }, []);

  function renderPostsByRestaurant() {
    /* <div className="restaurantPosts">
    <Post />
    <Post />
    <Post />
  </div> */
    return (<div className="restaurantPosts" />);
  }

  function renderPostsAboutRestaurnat() {
    /* <div className="restaurantPosts">
    <Post />
    <Post />
    <Post />
  </div> */
    return (<div className="restaurantPosts" />);
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

  // function test() {
  //   const location = useLocation();
  //   const { restaurantID } = location.state;

  //   if (location && restaurantID) {
  //     console.log(restaurantID);
  //   } else {
  //     console.log('error');
  //   }
  // }

  // test();

  // function getID() {
  //   console.log(sessionStorage.getItem('restaurantID'));
  // }
  // getID();
  // TODO: Render component
  if (!openingHours || !closingHours || !images) {
    return (<><h1>Loading...</h1></>);
  }
  return (
    <>
      <Navigation />
      <img src={mainImage} alt="cover" />
      <div className="restaurantInfo1">
        <div className="restaurantTitle">{restaurantName}</div>
        <div className="website">
          <a href={restaurantUrl}>
            Yelp Website
          </a>
        </div>
        <div className="starsAndDollars">
          <img src={FiveStars} alt="yelp stars" />
          <p>
            ratings:
            {restaurantRating}
            (
            {restaurantRatingCount}
            )
          </p>
        </div>
        <div className="categories">{categories}</div>
        <div className="phoneNumber">{phoneNumber}</div>
        <button type="button" className="followRestaurantButton" id="followRestaurantButton" onClick={onClickFollowButton}>Follow Restaurant</button>
      </div>
      <div className="restaurantInfo2">
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
          <img src={TempMap} alt="map" />
        </div>
      </div>
      <div className="subTitle">Images</div>
      <div className="restaurantImages">
        {images.map((pictures, index) => (
          <img width="80%" height="70%" key={index} src={pictures} alt="restaurant food" />
        ))}
      </div>
      <div className="subTitle">Posts by the Restaurant</div>
      {renderPostsByRestaurant()}
      <div className="subTitle">Posts about the Restaurant</div>
      {renderPostsAboutRestaurnat()}
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
