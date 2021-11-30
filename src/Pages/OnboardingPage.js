import '../App.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// YELP ID TO USE FOR TESTING: WavvLdfdP6g8aZTtbBQHTw
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
    const zipcode = document.getElementById('zipCodeInput').value;
    const username = document.getElementById('regularUserName').value;

    // send to database, wait until db responds before continueing
    await fetch(`/createAccount?zipcode=${zipcode}&username=${username}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        // go to next page
        if (result.status === 'success') {
          navigate('/discover');
        }
      })
      .catch((response) => console.log(response));
  };

  function renderRegularUserQuestions() {
    return (
      <>
        <div>Please enter your zip code</div>
        <input type="text" placeholder="Zip Code" id="zipCodeInput" />
        <div>Please enter a username</div>
        <input type="text" placeholder="Username" id="regularUserName" />
        <button type="button" onClick={createRegularUserAccount}>Continue</button>
      </>
    );
  }

  const createMerchantUserAccount = async () => {
    // get input
    const yelpID = document.getElementById('yelpRestaurantID').value;
    const zipcode = document.getElementById('zipCodeInput').value;
    const username = document.getElementById('merchantUserName').value;

    // send to database, wait until db responds before continueing
    await fetch(`/createAccount?zipcode=${zipcode}&yelpID=${yelpID}&username=${username}`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        // go to next page
        if (result.status === 'success') {
          navigate('/merchant');
        }
      })
      .catch((response) => console.log(response));
  };

  function renderMerchantUserQuestions() {
    return (
      <>
        <div>Please enter your zip code</div>
        <input type="text" placeholder="Zip Code" id="zipCodeInput" />
        <div>Please enter your yelp restaurant id</div>
        <input type="text" placeholder="Zip Code" id="yelpRestaurantID" />
        <div>Please enter a username</div>
        <input type="text" placeholder="Username" id="merchantUserName" />
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
