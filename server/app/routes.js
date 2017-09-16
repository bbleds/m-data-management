"use strict";

// routing middleware
let isLoggedIn = (req, res, next) => {
  // continue if user is authenticated
  if (req.isAuthenticated()) { return next(); }

  // if they aren't redirect them to the home page
  res.redirect('/');
};

// expose routes to app
module.exports = (app, passport) => {

  // home
  app.get('/', (req, res) => {
    res.render('index.ejs');
  });

  // login page
  app.get('/login', (req,res) => {
    res.render('login.ejs', {message: req.flash('loginMessage')});
  });

  // show the signup form
  app.get('/signup', (req, res)=> {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/login',
    failureRedirect: '/signup',
    failureFlash: true
  }));

// process login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/app', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true
  }));

  // process main app page request
  app.get('/app', isLoggedIn, (req, res) => {
      res.render('app.ejs');
  });

  // logout
  app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
  });
}
