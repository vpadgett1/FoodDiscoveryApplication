import '../App.css';
import React, {
  useState,
  useEffect, useRef,
} from 'react';
import {
  GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow,
} from 'react-google-maps';
// import { Link } from 'react-router-dom';
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
  const [restaurantAddress, setRestaurantAddress] = useState(null);
  const [restaurantOpening, setRestaurantOpening] = useState(null);
  const [restaurantClosing, setRestaurantClosing] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
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
      console.log(data.data.ids);
      setRestaurantNames(data.data.names);
      setRestaurantRatings(data.data.ratings);
      setRestaurantImages(data.data.img_urls);
      setRestaurantCoords(data.data.coords);
      setRestaurantAddress(data.data.address);
      setRestaurantOpening(data.data.opening);
      setRestaurantClosing(data.data.closing);
      setRestaurantId(data.data.ids);
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
      <div style={{ position: 'absolute', width: '100vw', height: '100vh' }}>
        <h1>Map</h1>
        <div className="form">
          <form>
            Zipcode:
            <input type="text" ref={textInput} name="zipcode" />
            <input type="submit" value="Search" onClick={onSubmit} />
          </form>
        </div>
        <div style={{
          width: '100vw', height: '100vh', position: 'absolute',
        }}
        >
          <WrappedMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
            loadingElement={<div style={{ height: '100%', width: '100%', left: '20%' }} />}
            containerElement={<div style={{ height: '100%', width: '100%', left: '20%' }} />}
            mapElement={<div style={{ height: '100%', width: '80%', left: '20%' }} />}
            restaurantNames={restaurantNames}
            restaurantImages={restaurantImages}
            restaurantRatings={restaurantRatings}
            restaurantCoords={restaurantCoords}
            restaurantOpening={restaurantOpening}
            restaurantClosing={restaurantClosing}
            restaurantAddress={restaurantAddress}
            restaurantId={restaurantId}
          />
        </div>
      </div>
    </>
  );
};

function Map(props) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState(null);
  const [selectedRestaurantImage, setSelectedRestaurantImage] = useState(null);
  const [selectedRestaurantRating, setSelectedRestaurantRating] = useState(null);
  const [selectedRestaurantAddress, setSelectedRestaurantAddress] = useState(null);
  const [selectedRestaurantOpening, setSelectedRestaurantOpening] = useState(null);
  const [selectedRestaurantClosing, setSelectedRestaurantClosing] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const {
    restaurantCoords, restaurantNames, restaurantImages, restaurantRatings, restaurantAddress,
    restaurantOpening, restaurantClosing, restaurantId,
  } = props;
  if (!restaurantCoords) {
    return (<><h1>Enter zip</h1></>);
  }
  return (
    <>
      <div className="searchResults">
        <ul style={{
          listStyle: 'none', position: 'absolute', top: '20%', marginRight: '200px',
        }}
        >
          {restaurantNames.map((names, index) => (

            <li>
              <button
                type="button"
                key={index}
                onClick={() => {
                  setSelectedRestaurantName(names);
                  setSelectedRestaurant(restaurantCoords[index]);
                  setSelectedRestaurantImage(restaurantImages[index]);
                  setSelectedRestaurantRating(restaurantRatings[index]);
                  setSelectedRestaurantAddress(restaurantAddress[index].display_address);
                  setSelectedRestaurantOpening(restaurantOpening[index]);
                  setSelectedRestaurantClosing(restaurantClosing[index]);
                  setSelectedRestaurantId(restaurantId[index]);
                }}
              >
                {names}
              </button>
            </li>
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
              setSelectedRestaurantAddress(null);
              setSelectedRestaurantClosing(null);
              setSelectedRestaurantOpening(null);
              setSelectedRestaurantId(null);
            }}
          >
            {/* {console.log(selectedRestaurantId)} */}
            <div>
              <a href="/restaurantprofile" dataID={{ restaurantID: selectedRestaurantId }}><h2>{selectedRestaurantName}</h2></a>
              <img style={{ width: '80%', height: '60%' }} alt="restaurantimage" src={selectedRestaurantImage} />
              <p>
                Rating:
                {selectedRestaurantRating}
              </p>
              <p>
                Address:
                {selectedRestaurantAddress}
              </p>
              <p>
                Hours:
                {selectedRestaurantOpening}
                -
                {selectedRestaurantClosing}
              </p>
              <p>
                id:
                {selectedRestaurantId}
              </p>
            </div>
          </InfoWindow>
          )}
        </ul>
      </div>
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 33.748997, lng: -84.387985 }}
      >
        {/* {console.log(restaurantAddress)} */}
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
              setSelectedRestaurantAddress(restaurantAddress[index].display_address);
              setSelectedRestaurantOpening(restaurantOpening[index]);
              setSelectedRestaurantClosing(restaurantClosing[index]);
              setSelectedRestaurantId(restaurantId[index]);
              // console.log(restaurantAddress);
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
              setSelectedRestaurantAddress(null);
              setSelectedRestaurantClosing(null);
              setSelectedRestaurantOpening(null);
              setSelectedRestaurantId(null);
            }}
          >
            {/* {console.log(selectedRestaurantId)}   */}
            <div>
              <a href="/restaurantprofile" dataID={{ restaurantID: selectedRestaurantId }}><h2>{selectedRestaurantName}</h2></a>
              <img style={{ width: '80%', height: '60%' }} alt="restaurantimage" src={selectedRestaurantImage} />
              <p>
                Rating:
                {selectedRestaurantRating}
              </p>
              <p>
                Address:
                {selectedRestaurantAddress}
              </p>
              <p>
                Hours:
                {selectedRestaurantOpening}
                -
                {selectedRestaurantClosing}
              </p>
              <p>
                id:
                {selectedRestaurantId}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
}
const WrappedMap = withScriptjs(withGoogleMap(Map));

// TODO: PropTypes
Map.propTypes = {
  restaurantCoords: PropTypes.string.isRequired,
  restaurantNames: PropTypes.string.isRequired,
  restaurantImages: PropTypes.string.isRequired,
  restaurantRatings: PropTypes.string.isRequired,
  restaurantOpening: PropTypes.string.isRequired,
  restaurantAddress: PropTypes.string.isRequired,
  restaurantClosing: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
};

export default MapPage;
