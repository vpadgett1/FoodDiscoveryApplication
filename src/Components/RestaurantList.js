/* eslint-disable no-unused-vars */
import React from 'react';

// eslint-disable-next-line react/prop-types
const RestaurantList = ({ restaurantList = [] }) => (
  <>
    { restaurantList.map((data, index) => {
      if (data) {
        return (
          <div key={data.name}>
            <h1>
              {' '}
              {data.name}
            </h1>
          </div>
        );
      }
      return null;
    })}
  </>
);
export default RestaurantList;
