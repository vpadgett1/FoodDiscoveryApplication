import '../App.css';
import React, {
  useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';

// this line will become const DiscoverPage = (props) => { once there are props
const DiscoverPage = () => {
  // set state
  const [userID, setUserID] = useState([]);

  // deconstruct props
  // const [props] = props;

  // TODO: fetch data from backend
  async function getData() {
    await fetch('/getUserID')
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUserID(result.userID);
      }).catch((error) => console.log(error));
  }

  useEffect(() => {
    // get user data
    getData();
  }, []);

  // TODO: Render component
  const createNewPost = (event) => {
    event.preventDefault();
    // get data from forms
    const title = document.getElementById('inputTitle').value;
    const body = document.getElementById('inputBody').value;
    const restName = document.getElementById('restaurantName').value;

    fetch(`/createPost?AuthorID=${userID}&RestaurantName=${restName}&postText=${body}&postTitle=${title}`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      }).catch((error) => console.log(error));
  };

  return (
    <>
      <Navigation />
      <div>This is the discover page</div>
      <form onSubmit={createNewPost}>
        <input type="text" id="inputTitle" placeholder="Enter Title" />
        <input type="text" id="inputBody" placeholder="Enter Body" />
        <input type="text" id="restaurantName" placeholder="Name of Restaurant" />
        <button type="submit">Publish</button>
      </form>
    </>
  );
};

// TODO: PropTypes
DiscoverPage.propTypes = {

};

export default DiscoverPage;
