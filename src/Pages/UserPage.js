import '../App.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const [otherUserID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');

  function test() {
    if (otherUserID === '') {
      const location = useLocation();
      const { userId } = location.state;

      if (location && userId) {
        console.log(userId);
        setUserID(userId);
      } else {
        console.log('error');
      }
    }
  }

  test();

  async function getDetailedUserInfo() {
    // get information about the user
    if (otherUserID !== '') {
      await fetch(`/getDetailedUserInfo?userID=${otherUserID}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          if (data.UserDATA) {
            setName(data.UserDATA.name);
            setProfilePic(data.UserDATA.profilePic);
          }

          if (data.UserFavRestaurantsList) {
            setUserFavoriteRestaurants([...data.UserFavRestaurantsList]);
          }
        }).catch((error) => console.log(error));

      await fetch(`/isFriends?follower_id=${otherUserID}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            setIsFriend(data.isFriends);
          }
          console.log(data);
        }).catch((error) => console.log(error));
    }
  }

  useEffect(() => {
    // get user data from the backend
    /* const FavoriteRestaurantDummyData = [
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
    ]; */
    getDetailedUserInfo();
    // check if the current user is friends with the user
    // setUserFavoriteRestaurants([...FavoriteRestaurantDummyData]);
  }, [otherUserID]);

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

  const onClickAddFriendButton = async () => {
    // get the button
    const addFriendButton = document.getElementById('addFriendButton');
    // remove friend, otherwise add friend
    if (isFriend) {
      // disable button from being pressed while writing to the database

      // remove new relationship to the database
      await fetch(`/deleteFollower?follower_id=${otherUserID}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // make button usable again
          if (data.status === 200) {
            addFriendButton.innerHTML = 'Add Friend';
            setIsFriend(false);
          }
        }).catch((error) => console.log(error));
    } else {
      // disable button from being pressed while writing to the database

      // add new relationship to the database
      await fetch(`/addFollower?follower_id=${otherUserID}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // make button usable again

          if (data.status === 200) {
            addFriendButton.innerHTML = 'Remove Friend';
            setIsFriend(true);
          }
        }).catch((error) => console.log(error));
    }
  };

  return (
    <>
      <Navigation />
      <div className="leftSideUserProfile">
        <div className="basicInfo">
          <img src={profilePic === '' ? CatPfp : profilePic} alt="profile img" />
          <div className="userName">{name === '' ? 'Loading' : name}</div>
        </div>
        <button type="button" id="addFriendButton" onClick={onClickAddFriendButton}>{isFriend ? 'Remove Friend' : 'Add Friend'}</button>
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
