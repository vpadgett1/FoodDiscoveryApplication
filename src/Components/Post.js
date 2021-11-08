import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';

// this line will become const Post = (props) => { once there are props
const Post = () => {
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
