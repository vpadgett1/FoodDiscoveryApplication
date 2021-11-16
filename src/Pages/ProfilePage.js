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
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [zipcode, setZipcode] = useState('');

  const navigate = useNavigate();

  const dummyFriendsListData = [
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
  ];
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
        }
      }).catch((error) => console.log(error));
  }

  useEffect(() => {
    getUserProfileInformation();
    setFriendsList(dummyFriendsListData);
    setUserFavoriteRestaurants([...FavoriteRestaurantDummyData]);
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

  function addToFriendsList() {
    // fetch user from database

    // get the text in the text field
    const searchFriendField = document.getElementById('inputFriendID');

    // create friend
    const addFriend = {
      name: searchFriendField.value,
      user_id: searchFriendField.value,
    };

    // update state
    setFriendsList([...friendsList, addFriend]);
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
              {x.name}
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
