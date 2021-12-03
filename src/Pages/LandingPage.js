import '../App.css';
import '../styling/LandingPage.css';
import React, {
} from 'react';
import LandingPage1 from '../assets/landingpage1.png';
import LandingPage2 from '../assets/GuyAndGirlEating.png';
import f1 from '../assets/f1.png';
import f2 from '../assets/f2.png';
import f3 from '../assets/f3.png';
import f4 from '../assets/f4.png';
import f5 from '../assets/f5.png';

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
    <div className="landingPageInfo">
      <div className="landingPageSection">
        <img className="whyItMattersImg" src={LandingPage1} alt="why it matters" />
        <div className="whyItMatters">
          <div className="whyItMattersTitle">Why it Matters</div>
          <div className="whyItMattersBody">
            Have you ever been recommended to a restaurant by
            a friend or parent and as soon as you needed a place
            to eat you couldn’t remember the restaurant name? Or
            you are in a new part of town and are looking for a
            place to eat but you don’t know anywhere that may be
            good. This is where FoodMe comes in. We’re here to
            allow you to check out your friends and families
            recommendations for local places to eat without the
            worry of forgetting the name or having nowhere to eat.
            Plus, you get the added bonus of seeing if your friends
            post a picture of the food or give a dish recommendation
            as well if you have no clue on what to eat.
          </div>
        </div>
      </div>
      <div className="motivationSection">
        <div className="motivationSectionInner">
          <img src={LandingPage2} alt="motivation section" />
          <div className="motivationBody">
            <div>Motivation</div>
            The question is: how is FoodMe different from any other food
            application to search for restaurants. We bring in the
            social aspect! You can add your friends and see what they’ve
            been eating and the dishes they recommend. Looking for
            recommendations from your favorite people, then this is why
            you need to use FoodMe!

            As food accounts on instagram, facebook, twitter, etc are
            increasing we thought, why not create an app as a circle for
            foodies. This application is gathering all the foodies and
            those interested to become one!
          </div>
        </div>
      </div>
      <div className="functionalitySection">
        <div className="functionalityTitle">Functionality</div>
        <div className="functionalityCard">
          <div>
            Create posts leaving recommendations for the latest restaurants
            you’ve visited and enjoyed.
            Follow your friends to see their recommendations on the latest
            places to check out.
            Get updates from your favorite restaurants about their latest
            specials and promotions.
          </div>
          <img src={f1} alt="functionality" />
        </div>
        <div className="functionalityCard">
          <div>
            Like and Comment on your friends and favorite restaurants posts
            to find out more information or tell them that you enjoyed their
            recommendation.
          </div>
          <img src={f2} alt="functionality" />
        </div>
        <div className="functionalityCard">
          <div>
            Search for restaurants in your area by name to find the location
            and hours of service, as well as ratings and images.
          </div>
          <img src={f3} alt="functionality" />
        </div>
        <div className="functionalityCard">
          <div>
            Search a zip code on our map to see the most popular restaurants
            in that area as well as their location.
          </div>
          <img src={f4} alt="functionality" />
        </div>
        <div className="functionalityCard">
          <div>
            Restaurants can create an account to interact with their consumers
            by creating posts detailing promotions or specials or even just to
            showcase their latest dishes.
            Restaurants can also interact on consumers
            {'\' '}
            posts to let consumers know they
            loved their review or ask questions on how to improve.
          </div>
          <img src={f5} alt="functionality" />
        </div>
      </div>
      <div className="whoWeAre">
        <div className="whoWeAreTitle">Made By</div>
        <div className="whoWeAreBody">
          We are FoodMe, a company that wants to provide you with a platform
          for receiving food recommendations from your friends. The idea
          stemmed from our lack of knowledge about the different places around
          our college campus that were either well recommended by our peers
          or avoided at all costs. We wanted to be able to get recommendations
          restaurants from our friends in a quick and easy to view format and
          decided to bring our wish to life for everyone to be able to use and
          share. Our team continues to work hard to bring you your friends
          recommendations for restaurants that you can look back on days later
          so you aren’t googling and hoping you remember the name they told you.
        </div>
        <div className="creatorLinks">
          <div className="creator">
            <div className="emoji">🍗</div>
            <div className="name">John Arthur</div>
            <div><a className="creatorLink" href="https://github.com/bladezr">Github Link</a></div>
            <div><a className="creatorLink" href="https://www.linkedin.com/in/john-arthur-400926192/">LinkedIn Link</a></div>
          </div>
          <div className="creator">
            <div className="emoji">🍕</div>
            <div className="name">Adhil Habib</div>
            <div><a className="creatorLink" href="https://github.com/AdhilHabib">Github Link</a></div>
            <div><a className="creatorLink" href="https://www.linkedin.com/in/adhilhabib">LinkedIn Link</a></div>
          </div>
          <div className="creator">
            <div className="emoji">🥪</div>
            <div className="name">Bilqis Seddiqi</div>
            <div><a className="creatorLink" href="https://github.com/bseddiqi">Github Link</a></div>
            <div><a className="creatorLink" href="https://www.linkedin.com/in/bilqis-seddiqi/">LinkedIn Link</a></div>
          </div>
          <div className="creator">
            <div className="emoji">☕️</div>
            <div className="name">Tori Padgett</div>
            <div><a className="creatorLink" href="https://github.com/vpadgett1">Github Link</a></div>
            <div><a className="creatorLink" href="https://www.linkedin.com/in/victoria-padgett-2021/">LinkedIn Link</a></div>
          </div>
          <div className="creator">
            <div className="emoji">🍯</div>
            <div className="name">Raneem Soufi</div>
            <div><a className="creatorLink" href="https://github.com/rsoufi1">Github Link</a></div>
            <div><a className="creatorLink" href="https://www.linkedin.com/in/raneemsoufi/">LinkedIn Link</a></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default LandingPage;
