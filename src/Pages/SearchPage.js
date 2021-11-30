import '../App.css';
import React, {
   useState,
  useEffect,
} from 'react';
import Navigation from '../Components/Navigation';
// import PropTypes from 'prop-types';

const SearchPage = () => {
  // set state
  const [input, setInput] = useState('');
  
  const fetchData = async () => {
    return await fetch('')
    .then(response => response.json())
    .then(data => {

    });
    
  }

  const updateInput = async (input) => {
    //want to filter
    //const filtered = 
    //return 
  }

  // deconstruct props
  // const [props] = props;

  // TODO: fetch data from backend
  useEffect(() => {fetchData()

  }, []);

  // TODO: Render component
  return (
    <>
      <Navigation />
      <div>This is the search page</div>
      <div>
        <SearchBar
        input={input}
        onChange = {updateInput} />
      </div>
    </>
  );
};

// TODO: PropTypes
SearchPage.propTypes = {

};

export default SearchPage;
