import '../App.css';
import '../styling/SearchPage.css';
import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
// import PropTypes from 'prop-types';
import SearchBar from '../Components/SearchBar';
import RestaurantList from '../Components/RestaurantList';
import Navigation from '../Components/Navigation';

const SearchPage = () => {
  const textInput = useRef(null);
  // eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
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

  // eslint-disable-next-line no-unused-vars
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
      <div>This is the search page</div>
      <div>
        <SearchBar
          input={input}
          onChange={updateInput}
        />
        <RestaurantList restaurantList={RestaurantListState} />
      </div>
    </>
  );
};
export default SearchPage;
