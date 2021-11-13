import '../App.css';
import React,
{
  // useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';

// this line will become const Comment = (props) => { once there are props
const Comment = () => {
  // set state
  // const [state, setState] = useState(value);

  // deconstruct props
  // uncomment the below line out once the props are in use
  // const [id, postText, RestaurantName, postID] = props;

  // TODO: fetch data from backend
  useEffect(() => {

  }, []);

  // TODO: Render component
  return (
    <>
      <div>this is a comment</div>
    </>
  );
};

// TODO: PropTypes
// uncomment the props once they are in use
Comment.propTypes = {
  /* id: PropTypes.number.isRequired,
  postText: PropTypes.string.isRequired,
  RestaurantName: PropTypes.string.isRequired,
  postID: PropTypes.number.isRequired, */
};

export default Comment;
