import '../App.css';
import '../styling/MerchantPage.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../Components/Post';
import PopUpMessage from '../Components/PopUpMessage';
import BackArrow from '../assets/BackArrow.png';

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
  const [profilePic, setProfilePic] = useState('');

  const MAX_LENGTH_TITLE = 50;
  const MAX_LENGTH_BODY = 300;
  const [titleCharLength, setTitleCharLength] = useState(0);
  const [bodyCharLength, setBodyCharLength] = useState(0);
  const [canPost, setCanPost] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

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
        if (result.UserDATA.profilePic) {
          setProfilePic(result.UserDATA.profilePic);
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

  function canTheUserPost() {
    if (titleCharLength > 0 && bodyCharLength > 0) {
      setCanPost(true);
    } else {
      setCanPost(false);
    }
  }

  const onChangeTitle = () => {
    // get the title
    const title = document.getElementById('inputTitleMerchant').value;

    // get the length
    const { length } = title;

    // change state
    setTitleCharLength(length);

    canTheUserPost();
  };

  const onChangeBody = () => {
    // get the body
    const body = document.getElementById('inputBodyMerchant').value;

    // get the length
    const { length } = body;

    // change state
    setBodyCharLength(length);

    canTheUserPost();
  };

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
    await fetch('/logout')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate('/', { replace: true });
      }).catch((error) => console.log(error));
  };

  function renderLeftSide() {
    // add this in once we have the functionalty:
    // <button type="button" id="CostumerPostsBtn"
    // onClick={() => selectSubcategory('CostumerPosts')}>Costumer Posts</button>
    return (
      <div className="merchantLeftSide">
        <button type="button" id="GeneralBtn" onClick={() => selectSubcategory('General')}>General</button>
        <button type="button" id="YourPostsBtn" onClick={() => selectSubcategory('YourPosts')}>Your Posts</button>
        <button type="button" id="LogoutBtn" onClick={logout}>Logout</button>
      </div>
    );
  }

  function renderGeneral() {
    return (
      <div className="merchantRightSide">
        <div className="GeneralTitle">General</div>
        <div className="GeneralSubcategory">
          <div className="left">Restaurant Name:</div>
          <div className="right">{restaurantName}</div>
        </div>
        <div className="GeneralSubcategory">
          <div className="left">Email</div>
          <div className="right">{email}</div>
        </div>
        <div className="GeneralSubcategory">
          <div className="left">User name</div>
          <div className="right">{name}</div>
        </div>
        <div className="GeneralSubcategory">
          <div className="left">Restaurant Yelp ID</div>
          <div className="right">{yelpRestaurantID}</div>
        </div>
      </div>
    );
  }

  const onClickCreateNewPost = () => {
    setCurrentSub('NewPost');
  };

  function renderYourPosts() {
    if (restaurantPosts.length === 0) {
      return (
        <div className="merchantRightSide">
          <div className="merchantYourPosts">
            <div>Your Posts</div>
            <button type="button" onClick={onClickCreateNewPost}>New Post</button>
          </div>
          <div className="noPostsMessage">No posts</div>
        </div>
      );
    }
    return (
      <div className="merchantRightSide">
        <div className="merchantYourPosts">
          <div>Your Posts</div>
          <button type="button" onClick={onClickCreateNewPost}>New Post</button>
        </div>
        {restaurantPosts && restaurantPosts.map((x) => (
          <Post
            postID={x.id}
            AuthorID={x.AuthorID}
            postText={x.postText}
            postTitle={x.postTitle}
            postLikes={x.postLikes}
            profilePic={x.profilePic}
            postComments={x.post_comments}
            currentUserID={userID}
            currentUserProfilePic={profilePic}
            currentUserName={name}
            AuthorName={x.AuthorName}
            ImageData={x.post_picture}
            YelpRestaurantID={x.Yelp_ID}
          />
        ))}
      </div>
    );
  }

  function renderCostumerPosts() {
    console.log(restaurantPosts);
    return (
      <div className="merchantRightSide">
        <div>Costumer Posts</div>
      </div>
    );
  }

  const createNewPost = (event) => {
    event.preventDefault();
    // get data from forms
    if (canPost) {
      const title = document.getElementById('inputTitleMerchant').value;
      const body = document.getElementById('inputBodyMerchant').value;
      const file = document.getElementById('newPostImageInput').files[0];

      const data = new FormData();
      data.append('image', file);

      fetch(`/createPost?AuthorID=${userID}&RestaurantName=${restaurantName}&postText=${body}&postTitle=${title}`, {
        method: 'POST',
        body: data,
      })
        .then((response) => response.json())
        .then((result) => {
          // show the new post
          const { postID, renderFile } = result;
          // we want to add this newly created post to the top of the page
          // so the user knows their post is rendered
          const p = {
            AuthorID: userID,
            postText: body,
            postTitle: title,
            postLikes: 0,
            id: postID,
            profilePic,
            post_comments: [],
            currentUserID: userID,
            currentUserProfilePic: profilePic,
            currentUserName: name,
            AuthorName: name,
            post_picture: renderFile,
          };
          setRestaurantPosts([p, ...restaurantPosts]);

          setCurrentSub('YourPosts');
          // set all character lengths back to 0
          setTitleCharLength(0);
          setBodyCharLength(0);

          // hide create new post
          setCurrentSub('YourPosts');
          setShowMessage(false);
          setCanPost(false);
        }).catch((error) => console.log(error));
    }
  };

  const backButtonPress = () => {
    // set all character lengths back to 0
    setTitleCharLength(0);
    setBodyCharLength(0);

    // hide create new post
    setCurrentSub('YourPosts');
    setShowMessage(false);
    setCanPost(false);
  };

  const onBackButtonPress = () => {
    // if the lengths of any of the sections is longer than 0, display the pop up
    if (canPost) {
      setShowMessage(true);
    } else {
      backButtonPress();
    }
  };

  function renderCreatePost() {
    return (
      <div className="merchantRightSide">
        <div className="createNewPostMerchantTop">
          <button type="button" onClick={onBackButtonPress}>
            <img src={BackArrow} alt="back button" />
          </button>
          <div>Create Post</div>
        </div>
        <form onSubmit={createNewPost}>
          <div className="inputTitleMerchantDiv">
            <input type="text" id="inputTitleMerchant" placeholder="Enter Title" onChange={onChangeTitle} maxLength={MAX_LENGTH_TITLE} />
            <div className="inputTitleMerchantCharCount">
              {titleCharLength}
              /
              {MAX_LENGTH_TITLE}
            </div>
          </div>
          <div className="inputBodyMerchant">
            <input type="text" id="inputBodyMerchant" placeholder="Enter Body" onChange={onChangeBody} maxLength={MAX_LENGTH_BODY} />
            <div className="inputBodyMerchantCharCount">
              {bodyCharLength}
              /
              {MAX_LENGTH_BODY}
            </div>
            <div className="createPostMerchantButton">
              <button type="submit" className={canPost ? 'canPost' : 'cannotPost'}>Publish</button>
            </div>
            <div className="inputImage">
              <input type="file" name="inputFile" id="newPostImageInput" accept="image/png, image/jpeg" />
            </div>
          </div>
        </form>
      </div>
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

  function renderMessage() {
    if (showMessage) {
      return (
        <PopUpMessage
          continueText="continue"
          doNotcontinueText="do not"
          continueFunc={backButtonPress}
          doNotContinueFunc={() => setShowMessage(false)}
          message="Warning: You have unsaved changes. Continueing will not save your work. Continue?"
        />
      );
    }
    return (<></>);
  }

  return (
    <div className="merchantPage">
      {renderMessage()}
      <div className="topBarMerchant">FoodMe - Merchant</div>
      <div className="merchantBody">
        {renderLeftSide()}
        {renderBody()}
      </div>
    </div>
  );
};

export default MerchantPage;
