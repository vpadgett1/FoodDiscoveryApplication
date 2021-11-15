import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

// this line will become const Navigation = (props) => { once there are props
const Navigation = () => {
  // set state
  // const [state, setState] = useState(value);

  // deconstruct props
  // const [props] = props;

  // TODO: fetch data from backend
  useEffect(() => {

  }, []);

  // TODO: Render component
  return (
    <div className="navigation">
      <Link to="/discover">Discover</Link>
      <Link to="/search">Search</Link>
      <Link to="/map">Map</Link>
      <Link to="/profile">Profile</Link>
    </div>
  );
};

// TODO: PropTypes
Navigation.propTypes = {

};

export default Navigation;
