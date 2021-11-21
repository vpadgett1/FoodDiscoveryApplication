/* eslint-disable react/no-unused-prop-types */
import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

// this line will become const Post = (props) => { once there are props
const Post = (props) => {
  // set state
  // const [state, setState] = useState(value);

  // deconstruct props - uncomment the below
  // once the props are used
  const {
    AuthorID, postText, postTitle, postLikes, profilePic,
  } = props;

  // TODO: fetch data from backend
  useEffect(() => {

  }, []);

  /* function renderComments() {
    console.log(postComments);
  } */

  // TODO: Render component
  return (
    <>
      <div>this is a post</div>
      <img src={profilePic} alt="profile" />
      <div>
        AuthorID:
        {' '}
        {AuthorID}
      </div>
      <div>
        postText:
        {' '}
        {postText}
      </div>
      <div>
        postTitle:
        {' '}
        {postTitle}
      </div>
      <div>
        postLikes:
        {' '}
        {postLikes}
      </div>
    </>
  );
};

// TODO: PropTypes
// uncomment the props out once they are used
Post.propTypes = {
  AuthorID: PropTypes.string.isRequired,
  postText: PropTypes.string.isRequired,
  postTitle: PropTypes.string.isRequired,
  postLikes: PropTypes.number.isRequired,
  profilePic: PropTypes.string.isRequired,
  /* postComments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    postText: PropTypes.string.isRequired,
    RestaurantName: PropTypes.string.isRequired,
    postID: PropTypes.number.isRequired,
  })).isRequired, */
};

export default Post;
