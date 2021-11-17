/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
import {
  render, fireEvent, screen,
} from '@testing-library/react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import ProfilePage from './Pages/ProfilePage';
import UserPage from './Pages/UserPage';

// test that the body of the profile page changes as the user selects different subtabs
test('Profile page subcategories render', () => {
  const page = render(<Router><ProfilePage /></Router>);
  const pagetitle = screen.getByText('Profile Page');
  expect(pagetitle).toBeInTheDocument();
  const leftSideProfilePage = page.container.querySelector('#profilePageLeftSide');
  expect(leftSideProfilePage).toBeInTheDocument();

  // make sure all the buttons exist before pressing them
  const GeneralButton = page.container.querySelector('#GeneralButton');
  const FriendsListButton = page.container.querySelector('#FriendsListButton');
  const FavRestaurantButton = page.container.querySelector('#FavRestaurantButton');
  const YourPostsButton = page.container.querySelector('#YourPostsButton');
  const LogoutButton = page.container.querySelector('#LogoutButton');

  expect(GeneralButton).toBeInTheDocument();
  expect(FriendsListButton).toBeInTheDocument();
  expect(FavRestaurantButton).toBeInTheDocument();
  expect(YourPostsButton).toBeInTheDocument();
  expect(LogoutButton).toBeInTheDocument();

  // when this page loads, only the general subcategory should be showing
  const GeneralSubcategory = page.container.querySelector('#GeneralSubcategory');
  expect(GeneralSubcategory).toBeInTheDocument();

  // press friends list button and check if subcategory loads
  fireEvent.click(FriendsListButton);
  const FriendsListSubcategory = page.container.querySelector('#FriendsListSubcategory');
  expect(FriendsListSubcategory).toBeInTheDocument();

  // press fav restaurant button and check if subcategory loads
  fireEvent.click(FavRestaurantButton);
  const FavRestaurantSubcategory = page.container.querySelector('#FavRestaurantSubcategory');
  expect(FavRestaurantSubcategory).toBeInTheDocument();

  // press your posts button and check if subcategory loads
  fireEvent.click(YourPostsButton);
  const YourPostsSubcategory = page.container.querySelector('#YourPostsSubcategory');
  expect(YourPostsSubcategory).toBeInTheDocument();

  // press general button and check if subcategory loads
  fireEvent.click(GeneralButton);
  expect(GeneralSubcategory).toBeInTheDocument();
});

test('ensure a user page is loading all parts', () => {
  const page = render(<Router><UserPage /></Router>);
  expect(page.container.querySelector('#userPage')).toBeInTheDocument();

  // user info has rendered
  expect(page.container.querySelector('#basicInfo')).toBeInTheDocument();
  expect(page.container.querySelector('#profilepic')).toBeInTheDocument();
  expect(page.container.querySelector('#userID')).toBeInTheDocument();

  // user favorite restaurants has rendered
  expect(page.container.querySelector('#userFavRestaurants')).toBeInTheDocument();

  // user posts has rendered
  expect(page.container.querySelector('#userPosts')).toBeInTheDocument();

  // if user presses the 'add friend' button, it should disable
  const addFriendButton = page.container.querySelector('#addFriendButton');
  fireEvent.click(addFriendButton);
  expect(addFriendButton).toHaveAttribute('disabled');
});
