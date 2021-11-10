import '../App.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';
import CatPfp from '../assets/CatProfilePic.png';

// this line will become const UserPage = (props) => { once there are props
const UserPage = () => {
  // set state
  const [isFriend, setIsFriend] = useState(false);
  const [UserFavoriteRestaurants, setUserFavoriteRestaurants] = useState([
    {
      RestaurantName: 'name',
      RestaurantID: 'id',
    },
  ]);

  // deconstruct props
  // const [props] = props;

  // TODO: fetch data from backend
  useEffect(() => {
    // get user data from the backend
    const FavoriteRestaurantDummyData = [
      {
        RestaurantName: 'name',
        RestaurantID: 'id',
      },
      {
        RestaurantName: 'name2',
        RestaurantID: 'id2',
      },
      {
        RestaurantName: 'name3',
        RestaurantID: 'id3',
      },
    ];

    setUserFavoriteRestaurants([...FavoriteRestaurantDummyData]);
  }, []);

  function renderUserPosts() {
    return <div>User Posts</div>;
  }

  function renderUserFavoriteRestaurants() {
    return (
      <>
        <div>User Favorite Restaurants</div>
        {UserFavoriteRestaurants.map((x) => (
          <>
            <Link
              to="/restaurantprofile"
              state={{ restaurantID: x.RestaurantID }}
            >
              x.RestaurantName
            </Link>
          </>
        ))}
      </>
    );
  }

  const onClickAddFriendButton = () => {
    // get the button
    const addFriendButton = document.getElementById('addFriendButton');
    // remove friend, otherwise add friend
    if (isFriend) {
      addFriendButton.innerHTML = 'Add Friend';
      setIsFriend(false);
    } else {
      addFriendButton.innerHTML = 'Remove Friend';
      setIsFriend(true);
    }
  };

  // TODO: Render component
  return (
    <>
      <Navigation />
      <div className="leftSideUserProfile">
        <div className="basicInfo">
          <img src={CatPfp} alt="profile img" />
          <div className="userName">Name of User</div>
        </div>
        <button type="button" id="addFriendButton" onClick={onClickAddFriendButton}>Add Friend</button>
      </div>
      <div className="rightSideUserProfile">
        {renderUserFavoriteRestaurants()}
        {renderUserPosts()}
      </div>

    </>
  );
};

// TODO: PropTypes
UserPage.propTypes = {
  // userID: PropTypes.string.isRequired,
};

export default UserPage;
