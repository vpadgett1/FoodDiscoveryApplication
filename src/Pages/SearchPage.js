import '../App.css';
import '../styling/SearchPage.css';
import React, {
  useState,
<<<<<<< HEAD
  useEffect,
=======
  useEffect, useRef,
>>>>>>> b901d37a20a7c4e18606e840ec9874ccec3741c6
} from 'react';
// import PropTypes from 'prop-types';
<<<<<<< HEAD
import SearchBar from '../Components/SearchBar';
import RestaurantList from '../Components/RestaurantList';
=======
import Navigation from '../Components/Navigation';
>>>>>>> b901d37a20a7c4e18606e840ec9874ccec3741c6

const SearchPage = () => {
  const textInput = useRef(null);
  const [restaurants, setRestaurants] = useState(null);
  // set state
  const [input, setInput] = useState('');
  const [RestaurantListDefault, setRestaurantListDefault] = useState();
  const [RestaurantListState, setRestaurantList] = useState();

  const fetchData = async () => {
    await fetch('')
      .then((response) => response.json())
      .then((data) => {
        setRestaurantList(data);
        setRestaurantListDefault(data);
      });
  };

  const updateInput = async (x) => {
    const filtered = RestaurantListDefault
      .filter((restaurant) => restaurant.name.toLowerCase().includes(x.toLowerCase()));
    setInput(x);
    setRestaurantList(filtered);
    // want to filter through for restaurant name
    // const filtered =
    // return
  };

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
    fetchData();
  }, []);

  // TODO: Render component

  return (
    <>
      <Navigation />
<<<<<<< HEAD
      <div>This is the search page</div>
      <div>
        <SearchBar
          input={input}
          onChange={updateInput}
        />
        <RestaurantList restaurantList={RestaurantListState} />
=======
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
>>>>>>> b901d37a20a7c4e18606e840ec9874ccec3741c6
      </div>
    </>
  );
};
<<<<<<< HEAD
=======

// TODO: PropTypes
SearchPage.propTypes = {
};

>>>>>>> b901d37a20a7c4e18606e840ec9874ccec3741c6
export default SearchPage;
