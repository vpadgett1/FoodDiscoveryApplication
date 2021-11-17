// import '../App.css';
import React, {
// useState,
// useEffect,
} from 'react';
// import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';
// import Post from '../Components/Post';
// eslint-disable-next-line import/no-named-as-default
import Item from '../Components/Item';
import Toolbar from '../Components/Toolbar';

// import Toolbar from '../Components/Toolbar';
// this line will become const DiscoverPage = (props) => { once there are props
const DiscoverPage = () => {
  // set state
  // <Post />;
  // eslint-disable-next-line no-unused-vars

  const [items, setItems] = React.useState([{
    type: null,
    content: '',
    id: '',
  }]);

  // Add a new item to the page where receives type and adds to the state
  // eslint-disable-next-line no-unused-vars
  function addItem(type, content) {
    setItems((state) => [...state, { type, content, id: '' }]);
  }

  // It will always update the page to be the most recent state
  function updateItem(id, newContent) { // takes in id of item updating and the new content
    setItems((state) => {
      // gets correct item by using id to retrieve index
      const itemIndex = state.findIndex((item) => item.id === id);
      const newState = [...state]; // uses array spread to create old state in an immutable way
      newState[itemIndex].content = newContent; // updates the content of entry by using index
      return newState;// return new array
    });
  }
  // when you press enter a new post is created
  // const onKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     addItem(null, '');
  //   }
  // };
  async function getRestaurantData() {
    await fetch('/getRestaurantData')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      }//.catch(error => console.log(error));

       useEffect(() => {
         getRestaurantInfo();

 }, []);
  }
}
  async function getPosts(){
    await fetch ('/createPosts')
      .then((response)=> response.json())
      .then((data)) => {
        console.log(data);

      }
      
  }
  return (
    <>
      <Navigation />
      <div>This is the discover page</div>
      <div className="app">
        <h1> My Discover Page </h1>
        <div className="post">
          {items.map((item) => (
            // eslint-disable-next-line react/jsx-no-undef
            // mapping over items array
            <Item
              key={item.AuthorID}
              type={item.type}
              content={item.content}
              updateItem={(newContent) => updateItem(item.id, newContent)}
              // onKeyPress={onKeyPress}

            />
          ))}

          <Toolbar />

        </div>
      </div>
    </>

  );
};

// <Toolbar addItem={addItem} />
// deconstruct props
// const [props] = props;

// TODO: fetch data from backend
// useEffect(() => {

// }, []);

// TODO: Render component

// TODO: PropTypes
DiscoverPage.propTypes = {

};

export default DiscoverPage;
