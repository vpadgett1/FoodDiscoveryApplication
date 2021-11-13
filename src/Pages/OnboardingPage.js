import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

// this line will become const OnboardingPage = (props) => { once there are props
const OnboardingPage = () => {
  // set state
  // const [state, setState] = useState(value);

  // deconstruct props
  // const [props] = props;

  // TODO: fetch data from backend
  useEffect(() => {

  }, []);

  // TODO: This method should post the user data for a new user
  // after the user answers onboarding questions
  // const createAccount => () {

  // }

  // TODO: This method should display an error if the user is
  // unable to create an account
  // const showErrors => () {

  // }

  // TODO: Render component
  return (
    <>
      <div>this is an onboarding page</div>
      <Link to="/discover">Continue</Link>
    </>
  );
};

export default OnboardingPage;

// TODO: PropTypes
OnboardingPage.propTypes = {

};
