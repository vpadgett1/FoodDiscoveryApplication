import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import CreateAccountPage from './Pages/CreateAccountPage';
import DiscoverPage from './Pages/DiscoverPage';
import MapPage from './Pages/DiscoverPage';
import MerchantPage from './Pages/MerchantPage';
import ProfilePage from './Pages/ProfilePage';
import SearchPage from './Pages/SearchPage'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage />}></Route>
        <Route path="/createAccount" element={<CreateAccountPage />}></Route>
        <Route path="/discover" element={<DiscoverPage />}></Route>
        <Route path="/search" element={<SearchPage />}></Route>
        <Route path="/map" element={<MapPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/merchant" element={<MerchantPage />}></Route>
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
