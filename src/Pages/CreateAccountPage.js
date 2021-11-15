import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

// this line will become const CreateAccountPage = (props) => { once there are props
const CreateAccountPage = () => {
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
      <Link to="/onboarding">Create Account</Link>
      <div>This is the create account page</div>
    </>
  );
};

// TODO: PropTypes
CreateAccountPage.propTypes = {

};

export default CreateAccountPage;
