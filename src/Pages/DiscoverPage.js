import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';
import Post from '../Components/Post';

// this line will become const DiscoverPage = (props) => { once there are props
const DiscoverPage = () => {
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
      <Navigation />
      <div>This is the discover page</div>
      <Post />
    </>
  );
};

// TODO: PropTypes
DiscoverPage.propTypes = {

};

export default DiscoverPage;
