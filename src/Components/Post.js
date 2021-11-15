import '../App.css';
import React, {
  // useState,
  useEffect, useRef,
} from 'react';
// import PropTypes from 'prop-types';

// this line will become const Post = (props) => { once there are props
const Post = () => {
  const textInput = useRef(null);

  function onSubmit(event) {
    event.preventDefault();
    const post = textInput.current.value;
    fetch('/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'get_user_post': post}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  function onLikeClick(event) {
    event.preventDefault();
    const post = textInput.current.value;
    fetch('/like', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  // set state
  // const [state, setState] = useState(value);

  // deconstruct props - uncomment the below
  // once the props are used
  // const [id, AuthorID, postText, postTitle, postLikes, userID, postComments] = props;

  // TODO: fetch data from backend
  useEffect(() => {

  }, []);

  // TODO: Render component
  return (
    <>
      <div>this is a post</div>
      <div className="form">
        <form>
          <input type="text" ref={textInput} name="post" value="Whats on your mind" />
          <button className="like" type="button" onClick={onLikeClick}>Like</button>
          <input type="submit" value="Post" onClick={onSubmit} />
        </form>
      </div>
    </>
  );
};

// TODO: PropTypes
// uncomment the props out once they are used
Post.propTypes = {
  /* id: PropTypes.number.isRequired,
  AuthorID: PropTypes.string.isRequired,
  postText: PropTypes.string.isRequired,
  postTitle: PropTypes.string.isRequired,
  postLikes: PropTypes.number.isRequired,
  userID: PropTypes.number.isRequired,
  postComments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    postText: PropTypes.string.isRequired,
    RestaurantName: PropTypes.string.isRequired,
    postID: PropTypes.number.isRequired,
  })).isRequired, */
};

export default Post;
