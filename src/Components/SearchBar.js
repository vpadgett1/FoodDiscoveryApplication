/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

const SearchBar = ({ keyword, setKeyword }) => {
  const BarStyling = {
    width: '20rem', background: '#F2f1f9', border: 'none', padding: '0.5rem',
  };
  return (
    <input
      type="text"
      style={BarStyling}
      key="random1"
      value={keyword}
      placeholder="search"
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
};
export default SearchBar;
