import '../App.css';
import '../styling/UserPage.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';
import CatPfp from '../assets/CatProfilePic.png';
import Post from '../Components/Post';

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
  const [posts, setPosts] = useState([]);
  const [currentUserID, setCurrentUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [userProfilePic, setUserProfilePic] = useState('');

  function test() {
    if (otherUserID === '') {
      const location = useLocation();
      if (location.state) {
        const { userId } = location.state ? location.state : '';

        if (location && userId) {
          setUserID(userId);
        } else {
          console.log('error');
        }
      }
    }
  }

  test();

  async function getUserInfo() {
    return fetch(`/getDetailedUserInfo?userID=${otherUserID}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      }).catch((error) => console.log(error));
  }

  async function isFriends() {
    return fetch(`/isFriends?follower_id=${otherUserID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          return data.isFriends;
        }
        console.log(data);
        return false;
      }).catch(() => false);
  }

  async function getDetailedUserInfo() {
    // get information about the user
    if (otherUserID !== '') {
      const userInfo = await getUserInfo();

      if (userInfo.UserDATA) {
        setName(userInfo.UserDATA.name);
        setProfilePic(userInfo.UserDATA.profilePic);
      }

      if (userInfo.UserPostsList) {
        setPosts([...userInfo.UserPostsList]);
      }

      if (userInfo.UserFavRestaurantsList) {
        setUserFavoriteRestaurants([...userInfo.UserFavRestaurantsList]);
      }

      const friends = isFriends();
      setIsFriend(friends);
    }
  }

  async function getCurrentUserInfo() {
    // get the user ID
    await fetch('/getUserID')
      .then((response) => response.json())
      .then((result) => {
        setCurrentUserID(result.userID);
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
  }

  useEffect(() => {
    getDetailedUserInfo();
    getCurrentUserInfo();
    // check if the current user is friends with the user
    // setUserFavoriteRestaurants([...FavoriteRestaurantDummyData]);
  }, [otherUserID]);

  function renderUserPosts() {
    return (
      <>
        <div className="rightSideTitle">User Posts</div>
        {posts && posts.map((x) => (
          <Post
            postID={x.id}
            AuthorID={x.AuthorID}
            postText={x.postText}
            postTitle={x.postTitle}
            postLikes={x.postLikes}
            profilePic={x.profilePic}
            postComments={x.post_comments}
            currentUserID={currentUserID}
            currentUserProfilePic={userProfilePic}
            currentUserName={userName}
            AuthorName={x.AuthorName}
          />
        ))}
      </>
    );
  }

  function renderUserFavoriteRestaurants() {
    return (
      <>
        <div className="rightSideTitle">User Favorite Restaurants</div>
        {UserFavoriteRestaurants.map((x) => (
          <div key={x.RestaurantID}>
            <Link
              to="/restaurantprofile"
              state={{ restaurantID: x.RestaurantID }}
            >
              x.RestaurantName
            </Link>
          </div>
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
      addFriendButton.setAttribute('disabled', true);

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
          addFriendButton.disabled = false;
        }).catch((error) => {
          console.log(error);
          addFriendButton.disabled = false;
        });
    } else {
      // disable button from being pressed while writing to the database
      addFriendButton.setAttribute('disabled', true);

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
          addFriendButton.disabled = false;
        }).catch((error) => {
          console.log(error);
          addFriendButton.disabled = false;
        });
    }
  };

  return (
    <div id="userPage">
      <Navigation />
      <div className="userPage">
        <div className="leftSideUserProfile">
          <div className="basicInfo" id="basicInfo">
            <img id="profilepic" src={profilePic === '' ? CatPfp : profilePic} alt="profile img" />
            <div id="userID" className="userName">{name === '' ? 'Loading' : name}</div>
          </div>
          <button type="button" id="addFriendButton" onClick={onClickAddFriendButton}>{isFriend ? 'Remove Friend' : 'Add Friend'}</button>
        </div>
        <div className="rightSideUserProfile">
          {renderUserFavoriteRestaurants()}
          {renderUserPosts()}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
