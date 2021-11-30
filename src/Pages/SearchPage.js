/* eslint-disable no-unused-vars */
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

const SearchPage = (props) => {
  // set state
  const [input, setInput] = useState('');
  const [RestaurantListDefault, setRestaurantListDefault] = useState();
  const [RestaurantList, setRestaurantList] = useState();

  const fetchData = async () => {
    return await fetch('')
    .then((response) => response.json())
    .then((data) => {
      setRestaurantList(data);
      setRestaurantListDefault(data);
    });

  const updateInput = async (input) => {
    const filtered = restaurantListDefault.filter((restaurant) => restaurant.name.toLowerCase().includes(input.toLowerCase()));
    setInput(input);
    setRestaurantList(filtered);
    // want to filter through for restaurant name
    // const filtered =
    // return
  };

  async function getRestaurants(){
    await fetch ('/searchRestaurant')
    .then((response)=> response.json())
    .then((result) => {
      setRestaurantData(result.RestaurantList);
      }).catch((error) => console.log(error));
  }

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
        <RestaurantList restaurantList={restaurantList} />
      </div>
    </>
  );

  // // TODO: PropTypes
  // SearchPage.propTypes = {

  // };
};
export default SearchPage;
