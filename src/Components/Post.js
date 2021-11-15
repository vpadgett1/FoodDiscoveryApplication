import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';

// this line will become const Post = (props) => { once there are props
const Post = () => {
  const item = {
    authorID: 'some-id',
    postText: 'text',
    postTitle:'Title',
    postLikes: 'postLikes',
    userID: 'userID',
    postComments: 'postComments',
    type: 'type',
  };

  return (
    <div className = "post">
      <h3> Username </h3>
      <div className = "postTitle">
        <h2>Post Title</h2>
      </div>
      <div className = "postText">
        <p>Some information about some restaurant that user
          has gone to and now talking about if friends should go
          or not or if it really sucks.</p>
          <div className = "postComment">
            <p>Some comment someone left about the post</p>
          </div>
      </div>
    </div>
  )
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
