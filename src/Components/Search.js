/* eslint-disable jsx-a11y/label-has-associated-control */
import '../App.css';
import React, {
// useState,
// useEffect,
} from 'react';
// import Navigation from './Navigation';
// import PropTypes from 'prop-types';
function Search() {
  // search query to render restaurants that match search

  // eslint-disable-next-line no-unused-vars
  const searchBar = ({ searchQuery, setSearchQuery }) => {
    <form action="/" method="get">
      <title>Search</title>
      <label htmlFor="header-search">
        <span className="visually-hidden">Search restaurants</span>
      </label>
      <input
        value={searchQuery}
        onInput={(e) => setSearchQuery(e.target.value)}
        type="text"
        id="header-search"
        name="search"
        placeholder="search restaurants..."
      />
      <button type="submit">Search</button>
    </form>;
  };

  // set state
  // const [state, setState] = useState(value);

  // deconstruct props
  // const [props] = props;

  // TODO: fetch data from backend
  // useEffect(() => {

  // }, []);

  // TODO: Render component
  // return (

  // );

// TODO: PropTypes
// SearchPage.propTypes = {
}
export default Search;
