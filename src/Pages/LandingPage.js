import '../App.css';
import React, {
// useState,
// useEffect,
} from 'react';
// import PropTypes from 'prop-types';

// this line will become const LandingPage = (props) => { once there are props
const LandingPage = () =>
//   const login = async () => {
//     await fetch('/login')
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         // const uri = result.url;
//         // if (uri !== '') {
//         //   window.location.assign(uri);
//         // }
//       })
//       .catch((response) => console.log(response));
//   };

  // eslint-disable-next-line implicit-arrow-linebreak
  (
    <>
      <form method="POST" action="/login">
        <input type="submit" name="Login" id="Login" />
      </form>
      <div>Landing Page</div>
    </>
  );
export default LandingPage;
