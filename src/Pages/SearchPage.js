import '../App.css';
import '../styling/SearchPage.css';
import React, {
  useState,
  useEffect, useRef,
} from 'react';
import Navigation from '../Components/Navigation';
import SearchIcon from '../assets/SearchImg.png';

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
  function renderResults() {
    if (!restaurants) {
      return (
        <div className="noSearch">
          <img src={SearchIcon} alt="magnifying glass" />
          <div>
            Search for type of food or a specific restaurant
          </div>
        </div>
      );
    }

    if (restaurants.length === 0) {
      return (
        <div className="noSearch">
          <img src={SearchIcon} alt="magnifying glass" />
          <div>No Results Found</div>
        </div>
      );
    }

    return (
      <>
        {restaurants && restaurants.map((values) => (
          <div className="searchPageResult">
            <img src={values.image} alt="restaurant" />
            <a
              href="/restaurantprofile"
              onClick={() => {
                setID(values.ids);
              }}
            >
              {values.name}
            </a>
          </div>
        ))}
        ;
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="form">
        <form className="searchForm">
          <input type="text" ref={textInput} name="search" className="textInputSearch" placeholder="Search for a food or restaurant" />
          <div className="searchBtnDiv"><input type="submit" value="" onClick={onSearch} className="submitButtonSearch" /></div>
        </form>
      </div>
      {renderResults()}
    </>
  );
};

// TODO: PropTypes
SearchPage.propTypes = {
};

export default SearchPage;
