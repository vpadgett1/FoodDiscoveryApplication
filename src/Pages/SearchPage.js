import '../App.css';
import React, {
// useState,
// useEffect,
} from 'react';
import Navigation from '../Components/Navigation';
// import PropTypes from 'prop-types';

function searchBar() {
  <form action="/" method="get">
    <title>Search</title>
    <label htmlFor="header-search">
      <span className="visually-hidden"> Search restaurants</span>
    </label>
    <input id="searchbar" onKeyUp="searching()" type="text" name="search" placeholder="search restaurants..." />
    <button type="submit">Search</button>
  </form>;
}

const posts = [
  { id: '1', name: ' Pizza Restaurant' },
  { id: '2', name: ' Burger Restaurant' },
  { id: '3', name: ' Ice Cream Restaurant' },
  { id: '4', name: ' Sushi Restaurant' },
  { id: '5', name: ' Poke Restaurant' },
];
function searchPage() {
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
      <div>This is the search page</div>
    </>

  );
}

// TODO: PropTypes
SearchPage.propTypes = {

};

export default SearchPage;
