# READ ME: Information on FoodMe, your newest food recommendations application

## [Link to FoodMe Application](https://still-badlands-73263.herokuapp.com/)

This web application has been created and designed to become your new home for recieving food recommendations from your friends. Here you can follow your friends and watch as they post the latest places they have ate and whether they would recommend this resturant to places or no.

## Requirements

1. `npm install`
2. `pip install -r requirements.txt`

## Run Application

1. Run command in terminal (in your project directory): `npm run build`. This will update anything related to your `App.js` file (so `public/index.html`, any CSS you're pulling in, etc).
2. Run command in terminal (in your project directory): `python3 app.py`
3. Preview web page in browser 'localhost:8080/' (or whichever port you're using)

## Deploy to Heroku

1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Routing

1. Install react-router-dom using the command `npm install react-router-dom`. This is used to aid with the navigation of our app
2. This app is using React Router v6

## Linting

1. `npm install eslint-config-airbnb`

### Disabled rules:

1. no-console : This is disabled for sprint 1 where the code is not yet polished but we need to test whether or not front end is connected with back end. This should be removed by sprint 2.
2. react/no-unused-prop-types : This is disabled on some files using propTypes due to false positives (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md)

## Props

1. `npm i -S prop-types`

## Google Maps API

1. run `npm install react-google-maps` to be able to use Google Maps api on the front end
