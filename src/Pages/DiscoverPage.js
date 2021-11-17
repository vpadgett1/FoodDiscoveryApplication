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

  const postDummyData = [{
    AuthorID: 'author 1', postText: 'text 1', postTitle: 'title 1', postLikes: 0,
  },
  {
    AuthorID: 'author 2', postText: 'text 2', postTitle: 'title 2', postLikes: 0,
  },
  {
    AuthorID: 'author 3', postText: 'text 3', postTitle: 'title 3', postLikes: 0,
  },
  {
    AuthorID: 'author 4', postText: 'text 4', postTitle: 'title 4', postLikes: 0,
  },
  {
    AuthorID: 'author 5', postText: 'text 5', postTitle: 'title 5', postLikes: 0,
  }];

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
    setPosts([...postDummyData]);
    console.log('posts saved');
  }

  useEffect(() => {
    // get user data
    getData();
  }, []);

  // TODO: Render component
  const createNewPost = (event) => {
    event.preventDefault();
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
      }).catch((error) => console.log(error));
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
          />
        ))}
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div>This is the discover page</div>
      <form onSubmit={createNewPost}>
        <input type="text" id="inputTitle" placeholder="Enter Title" />
        <input type="text" id="inputBody" placeholder="Enter Body" />
        <input type="text" id="restaurantName" placeholder="Name of Restaurant" />
        <button type="submit">Publish</button>
      </form>
      {renderPosts()}
    </>
  );
};

export default DiscoverPage;
