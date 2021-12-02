import '../App.css';
import '../styling/OnboardingPage.css';
import React, {
  useState,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import SingleOptionPopUp from '../Components/SingleOptionPopUp';

// YELP ID TO USE FOR TESTING: WavvLdfdP6g8aZTtbBQHTw
const OnboardingPage = () => {
  // set state
  const [selectedButton, setSelectedButton] = useState('none');
  const [showMessage, setShowMessage] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const navigate = useNavigate();
  // deconstruct props

  // TODO: fetch data from backend
  useEffect(() => {
    // TODO: Render component
  }, []);

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
        // go to next page
        if (result.status && result.status === 200) {
          if (result.newAccountCreated) {
            navigate('/discover');
          } else { // show alert
            setAlertMessage(result.message);
            setShowMessage(true);
          }
        }
      })
      .catch((response) => console.log(response));
  };

  function renderRegularUserQuestions() {
    return (
      <>
        <div>Please enter your zip code</div>
        <input type="text" placeholder="Zip Code" id="zipCodeInput" maxLength={20} />
        <div>Please enter a username</div>
        <input type="text" placeholder="Username" id="regularUserName" maxLength={100} />
        <br />
        <button type="button" onClick={createRegularUserAccount} className="continueButton">Continue</button>
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
        if (result.status && result.status === 200) {
          if (result.newAccountCreated) {
            navigate('/merchant');
          } else { // show alert
            setAlertMessage(result.message);
            setShowMessage(true);
          }
        }
      })
      .catch((response) => console.log(response));
  };

  function renderMerchantUserQuestions() {
    return (
      <>
        <div>Please enter your zip code</div>
        <input type="text" placeholder="Zip Code" id="zipCodeInput" maxLength={20} />
        <div>Please enter your yelp restaurant id</div>
        <input type="text" placeholder="Yelp Restaurant ID" id="yelpRestaurantID" maxLength={100} />
        <div>Please enter a username</div>
        <input type="text" placeholder="Username" id="merchantUserName" maxLength={100} />
        <br />
        <button type="button" onClick={createMerchantUserAccount} className="continueButton">Continue</button>
      </>
    );
  }

  function onUserChoice(choice) {
    setSelectedButton(choice);
  }

  function renderRegularOrMerchantButtons() {
    return (
      <div className="userTypeButtons">
        <button type="button" onClick={() => onUserChoice('Regular')} className={selectedButton === 'Regular' ? 'selectedButton' : 'regularButton'}>Regular</button>
        <button type="button" onClick={() => onUserChoice('Merchant')} className={selectedButton === 'Merchant' ? 'selectedButton' : 'regularButton'}>Merchant</button>
      </div>
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

  const popUpAction = () => {
    setShowMessage(false);
  };

  function renderMessage() {
    if (showMessage) {
      return (
        <SingleOptionPopUp
          message={alertMessage}
          buttonAction={popUpAction}
          buttonActionText="OK"
        />
      );
    }
    return (<></>);
  }

  return (
    <div className="onboardingPage">
      {renderMessage()}
      {renderRegularOrMerchantButtons()}
      {renderBody()}
    </div>
  );
};

export default OnboardingPage;

// TODO: PropTypes
OnboardingPage.propTypes = {
  history: PropTypes.shape(
    { replace: PropTypes.func },
  ).isRequired,
};
