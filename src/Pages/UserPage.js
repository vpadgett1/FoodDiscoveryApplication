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
    if (otherUserID !== '') {
      await fetch(`/getDetailedUserInfo?userID=${otherUserID}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        }).catch((error) => console.log(error));
    }
  }

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
    getDetailedUserInfo();
    setUserFavoriteRestaurants([...FavoriteRestaurantDummyData]);
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
      /* await fetch('\\deleteFollower')
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // make button usable again
          addFriendButton.innerHTML = 'Add Friend';
          setIsFriend(false);
        }).catch((error) => console.log(error)); */

      // make button usable again - remove these two lines when fetch is implemented
      addFriendButton.innerHTML = 'Add Friend';
      setIsFriend(false);
    } else {
      // disable button from being pressed while writing to the database

      // add new relationship to the database
      /* await fetch('\\addFollower')
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // make button usable again
          addFriendButton.innerHTML = 'Remove Friend';
          setIsFriend(true);
        }).catch((error) => console.log(error)); */

      // make button usable again - remove these two lines when fetch is implemented
      addFriendButton.innerHTML = 'Remove Friend';
      setIsFriend(true);
    }
  };

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
