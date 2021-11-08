import React from "react";
import './App.css';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import { useState} from 'react';

const args = JSON.parse(document.getElementById("data").text);

function Map(){

    const[selectedRestaurant, setSelectedRestaurant] = useState(null);

    return(
      <GoogleMap 
          defaultZoom={10} 
          defaultCenter={{lat:33.748997, lng:-84.387985}}
      >
          {args.coords.map((coordinates,index)=>(<Marker key={index} 
          position={{
              lat:coordinates["latitude"], 
              lng:coordinates["longitude"]
              }}
              onClick = {()=>{
        
                  setSelectedRestaurant(coordinates)
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

                    }}
                    >
                      <div>Restaurant name</div></InfoWindow>
              )}
      </GoogleMap>
    );
  }

  const WrappedMap = withScriptjs(withGoogleMap(Map));

function App() {

 
    
    return (
      <>
      <h1>My Googl2e Maps</h1>

      <div style={{width:'100vw', height:'100vh'}}>
      <WrappedMap 
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
        loadingElement={<div style={{height:"100%"}}/>}
        containerElement={<div style={{height:"100%"}}/>}
        mapElement={<div style={{height:"100%"}}/>}      
    />
    </div>
      
      </>            
             
    );
  }
  
  export default App;