import '../App.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../Components/Post';
// import PropTypes from 'prop-types';

// SPRINT 2: MERCHANT CAN SEE POSTS ABOUT THEM
const MerchantPage = () => {
  // set state
  const [currentSub, setCurrentSub] = useState('General');
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [yelpRestaurantID, setYelpRestaurantID] = useState('');
  const [restaurantPosts, setRestaurantPosts] = useState([]);
  const [userID, setUserID] = useState([]);

  const navigate = useNavigate();

  async function getMerchantData() {
    await fetch('/getRestaurantData')
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status && result.status === 200) {
          setRestaurantName(result.data.names);
        }
      }).catch((error) => console.log(error));

    await fetch('/getUserProfile')
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setEmail(result.UserDATA.email);
        setName(result.UserDATA.name);
        setYelpRestaurantID(result.UserDATA.yelpRestaurantID);
        if (result.UserPostsList) {
          setRestaurantPosts([...result.UserPostsList]);
        }
      }).catch((error) => console.log(error));

    await fetch('/getUserID')
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUserID(result.userID);
      }).catch((error) => console.log(error));
  }

  useEffect(() => {
    getMerchantData();
  }, []);

  function selectSubcategory(choice) {
    switch (choice) {
      case 'General':
        setCurrentSub('General');
        break;
      case 'YourPosts':
        setCurrentSub('YourPosts');
        break;
      case 'CostumerPosts':
        setCurrentSub('CostumerPosts');
        break;
      default:
        setCurrentSub('General');
        break;
    }
  }

  const logout = async () => {
    console.log('Logout');

    // post to backend to log out usre

    // go bck to main page
    navigate('/');
  };

  function renderLeftSide() {
    return (
      <>
        <button type="button" id="GeneralBtn" onClick={() => selectSubcategory('General')}>General</button>
        <button type="button" id="YourPostsBtn" onClick={() => selectSubcategory('YourPosts')}>Your Posts</button>
        <button type="button" id="CostumerPostsBtn" onClick={() => selectSubcategory('CostumerPosts')}>Costumer Posts</button>
        <button type="button" id="LogoutBtn" onClick={logout}>Logout</button>
      </>
    );
  }

  function renderGeneral() {
    return (
      <>
        <div>General</div>
        <div>
          Restaurant Name:
          {restaurantName}
        </div>
        <div>
          Email
          {' '}
          {email}
        </div>
        <div>
          User name:
          {' '}
          {name}
        </div>
        <div>
          Restaurant Yelp ID:
          {' '}
          {yelpRestaurantID}
        </div>
      </>
    );
  }

  const onClickCreateNewPost = () => {
    setCurrentSub('NewPost');
  };

  function renderYourPosts() {
    return (
      <>
        <div>Your Posts</div>
        <button type="button" onClick={onClickCreateNewPost}>New Post</button>
        {restaurantPosts && restaurantPosts.map((x) => (
          <Post
            AuthorID={x.AuthorID}
            postText={x.postText}
            postTitle={x.postTitle}
            postLikes={x.postLikes}
          />
        ))}
      </>
    );
  }

  function renderCostumerPosts() {
    console.log(restaurantPosts);
    return (
      <>
        <div>Costumer Posts</div>
      </>
    );
  }

  const createNewPost = (event) => {
    event.preventDefault();
    // get data from forms
    const title = document.getElementById('inputTitle').value;
    const body = document.getElementById('inputBody').value;

    fetch(`/createPost?AuthorID=${userID}&RestaurantName=${restaurantName}&postText=${body}&postTitle=${title}`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setCurrentSub('YourPosts');
      }).catch((error) => console.log(error));
  };

  const backButtonPress = () => {
    setCurrentSub('YourPosts');
  };

  function renderCreatePost() {
    return (
      <>
        <button type="button" onClick={backButtonPress}>Back</button>
        <div>Create Post</div>
        <form onSubmit={createNewPost}>
          <input type="text" id="inputTitle" placeholder="Enter Title" />
          <input type="text" id="inputBody" placeholder="Enter Body" />
          <button type="submit">Publish</button>
        </form>
      </>
    );
  }

  function renderBody() {
    switch (currentSub) {
      case 'General':
        return renderGeneral();
      case 'YourPosts':
        return renderYourPosts();
      case 'CostumerPosts':
        return renderCostumerPosts();
      case 'NewPost':
        return renderCreatePost();
      default:
        return renderGeneral();
    }
  }

  // TODO: Render component
  return (
    <>
      <div>Merchant Page</div>
      {renderLeftSide()}
      {renderBody()}
    </>
  );
};

// TODO: PropTypes
MerchantPage.propTypes = {

};

export default MerchantPage;
