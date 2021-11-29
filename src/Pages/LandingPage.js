import '../App.css';
import '../styling/LandingPage.css';
import React, {
} from 'react';
import LandingPageImg from '../assets/GuyAndGirlEating.png';

const LandingPage = () => (
  <div className="landingPage">
    <div className="landingPageBar">
      <div className="FoodMe">FoodMe</div>
      <div className="LoginButton">
        <form method="POST" action="/login">
          <input type="submit" name="Login" id="Login" value="Log In" />
        </form>
      </div>
    </div>
    <div className="landingPageBody">
      <div className="leftSide">
        <div>Discover delicious food near you</div>
      </div>
      <div className="rightSide">
        <img src={LandingPageImg} alt="guy and girl eating food" />
      </div>
    </div>
  </div>
);
export default LandingPage;
