import React from "react";
import './App.css';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import { useState, useRef} from 'react';


function App() {

  const[restaurantNames, setRestaurantNames] = useState(null);
  const[restaurantImages, setRestaurantImages] = useState(null);
  const[restaurantRatings, setRestaurantRatings] = useState(null);
  const[restaurantCoords, setRestaurantCoords] = useState(null);

  const textInput = useRef(null);

  function onSubmit(event){
    event.preventDefault();
    let zipcode = textInput.current.value;
    console.log(JSON.stringify({"zipcode": zipcode}))
    
    fetch('/zipcode', {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({"zipcode": zipcode}),
    }).then(response => response.json()).then(data =>
      {console.log(data) 
       console.log(data["data"]["names"])
      setRestaurantNames(data["data"]["names"])
      setRestaurantRatings(data["data"]["ratings"])
      setRestaurantImages(data["data"]["img_urls"])
      setRestaurantCoords(data["data"]["coords"])

  
       })
    

  }
  // fetches JSON data passed in by flask.render_template and loaded
  // in public/index.html in the script with id "data"
    return(
      <>
      <h1>My Google Maps</h1>
      <div class='form'>
      <form>
       <label>
      Zipcode:
      <input type="text" ref={textInput} name="zipcode" />
      </label>
      <input type="submit" value="Search" onClick={onSubmit}/>
      </form>
      </div>
  
      <div style={{width:'100vw', height:'100vh'}}>
      <WrappedMap 
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
        loadingElement={<div style={{height:"100%"}}/>}
        containerElement={<div style={{height:"100%"}}/>}
        mapElement={<div style={{height:"100%"}}/>}
        restaurantNames={restaurantNames}
        restaurantImages={restaurantImages}      
        restaurantRatings={restaurantRatings}      
        restaurantCoords={restaurantCoords}      
      
      
    />
    </div>
      
      </>            
             
    );
  // TODO: Implement your main page as a React component.
}

function Map(props){
    
    const[selectedRestaurant, setSelectedRestaurant] = useState(null);
    const[selectedRestaurantName, setSelectedRestaurantName] = useState(null);
    const[selectedRestaurantImage, setSelectedRestaurantImage] = useState(null);
    const[selectedRestaurantRating, setSelectedRestaurantRating] = useState(null);

  if(!props.restaurantCoords){
    return(<><h1>Enter zip</h1></>)
  }else{
    return(
      <GoogleMap 
          defaultZoom={10} 
          defaultCenter={{lat:33.748997, lng:-84.387985}}
      >
          
          {console.log(props.restaurantCoords)}
          { props.restaurantCoords.map((coordinates,index)=>(<Marker key={index} 
          position={{
              lat:coordinates["latitude"], 
              lng:coordinates["longitude"]
              }}
              onClick = {()=>{
        
                  setSelectedRestaurant(coordinates)
                  setSelectedRestaurantName(props.restaurantNames[index])
                  setSelectedRestaurantImage(props.restaurantImages[index])
                  setSelectedRestaurantRating(props.restaurantRatings[index])
                  console.log(props.restaurantNames[index])
              }}
              />
            ))}

              {selectedRestaurant && (
                  <InfoWindow
                  position={{
                    lat:selectedRestaurant["latitude"], 
                    lng:selectedRestaurant["longitude"]
                    }}
                    onCloseClick={()=>{
                        setSelectedRestaurant(null);
                        setSelectedRestaurantName(null);
                        setSelectedRestaurantImage(null)
                        setSelectedRestaurantRating(null)

                    }}
                    >
                      <div>
                        <h2>{selectedRestaurantName}</h2>
                        <img src={selectedRestaurantImage}/>
                        <p>{selectedRestaurantRating}</p>
                      </div></InfoWindow>
              )}
      </GoogleMap>
    )};
                  }
   
  const WrappedMap = withScriptjs(withGoogleMap(Map));


export default App;
