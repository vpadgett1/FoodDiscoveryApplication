import '../App.css';
import '../styling/DiscoverPage.css';
import React, {
  useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';
import Post from '../Components/Post';
import PopUpMessage from '../Components/PopUpMessage';
import Raincloud from '../assets/MakeFriends.png';

const DiscoverPage = () => {
  // set state
  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [userProfilePic, setUserProfilePic] = useState('');
  const [posts, setPosts] = useState([]);
  const [showCreateNewPost, setShowCreateNewPost] = useState(false);

  const [titleCharLength, setTitleCharLength] = useState(0);
  const [bodyCharLength, setBodyCharLength] = useState(0);
  const [restaurantCharLength, setRestaurantCharLength] = useState(0);

  const [canPost, setCanPost] = useState(false);

  const [noContentError, setNoContentError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [noFriends, setNoFriends] = useState(false);

  const [showMessage, setShowMessage] = useState(false);

  // const [inputImage, setInputImage] = useState('');

  const MAX_LENGTH_TITLE = 50;
  const MAX_LENGTH_BODY = 300;
  const MAX_LENGTH_RESTAURANT_NAME = 50;

  // getData gets all the information needed for the discover page
  async function getData() {
    // get the user ID
    await fetch('/getUserID')
      .then((response) => response.json())
      .then((result) => {
        setUserID(result.userID);
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

    // get content for the page
    await fetch('/getDiscoverPage')
      .then((response) => response.json())
      .then((result) => {
        if (result.status && result.status === 200) {
          console.log(result);
          // if there is no content, display the error
          if (result.noContent && result.noContent === true) {
            setNoContentError(true);
            setNoFriends(result.noFriends);
            setErrorMessage(result.message);
          // if there is content, display it
          } else {
            setPosts([...result.posts]);
            if (result.noFriends) {
              setNoFriends(result.noFriends);
              setErrorMessage(result.message);
            }
          }
        }
      })
      .catch((error) => console.log(error));
    console.log('posts saved');
  }

  useEffect(() => {
    // get user data
    getData();
  }, []);

  const createNewPost = (event) => {
    event.preventDefault();

    if (canPost) {
      // get data from forms
      const title = document.getElementById('inputTitle').value;
      const body = document.getElementById('inputBody').value;
      const restName = document.getElementById('restaurantName').value;
      const file = document.getElementById('newPostImageInput').files[0];

      const data = new FormData();
      data.append('image', file);

      fetch(`/createPost?AuthorID=${userID}&RestaurantName=${restName}&postText=${body}&postTitle=${title}`, {
        method: 'POST',
        body: data,
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status && result.status === 200) {
            const { postID, renderFile } = result;
            // we want to add this newly created post to the top of the page
            // so the user knows their post is rendered
            const p = {
              AuthorID: userID,
              postText: body,
              postTitle: title,
              postLikes: 0,
              id: postID,
              profilePic: userProfilePic,
              post_comments: [],
              currentUserID: userID,
              currentUserProfilePic: userProfilePic,
              currentUserName: userName,
              AuthorName: userName,
              post_picture: renderFile,
            };
            setPosts([p, ...posts]);
            setShowCreateNewPost(false);

            setTitleCharLength(0);
            setBodyCharLength(0);
            setRestaurantCharLength(0);
            setCanPost(false);

            // if originally displaying noContent, change that
            if (noContentError) {
              setNoContentError(false);
            }
          }
        })
        .catch((error) => console.log(error));
    } else {
      console.log('cannot post');
    }
  };

  function renderPosts() {
    if (noContentError) {
      return (
        <div className="DiscoverPageError">
          <img src={Raincloud} alt="Sad raincloud" />
          <div>{errorMessage}</div>
        </div>
      );
    }

    if (noFriends) {
      return (
        <div className="DiscoverPagePosts">
          {posts && posts.map((x) => (
            <Post
              postID={x.id}
              AuthorID={x.AuthorID}
              postText={x.postText}
              postTitle={x.postTitle}
              postLikes={x.postLikes}
              profilePic={x.profilePic}
              postComments={x.post_comments}
              currentUserID={userID}
              currentUserProfilePic={userProfilePic}
              currentUserName={userName}
              AuthorName={x.AuthorName}
              ImageData={x.post_picture}
              YelpRestaurantID={x.Yelp_ID}
            />
          ))}
          <div className="DiscoverPageError">
            <img src={Raincloud} alt="Sad raincloud" />
            <div>{errorMessage}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="DiscoverPagePosts">
        {posts && posts.map((x) => (
          <Post
            postID={x.id}
            AuthorID={x.AuthorID}
            postText={x.postText}
            postTitle={x.postTitle}
            postLikes={x.postLikes}
            profilePic={x.profilePic}
            postComments={x.post_comments}
            currentUserID={userID}
            currentUserProfilePic={userProfilePic}
            currentUserName={userName}
            AuthorName={x.AuthorName}
            ImageData={x.post_picture}
            YelpRestaurantID={x.Yelp_ID}
          />
        ))}
      </div>
    );
  }

  const onClickCreateNewPost = () => {
    if (!showCreateNewPost) {
      setShowCreateNewPost(true);
    }
  };

  function canTheUserPost() {
    if (titleCharLength > 0 && bodyCharLength > 0 && restaurantCharLength > 0) {
      setCanPost(true);
    } else {
      setCanPost(false);
    }
  }

  const onChangeTitle = () => {
    // get the title
    const title = document.getElementById('inputTitle').value;

    // get the length
    const { length } = title;

    // change state
    setTitleCharLength(length);

    canTheUserPost();
  };

  const onChangeBody = () => {
    // get the body
    const body = document.getElementById('inputBody').value;

    // get the length
    const { length } = body;

    // change state
    setBodyCharLength(length);

    canTheUserPost();
  };

  const onChangeRestaurant = () => {
    // get the restaurant name
    const restName = document.getElementById('restaurantName').value;

    // get the length
    const { length } = restName;

    // change state
    setRestaurantCharLength(length);

    canTheUserPost();
  };

  const onChangeImageInput = () => {
    const file = document.getElementById('newPostImageInput').files[0];
    console.log(file);
  };

  const cancelCreateNewPost = () => {
    // set all character lengths back to 0
    setTitleCharLength(0);
    setBodyCharLength(0);
    setRestaurantCharLength(0);

    // hide create new post
    setShowCreateNewPost(false);
    setShowMessage(false);
  };

  const onCancelCreateNewPost = () => {
    // if the lengths of any of the sections is longer than 0, display the pop up
    if (titleCharLength > 0 || bodyCharLength > 0 || restaurantCharLength > 0) {
      setShowMessage(true);
    } else {
      cancelCreateNewPost();
    }
  };

  function renderCreateNewPost() {
    if (showCreateNewPost) {
      return (
        <div className="discoverPageBackground">
          <div className="createNewPost">
            <form onSubmit={createNewPost} className="createNewPostForm">
              <div className="createNewPostInput">
                <input type="text" id="inputTitle" placeholder="Title of Post" maxLength={MAX_LENGTH_TITLE} onChange={onChangeTitle} />
                <div className="charCount">
                  {titleCharLength}
                  /
                  {MAX_LENGTH_TITLE}
                </div>
              </div>
              <div className="createNewPostInput">
                <textarea id="inputBody" placeholder="What's on your mind?" rows="5" maxLength={MAX_LENGTH_BODY} onChange={onChangeBody} />
                <div className="charCount">
                  {bodyCharLength}
                  /
                  {MAX_LENGTH_BODY}
                </div>
              </div>
              <div className="createNewPostInput">
                <input type="text" id="restaurantName" placeholder="Name of Restaurant" maxLength={MAX_LENGTH_RESTAURANT_NAME} onChange={onChangeRestaurant} />
                <div className="charCount">
                  {restaurantCharLength}
                  /
                  {MAX_LENGTH_RESTAURANT_NAME}
                </div>
              </div>
              <div className="inputImage">
                <input type="file" name="inputFile" id="newPostImageInput" accept="image/png, image/jpeg" onChange={onChangeImageInput} />
              </div>
              <button type="submit" className={canPost ? 'canPost' : ''}>Publish</button>
              <button type="button" onClick={onCancelCreateNewPost} id="CancelCreateNewPost">Cancel</button>
            </form>
          </div>
        </div>

      );
    }
    return (<></>);
  }

  function renderMessage() {
    if (showMessage) {
      return (
        <PopUpMessage
          continueText="continue"
          doNotcontinueText="do not"
          continueFunc={cancelCreateNewPost}
          doNotContinueFunc={() => setShowMessage(false)}
          message="Warning: You have unsaved changes. Continueing will not save your work. Continue?"
        />
      );
    }
    return (<></>);
  }

  return (
    <div className="discoverPage">
      {renderMessage()}
      {renderCreateNewPost()}
      <Navigation />
      <button type="button" id="createNewPostButton" onClick={onClickCreateNewPost}>+</button>
      {renderPosts()}
    </div>
  );
};

export default DiscoverPage;
