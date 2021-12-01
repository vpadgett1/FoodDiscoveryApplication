import '../App.css';
import '../styling/SearchPage.css';
import React, {
  useState,
  useEffect,
} from 'react';
import Navigation from '../Components/Navigation';
// import PropTypes from 'prop-types';
import SearchBar from '../Components/SearchBar';
import RestaurantList from '../Components/RestaurantList';

const SearchPage = () => {
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
