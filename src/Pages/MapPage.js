import '../App.css';
import '../styling/MapPage.css';
import React, {
  useState, useRef,
} from 'react';
import {
  GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow,
} from 'react-google-maps';
import PropTypes from 'prop-types';

import Navigation from '../Components/Navigation';

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

  return (
    <>
      <Navigation />
      <div className="MapPage">
        <div className="SearchRestaurantsForm">
          <form>
            <div className="searchZipCode">
              <input type="text" ref={textInput} name="zipcode" placeholder="zipcode" />
              <input type="submit" onClick={onSubmit} value="" />
            </div>
          </form>
        </div>
        <div style={{
          width: '100vw', height: 'calc(100% - 50px)', position: 'absolute',
        }}
        >
          <WrappedMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
            loadingElement={<div style={{ height: 'calc(100% - 50px)', width: '100%', left: '30%' }} />}
            containerElement={(
              <div style={{
                height: '100%', width: '100%', left: '30%', top: '-50px',
              }}
              />
)}
            mapElement={(
              <div style={{
                height: 'calc(100% + 50px)', width: '70%', left: '30%', top: '-50px',
              }}
              />
)}
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

  function setID(id) {
    sessionStorage.setItem('restaurantID', id);
  }
  function clearID() {
    sessionStorage.clear();
  }
  if (!restaurantCoords) {
    return (
      <div className="searchResults">
        <ul>
          <li>Enter your zip code to begin</li>
        </ul>
      </div>
    );
  }
  return (
    <div className="MapPageResults">
      <div className="searchResults">
        <ul style={{
          listStyle: 'none',
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
              clearID();
            }}
          >
            <div>
              <a href="/restaurantprofile" onClick={setID(selectedRestaurantId)}><h2>{selectedRestaurantName}</h2></a>
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
            </div>
          </InfoWindow>
          )}
        </ul>
      </div>
      <div className="GoogleMap">
        <GoogleMap
          defaultZoom={10}
          defaultCenter={{ lat: 33.748997, lng: -84.387985 }}
        >
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
              clearID();
            }}
          >
            <div>
              <a href="/restaurantprofile" id="sendrestID" restaurantID={selectedRestaurantId}><h2>{selectedRestaurantName}</h2></a>
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
            </div>
          </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
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
