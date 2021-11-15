import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
// import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';

// this line will become const DiscoverPage = (props) => { once there are props
const DiscoverPage = () => {
  <Post/>;
  // set state
  const [items, setItems] = React.useState([{
    type: null,
    content: '',
    id: '',
  }]);
  
  const addItem = (type, content) => {
    setItems((state) => [...state, { type, content, id: '' }]);
  };
  // It will always update the page to be the most recent state
  const updateItem = (id, newContent) => { // takes in id of item updating and the new content
    setItems((state) => {
      // gets correct item by using id to retrieve index
      const itemIndex = state.findIndex((item) => item.id === id);
      const newState = [...state]; // uses array spread to create old state in an immutable way
      newState[itemIndex].content = newContent; // updates the content of entry by using index
      return newState;// return new array
    });
  };
  
  // deconstruct props
  // const [props] = props;

  // // TODO: fetch data from backend
  // useEffect(() => {

  // }, []);

  // TODO: Render component

  return (
    <>
      <Navigation />
      <div>This is the discover page</div>
   
      <div className = "post">
      <h3> Username </h3>
      <div className = "postTitle">
        <h2>Post Title</h2>
      </div>
      <div className = "postText">
        <p>Some information about some restaurant that user
          has gone to and now talking about if friends should go
          or not or if it really sucks.</p>
          <div className = "postComment">
            <p>Some comment someone left about the post</p>
          </div>
      </div>
    </div>
    </>
  );
};

// TODO: PropTypes
DiscoverPage.propTypes = {

};

export default DiscoverPage;
