/* eslint-disable jsx-a11y/label-has-associated-control */
import '../App.css';
import React, {
  useState,
// useEffect,
} from 'react';
import Navigation from '../Components/Navigation';
// import PropTypes from 'prop-types';

const filterRestaurant = (posts, query) => {
  if (!query) {
    return posts;
  }
  return posts.filter((post) => {
    const postName = post.name.toLowerCase();
    return postName.includes(query);
  });
};
const posts = [
  { id: '1', name: ' Pizza Restaurant' },
  { id: '2', name: ' Burger Restaurant' },
  { id: '3', name: ' Ice Cream Restaurant' },
  { id: '4', name: ' Sushi Restaurant' },
  { id: '5', name: ' Poke Restaurant' },
];
function SearchPage() {
  const { search } = window.location;
  const query = new URLSearchParams(search).get('s');
  const filteredRestaurant = filterRestaurant(posts, query);
  const [searchQuery, setSearchQuery] = useState(query || '');

  // search query to render restaurants that match search
  return (
    <>
      <Navigation />
      <div>This is the search page</div>

      <div>
        <SearchPage
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ul>
          {filteredRestaurant.map((post) => (
            <li key={post.key}>{post.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

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
SearchPage.propTypes = {

};

export default SearchPage;
