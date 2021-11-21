import '../App.css';
import React, {
  useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';
import Post from '../Components/Post';

const DiscoverPage = () => {
  // set state
  const [userID, setUserID] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showCreateNewPost, setShowCreateNewPost] = useState(false);

  const [titleCharLength, setTitleCharLength] = useState(0);
  const [bodyCharLength, setBodyCharLength] = useState(0);
  const [restaurantCharLength, setRestaurantCharLength] = useState(0);

  const [canPost, setCanPost] = useState(false);

  const MAX_LENGTH_TITLE = 50;
  const MAX_LENGTH_BODY = 300;
  const MAX_LENGTH_RESTAURANT_NAME = 50;

  // getData gets all the information needed for the discover page
  async function getData() {
    // get the user ID
    await fetch('/getUserID')
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUserID(result.userID);
      }).catch((error) => console.log(error));

    // get content for the page
    await fetch('/getDiscoverPage')
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status && result.status === 200) {
          setPosts([...result.posts]);
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

      fetch(`/createPost?AuthorID=${userID}&RestaurantName=${restName}&postText=${body}&postTitle=${title}`)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // we want to add this newly created post to the top of the page
          // so the user knows their post is rendered
          const p = {
            AuthorID: userID, postText: body, postTitle: title, postLikes: 0,
          };
          setPosts([p, ...posts]);
          setShowCreateNewPost(false);
        }).catch((error) => console.log(error));
    } else {
      console.log('cannot post');
    }
  };

  function renderPosts() {
    return (
      <>
        {posts && posts.map((x) => (
          <Post
            AuthorID={x.AuthorID}
            postText={x.postText}
            postTitle={x.postTitle}
            postLikes={x.postLikes}
            profilePic={x.profilePic}
          />
        ))}
      </>
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

  const onCancelCreateNewPost = () => {
    // set all character lengths back to 0
    setTitleCharLength(0);
    setBodyCharLength(0);
    setRestaurantCharLength(0);

    // hide create new post
    setShowCreateNewPost(false);
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
              <button type="submit" className={canPost ? 'canPost' : ''}>Publish</button>
              <button type="button" onClick={onCancelCreateNewPost} id="CancelCreateNewPost">Cancel</button>
            </form>
          </div>
        </div>

      );
    }
    return (<></>);
  }

  return (
    <>
      {renderCreateNewPost()}
      <Navigation />
      <button type="button" id="createNewPostButton" onClick={onClickCreateNewPost}>+</button>
      {renderPosts()}
    </>
  );
};

export default DiscoverPage;
