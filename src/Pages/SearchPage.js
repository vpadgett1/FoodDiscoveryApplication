import '../App.css';
import React, {
  // useState,
  useEffect,
} from 'react';
import Navigation from '../Components/Navigation';
// import PropTypes from 'prop-types';

const SearchPage = () => {
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
      <div>
        <SearchBar/>
      </div>
    </>
  );
};

// TODO: PropTypes
SearchPage.propTypes = {

};

export default SearchPage;
