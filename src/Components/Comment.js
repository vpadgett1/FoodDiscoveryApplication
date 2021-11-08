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
  // const [props] = props;

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
Comment.propTypes = {

};

export default Comment;
