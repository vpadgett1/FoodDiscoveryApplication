import '../App.css';
import React, {
  useState,
  useEffect, useRef,
} from 'react';
import {
  GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow,
} from 'react-google-maps';
import PropTypes from 'prop-types';

import Navigation from '../Components/Navigation';

// import PropTypes from 'prop-types';

// this line will become const MapPage = (props) => { once there are props

const MapPage = () => {
  // set state
  // const [state, setState] = useState(value);
  const [restaurantNames, setRestaurantNames] = useState(null);
  const [restaurantImages, setRestaurantImages] = useState(null);
  const [restaurantRatings, setRestaurantRatings] = useState(null);
  const [restaurantCoords, setRestaurantCoords] = useState(null);

  const textInput = useRef(null);

  function onSubmit(event) {
    event.preventDefault();
    const zipcode = textInput.current.value;
    console.log(JSON.stringify({ zipcode }));
    fetch('/map', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ zipcode }),
    }).then((response) => response.json()).then((data) => {
      console.log(data);
      console.log(data.data.names);
      setRestaurantNames(data.data.names);
      setRestaurantRatings(data.data.ratings);
      setRestaurantImages(data.data.img_urls);
      setRestaurantCoords(data.data.coords);
    });
  }
  // deconstruct props
  // const [props] = props;

  // TODO: fetch data from backend
  useEffect(() => {

  }, []);

  // TODO: Render component

  return (
    <>
      <Navigation />
      <h1>Map</h1>
      <div className="form">
        <form>
          Zipcode:
          <input type="text" ref={textInput} name="zipcode" />
          <input type="submit" value="Search" onClick={onSubmit} />
        </form>
      </div>
      <div style={{ width: '100vw', height: '100vh' }}>
        <WrappedMap
          googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          restaurantNames={restaurantNames}
          restaurantImages={restaurantImages}
          restaurantRatings={restaurantRatings}
          restaurantCoords={restaurantCoords}
        />
      </div>
    </>
  );
};

function Map(props) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState(null);
  const [selectedRestaurantImage, setSelectedRestaurantImage] = useState(null);
  const [selectedRestaurantRating, setSelectedRestaurantRating] = useState(null);
  const {
    restaurantCoords, restaurantNames, restaurantImages, restaurantRatings,
  } = props;
  if (!restaurantCoords) {
    return (<><h1>Enter zip</h1></>);
  }
  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 33.748997, lng: -84.387985 }}
    >
      {console.log(restaurantCoords)}
      { restaurantCoords.map((coordinates, index) => (
        <Marker
          key={index}
          position={{
            lat: coordinates.latitude,
            lng: coordinates.longitude,
          }}
          onClick={() => {
            setSelectedRestaurant(coordinates);
            setSelectedRestaurantName(restaurantNames[index]);
            setSelectedRestaurantImage(restaurantImages[index]);
            setSelectedRestaurantRating(restaurantRatings[index]);
            console.log(restaurantNames[index]);
          }}
        />
      ))}

      {selectedRestaurant && (
        <InfoWindow
          position={{
            lat: selectedRestaurant.latitude,
            lng: selectedRestaurant.longitude,
          }}
          onCloseClick={() => {
            setSelectedRestaurant(null);
            setSelectedRestaurantName(null);
            setSelectedRestaurantImage(null);
            setSelectedRestaurantRating(null);
          }}
        >
          <div>
            <h2>{selectedRestaurantName}</h2>
            <img alt="restaurantimage" src={selectedRestaurantImage} />
            <p>
              Rating:
              {selectedRestaurantRating}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
const WrappedMap = withScriptjs(withGoogleMap(Map));

// TODO: PropTypes
Map.propTypes = {
  restaurantCoords: PropTypes.string.isRequired,
  restaurantNames: PropTypes.string.isRequired,
  restaurantImages: PropTypes.string.isRequired,
  restaurantRatings: PropTypes.string.isRequired,
};



export default MapPage;
