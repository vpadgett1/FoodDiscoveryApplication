import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
import Navigation from '../Components/Navigation';
// import PropTypes from 'prop-types';

// this line will become const ProfilePage = (props) => { once there are props
const ProfilePage = () => {
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
      <div>This is the profile page</div>
    </>
  );
};

// TODO: PropTypes
ProfilePage.propTypes = {

};

export default ProfilePage;
