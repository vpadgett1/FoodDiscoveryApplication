/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import LandingPage from './Pages/LandingPage';
import CreateAccountPage from './Pages/CreateAccountPage';
import DiscoverPage from './Pages/DiscoverPage';
import MapPage from './Pages/MapPage';
import MerchantPage from './Pages/MerchantPage';
import ProfilePage from './Pages/ProfilePage';
import SearchPage from './Pages/SearchPage';
import OnboardingPage from './Pages/OnboardingPage';
import UserPage from './Pages/UserPage';
import RestaurantPage from './Pages/RestaurantPage';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/createAccount" element={<CreateAccountPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/merchant" element={<MerchantPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/userprofile" element={<UserPage />} />
        <Route path="/restaurantprofile" element={<RestaurantPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
