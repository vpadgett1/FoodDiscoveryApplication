import '../App.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../Components/Navigation';
// import PropTypes from 'prop-types';

// this line will become const ProfilePage = (props) => { once there are props
const ProfilePage = () => {
  // set state
  const [currentDisplay, setCurrentDisplay] = useState('General');
  const [friendsList, setFriendsList] = useState([]);
  const [favoriteRestaurantList, setUserFavoriteRestaurants] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [zipcode, setZipcode] = useState('');

  const navigate = useNavigate();

  /* const dummyFriendsListData = [
    {
      name: 'friend 1',
      user_id: 'id1',
    },
    {
      name: 'friend 2',
      user_id: 'id2',
    },
    {
      name: 'friend 3',
      user_id: 'id3',
    },
  ];

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
  ]; */
  // deconstruct props
  // const [props] = props;

  async function getUserProfileInformation() {
    await fetch('/getUserProfile')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // get data for General tab
        if (data.UserDATA) {
          if (data.UserDATA.email) {
            setEmail(data.UserDATA.email);
          }
          if (data.UserDATA.name) {
            setName(data.UserDATA.name);
          }
          if (data.UserDATA.profilePic) {
            setProfilePic(data.UserDATA.profilePic);
          }
          if (data.UserDATA.zipcode) {
            setZipcode(data.UserDATA.zipcode);
          }

          // get friends list
          if (data.UserFriendsList) {
            setFriendsList([...data.UserFriendsList]);
          }

          // get favorite restaurants
          if (data.UserFavRestaurantsList) {
            setUserFavoriteRestaurants([...data.UserFavRestaurantsList]);
          }

          // get user posts
          if (data.UserPostsList) {
            setUserPosts([...data.UserPostsList]);
            console.log(userPosts);
          }
        }
      }).catch((error) => console.log(error));
  }

  useEffect(() => {
    getUserProfileInformation();
    // setFriendsList(dummyFriendsListData);
    // setUserFavoriteRestaurants([...FavoriteRestaurantDummyData]);
  }, []);

  function changeDisplay(buttonPressed) {
    switch (buttonPressed) {
      case 'General':
        setCurrentDisplay('General');
        break;
      case 'FriendsList':
        setCurrentDisplay('FriendsList');
        break;
      case 'FavoriteRestaurants':
        setCurrentDisplay('FavoriteRestaurants');
        break;
      case 'YourPosts':
        setCurrentDisplay('YourPosts');
        break;
      default:
        setCurrentDisplay('General');
        break;
    }
  }

  function deleteFromFriendsList(userID) {
    // delete in database
    fetch(`/deleteFollower?follower_id=${userID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          // find index of the friend on the friends list
          const tempFriendsList = [...friendsList];
          const index = tempFriendsList.findIndex((x) => x.user_id === userID);

          // create new array without that index
          if (index !== -1) {
            tempFriendsList.splice(index, 1);

            // set friends list to the new array
            setFriendsList([...tempFriendsList]);
          }
        }
        console.log(data);
      }).catch((error) => console.log(error));
  }

  async function addToFriendsList() {
    // get the text in the text field
    const searchFriendField = document.getElementById('inputFriendID').value;

    // fetch user from database
    await fetch(`/getUserInfoByEmail?email=${searchFriendField}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // create friend
        const addFriend = {
          user_id: data.id,
        };

        // add friend in database
        fetch(`/addFollower?follower_id=${addFriend.user_id}`)
          .then((response) => response.json())
          .then((result) => {
            // update state
            if (result.status === 200) {
              setFriendsList([...friendsList, addFriend]);
            }
          }).catch((error) => console.log(error));
      }).catch((error) => console.log(error));
  }

  const logout = async () => {
    await fetch('/logout')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate('/', { replace: true });
      }).catch((error) => console.log(error));
  };

  function renderLeftSide() {
    return (
      <>
        <button type="button" onClick={() => changeDisplay('General')}>General</button>
        <button type="button" onClick={() => changeDisplay('FriendsList')}>Friends List</button>
        <button type="button" onClick={() => changeDisplay('FavoriteRestaurants')}>Favorite Restaurants</button>
        <button type="button" onClick={() => changeDisplay('YourPosts')}>Your Posts</button>
        <button type="button" onClick={logout}>Logout</button>
      </>
    );
  }

  function renderGeneral() {
    return (
      <>
        <div>General Rendered</div>
        <img src={profilePic} alt="profile pic" />
        <div>
          Name of User:
          {' '}
          {name}
        </div>
        <div>
          Email of User:
          {' '}
          {email}
        </div>
        <div>
          Zip Code:
          {' '}
          {zipcode}
        </div>
      </>
    );
  }

  // NOTE: In sprint 2, ideally also display the name of the user and not just the id ({x.name})
  function renderFriendsList() {
    return (
      <>
        <div>Friends List Rendered</div>
        <input type="text" id="inputFriendID" placeholder="enter friend ID" />
        <button type="button" onClick={() => addToFriendsList()} id="addFriendButton">Add Friend</button>
        {friendsList.map((x) => (
          <>
            <Link
              to="/userprofile"
              state={{ userId: x.user_id }}
            >
              {x.user_id}
            </Link>
            <button type="button" onClick={() => deleteFromFriendsList(x.user_id)}>Delete</button>
          </>
        ))}
      </>
    );
  }

  function renderFavoriteRestaurants() {
    return (
      <>
        <div>Favorite List Rendered</div>
        {favoriteRestaurantList.map((x) => (
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

  function renderYourPosts() {
    return (
      <>
        <div>Your Posts Rendered</div>
      </>
    );
  }

  function renderBody() {
    switch (currentDisplay) {
      case 'General':
        return renderGeneral();
      case 'FriendsList':
        return renderFriendsList();
      case 'FavoriteRestaurants':
        return renderFavoriteRestaurants();
      case 'YourPosts':
        return renderYourPosts();
      default:
        return renderGeneral();
    }
  }

  // TODO: Render component
  return (
    <>
      <Navigation />
      <div className="mainPageBody">
        {renderLeftSide()}
        {renderBody()}
      </div>
    </>
  );
};

// TODO: PropTypes
ProfilePage.propTypes = {

};

export default ProfilePage;
