"use strict";

// routing middleware
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = (app, passport) => {
  // home
  app.get('/', (req, res) => {
    res.render('index.html');
  });

  // login page
  app.get('/login', (req,res) => {
    res.send('login.html');
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);

  // show the signup form
  app.get('/signup', (req, res)=> {
    // render the page and pass in any flash data if it exists
    res.send('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);

  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, (req, res) => {
      res.send('profile.html');
  });

  // logout
  app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
  });
}
