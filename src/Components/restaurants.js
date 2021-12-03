/* eslint-disable no-unused-vars */
import React from 'react';

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
