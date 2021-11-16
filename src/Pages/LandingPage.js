import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
import LandingPageNavigation from '../Components/LandingPageNavigation';
// import PropTypes from 'prop-types';

// this line will become const LandingPage = (props) => { once there are props
const LandingPage = () => {
  // set state
  // const [state, setState] = useState(value);

  // deconstruct props
  // const [props] = props;

  // TODO: fetch data from backend
  useEffect(() => {

  }, []);

  // TODO: Render component\
  return (
    <>
      <LandingPageNavigation />
      <div>Landing Page</div>
    </>
  );
};

// TODO: PropTypes
LandingPage.propTypes = {

};

export default LandingPage;
