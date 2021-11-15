import '../App.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// this line will become const OnboardingPage = (props) => { once there are props
const OnboardingPage = () => {
  // set state
  const [selectedButton, setSelectedButton] = useState('none');

  const navigate = useNavigate();

  // deconstruct props

  // TODO: fetch data from backend
  useEffect(() => {
    // TODO: Render component
  }, []);

  // TODO: This method should post the user data for a new user
  // after the user answers onboarding questions
  // const createAccount => () {

  // }

  // TODO: This method should display an error if the user is
  // unable to create an account
  // const showErrors => () {

  // }

  const createRegularUserAccount = async () => {
    // get input
    const input = document.getElementById('zipCodeInput').value;

    // send to database, wait until db responds before continueing
    console.log(input);

    // go to next page
    navigate('/discover');
  };

  function renderRegularUserQuestions() {
    return (
      <>
        <div>Please enter your zip code</div>
        <input type="text" placeholder="Zip Code" id="zipCodeInput" />
        <button type="button" onClick={createRegularUserAccount}>Continue</button>
      </>
    );
  }

  const createMerchantUserAccount = async () => {
    // get input
    const input = document.getElementById('yelpRestaurantID').value;

    // send to database, wait until db responds before continueing
    console.log(input);

    // go to next page
    navigate('/merchant');
  };

  function renderMerchantUserQuestions() {
    return (
      <>
        <div>Please enter your yelp restaurant id</div>
        <input type="text" placeholder="Zip Code" id="yelpRestaurantID" />
        <button type="button" onClick={createMerchantUserAccount}>Continue</button>
      </>
    );
  }

  function onUserChoice(choice) {
    setSelectedButton(choice);
  }

  function renderRegularOrMerchantButtons() {
    return (
      <>
        <button type="button" onClick={() => onUserChoice('Regular')}>Regular</button>
        <button type="button" onClick={() => onUserChoice('Merchant')}>Merchant</button>
      </>
    );
  }

  function renderBody() {
    switch (selectedButton) {
      case 'Regular':
        return renderRegularUserQuestions();
      case 'Merchant':
        return renderMerchantUserQuestions();
      default:
        return <></>;
    }
  }

  return (
    <>
      <div>this is an onboarding page</div>
      {renderRegularOrMerchantButtons()}
      {renderBody()}

    </>
  );
};

export default OnboardingPage;

// TODO: PropTypes
OnboardingPage.propTypes = {
  history: PropTypes.shape(
    { replace: PropTypes.func },
  ).isRequired,
};
