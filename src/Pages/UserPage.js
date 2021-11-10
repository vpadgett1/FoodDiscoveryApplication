import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
import Navigation from '../Components/Navigation';
// import PropTypes from 'prop-types';

// this line will become const UserPage = (props) => { once there are props
const UserPage = () => {
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
      <div>this is a user profile</div>
    </>
  );
};

// TODO: PropTypes
UserPage.propTypes = {

};

export default UserPage;
