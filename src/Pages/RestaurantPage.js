import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
import Navigation from '../Components/Navigation';
// import PropTypes from 'prop-types';

// this line will become const RestaurantPage = (props) => { once there are props
const RestaurantPage = () => {
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
      <div>this is a restaurant profile</div>
    </>
  );
};

// TODO: PropTypes
RestaurantPage.propTypes = {

};

export default RestaurantPage;
