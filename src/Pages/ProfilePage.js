import '../App.css';
import '../styling/ProfilePage.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../Components/Navigation';
import Post from '../Components/Post';
import Plus from '../assets/Plus.png';

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
  const [id, setID] = useState('');

  const navigate = useNavigate();

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

          if (data.UserDATA.id) {
            setID(data.UserDATA.id);
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

  // log out the user and send them back to the landing page
  const logout = async () => {
    await fetch('/logout')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate('/', { replace: true });
      }).catch((error) => console.log(error));
  };

  const deleteAccount = async () => {
    await fetch('/deleteAccount', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate('/', { replace: true });
      }).catch((error) => console.log(error));
  };

  function renderLeftSide() {
    return (
      <div id="profilePageLeftSide">
        <button type="button" onClick={() => changeDisplay('General')} id="GeneralButton" className={currentDisplay === 'General' ? 'selectedSubcategory' : ''}>General</button>
        <button type="button" onClick={() => changeDisplay('FriendsList')} id="FriendsListButton" className={currentDisplay === 'FriendsList' ? 'selectedSubcategory' : ''}>Friends List</button>
        <button type="button" onClick={() => changeDisplay('FavoriteRestaurants')} id="FavRestaurantButton" className={currentDisplay === 'FavoriteRestaurants' ? 'selectedSubcategory' : ''}>Favorite Restaurants</button>
        <button type="button" onClick={() => changeDisplay('YourPosts')} id="YourPostsButton" className={currentDisplay === 'YourPosts' ? 'selectedSubcategory' : ''}>Your Posts</button>
        <button type="button" onClick={logout} id="LogoutButton">Logout</button>
        <button type="button" onClick={deleteAccount} id="DeleteButton">Delete Account</button>
      </div>
    );
  }

  function renderGeneral() {
    return (
      <div id="GeneralSubcategory">
        <img src={profilePic} alt="profile pic" />
        <div className="generalRow">
          <div className="left">Username</div>
          <div className="right">{name}</div>
        </div>
        <div className="generalRow">
          <div className="left">Email</div>
          <div className="right">{email}</div>
        </div>
        <div className="generalRow">
          <div className="left">Zip Code</div>
          <div className="right">{zipcode}</div>
        </div>
        <div className="generalRow">
          <div className="left">User ID:</div>
          <div className="right">{id}</div>
        </div>
      </div>
    );
  }

  // NOTE: In sprint 2, ideally also display the name of the user and not just the id ({x.name})
  function renderFriendsList() {
    return (
      <div id="FriendsListSubcategory">
        <div className="friendsListTitle">Friends List</div>
        <div className="addFriendSearch">
          <div>Add Friend</div>
          <div>
            <input type="text" id="inputFriendID" placeholder="enter friend ID" />
            <button type="button" onClick={() => addToFriendsList()} id="addFriendButton">
              <img src={Plus} alt="plus" />
            </button>
          </div>
        </div>
        {friendsList.map((x) => (
          <div className="friendsListFriend">
            <div className="friendName">
              <img src={x.profile_pic} alt="friend profile" />
              <Link
                to="/userprofile"
                state={{ userId: x.user_id }}
              >
                {x.name}
              </Link>
            </div>
            <div className="friendButton">
              <button type="button" onClick={() => deleteFromFriendsList(x.user_id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderFavoriteRestaurants() {
    return (
      <div id="FavRestaurantSubcategory">
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
      </div>
    );
  }

  function renderYourPosts() {
    return (
      <div id="YourPostsSubcategory">
        {userPosts && userPosts.map((x) => (
          <Post
            postID={x.id}
            AuthorID={x.AuthorID}
            postText={x.postText}
            postTitle={x.postTitle}
            postLikes={x.postLikes}
            profilePic={x.profilePic}
            postComments={x.post_comments}
            currentUserID={id}
            currentUserProfilePic={profilePic}
            currentUserName={name}
            AuthorName={x.AuthorName}
          />
        ))}
      </div>
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

export default ProfilePage;
