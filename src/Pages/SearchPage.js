import '../App.css';
import React, {
  useState,
  useEffect, useRef,
} from 'react';
// import PropTypes from 'prop-types';
import Navigation from '../Components/Navigation';

const SearchPage = () => {
  const textInput = useRef(null);
  const [restaurants, setRestaurants] = useState(null);
  // set state
  // const [state, setState] = useState(value);

  // deconstruct props
  // const [props] = props;

  // TODO: fetch data from backend
  function onSearch(event) {
    event.preventDefault();
    const searchInput = textInput.current.value;
    console.log(JSON.stringify({ searchInput }));
    fetch('/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchInput }),
    }).then((response) => response.json()).then((data) => {
      console.log(data);
      setRestaurants(data);
    });
  }

  function setID(id) {
    sessionStorage.setItem('restaurantID', id);
  }
  useEffect(() => {

  }, []);

  // TODO: Render component

  return (
    <>
      <Navigation />
      <div className="form">
        <form>
          Search:
          <input type="text" ref={textInput} name="search" />
          <input type="submit" value="Search" onClick={onSearch} />
        </form>
        {restaurants ? restaurants.map((values, index) => (
          <ul style={{ listStyle: 'none' }}>
            <li key={index}>
              <a
                href="/restaurantprofile"
                onClick={() => {
                  setID(values.ids);
                }}
              >
                <h2>{values.name}</h2>
              </a>
              {/* <button
                type="button"
                onClick={() => {
                  setRestaurantID(values.ids);
                  console.log(restaurantID);
                }}
              >
                {values.name}
              </button> */}
            </li>
          </ul>
        )) : <p>Search for type of food or a specific restaurant</p>}
      </div>
    </>
  );
};

// TODO: PropTypes
SearchPage.propTypes = {
};

export default SearchPage;
