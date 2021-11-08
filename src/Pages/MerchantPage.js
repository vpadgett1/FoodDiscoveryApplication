import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';

// this line will become const MerchantPage = (props) => { once there are props
const MerchantPage = () => {
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
      <div>Merchant Page</div>
      <div>This is the merchant page</div>
    </>
  );
};

// TODO: PropTypes
MerchantPage.propTypes = {

};

export default MerchantPage;
