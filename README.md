# FoodMe Web Application 
## [Click Here to Check it Out!](http://pure-sea-44259.herokuapp.com)

![Screen Shot 2021-12-03 at 4 32 05 PM](https://user-images.githubusercontent.com/56129645/144675471-559a3be3-f35a-43d9-8d79-73e512dd402d.png)


---
## Table of Contents



- [Description](#Description)

- [Motivation](#Motivation)

- [Demonstration](#Demonstration)

- [Walkthrough](#Walkthrough)

- [Class Information](#Class-Information)


---

## Description

This web application has been created and designed to become your new home for recieving food recommendations from your friends. Here you can follow your friends and watch as they post the latest places they have ate and recommend their favorite dishes they'd love you for you to try!

---





## Motivation

The question is: how is FoodMe different from any other food application to search for restaurants. We bring in the social aspect! You can add your friends and see what they’ve been eating and the dishes they recommend. Looking for recommendations from your favorite people, then this is why you need to use FoodMe! 

As food accounts on instagram, facebook, twitter, etc are increasing we thought, why not create an app as a circle for foodies. This application is gathering all the foodies and those interested to become one!

---

## Demonstration

When you first load the page you are sent to the landing page with all our websites information. Then you can press the log in button and login with a google account. Then you select what type of user you are: regular user or merchant user. You then arrive to the discover page. This is where most of the socializing comes in. You will be able to see all of your friends and restaurants post that you have added and followed right after you log in if you have added some before. If not, it will be empty but you can get started ASAP! Then you will have the functionality to post as well as comment on and like the post!

You can go to your profile page and add friends on the friends bar through email. You can also tap on their names and see their posts as well. Additionally, on the profile page you can see your posts (if you made any) and your favorite restaurants information (their address, image, hours, and posts).

As we move down the navigation bar at the top there is the Search Page where you can search for restaurants by name. Once you pick a restaurant you can see all their information and follow them as well!

Next, we have the Maps page. You can enter a zipcode and restaurants nearby will be shown. You want to check for restaurants in another location? No problem, enter the zipcode and find restaurants near there!

Finally, there is an easy functionality to log out and delete your account for convenience if needed!

---
## WalkThrough

https://youtu.be/TR0JpuKY5Ek

---

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

>no-console : This is disabled for sprint 1 where the code is not yet polished but we need to test whether or not front end is connected with back end. This should be removed by sprint 2.

>react/no-unused-prop-types : This is disabled on some files using propTypes due to false positives (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md)

### Linting Rules Disabled for Flask to Run
> pylint: disable=E1101 (no-member)

> pylint: disable=C0413(wrong-import-position)

> pylint: disable=W1508 (invalid-envvar-default)

> pylint: disable=R0903

> pylint: disable=W0603 (global-statement)

>


## Props

1. `npm i -S prop-types`

## Google Maps API

1. run `npm install react-google-maps` to be able to use Google Maps api on the front end

---

## Class Information

CSC 4320 - Software Engineering 

Professor John Martin

Group 2 - FoodMe Application

Due December 3rd, 2021

Fall 2021

---

