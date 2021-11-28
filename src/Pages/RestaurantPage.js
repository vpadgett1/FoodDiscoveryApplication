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
import TempRestaurantBackground from '../assets/TempRestaurantBackgroundImg.png';
import FiveStars from '../assets/yelp_stars/regular_5.png';
import TempMap from '../assets/TempMap.png';
import Sandwiches from '../assets/Sandwiches.png';
// import Post from '../Components/Post';

// this line will become const RestaurantPage = (props) => { once there are props
const RestaurantPage = () => {
  // set state
  /* const [restaurantName, setRestaurantName] = useState('');
  const [restaurantRating, setRestaurantRating] = useState('');
  const [categories, setCategories] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hours, setHours] = useState({});
  const [location, setLocation] = useState({});
  const [images, setImages] = useState([]);
  const [postsAboutRestaurant, setPostsAboutRestaurant] = useState([]);
  const [postsByRestaurant, setPostsByRestaurant] = useState([]); */
  const [followingRestaurant, setFollowingRestaurant] = useState(false);
  // const [restaurantID] = useState('nothing');

  // deconstruct props

  // async function loadPage() {
  // get yelp data
  /* await fetch('\\getYelpData')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      }).catch((error) => console.log(error));

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
    // loadPage();
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
      followButton.innerHTML = 'Following';
      setFollowingRestaurant(true);
    } else {
      followButton.innerHTML = 'Follow Restaurant';
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

  function getID() {
    console.log(sessionStorage.getItem('restaurantID'));
  }
  getID();
  // TODO: Render component
  return (
    <>
      <Navigation />
      <img src={TempRestaurantBackground} alt="cover" />
      <div className="restaurantInfo1">
        <div className="restaurantTitle">Name of Restaurant</div>
        <div className="starsAndDollars">
          <img src={FiveStars} alt="yelp stars" />
        </div>
        <div className="categories">Categories: bla bla bla</div>
        <div className="phoneNumber">###-###-####</div>
        <button type="button" className="followRestaurantButton" id="followRestaurantButton" onClick={onClickFollowButton}>Follow Restaurant</button>
      </div>
      <div className="restaurantInfo2">
        <div className="hours">
          <div className="hoursTitle">Hours and Location</div>
          <Hours day="Sunday" openingHour="11:00" closingHour="17:00" />
          <Hours day="Monday" openingHour="11:00" closingHour="17:00" />
          <Hours day="Tuesday" openingHour="11:00" closingHour="17:00" />
          <Hours day="Wednesday" openingHour="11:00" closingHour="17:00" />
          <Hours day="Thursday" openingHour="11:00" closingHour="17:00" />
          <Hours day="Friday" openingHour="11:00" closingHour="17:00" />
          <Hours day="Saturday" openingHour="11:00" closingHour="17:00" />
        </div>
        <div className="location">
          <img src={TempMap} alt="map" />
        </div>
      </div>
      <div className="subTitle">Images</div>
      <div className="restaurantImages">
        <img src={Sandwiches} alt="restaurant food" />
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
